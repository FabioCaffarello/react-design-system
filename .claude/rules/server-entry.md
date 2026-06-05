# Server entry rules

Issue #150 added a second entry point `@fabio.caffarello/react-design-system/server` that ships only the components whose render tree is safe to run inside a React Server Component. This file is the canonical contract for what may live in that entry, how to add to it, and what catches regressions.

## The shape

Two independent Vite builds emit two independent bundles:

- `dist/index.{js,cjs}` — the **main entry** (`.`). Starts with `"use client";` (banner injected by `vite.config.ts`). Carries everything: providers, hooks, primitives, components, layouts, tokens. This is the unchanged default; consumers who import nothing from `./server` see identical behaviour to RDS 2.x.
- `dist/server/index.{js,cjs}` — the **server entry** (`./server`). Has **no** `"use client"` banner. Re-exports a curated subset audited as server-safe. Externalises every third-party dep (`react`, `react-dom`, `react/jsx-runtime`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `react-hook-form`) so directives those packages ship with reach the consumer's bundler intact.

The two bundles share no chunks. The cva cross-chunk regression that defeated the original multi-entry layout (see `vite.config.ts` header) cannot fire across separate Rollup graphs.

## What counts as "server-safe"

A module is server-safe if it AND every value-imported source inside `src/ui/` is free of the React client APIs `useState`, `useEffect`, `useLayoutEffect`, `useReducer`, `useContext`, `useRef`, `useImperativeHandle`, `useCallback`, `useMemo`, `useId`, `useTransition`, `useDeferredValue`, `useSyncExternalStore`, `useInsertionEffect`, `useOptimistic`, and `createContext`.

The current set is **25 components**, listed in `src/ui/server.ts` and re-derived on demand by `node scripts/analyze-server-safe.mjs`:

- **Primitives (10)**: `Badge`, `Chip`, `ErrorMessage`, `Info`, `Label`, `Progress`, `Separator`, `Skeleton`, `Spinner`, `Text`.
- **Layouts (2)**: `Container`, `Stack`.
- **Components (13)**: `AutocompleteOption`, `Breadcrumb`, `Card`, `DialogHeader`, `DialogFooter`, `DrawerHeader`, `DrawerFooter`, `HeaderActions`, `HeaderNavigation`, `MenuSeparator`, `NavbarSeparator`, `TableCell`, `Timeline`.

Badge, Label, Separator, and Card were promoted in issue #155: each previously held `useMemo` (and Card additionally `useCallback`) calls that were purely decorative — they memoized class-string concatenations and a single `onClick !== undefined` boolean, not render-driving state. Inlining those expressions removed the only barrier without changing observable behaviour or perf (string concatenation is nanoseconds; `React.memo` on the component is preserved and continues to gate re-renders at the consumer-prop boundary).

Type-only imports (`import type { … }` and `import { type X, … }` inline specifiers) are erased by TypeScript before the bundler runs and are therefore ignored by the analyser. Bare specifiers (anything not starting with `.` or `/`) are not walked because the server build externalises every third-party dep — see the next section for why that matters.

## Hard rules

1. **No barrel imports in `src/ui/server.ts`.** Every re-export must point at a concrete source file (`./primitives/Text/Text`, not `./primitives`). Folder indexes re-export every sibling — `primitives/index.ts` re-exports `Input.tsx`, which is client. A barrel import pulls the whole sibling tree into the server bundle's graph through the analyser walk, and the gate fails immediately. The first inventory analysis on issue #150 was wrong by exactly this mechanism — see the issue body and the `validate-server-entry.mjs` check 2 message.
2. **`src/ui/server.ts` must not start with `"use client"`.** The whole point of the entry is that it doesn't carry the directive. The `validate-use-client-in-dist.mjs` gate asserts the negative on the emitted bundle.
3. **Externalise, don't bundle, third-party deps in `vite.config.server.ts`.** `lucide-react`'s `LucideContext = createContext({})` lives in `node_modules/lucide-react/dist/esm/context.mjs` with a per-file `"use client"` directive — exactly the kind of `createContext` call that crashes the server runtime when it lands in a bundle without a containing directive. Bundling the module strips the directive and the call ends up in `dist/server/index.js`. The fix is to externalise lucide-react (and friends) so the consumer's bundler keeps the directives where they belong. `validate-server-entry.mjs` check 3 catches this regression by reading the React import aliases in the emitted bundle and grepping for their call sites.
4. **Adding a new server-safe component is a four-step commit.**
   - Land the component under `src/ui/{primitives,components,layouts}/`.
   - Run `node scripts/analyze-server-safe.mjs` and confirm the new component appears in the server-safe list (i.e. its transitive value imports are also server-safe). If not, refactor until it is, OR accept that it stays main-entry-only.
   - Add the explicit re-export to `src/ui/server.ts`, importing from the concrete source file (rule 1) and re-exporting the corresponding `*Props` type.
   - Update this rules file and the inventory line in `CLAUDE.md` (Server entry section). Docs-sync per `.claude/rules/docs-sync.md`.
5. **The analyser is the source of truth, not the inventory in this file.** If the lists drift, the analyser wins by default — the inventory here is a human-readable snapshot at the time of writing, the same way `CLAUDE.md`'s Commands section is a snapshot of `package.json` scripts. Rule 4 step 4 exists to keep the snapshot fresh; CI's `validate-server-entry.mjs` gate guarantees the `server.ts` re-export list never silently drifts even if the snapshot does.

## Enforcement summary

| Gate                                      | What it checks                                                                                                                                                                                                                                                                                                                                                                          | When it runs                                                                                          |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `scripts/lib/server-safe.mjs`             | Shared analyser core — `classify(file)`, `iterImports(src)`, `resolveImport(spec, fromFile)`. Used by the two scripts below.                                                                                                                                                                                                                                                            | Imported by both.                                                                                     |
| `scripts/analyze-server-safe.mjs`         | Walks every component file under `src/ui/{primitives,components,layouts}/`, classifies each, writes `server-safe-map.json` (gitignored).                                                                                                                                                                                                                                                | Run manually when adding components.                                                                  |
| `scripts/validate-server-entry.mjs`       | (1) every `from "…"` in `src/ui/server.ts` resolves to a server-safe module; (2) no barrel imports; (3) when `dist/server/` exists, the emitted bundle has zero React client API call sites.                                                                                                                                                                                            | `pre-push`, CI `lint` job, and `build:validate` after every `npm run build`.                          |
| `scripts/validate-use-client-in-dist.mjs` | Dual directive check: `dist/index.{js,cjs}` MUST start with `"use client";` (issue #148); `dist/server/index.{js,cjs}` MUST NOT (issue #150).                                                                                                                                                                                                                                           | `build:validate`, CI `build` job.                                                                     |
| `scripts/next-smoke.mjs`                  | Builds a Next 16 fixture that imports `Button` from `.` and `Text`/`Container` from `./server` in the same Server Component, then reads the RSC client-reference manifest at `.next/server/app/page_client-reference-manifest.js` and asserts that `dist/index.*` appears in `clientModules` (issue #148 path exercised) and `dist/server/index.*` does NOT (issue #150 path verified). | CI `next-smoke` job (downloads the `dist` artifact, runs `node scripts/next-smoke.mjs --skip-build`). |

Per `.claude/rules/ci-gates.md`, each new gate was verified by inducing the failure it exists for: `"use client"` injected at the top of `dist/server/index.js` (the dual gate AND next-smoke flip red); a client primitive added to `src/ui/server.ts` (`validate-server-entry.mjs` flips red, naming the offender and its chain); a barrel import (same gate, distinct message); `lucide-react` removed from the external list and the build rerun (`validate-server-entry.mjs` check 3 flips red with the React-API alias and call-site count).

## Why two builds (and not multi-entry)

Three options were on the table for issue #150:

- **A — single Vite build with two entries** (the issue's proposal). Rolled out exactly as described, this recreates the pre-v1.0.0 cva cross-chunk bug: Rollup notices `cva` is imported by both entries and extracts it to a shared chunk that both bundles import via relative path. The shared chunk's path layout breaks once unpacked at the consumer. The proposal's `external: []` doesn't dodge this — `external` is about marking specifiers as runtime-resolved, not about preventing chunk extraction. Rejected.
- **B — `preserveModules: true` plus a per-file directive plugin.** This is what Radix/Mantine do. Reasonable, but the cost is high: a custom Rollup plugin to maintain, a wholesale reshape of `dist/` that consumers see, and a much larger surface for regression on the main entry. The user-facing payoff is ~22 components in a project that ships single-bundle by design. Rejected on cost/benefit.
- **C — two independent `vite build` invocations.** Each is its own Rollup graph. The main build stays single-bundle and unchanged. The server build is its own single-bundle with everything external. They duplicate `cn`/`cva` runtime by ~1.5KB gz, in exchange for **zero** risk of cva cross-chunk leaks. Chosen.

The main build's `external: ["react", "react-dom"]` deliberately stays narrow — that's the historical decision to bundle cva and friends to dodge the v1.0.0 bug. The server build's `external: [react, react-dom, react/jsx-runtime, react/jsx-dev-runtime, lucide-react, class-variance-authority, clsx, tailwind-merge, react-hook-form]` deliberately goes wide — there is no cross-chunk failure mode here, and going wide is exactly what keeps `lucide-react`'s directives intact at the consumer boundary. The two configs make opposite tradeoffs by design.
