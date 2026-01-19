/**
 * CSS Utilities
 * 
 * Utility functions for CSS variables and theming.
 */

import type { FlowThemeVariables } from '../styles/flow-theme';
import { themeToCSSVariables } from '../styles/flow-theme';

/**
 * Generate CSS variables dynamically
 */
export function generateCSSVariables(theme: FlowThemeVariables): Record<string, string> {
  return themeToCSSVariables(theme);
}

/**
 * Apply CSS variables to an element
 */
export function applyFlowCSSVariables(
  element: HTMLElement | null,
  variables: Record<string, string>
): void {
  if (!element) return;
  
  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}


/**
 * Get CSS variable value
 */
export function getCSSVariable(cssVarName: string, element?: HTMLElement): string {
  const target = element || document.documentElement;
  return getComputedStyle(target).getPropertyValue(cssVarName).trim();
}

/**
 * Set CSS variable value
 */
export function setCSSVariable(
  cssVarName: string,
  value: string,
  element?: HTMLElement
): void {
  const target = element || document.documentElement;
  target.style.setProperty(cssVarName, value);
}

/**
 * Convert design token to CSS variable
 */
export function tokenToCSSVariable(tokenPath: string): string {
  return `--${tokenPath.replace(/\./g, '-')}`;
}
