'use client';

/**
 * Playground History Hook
 * 
 * Hook for managing undo/redo history in the playground
 */

import { useState, useCallback, useRef, useEffect } from 'react';
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
  const historyRef = useRef<HistoryState[]>([]);
  const historyIndexRef = useRef(-1);

  // Sync refs with state - this ensures refs are always up to date
  useEffect(() => {
    historyRef.current = history;
    historyIndexRef.current = historyIndex;
  }, [history, historyIndex]);

  const pushState = useCallback((nodes: Node<FlowNodeData>[], edges: Edge<FlowEdgeData>[]) => {
    if (isPushingRef.current) return;
    
    const newState: HistoryState = {
      nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
      edges: JSON.parse(JSON.stringify(edges)), // Deep clone
      timestamp: Date.now(),
    };

    // Coordinate both updates using functional updates
    let finalHistory: HistoryState[] = [];
    let finalIndex: number = -1;
    
    setHistoryIndex((currentIndex) => {
      setHistory((prevHistory) => {
        // Remove any states after current index
        const newHistory = prevHistory.slice(0, currentIndex + 1);
        
        // Add new state
        newHistory.push(newState);
        
        // Limit history size
        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory.shift();
          finalIndex = MAX_HISTORY_SIZE - 1;
        } else {
          finalIndex = newHistory.length - 1;
        }
        
        // Store for ref update
        finalHistory = newHistory;
        
        return newHistory;
      });
      
      // Update refs immediately with calculated values
      historyRef.current = finalHistory;
      historyIndexRef.current = finalIndex;
      
      return finalIndex;
    });
  }, []);

  const undo = useCallback((): HistoryState | null => {
    // Read current values from refs (which are kept in sync by useEffect)
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    
    if (currentIndex <= 0) return null;
    
    const newIndex = currentIndex - 1;
    const state = currentHistory[newIndex];
    
    if (!state) return null;
    
    // Update both state and ref
    setHistoryIndex(newIndex);
    historyIndexRef.current = newIndex;
    isPushingRef.current = true;
    
    setTimeout(() => {
      isPushingRef.current = false;
    }, 0);
    
    return { ...state }; // Return a copy to avoid mutations
  }, []);

  const redo = useCallback((): HistoryState | null => {
    // Read current values from refs (which are kept in sync by useEffect)
    const currentIndex = historyIndexRef.current;
    const currentHistory = historyRef.current;
    
    if (currentIndex >= currentHistory.length - 1) return null;
    
    const newIndex = currentIndex + 1;
    const state = currentHistory[newIndex];
    
    if (!state) return null;
    
    // Update both state and ref
    setHistoryIndex(newIndex);
    historyIndexRef.current = newIndex;
    isPushingRef.current = true;
    
    setTimeout(() => {
      isPushingRef.current = false;
    }, 0);
    
    return { ...state }; // Return a copy to avoid mutations
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
    historyRef.current = [];
    historyIndexRef.current = -1;
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
