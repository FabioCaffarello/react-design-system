/**
 * useFlowActions Hook
 * 
 * Hook that uses React Flow's useReactFlow to provide actions.
 */

import { useReactFlow } from '@xyflow/react';
import type { FitViewOptions, ReactFlowJsonObject } from '@xyflow/react';

/**
 * Hook for flow actions
 * 
 * Provides actions for manipulating the flow (zoom, pan, fit view, etc.)
 */
export function useFlowActions() {
  const reactFlowInstance = useReactFlow();
  
  return {
    // Viewport actions
    fitView: (options?: FitViewOptions) => {
      reactFlowInstance.fitView(options);
    },
    zoomIn: () => {
      reactFlowInstance.zoomIn();
    },
    zoomOut: () => {
      reactFlowInstance.zoomOut();
    },
    zoomTo: (zoomLevel: number) => {
      reactFlowInstance.setZoom(zoomLevel);
    },
    panTo: (x: number, y: number) => {
      reactFlowInstance.setCenter(x, y);
    },
    
    // Get viewport
    getViewport: () => {
      return reactFlowInstance.getViewport();
    },
    
    // Export/Import
    exportToJSON: (): ReactFlowJsonObject => {
      return reactFlowInstance.toObject();
    },
    importFromJSON: (json: ReactFlowJsonObject) => {
      const { x = 0, y = 0, zoom = 1 } = json.viewport || {};
      reactFlowInstance.setNodes(json.nodes || []);
      reactFlowInstance.setEdges(json.edges || []);
      reactFlowInstance.setViewport({ x, y, zoom });
    },
    
    // Node/Edge queries
    getNode: (nodeId: string) => {
      return reactFlowInstance.getNode(nodeId);
    },
    getNodes: () => {
      return reactFlowInstance.getNodes();
    },
    getEdge: (edgeId: string) => {
      return reactFlowInstance.getEdges().find((e) => e.id === edgeId);
    },
    getEdges: () => {
      return reactFlowInstance.getEdges();
    },
    
    // React Flow instance (for advanced usage)
    reactFlowInstance,
  };
}
