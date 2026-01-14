/**
 * Node Factory
 * 
 * Factory pattern for creating nodes with design system patterns.
 */

import type { Node, XYPosition } from '@xyflow/react';
import { NodeTypeRegistry } from './nodeTypes';
import type { FlowNodeData, NodeCustomization } from '../organisms/FlowTypes';

/**
 * Node Template
 */
export interface NodeTemplate<T extends FlowNodeData = FlowNodeData> {
  type: string;
  position?: XYPosition;
  data: T;
  customization?: NodeCustomization;
}

/**
 * Node Factory
 * 
 * Factory for creating nodes with validation and customization support.
 */
export class NodeFactory {
  /**
   * Create a node
   */
  static create<T extends FlowNodeData = FlowNodeData>(
    type: string,
    id: string,
    position: XYPosition,
    data: T,
    customization?: NodeCustomization
  ): Node<T> {
    // Validate if type exists in registry
    if (!NodeTypeRegistry.has(type)) {
      console.warn(`Node type "${type}" not found, using default`);
      type = 'default';
    }
    
    // Get customization from registry if not provided
    const registryDefinition = NodeTypeRegistry.get(type);
    const finalCustomization = customization || 
                               registryDefinition?.customization ||
                               registryDefinition?.defaultCustomization;
    
    // Merge customization into data
    const nodeData: T = {
      ...data,
      ...(finalCustomization ? {
        variant: finalCustomization.variant || data.variant,
        size: finalCustomization.size || data.size,
        customization: finalCustomization,
      } : {}),
    };
    
    return {
      id,
      type,
      position,
      data: nodeData,
    };
  }
  
  /**
   * Create a node from template
   */
  static createFromTemplate<T extends FlowNodeData = FlowNodeData>(
    template: NodeTemplate<T>,
    id?: string
  ): Node<T> {
    return this.create(
      template.type,
      id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      template.position || { x: 0, y: 0 },
      template.data,
      template.customization
    );
  }
  
  /**
   * Create multiple nodes from templates
   */
  static createBatch<T extends FlowNodeData = FlowNodeData>(
    templates: NodeTemplate<T>[]
  ): Node<T>[] {
    return templates.map((template) => this.createFromTemplate(template));
  }
}
