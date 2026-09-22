import type { PrismaManagementClient } from "../Client.ts";
export declare const observeDeployment: (client: PrismaManagementClient, deploymentId: string) => import("effect/Effect").Effect<import("../Types.ts").Deployment, import("../Client.ts").PrismaApiDecodeError | import("../Client.ts").PrismaApiError, never>;
//# sourceMappingURL=DeploymentObserve.d.ts.map