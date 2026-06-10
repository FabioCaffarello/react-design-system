"use client";

// ============================================================================
// Public hooks entry (`./hooks`) — issue #203
// ============================================================================
// Granular client entry that re-exports ONLY the public hooks (the semver-
// bound set defined in `.claude/rules/hooks.md` and re-exported from
// `src/ui/index.ts` under the `Public hooks (consumer-facing)` section).
//
// Why this entry exists: the main entry (`.`) is a single pre-bundled
// `"use client"` file by design, opaque to the consumer's tree-shaking —
// importing just `useScrollSpy` from it pulled the whole barrel (+277KB
// minified into the consumer's route, measured in issue #203). This entry is
// its own independent Vite build (`vite.config.hooks.ts`), a few KB, with
// every dependency external.
//
// Rules:
//   - Re-export from concrete source files only (`./hooks/useScrollSpy`),
//     never a folder barrel — same discipline as `src/ui/server.ts`.
//   - Only PUBLIC hooks. Internal hooks (`useFocusTrap`, …) stay out: they
//     carry no stability contract and exporting them here would publish them.
//   - Every public hook must be re-exported BOTH here and from
//     `src/ui/index.ts` (the main entry keeps back-compat; this entry is the
//     lean path). Adding one updates `.claude/rules/hooks.md` and the
//     CLAUDE.md gist in the same commit, per `.claude/rules/docs-sync.md`.
// ============================================================================

export { useScrollSpy } from "./hooks/useScrollSpy";
export type { UseScrollSpyOptions } from "./hooks/useScrollSpy";
