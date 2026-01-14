import { describe, it, expect } from 'vitest';
import { generateAppCode } from './AppCodeGenerator';
import { generateFeatureCode } from './FeatureCodeGenerator';
import { generateAllContextProviders } from './ContextCodeGenerator';
import type { AppConfig, FeatureConfig } from '../types';

describe('Code Generation Integration', () => {
  describe('Complete Code Generation Flow', () => {
    it('should generate complete app code with features and contexts', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'A complete test application',
        features: [
          {
            id: 'feature-1',
            name: 'Dashboard',
            description: 'Dashboard feature',
            category: 'page',
            components: [],
            layout: {
              type: 'container',
              config: {
                maxWidth: 'xl',
                padding: 'base',
              },
            },
          },
        ],
        globalContexts: [
          {
            providerName: 'ThemeProvider',
            data: {
              defaultTheme: 'light',
            },
            config: {
              enabled: true,
            },
          },
        ],
      };

      const generated = generateAppCode(appConfig);

      expect(generated.mainFile).toBeDefined();
      expect(generated.featureFiles).toHaveProperty('Dashboard');
      expect(generated.contextFiles).toHaveProperty('AppProviders');
      expect(generated.indexFile).toBeDefined();
      expect(generated.packageJson).toBeDefined();
      expect(generated.readme).toBeDefined();
    });

    it('should generate valid React code for all features', () => {
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

      // Check that all feature files are generated
      expect(generated.featureFiles.Dashboard).toBeDefined();
      expect(generated.featureFiles.Auth).toBeDefined();

      // Check that code is valid (contains export)
      expect(generated.featureFiles.Dashboard).toContain('export function');
      expect(generated.featureFiles.Auth).toContain('export function');
    });

    it('should generate routes when routes are defined', () => {
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
      expect(generated.routeFile).toContain('/dashboard');
    });
  });

  describe('Feature Code Generation', () => {
    it('should generate code with context providers', () => {
      const feature: FeatureConfig = {
        id: 'feature-1',
        name: 'Test Feature',
        description: '',
        category: 'page',
        components: [],
        layout: {
          type: 'container',
          config: {},
        },
        contexts: [
          {
            providerName: 'ThemeProvider',
            data: {
              defaultTheme: 'dark',
            },
            config: {
              enabled: true,
            },
          },
        ],
      };

      const code = generateFeatureCode(feature);

      expect(code).toContain('ThemeProvider');
      expect(code).toContain("import { ThemeProvider } from '@/ui/providers'");
    });
  });

  describe('Context Providers Generation', () => {
    it('should generate all context providers', () => {
      const contexts = [
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
  });
});
