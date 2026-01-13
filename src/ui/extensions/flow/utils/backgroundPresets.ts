/**
 * Background Presets
 * 
 * Pre-configured background settings for common use cases.
 */

import type { BackgroundConfig } from '../types/playgroundTypes';

/**
 * Background Preset Definition
 */
export interface BackgroundPreset {
  id: string;
  name: string;
  description: string;
  config: BackgroundConfig;
  preview?: {
    variant: 'dots' | 'lines' | 'cross';
    size: number;
  };
}

/**
 * Minimal preset - subtle dots for clean diagrams
 */
export const minimalPreset: BackgroundPreset = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Subtle dots for clean, minimal diagrams',
  config: {
    show: true,
    variant: 'dots',
    size: 12,
    bgColor: 'transparent',
    patternColor: '#e5e7eb',
  },
  preview: {
    variant: 'dots',
    size: 12,
  },
};

/**
 * Grid preset - lines for structured layouts
 */
export const gridPreset: BackgroundPreset = {
  id: 'grid',
  name: 'Grid',
  description: 'Grid lines for structured layouts',
  config: {
    show: true,
    variant: 'lines',
    size: 20,
    bgColor: 'transparent',
    patternColor: '#d1d5db',
  },
  preview: {
    variant: 'lines',
    size: 20,
  },
};

/**
 * Technical preset - cross pattern for technical diagrams
 */
export const technicalPreset: BackgroundPreset = {
  id: 'technical',
  name: 'Technical',
  description: 'Cross pattern for technical diagrams',
  config: {
    show: true,
    variant: 'cross',
    size: 2,
    bgColor: 'transparent',
    patternColor: '#9ca3af',
  },
  preview: {
    variant: 'cross',
    size: 2,
  },
};

/**
 * Dark mode preset - optimized for dark themes
 */
export const darkModePreset: BackgroundPreset = {
  id: 'dark-mode',
  name: 'Dark Mode',
  description: 'Optimized for dark themes',
  config: {
    show: true,
    variant: 'dots',
    size: 2,
    bgColor: '#141414',
    patternColor: '#777',
  },
  preview: {
    variant: 'dots',
    size: 2,
  },
};

/**
 * Light mode preset - optimized for light themes
 */
export const lightModePreset: BackgroundPreset = {
  id: 'light-mode',
  name: 'Light Mode',
  description: 'Optimized for light themes',
  config: {
    show: true,
    variant: 'dots',
    size: 2,
    bgColor: 'transparent',
    patternColor: '#91919a',
  },
  preview: {
    variant: 'dots',
    size: 2,
  },
};

/**
 * High contrast preset - for accessibility
 */
export const highContrastPreset: BackgroundPreset = {
  id: 'high-contrast',
  name: 'High Contrast',
  description: 'High contrast for accessibility',
  config: {
    show: true,
    variant: 'dots',
    size: 20,
    bgColor: '#ffffff',
    patternColor: '#000000',
  },
  preview: {
    variant: 'dots',
    size: 20,
  },
};

/**
 * Dense preset - small dots for detailed diagrams
 */
export const densePreset: BackgroundPreset = {
  id: 'dense',
  name: 'Dense',
  description: 'Small dots for detailed diagrams',
  config: {
    show: true,
    variant: 'dots',
    size: 8,
    bgColor: 'transparent',
    patternColor: '#d1d5db',
  },
  preview: {
    variant: 'dots',
    size: 8,
  },
};

/**
 * Sparse preset - large dots for simple diagrams
 */
export const sparsePreset: BackgroundPreset = {
  id: 'sparse',
  name: 'Sparse',
  description: 'Large dots for simple diagrams',
  config: {
    show: true,
    variant: 'dots',
    size: 32,
    bgColor: 'transparent',
    patternColor: '#9ca3af',
  },
  preview: {
    variant: 'dots',
    size: 32,
  },
};

/**
 * All available presets
 */
export const backgroundPresets: BackgroundPreset[] = [
  minimalPreset,
  gridPreset,
  technicalPreset,
  darkModePreset,
  lightModePreset,
  highContrastPreset,
  densePreset,
  sparsePreset,
];

/**
 * Get preset by ID
 */
export function getBackgroundPreset(id: string): BackgroundPreset | undefined {
  return backgroundPresets.find((preset) => preset.id === id);
}

/**
 * Get preset name by ID
 */
export function getBackgroundPresetName(id: string): string {
  const preset = getBackgroundPreset(id);
  return preset?.name || id;
}
