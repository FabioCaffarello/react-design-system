---
description: Design token discipline
globs: src/ui/tokens/**/*.*, src/styles/**/*.css
---

# Token rules

- Tokens are the only source of visual values: color, spacing, typography, radius, shadow, z-index, motion.
- Color tokens live in `src/styles/semantic/colors.css` under `@theme`, with dark-mode overrides in `src/styles/themes/dark.css`. Components consume via Tailwind classes (`text-fg-*`, `bg-surface-*`, `border-line-*`, `bg-status-*`, feedback families). See `.claude/rules/colors.md` for vocabulary, principles, and pitfalls.
- Tokens describe **role**, not tone. `bg-surface-base` (role: flat content layer), not `bg-slate-50`.
- One token system. Light, dark, and variant themes override the same vars via selector specificity in `themes/*.css`, not separate token systems.
- When adding a token, document it in the Storybook Tokens story so it surfaces in the design system documentation.
- Never inline a one-off value to "make it work." Either extend the scale (if the new role is justified — see Principle 9 in `colors.md`), or use a primitive with an inline `// exception: <reason>` comment (Principle 3 in `colors.md`).
