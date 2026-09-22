import * as Array from "effect/Array";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import { flow } from "effect/Function";
import * as Option from "effect/Option";
import * as String from "effect/String";
/**
 * GitHub Actions metadata for conditional resources in `alchemy.run.ts`.
 *
 * Resolves to `undefined` outside GitHub Actions. In GitHub Actions, it reads
 * `GITHUB_SHA`, `GITHUB_REPOSITORY_OWNER`, `GITHUB_REPOSITORY`, and the optional
 * `PULL_REQUEST` variable exported by the Alchemy GitHub Action.
 */
export const GitHubEnv = Config.boolean("GITHUB_ACTIONS").pipe(Config.withDefault(false), 
// Config has no flatMap in Effect 4; a Config is itself an Effect, so the
// enabled branch returns the inner config for mapOrFail to evaluate.
Config.mapOrFail((enabled) => enabled
    ? Config.all({
        sha: Config.string("GITHUB_SHA"),
        owner: Config.string("GITHUB_REPOSITORY_OWNER"),
        repository: Config.string("GITHUB_REPOSITORY").pipe(Config.mapOrFail(flow(String.split("/"), Array.get(1), Effect.fromOption, Effect.catchTags({
            NoSuchElementError: Effect.die,
        })))),
        pr: Config.number("PULL_REQUEST").pipe(Config.option, Config.map(Option.getOrUndefined)),
    })
    : Effect.succeed(undefined)));
//# sourceMappingURL=Env.js.map