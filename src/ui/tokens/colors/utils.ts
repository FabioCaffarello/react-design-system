/**
 * AIppin Design System - Color Utilities
 *
 * Helper functions for working with colors.
 *
 * @brand AIppin
 * @version 1.0.0
 */

import type {
  ColorToken,
  ColorScale,
  PrimitiveColorName,
  SemanticColorName,
  GetColorOptions,
  GetColorClassOptions,
} from "./types";
import { getPrimitiveColor } from "./primitives";
import { getSemanticColor } from "./semantic";

/**
 * Get a primitive color value in the specified format
 */
export function getColor(
  name: PrimitiveColorName,
  scale: ColorScale,
  options: GetColorOptions = {},
): string {
  const { format = "hex", opacity } = options;
  const token = getPrimitiveColor(name, scale);

  let value: string;
  switch (format) {
    case "rgb":
      value =
        opacity !== undefined
          ? `rgba(${token.rgb}, ${opacity})`
          : `rgb(${token.rgb})`;
      break;
    case "hsl":
      value =
        opacity !== undefined
          ? `hsla(${token.hsl}, ${opacity})`
          : `hsl(${token.hsl})`;
      break;
    case "cssVar":
      value = token.cssVar;
      break;
    case "tailwind":
      value = token.tailwind;
      break;
    case "hex":
    default:
      value = token.hex;
  }

  return value;
}

/**
 * Get a semantic color value in the specified format
 */
export function getSemanticColorValue(
  role: SemanticColorName,
  shade: "light" | "DEFAULT" | "dark" | "contrast" = "DEFAULT",
  options: GetColorOptions = {},
): string {
  const { format = "hex", opacity } = options;
  const token = getSemanticColor(role, shade);

  let value: string;
  switch (format) {
    case "rgb":
      value =
        opacity !== undefined
          ? `rgba(${token.rgb}, ${opacity})`
          : `rgb(${token.rgb})`;
      break;
    case "hsl":
      value =
        opacity !== undefined
          ? `hsla(${token.hsl}, ${opacity})`
          : `hsl(${token.hsl})`;
      break;
    case "cssVar":
      value = token.cssVar;
      break;
    case "tailwind":
      value = token.tailwind;
      break;
    case "hex":
    default:
      value = token.hex;
  }

  return value;
}

/**
 * Get Tailwind color class for a primitive color
 */
export function getColorClass(
  name: PrimitiveColorName,
  scale: ColorScale,
  options: GetColorClassOptions = {},
): string {
  const {
    type = "text",
    hover = false,
    focus = false,
    active = false,
  } = options;
  const token = getPrimitiveColor(name, scale);
  const base = `${type}-${token.tailwind}`;

  const classes: string[] = [base];

  if (hover) {
    classes.push(`hover:${type}-${token.tailwind}`);
  }
  if (focus) {
    classes.push(`focus:${type}-${token.tailwind}`);
  }
  if (active) {
    classes.push(`active:${type}-${token.tailwind}`);
  }

  return classes.join(" ");
}

/**
 * Get Tailwind color class for a semantic color
 */
export function getSemanticColorClass(
  role: SemanticColorName,
  shade: "light" | "DEFAULT" | "dark" = "DEFAULT",
  options: GetColorClassOptions = {},
): string {
  const {
    type = "text",
    hover = false,
    focus = false,
    active = false,
  } = options;
  const token = getSemanticColor(role, shade);
  const base = `${type}-${token.tailwind}`;

  const classes: string[] = [base];

  if (hover) {
    const hoverToken = getSemanticColor(
      role,
      shade === "DEFAULT" ? "dark" : "DEFAULT",
    );
    classes.push(`hover:${type}-${hoverToken.tailwind}`);
  }
  if (focus) {
    classes.push(`focus:${type}-${token.tailwind}`);
  }
  if (active) {
    const activeToken = getSemanticColor(role, "dark");
    classes.push(`active:${type}-${activeToken.tailwind}`);
  }

  return classes.join(" ");
}

/**
 * Get hover color class
 */
export function getHoverColorClass(
  name: PrimitiveColorName,
  scale: ColorScale,
  type: "text" | "bg" | "border" = "bg",
): string {
  const token = getPrimitiveColor(name, scale);
  return `hover:${type}-${token.tailwind}`;
}

/**
 * Get focus color class
 */
export function getFocusColorClass(
  name: PrimitiveColorName,
  scale: ColorScale,
  type: "text" | "bg" | "border" = "border",
): string {
  const token = getPrimitiveColor(name, scale);
  return `focus:${type}-${token.tailwind}`;
}

/**
 * Get focus ring class for a color
 */
export function getFocusRingClass(
  name: PrimitiveColorName,
  scale: ColorScale,
): string {
  const token = getPrimitiveColor(name, scale);
  return `focus:ring-${token.tailwind}`;
}

/**
 * Generate a color with opacity
 */
export function withOpacity(token: ColorToken, opacity: number): string {
  return `rgba(${token.rgb}, ${opacity})`;
}

/**
 * Check if a color is considered "light" (for contrast calculations)
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgbArray(hex);
  if (!rgb) return true;

  // Calculate relative luminance
  const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
  return luminance > 128;
}

/**
 * Get contrast color (black or white) for a given color
 */
export function getContrastColor(hex: string): "#000000" | "#ffffff" {
  return isLightColor(hex) ? "#000000" : "#ffffff";
}

/**
 * Convert hex to RGB array
 */
function hexToRgbArray(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

/**
 * Blend two colors together
 */
export function blendColors(
  color1: string,
  color2: string,
  weight: number = 0.5,
): string {
  const rgb1 = hexToRgbArray(color1);
  const rgb2 = hexToRgbArray(color2);

  if (!rgb1 || !rgb2) return color1;

  const r = Math.round(rgb1[0] * (1 - weight) + rgb2[0] * weight);
  const g = Math.round(rgb1[1] * (1 - weight) + rgb2[1] * weight);
  const b = Math.round(rgb1[2] * (1 - weight) + rgb2[2] * weight);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Lighten a color by a percentage
 */
export function lighten(hex: string, percent: number): string {
  return blendColors(hex, "#ffffff", percent / 100);
}

/**
 * Darken a color by a percentage
 */
export function darken(hex: string, percent: number): string {
  return blendColors(hex, "#000000", percent / 100);
}
