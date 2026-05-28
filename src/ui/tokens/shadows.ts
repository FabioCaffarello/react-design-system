/**
 * Shadow Tokens
 *
 * Centralized shadow system for consistent elevation and depth.
 * Uses Factory Pattern for type-safe token creation.
 */

export type ShadowSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner";

export interface ShadowToken {
  value: string;
  tailwind: string;
  description: string;
}

/**
 * Shadow Token Factory
 * Creates shadow tokens with consistent values
 */
export class ShadowTokenFactory {
  /**
   * Create a shadow token
   */
  static create(size: ShadowSize): ShadowToken {
    const shadowMap: Record<
      ShadowSize,
      { value: string; tailwind: string; description: string }
    > = {
      none: {
        value: "none",
        tailwind: "shadow-none",
        description: "No shadow",
      },
      sm: {
        value: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        tailwind: "shadow-sm",
        description: "Small shadow for subtle elevation",
      },
      md: {
        value: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        tailwind: "shadow-md",
        description: "Medium shadow for cards and elevated elements",
      },
      lg: {
        value:
          "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        tailwind: "shadow-lg",
        description: "Large shadow for modals and dropdowns",
      },
      xl: {
        value:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        tailwind: "shadow-xl",
        description: "Extra large shadow for prominent modals",
      },
      "2xl": {
        value:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        tailwind: "shadow-2xl",
        description: "2X large shadow for maximum elevation",
      },
      inner: {
        value: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
        tailwind: "shadow-inner",
        description: "Inner shadow for inset elements",
      },
    };

    return shadowMap[size];
  }
}

/**
 * Pre-defined shadow tokens
 */
export const SHADOW_TOKENS = {
  none: ShadowTokenFactory.create("none"),
  sm: ShadowTokenFactory.create("sm"),
  md: ShadowTokenFactory.create("md"),
  lg: ShadowTokenFactory.create("lg"),
  xl: ShadowTokenFactory.create("xl"),
  "2xl": ShadowTokenFactory.create("2xl"),
  inner: ShadowTokenFactory.create("inner"),
} as const;

/**
 * Helper function to get shadow token
 */
export function getShadow(size: keyof typeof SHADOW_TOKENS): ShadowToken {
  return SHADOW_TOKENS[size];
}

/**
 * Helper function to get shadow as Tailwind class
 */
export function getShadowClass(size: keyof typeof SHADOW_TOKENS): string {
  return SHADOW_TOKENS[size].tailwind;
}
