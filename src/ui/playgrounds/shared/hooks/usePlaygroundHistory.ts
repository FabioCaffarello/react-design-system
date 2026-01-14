import { useState, useCallback, useRef } from 'react';

export interface UsePlaygroundHistoryOptions<T> {
  initialState: T;
  maxHistorySize?: number;
}

export interface UsePlaygroundHistoryReturn<T> {
  current: T;
  history: T[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  setState: (state: T) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

/**
 * usePlaygroundHistory Hook
 * 
 * History management with undo/redo functionality for playgrounds.
 * 
 * @example
 * ```tsx
 * const { current, setState, undo, redo, canUndo, canRedo } = usePlaygroundHistory({
 *   initialState: { primary: '#6366f1' },
 *   maxHistorySize: 50,
 * });
 * ```
 */
export function usePlaygroundHistory<T>({
  initialState,
  maxHistorySize = 50,
}: UsePlaygroundHistoryOptions<T>): UsePlaygroundHistoryReturn<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUpdatingRef = useRef(false);

  const current = history[historyIndex];
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const setState = useCallback(
    (newState: T) => {
      if (isUpdatingRef.current) return;

      setHistory((prev) => {
        // Remove any future history if we're not at the end
        const newHistory = prev.slice(0, historyIndex + 1);
        // Add new state
        newHistory.push(newState);
        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
        } else {
          setHistoryIndex(newHistory.length - 1);
        }
        return newHistory;
      });
    },
    [historyIndex, maxHistorySize]
  );

  const undo = useCallback(() => {
    if (canUndo) {
      isUpdatingRef.current = true;
      setHistoryIndex((prev) => {
        const newIndex = prev - 1;
        return newIndex;
      });
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      isUpdatingRef.current = true;
      setHistoryIndex((prev) => {
        const newIndex = prev + 1;
        return newIndex;
      });
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    }
  }, [canRedo]);

  const clearHistory = useCallback(() => {
    setHistory([initialState]);
    setHistoryIndex(0);
  }, [initialState]);

  return {
    current,
    history,
    historyIndex,
    canUndo,
    canRedo,
    setState,
    undo,
    redo,
    clearHistory,
  };
}
