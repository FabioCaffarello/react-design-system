---
description: Internal vs public hook categories, the promotion contract, and JSDoc requirements
globs: src/ui/hooks/**, src/ui/index.ts
---

# Hook rules

Hooks in this codebase fall in two disjoint categories. The distinction is **not** about location (both live under `src/ui/hooks/`) — it's about the **export surface** and the **stability contract** that comes with it. Get this wrong and either (a) a consumer ends up depending on a hook that the next PR refactors freely, or (b) an internal hook accumulates contract-grade JSDoc and a behavioural API that nothing public ever exercises. Both are real costs in a project maintained mainly by Claude Code prompts; the rule below keeps the two categories from blurring.

## The two categories

### Internal hooks (default)

- **Where:** `src/ui/hooks/*.{ts,tsx}`.
- **Who consumes them:** components inside this codebase, never the end user.
- **Export surface:** **not** re-exported from `src/ui/index.ts`. Reachable only via deep imports inside the package (`./hooks/useFocusTrap` and similar relative paths), which consumers don't write.
- **Stability:** none. Signatures, names, and behaviours may change in any commit without semver consideration — they're implementation detail of the components that own them.
- **Today's set:** `useFocusTrap`, `useAutoFocus`, `useFocusRestore`, `useCollapsible`, `useContextSelector`, `useProviderComposition`, `createGenericContext`, plus the utility shims `focusable` and `shallowEqual`. All of these are used exclusively by RDS components (`Dialog`, `Drawer`, `Header`, etc.) and have **never** been part of the public surface.

### Public hooks (consumer-facing)

- **Where:** also `src/ui/hooks/*.{ts,tsx}`. Same folder; the distinction lives in the export, not the path.
- **Who consumes them:** end users of the package, importing from `@fabio.caffarello/react-design-system` or — the lean path — from `@fabio.caffarello/react-design-system/hooks`.
- **Export surface:** explicit re-export from **two** places, kept in lockstep: (1) `src/ui/index.ts`, under the **`Public hooks (consumer-facing)`** section comment — the comment is load-bearing; it's what tells the next agent "this is part of the public API contract". Adding a hook above or outside that comment by accident is the failure mode this rule exists to prevent. (2) `src/ui/hooks-entry.ts`, the source of the granular `./hooks` entry (issue #203) — a public hook missing there silently denies consumers the lean import path. `scripts/validate-build-exports.ts` (in `build:validate`) fails when `dist/hooks/index.js` lacks a hook from its `publicHooks` list; that list updates together with this file's "today's set".
- **Stability:** semver-bound. Signature changes and behavioural changes go through `feat:` / `fix:` / breaking changes the same way any public component does. Renames are breaking. Default-value changes are breaking when observable.
- **Today's set:** `useScrollSpy` (the first one, established by #167).

The two categories share the folder but **must not** share an entry in `src/ui/index.ts`. An internal hook accidentally re-exported under the public section becomes public the moment it ships; reverting it later is a breaking change. The opposite mistake — a public hook NOT re-exported — silently denies the consumer the API the docs promise.

## The `./hooks` entry (issue #203)

The granular entry exists because the main entry is a single pre-bundled `"use client"` file by design (see the vite.config.ts header for the cva cross-chunk history), which is opaque to the consumer bundler's tree-shaking: importing just `useScrollSpy` from `.` measured **+277KB minified** on a Next 16 route — the whole barrel. `vite.config.hooks.ts` is a third independent Vite build (same no-shared-chunks discipline as the server build) that emits `dist/hooks/index.{js,cjs}` from `src/ui/hooks-entry.ts`: a sub-1KB bundle with every third-party dep external and the `"use client"` banner ON (hooks are client by definition — see "Never in `./server`" below; `validate-use-client-in-dist.mjs` asserts the directive is present, the inverse of its server-dist check). `hooks-entry.ts` follows the `server.ts` discipline: concrete source-file re-exports only, never a folder barrel — a barrel would pull every internal hook (and through them, components) into the lean bundle.

Adding a public hook therefore touches: `src/ui/index.ts` (public section), `src/ui/hooks-entry.ts`, the `publicHooks` list in `scripts/validate-build-exports.ts`, this file's "today's set", and the `CLAUDE.md` gist — same commit, per `.claude/rules/docs-sync.md`. Internal hooks never appear in `hooks-entry.ts` for the same reason they never appear in `index.ts`: shipping is publishing.

## Promotion criteria (internal → public)

A hook moves to the public surface only when **all three** of the following are true. Failing any one is a reason to keep it internal.

1. **There's a consumer-side use case** documented in a recipe (`src/docs/guides/*.mdx`) or a published issue. Speculative public APIs accumulate maintenance cost without payback.
2. **The hook is generic.** It does not depend on internal state shapes from a specific RDS component (e.g., reading `DialogContext` directly). If the hook is fundamentally tied to one component's internals, it stays internal — the component exposes whatever escape valve it needs via props instead.
3. **The contract is stable.** "Stable" means: the parameters, return shape, defaults, and edge-case handling have settled. If you'd still be tempted to rename a parameter or change a default in the next month, wait. Internal-to-public is a one-way trip — there is no graceful demotion.

Demotion is hostile to consumers and should not be planned for; treat the public surface as ratchet-only.

## JSDoc requirements for public hooks

Public hooks ship with a **behavioural contract** documented in the JSDoc, not just types. The block above the exported function must cover, in order:

1. **One-line purpose.** What it does in one sentence, in plain language.
2. **Behavioural contract section** (use a `### Behavioural contract` subhead or equivalent). Each of the following gets at least one bullet:
   - **Return value.** What the type means semantically. When is a `null`/`undefined`/empty return produced? Don't say "returns null" if the type already says that — say _when_ it returns null.
   - **Tie-breaking / ordering.** If the hook handles ambiguous input (multiple matches, simultaneous events, etc.), document which case wins and why.
   - **Edge cases.** Empty input, missing DOM elements, invalid arguments. State whether these throw, return a default, or are silently ignored.
   - **Cleanup.** What the hook owns (event listeners, observers, timers) and when it releases them. "Cleanup on unmount" is the minimum; many hooks also clean up on dependency change.
   - **Re-observation / re-subscription on input change.** Which inputs trigger a fresh subscription. If the hook uses a stability sentinel (e.g., `Array.join`) instead of identity, document the caveat — the consumer needs to know whether passing a fresh array literal is safe.
   - **SSR safety.** What the hook returns on the server, what it accesses inside `useEffect` (and therefore avoids on the server), and how it behaves in the first client render before commit.
3. **Why this is a hook and not a component.** A short paragraph that captures the design decision recorded in the issue. This blocks future agents from "promoting" the hook to a component without re-reading the verdict.
4. **`@example` block.** A complete, runnable snippet — preferably the canonical recipe. Show the imports, the surrounding `"use client"` boundary, and the composition with whatever component(s) the hook is meant to drive.
5. **`@param` / `@returns`.** Standard TSDoc, one line each. The deep semantics live in the contract section above; `@param` is the short hint.

`useScrollSpy.ts` is the worked example to mirror — its JSDoc covers every slot listed here, including the deps-sentinel caveat and the SSR contract.

## Location, naming, and tests

- **File:** `src/ui/hooks/useXxx.ts` (no extension change for hooks that use TS only; `.tsx` only if the hook returns JSX or uses JSX in tests).
- **Test:** `src/ui/hooks/useXxx.test.tsx`. The `.tsx` extension is preferred for tests because `renderHook` patterns often use a wrapper component. Tests use `@testing-library/react`'s `renderHook` (precedent: `useFocusRestore.test.tsx`, `useAutoFocus.test.tsx`).
- **Directive:** every hook file starts with `"use client";`. Hooks call React APIs that the RSC runtime cannot evaluate — even hooks that are technically pure today should carry the directive so they read as client to the static analyser and to any future consumer that crosses an RSC boundary.
- **Browser-API mocks:** APIs missing from `jsdom` (`IntersectionObserver`, `ResizeObserver`, `matchMedia`, etc.) are mocked either globally in `src/setupTests.ts` (when the mock is a no-op and shared) or per-test via `vi.stubGlobal` (when the test needs to drive the callback). The per-test approach is preferred for behavioural tests because it lets the test control the timing. `useScrollSpy.test.tsx` is the worked example for `IntersectionObserver`.

## Never in `./server`

Hooks are never re-exported from `src/ui/server.ts`. This is not a regression — hooks call React client APIs (`useState`, `useEffect`, `useRef`, …) by definition. A hook that _could_ run on the server would not be a hook; it would be a pure function. The server-entry analyser correctly classifies any module that calls a React client API as client; the validators (`validate-server-entry`, `validate-use-client-in-dist`) gate the `./server` surface accordingly. If you find yourself wanting to put a hook in the server entry, you actually want a pure function — write it as such, in `src/ui/utils/` or a tokens module.

## Enforcement (today)

The export-surface distinction is enforced by **convention + reading the index file**, not by a script. Reasonable next steps if drift appears:

- A test that imports `src/ui/index.ts` programmatically and asserts that every exported `use*` symbol appears in a known allowlist (mirrors the `validate-server-entry` shape).
- An ESLint rule that flags any `export { useFoo }` from `src/ui/index.ts` that is not inside a marked region.

Neither is wired yet because the public-hook set has cardinality 1. Add a script when the second public hook lands and the cost of "remember to add the comment" exceeds the cost of automation. Until then, the section comment in `src/ui/index.ts` and this rule file are the contract; PR review enforces them.
