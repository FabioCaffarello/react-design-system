import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { FlowCanvas } from './FlowCanvas';
import { FlowProvider } from './FlowProvider';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from './FlowTypes';

describe('FlowCanvas', () => {
  const mockNodes: Node<FlowNodeData>[] = [
    {
      id: '1',
      type: 'default',
      position: { x: 0, y: 0 },
      data: { label: 'Test' },
    },
  ];
  const mockEdges: Edge<FlowEdgeData>[] = [];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders FlowCanvas.Root', () => {
    const { container } = render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <FlowCanvas.Root />
      </FlowProvider>
    );
    
    // ReactFlow renders a div with class 'react-flow'
    expect(container.querySelector('.react-flow')).toBeTruthy();
  });
  
  it('renders with Background', () => {
    const { container } = render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <FlowCanvas.Root>
          <FlowCanvas.Background />
        </FlowCanvas.Root>
      </FlowProvider>
    );
    
    expect(container.querySelector('.react-flow__background')).toBeTruthy();
  });
  
  it('renders with Controls', () => {
    const { container } = render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <FlowCanvas.Root>
          <FlowCanvas.Controls />
        </FlowCanvas.Root>
      </FlowProvider>
    );
    
    expect(container.querySelector('.react-flow__controls')).toBeTruthy();
  });
  
  it('renders with Minimap', () => {
    const { container } = render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <FlowCanvas.Root>
          <FlowCanvas.Minimap />
        </FlowCanvas.Root>
      </FlowProvider>
    );
    
    expect(container.querySelector('.react-flow__minimap')).toBeTruthy();
  });
});
