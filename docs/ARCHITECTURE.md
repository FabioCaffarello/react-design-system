# Architecture

Mono-brand React design system in 3 layers. No more.

## Layout

```
src/ui/
  primitives/   # indivisible UI
  components/   # composed UI (built from primitives)
  layouts/      # structural wrappers
  tokens/       # color, spacing, typography, radius, shadow, …
  hooks/        # shared behavior hooks
  providers/    # AppProvider + theme/config/toast/dialog providers
  utils/        # cn, cva, variants, css-variables
```

Every component directory carries four files and nothing else:

```
ComponentName/
  ComponentName.tsx          # implementation
  ComponentName.test.tsx     # vitest + testing-library
  ComponentName.stories.tsx  # storybook
  index.ts                   # single explicit export
```

## The three layers

### `primitives/`

Indivisible UI: takes props in, renders DOM, no composition of other DS components.

Examples: Button, Input, Text, Badge, Avatar, Checkbox, Radio, Switch, Tooltip, Spinner, Skeleton, Chip, Progress, Separator, Slider, Label, ErrorMessage, Info, NavLink, Collapsible, Select, Textarea.

Rules:

- forwardRef + spread `...rest` onto the root element.
- Tailwind classes driven by tokens. Never a raw hex/px.
- Accessible name, keyboard support, visible focus ring.
- No imports from `components/` or `layouts/`.

### `components/`

Composed UI: at least one primitive or other component under the hood.

Examples: Card, Form (+FormField), Tabs, Dropdown, Menu, Drawer, Dialog, Modal, Toast, Table, DataGrid, Stepper, Timeline, Breadcrumb, Pagination, Popover, ColorPicker, DatePicker, TimePicker, MultiSelect, Autocomplete, EmptyState, FileUpload, Header, Navigation, PageHeader, Rating, SearchInput, SideNavbar, ButtonGroup, Accordion, CommandPalette, LoginBox, DashboardLayout, DataTablePattern, FormWizardPattern, SearchAndFilterPattern.

Rules:

- May import from `primitives/`, `layouts/`, `tokens/`, `hooks/`, `utils/`.
- No imports from peer components except through their public barrel.

### `layouts/`

Structural wrappers — no domain content, no business logic.

Examples: Stack, Container.

Rules:

- Imports from `primitives/` allowed (rare). Nothing from `components/`.

## Support directories

### `tokens/`

Single source of visual truth. Semantic tokens (`--color-surface`, `--color-text-muted`) sit on top of primitive scales. Light/dark are CSS variable variants of one token set.

When something new is needed, extend the scale. Never hardcode in a component.

### `providers/`

Top-level React context providers. `AppProvider` composes the rest in the documented order: `ThemeProvider` → `ConfigProvider` → `ToastProvider` → `DialogProvider`. They are re-exported from `providers/providers-bundle.ts` to keep them in the same module boundary (Next.js / Turbopack initialization order).

### `hooks/`

Pure behavior hooks reused across components: `useCollapsible`, `useContextSelector`, `useProviderComposition`, `shallowEqual`.

### `utils/`

Pure helpers: `cn` (class merge), `cva` (class-variance-authority wrapper), `variants`, `css-variables`, `tailwind-safelist`.

## Build output

`vite build` emits one entry per surface so consumers can pick subpaths:

```
dist/
  index.js         # everything
  primitives/
  components/
  tokens/
  providers/
  react-design-system.css
```

`package.json` `exports` mirrors these. `./styles` is a CSS-only entry.

## The rules CLAUDE.md enforces

- One source of visual values (tokens). No raw hex/px in a component.
- A new component ships `.tsx` + `.test.tsx` + `.stories.tsx` + `index.ts`.
- Zero `any`. Props are typed and exported as `ComponentNameProps`.
- WCAG 2.1 AA: keyboard nav, ARIA, focus ring.
- Coverage ≥ 80% per component.

The per-rule details live in `.claude/rules/components.md`, `.claude/rules/testing.md`, `.claude/rules/tokens.md`. They are read by the `component-reviewer` agent and the `new-component` skill.

## What this architecture does **not** include

- No `atoms/`, `molecules/`, `organisms/`, `templates/`, `patterns/` layers. They collapsed into the three above.
- No `extensions/`, no flow/playground/theme-builder. Heavy product features live in the consuming app, not in the library.
- No component registry, no token versioning, no Figma sync, no MCP server. The repo is mono-brand solo; those are multi-tenant problems.
- No CDN distribution channel. Consumers install from npm.

If you find yourself reaching for one of the above, that is the signal the design system is being asked to solve a problem outside its scope. Push the feature into the consumer or skip it.
