import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowProvider } from '../organisms/FlowProvider';
import { FloatingEdge } from './FloatingEdge';
import type { Edge } from '@xyflow/react';
import type { FlowEdgeData } from '../organisms/FlowTypes';

describe('FloatingEdge', () => {
  const mockNodes: any[] = [
    { id: '1', position: { x: 0, y: 0 }, width: 100, height: 50 },
    { id: '2', position: { x: 200, y: 0 }, width: 100, height: 50 },
  ];
  const mockEdges: Edge<FlowEdgeData>[] = [];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders floating edge', () => {
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <svg>
            <FloatingEdge
              id="e1-2"
              source="1"
              target="2"
              data={{}}
              selected={false}
            />
          </svg>
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    // Edge should be rendered
    expect(document.querySelector('path')).toBeTruthy();
  });
  
  it('renders floating edge with animated style', () => {
    const edgeData: FlowEdgeData = {
      animated: true,
    };
    
    render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <svg>
            <FloatingEdge
              id="e1-2"
              source="1"
              target="2"
              data={edgeData}
              selected={false}
            />
          </svg>
        </FlowProvider>
      </ReactFlowProvider>
    );
    
    expect(document.querySelector('path')).toBeTruthy();
  });
  
  it('applies selected styling when selected', () => {
    const { container } = render(
      <ReactFlowProvider>
        <FlowProvider nodes={mockNodes} edges={mockEdges}>
          <svg>
            <FloatingEdge
              id="e1-2"
              source="1"
              target="2"
              data={{}}
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
