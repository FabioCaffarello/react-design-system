import { describe, it, expect } from 'vitest';
import {
  validateFeature,
  validateComponent,
  validateLayout,
  validateApp,
  validateFeatureDependencies,
} from './Validation';
import type { FeatureConfig, FeatureComponent, AppConfig } from '../types';
import { ComponentRegistry } from '../../../builders/ComponentRegistry';

describe('Validation', () => {
  describe('validateFeature', () => {
    it('should validate valid feature', () => {
      const feature: FeatureConfig = {
        id: 'feature-1',
        name: 'Test Feature',
        description: 'Test',
        category: 'page',
        components: [],
        layout: {
          type: 'container',
          config: {
            maxWidth: 'xl',
            padding: 'base',
          },
        },
      };

      const result = validateFeature(feature);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should detect missing ID', () => {
      const feature: FeatureConfig = {
        id: '',
        name: 'Test',
        description: '',
        category: 'page',
        components: [],
        layout: {
          type: 'container',
          config: {},
        },
      };

      const result = validateFeature(feature);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Feature ID is required');
    });

    it('should detect missing name', () => {
      const feature: FeatureConfig = {
        id: 'feature-1',
        name: '',
        description: '',
        category: 'page',
        components: [],
        layout: {
          type: 'container',
          config: {},
        },
      };

      const result = validateFeature(feature);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Feature name is required');
    });

    it('should detect invalid category', () => {
      const feature = {
        id: 'feature-1',
        name: 'Test',
        description: '',
        category: 'invalid' as any,
        components: [],
        layout: {
          type: 'container',
          config: {},
        },
      };

      const result = validateFeature(feature);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid feature category'))).toBe(true);
    });

    it('should validate components recursively', () => {
      const feature: FeatureConfig = {
        id: 'feature-1',
        name: 'Test',
        description: '',
        category: 'page',
        components: [
          {
            id: '',
            type: 'atom',
            name: 'Button',
            props: {},
          },
        ],
        layout: {
          type: 'container',
          config: {},
        },
      };

      const result = validateFeature(feature);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Component ID is required'))).toBe(true);
    });

    it('should validate layout', () => {
      const feature = {
        id: 'feature-1',
        name: 'Test',
        description: '',
        category: 'page',
        components: [],
        layout: null as any,
      };

      const result = validateFeature(feature);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Layout'))).toBe(true);
    });
  });

  describe('validateComponent', () => {
    it('should validate valid component', () => {
      const component: FeatureComponent = {
        id: 'comp-1',
        type: 'atom',
        name: 'Button',
        props: {},
      };

      const result = validateComponent(component);
      expect(result.valid).toBe(true);
    });

    it('should detect missing ID', () => {
      const component: FeatureComponent = {
        id: '',
        type: 'atom',
        name: 'Button',
        props: {},
      };

      const result = validateComponent(component);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Component ID is required');
    });

    it('should detect invalid type', () => {
      const component = {
        id: 'comp-1',
        type: 'invalid' as any,
        name: 'Button',
        props: {},
      };

      const result = validateComponent(component);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid component type'))).toBe(true);
    });

    it('should validate children recursively', () => {
      const component: FeatureComponent = {
        id: 'comp-1',
        type: 'molecule',
        name: 'Card',
        props: {},
        children: [
          {
            id: '',
            type: 'atom',
            name: 'Button',
            props: {},
          },
        ],
      };

      const result = validateComponent(component);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Child'))).toBe(true);
    });
  });

  describe('validateLayout', () => {
    it('should validate valid layout', () => {
      const layout: FeatureConfig['layout'] = {
        type: 'container',
        config: {
          maxWidth: 'xl',
          padding: 'base',
        },
      };

      const result = validateLayout(layout);
      expect(result.valid).toBe(true);
    });

    it('should detect missing layout', () => {
      const result = validateLayout(null as any);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Layout is required');
    });

    it('should detect invalid layout type', () => {
      const layout = {
        type: 'invalid' as any,
        config: {},
      };

      const result = validateLayout(layout);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Invalid layout type'))).toBe(true);
    });
  });

  describe('validateApp', () => {
    it('should validate valid app', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [
          {
            id: 'feature-1',
            name: 'Feature 1',
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

      const result = validateApp(appConfig);
      expect(result.valid).toBe(true);
    });

    it('should detect duplicate feature IDs', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [
          {
            id: 'feature-1',
            name: 'Feature 1',
            description: '',
            category: 'page',
            components: [],
            layout: {
              type: 'container',
              config: {},
            },
          },
          {
            id: 'feature-1',
            name: 'Feature 2',
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

      const result = validateApp(appConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Duplicate feature ID'))).toBe(true);
    });

    it('should validate dependencies', () => {
      const appConfig: AppConfig = {
        name: 'Test App',
        description: 'Test',
        features: [
          {
            id: 'feature-1',
            name: 'Feature 1',
            description: '',
            category: 'page',
            components: [],
            layout: {
              type: 'container',
              config: {},
            },
            dependencies: ['non-existent'],
          },
        ],
      };

      const result = validateApp(appConfig);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('depends on non-existent'))).toBe(true);
    });
  });

  describe('validateFeatureDependencies', () => {
    it('should detect circular dependencies', () => {
      const features: FeatureConfig[] = [
        {
          id: 'feature-1',
          name: 'Feature 1',
          description: '',
          category: 'page',
          components: [],
          layout: {
            type: 'container',
            config: {},
          },
          dependencies: ['feature-2'],
        },
        {
          id: 'feature-2',
          name: 'Feature 2',
          description: '',
          category: 'page',
          components: [],
          layout: {
            type: 'container',
            config: {},
          },
          dependencies: ['feature-1'],
        },
      ];

      const result = validateFeatureDependencies(features);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Circular dependency'))).toBe(true);
    });

    it('should validate valid dependencies', () => {
      const features: FeatureConfig[] = [
        {
          id: 'feature-1',
          name: 'Feature 1',
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
          name: 'Feature 2',
          description: '',
          category: 'page',
          components: [],
          layout: {
            type: 'container',
            config: {},
          },
          dependencies: ['feature-1'],
        },
      ];

      const result = validateFeatureDependencies(features);
      expect(result.valid).toBe(true);
    });
  });
});
