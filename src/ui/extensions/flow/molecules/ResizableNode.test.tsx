import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowProvider } from '../organisms/FlowProvider';
import { ResizableNode } from './ResizableNode';
import type { Node } from '@xyflow/react';
import type { ResizableNodeData } from './ResizableNode';

describe('ResizableNode', () => {
  const mockNodes: Node<ResizableNodeData>[] = [
    {
      id: '1',
      type: 'resizable',
      position: { x: 0, y: 0 },
      data: {
        label: 'Resizable Node',
        minWidth: 100,
        maxWidth: 500,
        minHeight: 50,
        maxHeight: 300,
      },
    },
  ];
  const mockEdges: any[] = [];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders resizable node with default variant', () => {
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <ResizableNode
            id="1"
            data={mockNodes[0].data}
            selected={false}
            position={mockNodes[0].position}
            type="resizable"
          />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.getByText('Resizable Node')).toBeInTheDocument();
  });
  
  it('renders resizable node with vertical variant', () => {
    const nodeData = {
      ...mockNodes[0].data,
      resizerVariant: 'vertical' as const,
    };
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <ResizableNode
            id="1"
            data={nodeData}
            selected={false}
            position={mockNodes[0].position}
            type="resizable"
          />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.getByText('Resizable Node')).toBeInTheDocument();
  });
  
  it('renders resizable node with horizontal variant', () => {
    const nodeData = {
      ...mockNodes[0].data,
      resizerVariant: 'horizontal' as const,
    };
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <ResizableNode
            id="1"
            data={nodeData}
            selected={false}
            position={mockNodes[0].position}
            type="resizable"
          />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.getByText('Resizable Node')).toBeInTheDocument();
  });
  
  it('renders resizable node with keepAspectRatio', () => {
    const nodeData = {
      ...mockNodes[0].data,
      keepAspectRatio: true,
    };
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <ResizableNode
            id="1"
            data={nodeData}
            selected={false}
            position={mockNodes[0].position}
            type="resizable"
          />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.getByText('Resizable Node')).toBeInTheDocument();
  });
});
