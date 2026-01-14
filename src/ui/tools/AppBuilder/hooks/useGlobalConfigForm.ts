'use client';

import { useEffect, useCallback } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import type { GlobalTokensConfig } from '../types';
import { getDefaultGlobalTokensConfig, mergeWithDefaults } from '../utils/GlobalConfigDefaults';
import { validateGlobalTokensConfig } from '../utils/GlobalConfigValidation';
import { GlobalConfigCache } from '../utils/GlobalConfigCache';

export interface UseGlobalConfigFormOptions {
  initialConfig?: Partial<GlobalTokensConfig>;
  mode?: 'setup' | 'edit';
  requiredTokens?: string[];
  onConfigChange?: (config: GlobalTokensConfig) => void;
}

export interface UseGlobalConfigFormReturn {
  form: UseFormReturn<GlobalTokensConfig>;
  watchedValues: GlobalTokensConfig;
  isValid: boolean;
  validationErrors: string[];
  reset: () => void;
  handleSubmit: (onSubmit: (config: GlobalTokensConfig) => void) => (e?: React.BaseSyntheticEvent) => Promise<void>;
}

/**
 * Hook for managing global config form state
 * 
 * Features:
 * - Integrates with react-hook-form
 * - Loads from cache in setup mode
 * - Auto-saves to cache with debounce in setup mode
 * - Validates required tokens
 * - Provides watched values for real-time preview
 */
export function useGlobalConfigForm(
  options: UseGlobalConfigFormOptions = {}
): UseGlobalConfigFormReturn {
  const {
    initialConfig,
    mode = 'edit',
    requiredTokens = ['typography', 'colors', 'spacing'],
    onConfigChange,
  } = options;

  // Load from cache if in setup mode
  const cachedConfig = mode === 'setup' ? GlobalConfigCache.load() : null;
  const configToUse = cachedConfig || initialConfig || getDefaultGlobalTokensConfig();
  const mergedConfig = mergeWithDefaults(configToUse);

  const form = useForm<GlobalTokensConfig>({
    defaultValues: mergedConfig,
    mode: 'onChange',
  });

  const watchedValues = form.watch();

  // Auto-save to cache in setup mode (with debounce)
  useEffect(() => {
    if (mode === 'setup') {
      const timeoutId = setTimeout(() => {
        const currentValues = form.getValues();
        GlobalConfigCache.save(currentValues);
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [watchedValues, mode, form]);

  // Notify parent of changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(watchedValues);
    }
  }, [watchedValues, onConfigChange]);

  // Validate configuration
  const validation = validateGlobalTokensConfig(watchedValues, requiredTokens);
  const isValid = validation.valid;
  const validationErrors = validation.errors.map((e) => `${e.field}: ${e.message}`);

  const reset = useCallback(() => {
    const defaults = getDefaultGlobalTokensConfig();
    form.reset(defaults);
    if (mode === 'setup') {
      GlobalConfigCache.clear();
    }
  }, [form, mode]);

  const handleSubmit = useCallback(
    (onSubmit: (config: GlobalTokensConfig) => void) => {
      return form.handleSubmit((data) => {
        const validation = validateGlobalTokensConfig(data, requiredTokens);
        if (!validation.valid) {
          // Set form errors
          validation.errors.forEach((error) => {
            const fieldPath = error.field.split('.');
            form.setError(fieldPath as any, { message: error.message });
          });
          return;
        }

        // Clear cache when app is created (in setup mode)
        if (mode === 'setup') {
          GlobalConfigCache.clear();
        }

        onSubmit(data);
      });
    },
    [form, requiredTokens, mode]
  );

  return {
    form,
    watchedValues,
    isValid,
    validationErrors,
    reset,
    handleSubmit,
  };
}
