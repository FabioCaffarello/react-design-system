/**
 * Theme Builder
 * 
 * Builder Pattern for creating custom themes.
 * Supports theme inheritance and CSS variable generation.
 */

import { TokensFactory, type TokenSet, type ThemeMode } from '../tokens';
import type { CustomThemeConfig, Theme } from './types';

export class ThemeBuilder {
  private config: CustomThemeConfig;
  private baseFactory: TokensFactory;

  constructor(config: CustomThemeConfig) {
    this.config = config;
    const baseMode: ThemeMode = config.base || 'light';
    this.baseFactory = new TokensFactory(baseMode);
  }

  /**
   * Build a complete theme from configuration
   */
  build(): Theme {
    // Start with base token set
    const baseTokenSet = this.baseFactory.createTokenSet();

    // Merge custom overrides
    const mergedTokens = {
      spacing: { ...baseTokenSet.spacing, ...(this.config.spacing || {}) },
      typography: { ...baseTokenSet.typography, ...(this.config.typography || {}) },
      colors: this.mergeColors(baseTokenSet.colors, this.config.colors),
      breakpoints: baseTokenSet.breakpoints, // Breakpoints are usually not customized
      shadows: { ...baseTokenSet.shadows, ...(this.config.shadows || {}) },
      radius: { ...baseTokenSet.radius, ...(this.config.radius || {}) },
      borders: { ...baseTokenSet.borders, ...(this.config.borders || {}) },
      animations: { ...baseTokenSet.animations, ...(this.config.animations || {}) },
      zIndex: { ...baseTokenSet.zIndex, ...(this.config.zIndex || {}) },
      opacity: { ...baseTokenSet.opacity, ...(this.config.opacity || {}) },
      gradients: { ...baseTokenSet.gradients, ...(this.config.gradients || {}) },
    } as TokenSet;

    // Generate CSS variables
    const cssVariables = this.generateCSSVariables(mergedTokens);

    return {
      name: this.config.name,
      mode: this.config.base || 'light',
      ...mergedTokens,
      cssVariables,
    };
  }

  /**
   * Merge color overrides with base colors
   */
  private mergeColors(
    baseColors: Record<string, unknown>,
    colorOverrides?: Partial<Record<string, Partial<unknown>>>
  ): Record<string, unknown> {
    if (!colorOverrides) {
      return baseColors;
    }

    const merged = { ...baseColors };
    for (const [role, override] of Object.entries(colorOverrides)) {
      if (merged[role]) {
        merged[role] = { ...merged[role], ...override };
      }
    }
    return merged;
  }

  /**
   * Generate CSS variables from token set
   */
  private generateCSSVariables(tokens: TokenSet): Record<string, string> {
    const variables: Record<string, string> = {};

    // Color variables
    for (const [role, color] of Object.entries(tokens.colors)) {
      if (color && typeof color === 'object') {
        for (const [shade, value] of Object.entries(color)) {
          if (value && typeof value === 'object' && 'hex' in value) {
            const varName = `--color-${role}-${shade.toLowerCase()}`;
            variables[varName] = (value as { hex: string }).hex;
          }
        }
      }
    }

    // Spacing variables
    for (const [name, token] of Object.entries(tokens.spacing)) {
      if (token && typeof token === 'object' && 'px' in token) {
        variables[`--spacing-${name}`] = (token as { px: string }).px;
      }
    }

    // Typography variables
    for (const [name, token] of Object.entries(tokens.typography)) {
      if (token && typeof token === 'object') {
        if ('fontSize' in token) {
          const fontSize = (token as { fontSize: unknown }).fontSize;
          if (typeof fontSize === 'string') {
            variables[`--font-size-${name}`] = fontSize;
          }
        }
        if ('lineHeight' in token) {
          const lineHeight = (token as { lineHeight: unknown }).lineHeight;
          if (typeof lineHeight === 'string') {
            variables[`--line-height-${name}`] = lineHeight;
          }
        }
        if ('fontWeight' in token) {
          const fontWeight = (token as { fontWeight: unknown }).fontWeight;
          if (typeof fontWeight === 'string') {
            variables[`--font-weight-${name}`] = fontWeight;
          }
        }
      }
    }

    // Shadow variables
    for (const [name, token] of Object.entries(tokens.shadows)) {
      if (token && typeof token === 'object' && 'value' in token) {
        variables[`--shadow-${name}`] = (token as { value: string }).value;
      }
    }

    // Radius variables
    for (const [name, token] of Object.entries(tokens.radius)) {
      if (token && typeof token === 'object' && 'value' in token) {
        const value = (token as { value: unknown }).value;
        variables[`--radius-${name}`] = typeof value === 'string' ? value : String(value);
      }
    }

    // Animation variables
    for (const [name, token] of Object.entries(tokens.animations)) {
      if (token && typeof token === 'object') {
        if ('duration' in token) {
          const duration = (token as { duration: unknown }).duration;
          if (typeof duration === 'string') {
            variables[`--animation-duration-${name}`] = duration;
          } else if (duration && typeof duration === 'object' && 'value' in duration) {
            variables[`--animation-duration-${name}`] = (duration as { value: string }).value;
          }
        }
        if ('easing' in token) {
          const easing = (token as { easing: unknown }).easing;
          if (typeof easing === 'string') {
            variables[`--animation-easing-${name}`] = easing;
          } else if (easing && typeof easing === 'object' && 'value' in easing) {
            variables[`--animation-easing-${name}`] = (easing as { value: string }).value;
          }
        }
      }
    }

    return variables;
  }

  /**
   * Create a theme builder instance
   */
  static create(config: CustomThemeConfig): ThemeBuilder {
    return new ThemeBuilder(config);
  }
}
