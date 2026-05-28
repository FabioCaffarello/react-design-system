---
description: Design token discipline
globs: src/ui/tokens/**/*.*, src/style.css
---

# Token rules

- Tokens are the ONLY source of visual values: color, spacing, typography, radius, shadow, z-index, motion.
- Define semantic tokens (e.g. `--color-surface`, `--color-text-muted`), not raw scales scattered in components. Components reference semantic tokens.
- One theme. Light/dark are variants of the same token set via CSS custom properties, not separate systems.
- When adding a token, add it to the scale AND document it in the Tokens story so it shows up in Storybook.
- Never introduce a one-off value in a component to "just make it work." Extend the scale instead.
