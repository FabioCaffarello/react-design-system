---
description: Keep derived docs in sync with their sources of truth
globs: docs/**/*.md, CLAUDE.md, README.md
---

# Docs-sync rules

<!-- docs-ok: the paragraph below names phantom scripts as negative references — that is the drift story this rule exists to tell -->

Some documents are **derived**: they restate, for human readers, conventions whose canonical definition lives elsewhere. When the source moves and the derived doc doesn't, the derived doc starts teaching the opposite of what the project enforces — and because this repo is maintained mainly through Claude Code prompts, the next agent follows the stale doc and reintroduces exactly what a rule forbids. This rule exists because `docs/STORYBOOK_GUIDE.md` drifted that way: it kept teaching the `Atoms/Molecules/Organisms/Templates/Patterns` taxonomy, `tags: ['autodocs']`, and `@storybook/react` imports long after `.claude/rules/stories.md` and `CLAUDE.md` had banned all three, and it documented `npm run validate-stories` / `generate-story-index` scripts that never existed in `package.json`.

## Derived docs and their sources of truth

A change to any source below **must** update every derived doc that restates it, **in the same commit**:

- `docs/STORYBOOK_GUIDE.md` is derived from `.claude/rules/stories.md` (taxonomy, autodocs vs MDX-attached, import package), `CLAUDE.md` (3-layer model, "no external-consumer features (MCP)", "do not grow the npm script surface"), and `package.json` (every `npm run X` it mentions must exist as a script).
- `CLAUDE.md`'s Commands section is derived from `package.json` — it lists only scripts that exist, and `package.json` adds no script beyond what `CLAUDE.md` sanctions. The two constrain each other in both directions.
- `CLAUDE.md`'s Hard-rules item about CI/CT gate verification is derived from `.claude/rules/ci-gates.md`. The rule file is authoritative; CLAUDE.md restates the one-line gist.
- `.claude/rules/providers.md` is derived from `scripts/validate-provider-canonicity.mjs` (the recognised infra Provider/Context basename set) and `CLAUDE.md` (the providers/ = infra-layer principle). Adding a new infra provider means editing the script's `CANONICAL_BASENAMES` AND the basename list in `providers.md` AND the CLAUDE.md Commands section in the same commit.
- `.claude/rules/server-entry.md` is derived from `src/ui/server.ts` (the canonical re-export list), `scripts/lib/server-safe.mjs` (the static classification rule and the React client APIs it watches for — axis 1), `vite.config.server.ts` (the externalised-dep list and the no-banner discipline), `fixtures/next-smoke/app/page.tsx` (the runtime smoke surface — axis 2, the issue #160 reinforcement), and `package.json` `exports`/`build` (the `./server` mapping and the multi-vite-build chain). Adding a server-safe component means landing it under `src/ui/`, adding its concrete-source-file re-export to `server.ts`, adding a minimal-props render to the next-smoke fixture page, AND updating the inventory in `server-entry.md` plus the export-count gist in CLAUDE.md's "Server entry" section in the same commit.
- `CLAUDE.md`'s "Server entry" section is a **gist derived from `server-entry.md` only** — the rule file owns the inventory, the per-issue history, and the enforcement detail; the gist carries the export count (ultimately derived from `src/ui/server.ts`), the two safety axes in one sentence each, the one-sentence adding procedure, and pointers. Same shape for `CLAUDE.md`'s "Public hooks" section: a gist derived from `hooks.md` only (today's set ultimately from `src/ui/index.ts`). The Commands section's `validate-server-entry.mjs` / `analyze-server-safe.mjs` / `validate-use-client-in-dist.mjs` / `test:next-smoke` lines are derived from those scripts' actual behaviour; if the scripts gain a flag or change scope, the one-line gist in Commands updates in the same commit.
- `.claude/rules/hooks.md` is derived from `src/ui/index.ts` (the `Public hooks (consumer-facing)` section comment + every `use*` symbol re-exported under it), from `src/ui/hooks-entry.ts` + `vite.config.hooks.ts` + the `package.json` `./hooks` export mapping (the granular entry, issue #203), from the `publicHooks` list in `scripts/validate-build-exports.ts`, and from the hook source files themselves (the JSDoc contract that the rule requires public hooks to ship). Adding a public hook means landing the hook + test under `src/ui/hooks/`, re-exporting it from `src/ui/index.ts` strictly under the `Public hooks` section AND from `src/ui/hooks-entry.ts`, adding it to the validator's `publicHooks` list, AND updating the "today's set" enumeration in `hooks.md` and the brief `CLAUDE.md` pointer in the same commit. Promoting an internal hook to public also requires reviewing whether its JSDoc meets the `hooks.md` contract checklist (one-liner / behavioural contract / why-hook-not-component / `@example` / `@param` / `@returns`) before flipping the export — promotion is one-way per the rule file.
- `README.md` install/usage snippets are derived from `package.json` `exports`/`peerDependencies` and from `src/docs/Introduction.mdx`.
- `src/docs/ComponentStatus.mdx` inventory counts are derived from the actual component dirs under `src/ui/`.
- `.claude/README.md` is derived from the actual contents of `.claude/` (the rules/skills/commands/agents/hooks that exist, and each rule's frontmatter `globs`) and from `.claude/settings.json` (the hook wiring it describes). Adding, removing, or re-scoping anything under `.claude/` means updating its table in the same commit. Yes — Mnemosyne watches her own house.

## The full set, not one source

The failure mode that motivated this rule: a sweep was scoped as "fix what contradicts `stories.md`" and so it cross-checked **only** `stories.md`, nearly shipping two `CLAUDE.md` violations (an MCP addon and phantom npm scripts) because they didn't contradict the one source in scope. When auditing a derived doc, cross-check it against **every** source listed for it above — not just the one named in the task. A line can be valid against one source and forbidden by another.

## Verification before commit

The first and third bullets are mechanised by `scripts/validate-docs-sync.mjs` (pre-push + CI lint job). Its scope is **wider** than the derived-doc enumeration above, deliberately: a phantom script is drift in any doc, not only a derived one. The scan roots are `docs/`, `.claude/` (recursively — rules, skills, commands, agents, README), `src/docs/`, plus root `CLAUDE.md` and `README.md`; every `.md`/`.mdx` under them.

The `docs-ok: <reason>` escape (HTML comment) is **line-scoped, not file-scoped**: it exempts a match only when the marker sits on the same line as the match or on the first non-blank line above it. A `docs-ok` cannot suppress a violation further down the file — file-wide suppression would recreate by silencing exactly the false-green the gate exists to kill. Use it for negative references only (naming a phantom/banned thing to say "don't"/"never existed").

The other bullets (semantic restatements, "teaches X" vs "says don't use X" triage, the 100%-phantom check before removing a section) remain manual judgment.

- For each derived doc touched, grep it for every `npm run <name>` and confirm each name exists in `package.json` scripts. Zero phantom scripts.
- Negative references are allowed and expected: a doc may name a banned pattern (e.g. `Atoms/Molecules`, `tags: ['autodocs']`) precisely to tell the reader _not_ to use it. Distinguish "this doc teaches X" (drift — fix) from "this doc says don't use X" (correct — keep).
- Internal relative links resolve: grep for `](./` and `](../` targets and confirm each file exists. A dead internal link (e.g. a removed `CATEGORIZATION_GUIDE.md`) is in scope here even when cosmetic — it is the one class of drift safe to defer to a follow-up PR, but it must be logged, never silently left.
- When removing a section because it documents a phantom feature, first confirm the section is **100%** about that feature. If it also describes something real (`npm run storybook:smoke`, the `stories.md` verification grep, the a11y addon), that content survives — relocated to the right section, not deleted with the phantom.
