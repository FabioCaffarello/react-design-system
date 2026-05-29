# React Design System

Mono-brand React design system. Single source of UI truth for my projects, maintained mainly through Claude Code prompts.

## Installation

```bash
npm install @fabio.caffarello/react-design-system
```

`react@19` and `react-dom@19` are peer dependencies.

## Usage

Import components and the bundled stylesheet. No Tailwind setup required in your project — the DS ships the full token cascade (tokens, dark mode, theme variants) in one CSS file.

```tsx
import { Button, Card, Form } from "@fabio.caffarello/react-design-system";
import "@fabio.caffarello/react-design-system/styles";

export default function App() {
  return (
    <div className="bg-surface-canvas text-fg-primary">
      <Button variant="primary">Hello</Button>
    </div>
  );
}
```

Use `bg-surface-canvas` / `text-fg-primary` (or any other DS semantic class) on your page wrapper so the surface follows the active theme — hardcoding `background: #fff` will look broken on a dark-mode machine.

## Theming

The DS follows the user's OS color scheme preference automatically via the `prefers-color-scheme` media query. A consumer in a dark-mode environment sees the dark variant of every token without any setup in the app.

### Override the theme

Force light or dark regardless of OS preference by setting the attribute or class on `<html>`:

```html
<html data-theme="light">
  ...
</html>
<!-- or -->
<html data-theme="dark">
  ...
</html>
```

Class-based opt-in works too:

```html
<html class="light">
  ...
</html>
<html class="dark">
  ...
</html>
```

### Theme variants

Beyond light/dark, the DS ships three style variants — `creative`, `minimal`, `tech`. Apply via `data-variant` attribute or `variant-<name>` class. Variants compose with the light/dark mode, so a `creative` variant in dark mode is its own coherent surface.

```html
<html data-variant="creative">
  ...
</html>
```

## Stack

- React 19 + TypeScript 5 (strict)
- Vite (build) via `@tailwindcss/vite` plugin
- Vitest + Testing Library (test)
- TailwindCSS v4 — CSS-first config via `@theme` in `src/styles/`
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

- `@fabio.caffarello/react-design-system` — all components, providers, hooks, tokens
- `@fabio.caffarello/react-design-system/styles` — the bundled CSS

Sub-entries (`/primitives`, `/components`, `/tokens`, `/providers`) were removed in Phase 13d — they had been silently broken for external consumers since v1.0.0 because cross-chunk references to `cva` and other shared utilities failed at runtime. A single entry collapses the cross-chunk class of bug structurally; tree-shaking still works at the named-export level via any modern bundler.

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
