import { describe, it, expect, beforeEach } from 'vitest';
import { generateFeatureCode } from './FeatureCodeGenerator';
import { ComponentRegistry } from '../../../builders/ComponentRegistry';
import type { FeatureConfig } from '../types';
import type { ComponentBuilderConfig } from '../../../builders/types';

describe('FeatureCodeGenerator', () => {
  beforeEach(() => {
    ComponentRegistry.clear();
  });

  describe('generateFeatureCode', () => {
    it('should generate valid React code', () => {
      const feature: FeatureConfig = {
        id: 'feature-1',
        name: 'Test Feature',
        description: 'A test feature',
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

      const code = generateFeatureCode(feature);
      expect(code).toContain('export function TestFeature');
      expect(code).toContain('import');
    });

    it('should include all imports', () => {
      const buttonConfig: ComponentBuilderConfig = {
        name: 'Button',
        category: 'atom',
      };

      ComponentRegistry.register('Button', buttonConfig);

      const feature: FeatureConfig = {
        id: 'feature-1',
        name: 'Test Feature',
        description: '',
        category: 'page',
        components: [
          {
            id: 'comp-1',
            type: 'atom',
            name: 'Button',
            props: { children: 'Click me' },
          },
        ],
        layout: {
          type: 'container',
          config: {},
        },
      };

      const code = generateFeatureCode(feature);
      expect(code).toContain("import { Button } from '@/ui/atoms'");
      expect(code).toContain("import { Container } from '@/ui/layouts'");
    });

    it('should handle components with children', () => {
      const buttonConfig: ComponentBuilderConfig = {
        name: 'Button',
        category: 'atom',
      };

      const cardConfig: ComponentBuilderConfig = {
        name: 'Card',
        category: 'molecule',
      };

      ComponentRegistry.register('Button', buttonConfig);
      ComponentRegistry.register('Card', cardConfig);

      const feature: FeatureConfig = {
        id: 'feature-1',
        name: 'Test Feature',
        description: '',
        category: 'page',
        components: [
          {
            id: 'comp-1',
            type: 'molecule',
            name: 'Card',
            props: {},
            children: [
              {
                id: 'comp-2',
                type: 'atom',
                name: 'Button',
                props: { children: 'Click' },
              },
            ],
          },
        ],
        layout: {
          type: 'container',
          config: {},
        },
      };

      const code = generateFeatureCode(feature);
      expect(code).toContain('<Card>');
      expect(code).toContain('<Button');
      expect(code).toContain('</Card>');
    });

    it('should handle layout wrappers', () => {
      const feature: FeatureConfig = {
        id: 'feature-1',
        name: 'Test Feature',
        description: '',
        category: 'page',
        components: [],
        layout: {
          type: 'stack',
          config: {
            spacing: 'lg',
          },
        },
      };

      const code = generateFeatureCode(feature);
      expect(code).toContain("import { Stack } from '@/ui/layouts'");
      expect(code).toContain('<Stack spacing="lg">');
    });

    it('should handle context providers', () => {
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
      expect(code).toContain("import { ThemeProvider } from '@/ui/providers'");
      expect(code).toContain('<ThemeProvider');
    });

    it('should handle empty features', () => {
      const feature: FeatureConfig = {
        id: 'feature-1',
        name: 'Empty Feature',
        description: '',
        category: 'page',
        components: [],
        layout: {
          type: 'container',
          config: {},
        },
      };

      const code = generateFeatureCode(feature);
      expect(code).toContain('export function EmptyFeature');
      expect(code).toContain('return');
    });
  });
});
