/**
 * Converts gitignore-style rules into glob patterns for tools like fast-glob's {@link https://github.com/mrmlnc/fast-glob#ignore `ignore`} option.
 *
 * Gitignore and glob differ (ordering, negation, escapes). This maps the common cases:
 *
 * - Rules with no `/` match at any depth → \`**\/name\`, \`**\/name\/\*\/`
 * - A leading `/` anchors to the ignore file's directory (use the same `cwd` in fast-glob) → `name`, `name/**`
 * - A `/` in the pattern (not only leading) uses path-aware matching → `a/b`, `a/b/**`
 * - A trailing `/` restricts to directories → adds `/**` as needed
 * - Lines starting with `!` (negation) are returned with a `!` prefix for use in **positive** glob
 *   lists; they are not valid in fast-glob's `ignore` array (filter them out if you only pass `ignore`)
 *
 * Does not implement full gitignore escaping (e.g. `\\ ` for trailing space) or `**` edge cases
 * identical to git; escape handling can be added later if needed.
 */
export declare function gitignoreRulesToGlobs(rules: ReadonlyArray<string>): string[];
//# sourceMappingURL=gitignore-rules-to-globs.d.ts.map