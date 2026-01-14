import { describe, it, expect } from 'vitest';
import {
  generateContextProvider,
  generateContextHook,
  generateAllContextProviders,
} from './ContextCodeGenerator';
import type { FeatureContextData } from '../types';

describe('ContextCodeGenerator', () => {
  describe('generateContextProvider', () => {
    it('should generate context provider code', () => {
      const contextData: FeatureContextData = {
        providerName: 'ThemeProvider',
        data: {
          defaultTheme: 'light',
        },
        config: {
          enabled: true,
        },
      };

      const code = generateContextProvider(contextData);
      expect(code).toContain('ThemeProvider');
      expect(code).toContain('import');
      expect(code).toContain('export function');
    });

    it('should return comment for disabled provider', () => {
      const contextData: FeatureContextData = {
        providerName: 'ThemeProvider',
        data: {},
        config: {
          enabled: false,
        },
      };

      const code = generateContextProvider(contextData);
      expect(code).toContain('// ThemeProvider is disabled');
    });

    it('should include mergeWithDefault when enabled', () => {
      const contextData: FeatureContextData = {
        providerName: 'ThemeProvider',
        data: {
          defaultTheme: 'dark',
        },
        config: {
          enabled: true,
          mergeWithDefault: true,
        },
      };

      const code = generateContextProvider(contextData);
      expect(code).toContain('mergeWithDefault');
    });
  });

  describe('generateContextHook', () => {
    it('should generate hook code', () => {
      const code = generateContextHook('ThemeProvider');
      expect(code).toContain('useTheme');
      expect(code).toContain('export function');
    });
  });

  describe('generateAllContextProviders', () => {
    it('should generate providers for all contexts', () => {
      const contexts: FeatureContextData[] = [
        {
          providerName: 'ThemeProvider',
          data: { defaultTheme: 'light' },
          config: { enabled: true },
        },
        {
          providerName: 'ConfigProvider',
          data: { config: {} },
          config: { enabled: true },
        },
      ];

      const code = generateAllContextProviders(contexts);
      expect(code).toContain('ThemeProvider');
      expect(code).toContain('ConfigProvider');
      expect(code).toContain('AppProviders');
    });

    it('should skip disabled providers', () => {
      const contexts: FeatureContextData[] = [
        {
          providerName: 'ThemeProvider',
          data: {},
          config: { enabled: false },
        },
      ];

      const code = generateAllContextProviders(contexts);
      expect(code).toContain('// No context providers configured');
    });

    it('should return comment when no contexts', () => {
      const code = generateAllContextProviders([]);
      expect(code).toContain('// No context providers configured');
    });
  });
});
