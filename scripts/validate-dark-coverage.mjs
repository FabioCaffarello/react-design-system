#!/usr/bin/env node
// Validate that themes/dark.css covers every semantic --color-* token
// defined in semantic/colors.css, AND that the [data-theme="dark"]/.dark
// block stays in lockstep with the @media (prefers-color-scheme: dark)
// block.
//
// Why this exists — historical context, not a hypothetical:
// dark.css for a long time had a half-empty @media block that only set
// 5 of ~117 dark vars, with a misleading comment claiming "other
// variables would inherit from .dark". CSS does not inherit variables
// between selectors. The result: every user on OS-prefers-dark (no
// explicit data-theme attribute) received Modal/Dialog/CommandPalette
// with WHITE backgrounds (surface-overlay stayed at light's white),
// fg-primary slate-50 white text on white → ratio 1.05, ilegível.
// The bug was invisible to the light a11y baseline. It surfaced only
// when the dark baseline plumbing landed.
//
// This script makes the duplication unable to drift. Both blocks must
// declare the same token set (modulo selector header + ::selection
// pseudo). Any divergence fails CI.
//
// Two checks:
//   1. Coverage: every semantic color token (excluding the documented
//      theme-agnostic allowlist) must be overridden in BOTH blocks.
//   2. Parity: the set of tokens redeclared in [data-theme="dark"]/.dark
//      must equal the set redeclared in the @media block.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const SEMANTIC = join(ROOT, "src/styles/semantic/colors.css");
const DARK = join(ROOT, "src/styles/themes/dark.css");

// Theme-agnostic tokens that intentionally stay the same in all themes.
// .claude/rules/colors.md, Principle 5: "Scrim and tint-hover are
// theme-agnostic by design." A backdrop veil in dark mode loses its
// function — it stops focusing attention. Translucency works over any
// surface in any theme.
const THEME_AGNOSTIC = new Set(["--color-scrim", "--color-tint-hover"]);

// Match only LHS definitions: `  --color-XXX: ...;`
// Skip primitive shades (slate-900, indigo-400, etc.) — those are
// values, not theme-overridable role tokens.
const PRIMITIVE_RE =
  /^--color-(slate|gray|zinc|red|green|blue|yellow|orange|pink|indigo|violet|cyan|emerald|amber|rose|sky|fuchsia|purple|teal|lime|white|black)(-\d+)?$/;

function parseSemanticDefs(text) {
  const re = /^\s*(--color-[a-z0-9-]+)\s*:/gm;
  const out = new Set();
  let m;
  while ((m = re.exec(text)) !== null) {
    const v = m[1];
    if (PRIMITIVE_RE.test(v)) continue;
    out.add(v);
  }
  return out;
}

const semantic = await readFile(SEMANTIC, "utf8");
const dark = await readFile(DARK, "utf8");

// Split dark.css at the @media block boundary
const mediaMarker = "@media (prefers-color-scheme: dark)";
const mediaIdx = dark.indexOf(mediaMarker);
if (mediaIdx === -1) {
  console.error(
    `[validate-dark] FAIL: dark.css missing "@media (prefers-color-scheme: dark)" block.`,
  );
  console.error(
    `  Expected both an explicit [data-theme="dark"]/.dark rule AND an @media block redeclaring the same vars.`,
  );
  process.exit(1);
}

const darkExplicit = dark.slice(0, mediaIdx);
const darkMedia = dark.slice(mediaIdx);

const semSet = parseSemanticDefs(semantic);
const explicitSet = parseSemanticDefs(darkExplicit);
const mediaSet = parseSemanticDefs(darkMedia);

let failed = false;

// CHECK 1 — coverage: every semantic token must be overridden in both
// blocks, except theme-agnostic allowlist.
const expected = new Set([...semSet].filter((t) => !THEME_AGNOSTIC.has(t)));
const missingFromExplicit = [...expected].filter((t) => !explicitSet.has(t));
const missingFromMedia = [...expected].filter((t) => !mediaSet.has(t));

if (missingFromExplicit.length) {
  failed = true;
  console.error(
    `\n[validate-dark] FAIL: ${missingFromExplicit.length} semantic token(s) missing dark override in [data-theme="dark"]/.dark:`,
  );
  for (const t of missingFromExplicit.sort()) console.error(`  - ${t}`);
  console.error(
    `  Add an override in dark.css or, if intentionally theme-agnostic, add to THEME_AGNOSTIC in this script with a Principle-5 rationale.`,
  );
}

if (missingFromMedia.length) {
  failed = true;
  console.error(
    `\n[validate-dark] FAIL: ${missingFromMedia.length} semantic token(s) missing dark override in @media block:`,
  );
  for (const t of missingFromMedia.sort()) console.error(`  - ${t}`);
  console.error(
    `  The @media block must duplicate the [data-theme="dark"] block byte-for-byte (modulo selector). See dark.css header comment.`,
  );
}

// CHECK 2 — parity: explicit and @media must declare the exact same set.
const onlyInExplicit = [...explicitSet].filter((t) => !mediaSet.has(t));
const onlyInMedia = [...mediaSet].filter((t) => !explicitSet.has(t));

if (onlyInExplicit.length || onlyInMedia.length) {
  failed = true;
  console.error(
    `\n[validate-dark] FAIL: parity between [data-theme="dark"] and @media block:`,
  );
  if (onlyInExplicit.length) {
    console.error(`  declared ONLY in [data-theme="dark"] block:`);
    for (const t of onlyInExplicit.sort()) console.error(`    - ${t}`);
  }
  if (onlyInMedia.length) {
    console.error(`  declared ONLY in @media block:`);
    for (const t of onlyInMedia.sort()) console.error(`    - ${t}`);
  }
}

if (failed) {
  console.error("");
  process.exit(1);
}

const coverage = expected.size;
console.log(
  `[validate-dark] OK — ${coverage} semantic tokens declared in both [data-theme="dark"] and @media blocks; ${THEME_AGNOSTIC.size} theme-agnostic excluded.`,
);
