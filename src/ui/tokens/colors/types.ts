/**
 * Design System - Color Token Types
 *
 * TypeScript types for the color system.
 *
 * @brand brasil-a-vera (default, overridable)
 * @version 1.0.0
 */

/**
 * Color scale values (50-950)
 * Standard Tailwind-compatible color scale
 */
export type ColorScale =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

/**
 * All available color scale values as array
 */
export const COLOR_SCALES: ColorScale[] = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
];

/**
 * Primitive color names (raw color palettes)
 *
 * Two families coexist:
 * - Tailwind tones (indigo, violet, ..., lime) — honest to Tailwind v4 HEX.
 * - Brand primitives (brand-primary, brand-secondary) — the design system's
 *   own scales, declared in src/styles/primitives/brand.css and mirrored
 *   in src/ui/tokens/colors/brand.ts. These are the reskin surface;
 *   semantic tokens reference them, not Tailwind tones.
 */
export type PrimitiveColorName =
  | "brand-primary"
  | "brand-secondary"
  | "indigo"
  | "violet"
  | "cyan"
  | "slate"
  | "gray"
  | "emerald"
  | "green"
  | "amber"
  | "yellow"
  | "orange"
  | "rose"
  | "red"
  | "sky"
  | "blue"
  | "fuchsia"
  | "pink"
  | "purple"
  | "teal"
  | "lime";

/**
 * Semantic color names (meaningful colors)
 */
export type SemanticColorName =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

/**
 * Text color semantic names
 */
export type TextColorName =
  | "primary"
  | "secondary"
  | "tertiary"
  | "quaternary"
  | "placeholder"
  | "disabled"
  | "inverse"
  | "link"
  | "success"
  | "warning"
  | "error"
  | "info";

/**
 * Background color semantic names
 */
export type BgColorName =
  | "base"
  | "subtle"
  | "muted"
  | "emphasis"
  | "strong"
  | "inverse"
  | "brand"
  | "secondary"
  | "accent";

/**
 * Border color semantic names
 */
export type BorderColorName =
  | "default"
  | "muted"
  | "subtle"
  | "emphasis"
  | "strong"
  | "focus"
  | "brand";

/**
 * State color names
 */
export type StateColorName =
  | "hover"
  | "active"
  | "selected"
  | "disabled"
  | "focus";

/**
 * Theme mode
 */
export type ThemeMode = "light" | "dark";

/**
 * Theme variant (visual style)
 */
export type ThemeVariant = "tech" | "creative" | "minimal";

/**
 * Single color token with multiple formats
 */
export interface ColorToken {
  /** Hex color value (e.g., #6366f1) */
  hex: string;
  /** RGB values as string (e.g., "99, 102, 241") */
  rgb: string;
  /** HSL values as string (e.g., "239, 84%, 67%") */
  hsl: string;
  /** CSS variable reference (e.g., "var(--color-indigo-500)") */
  cssVar: string;
  /** Tailwind class suffix (e.g., "indigo-500") */
  tailwind: string;
}

/**
 * Complete color palette (all shades)
 */
export type ColorPalette = Record<ColorScale, ColorToken>;

/**
 * Semantic color with light/dark/contrast variants
 */
export interface SemanticColor {
  light: ColorToken;
  DEFAULT: ColorToken;
  dark: ColorToken;
  contrast: ColorToken;
}

/**
 * Complete semantic color palette
 */
export type SemanticColorPalette = Record<SemanticColorName, SemanticColor>;

/**
 * All primitive colors
 */
export type PrimitiveColors = Record<PrimitiveColorName, ColorPalette>;

/**
 * Theme color configuration
 */
export interface ThemeColors {
  /** Brand colors */
  brand: {
    primary: ColorToken;
    primaryLight: ColorToken;
    primaryDark: ColorToken;
    secondary: ColorToken;
    secondaryLight: ColorToken;
    secondaryDark: ColorToken;
    accent: ColorToken;
    accentLight: ColorToken;
    accentDark: ColorToken;
  };
  /** Text colors */
  text: Record<TextColorName, ColorToken>;
  /** Background colors */
  bg: Record<BgColorName, ColorToken>;
  /** Border colors */
  border: Record<BorderColorName, ColorToken>;
  /** State colors */
  state: Record<StateColorName, ColorToken>;
  /** Feedback colors */
  feedback: {
    success: ColorToken;
    successBg: ColorToken;
    warning: ColorToken;
    warningBg: ColorToken;
    error: ColorToken;
    errorBg: ColorToken;
    info: ColorToken;
    infoBg: ColorToken;
  };
}

/**
 * Color utility function options
 */
export interface GetColorOptions {
  /** Output format */
  format?: "hex" | "rgb" | "hsl" | "cssVar" | "tailwind";
  /** Include opacity */
  opacity?: number;
}

/**
 * Color class generation options
 */
export interface GetColorClassOptions {
  /** Class type */
  type?: "text" | "bg" | "border" | "ring" | "fill" | "stroke";
  /** Include hover variant */
  hover?: boolean;
  /** Include focus variant */
  focus?: boolean;
  /** Include active variant */
  active?: boolean;
}
