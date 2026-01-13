/**
 * Flow Playground Application
 * 
 * Standalone Vite application for developing and testing flow components.
 * This app provides a dedicated environment for building and improving the graph layer.
 */

import React from 'react';
import { PlaygroundLayout } from './ui/extensions/flow/components/PlaygroundLayout';
import { treeTemplate } from './ui/extensions/flow/utils/playgroundTemplates';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from './ui/extensions/flow/organisms/FlowTypes';
import { generateNodeId } from './ui/extensions/flow/utils/playgroundHelpers';

// Prepare initial nodes and edges from tree template
const initialNodes: Node<FlowNodeData>[] = treeTemplate.nodes.map((node) => ({
  ...node,
  id: generateNodeId(),
}));

const nodeIdMap = new Map(treeTemplate.nodes.map((n, i) => [n.id, initialNodes[i].id]));

const initialEdges: Edge<FlowEdgeData>[] = treeTemplate.edges.map((edge) => ({
  ...edge,
  id: `edge-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
  source: nodeIdMap.get(edge.source) || edge.source,
  target: nodeIdMap.get(edge.target) || edge.target,
}));

/**
 * Main Application Component
 * 
 * This is the entry point for the Flow Playground standalone application.
 * It provides a full-screen playground environment for developing and testing
 * flow components, which helps improve both the components themselves and the Storybook.
 */
export function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <PlaygroundLayout
        initialState={{
          nodes: initialNodes,
          edges: initialEdges,
        }}
      />
    </div>
  );
}
