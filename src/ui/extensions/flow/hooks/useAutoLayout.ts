/**
 * useAutoLayout Hook
 * 
 * Hook for applying automatic layouts to flows.
 */

import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { layoutEngine } from '../utils/layoutEngine';
import type { LayoutStrategyName, LayoutOptions, LayoutResult } from '../organisms/FlowTypes';

/**
 * Hook for automatic layout
 * 
 * Provides methods to apply layouts automatically.
 */
export function useAutoLayout(strategy: LayoutStrategyName = 'dagre') {
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  
  const applyLayout = useCallback(async (
    customNodes?: Node[],
    customEdges?: Edge[],
    options?: LayoutOptions
  ): Promise<LayoutResult> => {
    const nodes = customNodes || getNodes();
    const edges = customEdges || getEdges();
    
    const result = await layoutEngine.calculate(strategy, nodes, edges, options);
    
    // Apply layout to flow
    setNodes(result.nodes);
    setEdges(result.edges);
    
    return result;
  }, [strategy, getNodes, getEdges, setNodes, setEdges]);
  
  const getAvailableStrategies = useCallback(() => {
    return layoutEngine.getAvailableStrategies();
  }, []);
  
  return {
    applyLayout,
    getAvailableStrategies,
    currentStrategy: strategy,
  };
}
