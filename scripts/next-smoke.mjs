#!/usr/bin/env node
/**
 * next-smoke
 *
 * Issue #148 acceptance criterion #2: the RDS test surface includes a
 * minimal Next 16 App Router app where primitives are consumed from a
 * Server Component without a manual `"use client"` wrapper.
 *
 * What this script does:
 *   1. Build the RDS library (so dist/index.{js,cjs} reflect the head
 *      of vite.config.ts, including the `"use client";` banner).
 *   2. Install the fixture's dependencies. The fixture's package.json
 *      points at the repo root via `file:..`, so npm resolves RDS to
 *      the just-built dist via the package `exports` field.
 *   3. Run `next build` inside the fixture. If the bundle is missing
 *      `"use client"`, Next's RSC compilation fails to evaluate RDS in
 *      the server runtime with `(0, j.createContext) is not a function`,
 *      and `next build` exits non-zero — this script propagates the
 *      failure.
 *
 * The fixture lives under `fixtures/next-smoke/` and is committed to
 * the repo; `node_modules` and `.next` are gitignored.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
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
  console.log("[next-smoke] (1/3) Building RDS library...");
  execSync("npm run build", { cwd: root, stdio: "inherit" });
} else {
  console.log("[next-smoke] (1/3) Skipping RDS build (--skip-build).");
}

console.log("[next-smoke] (2/3) Installing fixture dependencies...");
execSync("npm install --no-audit --no-fund --loglevel=error", {
  cwd: fixtureDir,
  stdio: "inherit",
});

console.log("[next-smoke] (3/3) Running `next build` in fixture...");
execSync("npx --no-install next build", {
  cwd: fixtureDir,
  stdio: "inherit",
});

console.log(
  "[next-smoke] PASS — Next 16 Server Component built RDS imports without RSC errors.",
);
