import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlaygroundHistory } from './usePlaygroundHistory';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';

describe('usePlaygroundHistory', () => {
  const createMockNode = (id: string, label: string): Node<FlowNodeData> => ({
    id,
    type: 'default',
    position: { x: 0, y: 0 },
    data: { label },
  });
  
  const createMockEdge = (id: string, source: string, target: string): Edge<FlowEdgeData> => ({
    id,
    source,
    target,
    data: {},
  });
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('initializes with empty history', () => {
    const { result } = renderHook(() => usePlaygroundHistory());
    
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
  
  it('pushes state to history', () => {
    const { result } = renderHook(() => usePlaygroundHistory());
    
    const nodes = [createMockNode('1', 'Node 1')];
    const edges = [createMockEdge('e1', '1', '2')];
    
    act(() => {
      result.current.pushState(nodes, edges);
    });
    
    expect(result.current.canUndo).toBe(false); // First state, nothing to undo
  });
  
  it('can undo after pushing multiple states', async () => {
    const { result } = renderHook(() => usePlaygroundHistory());
    
    const nodes1 = [createMockNode('1', 'Node 1')];
    const edges1: Edge<FlowEdgeData>[] = [];
    
    await act(async () => {
      result.current.pushState(nodes1, edges1);
    });
    
    const nodes2 = [createMockNode('1', 'Node 1'), createMockNode('2', 'Node 2')];
    const edges2: Edge<FlowEdgeData>[] = [];
    
    await act(async () => {
      result.current.pushState(nodes2, edges2);
    });
    
    expect(result.current.canUndo).toBe(true);
    
    const undoState = await act(async () => result.current.undo());
    
    expect(undoState).toBeTruthy();
    expect(undoState?.nodes).toEqual(nodes1);
  });
  
  it('can redo after undo', async () => {
    const { result } = renderHook(() => usePlaygroundHistory());
    
    const nodes1 = [createMockNode('1', 'Node 1')];
    const nodes2 = [createMockNode('1', 'Node 1'), createMockNode('2', 'Node 2')];
    const edges: Edge<FlowEdgeData>[] = [];
    
    await act(async () => {
      result.current.pushState(nodes1, edges);
      result.current.pushState(nodes2, edges);
    });
    
    await act(async () => {
      result.current.undo();
    });
    
    expect(result.current.canRedo).toBe(true);
    
    const redoState = await act(async () => result.current.redo());
    
    expect(redoState).toBeTruthy();
    expect(redoState?.nodes).toEqual(nodes2);
  });
  
  it('clears history', () => {
    const { result } = renderHook(() => usePlaygroundHistory());
    
    const nodes = [createMockNode('1', 'Node 1')];
    const edges: Edge<FlowEdgeData>[] = [];
    
    act(() => {
      result.current.pushState(nodes, edges);
      result.current.clearHistory();
    });
    
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
});
