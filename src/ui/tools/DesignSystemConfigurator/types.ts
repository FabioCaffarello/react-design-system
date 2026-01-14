/**
 * Design System Configurator Types
 * 
 * Type definitions for the Design System Configurator tool.
 */

import type { ColorRole, ColorShade } from '../../tokens/colors';
import type { SpacingScale } from '../../tokens/spacing';
import type { FontSize, FontWeight, LineHeight } from '../../tokens/typography';
import type { ThemeMode } from '../../tokens/tokens.factory';

/**
 * Token Configuration
 */
export interface TokenConfig {
  colors: ColorTokenConfig;
  spacing: SpacingTokenConfig;
  typography: TypographyTokenConfig;
  shadows: ShadowTokenConfig;
  radius: RadiusTokenConfig;
  borders: BorderTokenConfig;
  animations: AnimationTokenConfig;
}

export interface ColorTokenConfig {
  [role: string]: {
    [shade: string]: {
      hex: string;
      rgb: string;
      tailwind: string;
    };
  };
}

export interface SpacingTokenConfig {
  [scale: string]: {
    px: string;
    rem: string;
    tailwind: string;
  };
}

export interface TypographyTokenConfig {
  fontSizes: {
    [size: string]: {
      px: string;
      rem: string;
      tailwind: string;
    };
  };
  fontWeights: {
    [weight: string]: {
      value: number;
      tailwind: string;
    };
  };
  lineHeights: {
    [height: string]: {
      value: number;
      tailwind: string;
    };
  };
}

export interface ShadowTokenConfig {
  [size: string]: {
    value: string;
    tailwind: string;
  };
}

export interface RadiusTokenConfig {
  [size: string]: {
    px: string;
    rem: string;
    tailwind: string;
  };
}

export interface BorderTokenConfig {
  [width: string]: {
    px: string;
    tailwind: string;
  };
}

export interface AnimationTokenConfig {
  durations: {
    [duration: string]: {
      ms: number;
      tailwind: string;
    };
  };
  easings: {
    [easing: string]: {
      value: string;
      tailwind: string;
    };
  };
}

/**
 * Component Configuration
 */
export interface ComponentConfig {
  name: string;
  category: 'atom' | 'molecule' | 'organism' | 'template' | 'pattern' | 'layout';
  variants?: string[];
  sizes?: string[];
  states?: string[];
  tokens: {
    colors?: ColorRole[];
    spacing?: SpacingScale[];
    typography?: {
      sizes?: FontSize[];
      weights?: FontWeight[];
      lineHeights?: LineHeight[];
    };
  };
  accessibility?: {
    ariaLabel?: boolean;
    keyboardNavigation?: boolean;
    focusManagement?: boolean;
  };
}

/**
 * Theme Configuration
 */
export interface ThemeConfig {
  name: string;
  base: ThemeMode;
  tokens: TokenConfig;
  customProperties?: Record<string, string>;
}

/**
 * CSS Generation Options
 */
export interface CSSGenerationOptions {
  format: 'css' | 'tailwind' | 'scss' | 'less';
  includeVariables?: boolean;
  includeUtilities?: boolean;
  minify?: boolean;
}

/**
 * Export Format
 */
export type ExportFormat = 'json' | 'typescript' | 'css' | 'tailwind' | 'scss';

/**
 * Configurator State
 */
export interface ConfiguratorState {
  tokens: TokenConfig;
  components: ComponentConfig[];
  themes: ThemeConfig[];
  currentTheme?: string;
  selectedComponent?: string;
}
