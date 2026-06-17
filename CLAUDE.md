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

- Every component ships five files: `.tsx`, `.test.tsx`, `.accessibility.test.tsx`, `.stories.tsx`, `index.ts` — gate: `scripts/validate-file-set.mjs` (pre-push + CI). The a11y suite's four-section scaffold: `.claude/rules/testing.md`.
- Zero `any`. Props typed explicitly and exported.
- Styling via tokens/Tailwind only. No hardcoded hex/px in components.
- WCAG 2.1 AA: keyboard nav, ARIA, focus management.
- Test coverage ≥ 80% per component.
- Conventional Commits, enforced by commitlint in the `commit-msg` hook; `release.yml` runs semantic-release, which derives versions from commit types — a mistyped type misversions the release.
- Derived docs update with their sources **in the same commit** — before editing any rule or script that a doc restates, read `.claude/rules/docs-sync.md`. Mechanical half gated by `scripts/validate-docs-sync.mjs`.
- Touching a CI/CT gate requires proving it fails when it should: run the workflow's exact command, induce the bug the gate exists for, confirm a non-zero exit. See `.claude/rules/ci-gates.md`.

## Color and tokens vocabulary

Tokens describe **role**, not tone. Before applying any color to a component — new or existing — read `.claude/rules/colors.md`: the canonical class families, the 9 role-choice principles from Phase 7, special cases, and the exception-comment escape valve. Color, radius, shadow, and spacing discipline is enforced by four custom ESLint rules (`ds/no-raw-{color,radius,shadow,spacing}-classes`, error level, pre-commit + pre-push + CI) — full enforcement table and getter APIs in `.claude/rules/tokens.md`.

## Commands

```
npm run storybook         # local dev / docs
npm run test              # vitest
npm run test:coverage     # vitest with coverage
npm run lint              # eslint
npm run typecheck         # tsc --build --force tsconfig.json (project references)
npm run plop              # scaffold component — emits the full five-file set required by validate-file-set.mjs (postplop auto-formats output)
npm run build             # library build (build:validate auto-checks exports)
npm run build-storybook   # static storybook
npm run storybook:smoke   # runtime smoke-test all stories (Phase 13a)
npm run test:a11y:baseline # serial axe baseline of record (light + dark, ~11min on local SSD, workers=1) — local-only; CI runs per-theme jobs instead (see a11y note below)
npm run test:next-smoke   # build RDS + `next build` the fixtures/next-smoke Next 16 fixture against the fresh dist; asserts via the RSC client-reference manifest that the main entry creates a client boundary and ./server does not (axis-2 runtime gate — table in .claude/rules/server-entry.md), and that a one-component import from ./granular stays a fraction of the same import from the barrel (issue #208 granularity gate, route-exclusive chunk comparison).
node scripts/validate-a11y-baseline.mjs [report] [--compare ref] # gate: exits 1 if critical+serious>0 on any theme present in the report, or on errored stories; --compare asserts story-set parity against the committed a11y-baseline.json (how CI calls it)
node scripts/validate-dark-coverage.mjs # gate: fails if dark.css's two declaration blocks diverge in their token set
node scripts/validate-file-set.mjs # gate: every component dir under src/ui/{primitives,components,layouts}/ ships the five required files (grandfathered exceptions allowlisted inside the script)
node scripts/validate-cross-layer-imports.mjs # gate: primitives never import from components or layouts; layouts import primitives only
node scripts/validate-provider-canonicity.mjs # gate: infra Provider/Context modules live ONLY in src/ui/providers/ — .claude/rules/providers.md explains why duplicates silently break consumers
node scripts/validate-no-localhost-in-lockfile.mjs # fails if any `resolved` URL points to localhost (Verdaccio contamination)
node scripts/validate-docs-sync.mjs # gate: zero phantom npm scripts and zero dead relative links across all docs; line-scoped docs-ok: escape. Pre-push, CI lint. Scope + semantics: .claude/rules/docs-sync.md.
node scripts/validate-use-client-in-dist.mjs # directive gate: dist/index.{js,cjs}, dist/hooks/index.{js,cjs}, and EVERY .js in the dist/granular/ tree start with "use client"; dist/server/index.{js,cjs} must not. Runs in build:validate. Details: .claude/rules/server-entry.md.
node scripts/validate-server-entry.mjs # gate: src/ui/server.ts re-exports only server-safe modules, from concrete source files (no barrels); bundle-emission scan when dist/server/ exists. Pre-push, CI lint, build:validate. Details: .claude/rules/server-entry.md.
node scripts/validate-theme-export.mjs # gate: dist/tokens.css (the ./theme export) is raw, uncompiled @theme source — no @layer properties/utilities, no @import "tailwindcss"/@source, no leftover @import; drives the consumer's Tailwind via tailwindcss compile() to prove it generates bg-surface-brand-strong etc., and resolves each probe token's var() chain to a real color in light AND dark (issue #234 failure mode). Runs in build:validate. Details: .claude/rules/theme-export.md.
node scripts/analyze-server-safe.mjs # report: classifies every component as server-safe or client-only with first-reason chain; writes server-safe-map.json (gitignored). Run when considering a component for ./server. Not gated.
node scripts/derive-brand-secondary.mjs # report: regenerates the brand-secondary HEX stops from the ADR-024 OKLCH spec for comparison against brand.css. Not gated. See "Brand primitive scales" in .claude/rules/colors.md.
```

Four scripts/steps in `package.json` are not invoked as standalone npm scripts: `node scripts/build-tokens-css.mjs` runs in the `build` chain after the four Vite builds — it inlines the `src/styles/tokens.css` `@import` chain into `dist/tokens.css` (the raw `./theme` source) WITHOUT Tailwind compilation; then `build:validate` runs at the tail of `build` and chains four checks — `tsx scripts/validate-build-exports.ts` (verifies critical named exports survive the main bundle, every public hook survives dist/hooks/, and cross-layer sentinels survive the dist/granular/ barrel), `node scripts/validate-use-client-in-dist.mjs` (the directive invariant across all four bundles), `node scripts/validate-server-entry.mjs` (the server entry's re-export shape and emitted bundle), and `node scripts/validate-theme-export.mjs` (the `./theme` raw-`@theme` contract — issue #234); `postplop` runs after `plop` to prettier-format the generated component; `prepare` is husky's own lifecycle hook that installs git hooks during `npm install`. They count toward the script surface and should not be removed without updating this section.

The a11y gate in CI is two parallel jobs (`a11y-baseline-light` / `-dark`): each reruns the serial baseline for its theme against the prebuilt `storybook-static/` artifact, then validates with `--compare` story-set parity against the committed `a11y-baseline.json` (kills the partial-DOM false-green). Both sit in the `ci-success` aggregator's `needs` and so gate merges to `main` via branch protection, behind the UI paths-filter. Mechanics: the comment block above those jobs in `.github/workflows/ci.yml`. Why the Storybook a11y addon is NOT the gate: `.claude/rules/ci-gates.md` (known traps).

## Server entry

`@fabio.caffarello/react-design-system/server` (issue #150) ships the curated subset of RDS that React Server Components can evaluate without crossing a client boundary; the main entry (`.`) stays the unchanged default. **38 value exports today** — the source of truth is `src/ui/server.ts`, the full inventory and per-issue history live in `.claude/rules/server-entry.md`, and `node scripts/analyze-server-safe.mjs` re-derives the eligible set on demand. Server-safety has two axes: no React client API in the module or its transitive value imports (static analyser), and no unconditional function-typed prop on a DOM element (caught only by the Next 16 runtime smoke — the static analyser cannot see it). The dist is four independent Vite builds — `vite.config.ts` (main, `"use client"` banner), `vite.config.server.ts` (no banner), `vite.config.hooks.ts` (the `./hooks` entry, with banner), `vite.config.granular.ts` (the `./granular` preserveModules tree, banner per module) — no shared chunks by design. Adding a component: land it under `src/ui/`, confirm with the analyser, re-export from `src/ui/server.ts` via concrete source file (never a folder-index barrel), render it in `fixtures/next-smoke/app/page.tsx` with static props, and update `server-entry.md`'s inventory plus the export count here in the same commit. Four gates fire on regression; the enforcement table and the why-two-builds decision live in `.claude/rules/server-entry.md`.

## Granular entry

`@fabio.caffarello/react-design-system/granular` (issue #208) is the full public surface of `src/ui/index.ts` emitted as a `preserveModules` tree (`vite.config.granular.ts`, ESM-only, `"use client"` per module, all deps external, `sideEffects: ["**/*.css"]` in package.json enables re-export pruning). It exists because the main entry is a single bundle opaque to consumer tree-shaking — one component imported from `.` cost +264KB on a consumer route; the same import from `./granular` costs only its own module graph (~36KB measured, 13% of the barrel-only payload). Use `./granular` for leaf imports on size-critical routes; app-wide setup (AppProvider/providers) should keep importing from `.` (the single bundle preserves provider initialization order — see `providers-bundle.ts`). Gated by next-smoke step 5 (route-exclusive chunk ratio < 50%) and the directive walk in `validate-use-client-in-dist.mjs`; decision record in the `vite.config.granular.ts` header.

## Public hooks

Hooks live in `src/ui/hooks/` in two disjoint categories distinguished by export surface, not location: **internal** (not re-exported from `src/ui/index.ts`; free to change in any commit) and **public** (re-exported under the `Public hooks (consumer-facing)` section comment; semver-bound contract). Today's public set: `useScrollSpy` (#167). Public hooks also ship via the granular `./hooks` entry (issue #203) — a sub-1KB client bundle built by `vite.config.hooks.ts` from `src/ui/hooks-entry.ts`, so consumers don't pull the whole main bundle for one hook; both export points update in lockstep. Hooks never appear in `./server`. Promotion criteria, JSDoc contract, and conventions: `.claude/rules/hooks.md`.

## Theme export

RDS ships its design tokens **two** ways, and the distinction is load-bearing. `./styles` (`dist/react-design-system.css`) is the fully **Tailwind-compiled** bundle — `@layer theme/properties/utilities`, every component class, zero `@theme` left — for batteries-included consumers who don't run Tailwind. `./theme` (+ `./theme.css`, both → `dist/tokens.css`, issue #234) is the **raw, uncompiled** `@theme` token source plus the light/dark selector overrides, for consumers who run Tailwind v4 themselves: they `@import` it and **their** Tailwind generates the utilities (`text-fg-brand`, `bg-surface-brand-strong`, `ring-line-focus`, …) natively, theme-aware, with one source of truth and no fragile re-export bridge. `dist/tokens.css` is produced by `node scripts/build-tokens-css.mjs` (a dependency-free `@import` inliner over `src/styles/tokens.css` — never through Tailwind, or the `@theme` would compile away). Adding/removing a token touches only the `src/styles/*` source files; the export tracks them automatically. The raw-`@theme` contract (no compile artifacts, no `@import "tailwindcss"`/`@source`, every var chain resolves to a real color in both themes) is gated by `scripts/validate-theme-export.mjs` and documented in `.claude/rules/theme-export.md`.

## What NOT to do

- Do not add features for external consumers (token versioning, component registry, migration tooling, Figma sync, MCP). This is mono-brand and solo.
- Do not add dependencies without asking. Especially heavy ones.
- Do not grow the npm script surface beyond what is listed above (Commands section, including the three auto-run lifecycle scripts).
- Do not write barrel files that re-export everything; keep exports explicit.
