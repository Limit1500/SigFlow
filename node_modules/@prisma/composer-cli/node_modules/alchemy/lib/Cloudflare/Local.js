import * as Layer from "effect/Layer";
import { DockerLive } from "../Docker/Docker.js";
import * as RpcServer from "../Local/RpcServer.js";
import { CloudflareAuth } from "./Auth/AuthProvider.js";
import * as CloudflareEnvironment from "./CloudflareEnvironment.js";
import { LocalContainerProvider } from "./Containers/LocalContainerProvider.js";
import * as Credentials from "./Credentials.js";
import { ProviderLocal as D1ProviderLocal } from "./D1/Database.js";
import { localRuntimeServices } from "./LocalRuntime.js";
import { ProviderLocal } from "./Queues/Queue.js";
import { ConsumerProviderLocal } from "./Queues/Consumer.js";
import { SecretProviderLocal } from "./SecretsStore/Secret.js";
import { LocalWorkerProvider } from "./Workers/LocalWorkerProvider.js";
const cloudflareServices = Layer.provide(Layer.merge(Credentials.fromAuthProvider(), CloudflareEnvironment.fromProfile()), CloudflareAuth);
Layer.mergeAll(LocalWorkerProvider(), LocalContainerProvider(), ProviderLocal(), ConsumerProviderLocal(), D1ProviderLocal(), SecretProviderLocal()).pipe(Layer.provide(localRuntimeServices()), Layer.provide(cloudflareServices), Layer.provide(DockerLive), RpcServer.launch);
//# sourceMappingURL=Local.js.map