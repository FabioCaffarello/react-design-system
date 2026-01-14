/**
 * Data Validator
 * 
 * Utilities for validating JSON data and context provider data
 */

import type { ValidationResult } from '../types';
import type { FeatureContextData } from '../types';
import { validateProviderData, isValidProvider } from './ProviderIntegration';

/**
 * Validate JSON string
 */
export function validateJSON(json: string): ValidationResult {
  const errors: string[] = [];

  if (!json || json.trim().length === 0) {
    return {
      valid: false,
      errors: ['JSON string is empty'],
    };
  }

  try {
    JSON.parse(json);
  } catch (error) {
    if (error instanceof SyntaxError) {
      errors.push(`Invalid JSON syntax: ${error.message}`);
    } else {
      errors.push(`JSON parsing error: ${String(error)}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate context data
 */
export function validateContextData(
  contextData: FeatureContextData
): ValidationResult {
  const errors: string[] = [];

  // Validate provider name
  if (!contextData.providerName || contextData.providerName.trim().length === 0) {
    errors.push('Provider name is required');
  } else if (!isValidProvider(contextData.providerName)) {
    errors.push(`Invalid provider name: ${contextData.providerName}`);
  }

  // Validate data exists
  if (contextData.data === undefined || contextData.data === null) {
    errors.push('Provider data is required');
  }

  // If provider is valid, validate data against schema
  if (errors.length === 0 && contextData.providerName) {
    const providerValidation = validateProviderData(
      contextData.providerName,
      contextData.data
    );
    errors.push(...providerValidation.errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Parse and validate JSON string
 */
export function parseAndValidateJSON(json: string): {
  valid: boolean;
  data: unknown;
  errors: string[];
} {
  const validation = validateJSON(json);

  if (!validation.valid) {
    return {
      valid: false,
      data: null,
      errors: validation.errors,
    };
  }

  try {
    const data = JSON.parse(json);
    return {
      valid: true,
      data,
      errors: [],
    };
  } catch (error) {
    return {
      valid: false,
      data: null,
      errors: [`Failed to parse JSON: ${String(error)}`],
    };
  }
}
