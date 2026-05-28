/**
 * Spacing Tokens
 *
 * Centralized spacing scale based on 4px base unit.
 * Uses Factory Pattern for type-safe token creation.
 */

export type SpacingScale =
  | 0
  | 0.5
  | 1
  | 1.5
  | 2
  | 2.5
  | 3
  | 3.5
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24
  | 32
  | 40
  | 48
  | 64
  | 80
  | 96;

export interface SpacingToken {
  value: number;
  rem: string;
  px: string;
  tailwind: string;
}

/**
 * Spacing Token Factory
 * Creates spacing tokens with consistent naming and values
 */
export class SpacingTokenFactory {
  private static readonly BASE_UNIT = 4; // 4px base

  /**
   * Create a spacing token from scale value
   */
  static create(scale: SpacingScale): SpacingToken {
    const px = scale * this.BASE_UNIT;
    const rem = px / 16; // 16px = 1rem

    return {
      value: px,
      rem: `${rem}rem`,
      px: `${px}px`,
      tailwind: this.getTailwindClass(scale),
    };
  }

  /**
   * Get Tailwind class for spacing value
   */
  private static getTailwindClass(scale: SpacingScale): string {
    const tailwindMap: Record<SpacingScale, string> = {
      0: "0",
      0.5: "0.5", // 2px — half-step, used by fine UI (badges, switches, separators)
      1: "1", // 4px
      1.5: "1.5", // 6px — half-step
      2: "2", // 8px
      2.5: "2.5", // 10px — half-step
      3: "3", // 12px
      3.5: "3.5", // 14px — half-step
      4: "4", // 16px
      5: "5", // 20px
      6: "6", // 24px
      8: "8", // 32px
      10: "10", // 40px
      12: "12", // 48px
      16: "16", // 64px
      20: "20", // 80px
      24: "24", // 96px
      32: "32", // 128px
      40: "40", // 160px
      48: "48", // 192px
      64: "64", // 256px
      80: "80", // 320px
      96: "96", // 384px
    };

    return tailwindMap[scale] || String(scale);
  }
}

/**
 * Pre-defined spacing tokens
 */
export const SPACING_TOKENS = {
  // Micro spacing (0-14px)
  none: SpacingTokenFactory.create(0),
  "0.5": SpacingTokenFactory.create(0.5), // 2px (half-step)
  xs: SpacingTokenFactory.create(1), // 4px
  "1.5": SpacingTokenFactory.create(1.5), // 6px (half-step)
  sm: SpacingTokenFactory.create(2), // 8px
  "2.5": SpacingTokenFactory.create(2.5), // 10px (half-step)
  md: SpacingTokenFactory.create(3), // 12px
  "3.5": SpacingTokenFactory.create(3.5), // 14px (half-step)

  // Standard spacing (16-32px)
  base: SpacingTokenFactory.create(4), // 16px
  lg: SpacingTokenFactory.create(6), // 24px
  xl: SpacingTokenFactory.create(8), // 32px

  // Large spacing (40-64px)
  "2xl": SpacingTokenFactory.create(10), // 40px
  "3xl": SpacingTokenFactory.create(12), // 48px
  "4xl": SpacingTokenFactory.create(16), // 64px

  // Extra large spacing (80px+)
  "5xl": SpacingTokenFactory.create(20), // 80px
  "6xl": SpacingTokenFactory.create(24), // 96px
} as const;

/**
 * Helper function to get spacing value
 */
export function getSpacing(scale: keyof typeof SPACING_TOKENS): SpacingToken {
  return SPACING_TOKENS[scale];
}

/**
 * Helper function to get spacing as Tailwind class
 */
export function getSpacingClass(
  scale: keyof typeof SPACING_TOKENS,
  direction:
    | "p"
    | "m"
    | "px"
    | "mx"
    | "py"
    | "my"
    | "pt"
    | "mt"
    | "pr"
    | "mr"
    | "pb"
    | "mb"
    | "pl"
    | "ml"
    | "gap"
    | "gap-x"
    | "gap-y"
    | "space-y" = "p",
): string {
  const token = SPACING_TOKENS[scale];
  const value = token.tailwind;

  const prefixMap: Record<string, string> = {
    p: "p",
    m: "m",
    px: "px",
    mx: "mx",
    py: "py",
    my: "my",
    pt: "pt",
    mt: "mt",
    pr: "pr",
    mr: "mr",
    pb: "pb",
    mb: "mb",
    pl: "pl",
    ml: "ml",
    gap: "gap",
    "gap-x": "gap-x",
    "gap-y": "gap-y",
    "space-y": "space-y",
  };

  return `${prefixMap[direction]}-${value}`;
}
