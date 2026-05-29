# Design System

Mono-brand React design system. Single source of UI truth for my projects.
Built by me, maintained mainly through Claude Code prompts.

## Stack

- React 19 + TypeScript 5 (strict)
- Vite (build), Vitest + Testing Library (test)
- TailwindCSS v4 (CSS-first config via `@theme` in `src/styles/semantic/`, theme overrides in `src/styles/themes/`)
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
```

Do NOT reintroduce atoms/molecules/organisms/templates/patterns. Three layers only.
If unsure where something goes: composed of other UI → `components/`; pure structure → `layouts/`; indivisible → `primitives/`.

## Hard rules (enforced — see .claude/rules/)

- Every component ships with: `.tsx`, `.test.tsx`, `.stories.tsx`, `index.ts`.
- Zero `any`. Props typed explicitly and exported.
- Styling via tokens/Tailwind only. No hardcoded hex/px in components.
- WCAG 2.1 AA: keyboard nav, ARIA, focus management.
- Test coverage ≥ 80% per component.

## Color and tokens vocabulary

This project has a canonical semantic color vocabulary established in Phase 7 (see `PHASE_7_SEMANTIC_COLORS.md` for history). Before applying any color to a component — new or existing — read `.claude/rules/colors.md`. It covers the canonical class families, 9 principles for role choice, special cases, and an automated validation grep.

Color discipline is enforced automatically by the `ds/no-raw-color-classes` ESLint rule (`eslint-rules/`) — it runs in pre-commit, pre-push, and CI, and blocks any raw Tailwind color class or `bg-[var(--color-*)]` arbitrary syntax in shipped component source. See `.claude/rules/colors.md` for the exception-comment escape valve (Principle 3).

Same discipline for tokens generally: `.claude/rules/tokens.md`.

## Commands

```
npm run storybook         # local dev / docs
npm run test              # vitest
npm run test:coverage     # vitest with coverage
npm run lint              # eslint
npm run plop              # scaffold component
npm run build             # library build
npm run build-storybook   # static storybook
npm run storybook:smoke   # runtime smoke-test all stories (Phase 13a)
```

## What NOT to do

- Do not add features for external consumers (token versioning, component registry, migration tooling, Figma sync, MCP). This is mono-brand and solo.
- Do not add dependencies without asking. Especially heavy ones.
- Do not grow the npm script surface beyond what is listed above (plus `build:validate` and `prepare`).
- Do not write barrel files that re-export everything; keep exports explicit.
