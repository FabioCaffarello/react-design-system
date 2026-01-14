/**
 * Global Config Defaults
 * 
 * Default values for all design system tokens.
 * Used when creating new apps or when optional tokens are not configured.
 */

import type { GlobalTokensConfig } from '../types';

/**
 * Default Typography Configuration
 */
const DEFAULT_TYPOGRAPHY = {
  fontSizes: {
    xs: { px: '12px', rem: '0.75rem' },
    sm: { px: '14px', rem: '0.875rem' },
    base: { px: '16px', rem: '1rem' },
    lg: { px: '18px', rem: '1.125rem' },
    xl: { px: '20px', rem: '1.25rem' },
    '2xl': { px: '24px', rem: '1.5rem' },
    '3xl': { px: '30px', rem: '1.875rem' },
    '4xl': { px: '36px', rem: '2.25rem' },
    '5xl': { px: '48px', rem: '3rem' },
    '6xl': { px: '60px', rem: '3.75rem' },
  },
  fontWeights: {
    light: { value: 300 },
    normal: { value: 400 },
    medium: { value: 500 },
    semibold: { value: 600 },
    bold: { value: 700 },
  },
  lineHeights: {
    none: { value: 1 },
    tight: { value: 1.25 },
    snug: { value: 1.375 },
    normal: { value: 1.5 },
    relaxed: { value: 1.625 },
    loose: { value: 2 },
  },
  fontFamilies: {
    sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
};

/**
 * Default Color Configuration
 */
const DEFAULT_COLORS = {
  palette: {
    primary: '#6366f1',
    secondary: '#ec4899',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#3b82f6',
    neutral: '#6b7280',
  },
  semantic: {
    background: '#ffffff',
    foreground: '#171717',
    muted: '#f3f4f6',
    'muted-foreground': '#6b7280',
    border: '#e5e7eb',
    input: '#e5e7eb',
    ring: '#6366f1',
  },
};

/**
 * Default Spacing Configuration
 */
const DEFAULT_SPACING: Record<string, string> = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '80px',
  '6xl': '96px',
};

/**
 * Default Shadows Configuration
 */
const DEFAULT_SHADOWS: Record<string, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  lg: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  xl: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  '2xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

/**
 * Default Radius Configuration
 */
const DEFAULT_RADIUS: Record<string, string> = {
  none: '0px',
  sm: '2px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
};

/**
 * Default SideNavbar Configuration
 */
const DEFAULT_SIDENAVBAR = {
  width: '320px',
  navigationWidth: '56px',
  variant: 'default' as const,
};

/**
 * Get default global tokens configuration
 */
export function getDefaultGlobalTokensConfig(): GlobalTokensConfig {
  return {
    typography: DEFAULT_TYPOGRAPHY,
    colors: DEFAULT_COLORS,
    spacing: DEFAULT_SPACING,
    shadows: DEFAULT_SHADOWS,
    radius: DEFAULT_RADIUS,
    sideNavbar: DEFAULT_SIDENAVBAR,
  };
}

/**
 * Get default configuration for required tokens only
 */
export function getRequiredTokensConfig(): Partial<GlobalTokensConfig> {
  return {
    typography: DEFAULT_TYPOGRAPHY,
    colors: DEFAULT_COLORS,
    spacing: DEFAULT_SPACING,
  };
}

/**
 * Merge configuration with defaults
 * Optional tokens are merged if not provided
 */
export function mergeWithDefaults(
  config: Partial<GlobalTokensConfig>
): GlobalTokensConfig {
  const defaults = getDefaultGlobalTokensConfig();
  
  return {
    typography: config.typography || defaults.typography,
    colors: config.colors || defaults.colors,
    spacing: config.spacing || defaults.spacing,
    shadows: config.shadows || defaults.shadows,
    radius: config.radius || defaults.radius,
    sideNavbar: config.sideNavbar || defaults.sideNavbar,
  };
}

/**
 * Required token categories
 */
export const REQUIRED_TOKENS = ['typography', 'colors', 'spacing'] as const;

/**
 * Optional token categories
 */
export const OPTIONAL_TOKENS = ['shadows', 'radius', 'sideNavbar'] as const;
