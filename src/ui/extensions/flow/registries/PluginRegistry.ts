/**
 * Plugin Registry
 * 
 * Registry pattern for managing Flow plugins/extensions.
 */

/**
 * Plugin Definition
 */
export interface PluginDefinition {
  id: string;
  name: string;
  version: string;
  description?: string;
  nodeTypes?: Record<string, React.ComponentType<unknown>>;
  edgeTypes?: Record<string, React.ComponentType<unknown>>;
  hooks?: Record<string, (...args: unknown[]) => unknown>;
  utils?: Record<string, (...args: unknown[]) => unknown>;
  onRegister?: () => void;
  onUnregister?: () => void;
  dependencies?: string[];
}

/**
 * Plugin Registry
 * 
 * Manages registration and retrieval of Flow plugins.
 */
export class PluginRegistry {
  private static registry: Map<string, PluginDefinition> = new Map();
  private static loadOrder: string[] = [];

  /**
   * Register a plugin
   */
  static register(plugin: PluginDefinition): void {
    // Check dependencies
    if (plugin.dependencies) {
      const missingDeps = plugin.dependencies.filter((dep) => !this.registry.has(dep));
      if (missingDeps.length > 0) {
        throw new Error(`Plugin "${plugin.id}" has missing dependencies: ${missingDeps.join(', ')}`);
      }
    }

    // Register plugin
    this.registry.set(plugin.id, plugin);
    this.loadOrder.push(plugin.id);

    // Call onRegister hook
    plugin.onRegister?.();
  }

  /**
   * Get a plugin
   */
  static get(id: string): PluginDefinition | undefined {
    return this.registry.get(id);
  }

  /**
   * Get all registered plugins
   */
  static getAll(): PluginDefinition[] {
    return Array.from(this.registry.values());
  }

  /**
   * Get all plugin IDs
   */
  static getIds(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Check if a plugin is registered
   */
  static has(id: string): boolean {
    return this.registry.has(id);
  }

  /**
   * Unregister a plugin
   */
  static unregister(id: string): boolean {
    const plugin = this.registry.get(id);
    if (!plugin) {
      return false;
    }

    // Call onUnregister hook
    plugin.onUnregister?.();

    // Remove from load order
    this.loadOrder = this.loadOrder.filter((pluginId) => pluginId !== id);

    return this.registry.delete(id);
  }

  /**
   * Get all node types from all plugins
   */
  static getAllNodeTypes(): Record<string, React.ComponentType<unknown>> {
    const nodeTypes: Record<string, React.ComponentType<unknown>> = {};
    
    this.loadOrder.forEach((pluginId) => {
      const plugin = this.registry.get(pluginId);
      if (plugin?.nodeTypes) {
        Object.assign(nodeTypes, plugin.nodeTypes);
      }
    });

    return nodeTypes;
  }

  /**
   * Get all edge types from all plugins
   */
  static getAllEdgeTypes(): Record<string, React.ComponentType<unknown>> {
    const edgeTypes: Record<string, React.ComponentType<unknown>> = {};
    
    this.loadOrder.forEach((pluginId) => {
      const plugin = this.registry.get(pluginId);
      if (plugin?.edgeTypes) {
        Object.assign(edgeTypes, plugin.edgeTypes);
      }
    });

    return edgeTypes;
  }

  /**
   * Get a hook from a plugin
   */
  static getHook(pluginId: string, hookName: string): ((...args: unknown[]) => unknown) | undefined {
    const plugin = this.registry.get(pluginId);
    return plugin?.hooks?.[hookName];
  }

  /**
   * Get a utility from a plugin
   */
  static getUtil(pluginId: string, utilName: string): ((...args: unknown[]) => unknown) | undefined {
    const plugin = this.registry.get(pluginId);
    return plugin?.utils?.[utilName];
  }

  /**
   * Clear all plugins
   */
  static clear(): void {
    // Call onUnregister for all plugins
    this.registry.forEach((plugin) => {
      plugin.onUnregister?.();
    });

    this.registry.clear();
    this.loadOrder = [];
  }
}
