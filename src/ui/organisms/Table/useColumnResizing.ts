'use client';

import { useState, useCallback, useRef, type RefObject } from 'react';

export interface ColumnWidth {
  [key: string]: number;
}

export interface UseColumnResizingOptions {
  defaultWidths?: ColumnWidth;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
}

export interface UseColumnResizingResult {
  columnWidths: ColumnWidth;
  setColumnWidth: (columnKey: string, width: number) => void;
  resetColumnWidths: () => void;
  isResizing: boolean;
  resizingColumn: string | null;
  startResize: (columnKey: string, startX: number, startWidth: number) => void;
  handleResize: (currentX: number) => void;
  endResize: () => void;
}

/**
 * useColumnResizing Hook
 * 
 * Hook for managing column resizing in tables.
 * 
 * @example
 * ```tsx
 * const {
 *   columnWidths,
 *   setColumnWidth,
 *   startResize,
 *   handleResize,
 *   endResize,
 * } = useColumnResizing({
 *   defaultWidths: { name: 200, email: 250 },
 *   minWidth: 100,
 * });
 * ```
 */
export function useColumnResizing(
  options: UseColumnResizingOptions = {}
): UseColumnResizingResult {
  const {
    defaultWidths = {},
    minWidth = 50,
    maxWidth,
    resizable = true,
  } = options;

  const [columnWidths, setColumnWidths] = useState<ColumnWidth>(defaultWidths);
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const resizeStateRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const setColumnWidth = useCallback((columnKey: string, width: number) => {
    const clampedWidth = Math.max(minWidth, maxWidth ? Math.min(width, maxWidth) : width);
    setColumnWidths((prev) => ({
      ...prev,
      [columnKey]: clampedWidth,
    }));
  }, [minWidth, maxWidth]);

  const resetColumnWidths = useCallback(() => {
    setColumnWidths(defaultWidths);
  }, [defaultWidths]);

  const startResize = useCallback((columnKey: string, startX: number, startWidth: number) => {
    if (!resizable) return;
    setIsResizing(true);
    setResizingColumn(columnKey);
    resizeStateRef.current = { startX, startWidth };
  }, [resizable]);

  const handleResize = useCallback((currentX: number) => {
    if (!isResizing || !resizingColumn || !resizeStateRef.current) return;
    
    const deltaX = currentX - resizeStateRef.current.startX;
    const newWidth = resizeStateRef.current.startWidth + deltaX;
    setColumnWidth(resizingColumn, newWidth);
  }, [isResizing, resizingColumn, setColumnWidth]);

  const endResize = useCallback(() => {
    setIsResizing(false);
    setResizingColumn(null);
    resizeStateRef.current = null;
  }, []);

  // Handle mouse move and mouse up globally during resize
  const handleMouseMoveRef = useRef<(e: MouseEvent) => void>();
  const handleMouseUpRef = useRef<() => void>();

  if (typeof window !== 'undefined') {
    handleMouseMoveRef.current = (e: MouseEvent) => {
      if (isResizing) {
        handleResize(e.clientX);
      }
    };

    handleMouseUpRef.current = () => {
      if (isResizing) {
        endResize();
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMoveRef.current);
      document.addEventListener('mouseup', handleMouseUpRef.current);
    } else {
      if (handleMouseMoveRef.current) {
        document.removeEventListener('mousemove', handleMouseMoveRef.current);
      }
      if (handleMouseUpRef.current) {
        document.removeEventListener('mouseup', handleMouseUpRef.current);
      }
    }
  }

  return {
    columnWidths,
    setColumnWidth,
    resetColumnWidths,
    isResizing,
    resizingColumn,
    startResize,
    handleResize,
    endResize,
  };
}
