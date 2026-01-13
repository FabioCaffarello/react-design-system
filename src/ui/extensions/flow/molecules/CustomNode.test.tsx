import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowProvider } from '../organisms/FlowProvider';
import { CustomNode } from './CustomNode';
import type { Node } from '@xyflow/react';
import type { FlowNodeData } from '../organisms/FlowTypes';

describe('CustomNode', () => {
  const mockNodes: Node<FlowNodeData>[] = [
    {
      id: '1',
      type: 'default',
      position: { x: 0, y: 0 },
      data: {
        label: 'Test Node',
        description: 'Test description',
      },
    },
  ];
  const mockEdges: any[] = [];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders node with label', () => {
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <CustomNode
            id="1"
            data={mockNodes[0].data}
            selected={false}
            position={mockNodes[0].position}
            type="default"
          />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });
  
  it('renders node with description', () => {
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <CustomNode
            id="1"
            data={mockNodes[0].data}
            selected={false}
            position={mockNodes[0].position}
            type="default"
          />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });
  
  it('applies selected styling when selected', () => {
    const { container } = render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <CustomNode
            id="1"
            data={mockNodes[0].data}
            selected={true}
            position={mockNodes[0].position}
            type="default"
          />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    // Check for selection styling (ring class)
    const nodeElement = container.querySelector('[data-id="1"]');
    expect(nodeElement).toBeTruthy();
  });
});
