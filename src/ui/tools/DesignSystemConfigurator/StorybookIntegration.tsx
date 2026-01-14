/**
 * Storybook Integration for Design System Configurator
 * 
 * Utilities for integrating the configurator with Storybook stories.
 */

import type { ConfiguratorState } from './types';

/**
 * Apply configuration to Storybook globals
 */
export function applyConfigToStorybook(state: ConfiguratorState): void {
  if (typeof window !== 'undefined' && (window as any).__STORYBOOK_STORY_STORE__) {
    // Apply theme configuration
    if (state.currentTheme) {
      const themeConfig = state.themes.find((t) => t.name === state.currentTheme);
      if (themeConfig) {
        // Apply CSS variables
        applyCSSVariables(themeConfig.tokens);
      }
    }
  }
}

/**
 * Apply CSS variables from tokens
 */
function applyCSSVariables(tokens: ConfiguratorState['tokens']): void {
  const root = document.documentElement;

  if (tokens.colors) {
    Object.entries(tokens.colors).forEach(([role, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        root.style.setProperty(`--color-${role}-${shade}`, value.hex);
      });
    });
  }

  if (tokens.spacing) {
    Object.entries(tokens.spacing).forEach(([scale, value]) => {
      root.style.setProperty(`--spacing-${scale}`, value.px);
    });
  }

  if (tokens.typography) {
    Object.entries(tokens.typography.fontSizes).forEach(([size, value]) => {
      root.style.setProperty(`--font-size-${size}`, value.px);
    });
  }
}

/**
 * Get configuration from Storybook parameters
 */
export function getConfigFromStorybookParameters(parameters: any): Partial<ConfiguratorState> | undefined {
  return parameters?.designSystemConfig;
}

/**
 * Create Storybook parameter for design system configuration
 */
export function createDesignSystemParameter(state: Partial<ConfiguratorState>) {
  return {
    designSystemConfig: state,
  };
}
