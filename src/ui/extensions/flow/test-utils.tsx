/**
 * Test Utilities for Flow Components
 * 
 * Helper functions and components for testing Flow components
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowProvider } from './organisms/FlowProvider';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from './organisms/FlowTypes';

/**
 * Default mock nodes for tests
 */
export const createMockNodes = (count = 1): Node<FlowNodeData>[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    type: 'default',
    position: { x: i * 100, y: 0 },
    data: { label: `Node ${i + 1}` },
  }));
};

/**
 * Default mock edges for tests
 */
export const createMockEdges = (): Edge<FlowEdgeData>[] => {
  return [];
};

/**
 * Render component with FlowProvider wrapper
 */
export const renderWithFlowProvider = (
  ui: React.ReactElement,
  options?: {
    nodes?: Node<FlowNodeData>[];
    edges?: Edge<FlowEdgeData>[];
  } & Omit<RenderOptions, 'wrapper'>
) => {
  const { nodes = createMockNodes(), edges = createMockEdges(), ...renderOptions } = options || {};
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ReactFlowProvider>
      <FlowProvider nodes={nodes} edges={edges}>
        {children}
      </FlowProvider>
    </ReactFlowProvider>
  );
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};
