# React Design System

Mono-brand React design system. Single source of UI truth for my projects, maintained mainly through Claude Code prompts.

## Stack

- React 19 + TypeScript 5 (strict)
- Vite (build) · Vitest + Testing Library (test)
- TailwindCSS (tokens in `src/style.css`)
- Storybook (docs)
- Plop (scaffolding)

## Architecture (3 layers)

```
src/ui/
  primitives/   # Button, Input, Text, Badge, … — no composition
  components/   # Card, Modal, Table, Form, … — composed from primitives
  layouts/      # Stack, Container — structure only
  tokens/       # color, spacing, typography, radius, shadow
  hooks/        # shared behavior hooks
  providers/    # AppProvider, ThemeProvider, ConfigProvider, ToastProvider, DialogProvider
  utils/        # cn, cva, variants, css-variables
```

Where does a new thing go?

- composed of other UI → `components/`
- pure structure → `layouts/`
- indivisible → `primitives/`

Do not reintroduce atoms/molecules/organisms/templates/patterns layers. Three layers only.

## Hard rules (enforced via `.claude/rules/`)

- Every component ships with `.tsx`, `.test.tsx`, `.stories.tsx`, `index.ts`.
- Zero `any`. Props typed explicitly and exported.
- Styling via tokens / Tailwind only. No hardcoded hex / px in components.
- WCAG 2.1 AA: keyboard navigation, ARIA, focus management.
- Test coverage ≥ 80% per component.

## Commands

```bash
npm install
npm run storybook         # local dev / docs
npm run test              # vitest
npm run test:coverage     # with coverage
npm run lint              # eslint
npm run build             # library build (tsc + vite)
npm run build-storybook   # static storybook
npm run plop              # scaffold a new component
```

## Package exports

Consumers can import from:

- `@fabio.caffarello/react-design-system` — everything
- `@fabio.caffarello/react-design-system/primitives`
- `@fabio.caffarello/react-design-system/components`
- `@fabio.caffarello/react-design-system/tokens`
- `@fabio.caffarello/react-design-system/providers`
- `@fabio.caffarello/react-design-system/styles` — the CSS bundle

## Working with Claude Code

- `.claude/rules/` carries the enforced rules (components, testing, tokens).
- `.claude/agents/component-reviewer.md` reviews a component for design-system compliance.
- `.claude/commands/prune.md` removes dead-weight features safely.
- `.claude/skills/new-component/` scaffolds a new component end to end.

`CLAUDE.md` at the repo root is the entry point.

## What this is not

- Not multi-brand. Not theme-versioned. Not Figma-synced.
- Not a published component registry, not an MCP server.
- Not a playground / flow / canvas builder.

Adding any of those is the same trap that drove the prune. If a future feature only serves "external consumers" or "multi-tenant", stop and ask whether mono-brand solo actually needs it.

## Docs that survive

The docs in `docs/` cover the conventions that are still active:

- [Architecture](./docs/ARCHITECTURE.md) — the 3-layer model in detail
- [Accessibility](./docs/ACCESSIBILITY.md)
- [Testing strategy](./docs/TESTING_STRATEGY.md)
- [Storybook guide](./docs/STORYBOOK_GUIDE.md)
- [Performance](./docs/PERFORMANCE_GUIDE.md)
- [Events & states](./docs/EVENTS_STATES_GUIDE.md)
- [Advanced composition](./docs/ADVANCED_COMPOSITION.md)
- [Next.js integration](./docs/NEXTJS_SETUP.md)
- [Release process](./docs/RELEASE_PROCESS.md)
- [CI/CD](./docs/CI_CD_PIPELINE.md)
