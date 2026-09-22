import * as Effect from "effect/Effect";
import { type PrismaManagementClient } from "../Client.ts";
export declare const startDeploymentIdempotent: (client: PrismaManagementClient, deploymentId: string) => Effect.Effect<import("../Types.ts").StartDeploymentResult | undefined, unknown, never>;
export declare const stopDeploymentIdempotent: (client: PrismaManagementClient, deploymentId: string) => Effect.Effect<void, unknown, never>;
//# sourceMappingURL=DeploymentActions.d.ts.map