/**
 * Layout Applier Component
 * 
 * Component that applies layout algorithms to the flow
 */

import { useEffect } from 'react';
import { useAutoLayout } from '../hooks/useAutoLayout';
import type { LayoutStrategyName, LayoutOptions } from '../organisms/FlowTypes';
import type { Node, Edge } from '@xyflow/react';

export interface LayoutApplierProps {
  strategy: LayoutStrategyName | null;
  nodes: Node[];
  edges: Edge[];
  options?: LayoutOptions;
  shouldApply?: boolean;
  onLayoutApplied?: () => void;
}

/**
 * Layout Applier Component
 * 
 * Applies layout algorithm when shouldApply is true
 * Must be rendered inside FlowCanvas.Root to access ReactFlow context
 */
export function LayoutApplier({
  strategy,
  nodes,
  edges,
  options,
  shouldApply = false,
  onLayoutApplied,
}: LayoutApplierProps) {
  const { applyLayout } = useAutoLayout(strategy || 'dagre');

  useEffect(() => {
    if (shouldApply && strategy && nodes.length > 0) {
      // Small delay to ensure ReactFlow is ready
      const timeoutId = setTimeout(() => {
        applyLayout(nodes, edges, options)
          .then(() => {
            onLayoutApplied?.();
          })
          .catch((error) => {
            console.error('Failed to apply layout:', error);
            // Could emit an error event here for parent to handle
          });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [shouldApply, strategy, applyLayout, nodes, edges, options, onLayoutApplied]);

  return null;
}
