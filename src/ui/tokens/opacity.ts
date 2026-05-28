/**
 * Opacity Tokens
 *
 * Centralized opacity system for consistent transparency values.
 * Uses Factory Pattern for type-safe token creation.
 */

export type OpacityValue =
  | 0
  | 5
  | 10
  | 20
  | 25
  | 30
  | 40
  | 50
  | 60
  | 70
  | 75
  | 80
  | 90
  | 95
  | 100;

export interface OpacityToken {
  value: OpacityValue;
  decimal: number;
  tailwind: string;
  description: string;
}

/**
 * Opacity Token Factory
 * Creates opacity tokens with consistent values
 */
export class OpacityTokenFactory {
  /**
   * Create an opacity token
   */
  static create(value: OpacityValue): OpacityToken {
    const decimal = value / 100;

    const descriptionMap: Record<OpacityValue, string> = {
      0: "Fully transparent",
      5: "Very light overlay",
      10: "Light overlay",
      20: "Subtle overlay",
      25: "Quarter opacity",
      30: "Light background",
      40: "Semi-transparent",
      50: "Half opacity",
      60: "Semi-opaque",
      70: "Mostly opaque",
      75: "Three-quarter opacity",
      80: "High opacity",
      90: "Very high opacity",
      95: "Nearly opaque",
      100: "Fully opaque",
    };

    // Map to Tailwind classes
    const tailwindMap: Record<OpacityValue, string> = {
      0: "opacity-0",
      5: "opacity-5",
      10: "opacity-10",
      20: "opacity-20",
      25: "opacity-25",
      30: "opacity-30",
      40: "opacity-40",
      50: "opacity-50",
      60: "opacity-60",
      70: "opacity-70",
      75: "opacity-75",
      80: "opacity-80",
      90: "opacity-90",
      95: "opacity-95",
      100: "opacity-100",
    };

    return {
      value,
      decimal,
      tailwind: tailwindMap[value],
      description: descriptionMap[value],
    };
  }
}

/**
 * Pre-defined opacity tokens
 */
export const OPACITY_TOKENS = {
  transparent: OpacityTokenFactory.create(0),
  "5": OpacityTokenFactory.create(5),
  "10": OpacityTokenFactory.create(10),
  "20": OpacityTokenFactory.create(20),
  "25": OpacityTokenFactory.create(25),
  "30": OpacityTokenFactory.create(30),
  "40": OpacityTokenFactory.create(40),
  "50": OpacityTokenFactory.create(50),
  "60": OpacityTokenFactory.create(60),
  "70": OpacityTokenFactory.create(70),
  "75": OpacityTokenFactory.create(75),
  "80": OpacityTokenFactory.create(80),
  "90": OpacityTokenFactory.create(90),
  "95": OpacityTokenFactory.create(95),
  opaque: OpacityTokenFactory.create(100),
} as const;

/**
 * Helper function to get opacity token
 */
export function getOpacity(value: OpacityValue): OpacityToken {
  return OpacityTokenFactory.create(value);
}

/**
 * Helper function to get opacity as Tailwind class
 */
export function getOpacityClass(value: OpacityValue): string {
  return OpacityTokenFactory.create(value).tailwind;
}
