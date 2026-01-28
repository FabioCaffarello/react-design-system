/**
 * Color Tokens
 *
 * Semantic color system for consistent theming.
 * Uses Strategy Pattern for different color strategies (light, dark, custom).
 *
 * NOTE: This file maintains backward compatibility with the old API.
 * For the new color system, use imports from './colors/index.ts'
 *
 * @brand AIppin
 * @version 2.0.0
 */

// Re-export everything from the new color system
export * from './colors/index';

// Legacy type aliases for backward compatibility
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
      light: { hex: '#f9a8d4', rgb: '249, 168, 212', tailwind: 'pink-300' },
      DEFAULT: { hex: '#ec4899', rgb: '236, 72, 153', tailwind: 'pink-500' },
      dark: { hex: '#db2777', rgb: '219, 39, 119', tailwind: 'pink-600' },
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
      light: { hex: '#ec4899', rgb: '236, 72, 153', tailwind: 'pink-500' },
      DEFAULT: { hex: '#f472b6', rgb: '244, 114, 182', tailwind: 'pink-400' },
      dark: { hex: '#f9a8d4', rgb: '249, 168, 212', tailwind: 'pink-300' },
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
 * Initialize color tokens with error handling
 * Using IIFE to ensure proper initialization order and avoid TDZ errors
 */
const initializeColorTokens = (() => {
  let light: Record<ColorRole, SemanticColor>;
  let dark: Record<ColorRole, SemanticColor>;

  try {
    const lightFactory = new ColorTokenFactory(new LightColorStrategy());
    light = lightFactory.generatePalette();
  } catch (error) {
    console.error('Failed to initialize COLOR_TOKENS_LIGHT:', error);
    // Fallback: create minimal palette
    const fallbackStrategy = new LightColorStrategy();
    light = {
      primary: fallbackStrategy.generatePrimary(),
      secondary: fallbackStrategy.generateSecondary(),
      success: fallbackStrategy.generateSuccess(),
      warning: fallbackStrategy.generateWarning(),
      error: fallbackStrategy.generateError(),
      info: fallbackStrategy.generateInfo(),
      neutral: fallbackStrategy.generateNeutral(),
    };
  }

  try {
    const darkFactory = new ColorTokenFactory(new DarkColorStrategy());
    dark = darkFactory.generatePalette();
  } catch (error) {
    console.error('Failed to initialize COLOR_TOKENS_DARK:', error);
    // Fallback: use light theme as fallback
    dark = light;
  }

  return { light, dark };
})();

/**
 * Light theme colors (default)
 */
export const COLOR_TOKENS_LIGHT: Record<ColorRole, SemanticColor> = initializeColorTokens.light;

/**
 * Dark theme colors
 */
export const COLOR_TOKENS_DARK: Record<ColorRole, SemanticColor> = initializeColorTokens.dark;

/**
 * Default color tokens (light theme)
 */
export const COLOR_TOKENS: Record<ColorRole, SemanticColor> = COLOR_TOKENS_LIGHT;

/**
 * Helper function to get color token
 */
export function getColor(role: ColorRole, shade: 'light' | 'DEFAULT' | 'dark' = 'DEFAULT'): ColorToken {
  // Safety check: ensure COLOR_TOKENS is initialized
  if (!COLOR_TOKENS || typeof COLOR_TOKENS !== 'object') {
    console.warn('COLOR_TOKENS is not initialized, using fallback');
    return { hex: '#6b7280', rgb: '107, 114, 128', tailwind: 'gray-500' }; // Fallback
  }
  
  // Safety check: ensure role exists
  const roleTokens = COLOR_TOKENS[role];
  if (!roleTokens || typeof roleTokens !== 'object') {
    console.warn(`Color role "${role}" not found in COLOR_TOKENS, using fallback`);
    return { hex: '#6b7280', rgb: '107, 114, 128', tailwind: 'gray-500' }; // Fallback
  }
  
  // Safety check: ensure shade exists
  const token = roleTokens[shade];
  if (!token || typeof token !== 'object') {
    console.warn(`Color shade "${shade}" not found for role "${role}", using fallback`);
    return { hex: '#6b7280', rgb: '107, 114, 128', tailwind: 'gray-500' }; // Fallback
  }
  
  return token;
}

/**
 * Helper function to get color as Tailwind class
 */
export function getColorClass(role: ColorRole, shade: 'light' | 'DEFAULT' | 'dark' | 'contrast' = 'DEFAULT', type: 'text' | 'bg' | 'border' = 'text'): string {
  // Safety check: ensure COLOR_TOKENS is initialized
  if (!COLOR_TOKENS || typeof COLOR_TOKENS !== 'object') {
    console.warn('COLOR_TOKENS is not initialized, using fallback');
    return `${type}-gray-500`; // Fallback color
  }
  
  // Safety check: ensure role exists
  const roleTokens = COLOR_TOKENS[role];
  if (!roleTokens || typeof roleTokens !== 'object') {
    console.warn(`Color role "${role}" not found in COLOR_TOKENS, using fallback`);
    return `${type}-gray-500`; // Fallback color
  }
  
  // Safety check: ensure shade exists
  const token = roleTokens[shade];
  if (!token || typeof token !== 'object' || !token.tailwind) {
    console.warn(`Color shade "${shade}" not found for role "${role}", using fallback`);
    return `${type}-gray-500`; // Fallback color
  }
  
  return `${type}-${token.tailwind}`;
}

/**
 * Helper function to get hover color class
 * Returns the complete hover class (e.g., 'hover:bg-gray-100')
 * Note: Tailwind needs to see the full class name, so we return it as a complete string
 */
export function getHoverColorClass(role: ColorRole, shade: 'light' | 'DEFAULT' | 'dark' = 'DEFAULT', type: 'text' | 'bg' | 'border' = 'bg'): string {
  const baseClass = getColorClass(role, shade, type);
  // Extract the class name part (e.g., 'bg-gray-100' -> 'bg-gray-100')
  // and prepend 'hover:' prefix
  return `hover:${baseClass}`;
}

/**
 * Helper function to get focus color class
 * Returns the complete focus class (e.g., 'focus:bg-gray-100')
 */
export function getFocusColorClass(role: ColorRole, shade: 'light' | 'DEFAULT' | 'dark' = 'DEFAULT', type: 'text' | 'bg' | 'border' = 'border'): string {
  const baseClass = getColorClass(role, shade, type);
  return `focus:${baseClass}`;
}

/**
 * Helper function to get focus ring color class
 * Returns the complete focus ring class (e.g., 'focus:ring-indigo-500')
 * This returns complete classes that Tailwind can detect, avoiding string manipulation.
 * 
 * Note: These classes must be in the safelist or used elsewhere in the codebase
 * for Tailwind to include them in the build.
 */
export function getFocusRingClass(role: ColorRole, shade: 'light' | 'DEFAULT' | 'dark' = 'DEFAULT'): string {
  // Map color roles and shades to complete focus ring classes
  // These are complete classes that Tailwind can detect
  const ringClassMap: Record<ColorRole, Record<'light' | 'DEFAULT' | 'dark', string>> = {
    primary: {
      light: 'focus:ring-indigo-400',
      DEFAULT: 'focus:ring-indigo-500',
      dark: 'focus:ring-indigo-600',
    },
    secondary: {
      light: 'focus:ring-pink-300',
      DEFAULT: 'focus:ring-pink-500',
      dark: 'focus:ring-pink-600',
    },
    success: {
      light: 'focus:ring-green-300',
      DEFAULT: 'focus:ring-green-500',
      dark: 'focus:ring-green-600',
    },
    warning: {
      light: 'focus:ring-yellow-300',
      DEFAULT: 'focus:ring-yellow-500',
      dark: 'focus:ring-yellow-600',
    },
    error: {
      light: 'focus:ring-red-300',
      DEFAULT: 'focus:ring-red-500',
      dark: 'focus:ring-red-600',
    },
    info: {
      light: 'focus:ring-blue-300',
      DEFAULT: 'focus:ring-blue-500',
      dark: 'focus:ring-blue-600',
    },
    neutral: {
      light: 'focus:ring-gray-200',
      DEFAULT: 'focus:ring-gray-500',
      dark: 'focus:ring-gray-700',
    },
  };
  
  return ringClassMap[role]?.[shade] || 'focus:ring-indigo-500';
}
