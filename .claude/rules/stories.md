---
description: Story metadata discipline (.stories.tsx + .mdx)
globs: src/**/*.stories.tsx, src/**/*.{mdx,md}
---

# Story rules

Storybook indexes both `.stories.@(js|jsx|mjs|ts|tsx)` AND `.mdx` (see `.storybook/main.ts`). Both formats place a story in the sidebar via `title:` (Meta object) or `<Meta title="..." />`.

- **Any taxonomy / title / Meta migration must touch both formats.** A sweep that only edits `.stories.tsx` leaves the `.mdx` manifest orphan, sidebar stays inconsistent. sed / script invocations need `--include='*.stories.tsx' --include='*.mdx'` (or two passes). This rule exists because a prior migration shipped exactly that gap.
- **Verification before commit (split by format).**
  - **`.stories.tsx`: enforced automatically by the `ds/story-discipline` ESLint rule** (allowlist AST against the four valid segments — see `eslint-rules/story-discipline/`). Runs in pre-commit, pre-push, and CI. No manual grep needed. A wrong segment fails lint with a precise file:line and the suggested replacement; legacy `@storybook/react` and `@storybook/test` imports fail the same way. The rule replaced the older denylist regex that enumerated banned segments (`Atoms|Molecules|...`) and missed any segment not nominally listed (the Phase B "Providers/" regression).
  - **`.mdx`: residual grep against four stable infrastructure pages.** Today: `src/docs/Introduction.mdx`, `src/docs/ComponentStatus.mdx`, `src/docs/guides/ComponentComposition.mdx`, `src/ui/tokens/Tokens.mdx` — all with `<Meta title="Design System/...">`, all valid. These are documentation pages of the design system itself; they have no `.stories.tsx` counterpart, so they don't (and won't) migrate to the attached `<Meta of={...}>` form. Scope is **stable**, not shrinking. The five legacy component MDX files this used to defer to migrated in commits `56dbbe2`, `4f1ae87`, `c9e5ba2`, `7d7dd04` (see BACKLOG entry "Migrar 5 legacy MDX standalone → attached Meta" marked resolved). Adding `eslint-plugin-mdx` to extend the rule to MDX was rejected as bad ROI for four stable pages. Before commits that touch `.mdx`, run:
    ```
    grep -rIn --include='*.mdx' \
      -E "<Meta\s+title=['\"](?!(Primitives|Components|Layouts|Design System)/)" src
    ```
    The path `src` recurses into both `src/ui/**` and `src/docs/**`. Zero output required. (Note: requires GNU `grep -P` or `rg` — BSD grep does not support PCRE lookahead.)
- **Top-level title segment matches the 3-layer model.** First segment is one of `Primitives/`, `Components/`, `Layouts/`, or `Design System/`. Anything else is the wrong taxonomy. **Enforced automatically for `.stories.tsx` by `ds/story-discipline/valid-title-segment`.**
- **Don't add `tags: ['autodocs']` to story files.** Doc pages come from MDX attached (`<Meta of={ComponentStories} />`). Autodocs was removed project-wide in Phase 13b1 because Storybook 10's indexer errors when a CSF file is tagged autodocs AND has an attached MDX, and there is no global off-switch — only per-story tag removal works. See `.claude/skills/component-doc/SKILL.md` for the canonical doc-authoring path.
