/**
 * Contrast Calculator Utilities
 * 
 * WCAG contrast ratio calculations for accessibility.
 */

export interface ContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  passesAA: boolean;
  passesAAA: boolean;
  passesAALarge: boolean;
}

/**
 * Convert hex color to RGB
 */
/**
 * Convert hex color to RGB
 * Supports both 3-digit and 6-digit hex colors
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Handle 3-digit hex (e.g., #f00 -> #ff0000)
  if (cleanHex.length === 3) {
    const expanded = cleanHex.split('').map(char => char + char).join('');
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expanded);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }
  
  // Handle 6-digit hex
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance
 * Based on WCAG 2.1 specification
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 specification
 */
export function calculateContrast(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return 0;
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get contrast level and pass/fail status
 */
export function getContrastLevel(ratio: number, isLargeText: boolean = false): ContrastResult {
  const passesAA = ratio >= 4.5;
  const passesAALarge = ratio >= 3.0;
  const passesAAA = ratio >= 7.0;

  let level: 'AAA' | 'AA' | 'AA Large' | 'Fail';
  if (passesAAA) {
    level = 'AAA';
  } else if (passesAA) {
    level = 'AA';
  } else if (isLargeText && passesAALarge) {
    level = 'AA Large';
  } else {
    level = 'Fail';
  }

  return {
    ratio,
    level,
    passesAA,
    passesAAA,
    passesAALarge,
  };
}

/**
 * Calculate contrast between two colors and return full result
 */
export function calculateContrastResult(
  color1: string,
  color2: string,
  isLargeText: boolean = false
): ContrastResult {
  const ratio = calculateContrast(color1, color2);
  return getContrastLevel(ratio, isLargeText);
}

/**
 * Suggest a color that meets contrast requirements
 */
export function suggestContrastColor(
  backgroundColor: string,
  targetRatio: number = 4.5
): string {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';

  const lum = getLuminance(rgb.r, rgb.g, rgb.b);
  const targetLum = lum > 0.5 ? 0.05 : 0.95; // Darker or lighter based on background

  // Simple approximation - in production, use a more sophisticated algorithm
  if (targetLum < 0.5) {
    // Need darker color
    return '#000000';
  } else {
    // Need lighter color
    return '#ffffff';
  }
}
