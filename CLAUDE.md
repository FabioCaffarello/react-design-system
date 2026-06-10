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
npm run test:next-smoke   # build RDS + `next build` the fixtures/next-smoke Next 16 fixture against the fresh dist; asserts via the RSC client-reference manifest that the main entry creates a client boundary and ./server does not. Axis-2 runtime gate — enforcement table in .claude/rules/server-entry.md.
node scripts/validate-a11y-baseline.mjs [report] [--compare ref] # gate: exits 1 if critical+serious>0 on any theme present in the report, or on errored stories; --compare asserts story-set parity against the committed a11y-baseline.json (how CI calls it)
node scripts/validate-dark-coverage.mjs # gate: fails if dark.css's two declaration blocks diverge in their token set
node scripts/validate-file-set.mjs # gate: every component dir under src/ui/{primitives,components,layouts}/ ships the five required files (grandfathered exceptions allowlisted inside the script)
node scripts/validate-cross-layer-imports.mjs # gate: primitives never import from components or layouts; layouts import primitives only
node scripts/validate-provider-canonicity.mjs # gate: infra Provider/Context modules live ONLY in src/ui/providers/ — .claude/rules/providers.md explains why duplicates silently break consumers
node scripts/validate-no-localhost-in-lockfile.mjs # fails if any `resolved` URL points to localhost (Verdaccio contamination)
node scripts/validate-docs-sync.mjs # gate: zero phantom npm scripts and zero dead relative links across all docs; line-scoped docs-ok: escape. Pre-push, CI lint. Scope + semantics: .claude/rules/docs-sync.md.
node scripts/validate-use-client-in-dist.mjs # dual directive gate: dist/index.{js,cjs} starts with "use client"; dist/server/index.{js,cjs} must not. Runs in build:validate. Details: .claude/rules/server-entry.md.
node scripts/validate-server-entry.mjs # gate: src/ui/server.ts re-exports only server-safe modules, from concrete source files (no barrels); bundle-emission scan when dist/server/ exists. Pre-push, CI lint, build:validate. Details: .claude/rules/server-entry.md.
node scripts/analyze-server-safe.mjs # report: classifies every component as server-safe or client-only with first-reason chain; writes server-safe-map.json (gitignored). Run when considering a component for ./server. Not gated.
node scripts/derive-brand-secondary.mjs # report: regenerates the brand-secondary HEX stops from the ADR-024 OKLCH spec for comparison against brand.css. Not gated. See "Brand primitive scales" in .claude/rules/colors.md.
```

Three scripts in `package.json` are not invoked directly: `build:validate` runs at the tail of `build` and chains three checks — `tsx scripts/validate-build-exports.ts` (verifies critical named exports survive the bundle), `node scripts/validate-use-client-in-dist.mjs` (the dual directive invariant), and `node scripts/validate-server-entry.mjs` (the server entry's re-export shape and emitted bundle); `postplop` runs after `plop` to prettier-format the generated component; `prepare` is husky's own lifecycle hook that installs git hooks during `npm install`. They count toward the script surface and should not be removed without updating this section.

The a11y gate in CI is two parallel jobs (`a11y-baseline-light` / `-dark`): each reruns the serial baseline for its theme against the prebuilt `storybook-static/` artifact, then validates with `--compare` story-set parity against the committed `a11y-baseline.json` (kills the partial-DOM false-green). Both sit in the `ci-success` aggregator's `needs` and so gate merges to `main` via branch protection, behind the UI paths-filter. Mechanics: the comment block above those jobs in `.github/workflows/ci.yml`. Why the Storybook a11y addon is NOT the gate: `.claude/rules/ci-gates.md` (known traps).

## Server entry

`@fabio.caffarello/react-design-system/server` (issue #150) ships the curated subset of RDS that React Server Components can evaluate without crossing a client boundary; the main entry (`.`) stays the unchanged default. **32 value exports today** — the source of truth is `src/ui/server.ts`, the full inventory and per-issue history live in `.claude/rules/server-entry.md`, and `node scripts/analyze-server-safe.mjs` re-derives the eligible set on demand. Server-safety has two axes: no React client API in the module or its transitive value imports (static analyser), and no unconditional function-typed prop on a DOM element (caught only by the Next 16 runtime smoke — the static analyser cannot see it). The dist is two independent Vite builds — `vite.config.ts` with the `"use client"` banner, `vite.config.server.ts` without, no shared chunks by design. Adding a component: land it under `src/ui/`, confirm with the analyser, re-export from `src/ui/server.ts` via concrete source file (never a folder-index barrel), render it in `fixtures/next-smoke/app/page.tsx` with static props, and update `server-entry.md`'s inventory plus the export count here in the same commit. Four gates fire on regression; the enforcement table and the why-two-builds decision live in `.claude/rules/server-entry.md`.

## Public hooks

Hooks live in `src/ui/hooks/` in two disjoint categories distinguished by export surface, not location: **internal** (not re-exported from `src/ui/index.ts`; free to change in any commit) and **public** (re-exported under the `Public hooks (consumer-facing)` section comment; semver-bound contract). Today's public set: `useScrollSpy` (#167). Hooks never appear in `./server`. Promotion criteria, JSDoc contract, and conventions: `.claude/rules/hooks.md`.

## What NOT to do

- Do not add features for external consumers (token versioning, component registry, migration tooling, Figma sync, MCP). This is mono-brand and solo.
- Do not add dependencies without asking. Especially heavy ones.
- Do not grow the npm script surface beyond what is listed above (Commands section, including the three auto-run lifecycle scripts).
- Do not write barrel files that re-export everything; keep exports explicit.
