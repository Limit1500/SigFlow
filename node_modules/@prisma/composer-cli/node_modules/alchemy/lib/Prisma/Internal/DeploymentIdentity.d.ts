import * as Effect from "effect/Effect";
import type { PrismaManagementClient } from "../Client.ts";
/** Prove that a deployment belongs to an App before mutating or deleting it. */
export declare const ensureDeploymentMembership: (client: PrismaManagementClient, appId: string, deployment: {
    id: string;
    foundryVersionId: string;
}, knownLatestDeploymentId?: string | null | undefined) => Effect.Effect<undefined, Error, never>;
//# sourceMappingURL=DeploymentIdentity.d.ts.map