import { describe, it, expect } from 'vitest';
import {
  validateJSON,
  validateContextData,
  parseAndValidateJSON,
} from './DataValidator';
import type { FeatureContextData } from '../types';

describe('DataValidator', () => {
  describe('validateJSON', () => {
    it('should validate valid JSON', () => {
      const result = validateJSON('{"key": "value"}');
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect invalid JSON syntax', () => {
      const result = validateJSON('{"key": "value"');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should detect empty JSON string', () => {
      const result = validateJSON('');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('JSON string is empty');
    });
  });

  describe('validateContextData', () => {
    it('should validate valid context data', () => {
      const contextData: FeatureContextData = {
        providerName: 'ThemeProvider',
        data: {
          defaultTheme: 'light',
        },
      };

      const result = validateContextData(contextData);
      expect(result.valid).toBe(true);
    });

    it('should detect missing provider name', () => {
      const contextData: FeatureContextData = {
        providerName: '',
        data: {},
      };

      const result = validateContextData(contextData);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Provider name is required');
    });

    it('should detect invalid provider name', () => {
      const contextData: FeatureContextData = {
        providerName: 'InvalidProvider',
        data: {},
      };

      const result = validateContextData(contextData);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid provider name'))).toBe(true);
    });

    it('should detect missing data', () => {
      const contextData: FeatureContextData = {
        providerName: 'ThemeProvider',
        data: undefined as any,
      };

      const result = validateContextData(contextData);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Provider data is required');
    });
  });

  describe('parseAndValidateJSON', () => {
    it('should parse valid JSON', () => {
      const result = parseAndValidateJSON('{"key": "value"}');
      expect(result.valid).toBe(true);
      expect(result.data).toEqual({ key: 'value' });
      expect(result.errors).toEqual([]);
    });

    it('should return errors for invalid JSON', () => {
      const result = parseAndValidateJSON('{"key": "value"');
      expect(result.valid).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
