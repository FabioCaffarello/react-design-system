/**
 * Playground Validation Utilities
 * 
 * Validation functions for playground tokens and configurations.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface TokenValidationOptions {
  required?: string[];
  min?: Record<string, number>;
  max?: Record<string, number>;
  patterns?: Record<string, RegExp>;
}

/**
 * Validate playground configuration
 */
export function validatePlaygroundConfig(
  config: Record<string, unknown>,
  options: TokenValidationOptions = {}
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check required fields
  if (options.required) {
    for (const field of options.required) {
      if (!(field in config) || config[field] === undefined || config[field] === null || config[field] === '') {
        errors.push(`Required field '${field}' is missing or empty`);
      }
    }
  }

  // Check min values
  if (options.min) {
    for (const [field, minValue] of Object.entries(options.min)) {
      const value = config[field];
      if (typeof value === 'number' && value < minValue) {
        errors.push(`Field '${field}' must be at least ${minValue}, got ${value}`);
      }
    }
  }

  // Check max values
  if (options.max) {
    for (const [field, maxValue] of Object.entries(options.max)) {
      const value = config[field];
      if (typeof value === 'number' && value > maxValue) {
        errors.push(`Field '${field}' must be at most ${maxValue}, got ${value}`);
      }
    }
  }

  // Check patterns
  if (options.patterns) {
    for (const [field, pattern] of Object.entries(options.patterns)) {
      const value = config[field];
      if (typeof value === 'string' && !pattern.test(value)) {
        errors.push(`Field '${field}' does not match required pattern`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Validate color format
 */
export function validateColor(color: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Hex color validation
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    errors.push(`Invalid hex color format: ${color}`);
    suggestions.push('Use format #RRGGBB or #RGB (e.g., #6366f1 or #f00)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Validate spacing token
 */
export function validateSpacing(spacing: string | number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  if (typeof spacing === 'string') {
    // Check if it's a valid spacing token name
    const validTokens = ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
    if (!validTokens.includes(spacing)) {
      warnings.push(`Unknown spacing token: ${spacing}`);
      suggestions.push(`Use one of: ${validTokens.join(', ')}`);
    }
  } else if (typeof spacing === 'number') {
    if (spacing < 0) {
      errors.push('Spacing cannot be negative');
    }
    if (spacing > 1000) {
      warnings.push('Spacing value is very large, consider using rem units');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}
