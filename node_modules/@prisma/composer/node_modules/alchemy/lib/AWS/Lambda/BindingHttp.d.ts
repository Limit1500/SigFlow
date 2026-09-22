import * as Effect from "effect/Effect";
import type { Output as OutputType } from "../../Output.ts";
import type { Function } from "./Function.ts";
/**
 * Shared scaffolding for AWS Lambda control/data-plane HTTP bindings.
 *
 * NOT exported from `index.ts` — every near-identical `{Op}Http.ts` in this
 * service is a thin `Layer.effect(Cap, make…HttpBinding({ … }))` over one of
 * the builders below. Everything except the operation, the IAM action list,
 * and the granted ARNs is boilerplate. Genuinely-different bindings (the
 * MicroVM family with its cross-cloud credential scaffolding in
 * `MicrovmBinding.ts`) stay bespoke.
 */
/**
 * Build the impl Effect for a function-scoped operation (`Invoke`,
 * `GetFunction`, `InvokeWithResponseStream`): the runtime callable injects
 * the bound {@link Function}'s ARN as `FunctionName` and the deploy-time
 * half grants `actions` on `resources` (default: the function ARN).
 */
export declare const makeFunctionHttpBinding: <I extends {
    FunctionName?: string;
}, A, E, R>(options: {
    /** Fully-qualified binding tag, e.g. `AWS.Lambda.GetFunction`. */
    tag: string;
    /** The distilled operation; `FunctionName` is injected from the function. */
    operation: Effect.Effect<(input: I) => Effect.Effect<A, E>, never, R>;
    /** IAM actions granted on `resources`. */
    actions: readonly string[];
    /** ARNs the actions are granted on. @default the function ARN */
    resources?: (func: Function) => (string | OutputType<string>)[];
}) => Effect.Effect<(func: Function) => Effect.Effect<(request?: Omit<I, "FunctionName"> | undefined) => Effect.Effect<A, E, never>, never, never>, never, R>;
/**
 * Build the impl Effect for an account-level operation
 * (`GetAccountSettings`, `ListFunctions`): the runtime callable passes the
 * caller's request through unchanged and the deploy-time half grants
 * `actions` on `*` (these Lambda actions do not support resource-level
 * permissions).
 */
export declare const makeLambdaAccountHttpBinding: <I, A, E, R>(options: {
    /** Fully-qualified binding tag, e.g. `AWS.Lambda.ListFunctions`. */
    tag: string;
    /** The distilled operation, invoked with the caller's request as-is. */
    operation: Effect.Effect<(input: I) => Effect.Effect<A, E>, never, R>;
    /** IAM actions granted on `*`. */
    actions: readonly string[];
}) => Effect.Effect<() => Effect.Effect<(request?: I | undefined) => Effect.Effect<A, E, never>, never, never>, never, R>;
//# sourceMappingURL=BindingHttp.d.ts.map