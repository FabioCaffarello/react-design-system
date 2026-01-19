/**
 * Flow Debug Provider
 * 
 * Provider for debug tools and DevTools integration.
 * Only available in development mode.
 */

'use client';

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';

/**
 * Debug State
 */
export interface DebugState {
  enabled: boolean;
  showNodeIds: boolean;
  showEdgeIds: boolean;
  showNodeData: boolean;
  showEdgeData: boolean;
  showMetrics: boolean;
  highlightSelected: boolean;
  logEvents: boolean;
}

/**
 * Flow Debug Context Value
 */
export interface FlowDebugContextValue {
  // Debug state
  debugState: DebugState;
  setDebugState: (state: Partial<DebugState>) => void;
  toggleDebug: () => void;
  
  // Inspection
  inspectNode: (nodeId: string) => Node<FlowNodeData> | undefined;
  inspectEdge: (edgeId: string) => Edge<FlowEdgeData> | undefined;
  getNodeData: (nodeId: string) => FlowNodeData | undefined;
  getEdgeData: (edgeId: string) => FlowEdgeData | undefined;
  
  // State inspection
  getStateSnapshot: () => {
    nodes: Node<FlowNodeData>[];
    edges: Edge<FlowEdgeData>[];
    timestamp: number;
  };
  
  // DevTools
  exportState: () => string;
  importState: (json: string) => void;
}

const FlowDebugContext = createContext<FlowDebugContextValue | undefined>(undefined);

/**
 * Hook to access Flow Debug context
 */
export function useFlowDebugContext(): FlowDebugContextValue {
  const context = useContext(FlowDebugContext);
  if (context === undefined) {
    throw new Error('useFlowDebugContext must be used within FlowDebugProvider');
  }
  return context;
}

/**
 * Flow Debug Provider Props
 */
export interface FlowDebugProviderProps {
  children: ReactNode;
  nodes: Node<FlowNodeData>[];
  edges: Edge<FlowEdgeData>[];
  initialDebugState?: Partial<DebugState>;
  enabled?: boolean; // Only enable in development
}

/**
 * Flow Debug Provider
 * 
 * Provides debug tools and DevTools integration.
 * Only works in development mode.
 */
export function FlowDebugProvider({
  children,
  nodes,
  edges,
  initialDebugState = {},
  enabled = process.env.NODE_ENV === 'development',
}: FlowDebugProviderProps) {
  const [debugState, setDebugStateState] = useState<DebugState>({
    enabled: enabled && (initialDebugState.enabled ?? false),
    showNodeIds: initialDebugState.showNodeIds ?? false,
    showEdgeIds: initialDebugState.showEdgeIds ?? false,
    showNodeData: initialDebugState.showNodeData ?? false,
    showEdgeData: initialDebugState.showEdgeData ?? false,
    showMetrics: initialDebugState.showMetrics ?? false,
    highlightSelected: initialDebugState.highlightSelected ?? true,
    logEvents: initialDebugState.logEvents ?? false,
  });
  
  // Set debug state
  const setDebugState = useCallback((state: Partial<DebugState>) => {
    setDebugStateState((prev) => ({ ...prev, ...state }));
  }, []);
  
  // Toggle debug
  const toggleDebug = useCallback(() => {
    setDebugStateState((prev) => ({ ...prev, enabled: !prev.enabled }));
  }, []);
  
  // Inspect node
  const inspectNode = useCallback((nodeId: string): Node<FlowNodeData> | undefined => {
    return nodes.find((n) => n.id === nodeId);
  }, [nodes]);
  
  // Inspect edge
  const inspectEdge = useCallback((edgeId: string): Edge<FlowEdgeData> | undefined => {
    return edges.find((e) => e.id === edgeId);
  }, [edges]);
  
  // Get node data
  const getNodeData = useCallback((nodeId: string): FlowNodeData | undefined => {
    const node = inspectNode(nodeId);
    return node?.data;
  }, [inspectNode]);
  
  // Get edge data
  const getEdgeData = useCallback((edgeId: string): FlowEdgeData | undefined => {
    const edge = inspectEdge(edgeId);
    return edge?.data;
  }, [inspectEdge]);
  
  // Get state snapshot
  const getStateSnapshot = useCallback(() => {
    return {
      nodes: [...nodes],
      edges: [...edges],
      timestamp: Date.now(),
    };
  }, [nodes, edges]);
  
  // Export state
  const exportState = useCallback((): string => {
    const snapshot = getStateSnapshot();
    return JSON.stringify(snapshot, null, 2);
  }, [getStateSnapshot]);
  
  // Import state
  const importState = useCallback((json: string): void => {
    try {
      const state = JSON.parse(json);
      // Note: This would need to be integrated with FlowProvider to actually set state
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('Imported state:', state);
      }
    } catch (error) {
      console.error('Failed to import state:', error);
    }
  }, []);
  
  const contextValue = useMemo<FlowDebugContextValue>(() => ({
    debugState,
    setDebugState,
    toggleDebug,
    inspectNode,
    inspectEdge,
    getNodeData,
    getEdgeData,
    getStateSnapshot,
    exportState,
    importState,
  }), [
    debugState,
    setDebugState,
    toggleDebug,
    inspectNode,
    inspectEdge,
    getNodeData,
    getEdgeData,
    getStateSnapshot,
    exportState,
    importState,
  ]);
  
  // Only provide context if enabled
  if (!enabled) {
    return <>{children}</>;
  }
  
  return (
    <FlowDebugContext.Provider value={contextValue}>
      {children}
    </FlowDebugContext.Provider>
  );
}
