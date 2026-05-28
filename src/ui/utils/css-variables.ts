/**
 * CSS Variables System
 *
 * Utility functions for working with CSS custom properties (variables).
 * Provides type-safe access to design tokens as CSS variables.
 */

/**
 * Get CSS variable name for a design token
 *
 * @example
 * ```tsx
 * cssVar('color', 'primary', 'DEFAULT') // '--color-primary-DEFAULT'
 * cssVar('spacing', 'md') // '--spacing-md'
 * ```
 */
export function cssVar(category: string, ...parts: string[]): string {
  return `--${category}-${parts.join("-")}`;
}

/**
 * Get CSS variable value as inline style
 *
 * @example
 * ```tsx
 * style={{ [cssVarValue('color', 'primary', 'DEFAULT')]: '#3b82f6' }}
 * ```
 */
export function cssVarValue(category: string, ...parts: string[]): string {
  return cssVar(category, ...parts);
}

/**
 * Create CSS variable object for inline styles
 *
 * @example
 * ```tsx
 * <div style={createCSSVars({
 *   color: { primary: { DEFAULT: '#3b82f6' } },
 *   spacing: { md: '12px' }
 * })} />
 * ```
 */
export function createCSSVars(
  vars: Record<string, Record<string, unknown>>,
): React.CSSProperties {
  const styles: Record<string, string> = {};

  Object.entries(vars).forEach(([category, values]) => {
    Object.entries(values).forEach(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          styles[cssVar(category, key, subKey)] = String(subValue);
        });
      } else {
        styles[cssVar(category, key)] = String(value);
      }
    });
  });

  return styles as React.CSSProperties;
}

/**
 * Common CSS variable names for design tokens
 */
export const CSS_VARS = {
  color: {
    primary: (shade: string) => cssVar("color", "primary", shade),
    secondary: (shade: string) => cssVar("color", "secondary", shade),
    success: (shade: string) => cssVar("color", "success", shade),
    warning: (shade: string) => cssVar("color", "warning", shade),
    error: (shade: string) => cssVar("color", "error", shade),
    info: (shade: string) => cssVar("color", "info", shade),
    neutral: (shade: string) => cssVar("color", "neutral", shade),
  },
  spacing: (scale: string) => cssVar("spacing", scale),
  typography: (variant: string) => cssVar("typography", variant),
  radius: (size: string) => cssVar("radius", size),
  shadow: (size: string) => cssVar("shadow", size),
} as const;
