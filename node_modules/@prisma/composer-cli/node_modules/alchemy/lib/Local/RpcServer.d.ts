import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import type * as Scope from "effect/Scope";
import type { HttpClient } from "effect/unstable/http/HttpClient";
import { ArtifactStore } from "../Artifacts.ts";
import type { ProviderService } from "../Provider.ts";
import type { ResourceLike } from "../Resource.ts";
import { PlatformServices } from "../Util/PlatformServices.ts";
import * as RpcSerialization from "./RpcSerialization.ts";
import * as RpcServerEnvironment from "./RpcServerEnvironment.ts";
import { type ServerRpcSession, type ServerWebSocketLike } from "./RpcServerSession.ts";
declare const RpcServer_base: Context.ServiceClass<RpcServer, "alchemy/Local/RpcServer", never>;
/**
 * A service that exposes one or more resource providers over RPC.
 * This returns `never` because it is meant to be used with `Layer.launch` (see {@link launch}).
 */
export declare class RpcServer extends RpcServer_base {
}
/**
 * The provider shape served over RPC. The `mode`/`modes` variant machinery
 * (lazy Layer-built Effects, see `ProviderLayer.dual`) is process-local and
 * cannot cross the RPC boundary — the sidecar serves the concrete provider
 * implementation, never the mode-dispatching wrapper.
 */
export type RpcProviderService<R extends ResourceLike> = Omit<ProviderService<R>, "mode" | "modes">;
/**
 * The RPC API that is implemented by the server and consumed by {@link RpcProviderProxy}.
 */
export interface RpcProxyApi {
    /**
     * Retrieves a provider from the RPC server context.
     * The consumer must unwrap the provider using {@link RpcSerialization.unwrapRpcHandlers} before using it.
     */
    readonly getProvider: <R extends ResourceLike>(type: R["Type"]) => Promise<RpcSerialization.RpcWrapped<RpcProviderService<R>>>;
}
declare const SessionProviders_base: Context.ServiceClass<SessionProviders, "alchemy/Local/SessionProviders", {
    readonly get: (sessionEnv: string | undefined, type: string) => Promise<RpcSerialization.RpcWrapped<RpcProviderService<any>>>;
}>;
/**
 * Per-session provider contexts. One sidecar process serves every stack in
 * a run (the test harness shares a single child across all test files), so
 * the providers layer is built lazily per distinct {@link SessionEnvironment}
 * — each build gets its own MemoMap (a shared one would dedupe the whole
 * providers layer to the first stack's build) and lives in the process's
 * root scope.
 */
export declare class SessionProviders extends SessionProviders_base {
}
/**
 * Launches an RPC server that serves the given providers.
 * Alchemy globals such as `AlchemyContext`, `Profile`, and `Stack` are inherited from the parent via {@link RpcServerEnvironment.fromEnv} and should not be provided manually.
 * `PlatformServices` and `HttpClient` are also included.
 *
 * @example
 * ```ts
 * RpcServer.launch(
 *   Layer.merge(
 *     FunctionProvider,
 *     QueueProvider,
 *   ),
 * );
 * ```
 *
 * @param providers - A layer containing the providers to serve.
 */
export declare const launch: <ROut, E>(providers: Layer.Layer<ROut, E, Scope.Scope | RpcServerEnvironment.RpcEnvironmentServices | PlatformServices | HttpClient | ArtifactStore>) => void;
/**
 * Constructs an `RpcServer` layer using the given server implementation.
 * @param serve - A function that spawns a websocket server and returns its URL.
 * @returns An `RpcServer` layer.
 */
export declare const layerServer: (serve: (handlers: {
    /**
     * Creates a new RPC session over the given websocket. `sessionEnv` is
     * the raw {@link SessionEnvironment} JSON from the websocket URL's
     * `SESSION_ENV_PARAM` query parameter, when the client sent one.
     */
    createRpcSession: (ws: ServerWebSocketLike, sessionEnv?: string) => ServerRpcSession<RpcProxyApi>;
    /** Called when the parent connection, indicated by the `/parent` path, is established. */
    parentConnected: () => void;
    /** Called when the parent disconnects. The server will shut down when this is called. */
    parentDisconnected: () => void;
}) => Effect.Effect<{
    readonly url: string;
}, never, Scope.Scope>) => Layer.Layer<RpcServer, import("effect/Cause").TimeoutError, SessionProviders>;
export {};
//# sourceMappingURL=RpcServer.d.ts.map