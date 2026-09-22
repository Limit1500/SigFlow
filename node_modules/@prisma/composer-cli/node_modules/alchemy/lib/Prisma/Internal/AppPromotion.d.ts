import * as Effect from "effect/Effect";
import type { PrismaManagementClient } from "../Client.ts";
import type { App, PromoteAppResult } from "../Types.ts";
export interface AppDeploymentTargetObservationOptions {
    readonly timeoutSeconds?: number;
    readonly pollIntervalMs?: number;
}
export declare const waitForAppDeploymentTarget: (client: PrismaManagementClient, appId: string, deploymentId: string, options?: AppDeploymentTargetObservationOptions | undefined) => Effect.Effect<App, Error, never>;
/**
 * Promote an App and recover response loss by observing the canonical App.
 * Every successful mutation is followed by bounded observation of the App
 * row before callers may probe stable readiness or delete another deployment.
 * If the promotion response is lost, the canonical rollback primitive heals
 * an already-flipped Foundry endpoint or safely completes the target
 * promotion. Any non-converged result is ambiguous and must never trigger
 * target deletion.
 */
export declare const promoteAppObserved: (client: PrismaManagementClient, appId: string, deploymentId: string, options?: AppDeploymentTargetObservationOptions | undefined) => Effect.Effect<PromoteAppResult, Error, never>;
//# sourceMappingURL=AppPromotion.d.ts.map