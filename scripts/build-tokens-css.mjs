#!/usr/bin/env node
/**
 * build-tokens-css
 *
 * Issue #234. Emits the RAW token source as `dist/tokens.css` — the
 * artifact behind the `./theme` package export.
 *
 * The problem this solves: `dist/react-design-system.css` (the `./styles`
 * export) is a fully Tailwind-COMPILED bundle (`@layer theme` with resolved
 * `:root` blocks, `@layer properties` with `--tw-*` registrations, `@layer
 * utilities` with every component class). A Tailwind v4 consumer cannot
 * extend that output — there is no `@theme` left in it to pick up. So a
 * consumer who also runs Tailwind v4 (e.g. brasil-a-vera) was forced to
 * hand-roll a self-referential `@theme inline` bridge that collapses to a
 * circular reference and resolves every semantic token to empty/transparent.
 *
 * The fix: ship the token SOURCE uncompiled. This script flattens the local
 * `@import` chain of `src/styles/tokens.css` into a single file, preserving
 * the `@theme {…}` blocks and the light/dark selector overrides VERBATIM —
 * it deliberately does NOT run the CSS through Tailwind, because the consumer
 * must receive the `@theme` blocks raw so THEIR Tailwind generates the
 * utilities (theme-aware, single source of truth, no bridge).
 *
 * Why a bespoke inliner and not a CSS tool: every CSS compiler we have
 * (`@tailwindcss/vite`, Tailwind's own `compile()`) would compile the
 * `@theme` away. We need the inverse — `@import` resolution ONLY, with
 * zero transformation. That is small enough to own directly and keeps the
 * dependency surface flat (no new dep per CLAUDE.md).
 *
 * Scope of the inliner, deliberately minimal:
 *   - Inlines only RELATIVE `@import "./x.css";` / `@import "../x.css";`
 *     statements (single or double quoted, optional trailing semicolon).
 *   - Leaves bare/url/`tailwindcss` imports untouched — but the source
 *     entry (`src/styles/tokens.css`) has none by contract, and
 *     `validate-theme-export.mjs` fails the build if any survive.
 *   - Detects import cycles via the active include stack (not a global
 *     visited set: a file legitimately imported twice should inline twice,
 *     exactly as the CSS cascade would).
 *
 * Runs inside `npm run build`, after the Vite builds create `dist/`, before
 * `build:validate` (which includes `validate-theme-export.mjs`).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ENTRY = path.join(ROOT, "src/styles/tokens.css");
const OUT = path.join(ROOT, "dist/tokens.css");

// Matches a top-of-statement relative @import. We intentionally do NOT match
// bare specifiers (`@import "tailwindcss"`) or url()/layer()/media variants —
// the token source uses none, and anything unexpected is surfaced by the gate.
const RELATIVE_IMPORT = /@import\s+["'](\.[^"']+)["']\s*;?/g;

/**
 * Inline a CSS file's relative @import chain.
 * @param {string} file absolute path to the CSS file
 * @param {string[]} stack active include stack (for cycle detection)
 * @returns {string} the file content with relative imports inlined
 */
function inline(file, stack) {
  if (stack.includes(file)) {
    throw new Error(
      `Import cycle detected:\n  ${[...stack, file]
        .map((f) => path.relative(ROOT, f))
        .join("\n  -> ")}`,
    );
  }
  if (!fs.existsSync(file)) {
    throw new Error(`Imported file not found: ${path.relative(ROOT, file)}`);
  }

  const src = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);
  const nextStack = [...stack, file];

  return src.replace(RELATIVE_IMPORT, (_match, spec) => {
    const resolved = path.resolve(dir, spec);
    const header = `/* ↳ inlined from ${path.relative(ROOT, resolved)} */`;
    return `${header}\n${inline(resolved, nextStack)}`;
  });
}

function main() {
  if (!fs.existsSync(ENTRY)) {
    console.error(
      `[build-tokens-css] entry not found: ${path.relative(ROOT, ENTRY)}`,
    );
    process.exit(1);
  }

  const banner = `/*! Design System raw token source — @theme + light/dark overrides.
 * Generated from src/styles/tokens.css by scripts/build-tokens-css.mjs (issue #234).
 * Consume via the "./theme" export alongside "./styles":
 *   @import "tailwindcss";
 *   @import "@fabio.caffarello/react-design-system/styles" layer(rds);
 *   @import "@fabio.caffarello/react-design-system/theme";
 * Your Tailwind generates the utilities natively from the @theme blocks below.
 * DO NOT edit dist/tokens.css by hand — edit the src/styles token files. */
`;

  const body = inline(ENTRY, []);
  const output = `${banner}\n${body}`;

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, output, "utf8");

  const themeBlocks = (output.match(/@theme\b/g) || []).length;
  console.log(
    `[build-tokens-css] wrote ${path.relative(ROOT, OUT)} ` +
      `(${(output.length / 1024).toFixed(1)} KB, ${themeBlocks} @theme blocks)`,
  );
}

main();
