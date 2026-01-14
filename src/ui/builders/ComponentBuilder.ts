/**
 * Component Builder
 * 
 * Fluent builder for creating components with method chaining.
 */

import type { ComponentBuilderConfig, BuiltComponent, ComponentFactoryOptions } from './types';
import { ComponentFactory } from './ComponentFactory';

/**
 * Component Builder
 * 
 * Fluent builder for creating components with method chaining.
 * 
 * @example
 * ```typescript
 * const button = ComponentBuilder
 *   .atom('Button')
 *   .withVariants(['primary', 'secondary', 'outline'])
 *   .withSizes(['sm', 'md', 'lg'])
 *   .withTokens({
 *     colors: ['primary', 'secondary'],
 *     spacing: ['sm', 'md', 'lg'],
 *   })
 *   .withAccessibility({
 *     ariaLabel: true,
 *     keyboardNavigation: true,
 *   })
 *   .build();
 * ```
 */
export class ComponentBuilder {
  private config: ComponentBuilderConfig;
  private options: ComponentFactoryOptions;

  private constructor(category: ComponentBuilderConfig['category'], name: string) {
    this.config = {
      name,
      category,
    };
    this.options = {};
  }

  /**
   * Create an atom builder
   */
  static atom(name: string): ComponentBuilder {
    return new ComponentBuilder('atom', name);
  }

  /**
   * Create a molecule builder
   */
  static molecule(name: string): ComponentBuilder {
    return new ComponentBuilder('molecule', name);
  }

  /**
   * Create an organism builder
   */
  static organism(name: string): ComponentBuilder {
    return new ComponentBuilder('organism', name);
  }

  /**
   * Create a template builder
   */
  static template(name: string): ComponentBuilder {
    return new ComponentBuilder('template', name);
  }

  /**
   * Create a pattern builder
   */
  static pattern(name: string): ComponentBuilder {
    return new ComponentBuilder('pattern', name);
  }

  /**
   * Create a layout builder
   */
  static layout(name: string): ComponentBuilder {
    return new ComponentBuilder('layout', name);
  }

  /**
   * Add variants
   */
  withVariants(variants: string[]): this {
    this.config.variants = variants;
    return this;
  }

  /**
   * Add sizes
   */
  withSizes(sizes: string[]): this {
    this.config.sizes = sizes;
    return this;
  }

  /**
   * Add states
   */
  withStates(states: string[]): this {
    this.config.states = states;
    return this;
  }

  /**
   * Add tokens
   */
  withTokens(tokens: ComponentBuilderConfig['tokens']): this {
    this.config.tokens = tokens;
    return this;
  }

  /**
   * Add accessibility features
   */
  withAccessibility(accessibility: ComponentBuilderConfig['accessibility']): this {
    this.config.accessibility = accessibility;
    return this;
  }

  /**
   * Add props
   */
  withProps(props: Record<string, unknown>): this {
    this.config.props = props;
    return this;
  }

  /**
   * Enable children
   */
  withChildren(children: boolean = true): this {
    this.config.children = children;
    return this;
  }

  /**
   * Set factory options
   */
  withOptions(options: ComponentFactoryOptions): this {
    this.options = { ...this.options, ...options };
    return this;
  }

  /**
   * Build the component
   */
  build(): BuiltComponent {
    const validation = ComponentFactory.validate(this.config);
    if (!validation.valid) {
      throw new Error(`Invalid component configuration: ${validation.errors.join(', ')}`);
    }

    return ComponentFactory.create(this.config, this.options);
  }
}
