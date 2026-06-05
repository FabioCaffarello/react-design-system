#!/usr/bin/env node
/**
 * Derive the --color-brand-secondary-* HEX scale from the ADR-024 OKLCH
 * specification (brasil-a-vera). Hue locked at 295.
 *
 * Anchors from ADR-024:
 *   - light primary: oklch(0.45 0.18 295) — informs step 600 region
 *   - dark primary:  oklch(0.62 0.22 295) — informs step 500 region
 *
 * The curve is intentionally smoothed across the 11 stops (industry-
 * standard for color scales); generated values at 500/600 do not match
 * the anchors exactly. Documented in .claude/rules/colors.md.
 *
 * Run: node scripts/derive-brand-secondary.mjs
 * Verify HEX match src/styles/primitives/brand.css (--color-brand-secondary-*).
 */

import { formatHex } from "culori";

const H = 295;
const stops = [
  { s: 50, L: 0.975, C: 0.013 },
  { s: 100, L: 0.945, C: 0.033 },
  { s: 200, L: 0.9, C: 0.065 },
  { s: 300, L: 0.825, C: 0.11 },
  { s: 400, L: 0.71, C: 0.165 },
  { s: 500, L: 0.6, C: 0.22 },
  { s: 600, L: 0.5, C: 0.205 },
  { s: 700, L: 0.42, C: 0.18 },
  { s: 800, L: 0.355, C: 0.145 },
  { s: 900, L: 0.29, C: 0.115 },
  { s: 950, L: 0.19, C: 0.085 },
];

for (const { s, L, C } of stops) {
  const hex = formatHex({ mode: "oklch", l: L, c: C, h: H });
  console.log(`--color-brand-secondary-${String(s).padEnd(4)}: ${hex};`);
}
