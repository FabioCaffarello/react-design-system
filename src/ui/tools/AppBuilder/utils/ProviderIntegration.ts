/**
 * Provider Integration
 * 
 * Utilities for integrating with AppProvider and context providers
 */

import type { ValidationResult } from '../types';

/**
 * Available providers in the design system
 */
export const AVAILABLE_PROVIDERS = [
  'ThemeProvider',
  'ConfigProvider',
  'ToastProvider',
  'DialogProvider',
] as const;

export type ProviderType = typeof AVAILABLE_PROVIDERS[number];

/**
 * Provider Schema (simplified JSON Schema structure)
 */
export interface ProviderSchema {
  type: 'object';
  properties: Record<string, {
    type: string;
    description?: string;
    default?: unknown;
    required?: boolean;
  }>;
  required?: string[];
}

/**
 * Get provider schema
 * 
 * Returns the expected schema for a provider's data
 */
export function getProviderSchema(providerName: string): ProviderSchema | null {
  const schemas: Record<string, ProviderSchema> = {
    ThemeProvider: {
      type: 'object',
      properties: {
        defaultTheme: {
          type: 'string',
          description: 'Default theme mode',
          default: 'light',
        },
      },
    },
    ConfigProvider: {
      type: 'object',
      properties: {
        config: {
          type: 'object',
          description: 'Design system configuration',
        },
        strategy: {
          type: 'string',
          description: 'Configuration strategy',
          default: 'default',
        },
      },
    },
    ToastProvider: {
      type: 'object',
      properties: {
        maxToasts: {
          type: 'number',
          description: 'Maximum number of toasts',
          default: 5,
        },
        position: {
          type: 'string',
          description: 'Toast position',
          default: 'top-right',
        },
      },
    },
    DialogProvider: {
      type: 'object',
      properties: {
        defaultOpen: {
          type: 'boolean',
          description: 'Default open state',
          default: false,
        },
      },
    },
  };

  return schemas[providerName] || null;
}

/**
 * Validate provider data against schema
 */
export function validateProviderData(
  providerName: string,
  data: unknown
): ValidationResult {
  const schema = getProviderSchema(providerName);
  const errors: string[] = [];

  if (!schema) {
    return {
      valid: false,
      errors: [`Unknown provider: ${providerName}`],
    };
  }

  if (typeof data !== 'object' || data === null) {
    return {
      valid: false,
      errors: ['Provider data must be an object'],
    };
  }

  const dataObj = data as Record<string, unknown>;

  // Validate required fields
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in dataObj)) {
        errors.push(`Required field missing: ${field}`);
      }
    }
  }

  // Validate field types
  for (const [field, fieldSchema] of Object.entries(schema.properties)) {
    if (field in dataObj) {
      const value = dataObj[field];
      const expectedType = fieldSchema.type;

      if (expectedType === 'object' && (typeof value !== 'object' || value === null)) {
        errors.push(`Field ${field} must be an object`);
      } else if (expectedType === 'string' && typeof value !== 'string') {
        errors.push(`Field ${field} must be a string`);
      } else if (expectedType === 'number' && typeof value !== 'number') {
        errors.push(`Field ${field} must be a number`);
      } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
        errors.push(`Field ${field} must be a boolean`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if provider name is valid
 */
export function isValidProvider(providerName: string): boolean {
  return AVAILABLE_PROVIDERS.includes(providerName as ProviderType);
}
