/**
 * Global Config Validation
 * 
 * Validation schemas and helpers for global tokens configuration.
 */

import type { GlobalTokensConfig } from '../types';
import { REQUIRED_TOKENS } from './GlobalConfigDefaults';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: string[];
}

/**
 * Validate font size value
 */
function isValidFontSize(value: { px: string; rem: string }): boolean {
  if (!value.px || !value.rem) return false;
  const pxMatch = value.px.match(/^(\d+(?:\.\d+)?)px$/);
  const remMatch = value.rem.match(/^(\d+(?:\.\d+)?)rem$/);
  return !!(pxMatch && remMatch);
}

/**
 * Validate font weight value
 */
function isValidFontWeight(value: { value: number }): boolean {
  return typeof value.value === 'number' && value.value >= 100 && value.value <= 900;
}

/**
 * Validate line height value
 */
function isValidLineHeight(value: { value: number }): boolean {
  return typeof value.value === 'number' && value.value > 0 && value.value <= 3;
}

/**
 * Validate color value (hex, rgb, or named)
 */
function isValidColor(value: string): boolean {
  if (!value) return false;
  // Hex color
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) return true;
  // RGB/RGBA
  if (/^rgba?\(/.test(value)) return true;
  // Named color (basic check)
  if (/^[a-zA-Z]+$/.test(value)) return true;
  return false;
}

/**
 * Validate spacing value
 */
function isValidSpacing(value: string): boolean {
  if (!value) return false;
  // px, rem, em, or number
  return /^(\d+(?:\.\d+)?)(px|rem|em|%)?$/.test(value.trim());
}

/**
 * Validate shadow value
 */
function isValidShadow(value: string): boolean {
  if (!value) return false;
  if (value === 'none') return true;
  // CSS shadow syntax
  return /^(inset\s+)?[\d\s\.]+(px|rem|em)\s+[\d\s\.]+(px|rem|em)\s+[\d\s\.]+(px|rem|em)\s*(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8})?$/i.test(value);
}

/**
 * Validate radius value
 */
function isValidRadius(value: string): boolean {
  if (!value) return false;
  return /^(\d+(?:\.\d+)?)(px|rem|em|%)$/.test(value.trim()) || value === '9999px';
}

/**
 * Validate typography configuration
 */
function validateTypography(typography: GlobalTokensConfig['typography']): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate font sizes
  if (!typography.fontSizes || Object.keys(typography.fontSizes).length === 0) {
    errors.push({ field: 'typography.fontSizes', message: 'Font sizes are required' });
  } else {
    Object.entries(typography.fontSizes).forEach(([key, value]) => {
      if (!isValidFontSize(value)) {
        errors.push({ field: `typography.fontSizes.${key}`, message: 'Invalid font size format' });
      }
    });
  }

  // Validate font weights
  if (!typography.fontWeights || Object.keys(typography.fontWeights).length === 0) {
    errors.push({ field: 'typography.fontWeights', message: 'Font weights are required' });
  } else {
    Object.entries(typography.fontWeights).forEach(([key, value]) => {
      if (!isValidFontWeight(value)) {
        errors.push({ field: `typography.fontWeights.${key}`, message: 'Font weight must be between 100 and 900' });
      }
    });
  }

  // Validate line heights
  if (!typography.lineHeights || Object.keys(typography.lineHeights).length === 0) {
    errors.push({ field: 'typography.lineHeights', message: 'Line heights are required' });
  } else {
    Object.entries(typography.lineHeights).forEach(([key, value]) => {
      if (!isValidLineHeight(value)) {
        errors.push({ field: `typography.lineHeights.${key}`, message: 'Line height must be between 0 and 3' });
      }
    });
  }

  // Font families are optional, but validate if provided
  if (typography.fontFamilies) {
    Object.entries(typography.fontFamilies).forEach(([key, value]) => {
      if (!value || typeof value !== 'string') {
        errors.push({ field: `typography.fontFamilies.${key}`, message: 'Font family must be a string' });
      }
    });
  }

  return errors;
}

/**
 * Validate colors configuration
 */
function validateColors(colors: GlobalTokensConfig['colors']): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate palette
  if (!colors.palette || Object.keys(colors.palette).length === 0) {
    errors.push({ field: 'colors.palette', message: 'Color palette is required' });
  } else {
    Object.entries(colors.palette).forEach(([key, value]) => {
      if (!isValidColor(value)) {
        errors.push({ field: `colors.palette.${key}`, message: 'Invalid color format' });
      }
    });
  }

  // Semantic colors are optional, but validate if provided
  if (colors.semantic) {
    Object.entries(colors.semantic).forEach(([key, value]) => {
      if (!isValidColor(value)) {
        errors.push({ field: `colors.semantic.${key}`, message: 'Invalid color format' });
      }
    });
  }

  return errors;
}

/**
 * Validate spacing configuration
 */
function validateSpacing(spacing: GlobalTokensConfig['spacing']): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!spacing || Object.keys(spacing).length === 0) {
    errors.push({ field: 'spacing', message: 'Spacing tokens are required' });
  } else {
    Object.entries(spacing).forEach(([key, value]) => {
      if (!isValidSpacing(value)) {
        errors.push({ field: `spacing.${key}`, message: 'Invalid spacing format' });
      }
    });
  }

  return errors;
}

/**
 * Validate shadows configuration (optional)
 */
function validateShadows(shadows?: GlobalTokensConfig['shadows']): ValidationError[] {
  const errors: ValidationError[] = [];

  if (shadows) {
    Object.entries(shadows).forEach(([key, value]) => {
      if (!isValidShadow(value)) {
        errors.push({ field: `shadows.${key}`, message: 'Invalid shadow format' });
      }
    });
  }

  return errors;
}

/**
 * Validate radius configuration (optional)
 */
function validateRadius(radius?: GlobalTokensConfig['radius']): ValidationError[] {
  const errors: ValidationError[] = [];

  if (radius) {
    Object.entries(radius).forEach(([key, value]) => {
      if (!isValidRadius(value)) {
        errors.push({ field: `radius.${key}`, message: 'Invalid radius format' });
      }
    });
  }

  return errors;
}

/**
 * Validate sideNavbar configuration (optional)
 */
function validateSideNavbar(sideNavbar?: GlobalTokensConfig['sideNavbar']): ValidationError[] {
  const errors: ValidationError[] = [];

  if (sideNavbar) {
    if (sideNavbar.width && !isValidSpacing(sideNavbar.width)) {
      errors.push({ field: 'sideNavbar.width', message: 'Invalid width format' });
    }
    if (sideNavbar.navigationWidth && !isValidSpacing(sideNavbar.navigationWidth)) {
      errors.push({ field: 'sideNavbar.navigationWidth', message: 'Invalid navigation width format' });
    }
    if (sideNavbar.variant && !['default', 'elevated', 'compact'].includes(sideNavbar.variant)) {
      errors.push({ field: 'sideNavbar.variant', message: 'Invalid variant. Must be default, elevated, or compact' });
    }
  }

  return errors;
}

/**
 * Validate complete global tokens configuration
 */
export function validateGlobalTokensConfig(
  config: Partial<GlobalTokensConfig>,
  requiredTokens: string[] = REQUIRED_TOKENS as unknown as string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  // Check required tokens
  for (const token of requiredTokens) {
    if (!config[token as keyof GlobalTokensConfig]) {
      errors.push({
        field: token,
        message: `${token} is required`,
      });
    }
  }

  // Validate typography (required)
  if (config.typography) {
    errors.push(...validateTypography(config.typography));
  }

  // Validate colors (required)
  if (config.colors) {
    errors.push(...validateColors(config.colors));
  }

  // Validate spacing (required)
  if (config.spacing) {
    errors.push(...validateSpacing(config.spacing));
  }

  // Validate optional tokens
  if (config.shadows) {
    errors.push(...validateShadows(config.shadows));
  }

  if (config.radius) {
    errors.push(...validateRadius(config.radius));
  }

  if (config.sideNavbar) {
    errors.push(...validateSideNavbar(config.sideNavbar));
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
