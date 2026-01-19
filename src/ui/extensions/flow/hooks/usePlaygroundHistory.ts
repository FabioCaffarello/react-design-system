'use client';

/**
 * Playground History Hook
 * 
 * Hook for managing undo/redo history in the playground
 */

import { useState, useCallback, useRef } from 'react';
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
 * Hook for managing playground history
 */
export function usePlaygroundHistory(): UsePlaygroundHistoryReturn {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isPushingRef = useRef(false);

  const pushState = useCallback((nodes: Node<FlowNodeData>[], edges: Edge<FlowEdgeData>[]) => {
    if (isPushingRef.current) return;
    
    const newState: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
      edges: JSON.parse(JSON.stringify(edges)), // Deep clone
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      // Remove any states after current index (when we're in the middle of history)
      const newHistory = prev.slice(0, historyIndex + 1);
      
      // Add new state
      newHistory.push(newState);
      
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        return newHistory;
      }
      
      return newHistory;
    });
    
    setHistoryIndex((prev) => {
      const newIndex = prev + 1;
      return newIndex >= MAX_HISTORY_SIZE ? MAX_HISTORY_SIZE - 1 : newIndex;
    });
  }, [historyIndex]);

  const undo = useCallback((): HistoryState | null => {
    if (historyIndex <= 0) return null;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    isPushingRef.current = true;
    
    const state = history[newIndex];
    setTimeout(() => {
      isPushingRef.current = false;
    }, 0);
    
    return state || null;
  }, [history, historyIndex]);

  const redo = useCallback((): HistoryState | null => {
    if (historyIndex >= history.length - 1) return null;
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    isPushingRef.current = true;
    
    const state = history[newIndex];
    setTimeout(() => {
      isPushingRef.current = false;
    }, 0);
    
    return state || null;
  }, [history, historyIndex]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  return {
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    undo,
    redo,
    pushState,
    clearHistory,
  };
}
