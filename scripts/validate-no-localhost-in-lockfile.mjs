#!/usr/bin/env node
/**
 * Lockfile contamination check.
 *
 * Fails if `package-lock.json` contains any `resolved` URL pointing at
 * `localhost:`. That URL shape means an `npm install` was run with a
 * local registry mirror (Verdaccio, etc) configured on the developer's
 * machine, and the lockfile recorded the local URL verbatim. CI doesn't
 * have that registry, so `npm ci` ECONNREFUSED on every workflow run.
 *
 * History
 *
 *   This trap fired twice during the a11y drain phase (PRs #69 and #70)
 *   because @axe-core/playwright was npm-installed on a machine whose
 *   `npm config get registry` resolved to a local Verdaccio. The fix
 *   was manually editing the URL back to `registry.npmjs.org`, but the
 *   only reason it was noticed at all was CI failing — there's no
 *   protection against the same accident landing as a silent commit on
 *   a branch whose CI was already red for another reason.
 *
 *   This script is the cheap protection. Runs in CI's lint job; if
 *   it ever finds `localhost:` in the lockfile's resolved URLs, it
 *   prints the line and exits non-zero.
 *
 * Usage
 *
 *   node scripts/validate-no-localhost-in-lockfile.mjs            # ./package-lock.json
 *   node scripts/validate-no-localhost-in-lockfile.mjs <path>     # custom
 *
 * Exit codes
 *
 *   0 — clean.
 *   1 — found one or more `localhost:` URLs (prints each).
 *   2 — lockfile missing or unreadable.
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const argPath = process.argv[2] || "package-lock.json";
const absPath = resolve(process.cwd(), argPath);

let raw;
try {
  raw = await readFile(absPath, "utf8");
} catch (err) {
  console.error(`[lockfile-check] cannot read ${absPath}: ${err.message}`);
  process.exit(2);
}

// Match only `resolved` URLs to localhost. The token "localhost" can
// legitimately appear in package text or docstrings inside the
// lockfile; the constraint is specifically on the `resolved` field of
// a package entry, which is what `npm ci` fetches from. Match the
// JSON shape directly.
const hits = [];
const lines = raw.split("\n");
const PATTERN = /"resolved"\s*:\s*"http:\/\/localhost(?::\d+)?\//;
for (let i = 0; i < lines.length; i++) {
  if (PATTERN.test(lines[i])) {
    hits.push({ line: i + 1, content: lines[i].trim() });
  }
}

if (hits.length === 0) {
  console.log(`[lockfile-check] PASS — no localhost URLs in ${argPath}.`);
  process.exit(0);
}

console.error(
  `[lockfile-check] FAIL — ${hits.length} localhost URL${hits.length === 1 ? "" : "s"} found in ${argPath}:`,
);
for (const h of hits) {
  console.error(`  line ${h.line}: ${h.content}`);
}
console.error(
  `\nThis happens when \`npm install\` runs on a machine whose npm registry is set to a local mirror (e.g. Verdaccio).\nTo fix:\n  1. Confirm with: \`npm config get registry\`\n  2. If it's not https://registry.npmjs.org/, either temporarily override:\n       npm install --registry=https://registry.npmjs.org/ ...\n     or edit each \`resolved\` URL in the lockfile to point at npmjs.org\n     (the integrity hash is content-addressed and does NOT need to change).\n  3. Re-run this script to confirm the lockfile is clean.`,
);
process.exit(1);
