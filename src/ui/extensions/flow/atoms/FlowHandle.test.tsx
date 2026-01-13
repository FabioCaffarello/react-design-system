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
    render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <FlowHandle type="source" position="bottom" />
      </FlowProvider>
    );
    // Handle is rendered by React Flow
    expect(document.querySelector('[data-handleid]')).toBeTruthy();
  });
  
  it('renders handle with variant', () => {
    render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <FlowHandle type="source" position="bottom" variant="primary" />
      </FlowProvider>
    );
    expect(document.querySelector('[data-handleid]')).toBeTruthy();
  });
  
  it('renders handle with size', () => {
    render(
      <FlowProvider nodes={mockNodes} edges={mockEdges}>
        <FlowHandle type="source" position="bottom" size="lg" />
      </FlowProvider>
    );
    expect(document.querySelector('[data-handleid]')).toBeTruthy();
  });
});
