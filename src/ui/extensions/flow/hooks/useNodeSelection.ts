/**
 * useNodeSelection Hook
 * 
 * Hook for managing node selection using React Flow's useOnSelectionChange.
 */

import { useState } from 'react';
import { useOnSelectionChange } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';

/**
 * Hook for node selection
 * 
 * Tracks selected nodes and edges using React Flow's native hook.
 */
export function useNodeSelection() {
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);
  
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNodes(nodes);
      setSelectedEdges(edges);
    },
  });
  
  return {
    selectedNodes,
    selectedEdges,
    hasSelection: selectedNodes.length > 0 || selectedEdges.length > 0,
    selectedNodeIds: selectedNodes.map((n) => n.id),
    selectedEdgeIds: selectedEdges.map((e) => e.id),
  };
}
