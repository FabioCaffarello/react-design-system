/**
 * Border Radius Tokens
 *
 * Centralized border radius system for consistent rounded corners.
 * Uses Factory Pattern for type-safe token creation.
 */

export type RadiusSize =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export interface RadiusToken {
  value: number;
  rem: string;
  px: string;
  tailwind: string;
  description: string;
}

/**
 * Radius Token Factory
 * Creates radius tokens with consistent values
 */
export class RadiusTokenFactory {
  /**
   * Create a radius token
   */
  static create(size: RadiusSize): RadiusToken {
    const radiusMap: Record<
      RadiusSize,
      { px: number; tailwind: string; description: string }
    > = {
      none: {
        px: 0,
        tailwind: "rounded-none",
        description: "No border radius",
      },
      sm: {
        px: 2,
        tailwind: "rounded-sm",
        description: "Small radius (2px) for subtle rounding",
      },
      md: {
        px: 6,
        tailwind: "rounded-md",
        description: "Medium radius (6px) for buttons and inputs",
      },
      lg: {
        px: 8,
        tailwind: "rounded-lg",
        description: "Large radius (8px) for cards and containers",
      },
      xl: {
        px: 12,
        tailwind: "rounded-xl",
        description: "Extra large radius (12px) for prominent elements",
      },
      "2xl": {
        px: 16,
        tailwind: "rounded-2xl",
        description: "2X large radius (16px) for large containers",
      },
      "3xl": {
        px: 24,
        tailwind: "rounded-3xl",
        description: "3X large radius (24px) for very large containers",
      },
      full: {
        px: 9999,
        tailwind: "rounded-full",
        description: "Full radius for circular elements",
      },
    };

    const config = radiusMap[size];
    return {
      value: config.px,
      rem: `${config.px / 16}rem`,
      px: `${config.px}px`,
      tailwind: config.tailwind,
      description: config.description,
    };
  }
}

/**
 * Pre-defined radius tokens
 */
export const RADIUS_TOKENS = {
  none: RadiusTokenFactory.create("none"),
  sm: RadiusTokenFactory.create("sm"),
  md: RadiusTokenFactory.create("md"),
  lg: RadiusTokenFactory.create("lg"),
  xl: RadiusTokenFactory.create("xl"),
  "2xl": RadiusTokenFactory.create("2xl"),
  "3xl": RadiusTokenFactory.create("3xl"),
  full: RadiusTokenFactory.create("full"),
} as const;

/**
 * Helper function to get radius token
 */
export function getRadius(size: keyof typeof RADIUS_TOKENS): RadiusToken {
  return RADIUS_TOKENS[size];
}

/**
 * Helper function to get radius as Tailwind class
 */
export function getRadiusClass(size: keyof typeof RADIUS_TOKENS): string {
  return RADIUS_TOKENS[size].tailwind;
}
