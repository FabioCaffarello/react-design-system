# React Design System

Mono-brand React design system. Single source of UI truth for my projects, maintained mainly through Claude Code prompts.

## Installation

```bash
npm install @fabio.caffarello/react-design-system
```

`react@19` and `react-dom@19` are peer dependencies.

## Usage

Import components and the bundled stylesheet. No Tailwind setup required in your project — the DS ships the full token cascade (tokens, light/dark theme overrides) in one CSS file.

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

- Every component ships with `.tsx`, `.test.tsx`, `.accessibility.test.tsx`, `.stories.tsx`, `index.ts`.
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
npm run storybook:smoke   # runtime smoke-test all stories
npm run test:a11y:baseline # serial axe baseline (light + dark, ~11min on local SSD)
node scripts/validate-a11y-baseline.mjs # gate: exits 1 if critical+serious>0 on either theme
npm run plop              # scaffold a new component
```

## Package exports

Consumers can import from:

- `@fabio.caffarello/react-design-system` — the default entry. Everything: providers, hooks, all primitives, components, layouts, tokens. The emitted bundle carries `"use client";` so RSC frameworks (Next App Router 15+/16, etc.) accept it from a Server Component without crashing on `React.createContext`. The whole module is treated as a client boundary by the consumer's bundler.
- `@fabio.caffarello/react-design-system/server` — the opt-in server entry (issue #150). Re-exports only the components whose render tree is safe to evaluate inside a React Server Component: presentational primitives (`Text`, `Skeleton`, `Spinner`, `Progress`, `Chip`, `ErrorMessage`, `Info`), layout (`Container`, `Stack`), and structural / informational components (`Breadcrumb`, `Timeline`, `AutocompleteOption`, `DialogHeader`, `DialogFooter`, `DrawerHeader`, `DrawerFooter`, `HeaderActions`, `HeaderNavigation`, `MenuSeparator`, `NavbarSeparator`, `TableCell`). The bundle carries NO `"use client"` directive, so importing from it in a Server Component does NOT cross a client boundary — useful for SEO-critical / first-paint-critical routes where the shell shouldn't ship JS to the client.
- `@fabio.caffarello/react-design-system/hooks` — the granular public-hooks entry (issue #203). Re-exports only the public hooks (today: `useScrollSpy`) as a tiny standalone client bundle (<1KB) with every dependency external. Use it when a route's client component needs a hook but nothing else from RDS: importing a hook from the main entry pulls the whole pre-bundled barrel into the route's client JS (+277KB minified measured on a Next 16 route), because the single-file `"use client"` bundle is opaque to the consumer bundler's tree-shaking. The same hooks remain available from the main entry for back-compat.
- `@fabio.caffarello/react-design-system/granular` — the granular client entry (issue #208). The SAME public surface as the default entry, emitted as a `preserveModules` tree (one module per source file, `"use client"` on every module, all deps external). Use it for leaf component imports on size-critical routes: importing one component from the default entry pulls the whole pre-bundled barrel (+264KB minified measured for `Accordion` on a Next 16 route); the same import from `./granular` ships only that component's module graph (~36KB, 13% of the barrel payload — gated in CI). Keep app-wide setup (`AppProvider`/providers) on the default entry: the single bundle preserves provider initialization order by construction.
- `@fabio.caffarello/react-design-system/styles` — the bundled CSS. Same stylesheet regardless of which JS entry you import.

The JS entries can be mixed in one Server Component — `import { Text } from "…/server"; import { Button } from "…"` is the normal pattern. The server entry is purely additive; consumers who never use it see no behavioural change.

```tsx
// app/profile/page.tsx — a Next 16 App Router Server Component.
import { Button } from "@fabio.caffarello/react-design-system";
import { Text, Container } from "@fabio.caffarello/react-design-system/server";

export default function Profile() {
  return (
    <Container>
      {/* Renders on the server, no JS shipped to the client for this part. */}
      <Text variant="heading" as="h1">
        Profile
      </Text>
      {/* Button is a Client Component; Next inserts the boundary. */}
      <Button variant="primary">Edit</Button>
    </Container>
  );
}
```

Sub-entries (`/primitives`, `/components`, `/tokens`, `/providers`) were removed in Phase 13d — they had been silently broken for external consumers since v1.0.0 because cross-chunk references to `cva` and other shared utilities failed at runtime. A single main entry collapses that class of bug structurally; tree-shaking still works at the named-export level via any modern bundler. The `./server`, `./hooks`, and `./granular` entries sidestep the same regression by each being their OWN independent Vite build with all third-party deps externalised — no chunks are shared between entries, and `./granular`'s preserveModules layout has no extracted chunks at all (source modules map 1:1 to output files).

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
