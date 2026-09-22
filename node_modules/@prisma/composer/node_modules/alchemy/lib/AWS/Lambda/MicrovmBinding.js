import * as Endpoint from "@distilled.cloud/aws/Endpoint";
import { Region } from "@distilled.cloud/aws/Region";
import * as Effect from "effect/Effect";
import * as HashMap from "effect/HashMap";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Redacted from "effect/Redacted";
import * as Ref from "effect/Ref";
import * as Scope from "effect/Scope";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import { AlchemyContext } from "../../AlchemyContext.js";
import * as Binding from "../../Binding.js";
import * as Output from "../../Output.js";
import { DEFAULT_LOCAL_ENDPOINT } from "../AuthProvider.js";
import { Credentials, makeAssumeRoleResolver } from "../Credentials.js";
import { AccessKey } from "../IAM/AccessKey.js";
import { Role } from "../IAM/Role.js";
import { User } from "../IAM/User.js";
import { isBindingHost } from "./Function.js";
// We resolve the host (Worker vs Lambda) at both deploy AND runtime to decide
// how credentials are supplied. A Cloudflare Worker is structurally tagged with
// this Type id; a hard import of the Cloudflare module graph is avoided.
const WORKER_TYPE_ID = "Cloudflare.Worker";
const isWorkerHost = (host) => host.Type === WORKER_TYPE_ID;
/** Region segment of an AWS ARN (`arn:partition:service:<region>:...`). */
const regionFromArn = (arn) => arn.split(":")[3] ?? "us-east-1";
// ---------------------------------------------------------------------------
// Per-scope singleton store. A Worker reaching AWS must create exactly ONE IAM
// User + AccessKey + Role (and one assumed-role credential cache) regardless of
// how many of the ~16 MicroVM `*Http` bindings it uses. A
// `WeakMap<Scope, Ref<HashMap>>` memoizes any keyed effect for the lifetime of
// the surrounding scope (the deploy plan, or the worker's runtime init scope),
// so every binding shares the same resources and the same credentials.
// ---------------------------------------------------------------------------
const perScope = new WeakMap();
// Fallback when no `Scope` is in context — notably a deployed Worker's init
// phase, which runs outside any scope. Process-wide is an acceptable singleton
// granularity there (one isolate == one logical host).
const globalStore = new Map();
const storeRef = Effect.gen(function* () {
    const scope = yield* Effect.serviceOption(Scope.Scope);
    if (Option.isNone(scope))
        return undefined;
    let ref = perScope.get(scope.value);
    if (!ref) {
        ref = yield* Ref.make(HashMap.empty());
        perScope.set(scope.value, ref);
    }
    return ref;
});
const memoize = (key, build) => Effect.gen(function* () {
    const ref = yield* storeRef;
    if (ref) {
        const existing = HashMap.get(yield* Ref.get(ref), key);
        if (Option.isSome(existing))
            return existing.value;
        const value = yield* build;
        yield* Ref.update(ref, HashMap.set(key, value));
        return value;
    }
    if (globalStore.has(key))
        return globalStore.get(key);
    const value = yield* build;
    globalStore.set(key, value);
    return value;
});
/**
 * Derive the `microvm:*` instance-ARN glob from an image ARN by swapping the
 * `microvm-image:<name>` resource segment for `microvm:*`, keeping the same
 * `arn:<partition>:lambda:<region>:<account>:` prefix.
 */
const microvmGlob = (imageArn) => `${imageArn.replace(/:microvm-image[:/].*$/, "")}:microvm:*`;
/**
 * Derive the network-connector ARN globs from an image ARN: the account's own
 * connectors (`arn:<partition>:lambda:<region>:<account>:network-connector:*`)
 * and the AWS-managed connectors (same prefix but account `aws`).
 */
const networkConnectorGlobs = (imageArn) => {
    // arn:<partition>:lambda:<region>:<account>
    const prefix = imageArn.replace(/:microvm-image[:/].*$/, "");
    // arn:<partition>:lambda:<region>
    const regionPrefix = prefix.replace(/:[^:]*$/, "");
    return [
        `${prefix}:network-connector:*`,
        `${regionPrefix}:aws:network-connector:*`,
    ];
};
/** The IAM policy statements an image-scoped MicroVM operation requires. */
const imagePolicyStatements = (image, options) => [
    {
        Effect: "Allow",
        Action: options.actions,
        Resource: options.scope === "account"
            ? // Collection-level list actions only authorize on `*`.
                ["*"]
            : options.scope === "microvm"
                ? [
                    // Instance ops (GetMicrovm, TerminateMicrovm, CreateAuthToken,
                    // …) are authorized by AWS against the image ARN as well as the
                    // instance ARN, so grant both: the exact image and the
                    // `microvm:*` instance glob derived from it.
                    Output.interpolate `${image.imageArn}`,
                    image.imageArn.pipe(Output.map(microvmGlob)),
                ]
                : [Output.interpolate `${image.imageArn}`],
    },
    ...(options.passNetworkConnector
        ? [
            {
                Effect: "Allow",
                Action: ["lambda:PassNetworkConnector"],
                Resource: [
                    image.imageArn.pipe(Output.map((a) => networkConnectorGlobs(a)[0])),
                    image.imageArn.pipe(Output.map((a) => networkConnectorGlobs(a)[1])),
                ],
            },
        ]
        : []),
];
/**
 * Create — once per scope, per host worker — the IAM identity a Cloudflare
 * Worker uses to reach AWS:
 *   - an IAM **User** allowed to assume any role that trusts it,
 *   - a long-lived **AccessKey** for that user,
 *   - a least-privilege **Role** the user assumes (trusts only this user;
 *     MicroVM permissions accumulate on it via `role.bind`).
 *
 * The user's access key + the role ARN are read as {@link Output} *accessors*
 * (`yield* accessKey.accessKeyId`, …) — yielding an attribute both registers
 * the binding on the worker (deploy) and returns an `Effect` that reads it at
 * runtime. At runtime those accessors feed an assume-role credentials layer
 * (single-flight, expiry-aware) built once and shared across all bindings.
 */
const ensureWorkerAwsAccess = (host) => memoize(`microvm-aws:${host.LogicalId}`, Effect.gen(function* () {
    const id = host.LogicalId;
    // The user may assume any role that trusts it (Resource `*`); the role's
    // trust policy is what actually restricts assumption to this user, which
    // avoids a User↔Role ARN dependency cycle while staying safe.
    const user = yield* User(`${id}-microvm-user`, {
        inlinePolicies: {
            "assume-microvm-role": {
                Version: "2012-10-17",
                Statement: [
                    { Effect: "Allow", Action: ["sts:AssumeRole"], Resource: ["*"] },
                ],
            },
        },
    });
    const accessKey = yield* AccessKey(`${id}-microvm-key`, {
        userName: user.userName,
    });
    const role = yield* Role(`${id}-microvm-role`, {
        assumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: { AWS: user.userArn },
                    Action: ["sts:AssumeRole"],
                },
            ],
        },
    });
    // Local dev: the AWS side of this binding runs on the emulator, so the
    // worker's STS AssumeRole and MicroVM calls must too. Bake the
    // LocalStack-standard `AWS_ENDPOINT_URL` into the worker env — the same
    // override the emulator injects into Lambda containers, picked up at
    // runtime by `Endpoint.fromEnv()` in `withRuntimeCredentials`. Deploy
    // runs (dev=false) bind nothing, so live behavior is unchanged.
    if (!globalThis.__ALCHEMY_RUNTIME__) {
        const context = yield* Effect.serviceOption(AlchemyContext);
        if (Option.isSome(context) && context.value.dev) {
            yield* host.bind `${id}-microvm-endpoint`({
                bindings: [
                    {
                        type: "plain_text",
                        name: "AWS_ENDPOINT_URL",
                        text: DEFAULT_LOCAL_ENDPOINT,
                    },
                ],
            });
        }
    }
    // Bind the user's credentials + role ARN onto the worker via accessors:
    // at deploy this registers the env (the secret as `secret_text`); at
    // runtime these resolve to the deployed values.
    const accessKeyId = yield* accessKey.accessKeyId;
    const secretAccessKey = yield* accessKey.secretAccessKey;
    const roleArn = yield* role.roleArn;
    // The long-lived IAM-user credentials that sign `AssumeRole`. Read lazily
    // from the worker environment on each refresh (NOT captured eagerly, so
    // this is valid at deploy time where the env isn't populated yet).
    const base = Layer.succeed(Credentials, Effect.gen(function* () {
        const id = yield* accessKeyId;
        const secret = yield* secretAccessKey;
        return {
            accessKeyId: Redacted.make(id),
            secretAccessKey: secret
                ? Redacted.isRedacted(secret)
                    ? secret
                    : Redacted.make(secret)
                : Redacted.make(""),
            sessionToken: undefined,
            // STS AssumeRole is signed against a fixed global endpoint region;
            // per-request operations provide their own image-derived Region.
            region: "us-east-1",
        };
    }));
    // Build the single-flight, expiry-aware assume-role cache ONCE. STS is
    // global, so the endpoint region is a fixed default; the per-request
    // operation provides its own image-derived `Region` separately.
    const credentials = yield* makeAssumeRoleResolver({
        roleArn,
        base,
        region: "us-east-1",
    });
    return { role, credentials };
}));
/**
 * Run a MicroVM operation with host-appropriate AWS credentials:
 * - Lambda Function host → the execution-role credentials already in the
 *   ambient environment (nothing to provide).
 * - Cloudflare Worker host → the assumed-role credentials, plus a `Region`
 *   derived from the image ARN and an `HttpClient`.
 */
const withRuntimeCredentials = (access, region, eff) => access
    ? Effect.gen(function* () {
        const reg = yield* region;
        // Provide the SHARED cached resolver built once in
        // `ensureWorkerAwsAccess` — NOT a fresh assume-role layer per request —
        // so the assumed-role credentials are reused (and only refreshed near
        // expiry) instead of re-assuming the role on every call.
        return yield* eff.pipe(Effect.provide(Layer.succeed(Credentials, access.credentials).pipe(Layer.provideMerge(Layer.succeed(Region, Effect.succeed(reg))), 
        // `AWS_ENDPOINT_URL` from the worker env (bound under local
        // dev by `ensureWorkerAwsAccess`); resolves undefined when
        // unset, so live workers keep the real AWS endpoints. The
        // shared assume-role resolver also reads this ambient
        // Endpoint for its STS call.
        Layer.provideMerge(Endpoint.fromEnv()), Layer.provideMerge(FetchHttpClient.layer))));
    })
    : eff;
/**
 * Build a MicroVM runtime binding bound to a {@link MicrovmImage}. At deploy it
 * registers the IAM grant on the host — the Lambda execution role directly, or
 * (for a Cloudflare Worker) a dedicated assume-role Role whose credentials are
 * bound onto the worker. At runtime it calls the distilled operation with the
 * host-appropriate credentials.
 */
export const makeImageBinding = (options) => Layer.effect(options.binding, Effect.gen(function* () {
    const run = yield* options.operation;
    return Effect.fn(function* (image) {
        const host = yield* Binding.Host;
        const statements = imagePolicyStatements(image, options);
        const label = `Allow(${host?.LogicalId}, AWS.Lambda.${options.name}(${image.LogicalId}))`;
        // Accessors (registered on the host at deploy, resolved at runtime).
        const imageArn = yield* image.imageArn;
        // Region is derived from the resolved image ARN — via `Effect.map` of
        // the accessor, NOT a second Output binding (whose env key would embed
        // the mapper's source text and is brittle).
        const region = Effect.map(imageArn, regionFromArn);
        let access;
        if (isBindingHost(host)) {
            if (!globalThis.__ALCHEMY_RUNTIME__) {
                yield* host.bind `${label}`({ policyStatements: statements });
            }
        }
        else if (host !== undefined && isWorkerHost(host)) {
            access = yield* ensureWorkerAwsAccess(host);
            if (!globalThis.__ALCHEMY_RUNTIME__) {
                yield* access.role.bind `${label}`({ policyStatements: statements });
            }
        }
        return Effect.fn(`AWS.Lambda.${options.name}(${image.LogicalId})`)(function* (request) {
            return yield* withRuntimeCredentials(access, region, run(options.injectImageIdentifier
                ? { ...request, imageIdentifier: yield* imageArn }
                : request));
        });
    });
}));
/**
 * Build an account-scoped MicroVM binding (no resource argument), e.g. for
 * listing AWS-managed base images. IAM `Resource` is `["*"]`.
 */
export const makeAccountBinding = (options) => Layer.effect(options.binding, Effect.gen(function* () {
    const run = yield* options.operation;
    return Effect.fn(function* () {
        const host = yield* Binding.Host;
        const label = `Allow(${host?.LogicalId}, AWS.Lambda.${options.name}())`;
        const statements = [
            { Effect: "Allow", Action: options.actions, Resource: ["*"] },
        ];
        let access;
        if (isBindingHost(host)) {
            if (!globalThis.__ALCHEMY_RUNTIME__) {
                yield* host.bind `${label}`({ policyStatements: statements });
            }
        }
        else if (host !== undefined && isWorkerHost(host)) {
            access = yield* ensureWorkerAwsAccess(host);
            if (!globalThis.__ALCHEMY_RUNTIME__) {
                yield* access.role.bind `${label}`({ policyStatements: statements });
            }
        }
        return Effect.fn(`AWS.Lambda.${options.name}()`)(function* (request) {
            // Account-level operations are global; default the STS/endpoint region.
            const region = Effect.succeed("us-east-1");
            return yield* withRuntimeCredentials(access, region, run(request));
        });
    });
}));
//# sourceMappingURL=MicrovmBinding.js.map