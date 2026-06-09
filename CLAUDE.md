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

- Every component ships with: `.tsx`, `.test.tsx`, `.accessibility.test.tsx`, `.stories.tsx`, `index.ts`. The a11y suite is a separate file from the behavior test — it mirrors `Header.accessibility.test.tsx` as the canonical scaffold (ARIA Labels and Roles / Keyboard Navigation / Focus Management / Screen Reader Support). Enforced by `scripts/validate-file-set.mjs` in pre-push and CI.
- Zero `any`. Props typed explicitly and exported.
- Styling via tokens/Tailwind only. No hardcoded hex/px in components.
- WCAG 2.1 AA: keyboard nav, ARIA, focus management.
- Test coverage ≥ 80% per component.
- Docs like `docs/STORYBOOK_GUIDE.md` and this file restate conventions whose canonical source is elsewhere (`.claude/rules/`, `package.json`). Before editing any rule or script that a doc restates — not just the doc itself — read `.claude/rules/docs-sync.md` and update every derived doc in the same commit.
- When you add or modify a CI/CT gate (workflow step, validate script, lint rule, pre-push hook), prove it fails when it should fail — run the workflow's exact command locally, induce the bug the gate exists for, confirm a non-zero exit. The `-p` vs `--build` mismatch from Phase 0 is the canonical "false-green for months" trap. See `.claude/rules/ci-gates.md`.

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
npm run typecheck         # tsc --build --force tsconfig.json (project references)
npm run plop              # scaffold component (postplop auto-formats output)
npm run build             # library build (build:validate auto-checks exports)
npm run build-storybook   # static storybook
npm run storybook:smoke   # runtime smoke-test all stories (Phase 13a)
npm run test:a11y:baseline # serial axe baseline of record (light + dark, ~11min on local SSD, workers=1)
npm run test:next-smoke   # build RDS + `next build` a Next 16 fixture against the freshly-built dist. Imports Button from `.` AND Text/Container from `./server` in one Server Component, then reads Next's RSC client-reference manifest to assert: main entry produced a client boundary (issue #148 acceptance #2), server entry produced none (issue #150 acceptance). Fixture lives in fixtures/next-smoke/.
node scripts/validate-a11y-baseline.mjs # gate: exits 1 if critical+serious>0 on either theme (reads a11y-baseline.json)
node scripts/validate-dark-coverage.mjs # gate: fails if dark.css's two declaration blocks diverge in their token set
node scripts/validate-file-set.mjs # gate: every component dir under src/ui/{primitives,components,layouts}/ ships .tsx/.test.tsx/.stories.tsx/index.ts (grandfathered exceptions allowlisted inside the script)
node scripts/validate-cross-layer-imports.mjs # gate: primitives never import from components or layouts; layouts import primitives only (no allowlist — main currently passes clean)
node scripts/validate-provider-canonicity.mjs # gate: infra Provider/Context modules (Toast/Dialog/Theme/Config) live ONLY in src/ui/providers/ — duplicates elsewhere create disjoint Context instances and silently break consumer hooks
node scripts/validate-no-localhost-in-lockfile.mjs # fails if any `resolved` URL points to localhost (Verdaccio contamination)
node scripts/validate-use-client-in-dist.mjs # dual directive gate: dist/index.{js,cjs} MUST start with `"use client";` (issue #148 — RSC frameworks crash on `React.createContext` without it) AND dist/server/index.{js,cjs} MUST NOT (issue #150 — the server entry is the opt-out boundary). The main banner is injected by `rollupOptions.output.banner` in vite.config.ts; the server config has none by design. Wired into `build:validate`.
node scripts/validate-server-entry.mjs # gate: every value re-export in src/ui/server.ts resolves to a server-safe source file (transitive walk via scripts/lib/server-safe.mjs); no folder-index barrels; if dist/server/ exists, the emitted bundle calls no React client API. Pre-push, CI lint job, build:validate.
node scripts/analyze-server-safe.mjs # report: classifies every <Name>/<Name>.tsx under src/ui/{primitives,components,layouts}/ as server-safe or client-only with first-reason chain. Writes server-safe-map.json (gitignored). Run manually when adding a new component to decide if it can join the ./server entry; not gated.
```

Three scripts in `package.json` are not invoked directly: `build:validate` runs at the tail of `build` and chains three checks — `tsx scripts/validate-build-exports.ts` (verifies critical named exports survive the bundle), `node scripts/validate-use-client-in-dist.mjs` (verifies the dual directive invariant on both dist entries), and `node scripts/validate-server-entry.mjs` (verifies the server entry's re-export shape and emitted bundle); `postplop` runs after `plop` to prettier-format the generated component; `prepare` is husky's own lifecycle hook that installs git hooks during `npm install`. They count toward the script surface and should not be removed without updating this section.

The `a11y-baseline` job in `.github/workflows/ci.yml` runs both in sequence (`test:a11y:baseline` then the validator) and is part of the `ci-success` aggregator's `needs` list, so it gates merges to `main` via branch protection. The validator is the actual enforcement mechanism — `parameters.a11y.test: "error"` in `.storybook/preview.tsx` is cosmetic (no `@storybook/addon-vitest` plugin wired into the vitest workspace), see the long comment there.

## Server entry

`@fabio.caffarello/react-design-system/server` (issue #150) ships a curated subset of RDS that React Server Components can evaluate without crossing a client boundary. The main entry (`.`) stays the default; consumers who never `import from "…/server"` see no behavioural change.

- **What's in it (32 exports today).** Inventory counts **value exports**, not "top-level components" — subcomponents of a compound (Card.Header, DialogHeader, etc.) count individually because they are individually re-exported from `src/ui/server.ts` and imported by named export by consumers. Primitives (10): `Badge`, `Chip`, `ErrorMessage`, `Info`, `Label`, `Progress`, `Separator`, `Skeleton`, `Spinner`, `Text`. Layouts (2): `Container`, `Stack`. Components (20): `Breadcrumb`, `Card`, `CardHeader` (Card.Header), `CardTitle` (Card.Title), `CardSubtitle` (Card.Subtitle), `CardActions` (Card.Actions), `CardBody` (Card.Body), `DialogHeader` (Dialog.Header), `DialogFooter` (Dialog.Footer), `DrawerHeader` (Drawer.Header), `DrawerFooter` (Drawer.Footer), `HeaderActions`, `HeaderNavigation`, `MenuSeparator` (Menu.Separator), `NavbarSeparator`, `PageHeader`, `Stat`, `StatGroup`, `TableCell` (Table.Cell), `Timeline`. The source of truth is `src/ui/server.ts`; the analyser at `node scripts/analyze-server-safe.mjs` re-derives the eligible set from source on demand. `AutocompleteOption` was originally promoted in #150 but the hooks-only analyser missed that it emits `<div onClick={handleClick}>` unconditionally (its `onSelect` is required, so no guard pattern is available); the #160 sweep removed it from this entry. It stays available via the main entry. `PageHeader` was added in #178: its body never used a React client API, but a barrel import `import { Text } from "../../primitives"` made the static analyser walk through `primitives/index.ts` into `Input` (`useMemo`); replacing it with a concrete-source-file import and removing the vestigial `"use client"` directive flipped the classification with no behavioural change. **`Stat` + `StatGroup` shipped in #166** (consolidated with #164 — the original two issues proposed near-identical components for the same visual archetype, a row/grid of metrics with 1-px dividers; the verdict merged them into one compound). `<StatGroup layout="strip"|"grid" cols={2|3|4}>` is the container; `<Stat>` is the atom (value/label/hint/icon/align/tone). Both ship in `./server`. The 1-px divider is achieved by a single piece of CSS — container carries `bg-line-default` with `gap-px`, each `Stat` masks its own area with `bg-surface-base`. Empty state: `value === null || undefined` → em-dash with `aria-label="No data"`; `0` and `""` are legitimate values. `tone` tints the `hint` ONLY — `value`/`label`/`icon` always stay neutral; the JSDoc records this as a semver-bound contract so a future expansion is intentional, not implicit. **The Card compound (Card.Header / Title / Subtitle / Actions / Body) shipped in #165** — five presentational subcomponents in their own source files, all server-safe; the consumer composes client children (Buttons, Links) inside `<Card.Actions>`, same RSC mechanic that already lets `DialogFooter` host client Buttons. The root Card gained an opt-in `asSection` prop with a dev-only `console.warn` guard against anonymous-landmark (`<section>` without `aria-labelledby` or `aria-label`) — pattern mirrors `asChild` in `Button.tsx`, dead-code-eliminated in prod via `process.env.NODE_ENV !== "production"`.
- **What's NOT in it.** Every component that uses any of `useState`/`useEffect`/`useId`/`useRef`/`useMemo`/`useCallback`/`useContext`/`useReducer`/`useLayoutEffect`/`useImperativeHandle`/`useTransition`/`useDeferredValue`/`useSyncExternalStore`/`useInsertionEffect`/`useOptimistic`/`createContext` in its own body OR transitively via any value import inside `src/ui/`. Plus — a second category the static analyser does NOT see, caught only by the runtime smoke (`next-smoke.mjs`): any component that assigns a function-typed prop to a DOM element UNCONDITIONALLY (the Card bug, the AutocompleteOption bug). RSC fails serialisation with "Event handlers cannot be passed to Client Component props" on that shape. Pass-through handlers that come from consumer props (`onClick={onClick}` where `onClick` is `undefined` when not passed) are fine; the failing shape is a local closure assigned every render. `Button`, `Input`, all providers, `Dialog`, `Drawer`, `Table`, `Tabs`, `SideNavbar`, and ~100 others fall in the hooks category. Type-only imports do not count — they're erased pre-bundle.
- **How the dist gets built.** Two independent `vite build` invocations: the existing `vite.config.ts` (unchanged, emits `dist/index.{js,cjs}` with the `"use client";` banner) and the new `vite.config.server.ts` (emits `dist/server/index.{js,cjs}` with NO banner and every third-party dep externalised). Two independent Rollup graphs, no shared chunks — the v1.0.0 cva cross-chunk regression cannot fire across them. The choice not to do single-build-multi-entry was deliberate; see `.claude/rules/server-entry.md` for the comparison against the issue's original proposal and against the preserveModules + directive-plugin approach.
- **Adding a component to the server entry.** Land it under `src/ui/`, run `node scripts/analyze-server-safe.mjs` to confirm its transitive imports stay clean, add an explicit re-export in `src/ui/server.ts` (concrete source-file path — NEVER a folder-index barrel, that would pull client siblings in transitively), **render it in `fixtures/next-smoke/app/page.tsx` with minimal static props (no functions)**, and update both `.claude/rules/server-entry.md`'s inventory and this section in the same commit per `.claude/rules/docs-sync.md`. The fixture step is the #160 reinforcement — it exercises every server-safe component in a real Server Component build so the runtime catches the "function-as-DOM-prop unconditionally" class of bug that the static analyser cannot see.
- **Rules and enforcement details.** `.claude/rules/server-entry.md`. Four gates fire on regression: source-level (`validate-server-entry.mjs`), artifact-level dual directive (`validate-use-client-in-dist.mjs`), bundle-emission scan (third check inside `validate-server-entry.mjs` once `dist/server/` exists), and end-to-end Next 16 manifest read plus full-surface render (`next-smoke.mjs` step 3 build + step 4 manifest; the page renders every component in `src/ui/server.ts`). Each was verified to fail when it should fail per `.claude/rules/ci-gates.md` — including the #160 reinforcement: reverting the Card guard makes `next build` exit non-zero with the same RSC serialisation error the consumer reported.

## Public hooks

Hooks live in `src/ui/hooks/`. Two disjoint categories, distinguished by export surface, not by location:

- **Internal hooks** (`useFocusTrap`, `useAutoFocus`, `useFocusRestore`, `useCollapsible`, etc. — eight today) are NOT re-exported from `src/ui/index.ts`. They're implementation detail of RDS components and may change in any commit without semver consideration.
- **Public hooks** are re-exported from `src/ui/index.ts` under the **`Public hooks (consumer-facing)`** section comment. They carry a semver-bound contract: signatures, defaults, edge cases, and behaviours don't change without `feat:`/`fix:`/breaking discipline. Today's set: **`useScrollSpy`** (issue #167, the first one).

Hooks NEVER appear in `./server` — they call React client APIs by definition. The full discipline (promotion criteria internal → public, JSDoc contract requirements, location/test conventions, the one-way-only nature of promotion) lives in `.claude/rules/hooks.md`. Adding a public hook requires the rule-file enumeration update + this section's "today's set" update in the same commit per `.claude/rules/docs-sync.md`.

## What NOT to do

- Do not add features for external consumers (token versioning, component registry, migration tooling, Figma sync, MCP). This is mono-brand and solo.
- Do not add dependencies without asking. Especially heavy ones.
- Do not grow the npm script surface beyond what is listed above (Commands section, including the three auto-run lifecycle scripts).
- Do not write barrel files that re-export everything; keep exports explicit.
