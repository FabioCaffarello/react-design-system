#!/usr/bin/env node
/**
 * validate-theme-export
 *
 * Issue #234 enforcement gate for the `./theme` export (`dist/tokens.css`).
 *
 * The `./theme` export ships the RAW token source so a Tailwind v4 consumer
 * can generate the design system's utilities with their OWN Tailwind. Two
 * ways that contract can silently break, and this gate guards both:
 *
 *   AXIS A — the raw source survives. `dist/tokens.css` must contain the
 *     uncompiled `@theme {…}` blocks + the light/dark selector overrides,
 *     and must NOT contain the compile artifacts that mean "this went
 *     through Tailwind" (`@layer properties`, `@layer utilities`, `--tw-*`
 *     registrations) nor the Tailwind ENTRY (`@import "tailwindcss"`,
 *     `@source`) which would drag the whole framework / content scan into
 *     the consumer. If any of those appear, the inliner regressed or
 *     someone pointed the export at the compiled bundle. Also: every
 *     relative `@import` must be inlined (a leftover `@import "./x"` means
 *     the consumer fetches a path that isn't published).
 *
 *   AXIS B — the tokens resolve to real colors, theme-aware. This is the
 *     bug the issue reported: the consumer's self-referential `@theme
 *     inline` bridge made every semantic token a circular reference that
 *     bottomed out at empty → `rgba(0,0,0,0)` → invisible primary button.
 *     The gate proves the inverse end-to-end:
 *       1. Drive the CONSUMER's Tailwind (`compile()` from the installed
 *          `tailwindcss`) over `@import "tailwindcss"` + the built
 *          `dist/tokens.css`, and confirm it GENERATES the utility
 *          `.bg-surface-brand-strong` (and friends) — i.e. the raw `@theme`
 *          is actually picked up.
 *       2. Resolve each probe token's `var()` chain against the raw token
 *          maps (light = first-wins over the flat file, since dark.css is
 *          imported last; dark = the `[data-theme="dark"]` block overlaid)
 *          and confirm it terminates at a real color literal — not empty,
 *          not `transparent`, not a dangling var — in BOTH themes.
 *
 * Per .claude/rules/ci-gates.md this gate was proven to fail by inducing
 * each failure: a circular var in the chain (axis B), removing the dark
 * override (axis B dark), and injecting `@layer utilities` (axis A).
 *
 * NOTE on grepping: forbidden strings (`@import "tailwindcss"`, `@source`)
 * legitimately appear inside the file's DOC COMMENTS (consumer usage
 * examples). This gate strips CSS comments before every structural check
 * for exactly that reason — a raw `grep -c 'tailwindcss' dist/tokens.css`
 * counts comment text and will mislead. The comment-stripped content is
 * the contract.
 *
 * Runs in `build:validate` (local build + CI build job), after
 * `scripts/build-tokens-css.mjs` has emitted `dist/tokens.css`.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { compile } from "tailwindcss";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TOKENS = path.join(ROOT, "dist/tokens.css");

// Probe tokens span the families that collapsed in the issue report:
// brand surface (the invisible primary button), brand fg, focus ring line,
// and the literal-white on-color token (proves a non-var terminal passes).
const PROBE = [
  { class: "bg-surface-brand-strong", token: "--color-surface-brand-strong" },
  { class: "text-fg-brand", token: "--color-fg-brand" },
  { class: "border-line-focus", token: "--color-line-focus" },
  { class: "text-fg-on-success", token: "--color-fg-on-success" },
];

const fail = (msg) => {
  console.error(`\n❌ validate-theme-export: ${msg}\n`);
  process.exit(1);
};

/** Strip CSS block comments. */
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/**
 * Extract the inner text of the first top-level block whose selector header
 * contains `needle`, via brace counting (robust to nested braces).
 */
function blockBody(css, needle) {
  const idx = css.indexOf(needle);
  if (idx === -1) return "";
  const open = css.indexOf("{", idx);
  if (open === -1) return "";
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  return "";
}

/** Parse `--name: value;` custom-property declarations from a CSS chunk. */
function parseVars(chunk, { firstWins }) {
  const map = new Map();
  const re = /(--[\w-]+)\s*:\s*([^;}]+?)\s*(?:;|(?=}))/g;
  let m;
  while ((m = re.exec(chunk)) !== null) {
    const [, name, value] = m;
    if (firstWins && map.has(name)) continue;
    map.set(name, value.trim());
  }
  return map;
}

const COLOR_LITERAL =
  /^(#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(|oklch\(|oklab\(|lab\(|lch\(|color\(|currentColor$|[a-z]+$)/;

const EMPTY_VALUES = new Set([
  "",
  "transparent",
  "rgba(0,0,0,0)",
  "rgb(0 0 0 / 0)",
  "initial",
  "unset",
  "inherit",
]);

/**
 * Resolve a token through its var() chain against `map`.
 * Returns { ok, terminal, trail } — ok=false on dangling var, cycle, or an
 * empty/transparent terminal.
 */
function resolve(token, map, trail = []) {
  if (trail.includes(token)) {
    return { ok: false, terminal: `<cycle: ${token}>`, trail };
  }
  const next = [...trail, token];
  const raw = map.get(token);
  if (raw === undefined) {
    return { ok: false, terminal: `<undefined: ${token}>`, trail: next };
  }
  const varMatch = raw.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([\s\S]+))?\)$/);
  if (varMatch) {
    const inner = varMatch[1];
    const fallback = varMatch[2];
    const r = resolve(inner, map, next);
    if (r.ok) return r;
    // referenced var missing → try the var() fallback if present
    if (fallback && !map.has(inner)) {
      const fb = fallback.trim();
      if (!EMPTY_VALUES.has(fb.toLowerCase()) && COLOR_LITERAL.test(fb)) {
        return { ok: true, terminal: fb, trail: next };
      }
    }
    return r;
  }
  const norm = raw.replace(/\s+/g, "").toLowerCase();
  if (EMPTY_VALUES.has(norm) || EMPTY_VALUES.has(raw.toLowerCase())) {
    return { ok: false, terminal: raw, trail: next };
  }
  if (!COLOR_LITERAL.test(raw)) {
    return { ok: false, terminal: `<non-color: ${raw}>`, trail: next };
  }
  return { ok: true, terminal: raw, trail: next };
}

async function main() {
  if (!fs.existsSync(TOKENS)) {
    fail(
      `dist/tokens.css not found. Run \`node scripts/build-tokens-css.mjs\` ` +
        `(it runs inside \`npm run build\`).`,
    );
  }

  const rawWithComments = fs.readFileSync(TOKENS, "utf8");
  const css = stripComments(rawWithComments);

  // ---- AXIS A: raw source survived, no compile artifacts -----------------
  const forbidden = [
    ['@import "tailwindcss"', /@import\s+["']tailwindcss["']/],
    ["@source", /@source\b/],
    ["@layer properties", /@layer\s+properties\b/],
    ["@layer utilities", /@layer\s+utilities\b/],
    ["--tw-* registration", /--tw-[\w-]+\s*:/],
    ["leftover @import (un-inlined)", /@import\s+["']/],
  ];
  for (const [label, re] of forbidden) {
    if (re.test(css)) {
      fail(
        `dist/tokens.css contains \`${label}\` — the export must be the RAW, ` +
          `un-compiled token source. Did the inliner regress, or did the ` +
          `export get pointed at the compiled bundle?`,
      );
    }
  }
  if (!/@theme\b/.test(css)) {
    fail(
      "dist/tokens.css has no `@theme` block — nothing for the consumer's Tailwind to pick up.",
    );
  }
  if (!/\[data-theme="dark"\]/.test(css)) {
    fail(
      'dist/tokens.css has no `[data-theme="dark"]` override — dark theme-awareness would be lost.',
    );
  }

  // ---- AXIS B.1: consumer Tailwind generates the utilities ---------------
  const fixture = `@import "tailwindcss";\n${rawWithComments}`;
  let generated;
  try {
    const compiler = await compile(fixture, {
      base: ROOT,
      loadStylesheet: async (id, base) => {
        const resolved = require.resolve(
          id === "tailwindcss" ? "tailwindcss/index.css" : id,
        );
        return {
          base,
          path: resolved,
          content: fs.readFileSync(resolved, "utf8"),
        };
      },
      loadModule: async () => {
        throw new Error("theme export must not require JS modules");
      },
    });
    generated = compiler.build(PROBE.map((p) => p.class));
  } catch (err) {
    fail(
      `consumer Tailwind failed to compile the theme export: ${err.message}`,
    );
  }
  for (const { class: cls } of PROBE) {
    if (!generated.includes(`.${cls}`)) {
      fail(
        `consumer Tailwind did NOT generate \`.${cls}\` from the raw @theme — ` +
          `the token may be missing or not declared in an @theme block.`,
      );
    }
  }

  // ---- AXIS B.2: each probe token resolves to a real color, both themes --
  const lightMap = parseVars(css, { firstWins: true });
  const darkBody = blockBody(css, '[data-theme="dark"]');
  const darkMap = new Map(lightMap);
  for (const [k, v] of parseVars(darkBody, { firstWins: false })) {
    darkMap.set(k, v);
  }

  for (const { token } of PROBE) {
    for (const [theme, map] of [
      ["light", lightMap],
      ["dark", darkMap],
    ]) {
      const r = resolve(token, map);
      if (!r.ok) {
        fail(
          `${token} resolves to \`${r.terminal}\` in ${theme} (chain: ` +
            `${r.trail.join(" → ")}). A real consumer would render this ` +
            `transparent/invisible — exactly the issue #234 failure mode.`,
        );
      }
    }
  }

  console.log(
    `✅ validate-theme-export: dist/tokens.css is raw @theme source; ` +
      `consumer Tailwind generates ${PROBE.length} probe utilities; all ` +
      `resolve to real colors in light + dark.`,
  );
}

main();
