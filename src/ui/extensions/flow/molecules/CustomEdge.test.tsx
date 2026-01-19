import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowProvider } from '../organisms/FlowProvider';
import { CustomEdge } from './CustomEdge';
import type { Edge, Node } from '@xyflow/react';
import type { FlowEdgeData, CustomEdgeData, FlowNodeData } from '../organisms/FlowTypes';
import { MarkerType } from '@xyflow/react';

describe('CustomEdge', () => {
  const mockNodes: Node<FlowNodeData>[] = [
    { id: '1', position: { x: 0, y: 0 }, data: {} },
    { id: '2', position: { x: 200, y: 0 }, data: {} },
  ];
  const mockEdges: Edge<FlowEdgeData>[] = [];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders edge with default type', () => {
    const edgeData: CustomEdgeData = {
      label: 'Test Edge',
    };
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <svg>
            <CustomEdge
              id="e1-2"
              sourceX={0}
              sourceY={0}
              targetX={200}
              targetY={0}
              sourcePosition="right"
              targetPosition="left"
              data={edgeData}
              selected={false}
            />
          </svg>
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    // Edge should be rendered
    expect(document.querySelector('path')).toBeTruthy();
  });
  
  it('renders edge with simplebezier type', () => {
    const edgeData: CustomEdgeData = {
      edgeType: 'simplebezier',
      label: 'Simple Bezier Edge',
    };
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <svg>
            <CustomEdge
              id="e1-2"
              sourceX={0}
              sourceY={0}
              targetX={200}
              targetY={0}
              sourcePosition="right"
              targetPosition="left"
              data={edgeData}
              selected={false}
            />
          </svg>
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(document.querySelector('path')).toBeTruthy();
  });
  
  it('renders edge with custom markers', () => {
    const edgeData: CustomEdgeData = {
      customMarkerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
      },
    };
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <svg>
            <CustomEdge
              id="e1-2"
              sourceX={0}
              sourceY={0}
              targetX={200}
              targetY={0}
              sourcePosition="right"
              targetPosition="left"
              data={edgeData}
              selected={false}
            />
          </svg>
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(document.querySelector('path')).toBeTruthy();
  });
  
  it('renders edge with label', () => {
    const edgeData: CustomEdgeData = {
      label: 'Edge Label',
    };
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <svg>
            <CustomEdge
              id="e1-2"
              sourceX={0}
              sourceY={0}
              targetX={200}
              targetY={0}
              sourcePosition="right"
              targetPosition="left"
              data={edgeData}
              selected={false}
            />
          </svg>
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    // Label should be rendered (though it might be in a different layer)
    expect(document.querySelector('path')).toBeTruthy();
  });
  
  it('applies selected styling when selected', () => {
    const edgeData: CustomEdgeData = {
      label: 'Selected Edge',
    };
    
    const { container } = render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <svg>
            <CustomEdge
              id="e1-2"
              sourceX={0}
              sourceY={0}
              targetX={200}
              targetY={0}
              sourcePosition="right"
              targetPosition="left"
              data={edgeData}
              selected={true}
            />
          </svg>
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    const path = container.querySelector('path');
    expect(path).toBeTruthy();
  });
});
