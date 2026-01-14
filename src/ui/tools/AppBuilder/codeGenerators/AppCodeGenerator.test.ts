import { describe, it, expect } from 'vitest';
import { generateAppCode } from './AppCodeGenerator';
import type { AppConfig } from '../types';

describe('AppCodeGenerator', () => {
  describe('generateAppCode', () => {
    it('should generate complete app code', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'A test application',
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

      const generated = generateAppCode(appConfig);

      expect(generated.mainFile).toBeDefined();
      expect(generated.featureFiles).toBeDefined();
      expect(generated.indexFile).toBeDefined();
      expect(generated.packageJson).toBeDefined();
      expect(generated.readme).toBeDefined();
    });

    it('should generate feature files', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [
          {
            id: 'feature-1',
            name: 'Dashboard',
            description: '',
            category: 'page',
            components: [],
            layout: {
              type: 'container',
              config: {},
            },
          },
          {
            id: 'feature-2',
            name: 'Auth',
            description: '',
            category: 'page',
            components: [],
            layout: {
              type: 'container',
              config: {},
            },
          },
        ],
      };

      const generated = generateAppCode(appConfig);

      expect(generated.featureFiles).toHaveProperty('Dashboard');
      expect(generated.featureFiles).toHaveProperty('Auth');
    });

    it('should generate context files when global contexts exist', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
        globalContexts: [
          {
            providerName: 'ThemeProvider',
            data: { defaultTheme: 'light' },
            config: { enabled: true },
          },
        ],
      };

      const generated = generateAppCode(appConfig);

      expect(generated.contextFiles).toHaveProperty('AppProviders');
    });

    it('should generate route file when routes exist', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [
          {
            id: 'feature-1',
            name: 'Dashboard',
            description: '',
            category: 'page',
            components: [],
            layout: {
              type: 'container',
              config: {},
            },
          },
        ],
        routes: [
          {
            path: '/dashboard',
            component: 'Dashboard',
          },
        ],
      };

      const generated = generateAppCode(appConfig);

      expect(generated.routeFile).toBeDefined();
      expect(generated.routeFile).toContain('BrowserRouter');
      expect(generated.routeFile).toContain('Routes');
    });

    it('should generate package.json', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [],
      };

      const generated = generateAppCode(appConfig);

      expect(generated.packageJson).toBeDefined();
      const packageJson = JSON.parse(generated.packageJson!);
      expect(packageJson.name).toBe('test-app');
      expect(packageJson.dependencies).toBeDefined();
    });

    it('should generate README', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'A test application',
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
      };

      const generated = generateAppCode(appConfig);

      expect(generated.readme).toBeDefined();
      expect(generated.readme).toContain('# Test App');
      expect(generated.readme).toContain('Dashboard');
    });
  });
});
