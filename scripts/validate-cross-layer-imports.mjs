#!/usr/bin/env node
/**
 * validate-cross-layer-imports.mjs
 *
 * Enforces the three-layer rule from CLAUDE.md and
 * .claude/rules/components.md:
 *
 *   primitives never import from components or layouts.
 *   components may import primitives.
 *   layouts import primitives only.
 *
 * The architectural shape lives in the file paths, not in TypeScript
 * types — there is no compile-time check that prevents a primitive
 * from reaching into a component. This gate parses `import ... from`
 * statements in `src/ui/{primitives,layouts}/` and fails on any
 * upward-pointing path. Components are free to import each other and
 * any primitive; the three-layer rule only forbids the inverted
 * directions.
 *
 * Why a custom script and not dependency-cruiser or madge:
 *   Both are in devDependencies and would handle this with a
 *   declarative rule, but the rule is small (two directional
 *   forbidden-edges) and a path-based grep walks the same source
 *   tree in ~50 lines of code. No config file, no extra build step,
 *   and the gate's failure message can point straight at the
 *   offending line.
 *
 * Run with: `node scripts/validate-cross-layer-imports.mjs`
 *
 * Exit codes:
 *   0 — every primitive / layout file respects its layer boundary
 *   1 — at least one upward import detected (each violation printed)
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const UI_ROOT = join(ROOT, "src", "ui");

// What each source layer is forbidden from importing. The matchers
// are regular expressions against the literal import specifier (the
// string after `from`). Both relative paths (`../../components/...`)
// and the implementation-detail absolute alias (`src/ui/components/...`)
// are caught.
const FORBIDDEN = {
  primitives: [
    {
      pattern: /(?:^|\/)components(?:\/|$)/,
      target: "components",
    },
    {
      pattern: /(?:^|\/)layouts(?:\/|$)/,
      target: "layouts",
    },
  ],
  layouts: [
    {
      pattern: /(?:^|\/)components(?:\/|$)/,
      target: "components",
    },
  ],
};

// .test.tsx and .stories.tsx are intentionally excluded — they wire
// real-world composition examples (a primitive's story may render a
// Button next to a Card to illustrate density), and that's a
// documentation concern, not a runtime architecture violation.
const SKIP_SUFFIXES = [".test.tsx", ".test.ts", ".stories.tsx", ".stories.ts"];

const IMPORT_RE =
  /(?:^|\n)\s*(?:import|export)\s+(?:[^"']*\s+from\s+)?["']([^"']+)["']/g;

function isCodeFile(name) {
  if (SKIP_SUFFIXES.some((s) => name.endsWith(s))) return false;
  return name.endsWith(".ts") || name.endsWith(".tsx");
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      out.push(...walk(full));
    } else if (s.isFile() && isCodeFile(entry)) {
      out.push(full);
    }
  }
  return out;
}

function extractImports(source) {
  const out = [];
  for (const match of source.matchAll(IMPORT_RE)) {
    out.push(match[1]);
  }
  return out;
}

const violations = [];

for (const [layer, forbiddenList] of Object.entries(FORBIDDEN)) {
  const layerDir = join(UI_ROOT, layer);
  try {
    statSync(layerDir);
  } catch {
    continue; // layer folder missing → no files to scan
  }

  for (const file of walk(layerDir)) {
    const src = readFileSync(file, "utf8");
    for (const spec of extractImports(src)) {
      for (const { pattern, target } of forbiddenList) {
        if (pattern.test(spec)) {
          violations.push({
            file: relative(ROOT, file),
            specifier: spec,
            layer,
            target,
          });
        }
      }
    }
  }
}

if (violations.length === 0) {
  console.log(
    "[validate-cross-layer-imports] OK — primitives and layouts respect the three-layer rule.",
  );
  process.exit(0);
}

console.error(
  `[validate-cross-layer-imports] FAIL — ${violations.length} upward import(s):`,
);
for (const v of violations) {
  console.error(
    `  ${v.file}\n    → ${v.specifier}  (${v.layer} cannot import from ${v.target})`,
  );
}
console.error(
  "\nPer CLAUDE.md / .claude/rules/components.md: primitives never import from components or layouts; layouts import primitives only. Refactor the offending import.",
);
process.exit(1);
