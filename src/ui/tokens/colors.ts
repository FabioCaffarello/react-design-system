/**
 * Color Tokens
 * 
 * Semantic color system for consistent theming.
 * Uses Strategy Pattern for different color strategies (light, dark, custom).
 */

export type ColorRole = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'neutral';

export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export interface ColorToken {
  hex: string;
  rgb: string;
  tailwind: string;
}

export interface SemanticColor {
  light: ColorToken;
  DEFAULT: ColorToken;
  dark: ColorToken;
  contrast: ColorToken;
}

export interface ColorPalette {
  [key: number]: ColorToken;
}

/**
 * Color Strategy Interface
 * Strategy Pattern for different color generation strategies
 */
export interface ColorStrategy {
  generatePrimary(): SemanticColor;
  generateSecondary(): SemanticColor;
  generateSuccess(): SemanticColor;
  generateWarning(): SemanticColor;
  generateError(): SemanticColor;
  generateInfo(): SemanticColor;
  generateNeutral(): SemanticColor;
}

/**
 * Light Theme Color Strategy
 */
export class LightColorStrategy implements ColorStrategy {
  generatePrimary(): SemanticColor {
    return {
      light: { hex: '#818cf8', rgb: '129, 140, 248', tailwind: 'indigo-400' },
      DEFAULT: { hex: '#6366f1', rgb: '99, 102, 241', tailwind: 'indigo-500' },
      dark: { hex: '#4f46e5', rgb: '79, 70, 229', tailwind: 'indigo-600' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }

  generateSecondary(): SemanticColor {
    return {
      light: { hex: '#a78bfa', rgb: '167, 139, 250', tailwind: 'violet-400' },
      DEFAULT: { hex: '#8b5cf6', rgb: '139, 92, 246', tailwind: 'violet-500' },
      dark: { hex: '#7c3aed', rgb: '124, 58, 237', tailwind: 'violet-600' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }

  generateSuccess(): SemanticColor {
    return {
      light: { hex: '#86efac', rgb: '134, 239, 172', tailwind: 'green-300' },
      DEFAULT: { hex: '#22c55e', rgb: '34, 197, 94', tailwind: 'green-500' },
      dark: { hex: '#16a34a', rgb: '22, 163, 74', tailwind: 'green-600' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }

  generateWarning(): SemanticColor {
    return {
      light: { hex: '#fde047', rgb: '253, 224, 71', tailwind: 'yellow-300' },
      DEFAULT: { hex: '#eab308', rgb: '234, 179, 8', tailwind: 'yellow-500' },
      dark: { hex: '#ca8a04', rgb: '202, 138, 4', tailwind: 'yellow-600' },
      contrast: { hex: '#000000', rgb: '0, 0, 0', tailwind: 'black' },
    };
  }

  generateError(): SemanticColor {
    return {
      light: { hex: '#fca5a5', rgb: '252, 165, 165', tailwind: 'red-300' },
      DEFAULT: { hex: '#ef4444', rgb: '239, 68, 68', tailwind: 'red-500' },
      dark: { hex: '#dc2626', rgb: '220, 38, 38', tailwind: 'red-600' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }

  generateInfo(): SemanticColor {
    return {
      light: { hex: '#93c5fd', rgb: '147, 197, 253', tailwind: 'blue-300' },
      DEFAULT: { hex: '#3b82f6', rgb: '59, 130, 246', tailwind: 'blue-500' },
      dark: { hex: '#2563eb', rgb: '37, 99, 235', tailwind: 'blue-600' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }

  generateNeutral(): SemanticColor {
    return {
      light: { hex: '#f3f4f6', rgb: '243, 244, 246', tailwind: 'gray-100' },
      DEFAULT: { hex: '#6b7280', rgb: '107, 114, 128', tailwind: 'gray-500' },
      dark: { hex: '#374151', rgb: '55, 65, 81', tailwind: 'gray-700' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }
}

/**
 * Dark Theme Color Strategy
 */
export class DarkColorStrategy implements ColorStrategy {
  generatePrimary(): SemanticColor {
    return {
      light: { hex: '#6366f1', rgb: '99, 102, 241', tailwind: 'indigo-500' },
      DEFAULT: { hex: '#818cf8', rgb: '129, 140, 248', tailwind: 'indigo-400' },
      dark: { hex: '#a5b4fc', rgb: '165, 180, 252', tailwind: 'indigo-300' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }

  generateSecondary(): SemanticColor {
    return {
      light: { hex: '#8b5cf6', rgb: '139, 92, 246', tailwind: 'violet-500' },
      DEFAULT: { hex: '#a78bfa', rgb: '167, 139, 250', tailwind: 'violet-400' },
      dark: { hex: '#c4b5fd', rgb: '196, 181, 253', tailwind: 'violet-300' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }

  generateSuccess(): SemanticColor {
    return {
      light: { hex: '#22c55e', rgb: '34, 197, 94', tailwind: 'green-500' },
      DEFAULT: { hex: '#4ade80', rgb: '74, 222, 128', tailwind: 'green-400' },
      dark: { hex: '#86efac', rgb: '134, 239, 172', tailwind: 'green-300' },
      contrast: { hex: '#000000', rgb: '0, 0, 0', tailwind: 'black' },
    };
  }

  generateWarning(): SemanticColor {
    return {
      light: { hex: '#eab308', rgb: '234, 179, 8', tailwind: 'yellow-500' },
      DEFAULT: { hex: '#facc15', rgb: '250, 204, 21', tailwind: 'yellow-400' },
      dark: { hex: '#fde047', rgb: '253, 224, 71', tailwind: 'yellow-300' },
      contrast: { hex: '#000000', rgb: '0, 0, 0', tailwind: 'black' },
    };
  }

  generateError(): SemanticColor {
    return {
      light: { hex: '#ef4444', rgb: '239, 68, 68', tailwind: 'red-500' },
      DEFAULT: { hex: '#f87171', rgb: '248, 113, 113', tailwind: 'red-400' },
      dark: { hex: '#fca5a5', rgb: '252, 165, 165', tailwind: 'red-300' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }

  generateInfo(): SemanticColor {
    return {
      light: { hex: '#3b82f6', rgb: '59, 130, 246', tailwind: 'blue-500' },
      DEFAULT: { hex: '#60a5fa', rgb: '96, 165, 250', tailwind: 'blue-400' },
      dark: { hex: '#93c5fd', rgb: '147, 197, 253', tailwind: 'blue-300' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }

  generateNeutral(): SemanticColor {
    return {
      light: { hex: '#374151', rgb: '55, 65, 81', tailwind: 'gray-700' },
      DEFAULT: { hex: '#9ca3af', rgb: '156, 163, 175', tailwind: 'gray-400' },
      dark: { hex: '#d1d5db', rgb: '209, 213, 219', tailwind: 'gray-300' },
      contrast: { hex: '#ffffff', rgb: '255, 255, 255', tailwind: 'white' },
    };
  }
}

/**
 * Color Token Factory
 * Uses Strategy Pattern to generate colors based on theme
 */
export class ColorTokenFactory {
  private strategy: ColorStrategy;

  constructor(strategy: ColorStrategy) {
    this.strategy = strategy;
  }

  /**
   * Set color strategy
   */
  setStrategy(strategy: ColorStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Generate semantic color palette
   */
  generatePalette(): Record<ColorRole, SemanticColor> {
    return {
      primary: this.strategy.generatePrimary(),
      secondary: this.strategy.generateSecondary(),
      success: this.strategy.generateSuccess(),
      warning: this.strategy.generateWarning(),
      error: this.strategy.generateError(),
      info: this.strategy.generateInfo(),
      neutral: this.strategy.generateNeutral(),
    };
  }
}

/**
 * Light theme colors (default)
 */
const lightFactory = new ColorTokenFactory(new LightColorStrategy());
export const COLOR_TOKENS_LIGHT = lightFactory.generatePalette();

/**
 * Dark theme colors
 */
const darkFactory = new ColorTokenFactory(new DarkColorStrategy());
export const COLOR_TOKENS_DARK = darkFactory.generatePalette();

/**
 * Default color tokens (light theme)
 */
export const COLOR_TOKENS = COLOR_TOKENS_LIGHT;

/**
 * Helper function to get color token
 */
export function getColor(role: ColorRole, shade: 'light' | 'DEFAULT' | 'dark' = 'DEFAULT'): ColorToken {
  return COLOR_TOKENS[role][shade];
}

/**
 * Helper function to get color as Tailwind class
 */
export function getColorClass(role: ColorRole, shade: 'light' | 'DEFAULT' | 'dark' = 'DEFAULT', type: 'text' | 'bg' | 'border' = 'text'): string {
  const token = COLOR_TOKENS[role][shade];
  return `${type}-${token.tailwind}`;
}
