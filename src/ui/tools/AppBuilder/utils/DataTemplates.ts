/**
 * Data Templates
 * 
 * Pre-configured data templates for context providers
 */

import type { FeatureContextData } from '../types';

/**
 * Data templates for each provider type
 */
export const DATA_TEMPLATES: Record<string, unknown> = {
  ThemeProvider: {
    defaultTheme: 'light',
  },
  ConfigProvider: {
    config: {
      features: {
        debug: false,
        reducedMotion: false,
        highContrast: false,
      },
      behavior: {
        animations: true,
        transitions: true,
      },
    },
    strategy: 'default',
  },
  ToastProvider: {
    maxToasts: 5,
    position: 'top-right',
  },
  DialogProvider: {
    defaultOpen: false,
  },
};

/**
 * Get template for a provider
 */
export function getProviderTemplate(providerName: string): unknown {
  return DATA_TEMPLATES[providerName] || {};
}

/**
 * Create context data from template
 */
export function createContextDataFromTemplate(
  providerName: string
): FeatureContextData {
  return {
    providerName,
    data: getProviderTemplate(providerName),
    config: {
      enabled: true,
      mergeWithDefault: true,
    },
  };
}

/**
 * Check if template exists for provider
 */
export function hasTemplate(providerName: string): boolean {
  return providerName in DATA_TEMPLATES;
}
