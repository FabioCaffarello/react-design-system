#!/usr/bin/env node
/**
 * validate-server-entry
 *
 * Issue #150 enforcement gate. The server entry point `src/ui/server.ts`
 * re-exports a curated subset of the design system that the React
 * Server Components runtime can evaluate without crashing. The
 * curation is verified at build time by the transitive analyser in
 * `scripts/lib/server-safe.mjs`; this script is the CI/pre-push gate
 * that fails when a re-export drifts to client-only.
 *
 * What can cause that drift:
 *   - Adding a new re-export here without first running the analyser.
 *   - A re-exported file gaining a hook call (useState, useMemo, useId,
 *     etc.) or createContext call in its own body.
 *   - A transitive import inside `src/ui/` gaining one — e.g.
 *     primitives/Chip/Chip.tsx today imports `cn`, `cva` and tokens
 *     only; if a refactor pulled in `useContext` somewhere on that
 *     chain, every component re-exported by server.ts via Chip would
 *     regress.
 *   - Replacing a direct source-file import (`./primitives/Text/Text`)
 *     with a folder-index import (`./primitives`) that re-exports the
 *     whole barrel — the barrel pulls Input.tsx, which uses hooks.
 *
 * What this gate checks, in order:
 *
 *   1. **Inventory parity.** Every value-import source path inside
 *      src/ui/server.ts resolves to a real file under src/ui/, and
 *      that file classifies as server-safe under the analyser. Type-
 *      only imports are skipped (they're erased pre-bundle).
 *
 *   2. **No barrel imports.** server.ts must import each re-exported
 *      component from its concrete `.tsx` source path, NEVER from a
 *      folder index. Barrels routinely re-export sibling client
 *      components, which would pull them into the server bundle by
 *      transitive walk (this is the exact bug that defeated issue
 *      #150's first inventory analysis: `import { Text } from
 *      "../../primitives"` drags Input.tsx in via the barrel).
 *
 *   3. **Bundle freshness, when dist/server/ exists.** If a previous
 *      `npm run build` populated dist/server/index.js, the gate also
 *      asserts no leftover client-API call survives in the emitted
 *      bundle (catches a stray dependency being un-externalised, e.g.
 *      a future build config drift that bundles lucide-react). This
 *      check is opportunistic — it doesn't trigger a build, but if
 *      the bundle is already there, it's free to verify.
 *
 * The discipline (test the gate by inducing a failure) is documented in
 * `.claude/rules/ci-gates.md`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  classify,
  iterImports,
  resolveImport,
  UI,
  ROOT,
  rel,
} from "./lib/server-safe.mjs";

const SERVER_ENTRY = join(UI, "server.ts");
const failures = [];

if (!existsSync(SERVER_ENTRY)) {
  console.error(
    `[validate-server-entry] FAIL — server entry not found at ${rel(SERVER_ENTRY)}`,
  );
  process.exit(1);
}

const entrySrc = readFileSync(SERVER_ENTRY, "utf-8");

// Re-exported source paths inside src/ui/. We track type-only
// separately because they're allowed to point at anything (types are
// erased) but it's still helpful to surface them in the report so a
// reader can see the full re-export shape.
const valueImports = [];
const typeImports = [];

for (const { spec, isTypeOnly } of iterImports(entrySrc)) {
  if (!spec.startsWith(".")) continue; // bare specifier — not our concern here
  if (isTypeOnly) {
    typeImports.push(spec);
    continue;
  }
  valueImports.push(spec);
}

// Check 2: no folder-index ("barrel") imports.
// A folder index has no file extension and resolves to <dir>/index.ts.
// We flag those because the barrel pulls every sibling re-export into
// the server bundle's graph, defeating the whole point of `server.ts`.
const barrelFailures = [];
for (const spec of valueImports) {
  const resolved = resolveImport(spec, SERVER_ENTRY);
  if (!resolved) {
    failures.push(
      `${rel(SERVER_ENTRY)}: import "${spec}" cannot be resolved to a file under src/ui/`,
    );
    continue;
  }
  if (/\/index\.(tsx?|jsx?)$/.test(resolved)) {
    barrelFailures.push({ spec, resolved: rel(resolved) });
  }
}
for (const b of barrelFailures) {
  failures.push(
    `${rel(SERVER_ENTRY)}: barrel import "${b.spec}" resolves to ${b.resolved} — server.ts must import from concrete source files, not folder indexes (the barrel would pull client siblings into the server bundle).`,
  );
}

// Check 1: every value-imported source classifies as server-safe.
const cache = new Map();
const verdicts = [];
for (const spec of valueImports) {
  const target = resolveImport(spec, SERVER_ENTRY);
  if (!target) continue; // already reported above
  const v = classify(target, cache);
  verdicts.push({ spec, target: rel(target), ...v });
  if (v.verdict === "client") {
    const offender = v.chain[v.chain.length - 1];
    failures.push(
      `${rel(SERVER_ENTRY)}: re-export from "${spec}" is client-only — ${v.reason} (offender: ${rel(offender)})`,
    );
  }
}

// Check 3: if the server bundle exists from a previous build, scan it
// for client APIs. Catches the lucide-react family of "I forgot to
// externalise this dep" regressions, where the analyser source-walk is
// clean but the build leaks a third-party module-top createContext
// into the emitted bundle.
const DIST_JS = join(ROOT, "dist/server/index.js");
if (existsSync(DIST_JS)) {
  const bundle = readFileSync(DIST_JS, "utf-8");
  // The minifier renames `useState`/`createContext`/etc. to short
  // identifiers, so we cannot grep the literal name in the bundle
  // body. But the IMPORT from "react" preserves the original specifier
  // names in the `import { ... }` clause, and we can read the *aliases*
  // assigned to client APIs to know what to grep for as call sites.
  //
  // We look for any line that imports from "react" with a clause and
  // pull `<orig> as <alias>` entries for known client APIs.
  const CLIENT_APIS = [
    "useState",
    "useEffect",
    "useLayoutEffect",
    "useReducer",
    "useContext",
    "useRef",
    "useImperativeHandle",
    "useCallback",
    "useMemo",
    "useId",
    "useTransition",
    "useDeferredValue",
    "useSyncExternalStore",
    "useInsertionEffect",
    "useOptimistic",
    "createContext",
  ];

  const aliasFor = new Map();
  // Find the `from "react"` import clauses; tolerate multiple in case
  // ESM + CJS were both inlined. The regex must also accept a default
  // binding before the brace (`import D, { … } from "react"`) — this
  // is exactly the shape Rollup emits for the React import after
  // minification (`import te, { useContext as oe, … } from "react"`).
  // An earlier version that anchored `import\s*\{` directly missed
  // every React import in our actual bundles, producing a silent
  // false-green — a textbook ci-gates.md "test the gate" finding.
  const reactImportRe =
    /import\s+(?:[A-Za-z_$][\w$]*\s*,\s*)?\{([^}]+)\}\s*from\s*["']react["']/g;
  let im;
  while ((im = reactImportRe.exec(bundle)) !== null) {
    const clauses = im[1].split(",").map((s) => s.trim());
    for (const c of clauses) {
      const m = c.match(/^([A-Za-z_$][\w$]*)\s+as\s+([A-Za-z_$][\w$]*)$/);
      if (m && CLIENT_APIS.includes(m[1])) {
        aliasFor.set(m[1], m[2]);
        continue;
      }
      // No alias — same name in the bundle (rare with minifier).
      const bareMatch = c.match(/^([A-Za-z_$][\w$]*)$/);
      if (bareMatch && CLIENT_APIS.includes(bareMatch[1])) {
        aliasFor.set(bareMatch[1], bareMatch[1]);
      }
    }
  }

  for (const [api, alias] of aliasFor.entries()) {
    // Look for the alias being CALLED — followed by `(`. Minifier may
    // glue it directly: `Et(Ft)` or `($t)({})`.
    const callRe = new RegExp(`\\b${alias}\\s*\\(`, "g");
    const matches = bundle.match(callRe) || [];
    if (matches.length > 0) {
      failures.push(
        `dist/server/index.js: emitted bundle calls React.${api}() — alias "${alias}", ${matches.length} site(s). The server entry must be free of client-runtime calls. Either the source has a regression (run \`node scripts/analyze-server-safe.mjs\`) or a third-party dep was bundled instead of externalised in vite.config.server.ts (the lucide-react family of bugs).`,
      );
    }
  }
} else {
  console.log(
    "[validate-server-entry] note: dist/server/index.js not present — bundle scan skipped. Run `npm run build` to enable check #3.",
  );
}

if (failures.length > 0) {
  console.error("[validate-server-entry] FAIL");
  for (const msg of failures) console.error(`  - ${msg}`);
  console.error("");
  console.error(`Server entry: ${rel(SERVER_ENTRY)}`);
  console.error(
    `Verified re-exports: ${verdicts.length} value, ${typeImports.length} type-only.`,
  );
  console.error(
    "Source of truth for the server-safe set: scripts/lib/server-safe.mjs",
  );
  process.exit(1);
}

console.log(
  `[validate-server-entry] OK — ${verdicts.length} value re-exports from ${rel(SERVER_ENTRY)} all classify server-safe; ${typeImports.length} type-only re-exports skipped (erased pre-bundle).`,
);
