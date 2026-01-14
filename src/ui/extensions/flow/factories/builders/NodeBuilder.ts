/**
 * Node Builder
 * 
 * Builder pattern for fluent node construction.
 */

import type { Node, XYPosition, Position } from '@xyflow/react';
import type { FlowNodeData, NodeCustomization } from '../../organisms/FlowTypes';
import { NodeFactory } from '../../utils/nodeFactory';

/**
 * Node Builder
 * 
 * Fluent builder for creating nodes with method chaining.
 */
export class NodeBuilder<T extends FlowNodeData = FlowNodeData> {
  private id: string;
  private type: string;
  private position: XYPosition;
  private data: Partial<T>;
  private customization?: NodeCustomization;
  private width?: number;
  private height?: number;
  private parentId?: string;
  private extent?: 'parent' | [number, number, number, number];
  private expandParent?: boolean;
  private selected?: boolean;
  private draggable?: boolean;
  private selectable?: boolean;
  private connectable?: boolean;
  private deletable?: boolean;
  private focusable?: boolean;
  private hidden?: boolean;
  private zIndex?: number;
  private sourcePosition?: Position;
  private targetPosition?: Position;

  constructor(id?: string) {
    this.id = id || `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.type = 'default';
    this.position = { x: 0, y: 0 };
    this.data = {};
  }

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withType(type: string): this {
    this.type = type;
    return this;
  }

  withPosition(position: XYPosition): this {
    this.position = position;
    return this;
  }

  withData(data: Partial<T>): this {
    this.data = { ...this.data, ...data };
    return this;
  }

  withLabel(label: string): this {
    this.data.label = label as any;
    return this;
  }

  withDescription(description: string): this {
    this.data.description = description as any;
    return this;
  }

  withVariant(variant: FlowNodeData['variant']): this {
    this.data.variant = variant as any;
    return this;
  }

  withSize(size: FlowNodeData['size']): this {
    this.data.size = size as any;
    return this;
  }

  withIcon(icon: React.ReactNode): this {
    this.data.icon = icon as any;
    return this;
  }

  withCustomization(customization: NodeCustomization): this {
    this.customization = customization;
    return this;
  }

  withDimensions(width: number, height: number): this {
    this.width = width;
    this.height = height;
    return this;
  }

  withParent(parentId: string, options?: { extent?: 'parent' | [number, number, number, number]; expandParent?: boolean }): this {
    this.parentId = parentId;
    if (options?.extent) this.extent = options.extent;
    if (options?.expandParent !== undefined) this.expandParent = options.expandParent;
    return this;
  }

  withSelection(selected: boolean): this {
    this.selected = selected;
    return this;
  }

  withInteractivity(options: {
    draggable?: boolean;
    selectable?: boolean;
    connectable?: boolean;
    deletable?: boolean;
    focusable?: boolean;
  }): this {
    if (options.draggable !== undefined) this.draggable = options.draggable;
    if (options.selectable !== undefined) this.selectable = options.selectable;
    if (options.connectable !== undefined) this.connectable = options.connectable;
    if (options.deletable !== undefined) this.deletable = options.deletable;
    if (options.focusable !== undefined) this.focusable = options.focusable;
    return this;
  }

  withVisibility(hidden: boolean): this {
    this.hidden = hidden;
    return this;
  }

  withZIndex(zIndex: number): this {
    this.zIndex = zIndex;
    return this;
  }

  withHandlePositions(sourcePosition?: Position, targetPosition?: Position): this {
    this.sourcePosition = sourcePosition;
    this.targetPosition = targetPosition;
    return this;
  }

  build(): Node<T> {
    const node = NodeFactory.create<T>(
      this.type,
      this.id,
      this.position,
      this.data as T,
      this.customization
    );

    // Add additional properties
    if (this.width !== undefined) node.width = this.width;
    if (this.height !== undefined) node.height = this.height;
    if (this.parentId !== undefined) node.parentId = this.parentId;
    if (this.extent !== undefined) node.extent = this.extent;
    if (this.expandParent !== undefined) node.expandParent = this.expandParent;
    if (this.selected !== undefined) node.selected = this.selected;
    if (this.draggable !== undefined) node.draggable = this.draggable;
    if (this.selectable !== undefined) node.selectable = this.selectable;
    if (this.connectable !== undefined) node.connectable = this.connectable;
    if (this.deletable !== undefined) node.deletable = this.deletable;
    if (this.focusable !== undefined) node.focusable = this.focusable;
    if (this.hidden !== undefined) node.hidden = this.hidden;
    if (this.zIndex !== undefined) node.zIndex = this.zIndex;
    if (this.sourcePosition !== undefined) node.sourcePosition = this.sourcePosition;
    if (this.targetPosition !== undefined) node.targetPosition = this.targetPosition;

    return node;
  }
}
