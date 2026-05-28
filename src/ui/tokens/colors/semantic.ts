/**
 * AIppin Design System - Semantic Color Tokens
 *
 * Semantic colors that reference primitive palettes.
 * These are the colors you should use in components.
 *
 * @brand AIppin
 * @version 1.0.0
 */

import type {
  SemanticColor,
  SemanticColorName,
  SemanticColorPalette,
  ColorToken,
} from "./types";
import {
  INDIGO,
  VIOLET,
  CYAN,
  SLATE,
  EMERALD,
  AMBER,
  ROSE,
  SKY,
} from "./primitives";

/**
 * Light theme semantic colors
 */
export const SEMANTIC_COLORS_LIGHT: SemanticColorPalette = {
  primary: {
    light: INDIGO[400],
    DEFAULT: INDIGO[500],
    dark: INDIGO[600],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
  secondary: {
    light: VIOLET[400],
    DEFAULT: VIOLET[500],
    dark: VIOLET[600],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
  accent: {
    light: CYAN[400],
    DEFAULT: CYAN[500],
    dark: CYAN[600],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
  success: {
    light: EMERALD[400],
    DEFAULT: EMERALD[500],
    dark: EMERALD[600],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
  warning: {
    light: AMBER[400],
    DEFAULT: AMBER[500],
    dark: AMBER[600],
    contrast: {
      hex: "#000000",
      rgb: "0, 0, 0",
      hsl: "0, 0%, 0%",
      cssVar: "var(--color-black)",
      tailwind: "black",
    },
  },
  error: {
    light: ROSE[400],
    DEFAULT: ROSE[500],
    dark: ROSE[600],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
  info: {
    light: SKY[400],
    DEFAULT: SKY[500],
    dark: SKY[600],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
  neutral: {
    light: SLATE[100],
    DEFAULT: SLATE[500],
    dark: SLATE[700],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
};

/**
 * Dark theme semantic colors
 */
export const SEMANTIC_COLORS_DARK: SemanticColorPalette = {
  primary: {
    light: INDIGO[500],
    DEFAULT: INDIGO[400],
    dark: INDIGO[300],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
  secondary: {
    light: VIOLET[500],
    DEFAULT: VIOLET[400],
    dark: VIOLET[300],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
  accent: {
    light: CYAN[500],
    DEFAULT: CYAN[400],
    dark: CYAN[300],
    contrast: {
      hex: "#000000",
      rgb: "0, 0, 0",
      hsl: "0, 0%, 0%",
      cssVar: "var(--color-black)",
      tailwind: "black",
    },
  },
  success: {
    light: EMERALD[500],
    DEFAULT: EMERALD[400],
    dark: EMERALD[300],
    contrast: {
      hex: "#000000",
      rgb: "0, 0, 0",
      hsl: "0, 0%, 0%",
      cssVar: "var(--color-black)",
      tailwind: "black",
    },
  },
  warning: {
    light: AMBER[500],
    DEFAULT: AMBER[400],
    dark: AMBER[300],
    contrast: {
      hex: "#000000",
      rgb: "0, 0, 0",
      hsl: "0, 0%, 0%",
      cssVar: "var(--color-black)",
      tailwind: "black",
    },
  },
  error: {
    light: ROSE[500],
    DEFAULT: ROSE[400],
    dark: ROSE[300],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
  info: {
    light: SKY[500],
    DEFAULT: SKY[400],
    dark: SKY[300],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
  neutral: {
    light: SLATE[700],
    DEFAULT: SLATE[400],
    dark: SLATE[300],
    contrast: {
      hex: "#ffffff",
      rgb: "255, 255, 255",
      hsl: "0, 0%, 100%",
      cssVar: "var(--color-white)",
      tailwind: "white",
    },
  },
};

/**
 * Default semantic colors (light theme)
 */
export const SEMANTIC_COLORS = SEMANTIC_COLORS_LIGHT;

/**
 * Get semantic color by role and shade
 */
export function getSemanticColor(
  role: SemanticColorName,
  shade: "light" | "DEFAULT" | "dark" | "contrast" = "DEFAULT",
  theme: "light" | "dark" = "light",
): ColorToken {
  const colors =
    theme === "dark" ? SEMANTIC_COLORS_DARK : SEMANTIC_COLORS_LIGHT;
  return colors[role][shade];
}

/**
 * Get all shades for a semantic color role
 */
export function getSemanticColorRole(
  role: SemanticColorName,
  theme: "light" | "dark" = "light",
): SemanticColor {
  const colors =
    theme === "dark" ? SEMANTIC_COLORS_DARK : SEMANTIC_COLORS_LIGHT;
  return colors[role];
}
