/**
 * Gradient Tokens
 *
 * Centralized gradient system for consistent color gradients.
 * Uses Factory Pattern for type-safe token creation.
 */

import { COLOR_TOKENS_LIGHT } from "./colors";

export type GradientDirection =
  | "to-r"
  | "to-l"
  | "to-t"
  | "to-b"
  | "to-tr"
  | "to-tl"
  | "to-br"
  | "to-bl";
export type GradientRole =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";

export interface GradientToken {
  value: string;
  tailwind: string;
  description: string;
  from: string;
  via?: string;
  to: string;
}

/**
 * Gradient Token Factory
 * Creates gradient tokens with consistent color schemes
 */
export class GradientTokenFactory {
  /**
   * Create a gradient token
   */
  static create(
    role: GradientRole,
    direction: GradientDirection = "to-r",
  ): GradientToken {
    const colorMap: Record<
      GradientRole,
      { from: string; via?: string; to: string; description: string }
    > = {
      primary: {
        from: COLOR_TOKENS_LIGHT.primary.light.hex,
        via: COLOR_TOKENS_LIGHT.primary.DEFAULT.hex,
        to: COLOR_TOKENS_LIGHT.primary.dark.hex,
        description: "Primary color gradient",
      },
      secondary: {
        from: COLOR_TOKENS_LIGHT.secondary.light.hex,
        via: COLOR_TOKENS_LIGHT.secondary.DEFAULT.hex,
        to: COLOR_TOKENS_LIGHT.secondary.dark.hex,
        description: "Secondary color gradient",
      },
      success: {
        from: COLOR_TOKENS_LIGHT.success.light.hex,
        to: COLOR_TOKENS_LIGHT.success.dark.hex,
        description: "Success color gradient",
      },
      error: {
        from: COLOR_TOKENS_LIGHT.error.light.hex,
        to: COLOR_TOKENS_LIGHT.error.dark.hex,
        description: "Error color gradient",
      },
      info: {
        from: COLOR_TOKENS_LIGHT.info.light.hex,
        to: COLOR_TOKENS_LIGHT.info.dark.hex,
        description: "Info color gradient",
      },
      warning: {
        from: COLOR_TOKENS_LIGHT.warning.light.hex,
        to: COLOR_TOKENS_LIGHT.warning.dark.hex,
        description: "Warning color gradient",
      },
    };

    const colors = colorMap[role];
    const directionMap: Record<GradientDirection, string> = {
      "to-r": "to right",
      "to-l": "to left",
      "to-t": "to top",
      "to-b": "to bottom",
      "to-tr": "to top right",
      "to-tl": "to top left",
      "to-br": "to bottom right",
      "to-bl": "to bottom left",
    };

    // Build CSS gradient value
    let gradientValue = `linear-gradient(${directionMap[direction]}, ${colors.from}`;
    if (colors.via) {
      gradientValue += `, ${colors.via}`;
    }
    gradientValue += `, ${colors.to})`;

    // Build Tailwind classes
    const tailwindParts: string[] = [];

    // Direction class
    tailwindParts.push(`bg-gradient-${direction.replace("to-", "")}`);

    // Color classes (using from-*, via-*, to-* syntax)
    // Note: We'll use arbitrary values for custom colors
    tailwindParts.push(`from-[${colors.from}]`);
    if (colors.via) {
      tailwindParts.push(`via-[${colors.via}]`);
    }
    tailwindParts.push(`to-[${colors.to}]`);

    return {
      value: gradientValue,
      tailwind: tailwindParts.join(" "),
      description: colors.description,
      from: colors.from,
      via: colors.via,
      to: colors.to,
    };
  }

  /**
   * Convert hex color to approximate Tailwind color class
   * This is a helper for documentation, actual implementation uses arbitrary values
   * @deprecated Not currently used, kept for potential future use
   */
  // @ts-expect-error - Method kept for potential future use
  private static hexToTailwindColor(_hex: string): string {
    // This is a simplified mapping for documentation purposes
    // In practice, we use arbitrary values like from-[#hex]
    return _hex;
  }
}

/**
 * Pre-defined gradient tokens
 */
export const GRADIENT_TOKENS = {
  primary: GradientTokenFactory.create("primary"),
  secondary: GradientTokenFactory.create("secondary"),
  success: GradientTokenFactory.create("success"),
  error: GradientTokenFactory.create("error"),
  info: GradientTokenFactory.create("info"),
  warning: GradientTokenFactory.create("warning"),

  // Common directions
  "primary-to-r": GradientTokenFactory.create("primary", "to-r"),
  "primary-to-b": GradientTokenFactory.create("primary", "to-b"),
  "secondary-to-r": GradientTokenFactory.create("secondary", "to-r"),
  "success-to-r": GradientTokenFactory.create("success", "to-r"),
  "error-to-r": GradientTokenFactory.create("error", "to-r"),
} as const;

/**
 * Helper function to get gradient token
 */
export function getGradient(
  role: GradientRole,
  direction?: GradientDirection,
): GradientToken {
  return GradientTokenFactory.create(role, direction);
}

/**
 * Helper function to get gradient as Tailwind classes
 */
export function getGradientClass(
  role: GradientRole,
  direction: GradientDirection = "to-r",
): string {
  return GradientTokenFactory.create(role, direction).tailwind;
}
