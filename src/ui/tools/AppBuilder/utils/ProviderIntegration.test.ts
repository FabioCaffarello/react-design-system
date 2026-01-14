import { describe, it, expect } from 'vitest';
import {
  AVAILABLE_PROVIDERS,
  getProviderSchema,
  validateProviderData,
  isValidProvider,
} from './ProviderIntegration';

describe('ProviderIntegration', () => {
  describe('AVAILABLE_PROVIDERS', () => {
    it('should contain expected providers', () => {
      expect(AVAILABLE_PROVIDERS).toContain('ThemeProvider');
      expect(AVAILABLE_PROVIDERS).toContain('ConfigProvider');
      expect(AVAILABLE_PROVIDERS).toContain('ToastProvider');
      expect(AVAILABLE_PROVIDERS).toContain('DialogProvider');
    });
  });

  describe('getProviderSchema', () => {
    it('should return schema for ThemeProvider', () => {
      const schema = getProviderSchema('ThemeProvider');
      expect(schema).toBeDefined();
      expect(schema?.type).toBe('object');
      expect(schema?.properties).toBeDefined();
    });

    it('should return schema for ConfigProvider', () => {
      const schema = getProviderSchema('ConfigProvider');
      expect(schema).toBeDefined();
    });

    it('should return null for unknown provider', () => {
      const schema = getProviderSchema('UnknownProvider');
      expect(schema).toBeNull();
    });
  });

  describe('validateProviderData', () => {
    it('should validate valid ThemeProvider data', () => {
      const result = validateProviderData('ThemeProvider', {
        defaultTheme: 'light',
      });

      expect(result.valid).toBe(true);
    });

    it('should validate valid ConfigProvider data', () => {
      const result = validateProviderData('ConfigProvider', {
        config: {
          features: {
            debug: false,
          },
        },
      });

      expect(result.valid).toBe(true);
    });

    it('should return error for unknown provider', () => {
      const result = validateProviderData('UnknownProvider', {});
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Unknown provider'))).toBe(true);
    });

    it('should return error for non-object data', () => {
      const result = validateProviderData('ThemeProvider', 'invalid' as any);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Provider data must be an object');
    });
  });

  describe('isValidProvider', () => {
    it('should return true for valid provider', () => {
      expect(isValidProvider('ThemeProvider')).toBe(true);
      expect(isValidProvider('ConfigProvider')).toBe(true);
    });

    it('should return false for invalid provider', () => {
      expect(isValidProvider('InvalidProvider')).toBe(false);
    });
  });
});
