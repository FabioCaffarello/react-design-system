'use client';

/**
 * useFlowVirtualization Hook
 * 
 * Hook for viewport-based rendering in very large flows (>1000 nodes).
 */

import { useMemo } from 'react';
import { useViewport } from '@xyflow/react';
import type { Node, Edge, Viewport } from '@xyflow/react';

/**
 * Check if a node is visible in the viewport
 */
function isNodeInViewport(
  node: Node,
  viewport: Viewport,
  padding: number = 100
): boolean {
  const nodeX = node.position.x * viewport.zoom + viewport.x;
  const nodeY = node.position.y * viewport.zoom + viewport.y;
  const nodeWidth = 200; // Approximate node width
  const nodeHeight = 100; // Approximate node height
  
  // Check if node is within viewport bounds (with padding)
  return (
    nodeX + nodeWidth + padding >= 0 &&
    nodeX - padding <= window.innerWidth &&
    nodeY + nodeHeight + padding >= 0 &&
    nodeY - padding <= window.innerHeight
  );
}

/**
 * Check if an edge is visible (at least one endpoint is visible)
 */
function isEdgeInViewport(
  edge: Edge,
  nodes: Node[],
  viewport: Viewport,
  padding: number = 100
): boolean {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);
  
  if (!sourceNode || !targetNode) {
    return false;
  }
  
  return (
    isNodeInViewport(sourceNode, viewport, padding) ||
    isNodeInViewport(targetNode, viewport, padding)
  );
}

/**
 * Hook for flow virtualization
 * 
 * Filters nodes and edges to only those visible in the viewport.
 * Useful for flows with >1000 nodes.
 */
export function useFlowVirtualization(
  nodes: Node[],
  edges: Edge[],
  enabled: boolean = false,
  padding: number = 100
) {
  const viewport = useViewport();
  
  const visibleNodes = useMemo(() => {
    if (!enabled || nodes.length < 1000) {
      return nodes;
    }
    
    return nodes.filter((node) => isNodeInViewport(node, viewport, padding));
  }, [nodes, viewport, enabled, padding]);
  
  const visibleEdges = useMemo(() => {
    if (!enabled || edges.length < 1000) {
      return edges;
    }
    
    return edges.filter((edge) => isEdgeInViewport(edge, nodes, viewport, padding));
  }, [edges, nodes, viewport, enabled, padding]);
  
  return {
    visibleNodes,
    visibleEdges,
    isVirtualized: enabled && (nodes.length >= 1000 || edges.length >= 1000),
  };
}
