/**
 * Extension Registry
 * 
 * Registry for managing design system extensions.
 */

import type { ExtensionDefinition, IExtensionRegistry } from './types';

/**
 * Extension Registry
 * 
 * Manages registration and retrieval of design system extensions.
 */
export class ExtensionRegistry implements IExtensionRegistry {
  private static registry: Map<string, ExtensionDefinition> = new Map();

  /**
   * Register an extension
   */
  static register(extension: ExtensionDefinition): void {
    // Check if already registered
    if (this.registry.has(extension.id)) {
      console.warn(`Extension "${extension.id}" is already registered. Overwriting...`);
    }

    // Call onRegister hook
    extension.onRegister?.();

    // Register extension
    this.registry.set(extension.id, extension);
  }

  /**
   * Unregister an extension
   */
  static unregister(id: string): boolean {
    const extension = this.registry.get(id);
    if (!extension) {
      return false;
    }

    // Call onUnregister hook
    extension.onUnregister?.();

    return this.registry.delete(id);
  }

  /**
   * Get an extension
   */
  static get(id: string): ExtensionDefinition | undefined {
    return this.registry.get(id);
  }

  /**
   * Get all registered extensions
   */
  static getAll(): ExtensionDefinition[] {
    return Array.from(this.registry.values());
  }

  /**
   * Check if an extension is registered
   */
  static has(id: string): boolean {
    return this.registry.has(id);
  }

  /**
   * Get all extension IDs
   */
  static getIds(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Clear all extensions
   */
  static clear(): void {
    // Call onUnregister for all extensions
    this.registry.forEach((extension) => {
      extension.onUnregister?.();
    });

    this.registry.clear();
  }
}
