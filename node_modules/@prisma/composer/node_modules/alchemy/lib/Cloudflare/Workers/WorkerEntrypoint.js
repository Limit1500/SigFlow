const WorkerEntrypointTypeId = "Cloudflare.WorkerEntrypoint";
/**
 * Bind a specific `WorkerEntrypoint` class exported by another Worker.
 *
 * Binding a Worker directly in `env` (`env: { TARGET: worker }`) targets
 * its *default* entrypoint. A Worker that exposes additional
 * `WorkerEntrypoint` classes — workerd treats every named class export of
 * an entry module as an entrypoint — is bound with `WorkerEntrypoint`,
 * which selects the class by name and can deliver `ctx.props` to it.
 *
 *
 * ### Binding a Named Entrypoint
 * The target Worker exports a `WorkerEntrypoint` class alongside its
 * default handler; the consumer selects it by name. `InferEnv` types the
 * binding as a `Fetcher` service stub — RPC methods are called on it
 * directly.
 *
 * **Example:** Bind and call a named entrypoint
 * ```typescript
 * // target/src/worker.ts
 * import { WorkerEntrypoint } from "cloudflare:workers";
 *
 * export class Api extends WorkerEntrypoint {
 *   async greet(name: string): Promise<string> {
 *     return `hello ${name}`;
 *   }
 * }
 *
 * export default { async fetch() { return new Response("ok"); } };
 * ```
 *
 * ```typescript
 * // alchemy.run.ts
 * const target = yield* Cloudflare.Worker("Target", { main: "./target/src/worker.ts" });
 *
 * const caller = yield* Cloudflare.Worker("Caller", {
 *   main: "./caller/src/worker.ts",
 *   env: {
 *     API: Cloudflare.WorkerEntrypoint(target, "Api"),
 *   },
 * });
 * ```
 *
 * ### Delivering ctx.props
 * The options form attaches properties the target reads from
 * `this.ctx.props` — workerd's per-binding configuration channel. `Output`
 * values resolve at deploy time.
 *
 * **Example:** Entrypoint binding with props
 * ```typescript
 * env: {
 *   VENDOR: Cloudflare.WorkerEntrypoint(vendorWorker, {
 *     entrypoint: "Vendor",
 *     props: { baseUrl: site.url },
 *   }),
 * }
 * ```
 *
 * @resource
 * @product Workers
 * @category Workers & Compute
 */
export const WorkerEntrypoint = (worker, entrypointOrOptions) => {
    const options = typeof entrypointOrOptions === "string"
        ? { entrypoint: entrypointOrOptions }
        : (entrypointOrOptions ?? {});
    return {
        kind: WorkerEntrypointTypeId,
        worker,
        entrypoint: options.entrypoint,
        props: options.props,
    };
};
/** Structural guard for {@link WorkerEntrypointBinding} `env` values. */
export const isWorkerEntrypoint = (value) => typeof value === "object" &&
    value !== null &&
    value.kind === WorkerEntrypointTypeId;
//# sourceMappingURL=WorkerEntrypoint.js.map