/**
 * useFlowUtils Hook
 * 
 * Hook for Flow utility functions (geometry, helpers, etc.).
 */

import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { Node, Edge, XYPosition, Position, InternalNode } from '@xyflow/react';
import { getEdgeParams as getEdgeParamsUtil } from '../utils/geometryUtils';

/**
 * Flow Utils Hook Return
 */
export interface UseFlowUtilsReturn {
  // Geometry utilities
  getEdgeParams: (source: InternalNode, target: InternalNode) => {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    sourcePos: Position;
    targetPos: Position;
  };
  screenToFlowPosition: (screenPosition: XYPosition) => XYPosition;
  flowToScreenPosition: (flowPosition: XYPosition) => XYPosition;
  
  // Node utilities
  getNodeById: (nodeId: string) => Node | undefined;
  getNodesByType: (type: string) => Node[];
  getConnectedNodes: (nodeId: string) => Node[];
  
  // Edge utilities
  getEdgeById: (edgeId: string) => Edge | undefined;
  getEdgesByType: (type: string) => Edge[];
  getEdgesForNode: (nodeId: string) => Edge[];
  
  // Flow utilities
  fitView: (options?: { padding?: number; duration?: number }) => void;
  zoomTo: (zoomLevel: number) => void;
  panTo: (position: XYPosition) => void;
  getViewport: () => { x: number; y: number; zoom: number };
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
}

/**
 * Hook for Flow utility functions
 */
export function useFlowUtils(): UseFlowUtilsReturn {
  const reactFlowInstance = useReactFlow();
  const { getNodes, getEdges, screenToFlowPosition: screenToFlow, flowToScreenPosition: flowToScreen, getViewport: getViewportUtil, setViewport: setViewportUtil } = reactFlowInstance;
  
  // Geometry utilities
  const getEdgeParams = useCallback((source: InternalNode, target: InternalNode) => {
    return getEdgeParamsUtil(source, target);
  }, []);
  
  const screenToFlowPosition = useCallback((screenPosition: XYPosition): XYPosition => {
    return screenToFlow(screenPosition);
  }, [screenToFlow]);
  
  const flowToScreenPosition = useCallback((flowPosition: XYPosition): XYPosition => {
    return flowToScreen(flowPosition);
  }, [flowToScreen]);
  
  // Node utilities
  const getNodeById = useCallback((nodeId: string): Node | undefined => {
    return getNodes().find((n) => n.id === nodeId);
  }, [getNodes]);
  
  const getNodesByType = useCallback((type: string): Node[] => {
    return getNodes().filter((n) => n.type === type);
  }, [getNodes]);
  
  const getConnectedNodes = useCallback((nodeId: string): Node[] => {
    const edges = getEdges();
    const connectedNodeIds = new Set<string>();
    
    edges.forEach((edge) => {
      if (edge.source === nodeId) {
        connectedNodeIds.add(edge.target);
      }
      if (edge.target === nodeId) {
        connectedNodeIds.add(edge.source);
      }
    });
    
    return getNodes().filter((n) => connectedNodeIds.has(n.id));
  }, [getNodes, getEdges]);
  
  // Edge utilities
  const getEdgeById = useCallback((edgeId: string): Edge | undefined => {
    return getEdges().find((e) => e.id === edgeId);
  }, [getEdges]);
  
  const getEdgesByType = useCallback((type: string): Edge[] => {
    return getEdges().filter((e) => e.type === type);
  }, [getEdges]);
  
  const getEdgesForNode = useCallback((nodeId: string): Edge[] => {
    return getEdges().filter((e) => e.source === nodeId || e.target === nodeId);
  }, [getEdges]);
  
  // Flow utilities
  const fitView = useCallback((options?: { padding?: number; duration?: number }) => {
    reactFlowInstance.fitView(options);
  }, [reactFlowInstance]);
  
  const zoomTo = useCallback((zoomLevel: number) => {
    reactFlowInstance.zoomTo(zoomLevel);
  }, [reactFlowInstance]);
  
  const panTo = useCallback((position: XYPosition) => {
    reactFlowInstance.setCenter(position.x, position.y);
  }, [reactFlowInstance]);
  
  const getViewport = useCallback(() => {
    return getViewportUtil();
  }, [getViewportUtil]);
  
  const setViewport = useCallback((viewport: { x: number; y: number; zoom: number }) => {
    setViewportUtil(viewport);
  }, [setViewportUtil]);
  
  return {
    getEdgeParams,
    screenToFlowPosition,
    flowToScreenPosition,
    getNodeById,
    getNodesByType,
    getConnectedNodes,
    getEdgeById,
    getEdgesByType,
    getEdgesForNode,
    fitView,
    zoomTo,
    panTo,
    getViewport,
    setViewport,
  };
}
