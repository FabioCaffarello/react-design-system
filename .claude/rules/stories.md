---
description: Story metadata discipline (.stories.tsx + .mdx)
globs: src/**/*.stories.tsx, src/**/*.{mdx,md}
---

# Story rules

Storybook indexes both `.stories.@(js|jsx|mjs|ts|tsx)` AND `.mdx` (see `.storybook/main.ts`). Both formats place a story in the sidebar via `title:` (Meta object) or `<Meta title="..." />`.

- **Any taxonomy / title / Meta migration must touch both formats.** A sweep that only edits `.stories.tsx` leaves the `.mdx` manifest orphan, sidebar stays inconsistent. sed / script invocations need `--include='*.stories.tsx' --include='*.mdx'` (or two passes). This rule exists because a prior migration shipped exactly that gap.
- **Verification before commit.** Run a grep against the OLD pattern using the dual glob and require zero output. Example for a layer rename:
  ```
  grep -rIn --include='*.stories.tsx' --include='*.mdx' \
    -E "(title:\s*['\"]|<Meta\s+title=['\"])(Atoms|Molecules|Organisms|Patterns|Templates)/" src
  ```
  Commit only when the grep is clean.
- **Top-level title segment matches the 3-layer model.** First segment is one of `Primitives/`, `Components/`, `Layouts/`, or `Design System/`. Anything else is the wrong taxonomy.
- **Don't add `tags: ['autodocs']` to story files.** Doc pages come from MDX attached (`<Meta of={ComponentStories} />`). Autodocs was removed project-wide in Phase 13b1 because Storybook 10's indexer errors when a CSF file is tagged autodocs AND has an attached MDX, and there is no global off-switch — only per-story tag removal works. See `.claude/skills/component-doc/SKILL.md` for the canonical doc-authoring path.
