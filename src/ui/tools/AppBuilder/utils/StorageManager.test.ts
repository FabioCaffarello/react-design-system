import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageManager } from './StorageManager';
import type { AppConfig } from '../types';

// Mock localStorage for tests
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('StorageManager', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('saveApp', () => {
    it('should save app configuration', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test description',
        features: [],
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
        },
      };

      StorageManager.saveApp(appConfig, 'test-app');

      const saved = StorageManager.loadApp('test-app');
      expect(saved).toEqual(appConfig);
    });

    it('should update apps list', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      StorageManager.saveApp(appConfig, 'test-app');
      const apps = StorageManager.listApps();
      expect(apps).toContain('test-app');
    });

    it('should handle localStorage errors', () => {
      const originalSetItem = localStorage.setItem;
      const mockSetItem = vi.fn(() => {
        throw new Error('Storage quota exceeded');
      });
      Object.defineProperty(localStorage, 'setItem', {
        value: mockSetItem,
        writable: true,
        configurable: true,
      });

      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      expect(() => {
        StorageManager.saveApp(appConfig, 'test-app');
      }).toThrow();

      Object.defineProperty(localStorage, 'setItem', {
        value: originalSetItem,
        writable: true,
        configurable: true,
      });
    });
  });

  describe('loadApp', () => {
    it('should load saved app', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      StorageManager.saveApp(appConfig, 'test-app');
      const loaded = StorageManager.loadApp('test-app');

      expect(loaded).toEqual(appConfig);
    });

    it('should return null if app not found', () => {
      const loaded = StorageManager.loadApp('non-existent');
      expect(loaded).toBeNull();
    });

    it('should handle invalid JSON', () => {
      localStorage.setItem('app-builder:test-app', 'invalid json');

      const loaded = StorageManager.loadApp('test-app');
      expect(loaded).toBeNull();
    });
  });

  describe('listApps', () => {
    it('should return empty array when no apps', () => {
      const apps = StorageManager.listApps();
      expect(apps).toEqual([]);
    });

    it('should return list of app keys', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      StorageManager.saveApp(appConfig, 'app1');
      StorageManager.saveApp(appConfig, 'app2');

      const apps = StorageManager.listApps();
      expect(apps).toContain('app1');
      expect(apps).toContain('app2');
      expect(apps.length).toBe(2);
    });
  });

  describe('deleteApp', () => {
    it('should delete app configuration', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      StorageManager.saveApp(appConfig, 'test-app');
      StorageManager.deleteApp('test-app');

      const loaded = StorageManager.loadApp('test-app');
      expect(loaded).toBeNull();
    });

    it('should update apps list after deletion', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      StorageManager.saveApp(appConfig, 'app1');
      StorageManager.saveApp(appConfig, 'app2');
      StorageManager.deleteApp('app1');

      const apps = StorageManager.listApps();
      expect(apps).not.toContain('app1');
      expect(apps).toContain('app2');
    });
  });

  describe('exportApp', () => {
    it('should export app as JSON string', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      const exported = StorageManager.exportApp(appConfig);
      const parsed = JSON.parse(exported);

      expect(parsed).toEqual(appConfig);
    });
  });

  describe('importApp', () => {
    it('should import app from JSON', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      const json = JSON.stringify(appConfig);
      const imported = StorageManager.importApp(json);

      expect(imported).toEqual(appConfig);
    });

    it('should validate app structure', () => {
      const invalidJson = JSON.stringify({ name: 'Test' }); // Missing features

      expect(() => {
        StorageManager.importApp(invalidJson);
      }).toThrow('Invalid app configuration format');
    });

    it('should throw on invalid JSON', () => {
      expect(() => {
        StorageManager.importApp('invalid json');
      }).toThrow('Failed to import app');
    });
  });

  describe('clearAll', () => {
    it('should clear all saved apps', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      StorageManager.saveApp(appConfig, 'app1');
      StorageManager.saveApp(appConfig, 'app2');
      StorageManager.clearAll();

      const apps = StorageManager.listApps();
      expect(apps).toEqual([]);
    });
  });
});
