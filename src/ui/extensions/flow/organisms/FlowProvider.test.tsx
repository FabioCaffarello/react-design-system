import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { FlowProvider } from './FlowProvider';
import { useFlowContext } from './FlowContext';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from './FlowTypes';

// Test component that uses context
function TestComponent() {
  const context = useFlowContext();
  return <div data-testid="context-value">{context ? 'context-available' : 'no-context'}</div>;
}

describe('FlowProvider', () => {
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
  
  it('provides flow context to children', () => {
    const { getByTestId } = render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <TestComponent />
      </FlowProvider>
    );
    
    expect(getByTestId('context-value')).toHaveTextContent('context-available');
  });
  
  it('handles controlled nodes', () => {
    const handleNodesChange = vi.fn();
    
    const { getByTestId } = render(
      <FlowProvider
        nodes={mockNodes}
        edges={mockEdges}
        onNodesChange={handleNodesChange}
      >
        <TestComponent />
      </FlowProvider>
    );
    
    expect(getByTestId('context-value')).toHaveTextContent('context-available');
  });
  
  it('handles uncontrolled nodes', () => {
    const { getByTestId } = render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <TestComponent />
      </FlowProvider>
    );
    
    expect(getByTestId('context-value')).toHaveTextContent('context-available');
  });
});
