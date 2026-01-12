/**
 * Theme Utilities
 * 
 * Helper functions for theme operations.
 */

/**
 * Deep merge utility
 */
export function mergeDeep<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

/**
 * Check if value is an object
 */
function isObject(item: unknown): item is Record<string, unknown> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Convert CSS variable name to kebab-case
 */
export function toCSSVariableName(name: string): string {
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Apply CSS variables to element
 */
export function applyCSSVariables(
  element: HTMLElement,
  variables: Record<string, string>
): void {
  for (const [key, value] of Object.entries(variables)) {
    element.style.setProperty(key, value);
  }
}

/**
 * Remove CSS variables from element
 */
export function removeCSSVariables(
  element: HTMLElement,
  variableNames: string[]
): void {
  for (const name of variableNames) {
    element.style.removeProperty(name);
  }
}
