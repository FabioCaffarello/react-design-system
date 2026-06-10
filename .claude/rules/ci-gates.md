# CI gate rules

A CI gate that exists but does not gate is worse than no gate — it
broadcasts a false signal of safety. This file exists because Phase 0
caught one: the `typecheck` job in `.github/workflows/ci.yml` ran
`npx tsc --noEmit -p tsconfig.json` against a solution-style root
(`files: []` + `references: [...]`). `tsc -p` does not traverse
project references; it typechecks zero files and exits 0. CI was green
for months while the codebase had ~119 real TypeScript errors hidden
by the `|| true` in the `build` script. Both failures were invisible
to every commit and every PR.

## The rule — test the gate, not just the code

Every CI/CT gate added or modified must be verified locally by running
the **exact command the workflow runs**, then by inducing a failure
the gate is supposed to catch and confirming the gate fails. The check
is: does this gate fail when it should fail? If you only ever observe
the gate passing, you have not verified that it gates anything.

This applies to: typecheck, lint, validate scripts, smoke tests, a11y
baseline checks, any future gate.

## Concrete verification steps

For each gate touched in a PR:

1. Run the workflow's command verbatim locally — copy from the YAML, do
   not paraphrase. (`npm run X` if the workflow uses it; otherwise the
   exact invocation.) Confirm it exits 0 on the current main.
2. Induce a failure the gate is supposed to catch. Edit a file to
   introduce the exact class of bug the gate exists for (e.g. for
   `typecheck`, an `unknown` assigned to `string`; for
   `validate-file-set`, delete one of the five required component
   files). Run the command again. Confirm a non-zero exit.
3. Revert the induced failure. Commit only the gate change.

Step 2 is the load-bearing one. If you skip it because "obviously this
gate must work", you reproduce the Phase 0 mistake. Tools and configs
fail silently in ways that look identical to "no work to do".

## Known traps (do not relearn the hard way)

### `tsc -p` vs `tsc --build` with project references

A `tsconfig.json` shaped as

```json
{ "files": [], "references": [{ "path": "..." }, ...] }
```

is a **solution-style root**. It is purely a coordinator for referenced
projects. `tsc -p` on this root finds zero input files and exits 0
without typechecking anything.

The correct invocation is `tsc --build` (or `tsc -b`). `--build`
respects `references` and typechecks each referenced project according
to its own `include`/`exclude`. In CI, always pair with `--force` so
the run does not trust a `.tsbuildinfo` cache the build agent may have
restored.

If you ever see a typecheck job that says `-p` against a project-
references root, treat it as broken regardless of its color. Grep
`.github/workflows/` for `tsc.*-p\b` before approving any tsconfig
restructure.

### `|| true` chained after a typecheck step

The `build` script previously read:

```
tsc --emitDeclarationOnly ... || true && vite build && ...
```

`vite build` does not typecheck (esbuild erases types). The `|| true`
turned every TS error into a silent partial `.d.ts` emit. Same family
of bug as the `-p` mistake — both let the gate appear to pass for the
wrong reason.

If a developer ever appends `|| true` to a verification step "to keep
the build flowing", that is the moment to push back. The cost of a red
build is bounded; the cost of months of false-green CI is not.

### `exclude` in tsconfig is not the same as "not typechecked"

`tsconfig.app.json` excludes `Table/**` and `DataGrid/**` from its
direct inputs. That does NOT prevent those files from being
typechecked: any transitive import from an included file
(`components/index.ts` imports them) pulls them back into the program.
The exclude only suppresses `.d.ts` emission for those files.

If you want to genuinely skip a directory from typecheck, you have to
remove every import path that leads into it from included roots. Or
shard it into its own referenced project that you exclude from the
solution. Neither is what `exclude` does by itself.

### A gate-shaped parameter that gates nothing (`parameters.a11y.test: "error"`)

`.storybook/preview.tsx` sets `parameters.a11y.test: "error"`, which
reads like an a11y gate. It is cosmetic: no `@storybook/addon-vitest`
plugin is wired into a vitest workspace and `npm run test` excludes
`*.stories.tsx`, so the addon's afterEach handler never fires in CI.
The actual enforcement mechanism is the serial axe baseline plus
`scripts/validate-a11y-baseline.mjs` — that script's header carries
the full analysis, and the long comment in `.storybook/preview.tsx`
restates it at the site. Treat any similar "test: error" parameter as
decoration until you have found the runner that honors it.

### Skipping hooks (`--no-verify`, `--no-gpg-sign`, etc.)

Pre-commit/pre-push hooks ARE local gates. If you skip them because
"the formatter is misbehaving", you have skipped the verification you
were told to perform. Investigate the hook failure; do not bypass it.

## Why this matters more in a Claude-Code-maintained repo

This codebase is maintained mostly through Claude Code prompts. A
gate that fires only on real bugs is fine — the agent will fix the
bug. A gate that exits 0 silently teaches the agent that the bug
doesn't exist, and the next prompt builds on that false foundation.
The longer the false-green runs, the more code accumulates against
the wrong contract.

The fix is not "be more careful with gates" (that scales poorly across
prompts). The fix is the rule above: when you touch a gate, prove it
fails when it should. Then there is no false-green to teach from.
