import type * as Duration from "effect/Duration";
import * as Redacted from "effect/Redacted";
import * as Provider from "../../Provider.ts";
import { Resource } from "../../Resource.ts";
import type { Providers } from "../Providers.ts";
export interface DBInstanceProps {
    /**
     * Instance identifier. If omitted, Alchemy generates one.
     */
    dbInstanceIdentifier?: string;
    /**
     * Aurora cluster the instance belongs to. When set, the instance is a
     * cluster member and most storage/backup props are managed by the cluster.
     * Replacing this forces a new instance.
     */
    dbClusterIdentifier?: string;
    /**
     * Instance class such as `db.serverless` or `db.t3.micro`.
     */
    dbInstanceClass: string;
    /**
     * Database engine, e.g. `mysql`, `postgres`, `aurora-postgresql`.
     * Changing the engine forces replacement.
     */
    engine: string;
    /**
     * Optional engine version. Changed in place via `modifyDBInstance`.
     */
    engineVersion?: string;
    /**
     * Standalone (non-Aurora) database name created with the instance.
     * Immutable — forces replacement.
     */
    dbName?: string;
    /**
     * Allocated storage in GiB (standalone instances). In-place modify.
     * @default undefined
     */
    allocatedStorage?: number;
    /**
     * Upper limit (GiB) for storage autoscaling. In-place modify.
     */
    maxAllocatedStorage?: number;
    /**
     * Storage type: `gp2` | `gp3` | `io1` | `io2` | `standard`. In-place modify.
     */
    storageType?: string;
    /**
     * Provisioned IOPS (io1/io2/gp3). In-place modify (rate-limited by AWS).
     */
    iops?: number;
    /**
     * Storage throughput in MiBps (gp3). In-place modify.
     */
    storageThroughput?: number;
    /**
     * Master username (standalone instances). Immutable — forces replacement.
     */
    masterUsername?: string;
    /**
     * Master password (standalone instances). In-place modify.
     */
    masterUserPassword?: Redacted.Redacted<string>;
    /**
     * Let RDS manage the master user password in Secrets Manager.
     */
    manageMasterUserPassword?: boolean;
    /**
     * Rotate the managed master user password on the next reconcile.
     */
    rotateMasterUserPassword?: boolean;
    /**
     * KMS key used to encrypt the managed master user secret.
     */
    masterUserSecretKmsKeyId?: string;
    /**
     * Listener port. In-place modify (sent as `DBPortNumber` on modify).
     */
    port?: number;
    /**
     * Multi-AZ deployment (standalone instances). In-place modify.
     */
    multiAZ?: boolean;
    /**
     * Availability zone (standalone single-AZ). Immutable — forces replacement.
     */
    availabilityZone?: string;
    /**
     * Backup retention period (e.g. `"7 days"` or `Duration.days(7)`).
     * Sent to the API in whole days. In-place modify.
     */
    backupRetentionPeriod?: Duration.Input;
    /**
     * Daily backup window, e.g. `07:00-09:00`. In-place modify.
     */
    preferredBackupWindow?: string;
    /**
     * Weekly maintenance window, e.g. `Mon:00:00-Mon:03:00`. In-place modify.
     */
    preferredMaintenanceWindow?: string;
    /**
     * Optional DB subnet group. Effectively immutable for an in-VPC instance.
     */
    dbSubnetGroupName?: string;
    /**
     * Optional DB parameter group. In-place modify.
     */
    dbParameterGroupName?: string;
    /**
     * VPC security groups attached to the instance. In-place modify.
     * Ignored for Aurora cluster members (`dbClusterIdentifier` set) — security
     * groups are managed on the DB cluster instead.
     */
    vpcSecurityGroupIds?: string[];
    /**
     * Option group (MySQL/Oracle/SQL Server). In-place modify.
     */
    optionGroupName?: string;
    /**
     * License model, e.g. `license-included` | `bring-your-own-license`.
     */
    licenseModel?: string;
    /**
     * Whether storage is encrypted. Immutable — forces replacement.
     */
    storageEncrypted?: boolean;
    /**
     * KMS key for storage encryption. Immutable — forces replacement.
     */
    kmsKeyId?: string;
    /**
     * CA certificate identifier. In-place modify.
     */
    caCertificateIdentifier?: string;
    /**
     * Enable IAM database authentication. In-place modify.
     */
    enableIAMDatabaseAuthentication?: boolean;
    /**
     * Enable Performance Insights. In-place modify.
     */
    enablePerformanceInsights?: boolean;
    /**
     * KMS key for Performance Insights. In-place modify.
     */
    performanceInsightsKMSKeyId?: string;
    /**
     * Performance Insights retention (e.g. `"7 days"`). Sent to the API in
     * whole days (valid: 7, 731, or month multiples).
     */
    performanceInsightsRetentionPeriod?: Duration.Input;
    /**
     * Enhanced-monitoring granularity (e.g. `"60 seconds"`). Sent to the API
     * in whole seconds (valid: 0, 1, 5, 10, 15, 30, 60).
     */
    monitoringInterval?: Duration.Input;
    /**
     * IAM role ARN for enhanced monitoring. In-place modify.
     */
    monitoringRoleArn?: string;
    /**
     * Log types to export to CloudWatch Logs. Diffed against observed state and
     * applied via the delta-shaped `CloudwatchLogsExportConfiguration` on modify.
     */
    enableCloudwatchLogsExports?: string[];
    /**
     * Block accidental deletion. In-place modify.
     */
    deletionProtection?: boolean;
    /**
     * Network type: `IPV4` | `DUAL`. In-place modify.
     */
    networkType?: string;
    /**
     * Allow a major engine-version upgrade during a modify. Modify-only flag.
     */
    allowMajorVersionUpgrade?: boolean;
    /**
     * Whether the instance is publicly reachable. In-place modify.
     */
    publiclyAccessible?: boolean;
    /**
     * Promotion tier inside the cluster.
     */
    promotionTier?: number;
    /**
     * Auto minor version upgrades.
     */
    autoMinorVersionUpgrade?: boolean;
    /**
     * Copy tags to snapshots.
     */
    copyTagsToSnapshot?: boolean;
    /**
     * User-defined tags.
     */
    tags?: Record<string, string>;
    /**
     * Skip the final snapshot when the instance is deleted. Set `false` to
     * have RDS take a final snapshot on teardown — belt-and-suspenders beyond
     * `deletionProtection` for databases whose data must survive a deliberate
     * destroy. Persisted into state so `delete` honors it without props.
     * @default true
     */
    skipFinalSnapshot?: boolean;
    /**
     * Identifier for the final snapshot taken when `skipFinalSnapshot` is
     * `false`. Defaults to `<instance-identifier>-final-<timestamp>` so
     * repeated destroy/create cycles never collide on snapshot names.
     */
    finalDBSnapshotIdentifier?: string;
}
export interface DBInstance extends Resource<"AWS.RDS.DBInstance", DBInstanceProps, {
    /**
     * Identifier of the instance.
     */
    dbInstanceIdentifier: string;
    /**
     * ARN of the instance.
     */
    dbInstanceArn: string;
    /**
     * Aurora cluster the instance belongs to, if any.
     */
    dbClusterIdentifier: string | undefined;
    /**
     * DNS address of the instance endpoint.
     */
    endpointAddress: string | undefined;
    /**
     * Port of the instance endpoint.
     */
    endpointPort: number | undefined;
    /**
     * Instance class (e.g. `db.serverless`, `db.t3.micro`).
     */
    dbInstanceClass: string | undefined;
    /**
     * Database engine.
     */
    engine: string | undefined;
    /**
     * Engine version in use.
     */
    engineVersion: string | undefined;
    /**
     * Status of the instance (e.g. `available`).
     */
    status: string | undefined;
    /**
     * Failover promotion tier inside the cluster.
     */
    promotionTier: number | undefined;
    /**
     * Whether the instance has a public address.
     */
    publiclyAccessible: boolean | undefined;
    /**
     * Subnet group the instance is placed in.
     */
    dbSubnetGroupName: string | undefined;
    /**
     * Parameter groups applied to the instance.
     */
    dbParameterGroupNames: string[];
    /**
     * Allocated storage in GiB.
     */
    allocatedStorage: number | undefined;
    /**
     * Storage autoscaling ceiling in GiB.
     */
    maxAllocatedStorage: number | undefined;
    /**
     * Storage type (e.g. `gp3`, `io1`, `aurora`).
     */
    storageType: string | undefined;
    /**
     * Provisioned IOPS.
     */
    iops: number | undefined;
    /**
     * Storage throughput in MiBps (gp3).
     */
    storageThroughput: number | undefined;
    /**
     * Whether the instance is Multi-AZ.
     */
    multiAZ: boolean | undefined;
    /**
     * Availability Zone of the instance.
     */
    availabilityZone: string | undefined;
    /**
     * Standby AZ for Multi-AZ deployments.
     */
    secondaryAvailabilityZone: string | undefined;
    /**
     * Backup retention period in days.
     */
    backupRetentionPeriod: number | undefined;
    /**
     * Daily backup window (`hh:mm-hh:mm` UTC).
     */
    preferredBackupWindow: string | undefined;
    /**
     * Weekly maintenance window.
     */
    preferredMaintenanceWindow: string | undefined;
    /**
     * KMS key used for storage encryption.
     */
    kmsKeyId: string | undefined;
    /**
     * Whether storage is encrypted.
     */
    storageEncrypted: boolean | undefined;
    /**
     * CA certificate identifier.
     */
    caCertificateIdentifier: string | undefined;
    /**
     * Whether IAM database authentication is enabled.
     */
    iamDatabaseAuthenticationEnabled: boolean | undefined;
    /**
     * Whether Performance Insights is enabled.
     */
    performanceInsightsEnabled: boolean | undefined;
    /**
     * Enhanced-monitoring granularity in seconds.
     */
    monitoringInterval: number | undefined;
    /**
     * ARN of the enhanced-monitoring CloudWatch Logs stream.
     */
    enhancedMonitoringResourceArn: string | undefined;
    /**
     * Log types exported to CloudWatch Logs.
     */
    enabledCloudwatchLogsExports: string[];
    /**
     * Whether deletion protection is enabled.
     */
    deletionProtection: boolean | undefined;
    /**
     * Immutable region-unique instance resource ID (used in IAM auth ARNs).
     */
    dbiResourceId: string | undefined;
    /**
     * Master username.
     */
    masterUsername: string | undefined;
    /**
     * Whether the final snapshot is skipped on delete, persisted from the
     * prop of the same name. `delete` receives only the stored attributes,
     * never live props, so the snapshot decision must ride in state;
     * `undefined` (older state without this attr) is treated as skip.
     */
    skipFinalSnapshot: boolean | undefined;
    /**
     * Identifier used for the final snapshot when `skipFinalSnapshot` is
     * `false`, persisted from props so `delete` can name the snapshot without
     * live props. `undefined` means `delete` falls back to the default
     * `<instance-identifier>-final-<timestamp>` naming scheme.
     */
    finalDBSnapshotIdentifier: string | undefined;
    /**
     * Salted SHA-256 fingerprint of the last `masterUserPassword` this
     * provider sent to RDS — `sha256(`${dbInstanceIdentifier}:${password}`)`,
     * never the secret itself. Lets reconcile skip the `MasterUserPassword`
     * modify (and the `resetting-master-credentials` cycle it triggers) when
     * the configured password has not changed.
     *
     * Persisted `Redacted` because a password hash is still sensitive: an
     * unsalted digest is vulnerable to rainbow-table lookup, so the state
     * store must not surface it in plaintext (logs, `stringify`, dumps). The
     * per-resource identifier salt additionally defeats precomputed tables;
     * it is stable across a resource's life, so the fingerprint stays
     * comparable across reconciles.
     */
    masterUserPasswordFingerprint: Redacted.Redacted<string> | undefined;
    /**
     * ARN of the Secrets Manager secret holding master credentials.
     */
    masterUserSecretArn: string | undefined;
    /**
     * Option group memberships.
     */
    optionGroupMemberships: string[];
    /**
     * License model.
     */
    licenseModel: string | undefined;
    /**
     * Configured database port.
     */
    dbInstancePort: number | undefined;
    /**
     * Network type (`IPV4` or `DUAL`).
     */
    networkType: string | undefined;
    /**
     * Tags on the instance.
     */
    tags: Record<string, string>;
}, never, Providers> {
}
/**
 * An RDS database instance — either a standalone (non-Aurora) database or a
 * member of an Aurora `DBCluster`.
 *
 * Exposes the full storage, backup, monitoring, performance-insights,
 * encryption, networking, and log-export surface of `createDBInstance` /
 * `modifyDBInstance`. Mutable fields are reconciled in place against the
 * observed cloud state; immutable fields (`engine`, `dbName`,
 * `masterUsername`, `availabilityZone`, `storageEncrypted`, `kmsKeyId`,
 * `dbSubnetGroupName`) force a replacement.
 * ### Standalone Instance
 * **Example:** A gp3 MySQL instance
 * ```typescript
 * const db = yield* DBInstance("Db", {
 *   engine: "mysql",
 *   dbInstanceClass: "db.t3.micro",
 *   allocatedStorage: 20,
 *   storageType: "gp3",
 *   masterUsername: "admin",
 *   masterUserPassword: Redacted.make("supersecret"),
 *   backupRetentionPeriod: "7 days",
 *   deletionProtection: false,
 * });
 * ```
 *
 * ### Cluster Member
 * **Example:** An Aurora writer instance
 * ```typescript
 * const writer = yield* DBInstance("Writer", {
 *   dbClusterIdentifier: cluster.dbClusterIdentifier,
 *   dbInstanceClass: "db.serverless",
 *   engine: "aurora-postgresql",
 * });
 * ```
 *
 * ### Monitoring & Logs
 * **Example:** Enhanced monitoring + log export
 * ```typescript
 * const db = yield* DBInstance("Db", {
 *   engine: "postgres",
 *   dbInstanceClass: "db.t3.micro",
 *   allocatedStorage: 20,
 *   monitoringInterval: "60 seconds",
 *   monitoringRoleArn: monitoringRole.roleArn,
 *   enablePerformanceInsights: true,
 *   enableCloudwatchLogsExports: ["postgresql", "upgrade"],
 * });
 * ```
 *
 * @resource
 */
export declare const DBInstance: import("../../Resource.ts").ResourceClass<DBInstance>;
export declare const DBInstanceProvider: () => import("effect/Layer").Layer<Provider.Provider<DBInstance>, never, import("@distilled.cloud/aws/Credentials").Credentials | import("effect/unstable/http/HttpClient").HttpClient | import("../../Stack.ts").Stack | import("../../Stage.ts").Stage>;
//# sourceMappingURL=DBInstance.d.ts.map