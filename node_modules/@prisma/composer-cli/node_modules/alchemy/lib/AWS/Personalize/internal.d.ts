import * as personalize from "@distilled.cloud/aws/personalize";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
/**
 * Unwrap a Personalize `SensitiveString` (decoded as `Redacted`) to its plain
 * string value. `String(redacted)` would yield `"<redacted>"`, not the value.
 */
export declare const unredact: (value: string | Redacted.Redacted<string>) => string;
/**
 * Coerce a Personalize wire tag list (`{ tagKey, tagValue }[]`, values decode
 * as `Redacted`) into a plain `Record<string, string>`.
 */
export declare const toTagRecord: (tags: personalize.Tag[] | undefined) => Record<string, string>;
/**
 * Read the observed tags of a Personalize resource by ARN. Tag reads are
 * best-effort — a failure (e.g. a race with deletion) reports no tags.
 */
export declare const readPersonalizeTags: (arn: string) => Effect.Effect<Record<string, string>, never, import("@distilled.cloud/aws/Credentials").Credentials | import("effect/unstable/http/HttpClient").HttpClient>;
/**
 * Sync tags on a Personalize resource: diff the OBSERVED cloud tags against
 * the desired set and apply only the delta.
 */
export declare const syncPersonalizeTags: (arn: string, desiredTags: Record<string, string>) => Effect.Effect<void, import("@distilled.cloud/aws/Errors").AccessDeniedException | import("@distilled.cloud/aws/Errors").EndpointError | import("@distilled.cloud/aws/Errors").ExpiredTokenException | import("effect/unstable/http/HttpClientError").HttpClientError | import("@distilled.cloud/aws/Errors").IncompleteSignature | import("@distilled.cloud/aws/Errors").InternalFailure | personalize.InvalidInputException | personalize.LimitExceededException | import("@distilled.cloud/aws/Errors").MalformedHttpRequestException | import("@distilled.cloud/aws/Errors").NoMatchingRuleError | import("@distilled.cloud/aws/Errors").NotAuthorized | import("@distilled.cloud/aws/Errors").OperationAborted | import("@distilled.cloud/aws/Errors").OptInRequired | import("@distilled.cloud/aws/Errors").RequestAbortedException | import("@distilled.cloud/aws/Errors").RequestEntityTooLargeException | import("@distilled.cloud/aws/Errors").RequestExpired | import("@distilled.cloud/aws/Errors").RequestTimeoutException | personalize.ResourceInUseException | personalize.ResourceNotFoundException | import("@distilled.cloud/aws/Errors").ServiceUnavailable | import("@distilled.cloud/aws/Errors").ThrottlingException | personalize.TooManyTagKeysException | personalize.TooManyTagsException | import("@distilled.cloud/aws/Errors").UnknownAwsError | import("@distilled.cloud/aws/Errors").UnknownOperationException | import("@distilled.cloud/aws/Errors").UnrecognizedClientException | import("@distilled.cloud/aws/Errors").ValidationError | import("@distilled.cloud/aws/Errors").ValidationException, import("@distilled.cloud/aws/Credentials").Credentials | import("effect/unstable/http/HttpClient").HttpClient>;
//# sourceMappingURL=internal.d.ts.map