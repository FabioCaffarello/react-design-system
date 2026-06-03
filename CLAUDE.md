# Design System

Mono-brand React design system. Single source of UI truth for my projects.
Built by me, maintained mainly through Claude Code prompts.

## Stack

- React 19 + TypeScript 5 (strict)
- Vite (build), Vitest + Testing Library (test)
- TailwindCSS v4 via `@tailwindcss/vite` plugin (CSS-first config via `@theme` in `src/styles/semantic/`, theme overrides in `src/styles/themes/`)
- Storybook (docs)
- Plop (scaffolding new components)

## Architecture (3 layers — keep it this simple)

```
src/ui/
  primitives/   # Button, Input, Text, Box, Icon — no composition
  components/   # Card, Modal, Table, Form — composed from primitives
  layouts/      # Stack, Container, Grid — structure only
  tokens/       # colors, spacing, typography, radius, shadow
  hooks/        # shared behavior hooks
  providers/    # global context providers (theme/config/toast/dialog) — infra, not a UI layer
```

Do NOT reintroduce atoms/molecules/organisms/templates/patterns. Three layers only.
If unsure where something goes: composed of other UI → `components/`; pure structure → `layouts/`; indivisible → `primitives/`.

## Hard rules (enforced — see .claude/rules/)

- Every component ships with: `.tsx`, `.test.tsx`, `.stories.tsx`, `index.ts`.
- Zero `any`. Props typed explicitly and exported.
- Styling via tokens/Tailwind only. No hardcoded hex/px in components.
- WCAG 2.1 AA: keyboard nav, ARIA, focus management.
- Test coverage ≥ 80% per component.
- Docs like `docs/STORYBOOK_GUIDE.md` and this file restate conventions whose canonical source is elsewhere (`.claude/rules/`, `package.json`). Before editing any rule or script that a doc restates — not just the doc itself — read `.claude/rules/docs-sync.md` and update every derived doc in the same commit.

## Color and tokens vocabulary

This project has a canonical semantic color vocabulary established in Phase 7 (see `PHASE_7_SEMANTIC_COLORS.md` for history). Before applying any color to a component — new or existing — read `.claude/rules/colors.md`. It covers the canonical class families, 9 principles for role choice, special cases, and an automated validation grep.

Color discipline is enforced automatically by the `ds/no-raw-color-classes` ESLint rule (`eslint-rules/`) — it runs in pre-commit, pre-push, and CI, and blocks any raw Tailwind color class or `bg-[var(--color-*)]` arbitrary syntax in shipped component source. See `.claude/rules/colors.md` for the exception-comment escape valve (Principle 3).

The same enforcement shape extends to **radius** (`ds/no-raw-radius-classes`), **shadow** (`ds/no-raw-shadow-classes`), and **spacing** (`ds/no-raw-spacing-classes`): raw `rounded-md` / `shadow-md` / `p-4` etc. in production source are blocked at the `error` level; use `getRadiusClass(scale)` / `getShadowClass(scale)` / `getSpacingClass(scale, direction)` from `src/ui/tokens/`. Same `// exception: <reason>` escape valve. See `.claude/rules/tokens.md` for the full enforcement table.

## Commands

```
npm run storybook         # local dev / docs
npm run test              # vitest
npm run test:coverage     # vitest with coverage
npm run lint              # eslint
npm run plop              # scaffold component (postplop auto-formats output)
npm run build             # library build (build:validate auto-checks exports)
npm run build-storybook   # static storybook
npm run storybook:smoke   # runtime smoke-test all stories (Phase 13a)
npm run test:a11y:baseline # serial axe baseline of record (light + dark, ~11min on local SSD, workers=1)
node scripts/validate-a11y-baseline.mjs # gate: exits 1 if critical+serious>0 on either theme (reads a11y-baseline.json)
node scripts/validate-dark-coverage.mjs # gate: fails if dark.css's two declaration blocks diverge in their token set
node scripts/validate-file-set.mjs # gate: every component dir under src/ui/{primitives,components,layouts}/ ships .tsx/.test.tsx/.stories.tsx/index.ts (grandfathered exceptions allowlisted inside the script)
node scripts/validate-cross-layer-imports.mjs # gate: primitives never import from components or layouts; layouts import primitives only (no allowlist — main currently passes clean)
node scripts/validate-no-localhost-in-lockfile.mjs # fails if any `resolved` URL points to localhost (Verdaccio contamination)
```

Three scripts in `package.json` are not invoked directly: `build:validate` runs at the tail of `build` to verify the emitted dist exports compile (`tsx scripts/validate-build-exports.ts`); `postplop` runs after `plop` to prettier-format the generated component; `prepare` is husky's own lifecycle hook that installs git hooks during `npm install`. They count toward the script surface and should not be removed without updating this section.

The `a11y-baseline` job in `.github/workflows/ci.yml` runs both in sequence (`test:a11y:baseline` then the validator) and is part of the `ci-success` aggregator's `needs` list, so it gates merges to `main` via branch protection. The validator is the actual enforcement mechanism — `parameters.a11y.test: "error"` in `.storybook/preview.tsx` is cosmetic (no `@storybook/addon-vitest` plugin wired into the vitest workspace), see the long comment there.

## What NOT to do

- Do not add features for external consumers (token versioning, component registry, migration tooling, Figma sync, MCP). This is mono-brand and solo.
- Do not add dependencies without asking. Especially heavy ones.
- Do not grow the npm script surface beyond what is listed above (Commands section, including the three auto-run lifecycle scripts).
- Do not write barrel files that re-export everything; keep exports explicit.
