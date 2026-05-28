/**
 * AIppin Design System - Color Tokens Index
 *
 * Central export for all color-related tokens and utilities.
 *
 * @brand AIppin
 * @version 1.0.0
 */

// Types
export type {
  ColorScale,
  PrimitiveColorName,
  SemanticColorName,
  TextColorName,
  BgColorName,
  BorderColorName,
  StateColorName,
  ThemeMode,
  ThemeVariant,
  ColorToken,
  ColorPalette,
  SemanticColor,
  SemanticColorPalette,
  PrimitiveColors,
  ThemeColors,
  GetColorOptions,
  GetColorClassOptions,
} from "./types";

export { COLOR_SCALES } from "./types";

// Primitive color palettes
export {
  INDIGO,
  VIOLET,
  CYAN,
  SLATE,
  GRAY,
  EMERALD,
  GREEN,
  AMBER,
  YELLOW,
  ORANGE,
  ROSE,
  RED,
  SKY,
  BLUE,
  FUCHSIA,
  PINK,
  PURPLE,
  TEAL,
  LIME,
  PRIMITIVE_COLORS,
  getPrimitiveColor,
  getPrimitiveColorPalette,
} from "./primitives";

// Semantic colors
export {
  SEMANTIC_COLORS,
  SEMANTIC_COLORS_LIGHT,
  SEMANTIC_COLORS_DARK,
  getSemanticColor,
  getSemanticColorRole,
} from "./semantic";

// Utilities
export {
  getColor,
  getSemanticColorValue,
  getColorClass,
  getSemanticColorClass,
  getHoverColorClass,
  getFocusColorClass,
  getFocusRingClass,
  withOpacity,
  isLightColor,
  getContrastColor,
  blendColors,
  lighten,
  darken,
} from "./utils";

// Re-export brand colors for convenience
export const BRAND_COLORS = {
  primary: {
    name: "indigo" as const,
    light: 400 as const,
    default: 500 as const,
    dark: 600 as const,
  },
  secondary: {
    name: "violet" as const,
    light: 400 as const,
    default: 500 as const,
    dark: 600 as const,
  },
  accent: {
    name: "cyan" as const,
    light: 400 as const,
    default: 500 as const,
    dark: 600 as const,
  },
} as const;
