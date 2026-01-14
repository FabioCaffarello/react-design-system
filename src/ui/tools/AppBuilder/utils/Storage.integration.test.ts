import { describe, it, expect, beforeEach } from 'vitest';
import { StorageManager } from './StorageManager';
import type { AppConfig } from '../types';

describe('Storage Integration', () => {
  beforeEach(() => {
    StorageManager.clearAll();
  });

  describe('Save and Load Flow', () => {
    it('should save and load app configuration', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test application',
        features: [
          {
            id: 'feature-1',
            name: 'Dashboard',
            description: 'Dashboard feature',
            category: 'page',
            components: [],
            layout: {
              type: 'container',
              config: {},
            },
          },
        ],
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
        },
      };

      // Save
      StorageManager.saveApp(appConfig, 'test-app');

      // Load
      const loaded = StorageManager.loadApp('test-app');

      expect(loaded).toEqual(appConfig);
      expect(loaded?.features.length).toBe(1);
      expect(loaded?.features[0].name).toBe('Dashboard');
    });

    it('should list all saved apps', () => {
      const appConfig1: AppConfig = {
        name: 'App 1',
        description: '',
        features: [],
      };

      const appConfig2: AppConfig = {
        name: 'App 2',
        description: '',
        features: [],
      };

      StorageManager.saveApp(appConfig1, 'app-1');
      StorageManager.saveApp(appConfig2, 'app-2');

      const apps = StorageManager.listApps();
      expect(apps).toContain('app-1');
      expect(apps).toContain('app-2');
      expect(apps.length).toBe(2);
    });

    it('should export and import app', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      // Export
      const exported = StorageManager.exportApp(appConfig);

      // Import
      const imported = StorageManager.importApp(exported);

      expect(imported).toEqual(appConfig);
    });

    it('should delete app and update list', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      StorageManager.saveApp(appConfig, 'app-1');
      StorageManager.saveApp(appConfig, 'app-2');

      expect(StorageManager.listApps().length).toBe(2);

      StorageManager.deleteApp('app-1');

      const apps = StorageManager.listApps();
      expect(apps).not.toContain('app-1');
      expect(apps).toContain('app-2');
      expect(apps.length).toBe(1);
    });
  });
});
