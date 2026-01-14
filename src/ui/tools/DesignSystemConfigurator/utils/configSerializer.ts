/**
 * Config Serializer
 * 
 * Utilities for serializing and deserializing configurator state.
 */

import type { ConfiguratorState, ExportFormat } from '../types';

/**
 * Serialize state to JSON
 */
export function serializeState(state: ConfiguratorState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Deserialize state from JSON
 */
export function deserializeState(json: string): ConfiguratorState {
  try {
    return JSON.parse(json) as ConfiguratorState;
  } catch (error) {
    throw new Error(`Failed to deserialize state: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export state in specified format
 */
export function exportState(state: ConfiguratorState, format: ExportFormat): string {
  switch (format) {
    case 'json':
      return serializeState(state);
    
    case 'typescript':
      return generateTypeScript(state);
    
    case 'css':
      return generateCSS(state);
    
    case 'tailwind':
      return generateTailwindConfig(state);
    
    case 'scss':
      return generateSCSS(state);
    
    default:
      return serializeState(state);
  }
}

/**
 * Generate TypeScript code
 */
function generateTypeScript(state: ConfiguratorState): string {
  return `// Design System Configuration
// Generated from Design System Configurator

export const designSystemConfig = ${serializeState(state)} as const;

export type DesignSystemConfig = typeof designSystemConfig;
`;
}

/**
 * Generate CSS variables
 */
function generateCSS(state: ConfiguratorState): string {
  const lines: string[] = [':root {'];
  
  // Add token variables
  if (state.tokens.colors) {
    Object.entries(state.tokens.colors).forEach(([role, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        lines.push(`  --color-${role}-${shade}: ${value.hex};`);
      });
    });
  }
  
  if (state.tokens.spacing) {
    Object.entries(state.tokens.spacing).forEach(([scale, value]) => {
      lines.push(`  --spacing-${scale}: ${value.px};`);
    });
  }
  
  if (state.tokens.typography) {
    Object.entries(state.tokens.typography.fontSizes).forEach(([size, value]) => {
      lines.push(`  --font-size-${size}: ${value.px};`);
    });
  }
  
  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate Tailwind config
 */
function generateTailwindConfig(state: ConfiguratorState): string {
  const config: Record<string, unknown> = {
    theme: {
      extend: {},
    },
  };
  
  if (state.tokens.colors) {
    const colors: Record<string, Record<string, string>> = {};
    Object.entries(state.tokens.colors).forEach(([role, shades]) => {
      colors[role] = {};
      Object.entries(shades).forEach(([shade, value]) => {
        colors[role][shade] = value.hex;
      });
    });
    config.theme.extend.colors = colors;
  }
  
  if (state.tokens.spacing) {
    const spacing: Record<string, string> = {};
    Object.entries(state.tokens.spacing).forEach(([scale, value]) => {
      spacing[scale] = value.px;
    });
    config.theme.extend.spacing = spacing;
  }
  
  return `// tailwind.config.js
module.exports = ${JSON.stringify(config, null, 2)};
`;
}

/**
 * Generate SCSS variables
 */
function generateSCSS(state: ConfiguratorState): string {
  const lines: string[] = [];
  
  if (state.tokens.colors) {
    Object.entries(state.tokens.colors).forEach(([role, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        lines.push(`$color-${role}-${shade}: ${value.hex};`);
      });
    });
  }
  
  if (state.tokens.spacing) {
    Object.entries(state.tokens.spacing).forEach(([scale, value]) => {
      lines.push(`$spacing-${scale}: ${value.px};`);
    });
  }
  
  return lines.join('\n');
}
