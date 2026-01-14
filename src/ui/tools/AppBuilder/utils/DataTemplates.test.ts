import { describe, it, expect } from 'vitest';
import {
  getProviderTemplate,
  createContextDataFromTemplate,
  hasTemplate,
  DATA_TEMPLATES,
} from './DataTemplates';

describe('DataTemplates', () => {
  describe('getProviderTemplate', () => {
    it('should return template for ThemeProvider', () => {
      const template = getProviderTemplate('ThemeProvider');
      expect(template).toBeDefined();
      expect(template).toHaveProperty('defaultTheme');
    });

    it('should return template for ConfigProvider', () => {
      const template = getProviderTemplate('ConfigProvider');
      expect(template).toBeDefined();
      expect(template).toHaveProperty('config');
    });

    it('should return empty object for unknown provider', () => {
      const template = getProviderTemplate('UnknownProvider');
      expect(template).toEqual({});
    });
  });

  describe('createContextDataFromTemplate', () => {
    it('should create context data from template', () => {
      const contextData = createContextDataFromTemplate('ThemeProvider');

      expect(contextData.providerName).toBe('ThemeProvider');
      expect(contextData.data).toBeDefined();
      expect(contextData.config?.enabled).toBe(true);
      expect(contextData.config?.mergeWithDefault).toBe(true);
    });
  });

  describe('hasTemplate', () => {
    it('should return true for providers with templates', () => {
      expect(hasTemplate('ThemeProvider')).toBe(true);
      expect(hasTemplate('ConfigProvider')).toBe(true);
      expect(hasTemplate('ToastProvider')).toBe(true);
      expect(hasTemplate('DialogProvider')).toBe(true);
    });

    it('should return false for providers without templates', () => {
      expect(hasTemplate('UnknownProvider')).toBe(false);
    });
  });

  describe('DATA_TEMPLATES', () => {
    it('should contain templates for all available providers', () => {
      expect(DATA_TEMPLATES).toHaveProperty('ThemeProvider');
      expect(DATA_TEMPLATES).toHaveProperty('ConfigProvider');
      expect(DATA_TEMPLATES).toHaveProperty('ToastProvider');
      expect(DATA_TEMPLATES).toHaveProperty('DialogProvider');
    });
  });
});
