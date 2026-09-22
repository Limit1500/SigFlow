import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import { type PrismaManagementClient } from "../Client.ts";
import { type PostgresOrigin } from "../PostgresOrigin.ts";
import type { Database, PrismaSecretConnection } from "../Types.ts";
export declare const hasCanonicalConnectionSecrets: (secrets: PrismaSecretConnection) => boolean;
/**
 * Derive the conventional `databaseUrl` and parsed `origin` / `pooledOrigin`
 * attributes from a connection's secret strings. Shared between the live
 * Connection provider and the dev provider so local `@prisma/dev`
 * connections materialize the same shape.
 */
export declare const deriveConnectionAttrs: (secrets: {
    directConnectionString?: Redacted.Redacted<string> | undefined;
    pooledConnectionString?: Redacted.Redacted<string> | undefined;
    accelerateConnectionString?: Redacted.Redacted<string> | undefined;
}) => {
    databaseUrl: Redacted.Redacted<string> | undefined;
    origin: PostgresOrigin | undefined;
    pooledOrigin: PostgresOrigin | undefined;
};
export declare const mergeConnectionSecrets: (preferred: PrismaSecretConnection, fallback: PrismaSecretConnection) => PrismaSecretConnection;
declare class DatabaseCredentialsNotReady extends Error {
}
/**
 * Recover one-time database credentials after create success but before state
 * persistence. Prisma's ordinary database reads omit those values, so rotate
 * the observed default connection once when no canonical URL is available.
 */
export declare const recoverDatabaseConnectionSecrets: (client: PrismaManagementClient, initialDatabase: Database, known: PrismaSecretConnection) => Effect.Effect<{
    database: Database;
    secrets: PrismaSecretConnection;
}, DatabaseCredentialsNotReady | import("../Client.ts").PrismaApiDecodeError | import("../Client.ts").PrismaApiError, never>;
export {};
//# sourceMappingURL=DatabaseSecrets.d.ts.map