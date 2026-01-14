/**
 * Component Registry
 * 
 * Registry for managing component configurations and metadata.
 */

import type { ComponentBuilderConfig, BuiltComponent } from './types';

/**
 * Component Metadata
 */
export interface ComponentMetadata {
  config: ComponentBuilderConfig;
  builtComponent?: BuiltComponent;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  description?: string;
}

/**
 * Component Registry
 * 
 * Central registry for component configurations.
 */
export class ComponentRegistry {
  private static registry = new Map<string, ComponentMetadata>();

  /**
   * Register a component
   */
  static register(name: string, config: ComponentBuilderConfig, metadata?: Partial<ComponentMetadata>): void {
    const existing = this.registry.get(name);
    const now = new Date();

    this.registry.set(name, {
      config,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      ...metadata,
    });
  }

  /**
   * Get component metadata
   */
  static get(name: string): ComponentMetadata | undefined {
    return this.registry.get(name);
  }

  /**
   * Check if component exists
   */
  static has(name: string): boolean {
    return this.registry.has(name);
  }

  /**
   * Get all registered components
   */
  static getAll(): ComponentMetadata[] {
    return Array.from(this.registry.values());
  }

  /**
   * Get components by category
   */
  static getByCategory(category: ComponentBuilderConfig['category']): ComponentMetadata[] {
    return Array.from(this.registry.values()).filter(
      (metadata) => metadata.config.category === category
    );
  }

  /**
   * Remove component
   */
  static remove(name: string): boolean {
    return this.registry.delete(name);
  }

  /**
   * Clear registry
   */
  static clear(): void {
    this.registry.clear();
  }

  /**
   * Update component
   */
  static update(name: string, updates: Partial<ComponentMetadata>): boolean {
    const existing = this.registry.get(name);
    if (!existing) return false;

    this.registry.set(name, {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    });

    return true;
  }
}
