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
| `rules/ci-gates.md`             | no globs yet — read when touching any CI/CT gate   | "Prove the gate fails" discipline; the `tsc -p` false-green story     |
| `rules/hooks.md`                | no globs yet — read when touching `src/ui/hooks/`  | Internal vs public hook categories + promotion contract               |
| `rules/providers.md`            | no globs yet — read when touching providers        | Infra Provider/Context canonicity (one path only)                     |
| `rules/server-entry.md`         | no globs yet — read when touching `./server` entry | Server-entry contract, the two safety axes, enforcement map           |
| `skills/new-component/SKILL.md` | `/new-component` or auto                           | Full component creation workflow                                      |
| `skills/component-doc/SKILL.md` | `/component-doc` or auto                           | MDX doc authoring for an existing component                           |
| `commands/prune.md`             | `/prune <target>`                                  | Safe dead-weight removal                                              |
| `agents/component-reviewer.md`  | delegated review                                   | Isolated-context compliance review (read-only)                        |
| `hooks/format-touched.sh`       | PostToolUse on Write/Edit                          | Auto-prettier the touched file; never blocks (`exit 0` by contract)   |
| `settings.json`                 | every session                                      | Permissions (allow/deny) + the auto-format hook wiring                |

Per `.claude/rules/docs-sync.md`, this table is derived from the actual
contents of `.claude/` — adding, removing, or re-scoping anything here means
updating the table in the same commit.

## Personal overrides

Put anything machine-specific or private in `settings.local.json`
(auto-gitignored). Don't commit it.

## Editing this setup

Keep `CLAUDE.md` lean — it loads every session, so every line taxes every
prompt. Push detail into path-scoped `rules/` files that only load when
relevant, and keep only invariants + pointers in `CLAUDE.md`. When the
architecture changes, update `CLAUDE.md` and the rules in the same PR as
the code.
