/**
 * Edge Types Registry
 * 
 * Registry pattern for managing custom edge types.
 * EdgeTypes should be defined outside components to avoid re-renders.
 */

import type { EdgeTypes } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import type { ComponentType } from 'react';
import { CustomEdge } from '../molecules/CustomEdge';
import type { EdgeCustomization } from '../organisms/FlowTypes';

/**
 * Edge Type Definition
 */
export interface EdgeTypeDefinition {
  component: ComponentType<EdgeProps>;
  defaultCustomization?: EdgeCustomization;
  customization?: EdgeCustomization;
  version?: string;
  metadata?: {
    description?: string;
    author?: string;
    tags?: string[];
    examples?: Array<{ label: string; data: any }>;
  };
  lazyLoad?: () => Promise<{ default: ComponentType<EdgeProps> }>;
}

/**
 * Default edge types
 */
const defaultEdgeTypes: EdgeTypes = {
  default: CustomEdge,
};

/**
 * Edge Type Registry
 * 
 * Manages registration and retrieval of edge types with customization support.
 * Enhanced with lazy loading, versioning, and metadata.
 */
export class EdgeTypeRegistry {
  private static registry: Map<string, EdgeTypeDefinition> = new Map();
  private static loadedComponents: Map<string, ComponentType<EdgeProps>> = new Map();
  
  /**
   * Initialize with default types
   */
  static initialize() {
    if (this.registry.size === 0) {
      Object.entries(defaultEdgeTypes).forEach(([type, component]) => {
        this.registry.set(type, { 
          component,
          version: '1.0.0',
          metadata: {
            description: `Default ${type} edge type`,
          },
        });
        this.loadedComponents.set(type, component);
      });
    }
  }
  
  /**
   * Register a new edge type
   */
  static register(
    type: string,
    definition: EdgeTypeDefinition
  ): void {
    // Validate definition
    if (!definition.component && !definition.lazyLoad) {
      throw new Error(`Edge type "${type}" must have either component or lazyLoad`);
    }
    
    // If component is provided, load it immediately
    if (definition.component) {
      this.loadedComponents.set(type, definition.component);
    }
    
    this.registry.set(type, {
      ...definition,
      version: definition.version || '1.0.0',
    });
  }
  
  /**
   * Get an edge type definition
   */
  static get(type: string): EdgeTypeDefinition | undefined {
    this.initialize();
    return this.registry.get(type);
  }
  
  /**
   * Get component for an edge type (with lazy loading support)
   */
  static async getComponent(type: string): Promise<ComponentType<EdgeProps> | undefined> {
    this.initialize();
    
    // Check if already loaded
    if (this.loadedComponents.has(type)) {
      return this.loadedComponents.get(type);
    }
    
    const definition = this.registry.get(type);
    if (!definition) {
      return undefined;
    }
    
    // Lazy load if needed
    if (definition.lazyLoad) {
      try {
        const module = await definition.lazyLoad();
        const component = module.default;
        this.loadedComponents.set(type, component);
        return component;
      } catch (error) {
        console.error(`Failed to lazy load edge type "${type}":`, error);
        return undefined;
      }
    }
    
    // Return component if available
    if (definition.component) {
      this.loadedComponents.set(type, definition.component);
      return definition.component;
    }
    
    return undefined;
  }
  
  /**
   * Get all registered edge types as EdgeTypes object
   * Note: This only returns synchronously loaded components
   */
  static getAll(): EdgeTypes {
    this.initialize();
    const edgeTypes: EdgeTypes = {};
    this.loadedComponents.forEach((component, type) => {
      edgeTypes[type] = component;
    });
    return edgeTypes;
  }
  
  /**
   * Get all registered edge types asynchronously (includes lazy loaded)
   */
  static async getAllAsync(): Promise<EdgeTypes> {
    this.initialize();
    const edgeTypes: EdgeTypes = {};
    
    for (const [type] of this.registry) {
      const component = await this.getComponent(type);
      if (component) {
        edgeTypes[type] = component;
      }
    }
    
    return edgeTypes;
  }
  
  /**
   * Extend an existing edge type with customization
   */
  static extend(
    baseType: string,
    newType: string,
    customization: Partial<EdgeCustomization>
  ): void {
    const base = this.get(baseType);
    if (!base) {
      throw new Error(`Base edge type "${baseType}" not found`);
    }
    
    this.register(newType, {
      ...base,
      customization: {
        ...base.defaultCustomization,
        ...base.customization,
        ...customization,
      },
    });
  }
  
  /**
   * Check if an edge type is registered
   */
  static has(type: string): boolean {
    return this.registry.has(type);
  }
  
  /**
   * Remove an edge type
   */
  static unregister(type: string): boolean {
    return this.registry.delete(type);
  }
  
  /**
   * Get all registered type names
   */
  static getTypes(): string[] {
    return Array.from(this.registry.keys());
  }
}
