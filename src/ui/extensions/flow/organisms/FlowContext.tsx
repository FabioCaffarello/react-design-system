'use client';

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  ReactFlowInstance,
} from '@xyflow/react';
import type {
  FlowNodeData,
  FlowEdgeData,
  ValidationRule,
  ConnectionRule,
  LayoutStrategyName,
  LayoutOptions,
} from './FlowTypes';

/**
 * Flow Context Value
 * 
 * Context that complements ReactFlowProvider with design system specific
 * functionality. This does NOT replace ReactFlowProvider.
 */
export interface FlowContextValue<
  TNodeData extends FlowNodeData = FlowNodeData,
  TEdgeData extends FlowEdgeData = FlowEdgeData
> {
  // Data
  nodes: Node<TNodeData>[];
  edges: Edge<TEdgeData>[];
  
  // React Flow Instance
  reactFlowInstance: ReactFlowInstance | null;
  setReactFlowInstance: (instance: ReactFlowInstance | null) => void;
  
  // State management
  setNodes: (nodes: Node<TNodeData>[] | ((prev: Node<TNodeData>[]) => Node<TNodeData>[])) => void;
  setEdges: (edges: Edge<TEdgeData>[] | ((prev: Edge<TEdgeData>[]) => Edge<TEdgeData>[])) => void;
  
  // Change handlers
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: (connection: Connection) => void;
  
  // Validation
  validationRules: ValidationRule[];
  connectionRules: ConnectionRule[];
  addValidationRule: (rule: ValidationRule) => void;
  removeValidationRule: (id: string) => void;
  addConnectionRule: (rule: ConnectionRule) => void;
  removeConnectionRule: (id: string) => void;
  
  // Layout
  layoutStrategy: LayoutStrategyName | null;
  setLayoutStrategy: (strategy: LayoutStrategyName | null) => void;
  layoutOptions: LayoutOptions;
  setLayoutOptions: (options: LayoutOptions) => void;
  
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Callbacks
  onNodeAdd?: (node: Node<TNodeData>) => void;
  onNodeRemove?: (nodeId: string) => void;
  onNodeUpdate?: (nodeId: string, data: Partial<TNodeData>) => void;
  onEdgeAdd?: (edge: Edge<TEdgeData>) => void;
  onEdgeRemove?: (edgeId: string) => void;
  onEdgeUpdate?: (edgeId: string, data: Partial<TEdgeData>) => void;
}

const FlowContext = createContext<FlowContextValue | undefined>(undefined);

/**
 * Hook to access Flow context
 * 
 * @throws Error if used outside of FlowProvider
 */
export function useFlowContext<
  TNodeData extends FlowNodeData = FlowNodeData,
  TEdgeData extends FlowEdgeData = FlowEdgeData
>(): FlowContextValue<TNodeData, TEdgeData> {
  const context = useContext(FlowContext);
  
  if (context === undefined) {
    throw new Error('useFlowContext must be used within a FlowProvider');
  }
  
  return context as unknown as FlowContextValue<TNodeData, TEdgeData>;
}

/**
 * Hook to access Flow context (optional, returns undefined if not in FlowProvider)
 */
export function useFlowContextOptional<
  TNodeData extends FlowNodeData = FlowNodeData,
  TEdgeData extends FlowEdgeData = FlowEdgeData
>(): FlowContextValue<TNodeData, TEdgeData> | undefined {
  const context = useContext(FlowContext);
  return context ? (context as unknown as FlowContextValue<TNodeData, TEdgeData>) : undefined;
}

export { FlowContext };
