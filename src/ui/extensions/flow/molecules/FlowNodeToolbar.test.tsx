import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowProvider } from '../organisms/FlowProvider';
import { FlowNodeToolbar } from './FlowNodeToolbar';
import { Position } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import type { FlowNodeData } from '../organisms/FlowTypes';

describe('FlowNodeToolbar', () => {
  const mockNodes: Node<FlowNodeData>[] = [
    {
      id: '1',
      type: 'default',
      position: { x: 0, y: 0 },
      data: { label: 'Test Node' },
    },
  ];
  const mockEdges: any[] = [];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders toolbar with actions', () => {
    const actions = [
      { label: 'Edit', onClick: vi.fn() },
      { label: 'Delete', onClick: vi.fn() },
    ];
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <FlowNodeToolbar actions={actions} />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
  
  it('renders toolbar with different positions', () => {
    const actions = [{ label: 'Action', onClick: vi.fn() }];
    
    const { rerender } = render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <FlowNodeToolbar actions={actions} position={Position.Top} />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.getByText('Action')).toBeInTheDocument();
    
    rerender(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <FlowNodeToolbar actions={actions} position={Position.Bottom} />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
  
  it('renders toolbar with different alignments', () => {
    const actions = [{ label: 'Action', onClick: vi.fn() }];
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <FlowNodeToolbar actions={actions} align="start" />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
  
  it('does not render when visible is false', () => {
    const actions = [{ label: 'Action', onClick: vi.fn() }];
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <FlowNodeToolbar actions={actions} visible={false} />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(screen.queryByText('Action')).not.toBeInTheDocument();
  });
  
  it('handles action clicks', () => {
    const handleClick = vi.fn();
    const actions = [{ label: 'Click Me', onClick: handleClick }];
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <FlowNodeToolbar actions={actions} />
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    const button = screen.getByText('Click Me');
    button.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
