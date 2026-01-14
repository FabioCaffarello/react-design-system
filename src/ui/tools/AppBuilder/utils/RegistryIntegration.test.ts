import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAvailableComponents,
  getComponentsByCategory,
  validateComponentExists,
  getComponentMetadata,
  searchComponents,
  filterComponentsByTags,
} from './RegistryIntegration';
import { ComponentRegistry } from '../../../builders/ComponentRegistry';
import type { ComponentBuilderConfig } from '../../../builders/types';

describe('RegistryIntegration', () => {
  beforeEach(() => {
    ComponentRegistry.clear();
  });

  describe('getAvailableComponents', () => {
    it('should return empty array when registry is empty', () => {
      const components = getAvailableComponents();
      expect(components).toEqual([]);
    });

    it('should return all registered components', () => {
      const config: ComponentBuilderConfig = {
        name: 'TestButton',
        category: 'atom',
      };

      ComponentRegistry.register('TestButton', config);
      const components = getAvailableComponents();

      expect(components.length).toBe(1);
      expect(components[0].config.name).toBe('TestButton');
    });
  });

  describe('getComponentsByCategory', () => {
    it('should return components by category', () => {
      const atomConfig: ComponentBuilderConfig = {
        name: 'Button',
        category: 'atom',
      };

      const moleculeConfig: ComponentBuilderConfig = {
        name: 'Card',
        category: 'molecule',
      };

      ComponentRegistry.register('Button', atomConfig);
      ComponentRegistry.register('Card', moleculeConfig);

      const atoms = getComponentsByCategory('atom');
      expect(atoms.length).toBe(1);
      expect(atoms[0].config.name).toBe('Button');
    });
  });

  describe('validateComponentExists', () => {
    it('should return true for existing component', () => {
      const config: ComponentBuilderConfig = {
        name: 'TestButton',
        category: 'atom',
      };

      ComponentRegistry.register('TestButton', config);
      expect(validateComponentExists('TestButton')).toBe(true);
    });

    it('should return false for non-existent component', () => {
      expect(validateComponentExists('NonExistent')).toBe(false);
    });
  });

  describe('getComponentMetadata', () => {
    it('should return metadata for existing component', () => {
      const config: ComponentBuilderConfig = {
        name: 'TestButton',
        category: 'atom',
      };

      ComponentRegistry.register('TestButton', config, {
        description: 'Test button',
        tags: ['button', 'atom'],
      });

      const metadata = getComponentMetadata('TestButton');
      expect(metadata).toBeDefined();
      expect(metadata?.config.name).toBe('TestButton');
      expect(metadata?.description).toBe('Test button');
    });

    it('should return undefined for non-existent component', () => {
      const metadata = getComponentMetadata('NonExistent');
      expect(metadata).toBeUndefined();
    });
  });

  describe('searchComponents', () => {
    it('should search by name', () => {
      const config1: ComponentBuilderConfig = {
        name: 'Button',
        category: 'atom',
      };

      const config2: ComponentBuilderConfig = {
        name: 'Card',
        category: 'molecule',
      };

      ComponentRegistry.register('Button', config1);
      ComponentRegistry.register('Card', config2);

      const results = searchComponents('Button');
      expect(results.length).toBe(1);
      expect(results[0].config.name).toBe('Button');
    });

    it('should search by description', () => {
      const config: ComponentBuilderConfig = {
        name: 'Button',
        category: 'atom',
      };

      ComponentRegistry.register('Button', config, {
        description: 'A clickable button component',
      });

      const results = searchComponents('clickable');
      expect(results.length).toBe(1);
    });

    it('should search by tags', () => {
      const config: ComponentBuilderConfig = {
        name: 'Button',
        category: 'atom',
      };

      ComponentRegistry.register('Button', config, {
        tags: ['interactive', 'clickable'],
      });

      const results = searchComponents('interactive');
      expect(results.length).toBe(1);
    });
  });

  describe('filterComponentsByTags', () => {
    it('should filter by tags', () => {
      const config1: ComponentBuilderConfig = {
        name: 'Button',
        category: 'atom',
      };

      const config2: ComponentBuilderConfig = {
        name: 'Card',
        category: 'molecule',
      };

      ComponentRegistry.register('Button', config1, {
        tags: ['interactive'],
      });

      ComponentRegistry.register('Card', config2, {
        tags: ['layout'],
      });

      const results = filterComponentsByTags(['interactive']);
      expect(results.length).toBe(1);
      expect(results[0].config.name).toBe('Button');
    });

    it('should return empty array when no matches', () => {
      const config: ComponentBuilderConfig = {
        name: 'Button',
        category: 'atom',
      };

      ComponentRegistry.register('Button', config, {
        tags: ['interactive'],
      });

      const results = filterComponentsByTags(['nonexistent']);
      expect(results).toEqual([]);
    });
  });
});
