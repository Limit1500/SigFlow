import * as ag from "@distilled.cloud/aws/api-gateway";
import * as Effect from "effect/Effect";
/**
 * Wraps an API Gateway mutation so that recoverable 4xx responses are
 * retried with backoff:
 *
 * - `BadRequestException` with `apiStatus is UPDATING` or
 *   `already an update in progress` (transient, clears in seconds)
 *
 * Drop-in usage:
 *
 * ```ts
 * yield* retryOnApiStatusUpdating(
 *   ag.createDeployment({ ... }),
 * );
 * ```
 */
export declare const retryOnApiStatusUpdating: <A, E, R>(effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>;
declare const RestApiStillExists_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").VoidIfEmpty<{ readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }>) => import("effect/Cause").YieldableError & {
    readonly _tag: "RestApiStillExists";
} & Readonly<A>;
declare class RestApiStillExists extends RestApiStillExists_base<{
    readonly restApiId: string;
}> {
}
/**
 * Idempotently delete a REST API and observe it disappear.
 *
 * Every provider/test cleanup path uses this helper so nuke, normal destroy,
 * and interrupted-run reapers all share the same bounded throttle handling.
 */
export declare const deleteRestApiAndWait: (restApiId: string) => Effect.Effect<void, ag.BadRequestException | ag.ConflictException | RestApiStillExists | ag.TooManyRequestsException | ag.UnauthorizedException | import("@distilled.cloud/aws/Errors").CommonErrors, import("@distilled.cloud/aws/Credentials").Credentials | import("effect/unstable/http/HttpClient").HttpClient>;
export declare const restApiArn: (region: string, restApiId: string) => string;
export declare const stageArn: (region: string, restApiId: string, stageName: string) => string;
export declare const apiKeyArn: (region: string, apiKeyId: string) => string;
export declare const usagePlanArn: (region: string, usagePlanId: string) => string;
export declare const domainNameArn: (region: string, domainName: string) => string;
export declare const vpcLinkArn: (region: string, vpcLinkId: string) => string;
export declare const syncTags: (args_0: {
    resourceArn: string;
    oldTags: Record<string, string>;
    newTags: Record<string, string>;
}) => Effect.Effect<void, import("@distilled.cloud/aws/Errors").AccessDeniedException | ag.BadRequestException | ag.ConflictException | import("@distilled.cloud/aws/Errors").EndpointError | import("@distilled.cloud/aws/Errors").ExpiredTokenException | import("effect/unstable/http/HttpClientError").HttpClientError | import("@distilled.cloud/aws/Errors").IncompleteSignature | import("@distilled.cloud/aws/Errors").InternalFailure | ag.LimitExceededException | import("@distilled.cloud/aws/Errors").MalformedHttpRequestException | import("@distilled.cloud/aws/Errors").NoMatchingRuleError | import("@distilled.cloud/aws/Errors").NotAuthorized | ag.NotFoundException | import("@distilled.cloud/aws/Errors").OperationAborted | import("@distilled.cloud/aws/Errors").OptInRequired | import("@distilled.cloud/aws/Errors").RequestAbortedException | import("@distilled.cloud/aws/Errors").RequestEntityTooLargeException | import("@distilled.cloud/aws/Errors").RequestExpired | import("@distilled.cloud/aws/Errors").RequestTimeoutException | import("@distilled.cloud/aws/Errors").ServiceUnavailable | import("@distilled.cloud/aws/Errors").ThrottlingException | ag.TooManyRequestsException | ag.UnauthorizedException | import("@distilled.cloud/aws/Errors").UnknownAwsError | import("@distilled.cloud/aws/Errors").UnknownOperationException | import("@distilled.cloud/aws/Errors").UnrecognizedClientException | import("@distilled.cloud/aws/Errors").ValidationError | import("@distilled.cloud/aws/Errors").ValidationException, import("@distilled.cloud/aws/Credentials").Credentials | import("effect/unstable/http/HttpClient").HttpClient>;
export {};
//# sourceMappingURL=common.d.ts.map