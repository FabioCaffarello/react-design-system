#!/usr/bin/env node
/**
 * validate-docs-sync.mjs
 *
 * Mechanises the two checks from `.claude/rules/docs-sync.md`
 * ("Verification before commit") that have already failed twice in this
 * repo's history — both times via docs/STORYBOOK_GUIDE.md drifting from
 * its sources of truth:
 *
 *   1. Phantom npm scripts — every `npm run <name>` mentioned in a doc
 *      must exist in package.json `scripts`. A doc teaching a script
 *      that doesn't exist sends the next agent (or human) down a dead
 *      path, and in a Claude-Code-maintained repo the agent may then
 *      CREATE the phantom script, growing the surface CLAUDE.md caps.
 *
 *   2. Dead relative links — every `](./x)` / `](../x)` markdown link
 *      target must resolve to an existing file. docs-sync.md calls
 *      this "the one class of drift safe to defer to a follow-up PR,
 *      but it must be logged, never silently left" — this gate is the
 *      log.
 *
 * Scope: ALL prose docs, not only the derived docs docs-sync.md
 * enumerates. A phantom script is drift regardless of which doc carries
 * it, and scanning everything means the file list here cannot itself
 * drift when docs-sync.md's enumeration changes.
 *
 * What this deliberately does NOT check (judgment calls that stay with
 * docs-sync.md + PR review): semantic restatements (inventory counts,
 * behavioural gists), "teaches X" vs "says don't use X" distinctions,
 * and absolute/external URLs.
 *
 * Runs in pre-push and the CI lint job, next to the other structural
 * validators.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

// Directories whose .md/.mdx files are scanned (recursively).
const SCAN_DIRS = ["docs", ".claude", "src/docs"];
// Top-level files scanned in addition.
const SCAN_FILES = ["CLAUDE.md", "README.md"];

const knownScripts = new Set(
  Object.keys(
    JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).scripts ?? {},
  ),
);

function collectDocs(dir, acc) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      if (entry === "node_modules") continue;
      collectDocs(path, acc);
    } else if (/\.(md|mdx)$/.test(entry)) {
      acc.push(path);
    }
  }
  return acc;
}

const docs = [];
for (const dir of SCAN_DIRS) {
  const abs = join(ROOT, dir);
  if (existsSync(abs)) collectDocs(abs, docs);
}
for (const file of SCAN_FILES) {
  const abs = join(ROOT, file);
  if (existsSync(abs)) docs.push(abs);
}

// `npm run <name>` — the name stops at whitespace/backtick/quote, so
// `npm run test -- Foo` captures `test` and `npm run lint`. inside a
// sentence captures `lint`. Trailing punctuation is stripped below.
const NPM_RUN_RE = /npm run ([A-Za-z0-9:_.-]+)/g;

// Relative markdown links: `](./x)` or `](../x)`. Anchors and
// query-ish suffixes are stripped before resolution.
const REL_LINK_RE = /\]\((\.\.?\/[^)\s]+)\)/g;

// A match is exempt when the line it sits on, or the line above, carries
// a `docs-ok: <reason>` marker (HTML comment in md). This is the escape
// valve for NEGATIVE references — docs-sync.md explicitly allows a doc
// to name a phantom/banned thing in order to say "this never existed /
// don't use it". Mirrors the `// exception: <reason>` shape the ESLint
// token rules use.
function lineIndexOf(text, offset) {
  return text.slice(0, offset).split("\n").length - 1;
}

function hasDocsOk(lines, lineIdx) {
  if (/docs-ok\s*:/.test(lines[lineIdx] ?? "")) return true;
  // Walk upward past blank lines (prettier inserts one after an HTML
  // comment block), then check the first non-blank line above.
  let i = lineIdx - 1;
  while (i >= 0 && (lines[i] ?? "").trim() === "") i--;
  return /docs-ok\s*:/.test(lines[i] ?? "");
}

const violations = [];

for (const doc of docs) {
  const rel = doc.slice(ROOT.length).split(sep).join("/");
  const text = readFileSync(doc, "utf8");
  const lines = text.split("\n");

  for (const match of text.matchAll(NPM_RUN_RE)) {
    // Strip punctuation that regularly trails a script name in prose
    // (`npm run lint.` / `npm run lint`, / `npm run lint:`) — `:` only
    // when terminal, since script names legitimately contain colons.
    const name = match[1].replace(/[.,:;]+$/, "");
    if (name.length === 0) continue;
    // Placeholders: `npm run X` / `npm run N` in meta-prose about
    // scripts in general (ci-gates.md, docs-sync.md) are not script
    // references. A single capital letter is never a real script name.
    if (/^[A-Z]$/.test(name)) continue;
    if (knownScripts.has(name)) continue;
    if (hasDocsOk(lines, lineIndexOf(text, match.index))) continue;
    violations.push(
      `${rel}: phantom npm script \`npm run ${name}\` — not in package.json scripts`,
    );
  }

  for (const match of text.matchAll(REL_LINK_RE)) {
    const target = match[1].split("#")[0];
    if (target === "" || target === "./" || target === "../") continue;
    const resolved = resolve(dirname(doc), target);
    if (existsSync(resolved)) continue;
    if (hasDocsOk(lines, lineIndexOf(text, match.index))) continue;
    violations.push(`${rel}: dead relative link \`${match[1]}\``);
  }
}

if (violations.length === 0) {
  console.log(
    `[validate-docs-sync] OK — ${docs.length} docs scanned: zero phantom npm scripts, zero dead relative links.`,
  );
  process.exit(0);
}

console.error(`[validate-docs-sync] FAIL — ${violations.length} violation(s):`);
for (const v of violations) {
  console.error(`  ${v}`);
}
console.error(
  "\nDerived docs must stay in lockstep with their sources of truth — see .claude/rules/docs-sync.md. Fix the doc (or the source) in this same commit; do not defer phantom scripts. A dead link may be deferred ONLY with an explicit log in the PR description.",
);
process.exit(1);
