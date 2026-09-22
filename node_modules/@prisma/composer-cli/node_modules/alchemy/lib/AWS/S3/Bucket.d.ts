import { Region } from "@distilled.cloud/aws/Region";
import * as s3 from "@distilled.cloud/aws/s3";
import type * as Duration from "effect/Duration";
import type { HttpClient } from "effect/unstable/http";
import * as Provider from "../../Provider.ts";
import { Resource } from "../../Resource.ts";
import type { Credentials } from "../Credentials.ts";
import { AWSEnvironment, type AccountID } from "../Environment.ts";
import type { PolicyStatement } from "../IAM/Policy.ts";
import type { Providers } from "../Providers.ts";
import type { RegionID } from "../Region.ts";
export type BucketName = string;
export type BucketArn = `arn:aws:s3:::${BucketName}`;
/**
 * Server-side encryption configuration for a bucket.
 */
export interface BucketEncryption {
    /**
     * Server-side encryption algorithm to use for the default encryption.
     */
    sseAlgorithm: "AES256" | "aws:kms" | "aws:kms:dsse";
    /**
     * KMS key id (or ARN) to use when `sseAlgorithm` is `aws:kms` or
     * `aws:kms:dsse`. Ignored for `AES256`.
     */
    kmsMasterKeyId?: string;
    /**
     * Whether to use an S3 Bucket Key for SSE-KMS to reduce KMS request costs.
     * @default false
     */
    bucketKeyEnabled?: boolean;
}
/**
 * Public access block settings for a bucket. Each flag defaults to `false`
 * (i.e. the corresponding public access is allowed) when omitted.
 */
export interface BucketPublicAccessBlock {
    /** Block new public ACLs and uploading public objects. */
    blockPublicAcls?: boolean;
    /** Ignore all public ACLs on the bucket and its objects. */
    ignorePublicAcls?: boolean;
    /** Block new bucket policies that grant public access. */
    blockPublicPolicy?: boolean;
    /** Restrict access granted by public bucket policies to AWS principals. */
    restrictPublicBuckets?: boolean;
}
/**
 * Access-logging configuration for a bucket.
 */
export interface BucketLogging {
    /** Bucket that receives the access logs. */
    targetBucket: string;
    /** Key prefix applied to log object names. */
    targetPrefix: string;
    /** Optional grants giving accounts access to the log objects. */
    targetGrants?: s3.TargetGrant[];
    /** Optional log object key format (simple or partitioned prefix). */
    targetObjectKeyFormat?: s3.TargetObjectKeyFormat;
}
/**
 * Static-website hosting configuration for a bucket.
 */
export interface BucketWebsite {
    /** Index document served for directory-style requests. */
    indexDocument?: {
        suffix: string;
    };
    /** Document served for 4XX errors. */
    errorDocument?: {
        key: string;
    };
    /** Redirect every request to another host instead of serving objects. */
    redirectAllRequestsTo?: {
        hostName: string;
        protocol?: "http" | "https";
    };
    /** Routing rules for conditional redirects. */
    routingRules?: s3.RoutingRule[];
}
/**
 * Cross-region (or same-region) replication configuration for a bucket.
 * Requires `versioning: "Enabled"` on the source bucket and an IAM role
 * that S3 can assume to perform the replication.
 */
export interface BucketReplication {
    /** ARN of the IAM role S3 assumes to replicate objects. */
    role: string;
    /** Replication rules describing what to replicate and where. */
    rules: s3.ReplicationRule[];
}
/**
 * Default object-lock retention applied to objects placed in a bucket that
 * was created with `objectLockEnabled: true`.
 */
export interface BucketObjectLockConfiguration {
    /** Retention mode. */
    mode: "GOVERNANCE" | "COMPLIANCE";
    /**
     * Retention period (e.g. `"30 days"` or `Duration.days(30)`; a bare number
     * is milliseconds). Rounded to whole days on the wire. Mutually exclusive
     * with `years`.
     */
    days?: Duration.Input;
    /** Retention period in years (mutually exclusive with `days`). */
    years?: number;
}
export interface BucketProps {
    /**
     * Name of the bucket. If omitted, a unique name will be generated.
     * Must be lowercase and between 3-63 characters.
     */
    bucketName?: string;
    /**
     * Indicates whether this bucket has Object Lock enabled.
     * Once enabled, cannot be disabled.
     */
    objectLockEnabled?: boolean;
    /**
     * Whether to delete all objects when the bucket is destroyed.
     * @default false
     */
    forceDestroy?: boolean;
    /**
     * Tags to apply to the bucket.
     */
    tags?: Record<string, string>;
    /**
     * Object versioning status. `"Enabled"` keeps every version of an object;
     * `"Suspended"` stops accruing new versions (existing versions are kept).
     */
    versioning?: "Enabled" | "Suspended";
    /**
     * MFA-delete status. Rarely used — enabling it requires an MFA serial and
     * the root account, so it cannot be toggled through normal credentials.
     */
    mfaDelete?: "Enabled" | "Disabled";
    /**
     * Default server-side encryption for objects written to the bucket.
     */
    encryption?: BucketEncryption;
    /**
     * Block-public-access settings. Applied before any ACL or policy that
     * grants public access.
     */
    publicAccessBlock?: BucketPublicAccessBlock;
    /**
     * Cross-origin resource sharing (CORS) rules.
     */
    cors?: s3.CORSRule[];
    /**
     * Object lifecycle rules (expiration, transition, abort-incomplete-MPU…).
     */
    lifecycleRules?: s3.LifecycleRule[];
    /**
     * Object ownership control. `"BucketOwnerEnforced"` disables ACLs entirely.
     */
    objectOwnership?: "BucketOwnerPreferred" | "ObjectWriter" | "BucketOwnerEnforced";
    /**
     * Canned ACL to apply. Only valid when object ownership is not
     * `BucketOwnerEnforced`.
     */
    acl?: s3.BucketCannedACL;
    /**
     * Access-logging configuration.
     */
    logging?: BucketLogging;
    /**
     * S3 Transfer Acceleration status.
     */
    transferAcceleration?: "Enabled" | "Suspended";
    /**
     * Who pays for requests and data transfer. `"Requester"` enables
     * requester-pays.
     */
    requestPayer?: "BucketOwner" | "Requester";
    /**
     * Static-website hosting configuration.
     */
    website?: BucketWebsite;
    /**
     * Replication configuration. Requires `versioning: "Enabled"` and an
     * IAM role.
     */
    replication?: BucketReplication;
    /**
     * S3 Intelligent-Tiering configurations (id-keyed).
     */
    intelligentTiering?: s3.IntelligentTieringConfiguration[];
    /**
     * Default object-lock retention. Requires `objectLockEnabled: true`.
     */
    objectLockConfiguration?: BucketObjectLockConfiguration;
    /**
     * Explicit bucket policy as policy statements. Merged with any
     * policy statements contributed via bindings.
     */
    policy?: PolicyStatement[];
}
export interface Bucket extends Resource<"AWS.S3.Bucket", BucketProps, {
    /**
     * Name of the bucket.
     */
    bucketName: BucketName;
    /**
     * ARN of the bucket.
     */
    bucketArn: BucketArn;
    /**
     * Domain name of the bucket (e.g., bucket-name.s3.amazonaws.com).
     */
    bucketDomainName: `${BucketName}.s3.amazonaws.com`;
    /**
     * Regional domain name of the bucket.
     */
    bucketRegionalDomainName: `${BucketName}.s3.${RegionID}.amazonaws.com`;
    /**
     * AWS region where the bucket is located.
     */
    region: RegionID;
    /**
     * AWS account ID that owns the bucket.
     */
    accountId: AccountID;
}, {
    /**
     * Notification configuration for the bucket.
     */
    notificationConfiguration?: s3.NotificationConfiguration;
    /**
     * Policy statements for the bucket.
     */
    policyStatements?: PolicyStatement[];
}, Providers> {
}
/**
 * An S3 bucket for storing objects in AWS.
 *
 * A bucket name is auto-generated from the app, stage, and logical ID unless
 * you provide one explicitly via `bucketName`. Enable `forceDestroy` to allow
 * Alchemy to empty the bucket before deleting it.
 * ### Creating a Bucket
 * **Example:** Basic Bucket
 * ```typescript
 * import * as S3 from "alchemy/AWS/S3";
 *
 * const bucket = yield* S3.Bucket("my-bucket", {});
 * ```
 *
 * **Example:** Bucket with a custom name
 * ```typescript
 * const bucket = yield* S3.Bucket("my-bucket", {
 *   bucketName: "my-company-assets",
 * });
 * ```
 *
 * **Example:** Bucket with force destroy
 * ```typescript
 * const bucket = yield* S3.Bucket("my-bucket", {
 *   forceDestroy: true,
 * });
 * ```
 *
 * ### Configuring a Bucket
 * **Example:** Versioning and encryption
 * ```typescript
 * const bucket = yield* S3.Bucket("my-bucket", {
 *   versioning: "Enabled",
 *   encryption: { sseAlgorithm: "AES256" },
 * });
 * ```
 *
 * **Example:** Block all public access
 * ```typescript
 * const bucket = yield* S3.Bucket("my-bucket", {
 *   publicAccessBlock: {
 *     blockPublicAcls: true,
 *     ignorePublicAcls: true,
 *     blockPublicPolicy: true,
 *     restrictPublicBuckets: true,
 *   },
 * });
 * ```
 *
 * **Example:** CORS and lifecycle rules
 * ```typescript
 * const bucket = yield* S3.Bucket("my-bucket", {
 *   cors: [
 *     {
 *       AllowedMethods: ["GET"],
 *       AllowedOrigins: ["*"],
 *       AllowedHeaders: ["*"],
 *       MaxAgeSeconds: 3000,
 *     },
 *   ],
 *   lifecycleRules: [
 *     {
 *       ID: "expire-old",
 *       Status: "Enabled",
 *       Filter: { Prefix: "logs/" },
 *       Expiration: { Days: 30 },
 *     },
 *   ],
 * });
 * ```
 *
 * **Example:** Static website hosting
 * ```typescript
 * const bucket = yield* S3.Bucket("my-bucket", {
 *   objectOwnership: "BucketOwnerPreferred",
 *   website: {
 *     indexDocument: { suffix: "index.html" },
 *     errorDocument: { key: "error.html" },
 *   },
 * });
 * ```
 *
 * ### Runtime Operations
 * Bind S3 operations in the init phase and use them in runtime
 * handlers. Bindings inject the bucket name and grant scoped IAM
 * permissions automatically.
 *
 * **Example:** Read and write objects
 * ```typescript
 * // init
 * const getObject = yield* S3.GetObject(bucket);
 * const putObject = yield* S3.PutObject(bucket);
 *
 * return {
 *   fetch: Effect.gen(function* () {
 *     // runtime
 *     yield* putObject({
 *       Key: "hello.txt",
 *       Body: "Hello, World!",
 *       ContentType: "text/plain",
 *     });
 *     const response = yield* getObject({ Key: "hello.txt" });
 *     return HttpServerResponse.text("OK");
 *   }),
 * };
 * ```
 *
 * **Example:** Delete an object
 * ```typescript
 * // init
 * const deleteObject = yield* S3.DeleteObject(bucket);
 * ```
 *
 * ### Event Notifications
 * Subscribe to bucket events from the init phase. The subscription
 * and Lambda invoke permissions are created automatically.
 *
 * **Example:** Process object creation events
 * ```typescript
 * // init
 * yield* S3.consumeBucketEvents(bucket, {
 *   events: ["s3:ObjectCreated:*"],
 * }, (stream) =>
 *   stream.pipe(
 *     Stream.runForEach((event) =>
 *       Effect.log(`New object: ${event.key}`),
 *     ),
 *   ),
 * );
 * ```
 *
 * @resource
 */
export declare const Bucket: import("../../Resource.ts").ResourceClass<Bucket>;
export declare const BucketProvider: () => import("effect/Layer").Layer<Provider.Provider<Bucket>, never, AWSEnvironment | Credentials | HttpClient.HttpClient | Region | import("../../Stack.ts").Stack | import("../../Stage.ts").Stage>;
//# sourceMappingURL=Bucket.d.ts.map