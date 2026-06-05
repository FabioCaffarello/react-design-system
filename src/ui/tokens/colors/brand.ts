/**
 * Brand Primitive Palettes — TS mirror of src/styles/primitives/brand.css
 *
 * Brand-primary: institutional navy from brasil-a-vera globals.css.
 * Brand-secondary: OKLCH-derived from ADR-024 brasil-a-vera purple
 *   (reproducible via scripts/derive-brand-secondary.mjs).
 *
 * Distinct from PRIMITIVE_COLORS Tailwind tones (indigo/pink/cyan/...)
 * which stay honest to their official Tailwind v4 values. Semantic tokens
 * point at these brand palettes, not at Tailwind tones.
 *
 * @brand brasil-a-vera (default, overridable)
 */

import type { ColorPalette, ColorScale, ColorToken } from "./types";

function createBrandToken(
  hex: string,
  family: "brand-primary" | "brand-secondary",
  scale: ColorScale,
): ColorToken {
  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);
  return {
    hex,
    rgb,
    hsl,
    cssVar: `var(--color-${family}-${scale})`,
    tailwind: `${family}-${scale}`,
  };
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

function hexToHsl(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0%, 0%";

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

/**
 * Brand Primary — institutional navy
 */
export const BRAND_PRIMARY: ColorPalette = {
  50: createBrandToken("#f0f4f8", "brand-primary", 50),
  100: createBrandToken("#d9e2ec", "brand-primary", 100),
  200: createBrandToken("#bcccdc", "brand-primary", 200),
  300: createBrandToken("#9fb3c8", "brand-primary", 300),
  400: createBrandToken("#7390ad", "brand-primary", 400),
  500: createBrandToken("#486581", "brand-primary", 500),
  600: createBrandToken("#334e68", "brand-primary", 600),
  700: createBrandToken("#243b53", "brand-primary", 700),
  800: createBrandToken("#1a2a3a", "brand-primary", 800),
  900: createBrandToken("#102a43", "brand-primary", 900),
  950: createBrandToken("#061a35", "brand-primary", 950),
};

/**
 * Brand Secondary — ADR-024 purple, OKLCH-derived (hue 295)
 */
export const BRAND_SECONDARY: ColorPalette = {
  50: createBrandToken("#f7f5ff", "brand-secondary", 50),
  100: createBrandToken("#eee9ff", "brand-secondary", 100),
  200: createBrandToken("#e0d6ff", "brand-secondary", 200),
  300: createBrandToken("#cbb8ff", "brand-secondary", 300),
  400: createBrandToken("#aa89fc", "brand-secondary", 400),
  500: createBrandToken("#8e58f2", "brand-secondary", 500),
  600: createBrandToken("#703bc8", "brand-secondary", 600),
  700: createBrandToken("#582aa2", "brand-secondary", 700),
  800: createBrandToken("#44227e", "brand-secondary", 800),
  900: createBrandToken("#32185d", "brand-secondary", 900),
  950: createBrandToken("#180635", "brand-secondary", 950),
};
