/**
 * AIppin Design System - Primitive Color Tokens
 *
 * Complete color palettes with all shades (50-950).
 * These match the CSS variables defined in primitives/colors.css
 *
 * @brand AIppin
 * @version 1.0.0
 */

import type {
  ColorPalette,
  ColorToken,
  ColorScale,
  PrimitiveColorName,
  PrimitiveColors,
} from "./types";

/**
 * Helper to create a color token
 */
function createToken(
  hex: string,
  colorName: string,
  scale: ColorScale,
): ColorToken {
  const rgb = hexToRgb(hex);
  const hsl = hexToHsl(hex);
  return {
    hex,
    rgb,
    hsl,
    cssVar: `var(--color-${colorName}-${scale})`,
    tailwind: `${colorName}-${scale}`,
  };
}

/**
 * Convert hex to RGB string
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

/**
 * Convert hex to HSL string
 */
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
 * Indigo - Primary Brand Color
 */
export const INDIGO: ColorPalette = {
  50: createToken("#eef2ff", "indigo", 50),
  100: createToken("#e0e7ff", "indigo", 100),
  200: createToken("#c7d2fe", "indigo", 200),
  300: createToken("#a5b4fc", "indigo", 300),
  400: createToken("#818cf8", "indigo", 400),
  500: createToken("#6366f1", "indigo", 500),
  600: createToken("#4f46e5", "indigo", 600),
  700: createToken("#4338ca", "indigo", 700),
  800: createToken("#3730a3", "indigo", 800),
  900: createToken("#312e81", "indigo", 900),
  950: createToken("#1e1b4b", "indigo", 950),
};

/**
 * Violet - Secondary Brand Color
 */
export const VIOLET: ColorPalette = {
  50: createToken("#f5f3ff", "violet", 50),
  100: createToken("#ede9fe", "violet", 100),
  200: createToken("#ddd6fe", "violet", 200),
  300: createToken("#c4b5fd", "violet", 300),
  400: createToken("#a78bfa", "violet", 400),
  500: createToken("#8b5cf6", "violet", 500),
  600: createToken("#7c3aed", "violet", 600),
  700: createToken("#6d28d9", "violet", 700),
  800: createToken("#5b21b6", "violet", 800),
  900: createToken("#4c1d95", "violet", 900),
  950: createToken("#2e1065", "violet", 950),
};

/**
 * Cyan - Accent Color
 */
export const CYAN: ColorPalette = {
  50: createToken("#ecfeff", "cyan", 50),
  100: createToken("#cffafe", "cyan", 100),
  200: createToken("#a5f3fc", "cyan", 200),
  300: createToken("#67e8f9", "cyan", 300),
  400: createToken("#22d3ee", "cyan", 400),
  500: createToken("#06b6d4", "cyan", 500),
  600: createToken("#0891b2", "cyan", 600),
  700: createToken("#0e7490", "cyan", 700),
  800: createToken("#155e75", "cyan", 800),
  900: createToken("#164e63", "cyan", 900),
  950: createToken("#083344", "cyan", 950),
};

/**
 * Slate - Neutral Color
 */
export const SLATE: ColorPalette = {
  50: createToken("#f8fafc", "slate", 50),
  100: createToken("#f1f5f9", "slate", 100),
  200: createToken("#e2e8f0", "slate", 200),
  300: createToken("#cbd5e1", "slate", 300),
  400: createToken("#94a3b8", "slate", 400),
  500: createToken("#64748b", "slate", 500),
  600: createToken("#475569", "slate", 600),
  700: createToken("#334155", "slate", 700),
  800: createToken("#1e293b", "slate", 800),
  900: createToken("#0f172a", "slate", 900),
  950: createToken("#020617", "slate", 950),
};

/**
 * Gray - Alternative Neutral
 */
export const GRAY: ColorPalette = {
  50: createToken("#f9fafb", "gray", 50),
  100: createToken("#f3f4f6", "gray", 100),
  200: createToken("#e5e7eb", "gray", 200),
  300: createToken("#d1d5db", "gray", 300),
  400: createToken("#9ca3af", "gray", 400),
  500: createToken("#6b7280", "gray", 500),
  600: createToken("#4b5563", "gray", 600),
  700: createToken("#374151", "gray", 700),
  800: createToken("#1f2937", "gray", 800),
  900: createToken("#111827", "gray", 900),
  950: createToken("#030712", "gray", 950),
};

/**
 * Emerald - Success Color
 */
export const EMERALD: ColorPalette = {
  50: createToken("#ecfdf5", "emerald", 50),
  100: createToken("#d1fae5", "emerald", 100),
  200: createToken("#a7f3d0", "emerald", 200),
  300: createToken("#6ee7b7", "emerald", 300),
  400: createToken("#34d399", "emerald", 400),
  500: createToken("#10b981", "emerald", 500),
  600: createToken("#059669", "emerald", 600),
  700: createToken("#047857", "emerald", 700),
  800: createToken("#065f46", "emerald", 800),
  900: createToken("#064e3b", "emerald", 900),
  950: createToken("#022c22", "emerald", 950),
};

/**
 * Green - Alternative Success
 */
export const GREEN: ColorPalette = {
  50: createToken("#f0fdf4", "green", 50),
  100: createToken("#dcfce7", "green", 100),
  200: createToken("#bbf7d0", "green", 200),
  300: createToken("#86efac", "green", 300),
  400: createToken("#4ade80", "green", 400),
  500: createToken("#22c55e", "green", 500),
  600: createToken("#16a34a", "green", 600),
  700: createToken("#15803d", "green", 700),
  800: createToken("#166534", "green", 800),
  900: createToken("#14532d", "green", 900),
  950: createToken("#052e16", "green", 950),
};

/**
 * Amber - Warning Color
 */
export const AMBER: ColorPalette = {
  50: createToken("#fffbeb", "amber", 50),
  100: createToken("#fef3c7", "amber", 100),
  200: createToken("#fde68a", "amber", 200),
  300: createToken("#fcd34d", "amber", 300),
  400: createToken("#fbbf24", "amber", 400),
  500: createToken("#f59e0b", "amber", 500),
  600: createToken("#d97706", "amber", 600),
  700: createToken("#b45309", "amber", 700),
  800: createToken("#92400e", "amber", 800),
  900: createToken("#78350f", "amber", 900),
  950: createToken("#451a03", "amber", 950),
};

/**
 * Yellow - Alternative Warning
 */
export const YELLOW: ColorPalette = {
  50: createToken("#fefce8", "yellow", 50),
  100: createToken("#fef9c3", "yellow", 100),
  200: createToken("#fef08a", "yellow", 200),
  300: createToken("#fde047", "yellow", 300),
  400: createToken("#facc15", "yellow", 400),
  500: createToken("#eab308", "yellow", 500),
  600: createToken("#ca8a04", "yellow", 600),
  700: createToken("#a16207", "yellow", 700),
  800: createToken("#854d0e", "yellow", 800),
  900: createToken("#713f12", "yellow", 900),
  950: createToken("#422006", "yellow", 950),
};

/**
 * Orange - Energetic Accent
 */
export const ORANGE: ColorPalette = {
  50: createToken("#fff7ed", "orange", 50),
  100: createToken("#ffedd5", "orange", 100),
  200: createToken("#fed7aa", "orange", 200),
  300: createToken("#fdba74", "orange", 300),
  400: createToken("#fb923c", "orange", 400),
  500: createToken("#f97316", "orange", 500),
  600: createToken("#ea580c", "orange", 600),
  700: createToken("#c2410c", "orange", 700),
  800: createToken("#9a3412", "orange", 800),
  900: createToken("#7c2d12", "orange", 900),
  950: createToken("#431407", "orange", 950),
};

/**
 * Rose - Error Color
 */
export const ROSE: ColorPalette = {
  50: createToken("#fff1f2", "rose", 50),
  100: createToken("#ffe4e6", "rose", 100),
  200: createToken("#fecdd3", "rose", 200),
  300: createToken("#fda4af", "rose", 300),
  400: createToken("#fb7185", "rose", 400),
  500: createToken("#f43f5e", "rose", 500),
  600: createToken("#e11d48", "rose", 600),
  700: createToken("#be123c", "rose", 700),
  800: createToken("#9f1239", "rose", 800),
  900: createToken("#881337", "rose", 900),
  950: createToken("#4c0519", "rose", 950),
};

/**
 * Red - Alternative Error
 */
export const RED: ColorPalette = {
  50: createToken("#fef2f2", "red", 50),
  100: createToken("#fee2e2", "red", 100),
  200: createToken("#fecaca", "red", 200),
  300: createToken("#fca5a5", "red", 300),
  400: createToken("#f87171", "red", 400),
  500: createToken("#ef4444", "red", 500),
  600: createToken("#dc2626", "red", 600),
  700: createToken("#b91c1c", "red", 700),
  800: createToken("#991b1b", "red", 800),
  900: createToken("#7f1d1d", "red", 900),
  950: createToken("#450a0a", "red", 950),
};

/**
 * Sky - Info Color
 */
export const SKY: ColorPalette = {
  50: createToken("#f0f9ff", "sky", 50),
  100: createToken("#e0f2fe", "sky", 100),
  200: createToken("#bae6fd", "sky", 200),
  300: createToken("#7dd3fc", "sky", 300),
  400: createToken("#38bdf8", "sky", 400),
  500: createToken("#0ea5e9", "sky", 500),
  600: createToken("#0284c7", "sky", 600),
  700: createToken("#0369a1", "sky", 700),
  800: createToken("#075985", "sky", 800),
  900: createToken("#0c4a6e", "sky", 900),
  950: createToken("#082f49", "sky", 950),
};

/**
 * Blue - Alternative Info
 */
export const BLUE: ColorPalette = {
  50: createToken("#eff6ff", "blue", 50),
  100: createToken("#dbeafe", "blue", 100),
  200: createToken("#bfdbfe", "blue", 200),
  300: createToken("#93c5fd", "blue", 300),
  400: createToken("#60a5fa", "blue", 400),
  500: createToken("#3b82f6", "blue", 500),
  600: createToken("#2563eb", "blue", 600),
  700: createToken("#1d4ed8", "blue", 700),
  800: createToken("#1e40af", "blue", 800),
  900: createToken("#1e3a8a", "blue", 900),
  950: createToken("#172554", "blue", 950),
};

/**
 * Fuchsia - Creative Accent
 */
export const FUCHSIA: ColorPalette = {
  50: createToken("#fdf4ff", "fuchsia", 50),
  100: createToken("#fae8ff", "fuchsia", 100),
  200: createToken("#f5d0fe", "fuchsia", 200),
  300: createToken("#f0abfc", "fuchsia", 300),
  400: createToken("#e879f9", "fuchsia", 400),
  500: createToken("#d946ef", "fuchsia", 500),
  600: createToken("#c026d3", "fuchsia", 600),
  700: createToken("#a21caf", "fuchsia", 700),
  800: createToken("#86198f", "fuchsia", 800),
  900: createToken("#701a75", "fuchsia", 900),
  950: createToken("#4a044e", "fuchsia", 950),
};

/**
 * Pink - Soft Accent
 */
export const PINK: ColorPalette = {
  50: createToken("#fdf2f8", "pink", 50),
  100: createToken("#fce7f3", "pink", 100),
  200: createToken("#fbcfe8", "pink", 200),
  300: createToken("#f9a8d4", "pink", 300),
  400: createToken("#f472b6", "pink", 400),
  500: createToken("#ec4899", "pink", 500),
  600: createToken("#db2777", "pink", 600),
  700: createToken("#be185d", "pink", 700),
  800: createToken("#9d174d", "pink", 800),
  900: createToken("#831843", "pink", 900),
  950: createToken("#500724", "pink", 950),
};

/**
 * Purple - Deep Accent
 */
export const PURPLE: ColorPalette = {
  50: createToken("#faf5ff", "purple", 50),
  100: createToken("#f3e8ff", "purple", 100),
  200: createToken("#e9d5ff", "purple", 200),
  300: createToken("#d8b4fe", "purple", 300),
  400: createToken("#c084fc", "purple", 400),
  500: createToken("#a855f7", "purple", 500),
  600: createToken("#9333ea", "purple", 600),
  700: createToken("#7e22ce", "purple", 700),
  800: createToken("#6b21a8", "purple", 800),
  900: createToken("#581c87", "purple", 900),
  950: createToken("#3b0764", "purple", 950),
};

/**
 * Teal - Fresh Accent
 */
export const TEAL: ColorPalette = {
  50: createToken("#f0fdfa", "teal", 50),
  100: createToken("#ccfbf1", "teal", 100),
  200: createToken("#99f6e4", "teal", 200),
  300: createToken("#5eead4", "teal", 300),
  400: createToken("#2dd4bf", "teal", 400),
  500: createToken("#14b8a6", "teal", 500),
  600: createToken("#0d9488", "teal", 600),
  700: createToken("#0f766e", "teal", 700),
  800: createToken("#115e59", "teal", 800),
  900: createToken("#134e4a", "teal", 900),
  950: createToken("#042f2e", "teal", 950),
};

/**
 * Lime - Vibrant Success
 */
export const LIME: ColorPalette = {
  50: createToken("#f7fee7", "lime", 50),
  100: createToken("#ecfccb", "lime", 100),
  200: createToken("#d9f99d", "lime", 200),
  300: createToken("#bef264", "lime", 300),
  400: createToken("#a3e635", "lime", 400),
  500: createToken("#84cc16", "lime", 500),
  600: createToken("#65a30d", "lime", 600),
  700: createToken("#4d7c0f", "lime", 700),
  800: createToken("#3f6212", "lime", 800),
  900: createToken("#365314", "lime", 900),
  950: createToken("#1a2e05", "lime", 950),
};

/**
 * All primitive colors combined
 */
export const PRIMITIVE_COLORS: PrimitiveColors = {
  indigo: INDIGO,
  violet: VIOLET,
  cyan: CYAN,
  slate: SLATE,
  gray: GRAY,
  emerald: EMERALD,
  green: GREEN,
  amber: AMBER,
  yellow: YELLOW,
  orange: ORANGE,
  rose: ROSE,
  red: RED,
  sky: SKY,
  blue: BLUE,
  fuchsia: FUCHSIA,
  pink: PINK,
  purple: PURPLE,
  teal: TEAL,
  lime: LIME,
};

/**
 * Get a primitive color by name and scale
 */
export function getPrimitiveColor(
  name: PrimitiveColorName,
  scale: ColorScale,
): ColorToken {
  return PRIMITIVE_COLORS[name][scale];
}

/**
 * Get all scales for a primitive color
 */
export function getPrimitiveColorPalette(
  name: PrimitiveColorName,
): ColorPalette {
  return PRIMITIVE_COLORS[name];
}
