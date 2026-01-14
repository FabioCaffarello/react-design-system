/**
 * Component Factory
 * 
 * Factory for creating components using various design patterns.
 */

import type { ComponentBuilderConfig, BuiltComponent, ComponentFactoryOptions } from './types';
import { AtomBuilder } from './builders/AtomBuilder';
import { MoleculeBuilder } from './builders/MoleculeBuilder';
import { OrganismBuilder } from './builders/OrganismBuilder';
import { TemplateBuilder } from './builders/TemplateBuilder';

/**
 * Component Factory
 * 
 * Main factory for creating components based on category and configuration.
 */
export class ComponentFactory {
  /**
   * Create a component
   */
  static create(
    config: ComponentBuilderConfig,
    options: ComponentFactoryOptions = {}
  ): BuiltComponent {
    const builder = this.getBuilder(config.category);
    return builder.build(config, options);
  }

  /**
   * Get appropriate builder for category
   */
  private static getBuilder(category: ComponentBuilderConfig['category']) {
    switch (category) {
      case 'atom':
        return AtomBuilder;
      case 'molecule':
        return MoleculeBuilder;
      case 'organism':
        return OrganismBuilder;
      case 'template':
        return TemplateBuilder;
      case 'pattern':
        return OrganismBuilder; // Patterns are similar to organisms
      case 'layout':
        return MoleculeBuilder; // Layouts are similar to molecules
      default:
        return AtomBuilder;
    }
  }

  /**
   * Validate component configuration
   */
  static validate(config: ComponentBuilderConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.name || config.name.trim().length === 0) {
      errors.push('Component name is required');
    }

    if (!config.category) {
      errors.push('Component category is required');
    }

    if (config.name && !/^[A-Z][a-zA-Z0-9]*$/.test(config.name)) {
      errors.push('Component name must be PascalCase');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
