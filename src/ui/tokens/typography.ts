/**
 * Typography Tokens
 *
 * Centralized typography system with font families, sizes, weights, and line heights.
 * Uses Factory Pattern for type-safe token creation.
 */

export type FontFamily = "sans" | "serif" | "mono";
export type FontWeight = "light" | "normal" | "medium" | "semibold" | "bold";
export type FontSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";
export type LineHeight =
  | "none"
  | "tight"
  | "snug"
  | "normal"
  | "relaxed"
  | "loose";

export interface TypographyToken {
  fontSize: {
    value: number;
    rem: string;
    px: string;
    tailwind: string;
  };
  lineHeight: {
    value: number;
    tailwind: string;
  };
  fontWeight: {
    value: number;
    tailwind: string;
  };
}

export interface FontFamilyToken {
  name: string;
  stack: string;
  tailwind: string;
}

export interface FontWeightToken {
  value: number;
  tailwind: string;
}

/**
 * Typography Token Factory
 * Creates typography tokens with consistent values
 */
export class TypographyTokenFactory {
  /**
   * Create font size token
   */
  static createFontSize(size: FontSize): TypographyToken["fontSize"] {
    const sizeMap: Record<FontSize, { px: number; tailwind: string }> = {
      xs: { px: 12, tailwind: "text-xs" },
      sm: { px: 14, tailwind: "text-sm" },
      base: { px: 16, tailwind: "text-base" },
      lg: { px: 18, tailwind: "text-lg" },
      xl: { px: 20, tailwind: "text-xl" },
      "2xl": { px: 24, tailwind: "text-2xl" },
      "3xl": { px: 30, tailwind: "text-3xl" },
      "4xl": { px: 36, tailwind: "text-4xl" },
      "5xl": { px: 48, tailwind: "text-5xl" },
      "6xl": { px: 60, tailwind: "text-6xl" },
    };

    const config = sizeMap[size];
    return {
      value: config.px,
      rem: `${config.px / 16}rem`,
      px: `${config.px}px`,
      tailwind: config.tailwind,
    };
  }

  /**
   * Create line height token
   */
  static createLineHeight(height: LineHeight): TypographyToken["lineHeight"] {
    const heightMap: Record<LineHeight, { value: number; tailwind: string }> = {
      none: { value: 1, tailwind: "leading-none" },
      tight: { value: 1.25, tailwind: "leading-tight" },
      snug: { value: 1.375, tailwind: "leading-snug" },
      normal: { value: 1.5, tailwind: "leading-normal" },
      relaxed: { value: 1.625, tailwind: "leading-relaxed" },
      loose: { value: 2, tailwind: "leading-loose" },
    };

    const config = heightMap[height];
    return {
      value: config.value,
      tailwind: config.tailwind,
    };
  }

  /**
   * Create font weight token
   */
  static createFontWeight(weight: FontWeight): FontWeightToken {
    const weightMap: Record<FontWeight, { value: number; tailwind: string }> = {
      light: { value: 300, tailwind: "font-light" },
      normal: { value: 400, tailwind: "font-normal" },
      medium: { value: 500, tailwind: "font-medium" },
      semibold: { value: 600, tailwind: "font-semibold" },
      bold: { value: 700, tailwind: "font-bold" },
    };

    const config = weightMap[weight];
    return {
      value: config.value,
      tailwind: config.tailwind,
    };
  }

  /**
   * Create complete typography token
   */
  static create(
    size: FontSize,
    lineHeight: LineHeight = "normal",
    weight: FontWeight = "normal",
  ): TypographyToken {
    return {
      fontSize: this.createFontSize(size),
      lineHeight: this.createLineHeight(lineHeight),
      fontWeight: this.createFontWeight(weight),
    };
  }
}

/**
 * Font family tokens
 */
export const FONT_FAMILY_TOKENS: Record<FontFamily, FontFamilyToken> = {
  sans: {
    name: "sans",
    stack:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    tailwind: "font-sans",
  },
  serif: {
    name: "serif",
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    tailwind: "font-serif",
  },
  mono: {
    name: "mono",
    stack:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    tailwind: "font-mono",
  },
} as const;

/**
 * Font weight tokens
 */
export const FONT_WEIGHT_TOKENS: Record<FontWeight, FontWeightToken> = {
  light: TypographyTokenFactory.createFontWeight("light"),
  normal: TypographyTokenFactory.createFontWeight("normal"),
  medium: TypographyTokenFactory.createFontWeight("medium"),
  semibold: TypographyTokenFactory.createFontWeight("semibold"),
  bold: TypographyTokenFactory.createFontWeight("bold"),
} as const;

/**
 * Pre-defined typography tokens for common use cases
 */
export const TYPOGRAPHY_TOKENS = {
  // Headings
  h1: TypographyTokenFactory.create("4xl", "tight", "bold"),
  h2: TypographyTokenFactory.create("3xl", "tight", "bold"),
  h3: TypographyTokenFactory.create("2xl", "snug", "semibold"),
  h4: TypographyTokenFactory.create("xl", "snug", "semibold"),
  h5: TypographyTokenFactory.create("lg", "normal", "medium"),
  h6: TypographyTokenFactory.create("base", "normal", "medium"),

  // Body text
  body: TypographyTokenFactory.create("base", "relaxed", "normal"),
  bodySmall: TypographyTokenFactory.create("sm", "relaxed", "normal"),
  bodyLarge: TypographyTokenFactory.create("lg", "relaxed", "normal"),

  // UI elements
  label: TypographyTokenFactory.create("sm", "normal", "medium"),
  caption: TypographyTokenFactory.create("xs", "normal", "normal"),
  button: TypographyTokenFactory.create("base", "normal", "medium"),
} as const;

/**
 * Helper function to get typography token
 */
export function getTypography(
  variant: keyof typeof TYPOGRAPHY_TOKENS,
): TypographyToken {
  return TYPOGRAPHY_TOKENS[variant];
}

/**
 * Helper function to get typography classes as string
 */
export function getTypographyClasses(
  variant: keyof typeof TYPOGRAPHY_TOKENS,
): string {
  const token = TYPOGRAPHY_TOKENS[variant];
  return `${token.fontSize.tailwind} ${token.lineHeight.tailwind} ${token.fontWeight.tailwind}`;
}

/**
 * Helper function to get only font size class
 */
export function getTypographySize(
  variant: keyof typeof TYPOGRAPHY_TOKENS,
): string {
  return TYPOGRAPHY_TOKENS[variant].fontSize.tailwind;
}

/**
 * Helper function to get font size class directly from FontSize
 * This is a convenience function for when you just need a size, not a full typography variant
 */
export function getTypographySizeFromFontSize(size: FontSize): string {
  return TypographyTokenFactory.createFontSize(size).tailwind;
}

/**
 * Helper function to get only font weight class
 */
export function getTypographyWeight(
  variant: keyof typeof TYPOGRAPHY_TOKENS,
): string {
  return TYPOGRAPHY_TOKENS[variant].fontWeight.tailwind;
}

/**
 * Helper function to get font weight class directly from FontWeight
 * This is a convenience function for when you just need a weight, not a full typography variant
 */
export function getTypographyWeightFromFontWeight(weight: FontWeight): string {
  return TypographyTokenFactory.createFontWeight(weight).tailwind;
}

/**
 * Helper function to get only line height class
 */
export function getTypographyLineHeight(
  variant: keyof typeof TYPOGRAPHY_TOKENS,
): string {
  return TYPOGRAPHY_TOKENS[variant].lineHeight.tailwind;
}
