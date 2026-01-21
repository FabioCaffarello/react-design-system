/**
 * Edge Builder
 * 
 * Builder pattern for fluent edge construction.
 */

import type { Edge, MarkerType } from '@xyflow/react';
import type { FlowEdgeData, EdgeCustomization } from '../../organisms/FlowTypes';
import { EdgeFactory } from '../../utils/edgeFactory';

/**
 * Edge Builder
 * 
 * Fluent builder for creating edges with method chaining.
 */
export class EdgeBuilder<T extends FlowEdgeData = FlowEdgeData> {
  private id?: string;
  private source: string;
  private target: string;
  private type: string;
  private sourceHandle?: string;
  private targetHandle?: string;
  private data: Partial<T>;
  private customization?: EdgeCustomization;
  private animated?: boolean;
  private selected?: boolean;
  private hidden?: boolean;
  private deletable?: boolean;
  private focusable?: boolean;
  private selectable?: boolean;
  private zIndex?: number;
  private markerStart?: { type: MarkerType; color?: string; width?: number; height?: number };
  private markerEnd?: { type: MarkerType; color?: string; width?: number; height?: number };
  private style?: React.CSSProperties;
  private className?: string;
  private label?: string | React.ReactNode;
  private labelStyle?: React.CSSProperties;
  private labelBgStyle?: React.CSSProperties;
  private labelBgPadding?: [number, number];
  private labelBgBorderRadius?: number;
  private labelShowBg?: boolean;

  constructor(source: string, target: string) {
    this.source = source;
    this.target = target;
    this.type = 'default';
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

  withHandles(sourceHandle?: string, targetHandle?: string): this {
    this.sourceHandle = sourceHandle;
    this.targetHandle = targetHandle;
    return this;
  }

  withData(data: Partial<T>): this {
    this.data = { ...this.data, ...data };
    return this;
  }

  withLabel(label: string | React.ReactNode): this {
    this.label = label;
    this.data.label = label as unknown;
    return this;
  }

  withLabelStyle(style: React.CSSProperties): this {
    this.labelStyle = style;
    return this;
  }

  withLabelBackground(options: {
    style?: React.CSSProperties;
    padding?: [number, number];
    borderRadius?: number;
    show?: boolean;
  }): this {
    if (options.style) this.labelBgStyle = options.style;
    if (options.padding) this.labelBgPadding = options.padding;
    if (options.borderRadius) this.labelBgBorderRadius = options.borderRadius;
    if (options.show !== undefined) this.labelShowBg = options.show;
    return this;
  }

  withAnimated(animated: boolean = true): this {
    this.animated = animated;
    this.data.animated = animated as unknown;
    return this;
  }

  withStyle(style: React.CSSProperties): this {
    this.style = style;
    return this;
  }

  withClassName(className: string): this {
    this.className = className;
    return this;
  }

  withMarkerStart(type: MarkerType, options?: { color?: string; width?: number; height?: number }): this {
    this.markerStart = { type, ...options };
    return this;
  }

  withMarkerEnd(type: MarkerType, options?: { color?: string; width?: number; height?: number }): this {
    this.markerEnd = { type, ...options };
    return this;
  }

  withCustomization(customization: EdgeCustomization): this {
    this.customization = customization;
    return this;
  }

  withSelection(selected: boolean): this {
    this.selected = selected;
    return this;
  }

  withInteractivity(options: {
    selectable?: boolean;
    deletable?: boolean;
    focusable?: boolean;
  }): this {
    if (options.selectable !== undefined) this.selectable = options.selectable;
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

  build(): Edge<T> {
    const edge = EdgeFactory.create<T>(
      this.source,
      this.target,
      this.id,
      this.type,
      this.data as T,
      this.customization
    );

    // Add additional properties
    if (this.sourceHandle !== undefined) edge.sourceHandle = this.sourceHandle;
    if (this.targetHandle !== undefined) edge.targetHandle = this.targetHandle;
    if (this.animated !== undefined) edge.animated = this.animated;
    if (this.selected !== undefined) edge.selected = this.selected;
    if (this.hidden !== undefined) edge.hidden = this.hidden;
    if (this.deletable !== undefined) edge.deletable = this.deletable;
    if (this.focusable !== undefined) edge.focusable = this.focusable;
    if (this.selectable !== undefined) edge.selectable = this.selectable;
    if (this.zIndex !== undefined) edge.zIndex = this.zIndex;
    if (this.markerStart !== undefined) edge.markerStart = this.markerStart;
    if (this.markerEnd !== undefined) edge.markerEnd = this.markerEnd;
    if (this.style !== undefined) edge.style = this.style;
    if (this.className !== undefined) edge.className = this.className;
    if (this.label !== undefined) edge.label = this.label;
    if (this.labelStyle !== undefined) edge.labelStyle = this.labelStyle;
    if (this.labelBgStyle !== undefined) edge.labelBgStyle = this.labelBgStyle;
    if (this.labelBgPadding !== undefined) edge.labelBgPadding = this.labelBgPadding;
    if (this.labelBgBorderRadius !== undefined) edge.labelBgBorderRadius = this.labelBgBorderRadius;
    if (this.labelShowBg !== undefined) edge.labelShowBg = this.labelShowBg;

    return edge;
  }
}
