/**
 * Theme Types
 * 
 * Type definitions for the advanced theme system.
 */

import type { TokenSet, ThemeMode } from '../tokens';
import type { ColorRole, SemanticColor } from '../tokens/colors';

/**
 * Custom theme configuration
 * Allows partial overrides of the default token set
 */
export interface CustomThemeConfig {
  name: string;
  base?: ThemeMode; // Base theme to inherit from
  colors?: Partial<Record<ColorRole, Partial<SemanticColor>>>;
  spacing?: Partial<TokenSet['spacing']>;
  typography?: Partial<TokenSet['typography']>;
  shadows?: Partial<TokenSet['shadows']>;
  radius?: Partial<TokenSet['radius']>;
  borders?: Partial<TokenSet['borders']>;
  animations?: Partial<TokenSet['animations']>;
  zIndex?: Partial<TokenSet['zIndex']>;
  opacity?: Partial<TokenSet['opacity']>;
  gradients?: Partial<TokenSet['gradients']>;
}

/**
 * Complete theme definition
 */
export interface Theme extends TokenSet {
  name: string;
  mode: ThemeMode;
  cssVariables: Record<string, string>;
}

/**
 * Theme registry
 */
export interface ThemeRegistry {
  [themeName: string]: Theme;
}

/**
 * Theme builder options
 */
export interface ThemeBuilderOptions {
  enableCSSVariables?: boolean;
  enableTransitions?: boolean;
  transitionDuration?: string;
  storageKey?: string;
}
