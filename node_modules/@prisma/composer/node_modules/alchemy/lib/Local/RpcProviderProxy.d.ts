import * as Config from "effect/Config";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as HttpClient from "effect/unstable/http/HttpClient";
import { AlchemyContext } from "../AlchemyContext.ts";
import type { ProviderService } from "../Provider.ts";
import type { ResourceLike } from "../Resource.ts";
import { Stack } from "../Stack.ts";
declare const RpcProviderProxy_base: Context.ServiceClass<RpcProviderProxy, "alchemy/Local/RpcProviderProxy", {
    readonly get: <R extends ResourceLike>(serverEntryUrl: string, providerName: R["Type"]) => Effect.Effect<ProviderService<R>, never, AlchemyContext | Stack>;
}>;
export declare class RpcProviderProxy extends RpcProviderProxy_base {
}
export declare const SPAWNER_URL_ENV_KEY: "ALCHEMY_RPC_SPAWNER_URL";
export declare const layer: (url: string) => Layer.Layer<RpcProviderProxy, never, HttpClient.HttpClient>;
export declare const fromEnv: () => Layer.Layer<RpcProviderProxy, Config.ConfigError, HttpClient.HttpClient>;
export {};
//# sourceMappingURL=RpcProviderProxy.d.ts.map