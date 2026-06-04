#!/usr/bin/env node
/**
 * validate-provider-canonicity.mjs
 *
 * Enforces that infra-level Provider/Context modules live ONLY in
 * `src/ui/providers/`. Per CLAUDE.md, `providers/` is the infra layer
 * (Theme/Config/Toast/Dialog) — not a UI layer like primitives /
 * components / layouts. Anything Provider-shaped that shows up
 * elsewhere is a duplicate waiting to bite.
 *
 * The specific failure mode this gate exists to prevent — observed
 * historically with `components/Toast/ToastProvider.tsx` byte-identical
 * to `providers/ToastProvider.tsx`: a future scaffold or refactor
 * imports the wrong one, gets a second React Context instance, and the
 * `useToast()` hook silently observes a context that nothing ever
 * publishes to. The toast never appears. There is no compile-time
 * signal — duplicate filenames at different paths are normal in TS —
 * so the check has to be path-based, here at the filesystem.
 *
 * Why a custom script (and not a lint rule):
 *   The rule is about file existence + location, not import strings —
 *   ESLint and dependency-cruiser walk imports, not file layout. The
 *   existing `validate-cross-layer-imports.mjs` covers the orthogonal
 *   "edges" question; this script covers "nodes" (canonical
 *   locations). Same architecture, same path-based simplicity, ~50
 *   lines, no config, clear message pointing at the offending file.
 *
 * Run with: `node scripts/validate-provider-canonicity.mjs`
 *
 * Exit codes:
 *   0 — every recognised infra Provider/Context file lives under
 *       src/ui/providers/
 *   1 — at least one duplicate exists elsewhere (each printed)
 */

import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const UI_ROOT = join(ROOT, "src", "ui");
const CANONICAL_DIR = join(UI_ROOT, "providers");

// Infra providers — the modules whose canonical home is
// `src/ui/providers/`. Both the Provider component and the Context
// object module are listed: a duplicate of either creates the
// same kind of identity-mismatch trap (different createContext()
// instances at module evaluation time → consumer hooks silently
// observe disjoint context trees).
const CANONICAL_BASENAMES = new Set([
  "ToastProvider",
  "ToastContext",
  "DialogProvider",
  "DialogContext",
  "ThemeProvider",
  "ThemeContext",
  "ConfigProvider",
  "ConfigContext",
]);

const CODE_EXT = /\.tsx?$/;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      out.push(...walk(full));
    } else if (s.isFile()) {
      out.push(full);
    }
  }
  return out;
}

const violations = [];

for (const file of walk(UI_ROOT)) {
  if (!CODE_EXT.test(file)) continue;
  // Strip the extension and take the basename to match the canonical
  // names exactly (case-sensitive — these are TypeScript module
  // identifiers, not filesystem paths in the abstract).
  const base = file.replace(/^.*\//, "").replace(CODE_EXT, "");
  if (!CANONICAL_BASENAMES.has(base)) continue;
  // Allow the canonical directory; flag everything else.
  if (file.startsWith(CANONICAL_DIR + "/")) continue;
  violations.push(relative(ROOT, file));
}

if (violations.length === 0) {
  console.log(
    "[validate-provider-canonicity] OK — every infra Provider/Context module lives under src/ui/providers/.",
  );
  process.exit(0);
}

console.error(
  `[validate-provider-canonicity] FAIL — ${violations.length} duplicate provider module(s) outside src/ui/providers/:`,
);
for (const v of violations) {
  console.error(`  ${v}`);
}
console.error(
  "\nPer CLAUDE.md, providers/ is infra. Toast/Dialog/Theme/Config Provider+Context modules must live ONLY in src/ui/providers/ — a duplicate elsewhere creates a second React Context instance and silently breaks consumer hooks. Delete the file above, or, if it is intentionally a different module, rename it to avoid the canonical basename.",
);
process.exit(1);
