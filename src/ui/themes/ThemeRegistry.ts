/**
 * Theme Registry
 * 
 * Central registry for managing multiple themes.
 * Supports theme registration, retrieval, and switching.
 */

import { ThemeBuilder } from './ThemeBuilder';
import { createTokenSet } from '../tokens';
import type { CustomThemeConfig, Theme, ThemeRegistry } from './types';

export class ThemeRegistryManager {
  private themes: ThemeRegistry = {};
  private defaultTheme: string = 'light';

  /**
   * Register a new theme
   */
  register(config: CustomThemeConfig): Theme {
    const builder = ThemeBuilder.create(config);
    const theme = builder.build();
    this.themes[theme.name] = theme;
    return theme;
  }

  /**
   * Register built-in themes (light and dark)
   */
  registerBuiltInThemes(): void {
    // Register light theme with CSS variables
    const lightTokenSet = createTokenSet('light');
    const lightTheme: Theme = {
      name: 'light',
      mode: 'light',
      ...lightTokenSet,
      cssVariables: this.generateCSSVariables(lightTokenSet),
    };
    this.themes['light'] = lightTheme;

    // Register dark theme with CSS variables
    const darkTokenSet = createTokenSet('dark');
    const darkTheme: Theme = {
      name: 'dark',
      mode: 'dark',
      ...darkTokenSet,
      cssVariables: this.generateCSSVariables(darkTokenSet),
    };
    this.themes['dark'] = darkTheme;

    this.defaultTheme = 'light';
  }

  /**
   * Generate CSS variables from token set
   */
  private generateCSSVariables(tokens: unknown): Record<string, string> {
    const variables: Record<string, string> = {};

    // Color variables
    for (const [role, color] of Object.entries(tokens.colors || {})) {
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
    for (const [name, token] of Object.entries(tokens.spacing || {})) {
      if (token && typeof token === 'object' && 'px' in token) {
        variables[`--spacing-${name}`] = (token as { px: string }).px;
      }
    }

    // Typography variables
    for (const [name, token] of Object.entries(tokens.typography || {})) {
      if (token && typeof token === 'object') {
        if ('fontSize' in token) {
          variables[`--font-size-${name}`] = (token as { fontSize: string }).fontSize;
        }
        if ('lineHeight' in token) {
          variables[`--line-height-${name}`] = (token as { lineHeight: string }).lineHeight;
        }
        if ('fontWeight' in token) {
          variables[`--font-weight-${name}`] = (token as { fontWeight: string }).fontWeight;
        }
      }
    }

    // Shadow variables
    for (const [name, token] of Object.entries(tokens.shadows || {})) {
      if (token && typeof token === 'object' && 'value' in token) {
        variables[`--shadow-${name}`] = (token as { value: string }).value;
      }
    }

    // Radius variables
    for (const [name, token] of Object.entries(tokens.radius || {})) {
      if (token && typeof token === 'object' && 'value' in token) {
        variables[`--radius-${name}`] = (token as { value: string }).value;
      }
    }

    // Animation variables
    for (const [name, token] of Object.entries(tokens.animations || {})) {
      if (token && typeof token === 'object') {
        if ('duration' in token) {
          variables[`--animation-duration-${name}`] = (token as { duration: string }).duration;
        }
        if ('easing' in token) {
          variables[`--animation-easing-${name}`] = (token as { easing: string }).easing;
        }
      }
    }

    return variables;
  }

  /**
   * Get a theme by name
   */
  get(name: string): Theme | undefined {
    return this.themes[name];
  }

  /**
   * Get all registered themes
   */
  getAll(): ThemeRegistry {
    return { ...this.themes };
  }

  /**
   * Check if a theme exists
   */
  has(name: string): boolean {
    return name in this.themes;
  }

  /**
   * Remove a theme
   */
  remove(name: string): boolean {
    if (name === 'light' || name === 'dark') {
      return false; // Cannot remove built-in themes
    }
    if (this.has(name)) {
      delete this.themes[name];
      return true;
    }
    return false;
  }

  /**
   * Get default theme name
   */
  getDefaultTheme(): string {
    return this.defaultTheme;
  }

  /**
   * Set default theme
   */
  setDefaultTheme(name: string): void {
    if (this.has(name)) {
      this.defaultTheme = name;
    }
  }

  /**
   * Get theme names
   */
  getThemeNames(): string[] {
    return Object.keys(this.themes);
  }
}

/**
 * Global theme registry instance
 */
export const themeRegistry = new ThemeRegistryManager();

// Initialize with built-in themes
themeRegistry.registerBuiltInThemes();
