import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Path from "effect/Path";
import * as Redacted from "effect/Redacted";
import type { Scope } from "effect/Scope";
import { ChildProcessSpawner } from "effect/unstable/process/ChildProcessSpawner";
export type ComputeAutoBuildFramework = "auto" | "nextjs" | "nuxt" | "astro" | "nestjs" | "tanstack-start" | "bun";
export interface ComputeAutoBuildOptions {
    /**
     * Application root.
     */
    appPath: string;
    /**
     * Entrypoint used by the Bun fallback strategy.
     */
    entrypoint?: string;
    /**
     * Framework to build. `auto` tries Next.js, Nuxt, Astro, TanStack Start,
     * then Bun.
     *
     * @default "auto"
     */
    framework?: ComputeAutoBuildFramework;
    /**
     * Environment variables supplied to the build command.
     * Ambient `PRISMA_SERVICE_TOKEN` and `PRISMA_API_TOKEN` credentials are not
     * inherited; include one here explicitly only when the application build
     * genuinely needs Prisma Management API access.
     *
     * Plain strings are persisted in Alchemy state when this is configured
     * through `Prisma.Compute`. Wrap secrets with `Redacted.make(secret)`.
     *
     * ```typescript
     * env: { NPM_TOKEN: Redacted.make(process.env.NPM_TOKEN!) }
     * ```
     */
    env?: Record<string, string | Redacted.Redacted<string> | undefined>;
    /**
     * Maximum bytes retained from each build output stream.
     *
     * @default 1048576 (1 MiB)
     */
    outputLimitBytes?: number;
    /**
     * Maximum wall-clock time for the framework build command.
     *
     * @default 900 (15 minutes)
     */
    timeoutSeconds?: number;
}
export interface ComputeBuildArtifact {
    /**
     * Directory to archive and upload.
     */
    directory: string;
    /**
     * Entrypoint relative to `directory`.
     */
    entrypoint: string;
    /**
     * Default HTTP port for framework conventions.
     */
    defaultPort?: number;
    /**
     * Removes temporary build output.
     */
    cleanup: Effect.Effect<void, never, FileSystem.FileSystem>;
}
type BuildServices = ChildProcessSpawner | FileSystem.FileSystem | Path.Path | Scope;
export interface RunBuildCommandOptions {
    command: string;
    cwd?: string;
    /**
     * Explicit environment variables supplied to the build command. Ambient
     * Prisma Management API credentials are withheld unless they are provided
     * here intentionally.
     */
    env?: Record<string, string>;
    /**
     * Maximum bytes retained from each output stream before the build is
     * interrupted. This prevents noisy build tools from exhausting memory.
     *
     * @default 1048576 (1 MiB)
     */
    outputLimitBytes?: number;
    /**
     * Maximum wall-clock time for the build command.
     *
     * @default 900 (15 minutes)
     */
    timeoutSeconds?: number;
}
/**
 * Run a shell build command, dying on non-zero exit. Local stand-in for the
 * removed `Build/Command.ts` helper. Build commands inherit the ambient
 * environment except for Prisma Management API credentials, which must be
 * passed explicitly through `env` when a build genuinely needs them.
 */
export declare const runBuildCommand: (args_0: RunBuildCommandOptions) => Effect.Effect<{
    exitCode: import("effect/unstable/process/ChildProcessSpawner").ExitCode;
    stdout: string;
    stderr: string;
}, unknown, ChildProcessSpawner | Path.Path>;
export declare const runComputeAutoBuild: (options: ComputeAutoBuildOptions) => Effect.Effect<ComputeBuildArtifact, unknown, BuildServices>;
export {};
//# sourceMappingURL=ComputeBuild.d.ts.map