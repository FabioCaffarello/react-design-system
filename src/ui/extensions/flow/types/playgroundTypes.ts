/**
 * Playground Types
 * 
 * Type definitions for the advanced Flow Playground
 */

import type { Node, Edge, Viewport, FitViewOptions } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData, LayoutStrategyName, LayoutOptions } from '../organisms/FlowTypes';

/**
 * React Flow Configuration
 * All configurable props for ReactFlow component
 */
export interface ReactFlowConfig {
  // Appearance
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  defaultViewport?: Viewport;
  proOptions?: {
    hideAttribution?: boolean;
  };
  nodeOrigin?: [number, number];
  
  // Interaction
  panOnDrag?: boolean | number[];
  panOnScroll?: boolean;
  zoomOnScroll?: boolean;
  zoomOnPinch?: boolean;
  zoomOnDoubleClick?: boolean;
  selectOnClick?: boolean;
  nodesDraggable?: boolean;
  nodesConnectable?: boolean;
  elementsSelectable?: boolean;
  
  // Keyboard
  deleteKeyCode?: string | null;
  multiSelectKeyCode?: string | null;
  selectionOnDrag?: boolean;
  
  // Zoom
  minZoom?: number;
  maxZoom?: number;
  defaultZoom?: number;
  
  // Other
  snapToGrid?: boolean;
  snapGrid?: [number, number];
  connectionRadius?: number;
  preventScrolling?: boolean;
  onlyRenderVisibleElements?: boolean;
}

/**
 * Background Configuration
 */
export interface BackgroundConfig {
  show: boolean;
  variant: 'dots' | 'lines' | 'cross';
  size: number;
  bgColor?: string;
  patternColor?: string;
}

/**
 * Layout Configuration
 */
export interface LayoutConfig {
  strategy: LayoutStrategyName | null;
  options: LayoutOptions;
}

/**
 * Complete Playground State
 */
export interface PlaygroundState {
  nodes: Node<FlowNodeData>[];
  edges: Edge<FlowEdgeData>[];
  reactFlowConfig: ReactFlowConfig;
  backgroundConfig: BackgroundConfig;
  layoutConfig: LayoutConfig;
  theme: 'light' | 'dark';
}

/**
 * Prop Definition for ReactFlowPropsPanel
 */
export interface PropDefinition {
  key: keyof ReactFlowConfig;
  label: string;
  description: string;
  type: 'boolean' | 'number' | 'string' | 'select' | 'object';
  defaultValue?: unknown;
  options?: Array<{ value: string; label: string }>;
  category: 'appearance' | 'interaction' | 'keyboard' | 'zoom' | 'other';
}
