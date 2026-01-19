'use client';

/**
 * Playground History Hook
 * 
 * Hook for managing undo/redo history in the playground
 * Uses useReducer for atomic state management to avoid synchronization issues
 */

import { useReducer, useCallback, useRef } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';

export interface HistoryState {
  nodes: Node<FlowNodeData>[];
  edges: Edge<FlowEdgeData>[];
  timestamp: number;
}

export interface UsePlaygroundHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => HistoryState | null;
  redo: () => HistoryState | null;
  pushState: (nodes: Node<FlowNodeData>[], edges: Edge<FlowEdgeData>[]) => void;
  clearHistory: () => void;
}

const MAX_HISTORY_SIZE = 50;

/**
 * Reducer state for history management
 */
interface HistoryReducerState {
  history: HistoryState[];
  index: number;
}

/**
 * Actions for history reducer
 */
type HistoryAction =
  | { type: 'PUSH_STATE'; payload: HistoryState }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' };

/**
 * Reducer for managing history state atomically
 */
function historyReducer(
  state: HistoryReducerState,
  action: HistoryAction
): HistoryReducerState {
  switch (action.type) {
    case 'PUSH_STATE': {
      // Remove any states after current index (when user made changes after undo)
      const newHistory = state.history.slice(0, state.index + 1);
      
      // Add new state
      newHistory.push(action.payload);
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        return { history: newHistory, index: MAX_HISTORY_SIZE - 1 };
      }
      
      return { history: newHistory, index: newHistory.length - 1 };
    }
    
    case 'UNDO': {
      if (state.index <= 0) return state;
      return { ...state, index: state.index - 1 };
    }
    
    case 'REDO': {
      if (state.index >= state.history.length - 1) return state;
      return { ...state, index: state.index + 1 };
    }
    
    case 'CLEAR': {
      return { history: [], index: -1 };
    }
    
    default:
      return state;
  }
}

/**
 * Hook for managing playground history
 * Uses useReducer for atomic state management to ensure consistency
 */
export function usePlaygroundHistory(): UsePlaygroundHistoryReturn {
  const [state, dispatch] = useReducer(historyReducer, { history: [], index: -1 });
  const isPushingRef = useRef(false);

  const pushState = useCallback((nodes: Node<FlowNodeData>[], edges: Edge<FlowEdgeData>[]) => {
    if (isPushingRef.current) return;
    
    const newState: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
      edges: JSON.parse(JSON.stringify(edges)), // Deep clone
      timestamp: Date.now(),
    };

    dispatch({ type: 'PUSH_STATE', payload: newState });
  }, []);

  const undo = useCallback((): HistoryState | null => {
    if (state.index <= 0) return null;
    
    const newIndex = state.index - 1;
    const historyState = state.history[newIndex];
    
    if (!historyState) return null;
    
    dispatch({ type: 'UNDO' });
    isPushingRef.current = true;
    
    setTimeout(() => {
      isPushingRef.current = false;
    }, 0);
    
    // Return a copy to avoid mutations
    return {
      nodes: JSON.parse(JSON.stringify(historyState.nodes)),
      edges: JSON.parse(JSON.stringify(historyState.edges)),
      timestamp: historyState.timestamp,
    };
  }, [state]);

  const redo = useCallback((): HistoryState | null => {
    if (state.index >= state.history.length - 1) return null;
    
    const newIndex = state.index + 1;
    const historyState = state.history[newIndex];
    
    if (!historyState) return null;
    
    dispatch({ type: 'REDO' });
    isPushingRef.current = true;
    
    setTimeout(() => {
      isPushingRef.current = false;
    }, 0);
    
    // Return a copy to avoid mutations
    return {
      nodes: JSON.parse(JSON.stringify(historyState.nodes)),
      edges: JSON.parse(JSON.stringify(historyState.edges)),
      timestamp: historyState.timestamp,
    };
  }, [state]);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return {
    canUndo: state.index > 0,
    canRedo: state.index < state.history.length - 1,
    undo,
    redo,
    pushState,
    clearHistory,
  };
}
