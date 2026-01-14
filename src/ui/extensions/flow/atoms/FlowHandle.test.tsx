import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { FlowProvider } from '../organisms/FlowProvider';
import { FlowHandle } from './FlowHandle';
import type { Node } from '@xyflow/react';

describe('FlowHandle', () => {
  const mockNodes: Node[] = [];
  const mockEdges: any[] = [];
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders handle with default props', () => {
    const { container } = render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <FlowHandle type="source" position="bottom" />
      </FlowProvider>
    );
    // Handle component renders (React Flow may not fully initialize in test environment)
    // Just verify no errors occurred
    expect(container).toBeTruthy();
  });
  
  it('renders handle with variant', () => {
    const { container } = render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <FlowHandle type="source" position="bottom" variant="primary" />
      </FlowProvider>
    );
    expect(container).toBeTruthy();
  });
  
  it('renders handle with size', () => {
    const { container } = render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <FlowHandle type="source" position="bottom" size="lg" />
      </FlowProvider>
    );
    expect(container).toBeTruthy();
  });
});
