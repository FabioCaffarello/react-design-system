/**
 * useFlowState Hook
 * 
 * Hook that uses React Flow's native hooks (useNodesState, useEdgesState)
 * and adds design system functionality.
 */

import { useCallback } from 'react';
import { useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { useFlowContext } from '../organisms/FlowContext';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';

/**
 * Hook for managing flow state
 * 
 * Uses React Flow's native hooks and adds design system methods.
 */
export function useFlowState<
  TNodeData extends FlowNodeData = FlowNodeData,
  TEdgeData extends FlowEdgeData = FlowEdgeData
>(
  initialNodes?: Node<TNodeData>[],
  initialEdges?: Edge<TEdgeData>[]
) {
  // Use React Flow's native hooks
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges || []);
  const reactFlowInstance = useReactFlow();
  
  // Get context for additional functionality
  const context = useFlowContext<TNodeData, TEdgeData>();
  
  // Additional methods
  const addNode = useCallback((node: Node<TNodeData>) => {
    setNodes((prev) => [...prev, node]);
    context.onNodeAdd?.(node);
  }, [setNodes, context]);
  
  const removeNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    context.onNodeRemove?.(nodeId);
  }, [setNodes, context]);
  
  const updateNode = useCallback((nodeId: string, data: Partial<TNodeData>) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } as TNodeData }
          : node
      )
    );
    context.onNodeUpdate?.(nodeId, data);
  }, [setNodes, context]);
  
  const addEdge = useCallback((edge: Edge<TEdgeData>) => {
    setEdges((prev) => [...prev, edge]);
    context.onEdgeAdd?.(edge);
  }, [setEdges, context]);
  
  const removeEdge = useCallback((edgeId: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
    context.onEdgeRemove?.(edgeId);
  }, [setEdges, context]);
  
  const updateEdge = useCallback((edgeId: string, data: Partial<TEdgeData>) => {
    setEdges((prev) =>
      prev.map((edge) =>
        edge.id === edgeId
          ? { ...edge, data: { ...edge.data, ...data } as TEdgeData }
          : edge
      )
    );
    context.onEdgeUpdate?.(edgeId, data);
  }, [setEdges, context]);
  
  return {
    // State
    nodes: nodes as Node<TNodeData>[],
    edges: edges as Edge<TEdgeData>[],
    
    // Setters
    setNodes,
    setEdges,
    
    // Change handlers
    onNodesChange,
    onEdgesChange,
    
    // React Flow instance
    reactFlowInstance,
    
    // Additional methods
    addNode,
    removeNode,
    updateNode,
    addEdge,
    removeEdge,
    updateEdge,
  };
}
