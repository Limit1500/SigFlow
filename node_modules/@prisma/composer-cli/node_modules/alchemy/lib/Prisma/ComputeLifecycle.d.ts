import * as Effect from "effect/Effect";
import { type PrismaManagementClient } from "./Client.ts";
import type { Deployment } from "./Types.ts";
export { isConflict } from "./Client.ts";
export interface WaitForDeploymentStatusOptions {
    /**
     * Maximum time to wait for a deployment to reach the requested status.
     */
    timeoutSeconds?: number;
    /**
     * Poll interval used while waiting for Prisma deployment status changes.
     */
    pollIntervalMs?: number;
}
/**
 * Result returned after attempting to stop and delete a Prisma deployment.
 */
export interface DestroyDeploymentResult {
    /**
     * Prisma deployment ID that was targeted.
     */
    deploymentId: string;
    /**
     * Status observed before cleanup started, or undefined if the deployment was gone.
     */
    previousStatus: string | undefined;
    /**
     * True when Alchemy requested a stop before deletion.
     */
    stopped: boolean;
    /**
     * True when the delete call completed or the deployment vanished during cleanup.
     */
    deleted: boolean;
}
/** Result returned after deleting a Prisma App. */
export interface DestroyAppResult {
    /** Prisma App ID that was targeted. */
    appId: string;
    /** True when App deletion completed or the app was already gone. */
    appDeleted: boolean;
}
/**
 * Result returned after deleting Apps under a Prisma project.
 */
export interface DestroyProjectAppsResult {
    /**
     * Prisma project ID that was targeted.
     */
    projectId: string;
    /**
     * App IDs deleted by this cleanup pass.
     */
    deletedAppIds: string[];
    /**
     * True when the project delete call completed or the project vanished.
     */
    projectDeleted: boolean;
}
export declare const waitForDeploymentStatus: (client: PrismaManagementClient, deploymentId: string, targetStatus: "running" | "stopped", options?: WaitForDeploymentStatusOptions | undefined) => Effect.Effect<Deployment, Error, never>;
/**
 * Stops a running or provisioning deployment, then deletes it.
 *
 * Uses the canonical deployment lifecycle routes. Errors include the observed
 * status and exact manual route for cleanup.
 */
export declare const destroyDeployment: (client: PrismaManagementClient, deploymentId: string, options?: WaitForDeploymentStatusOptions) => Effect.Effect<DestroyDeploymentResult, Error, never>;
/**
 * Deletes an App. The canonical App delete endpoint cascades its deployments.
 */
export declare const destroyApp: (client: PrismaManagementClient, appId: string, options?: WaitForDeploymentStatusOptions & {
    keepApp?: boolean;
}) => Effect.Effect<DestroyAppResult, Error, never>;
/**
 * Deletes every App under a project, then deletes the project.
 *
 * Callers can start from the project ID and let Alchemy discover the App IDs.
 */
export declare const destroyProjectApps: (client: PrismaManagementClient, projectId: string, options?: WaitForDeploymentStatusOptions & {
    keepProject?: boolean;
    keepApp?: boolean;
}) => Effect.Effect<DestroyProjectAppsResult, Error, never>;
export declare const toDeploymentUrl: (domain: string | null | undefined) => string | undefined;
//# sourceMappingURL=ComputeLifecycle.d.ts.map