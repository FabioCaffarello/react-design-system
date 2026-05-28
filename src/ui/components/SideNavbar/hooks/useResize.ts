"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { clampWidth, validateWidthBounds } from "../utils";

export interface UseResizeOptions {
  /**
   * Initial width
   */
  initialWidth: number;

  /**
   * Minimum width constraint
   */
  minWidth?: number;

  /**
   * Maximum width constraint
   */
  maxWidth?: number;

  /**
   * Snap points (widths to snap to when dragging)
   */
  snapPoints?: number[];

  /**
   * Snap threshold in pixels
   * @default 20
   */
  snapThreshold?: number;

  /**
   * Callback when width changes
   */
  onWidthChange?: (width: number) => void;

  /**
   * Whether resize is enabled
   * @default true
   */
  enabled?: boolean;
}

export interface UseResizeReturn {
  /**
   * Current width
   */
  width: number;

  /**
   * Whether currently resizing
   */
  isResizing: boolean;

  /**
   * Start resize handler (attach to mousedown)
   */
  startResize: (event: React.MouseEvent) => void;

  /**
   * Set width programmatically
   */
  setWidth: (width: number) => void;
}

/**
 * Hook for drag-to-resize functionality
 *
 * Provides resize state and handlers for drag-to-resize interactions.
 * Supports snap points and min/max constraints.
 *
 * @example
 * ```tsx
 * const { width, isResizing, startResize } = useResize({
 *   initialWidth: 320,
 *   minWidth: 200,
 *   maxWidth: 600,
 *   snapPoints: [200, 320, 480],
 *   onWidthChange: (width) => console.log('Width:', width)
 * });
 * ```
 */
export function useResize({
  initialWidth,
  minWidth,
  maxWidth,
  snapPoints,
  snapThreshold = 20,
  onWidthChange,
  enabled = true,
}: UseResizeOptions): UseResizeReturn {
  // Validate bounds on first render
  if (process.env.NODE_ENV === "development") {
    if (!validateWidthBounds(minWidth, maxWidth)) {
      console.warn(
        "[useResize] Invalid bounds: minWidth must be less than maxWidth",
        { minWidth, maxWidth },
      );
    }
  }

  // Clamp initial width to valid bounds
  const clampedInitialWidth = clampWidth(initialWidth, minWidth, maxWidth);
  const [width, setWidthState] = useState(clampedInitialWidth);
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(clampedInitialWidth);

  const setWidth = useCallback(
    (newWidth: number) => {
      // Use utility function to clamp width
      let constrainedWidth = clampWidth(newWidth, minWidth, maxWidth);

      // Check snap points
      if (snapPoints && snapPoints.length > 0) {
        const closestSnap = snapPoints.reduce((closest, snap) => {
          const distanceToSnap = Math.abs(constrainedWidth - snap);
          const distanceToClosest = Math.abs(constrainedWidth - closest);
          return distanceToSnap < distanceToClosest ? snap : closest;
        }, snapPoints[0]);

        if (Math.abs(constrainedWidth - closestSnap) <= snapThreshold) {
          constrainedWidth = closestSnap;
        }
      }

      setWidthState(constrainedWidth);
      onWidthChange?.(constrainedWidth);
    },
    [minWidth, maxWidth, snapPoints, snapThreshold, onWidthChange],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!enabled || !isResizing) return;

      const deltaX = event.clientX - startXRef.current;
      const newWidth = startWidthRef.current + deltaX;
      setWidth(newWidth);
    },
    [enabled, isResizing, setWidth],
  );

  const handleMouseUp = useCallback(() => {
    if (!enabled) return;

    setIsResizing(false);
    startXRef.current = 0;
    startWidthRef.current = width;
  }, [enabled, width]);

  const startResize = useCallback(
    (event: React.MouseEvent) => {
      if (!enabled) return;

      event.preventDefault();
      event.stopPropagation();

      setIsResizing(true);
      startXRef.current = event.clientX;
      startWidthRef.current = width;
    },
    [enabled, width],
  );

  useEffect(() => {
    if (!isResizing) return;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    // Prevent text selection while resizing
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Update width when initialWidth changes externally
  useEffect(() => {
    if (!isResizing) {
      setWidthState(clampWidth(initialWidth, minWidth, maxWidth));
    }
  }, [initialWidth, minWidth, maxWidth, isResizing]);

  return {
    width,
    isResizing,
    startResize,
    setWidth,
  };
}
