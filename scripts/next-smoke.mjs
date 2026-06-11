#!/usr/bin/env node
/**
 * next-smoke
 *
 * The fixture under `fixtures/next-smoke/` is a minimal Next 16 App
 * Router app whose only page is a Server Component that imports from
 * BOTH RDS entries simultaneously. Building it exercises the two
 * directive invariants the library promises end-to-end:
 *
 *   1. **Issue #148** — `import { Button } from "@fabio.caffarello/
 *      react-design-system"` from a Server Component compiles cleanly
 *      because the main bundle ships `"use client";` at its head. Next's
 *      RSC compiler reads the directive, places the import behind a
 *      client boundary, and `next build` succeeds. If the banner is
 *      lost (vite.config.ts regression, minifier strip, etc.), the
 *      build fails inside `next build` with
 *      `TypeError: (0, j.createContext) is not a function`.
 *
 *   2. **Issue #150** — `import { Text, Container } from
 *      "@fabio.caffarello/react-design-system/server"` from the same
 *      Server Component compiles AND does not cross a client boundary,
 *      because the `./server` bundle has no `"use client"` directive
 *      and exports only modules whose render is hook-free. Step 4
 *      verifies this empirically by reading Next's RSC client-reference
 *      manifest at `.next/server/app/page_client-reference-manifest.js`
 *      — the `clientModules` field of `__RSC_MANIFEST["/page"]` is the
 *      authoritative list of source modules Next placed behind a client
 *      boundary for the route. The gate asserts `dist/index.*` appears
 *      in that list (issue #148 path exercised) and `dist/server/index.*`
 *      does NOT (issue #150 path verified). The manifest is the contract;
 *      we read it directly rather than scanning chunk bodies, which
 *      Turbopack normalises in ways that produced false negatives during
 *      development of this script.
 *
 * Pipeline:
 *   1. Build RDS (both bundles) so dist/index.{js,cjs} AND
 *      dist/server/index.{js,cjs} exist as the fixture's `file:..`
 *      install will resolve them.
 *   2. npm install in the fixture (resolves `@fabio.caffarello/
 *      react-design-system` → repo root via package.json `file:..`).
 *   3. Run `next build` — the build itself is the issue-#148 gate.
 *   4. Scan `.next/server/app/` and `.next/static/chunks/` to confirm
 *      no client boundary was created for the server-safe imports.
 *
 * `--skip-build` short-circuits step 1 for fast iteration when the
 * dist hasn't changed; pass it when you've already built locally.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const fixtureDir = join(root, "fixtures/next-smoke");

if (!existsSync(fixtureDir)) {
  console.error(
    `[next-smoke] FAIL — fixture directory not found: ${fixtureDir}`,
  );
  process.exit(1);
}

const skipBuild = process.argv.includes("--skip-build");

if (!skipBuild) {
  console.log("[next-smoke] (1/5) Building RDS library...");
  execSync("npm run build", { cwd: root, stdio: "inherit" });
} else {
  console.log("[next-smoke] (1/5) Skipping RDS build (--skip-build).");
}

// Sanity: the fixture's import paths assume both entries exist on
// disk. Catch the common regression where the build pipeline emitted
// dist/index but not dist/server (e.g. a vite.config.server.ts syntax
// error swallowed by the build script chain) — issue #150 acceptance.
for (const rel of [
  "dist/index.js",
  "dist/index.cjs",
  "dist/server/index.js",
  "dist/server/index.cjs",
  "dist/granular/index.js",
]) {
  if (!existsSync(join(root, rel))) {
    console.error(
      `[next-smoke] FAIL — ${rel} missing. The fixture's two-entry import will not resolve.`,
    );
    process.exit(1);
  }
}

console.log("[next-smoke] (2/5) Installing fixture dependencies...");
execSync("npm install --no-audit --no-fund --loglevel=error", {
  cwd: fixtureDir,
  stdio: "inherit",
});

console.log("[next-smoke] (3/5) Running `next build` in fixture...");
execSync("npx --no-install next build", {
  cwd: fixtureDir,
  stdio: "inherit",
});

// Step 4 — empirical "did `./server` introduce a client boundary?"
// check.
//
// Next's App Router emits, for every page, a file
//   .next/server/app/<route>_client-reference-manifest.js
// that registers `globalThis.__RSC_MANIFEST["/<route>"] = { … }`.
// The `clientModules` field of that object is the *authoritative*
// list of source modules Next placed behind a client boundary for the
// route. Its keys are normalised paths like
//   "[project]/dist/index.js"
//   "[project]/dist/index.js <module evaluation>"
//   "[project]/node_modules/lucide-react/dist/esm/Icon.mjs"
//
// This is a much stronger signal than scanning static chunk bodies
// (Turbopack strips path comments and normalises identifiers, so a
// content grep on chunks produced false negatives during development
// of this script). The manifest is the contract; we read it directly.
//
// Acceptance:
//   - At least one clientModules key must reference the main RDS
//     entry (".../dist/index.js"). The page imports Button from it
//     and Button is a client primitive, so the boundary MUST exist.
//     Absence means the test build did not actually exercise the
//     issue-#148 path.
//   - NO clientModules key may reference the server entry
//     (".../dist/server/index.js" or any other file under dist/server/).
//     Its presence means Next was forced to treat the server entry
//     as a client boundary — the very regression issue #150 is here
//     to prevent. The likely root causes are spelled out in the
//     error message.
console.log("[next-smoke] (4/5) Reading .next RSC client-reference manifest…");

const manifestPath = join(
  fixtureDir,
  ".next/server/app/page_client-reference-manifest.js",
);
if (!existsSync(manifestPath)) {
  console.error(
    `[next-smoke] FAIL — RSC client-reference manifest not found at ${manifestPath}. The fixture's only route is "/"; if Next emitted nothing for it, the build did not run as expected.`,
  );
  process.exit(1);
}

// The manifest is a sealed-object assignment. Sandbox its evaluation
// against a controlled `globalThis` shim so we can read `__RSC_MANIFEST`
// without executing in the current Node context.
const manifestSrc = readFileSync(manifestPath, "utf-8");
const sandbox = { __RSC_MANIFEST: {} };
const fn = new Function("globalThis", manifestSrc);
fn(sandbox);

const pageManifest = sandbox.__RSC_MANIFEST["/page"];
if (!pageManifest || !pageManifest.clientModules) {
  console.error(
    `[next-smoke] FAIL — manifest at ${manifestPath} did not populate __RSC_MANIFEST["/page"].clientModules. Schema change in Next? Read the manifest by hand to confirm.`,
  );
  process.exit(1);
}

const clientModuleKeys = Object.keys(pageManifest.clientModules);

// Match keys via substring on normalised forward-slash paths to avoid
// Windows / mac path drift confusing the gate. Manifest entries on all
// platforms use `[project]/…/forward/slashes`.
const SERVER_NEEDLE = "/dist/server/index.";
const MAIN_NEEDLE = "/dist/index.";

const serverLeaks = clientModuleKeys.filter((k) => k.includes(SERVER_NEEDLE));
const mainBoundaries = clientModuleKeys.filter(
  (k) => k.includes(MAIN_NEEDLE) && !k.includes(SERVER_NEEDLE),
);

if (serverLeaks.length > 0) {
  console.error(
    `[next-smoke] FAIL — \`./server\` entry produced ${serverLeaks.length} client boundary entr(y/ies) in Next's RSC manifest:`,
  );
  for (const k of serverLeaks.slice(0, 5)) console.error(`    ${k}`);
  console.error("");
  console.error("    Likely causes (in order of priority):");
  console.error(
    '      1. dist/server/index.{js,cjs} regained a `"use client"`',
  );
  console.error(
    "         banner — `validate-use-client-in-dist.mjs` should also fail.",
  );
  console.error(
    "      2. src/ui/server.ts re-exports a module that the analyser now",
  );
  console.error(
    "         classifies as client-only — run `node scripts/analyze-server-safe.mjs`",
  );
  console.error(
    "         and compare to the server-safe-map.json that committed alongside the regression.",
  );
  console.error("      3. A barrel import slipped into src/ui/server.ts —");
  console.error("         `validate-server-entry.mjs` should catch this too.");
  process.exit(1);
}

if (mainBoundaries.length === 0) {
  console.error(
    `[next-smoke] FAIL — main entry (\`${MAIN_NEEDLE}\`) absent from Next's RSC client manifest. The page imports Button from the main entry; Next should have produced a client boundary. Absence suggests either tree-shaking removed the import or the build was a no-op.`,
  );
  console.error("    Manifest keys present (first 10):");
  for (const k of clientModuleKeys.slice(0, 10)) console.error(`      ${k}`);
  process.exit(1);
}

console.log(
  `[next-smoke] PASS — Next 16 RSC manifest confirms: main entry produced ${mainBoundaries.length} client boundary entr(y/ies); server entry produced 0.`,
);

// Step 5 — the issue #208 granularity gate.
//
// Two twin client pages render the same single component (Accordion):
//   app/granular/page.tsx       — imports from `./granular` (preserveModules tree)
//   app/barrel-control/page.tsx — imports from `.` (single pre-bundled file)
//
// Methodology mirrors the consumer's measurement that reverted the
// Accordion adoption (+264KB, issue #208): take the JS chunks each
// prerendered route HTML actually references (Turbopack emits no
// global app-build-manifest, but the HTML is the ground truth of what
// a browser downloads), then compare ONLY the chunks EXCLUSIVE to each
// route — chunks shared by both routes are the framework baseline
// (Next/React runtime) and would dilute the signal. The assertion is
// RELATIVE — the granular route's exclusive payload must be under half
// of the control's — so it self-calibrates as the library grows
// instead of pinning stale byte budgets. Measured at introduction:
// 36KB vs 277KB (13%). The failure mode it kills is unmistakable: when
// granularity regresses (preserveModules/banner/sideEffects drift
// making the bundler pull the whole barrel), both exclusive sets
// converge and the ratio approaches 1.
console.log("[next-smoke] (5/5) Granularity check (issue #208)…");

const routeChunks = (route) => {
  const htmlPath = join(fixtureDir, `.next/server/app/${route}.html`);
  if (!existsSync(htmlPath)) {
    console.error(
      `[next-smoke] FAIL — prerendered HTML not found at ${htmlPath}; cannot run the granularity check. Did the Next build layout change?`,
    );
    process.exit(1);
  }
  const html = readFileSync(htmlPath, "utf-8");
  return new Set(html.match(/\/_next\/static\/[^" ]*\.js/g) ?? []);
};
const chunkBytes = (chunkSet) =>
  [...chunkSet].reduce(
    (sum, p) =>
      sum + statSync(join(fixtureDir, ".next", p.slice("/_next/".length))).size,
    0,
  );

const granularChunks = routeChunks("granular");
const controlChunks = routeChunks("barrel-control");
const granularOnly = new Set(
  [...granularChunks].filter((c) => !controlChunks.has(c)),
);
const controlOnly = new Set(
  [...controlChunks].filter((c) => !granularChunks.has(c)),
);

if (granularOnly.size === 0 || controlOnly.size === 0) {
  console.error(
    `[next-smoke] FAIL — expected both routes to have exclusive chunks (granular-only: ${granularOnly.size}, control-only: ${controlOnly.size}). If the sets fully overlap, the two imports resolved to the same modules and the comparison is void.`,
  );
  process.exit(1);
}

const granularBytes = chunkBytes(granularOnly);
const controlBytes = chunkBytes(controlOnly);
const ratio = granularBytes / controlBytes;

if (ratio >= 0.5) {
  console.error(
    `[next-smoke] FAIL — granular route's exclusive JS is ${(ratio * 100).toFixed(1)}% of the barrel-control route's (${granularBytes} vs ${controlBytes} bytes); expected < 50%.`,
  );
  console.error(
    "    Importing one component from `./granular` pulled (most of) the barrel —",
  );
  console.error(
    "    the regression issue #208 exists to prevent. Likely causes: preserveModules",
  );
  console.error(
    "    dropped from vite.config.granular.ts; `sideEffects` removed from package.json;",
  );
  console.error(
    "    or the `./granular` export remapped to the single-bundle entry.",
  );
  process.exit(1);
}

console.log(
  `[next-smoke] PASS — granular route's exclusive JS ${granularBytes} bytes vs barrel-control's ${controlBytes} bytes (${(ratio * 100).toFixed(1)}%). One-component import stays granular.`,
);
