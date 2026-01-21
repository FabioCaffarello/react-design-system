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

  it('handles multiple rapid pushState calls', async () => {
    const { result } = renderHook(() => usePlaygroundHistory());
    
    const nodes1 = [createMockNode('1', 'Node 1')];
    const nodes2 = [createMockNode('1', 'Node 1'), createMockNode('2', 'Node 2')];
    const nodes3 = [createMockNode('1', 'Node 1'), createMockNode('2', 'Node 2'), createMockNode('3', 'Node 3')];
    const edges: Edge<FlowEdgeData>[] = [];
    
    await act(async () => {
      result.current.pushState(nodes1, edges);
      result.current.pushState(nodes2, edges);
      result.current.pushState(nodes3, edges);
    });
    
    expect(result.current.canUndo).toBe(true);
    
    const undoState1 = await act(async () => result.current.undo());
    expect(undoState1?.nodes).toEqual(nodes2);
    
    const undoState2 = await act(async () => result.current.undo());
    expect(undoState2?.nodes).toEqual(nodes1);
  });

  it('handles alternating undo/redo operations', async () => {
    const { result } = renderHook(() => usePlaygroundHistory());
    
    const nodes1 = [createMockNode('1', 'Node 1')];
    const nodes2 = [createMockNode('1', 'Node 1'), createMockNode('2', 'Node 2')];
    const nodes3 = [createMockNode('1', 'Node 1'), createMockNode('2', 'Node 2'), createMockNode('3', 'Node 3')];
    const edges: Edge<FlowEdgeData>[] = [];
    
    await act(async () => {
      result.current.pushState(nodes1, edges);
      result.current.pushState(nodes2, edges);
      result.current.pushState(nodes3, edges);
    });
    
    // Undo to nodes2
    await act(async () => {
      result.current.undo();
    });
    expect(result.current.canRedo).toBe(true);
    expect(result.current.canUndo).toBe(true);
    
    // Redo to nodes3
    const redoState = await act(async () => result.current.redo());
    expect(redoState?.nodes).toEqual(nodes3);
    expect(result.current.canRedo).toBe(false);
    expect(result.current.canUndo).toBe(true);
    
    // Undo again to nodes2
    const undoState = await act(async () => result.current.undo());
    expect(undoState?.nodes).toEqual(nodes2);
    expect(result.current.canRedo).toBe(true);
    expect(result.current.canUndo).toBe(true);
  });

  it('clears history after undo/redo operations', async () => {
    const { result } = renderHook(() => usePlaygroundHistory());
    
    const nodes1 = [createMockNode('1', 'Node 1')];
    const nodes2 = [createMockNode('1', 'Node 1'), createMockNode('2', 'Node 2')];
    const nodes3 = [createMockNode('1', 'Node 1'), createMockNode('2', 'Node 2'), createMockNode('3', 'Node 3')];
    const edges: Edge<FlowEdgeData>[] = [];
    
    await act(async () => {
      result.current.pushState(nodes1, edges);
      result.current.pushState(nodes2, edges);
      result.current.pushState(nodes3, edges);
    });
    
    // After 3 states, we're at index 2 (last state)
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
    
    // Undo to index 1 (nodes2)
    await act(async () => {
      result.current.undo();
    });
    
    // Now at index 1, can undo to index 0, can redo to index 2
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);
    
    await act(async () => {
      result.current.clearHistory();
    });
    
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
    
    // After clear, undo/redo should return null
    const undoAfterClear = await act(async () => result.current.undo());
    expect(undoAfterClear).toBeNull();
    
    const redoAfterClear = await act(async () => result.current.redo());
    expect(redoAfterClear).toBeNull();
  });

  it('returns null when undo is called at the beginning of history', async () => {
    const { result } = renderHook(() => usePlaygroundHistory());
    
    const nodes = [createMockNode('1', 'Node 1')];
    const edges: Edge<FlowEdgeData>[] = [];
    
    await act(async () => {
      result.current.pushState(nodes, edges);
    });
    
    expect(result.current.canUndo).toBe(false);
    
    const undoState = await act(async () => result.current.undo());
    expect(undoState).toBeNull();
  });

  it('returns null when redo is called at the end of history', async () => {
    const { result } = renderHook(() => usePlaygroundHistory());
    
    const nodes1 = [createMockNode('1', 'Node 1')];
    const nodes2 = [createMockNode('1', 'Node 1'), createMockNode('2', 'Node 2')];
    const edges: Edge<FlowEdgeData>[] = [];
    
    await act(async () => {
      result.current.pushState(nodes1, edges);
      result.current.pushState(nodes2, edges);
    });
    
    expect(result.current.canRedo).toBe(false);
    
    const redoState = await act(async () => result.current.redo());
    expect(redoState).toBeNull();
  });
});
