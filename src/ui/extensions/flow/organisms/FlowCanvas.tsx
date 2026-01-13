'use client';

import React, { useMemo, useCallback } from 'react';
import { ReactFlow, type ReactFlowProps, type ReactFlowInstance, MarkerType } from '@xyflow/react';
import { useFlowContext } from './FlowContext';
import { NodeTypeRegistry } from '../utils/nodeTypes';
import { EdgeTypeRegistry } from '../utils/edgeTypes';
import { FlowBackground } from './FlowBackground';
import { FlowControls } from './FlowControls';
import { FlowMinimap } from './FlowMinimap';
import { FlowPanel } from './FlowPanel';

/**
 * FlowCanvasRoot Component
 * 
 * Root component that wraps ReactFlow with design system integration.
 * Single Responsibility: Render ReactFlow with design system configuration.
 * 
 * Features:
 * - Memoized nodeTypes and edgeTypes for performance
 * - Theme support
 * - Prop filtering to prevent React warnings
 */
export interface FlowCanvasRootProps extends Omit<ReactFlowProps, 'nodes' | 'edges' | 'nodeTypes' | 'edgeTypes'> {
  nodeTypes?: ReactFlowProps['nodeTypes'];
  edgeTypes?: ReactFlowProps['edgeTypes'];
  className?: string;
  /**
   * Custom connection line component
   */
  connectionLineComponent?: ReactFlowProps['connectionLineComponent'];
  /**
   * Default edge options (applied to all new edges)
   */
  defaultEdgeOptions?: ReactFlowProps['defaultEdgeOptions'];
  /**
   * Node origin for better positioning (default: [0, 0])
   */
  nodeOrigin?: [number, number];
  /**
   * Enable snap to grid
   */
  snapToGrid?: boolean;
  /**
   * Grid size for snapping [x, y]
   */
  snapGrid?: [number, number];
  /**
   * Only render visible elements for performance (useful for large flows)
   * @default true
   */
  onlyRenderVisibleElements?: boolean;
}

export const FlowCanvasRoot = React.memo(function FlowCanvasRoot({
  nodeTypes,
  edgeTypes,
  className = '',
  children,
  connectionLineComponent,
  defaultEdgeOptions,
  nodeOrigin = [0, 0],
  snapToGrid = false,
  snapGrid = [16, 16],
  onlyRenderVisibleElements = true, // Default to true for better performance
  ...props
}: FlowCanvasRootProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setReactFlowInstance,
    theme,
  } = useFlowContext();
  
  // Memoize nodeTypes and edgeTypes to prevent unnecessary re-renders
  // Merge provided nodeTypes with registry defaults
  const finalNodeTypes = useMemo(() => {
    try {
      const registryTypes = NodeTypeRegistry.getAll();
      return nodeTypes ? { ...registryTypes, ...nodeTypes } : registryTypes;
    } catch (error) {
      console.error('Error getting node types:', error);
      return nodeTypes || {};
    }
  }, [nodeTypes]);

  const finalEdgeTypes = useMemo(() => {
    try {
      return edgeTypes || EdgeTypeRegistry.getAll();
    } catch (error) {
      console.error('Error getting edge types:', error);
      return {};
    }
  }, [edgeTypes]);
  
  // Memoize default edge options
  const memoizedDefaultEdgeOptions = useMemo(() => {
    return defaultEdgeOptions || {
      type: 'default',
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
  }, [defaultEdgeOptions]);
  
  // Memoize theme-based classes
  const canvasClasses = useMemo(() => {
    return `
      ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
      ${className}
    `.trim().replace(/\s+/g, ' ');
  }, [theme, className]);

  // Filter out any invalid props that might cause React warnings
  // ReactFlow should handle all valid ReactFlowProps, but we ensure
  // no unexpected props are passed
  const {
    // Extract any props that ReactFlow doesn't expect
    // These should be filtered out if they exist
    ...restProps
  } = props;
  
  // Handle onInit to set instance and optionally apply fitView
  // Note: fitView is not a ReactFlow prop, it's a method on the instance
  // We check for it in restProps but it won't be passed to ReactFlow
  const { fitView, fitViewOptions, ...reactFlowProps } = restProps;
  
  const handleInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
    // Apply fitView if configured (fitView is a boolean flag we check)
    if (fitView) {
      // Use longer timeout to ensure nodes are rendered
      setTimeout(() => {
        instance.fitView(fitViewOptions || { padding: 0.2, duration: 400 });
      }, 300);
    }
  }, [setReactFlowInstance, fitView, fitViewOptions]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={handleInit}
      nodeTypes={finalNodeTypes}
      edgeTypes={finalEdgeTypes}
      className={canvasClasses}
      connectionLineComponent={connectionLineComponent}
      defaultEdgeOptions={memoizedDefaultEdgeOptions}
      nodeOrigin={nodeOrigin}
      snapToGrid={snapToGrid}
      snapGrid={snapGrid}
      onlyRenderVisibleElements={onlyRenderVisibleElements}
      aria-label="Flow diagram canvas"
      role="application"
      {...reactFlowProps}
    >
      {children}
    </ReactFlow>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memoization
  // Only re-render if critical props change
  return (
    prevProps.nodeTypes === nextProps.nodeTypes &&
    prevProps.edgeTypes === nextProps.edgeTypes &&
    prevProps.className === nextProps.className &&
    prevProps.connectionLineComponent === nextProps.connectionLineComponent &&
    prevProps.defaultEdgeOptions === nextProps.defaultEdgeOptions &&
    prevProps.nodeOrigin === nextProps.nodeOrigin &&
    prevProps.snapToGrid === nextProps.snapToGrid &&
    prevProps.onlyRenderVisibleElements === nextProps.onlyRenderVisibleElements
  );
});

/**
 * FlowCanvas Compound Component
 * 
 * Provides a hierarchical structure of components following compound components pattern.
 */
export const FlowCanvas = {
  Root: FlowCanvasRoot,
  Background: FlowBackground,
  Controls: FlowControls,
  Minimap: FlowMinimap,
  Panel: FlowPanel,
};
