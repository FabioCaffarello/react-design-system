/**
 * Node Types Registry
 * 
 * Registry pattern for managing custom node types.
 * NodeTypes should be defined outside components to avoid re-renders.
 */

import type { NodeTypes, NodeProps } from '@xyflow/react';
import type { ComponentType } from 'react';
import { CardNode } from '../molecules/CardNode';
import { CustomNode } from '../molecules/CustomNode';
import type { NodeCustomization } from '../organisms/FlowTypes';

/**
 * Node Type Definition
 */
export interface NodeTypeDefinition {
  component: ComponentType<NodeProps>;
  defaultCustomization?: NodeCustomization;
  customization?: NodeCustomization;
  version?: string;
  metadata?: {
    description?: string;
    author?: string;
    tags?: string[];
    examples?: Array<{ label: string; data: any }>;
  };
  lazyLoad?: () => Promise<{ default: ComponentType<NodeProps> }>;
}

/**
 * Default node types
 * CardNode is now the default as it uses Card from design system
 */
const defaultNodeTypes: NodeTypes = {
  default: CardNode,
  custom: CustomNode, // Keep CustomNode available as 'custom' type
};

/**
 * Node Type Registry
 * 
 * Manages registration and retrieval of node types with customization support.
 * Enhanced with lazy loading, versioning, and metadata.
 */
export class NodeTypeRegistry {
  private static registry: Map<string, NodeTypeDefinition> = new Map();
  private static loadedComponents: Map<string, ComponentType<NodeProps>> = new Map();
  
  /**
   * Initialize with default types
   */
  static initialize() {
    if (this.registry.size === 0) {
      Object.entries(defaultNodeTypes).forEach(([type, component]) => {
        this.registry.set(type, { 
          component,
          version: '1.0.0',
          metadata: {
            description: `Default ${type} node type`,
          },
        });
        this.loadedComponents.set(type, component);
      });
    }
  }
  
  /**
   * Register a new node type
   */
  static register(
    type: string,
    definition: NodeTypeDefinition
  ): void {
    // Validate definition
    if (!definition.component && !definition.lazyLoad) {
      throw new Error(`Node type "${type}" must have either component or lazyLoad`);
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
   * Get a node type definition
   */
  static get(type: string): NodeTypeDefinition | undefined {
    this.initialize();
    return this.registry.get(type);
  }
  
  /**
   * Get component for a node type (with lazy loading support)
   */
  static async getComponent(type: string): Promise<ComponentType<NodeProps> | undefined> {
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
        console.error(`Failed to lazy load node type "${type}":`, error);
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
   * Get all registered node types as NodeTypes object
   * Note: This only returns synchronously loaded components
   */
  static getAll(): NodeTypes {
    this.initialize();
    const nodeTypes: NodeTypes = {};
    this.loadedComponents.forEach((component, type) => {
      nodeTypes[type] = component;
    });
    return nodeTypes;
  }
  
  /**
   * Get all registered node types asynchronously (includes lazy loaded)
   */
  static async getAllAsync(): Promise<NodeTypes> {
    this.initialize();
    const nodeTypes: NodeTypes = {};
    
    for (const [type] of this.registry) {
      const component = await this.getComponent(type);
      if (component) {
        nodeTypes[type] = component;
      }
    }
    
    return nodeTypes;
  }
  
  /**
   * Extend an existing node type with customization
   */
  static extend(
    baseType: string,
    newType: string,
    customization: Partial<NodeCustomization>
  ): void {
    const base = this.get(baseType);
    if (!base) {
      throw new Error(`Base node type "${baseType}" not found`);
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
   * Check if a node type is registered
   */
  static has(type: string): boolean {
    return this.registry.has(type);
  }
  
  /**
   * Remove a node type
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
