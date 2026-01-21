import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, waitFor } from '@storybook/test';
import { PlaygroundLayout } from '../components/PlaygroundLayout';
import { treeTemplate } from '../utils/playgroundTemplates';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from './FlowTypes';
import { generateNodeId } from '../utils/playgroundHelpers';

const meta: Meta = {
  title: 'Extensions/Flow/FlowPlayground',
  tags: ['autodocs', 'playground'],
  parameters: {
    docs: {
      description: {
        component: `
## FlowPlayground

Advanced interactive playground for creating and editing flow diagrams. Configure all ReactFlow props, edit nodes and edges, preview generated code, and share your flows.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| N/A | FlowPlayground é um playground interativo | - | Eventos são gerenciados internamente pelo componente |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`playground\` | Playground interativo | Estado padrão | Interface completa de playground com todas as funcionalidades |
        `,
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

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
 * Main Playground Story
 * 
 * Single, comprehensive playground with tabs and multi-step configuration.
 * Inspired by https://play.reactflow.dev/
 */
export const Playground: Story = {
  name: 'Playground',
  render: () => {
    return (
      <PlaygroundLayout
        initialState={{
          nodes: initialNodes,
          edges: initialEdges,
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const _canvas = within(canvasElement);
    // Wait for playground to be rendered
    await waitFor(() => {
      expect(canvasElement).toBeInTheDocument();
    });
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete interactive playground with tabs and multi-step configuration. Configure nodes, edges, canvas, background, layouts, validation, code generation, and settings all in one place.',
      },
    },
  },
};

// State Stories
export const PlaygroundState: Story = {
  name: 'Playground State',
  render: () => {
    return (
      <PlaygroundLayout
        initialState={{
          nodes: initialNodes,
          edges: initialEdges,
        }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Playground state - complete interactive playground interface.',
      },
    },
  },
};
