---
description: The ./theme export contract — raw @theme token source for Tailwind v4 consumers, the inliner, and the gate
globs: src/styles/tokens.css, src/styles/**/*.css, scripts/build-tokens-css.mjs, scripts/validate-theme-export.mjs
---

# Theme export rules

Issue #234 added a second CSS export, `@fabio.caffarello/react-design-system/theme` (and the `./theme.css` alias), both resolving to `dist/tokens.css`. This file is the canonical contract for what that file is, how it is built, and what catches regressions.

## Two CSS outputs, opposite shapes

RDS publishes its tokens in **two** forms. Confusing them is the failure this rule exists to prevent.

| Export                      | File                           | Shape                                                                                                                                                         | For                                                                                                                  |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `./styles` / `./styles.css` | `dist/react-design-system.css` | **Tailwind-COMPILED** bundle: `@layer theme` (resolved `:root`), `@layer properties` (`--tw-*`), `@layer utilities` (every component class). Zero `@theme`.   | Batteries-included consumers who do **not** run Tailwind. Import it and the classes already exist.                   |
| `./theme` / `./theme.css`   | `dist/tokens.css`              | **RAW, uncompiled** `@theme {…}` blocks (primitives + semantic) + the light/dark selector overrides. No utilities, no `@layer properties`, no Tailwind entry. | Consumers who run **Tailwind v4 themselves**. They `@import` it and THEIR Tailwind generates the utilities natively. |

The compiled bundle is a dead end for a Tailwind v4 consumer: there is no `@theme` left in it to extend (`grep -c '@theme' dist/react-design-system.css` → `0`). Before `./theme`, the consumer (brasil-a-vera) was forced to hand-roll a self-referential `@theme inline { --color-fg-brand: var(--color-fg-brand); … }` bridge. Both its bridge and the RDS tokens emitted into `:root` in the same layer, the auto-referential declaration won by source order → **circular reference → empty → `rgba(0,0,0,0)`**, and 39 of 41 semantic families rendered transparent (the primary button, `bg-surface-brand-strong`, was invisible). `./theme` removes the bridge entirely: the consumer imports real `@theme` source.

## How a consumer uses it

```css
/* consumer globals.css */
@import "tailwindcss";
@import "@fabio.caffarello/react-design-system/styles" layer(rds); /* compiled RDS component classes */
@import "@fabio.caffarello/react-design-system/theme"; /* raw @theme: consumer's Tailwind generates the token utilities */
/* (no @theme inline bridge — delete it) */
```

The consumer's Tailwind reads the `@theme` blocks, emits the custom properties to `:root`, and generates `text-fg-*` / `bg-surface-*` / `border-line-*` / `ring-line-*` utilities that reference them via `var()`. Because the values stay `var()` references (NOT `@theme inline`, which would inline the resolved value and break theming), the light/dark selector overrides shipped in the same file flip the resolved color at runtime — theme-awareness is preserved by construction.

## How it is built

`src/styles/tokens.css` is the pure token entry — the same primitives → semantic → `themes/index` `@import` chain as `src/styles/index.css`, **minus** `@import "tailwindcss"`, `@source`, and the utilities tail. It is authored to mirror `index.css`'s token imports verbatim so the two never drift in token coverage.

`scripts/build-tokens-css.mjs` inlines that chain into `dist/tokens.css`. It is a deliberately minimal, dependency-free `@import` resolver: it inlines only RELATIVE imports, detects cycles via the active include stack, and does **NOT** run the CSS through Tailwind. This is the whole point — every CSS compiler we have (`@tailwindcss/vite`, Tailwind's own `compile()`) would compile the `@theme` away into `@layer theme`. We need the inverse: import resolution only, zero transformation. It runs in the `build` chain after the four Vite builds, before `build:validate`.

Adding or removing a token therefore touches only the `src/styles/*` source files (the `@theme` / selector blocks). `dist/tokens.css` tracks them on the next build — there is no hand-maintained copy.

## Hard rules

1. **`src/styles/tokens.css` carries token sources only.** No `@import "tailwindcss"`, no `@source`, no `@apply`, no utility/component CSS. Those belong to `src/styles/index.css` (the compiled `./styles` bundle). The gate fails the build if any leak into `dist/tokens.css`.
2. **The export must stay raw.** `dist/tokens.css` must contain `@theme` blocks and the `[data-theme="dark"]` override, and must NOT contain the compile artifacts that mean "this went through Tailwind" (`@layer properties`, `@layer utilities`, `--tw-*` registrations) nor leftover un-inlined `@import`. If you ever see those, the inliner regressed or the export was pointed at the compiled bundle.
3. **Never edit `dist/tokens.css` by hand.** It is a build artifact (gitignored). Edit the `src/styles/*` token files.
4. **Grepping the raw file counts comment text.** `dist/tokens.css` legitimately contains the strings `@import "tailwindcss"` and `@source` inside DOC COMMENTS (the consumer-usage example in the banner, and the "do not add these" guidance inlined from `tokens.css`'s header). A bare `grep -c 'tailwindcss' dist/tokens.css` returns a non-zero count from comment text and will mislead — the same class of trap as `index.css`'s `@source not "*.md"`. `validate-theme-export.mjs` strips CSS comments before every structural check; the comment-stripped content is the contract.

## Enforcement

`scripts/validate-theme-export.mjs` runs in `build:validate` (local `npm run build` and the CI `build` job, after `build-tokens-css.mjs` emits the file). It guards two axes:

- **Axis A — raw source survived.** On the comment-stripped file: `@theme` present, `[data-theme="dark"]` present, and none of `@import "tailwindcss"` / `@source` / `@layer properties` / `@layer utilities` / `--tw-*:` / leftover `@import`.
- **Axis B — tokens resolve to real colors, theme-aware.** (1) Drives the consumer's Tailwind via `compile()` from the installed `tailwindcss` over `@import "tailwindcss"` + the built file, and asserts it GENERATES the probe utilities (`bg-surface-brand-strong`, `text-fg-brand`, `border-line-focus`, `text-fg-on-success`) — i.e. the raw `@theme` is actually picked up. (2) Resolves each probe token's `var()` chain against the raw token maps (light = first-wins over the flat file, since `dark.css` is imported last; dark = the `[data-theme="dark"]` block overlaid) and asserts it terminates at a real color literal — not empty, not `transparent`, not a dangling/circular var — in BOTH themes. Axis B is the direct guard on the issue #234 failure mode.

Per `.claude/rules/ci-gates.md`, the gate was verified by inducing each failure it exists for: `@layer utilities` injected into `dist/tokens.css` (axis A flips red, naming the artifact); the `[data-theme="dark"]` selector renamed so the override is gone (axis A flips red on the missing override); and `--color-surface-brand-strong` rewritten to a self-reference (axis B flips red reporting the cycle and the "would render transparent" consequence) — each restored afterward by re-running the inliner.

## Docs-sync

Per `.claude/rules/docs-sync.md`: this file is derived from `src/styles/tokens.css` (the import chain), `scripts/build-tokens-css.mjs` (the inliner behaviour), `scripts/validate-theme-export.mjs` (the gate's axes), and `package.json` `exports`/`build` (the `./theme` mapping and the build-chain step). The `CLAUDE.md` "Theme export" section is a gist derived from this file; the Commands-section line for `validate-theme-export.mjs` is derived from the script's behaviour. README and `docs/NEXTJS_SETUP.md` carry the consumer-usage snippet, derived from `package.json` `exports`. Changing the build shape or the gate's scope updates all of these in the same commit.
