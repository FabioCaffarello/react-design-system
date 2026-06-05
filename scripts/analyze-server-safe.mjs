#!/usr/bin/env node
/**
 * analyze-server-safe
 *
 * CLI wrapper around scripts/lib/server-safe.mjs. Walks every public
 * component file under src/ui/{primitives,components,layouts}/, runs
 * the transitive client/server classifier on each, and emits:
 *
 *   - a human-readable verdict + reason on stdout, and
 *   - `server-safe-map.json` next to the script's CWD (gitignored)
 *     for downstream tooling (and for the validator to cross-check).
 *
 * The classification rule and the analyser's scope are documented in
 * scripts/lib/server-safe.mjs. This file is intentionally thin — keep
 * shared logic in the lib so this script and validate-server-entry.mjs
 * cannot drift apart on the definition of "server-safe".
 *
 * Issue #150.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { classify, listComponentFiles, rel, ROOT } from "./lib/server-safe.mjs";

const files = listComponentFiles();
const cache = new Map();
const serverSafe = [];
const clientOnly = [];

for (const file of files) {
  const v = classify(file, cache);
  if (v.verdict === "server") {
    serverSafe.push(rel(file));
  } else {
    clientOnly.push({
      file: rel(file),
      reason: v.reason,
      chain: v.chain.map(rel),
    });
  }
}

const summary = {
  total: files.length,
  serverSafe: serverSafe.length,
  clientOnly: clientOnly.length,
};

console.log("=".repeat(72));
console.log(
  `Transitive server-safe analysis — ${summary.total} component files`,
);
console.log("=".repeat(72));
console.log("");
console.log(`Server-safe: ${summary.serverSafe}`);
console.log(`Client-only: ${summary.clientOnly}`);
console.log("");
console.log("Server-safe set:");
console.log("");
for (const f of serverSafe) console.log(`  ${f}`);
console.log("");
console.log("Client-only set (first reason in chain):");
console.log("");
for (const { file, reason, chain } of clientOnly) {
  const firstLink = chain[chain.length - 1];
  const via = chain.length > 1 ? ` via ${firstLink}` : "";
  console.log(`  ${file} — ${reason}${via}`);
}

writeFileSync(
  join(ROOT, "server-safe-map.json"),
  JSON.stringify({ summary, serverSafe, clientOnly }, null, 2),
);

console.log("");
console.log(`Wrote server-safe-map.json`);
