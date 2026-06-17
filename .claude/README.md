# .claude — Claude Code environment

This directory configures Claude Code for this repo. Committed to git so the
setup is reproducible.

## What's here

| Path                            | Loaded when                                        | Purpose                                                               |
| ------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| `../CLAUDE.md`                  | every session                                      | Project context, stack, architecture, hard rules. Lives at repo root. |
| `rules/colors.md`               | editing `src/**/*.{tsx,ts,css,mdx}`                | Color vocabulary + 9 semantic principles from Phase 7                 |
| `rules/components.md`           | editing `src/ui/**/*.tsx`                          | Component structure + quality bar                                     |
| `rules/stories.md`              | editing `.stories.tsx` or `.mdx`                   | Story metadata + taxonomy discipline                                  |
| `rules/testing.md`              | editing test files                                 | Test standards + behavior/a11y file split                             |
| `rules/tokens.md`               | editing tokens / styles CSS                        | Token discipline + the four `ds/*` ESLint rules                       |
| `rules/docs-sync.md`            | editing `docs/**/*.md`, `CLAUDE.md`, `README.md`   | Derived-doc lockstep rules (partly gated by `validate-docs-sync.mjs`) |
| `rules/ci-gates.md`             | editing workflows, hooks, validators, ESLint rules | "Prove the gate fails" discipline; the `tsc -p` false-green story     |
| `rules/hooks.md`                | editing `src/ui/hooks/**` or `src/ui/index.ts`     | Internal vs public hook categories + promotion contract               |
| `rules/providers.md`            | editing providers/ or any `*Provider*`/`*Context*` | Infra Provider/Context canonicity (one path only)                     |
| `rules/server-entry.md`         | editing server.ts, vite configs, smoke fixture     | Server-entry contract, the two safety axes, enforcement map           |
| `rules/theme-export.md`         | editing `src/styles/**` or theme-export scripts    | The `./theme` raw-`@theme` export: compiled-vs-raw, inliner, the gate |
| `skills/new-component/SKILL.md` | `/new-component` or auto                           | Full component creation workflow                                      |
| `skills/component-doc/SKILL.md` | `/component-doc` or auto                           | MDX doc authoring for an existing component                           |
| `commands/prune.md`             | `/prune <target>`                                  | Safe dead-weight removal                                              |
| `agents/component-reviewer.md`  | delegated review                                   | Isolated-context compliance review (read-only)                        |
| `hooks/format-touched.sh`       | PostToolUse on Write/Edit                          | Auto-prettier the touched file; never blocks (`exit 0` by contract)   |
| `settings.json`                 | every session                                      | Permissions (allow/deny) + the auto-format hook wiring                |

Per `.claude/rules/docs-sync.md`, this table is derived from the actual
contents of `.claude/` — adding, removing, or re-scoping anything here means
updating the table in the same commit.

## Writing a rule

Frontmatter is mandatory: `description` (one line) and `globs` (the paths
whose editing should load the rule). Body structure, in order:

1. **Invariant** — 1-3 lines, imperative.
2. **Why** — the historical bug, one paragraph; link issues/commits
   instead of inlining the full narrative.
3. **How to apply** — the operational checklist.
4. **Enforcement** — gate + stage (pre-commit / pre-push / CI / build),
   or "convention + PR review" stated explicitly.
5. **When NOT to apply** — boundary conditions and exceptions.
6. **Histórico** — extended argumentation, derivations, issue
   narratives. Nothing normative lives only here.

Citation style: anchor by exported symbol, semantic attribute
(`data-marker="pending"`), or file path — never production `file:line`
(line numbers rot on every edit). Commit hashes are fine for history.
Body in English; Portuguese headings are allowed where flagged as
historical. The `fg-quaternary` section of `rules/colors.md` is the
migration pilot; existing rules migrate to this shape as they get
touched, not in a big bang.

## Rule vs skill vs command vs agent vs hook vs gate

- **rule** — a path-bound invariant, loaded by relevance, no
  interaction. Promote prose to a rule when the same pattern is
  restated or violated for the second time.
- **skill** — a multi-step authoring workflow with an output artifact
  and a template (`new-component`, `component-doc`).
- **command** — a user-initiated procedure with confirmation points
  (`/prune` is the mold).
- **agent** — judgment that needs isolated context and is read-only
  (`component-reviewer`).
- **hook** — a mechanical, idempotent side effect that must never block
  (`format-touched.sh` exits 0 by contract).
- **gate** — a script that fails the commit/push/CI. Add one only when
  the violation is mechanically detectable AND has already occurred —
  speculative enforcement is an anti-pattern (see `hooks.md`'s deferred
  export-surface gate for the canonical "wait for the trigger
  condition" example).

## Personal overrides

Put anything machine-specific or private in `settings.local.json`
(auto-gitignored). Don't commit it.

## Editing this setup

Keep `CLAUDE.md` lean — it loads every session, so every line taxes every
prompt. As of the PR3 compaction it measures ~90 lines / ~1.6k tokens;
treat **~2k tokens as the ceiling** — if an edit pushes past that, the
detail belongs in a path-scoped `rules/` file with a gist + pointer left
behind. (This number is measured, not aspirational; per `docs-sync.md` it
updates whenever CLAUDE.md materially grows or shrinks.) When the
architecture changes, update `CLAUDE.md` and the rules in the same PR as
the code.
