# .claude — Claude Code environment

This directory configures Claude Code for this repo. Committed to git so the
setup is reproducible.

## What's here

| Path                            | Loaded when                         | Purpose                                                               |
| ------------------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| `../CLAUDE.md`                  | every session                       | Project context, stack, architecture, hard rules. Lives at repo root. |
| `rules/colors.md`               | editing `src/**/*.{tsx,ts,css,mdx}` | Color vocabulary + 9 semantic principles from Phase 7                 |
| `rules/components.md`           | editing `src/ui/**/*.tsx`           | Component structure + quality bar                                     |
| `rules/stories.md`              | editing `.stories.tsx` or `.mdx`    | Story metadata + taxonomy discipline                                  |
| `rules/testing.md`              | editing test files                  | Test standards                                                        |
| `rules/tokens.md`               | editing tokens / style.css          | Token discipline                                                      |
| `skills/new-component/SKILL.md` | `/new-component` or auto            | Full component creation workflow                                      |
| `commands/prune.md`             | `/prune <target>`                   | Safe dead-weight removal                                              |
| `agents/component-reviewer.md`  | delegated review                    | Isolated-context compliance review                                    |
| `settings.json`                 | every session                       | Permissions + auto-format hook                                        |

## Personal overrides

Put anything machine-specific or private in `settings.local.json`
(auto-gitignored). Don't commit it.

## Editing this setup

Keep `CLAUDE.md` under ~500 tokens — it loads every time. Push detail into
path-scoped `rules/` files that only load when relevant. When the architecture
changes, update `CLAUDE.md` and the rules in the same PR as the code.
