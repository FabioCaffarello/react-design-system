/**
 * Edge Factory
 * 
 * Factory pattern for creating edges with design system patterns.
 */

import type { Edge } from '@xyflow/react';
import { EdgeTypeRegistry } from './edgeTypes';
import type { FlowEdgeData, EdgeCustomization } from '../organisms/FlowTypes';

/**
 * Edge Template
 */
export interface EdgeTemplate<T extends FlowEdgeData = FlowEdgeData> {
  type?: string;
  source: string;
  target: string;
  data?: T;
  customization?: EdgeCustomization;
}

/**
 * Edge Factory
 * 
 * Factory for creating edges with validation and customization support.
 */
export class EdgeFactory {
  /**
   * Create an edge
   */
  static create<T extends FlowEdgeData = FlowEdgeData>(
    source: string,
    target: string,
    id?: string,
    type?: string,
    data?: T,
    customization?: EdgeCustomization
  ): Edge<T> {
    const edgeType = type || 'default';
    
    // Validate if type exists in registry
    if (!EdgeTypeRegistry.has(edgeType)) {
      console.warn(`Edge type "${edgeType}" not found, using default`);
      type = 'default';
    }
    
    // Get customization from registry if not provided
    const registryDefinition = EdgeTypeRegistry.get(edgeType);
    const finalCustomization = customization ||
                               registryDefinition?.customization ||
                               registryDefinition?.defaultCustomization;
    
    // Merge customization into data
    const edgeData: T = {
      ...(data || {} as T),
      ...(finalCustomization ? {
        type: finalCustomization.type || edgeType,
        animated: finalCustomization.animated,
        label: finalCustomization.label,
        style: finalCustomization.style,
        className: finalCustomization.className,
        customization: finalCustomization,
      } : {}),
    } as T;
    
    return {
      id: id || `edge-${source}-${target}-${Date.now()}`,
      type: edgeType,
      source,
      target,
      data: edgeData,
    };
  }
  
  /**
   * Create an edge from template
   */
  static createFromTemplate<T extends FlowEdgeData = FlowEdgeData>(
    template: EdgeTemplate<T>
  ): Edge<T> {
    return this.create(
      template.source,
      template.target,
      undefined,
      template.type,
      template.data,
      template.customization
    );
  }
  
  /**
   * Create multiple edges from templates
   */
  static createBatch<T extends FlowEdgeData = FlowEdgeData>(
    templates: EdgeTemplate<T>[]
  ): Edge<T>[] {
    return templates.map((template) => this.createFromTemplate(template));
  }
}
