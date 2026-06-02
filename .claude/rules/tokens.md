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

## Enforcement (ESLint)

Three custom ESLint rules (in `eslint-rules/`, exported as `eslint-plugin-ds-tokens`) block raw Tailwind token classes in shipped component source. They run in pre-commit (lint-staged), pre-push (full `npm run lint`), and CI (the `lint` job in `.github/workflows/ci.yml`):

- `ds/no-raw-color-classes` — blocks raw Tailwind color classes (`text-gray-*`, `bg-white`, etc.) and `bg-[var(--color-*)]` arbitrary syntax. Use semantic role classes (`text-fg-*`, `bg-surface-*`, …). See `.claude/rules/colors.md` for vocabulary and the exception-comment escape valve (Principle 3).
- `ds/no-raw-radius-classes` — blocks `rounded-(none|sm|md|lg|xl|2xl|3xl|full)`. Use `getRadiusClass(scale)` from `src/ui/tokens/radius.ts`. The bare `rounded` class is intentionally NOT flagged (would false-positive on Avatar's `variant: "rounded"` type union literals). Side-specific radii (`rounded-l-md`, etc.) are not covered by the token getter and remain raw.
- `ds/no-raw-shadow-classes` — blocks `shadow-(none|sm|md|lg|xl|2xl|inner)`. Use `getShadowClass(scale)` from `src/ui/tokens/shadows.ts`. The bare `shadow` class and prefixed forms like `drop-shadow-md` are intentionally NOT flagged (no equivalent in the getter; `drop-shadow-*` is a different CSS property).

All three rules share the same exception comment shapes (within ~15 lines above the offending literal):

- `// exception: <reason>` — generic Principle 3 marker.
- `// micro-z: <reason>` — z-index inline/className pitfall (Phase 8; color rule only, kept for compat).
- `// <the-exact-class>: <reason>` — names the class being excused.

Token files themselves (`src/ui/tokens/radius.ts`, `src/ui/tokens/shadows.ts`, `src/ui/tokens/TokenVisualizations.tsx`) are exempt by `eslint.config.js` because they legitimately contain literal class names as data (the `tailwind` field of each token).

Stories (`*.stories.tsx`) are intentionally out of scope for raw-class enforcement pending a triage phase. Spacing tokens (`p-*`, `gap-*`, `m-*`) are not yet covered by an ESLint rule — migration is tracked as a follow-up phased work-item; use `getSpacingClass(scale, axis)` from `src/ui/tokens/spacing.ts` for new code.

## CSS pipeline (Tailwind v4)

The CSS pipeline runs through the `@tailwindcss/vite` plugin wired in `vite.config.ts`, not via PostCSS. The plugin owns `@import` resolution end-to-end and discovers `@theme` blocks across the cascade — including those reached via `@import` after non-import statements like `@source`.

Do not reintroduce `@tailwindcss/postcss` or `postcss-import` as a workaround for any ordering issue. The PostCSS path enforces the CSS spec strictly: it silently rejects every `@import` that appears after a non-`@import` statement, so any `@theme` block reached through a late `@import` never registers. That was the bug Phase 13c.6 fixed. If you see `[vite:css][postcss] @import must precede all other statements` warnings come back, something has reintroduced the PostCSS pipeline — investigate before "adding postcss-import to handle it."
