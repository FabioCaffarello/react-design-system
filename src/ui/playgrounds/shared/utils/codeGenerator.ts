/**
 * Code Generator Utilities
 * 
 * Generate code in different formats from playground configurations.
 */

import type { CodeFormat } from '../PlaygroundControls/CodeDisplay';

export interface CodeGeneratorOptions<T> {
  state: T;
  format: CodeFormat;
  playgroundName: string;
  indent?: number;
}

/**
 * Generate TypeScript code
 */
export function generateTypeScriptCode<T extends Record<string, unknown>>(
  state: T,
  playgroundName: string,
  indent: number = 2
): string {
  const indentStr = ' '.repeat(indent);
  const entries = Object.entries(state)
    .map(([key, value]) => {
      const formattedValue = typeof value === 'string' ? `'${value}'` : JSON.stringify(value);
      return `${indentStr}${key}: ${formattedValue},`;
    })
    .join('\n');

  return `const ${playgroundName} = {\n${entries}\n};`;
}

/**
 * Generate CSS code
 */
export function generateCSSCode<T extends Record<string, unknown>>(
  state: T,
  playgroundName: string,
  indent: number = 2
): string {
  const indentStr = ' '.repeat(indent);
  const properties = Object.entries(state)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${indentStr}--${playgroundName}-${cssKey}: ${value};`;
    })
    .join('\n');

  return `:root {\n${properties}\n}`;
}

/**
 * Generate Tailwind classes
 */
export function generateTailwindCode<T extends Record<string, unknown>>(
  state: T,
  playgroundName: string
): string {
  const classes = Object.entries(state)
    .map(([key, value]) => {
      // Convert to Tailwind class format
      if (typeof value === 'string') {
        // For colors
        if (value.startsWith('#')) {
          return `bg-${key}-500`;
        }
        // For spacing
        if (['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl'].includes(value)) {
          return `${key}-${value}`;
        }
      }
      return `${key}-${value}`;
    })
    .filter(Boolean)
    .join(' ');

  return `<div class="${classes}">\n  Content\n</div>`;
}

/**
 * Generate JSON code
 */
export function generateJSONCode<T extends Record<string, unknown>>(
  state: T,
  indent: number = 2
): string {
  return JSON.stringify(state, null, indent);
}

/**
 * Generate code in specified format
 */
export function generateCode<T extends Record<string, unknown>>({
  state,
  format,
  playgroundName,
  indent = 2,
}: CodeGeneratorOptions<T>): string {
  switch (format) {
    case 'typescript':
      return generateTypeScriptCode(state, playgroundName, indent);
    case 'css':
      return generateCSSCode(state, playgroundName, indent);
    case 'tailwind':
      return generateTailwindCode(state, playgroundName);
    case 'json':
      return generateJSONCode(state, indent);
    default:
      return generateJSONCode(state, indent);
  }
}
