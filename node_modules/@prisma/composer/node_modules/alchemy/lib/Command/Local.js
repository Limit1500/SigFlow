import * as Layer from "effect/Layer";
import * as RpcServer from "../Local/RpcServer.js";
import { CommandExecutorLive } from "./Command.js";
import { DevProviderLocal } from "./Dev.js";
DevProviderLocal().pipe(Layer.provide(CommandExecutorLive()), RpcServer.launch);
//# sourceMappingURL=Local.js.map