/**
 * useFlowSelection Hook
 * 
 * Hook for advanced selection management.
 */

import { useCallback, useMemo } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';

/**
 * Flow Selection Hook Return
 */
export interface UseFlowSelectionReturn {
  // Selection state
  selectedNodes: Node<FlowNodeData>[];
  selectedEdges: Edge<FlowEdgeData>[];
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  hasSelection: boolean;
  selectionCount: number;
  
  // Selection operations
  selectNode: (nodeId: string, addToSelection?: boolean) => void;
  selectNodes: (nodeIds: string[], addToSelection?: boolean) => void;
  deselectNode: (nodeId: string) => void;
  deselectAllNodes: () => void;
  
  selectEdge: (edgeId: string, addToSelection?: boolean) => void;
  selectEdges: (edgeIds: string[], addToSelection?: boolean) => void;
  deselectEdge: (edgeId: string) => void;
  deselectAllEdges: () => void;
  
  selectAll: () => void;
  deselectAll: () => void;
  
  // Selection queries
  isNodeSelected: (nodeId: string) => boolean;
  isEdgeSelected: (edgeId: string) => boolean;
  getSelectedNode: (nodeId: string) => Node<FlowNodeData> | undefined;
  getSelectedEdge: (edgeId: string) => Edge<FlowEdgeData> | undefined;
}

/**
 * Hook for advanced selection management
 */
export function useFlowSelection(): UseFlowSelectionReturn {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  
  // Get selected nodes and edges
  const selectedNodes = useMemo(() => {
    return getNodes().filter((n) => n.selected) as Node<FlowNodeData>[];
  }, [getNodes]);
  
  const selectedEdges = useMemo(() => {
    return getEdges().filter((e) => e.selected) as Edge<FlowEdgeData>[];
  }, [getEdges]);
  
  const selectedNodeIds = useMemo(() => {
    return selectedNodes.map((n) => n.id);
  }, [selectedNodes]);
  
  const selectedEdgeIds = useMemo(() => {
    return selectedEdges.map((e) => e.id);
  }, [selectedEdges]);
  
  const hasSelection = useMemo(() => {
    return selectedNodes.length > 0 || selectedEdges.length > 0;
  }, [selectedNodes.length, selectedEdges.length]);
  
  const selectionCount = useMemo(() => {
    return selectedNodes.length + selectedEdges.length;
  }, [selectedNodes.length, selectedEdges.length]);
  
  // Select node
  const selectNode = useCallback((nodeId: string, addToSelection: boolean = false) => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: addToSelection
          ? node.id === nodeId || node.selected
          : node.id === nodeId,
      }))
    );
  }, [setNodes]);
  
  // Select multiple nodes
  const selectNodes = useCallback((nodeIds: string[], addToSelection: boolean = false) => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: addToSelection
          ? nodeIds.includes(node.id) || node.selected
          : nodeIds.includes(node.id),
      }))
    );
  }, [setNodes]);
  
  // Deselect node
  const deselectNode = useCallback((nodeId: string) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === nodeId ? { ...node, selected: false } : node))
    );
  }, [setNodes]);
  
  // Deselect all nodes
  const deselectAllNodes = useCallback(() => {
    setNodes((nds) => nds.map((node) => ({ ...node, selected: false })));
  }, [setNodes]);
  
  // Select edge
  const selectEdge = useCallback((edgeId: string, addToSelection: boolean = false) => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        selected: addToSelection
          ? edge.id === edgeId || edge.selected
          : edge.id === edgeId,
      }))
    );
  }, [setEdges]);
  
  // Select multiple edges
  const selectEdges = useCallback((edgeIds: string[], addToSelection: boolean = false) => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        selected: addToSelection
          ? edgeIds.includes(edge.id) || edge.selected
          : edgeIds.includes(edge.id),
      }))
    );
  }, [setEdges]);
  
  // Deselect edge
  const deselectEdge = useCallback((edgeId: string) => {
    setEdges((eds) =>
      eds.map((edge) => (edge.id === edgeId ? { ...edge, selected: false } : edge))
    );
  }, [setEdges]);
  
  // Deselect all edges
  const deselectAllEdges = useCallback(() => {
    setEdges((eds) => eds.map((edge) => ({ ...edge, selected: false })));
  }, [setEdges]);
  
  // Select all
  const selectAll = useCallback(() => {
    setNodes((nds) => nds.map((node) => ({ ...node, selected: true })));
    setEdges((eds) => eds.map((edge) => ({ ...edge, selected: true })));
  }, [setNodes, setEdges]);
  
  // Deselect all
  const deselectAll = useCallback(() => {
    deselectAllNodes();
    deselectAllEdges();
  }, [deselectAllNodes, deselectAllEdges]);
  
  // Selection queries
  const isNodeSelected = useCallback((nodeId: string): boolean => {
    return selectedNodeIds.includes(nodeId);
  }, [selectedNodeIds]);
  
  const isEdgeSelected = useCallback((edgeId: string): boolean => {
    return selectedEdgeIds.includes(edgeId);
  }, [selectedEdgeIds]);
  
  const getSelectedNode = useCallback((nodeId: string): Node<FlowNodeData> | undefined => {
    return selectedNodes.find((n) => n.id === nodeId);
  }, [selectedNodes]);
  
  const getSelectedEdge = useCallback((edgeId: string): Edge<FlowEdgeData> | undefined => {
    return selectedEdges.find((e) => e.id === edgeId);
  }, [selectedEdges]);
  
  return {
    selectedNodes,
    selectedEdges,
    selectedNodeIds,
    selectedEdgeIds,
    hasSelection,
    selectionCount,
    selectNode,
    selectNodes,
    deselectNode,
    deselectAllNodes,
    selectEdge,
    selectEdges,
    deselectEdge,
    deselectAllEdges,
    selectAll,
    deselectAll,
    isNodeSelected,
    isEdgeSelected,
    getSelectedNode,
    getSelectedEdge,
  };
}
