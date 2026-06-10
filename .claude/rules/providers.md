---
description: Infra Provider/Context modules live ONLY in src/ui/providers/ — duplicates create disjoint Contexts
globs: src/ui/providers/**, src/ui/**/*Provider*.tsx, src/ui/**/*Context*.tsx, scripts/validate-provider-canonicity.mjs
---

# Provider rules

`src/ui/providers/` is the **infra layer**. It hosts the global
context providers — currently Toast / Dialog / Theme / Config — and the
small bundle/AppProvider plumbing that wires them together. Per
`CLAUDE.md`, providers are _not_ a UI layer; they are infra, parallel
to primitives / components / layouts rather than another tier within
them.

## The one rule

**Every infra Provider/Context module lives ONLY in `src/ui/providers/`.**

The set of "infra Provider/Context" module basenames the project
recognises today:

- `ToastProvider`, `ToastContext`
- `DialogProvider`, `DialogContext`
- `ThemeProvider`, `ThemeContext`
- `ConfigProvider`, `ConfigContext`

A file with any of those basenames anywhere else under `src/ui/` is a
violation, regardless of how reasonable the location looks (e.g.
`src/ui/components/Toast/ToastProvider.tsx` next to the matching Toast
components is exactly the trap this rule exists to prevent).

## Why this is its own gate (and not "just discipline")

`React.createContext()` runs at module evaluation time and returns a
fresh Context object on every call. Two files named `ToastContext.tsx`
at two different paths produce **two unrelated Context instances** —
even when their source is byte-for-byte identical, even when they
declare types with the same name. A consumer that imports `<ToastProvider>`
from one path and `useToast()` from the other ends up using disjoint
contexts. The Provider sets state in Context A; the hook reads from
Context B; the toast never appears. TypeScript can't see this — the
two contexts have the same surface, and TS has no notion of
"identity" across module instances.

The historical case this rule closes: `src/ui/components/Toast/ToastProvider.tsx`
and `src/ui/components/Toast/ToastContext.tsx` survived the relocation
of Toast infra to `src/ui/providers/` as byte-identical orphans. The
public `index.ts` already pointed at the canonical `providers/`
modules, so no consumer was bitten yet, but `plop` scaffolds into
`components/` and the next scaffold that imports "the Toast provider
that's right here" would have produced a silent break.

## Enforcement

`scripts/validate-provider-canonicity.mjs` walks `src/ui/` and fails on
any `.tsx?` file whose basename is in the recognised set above and
whose path is NOT under `src/ui/providers/`. The script runs:

- in pre-push (`.husky/pre-push`), next to the other structural
  validators;
- in CI, as a step in the `lint` job (`.github/workflows/ci.yml`), so
  the gate also fires on PRs that bypass pre-push.

The script has no allowlist by design — there is no legitimate reason
for a second `ToastContext.tsx` to live outside `providers/`. If you
need a _different_ Provider in a different location, give it a
different name (e.g. `LocalToastContainer`, `ScopedThemeOverlay`),
documented and intentional.

The list of recognised basenames is a literal `Set` in the validator.
Adding a new infra provider means:

1. Land the new `XyzProvider.tsx` / `XyzContext.tsx` under
   `src/ui/providers/`.
2. Add `XyzProvider` and `XyzContext` to `CANONICAL_BASENAMES` in
   `scripts/validate-provider-canonicity.mjs` in the same commit.
3. Mention it in the list above (this file) and in the CLAUDE.md
   Commands section if the script's behaviour changes, per
   `.claude/rules/docs-sync.md`.

The gate failure message is intentionally specific: it names the
offending file, restates the invariant, and points the reader to two
remediations (delete, or rename out of the canonical set).
