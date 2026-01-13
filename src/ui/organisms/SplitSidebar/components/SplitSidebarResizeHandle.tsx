'use client';

import React from 'react';
import { GripVertical } from 'lucide-react';
import { useResize } from '../hooks/useResize';

export interface SplitSidebarResizeHandleProps {
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
   * Callback when width changes
   */
  onWidthChange?: (width: number) => void;
  
  /**
   * Whether resize is enabled
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
}

/**
 * SplitSidebar Resize Handle Component
 * 
 * Drag handle for resizing the sidebar width.
 * Supports snap points and min/max constraints.
 * 
 * @example
 * ```tsx
 * <SplitSidebar.ResizeHandle
 *   initialWidth={320}
 *   minWidth={200}
 *   maxWidth={600}
 *   snapPoints={[200, 320, 480]}
 *   onWidthChange={(width) => setWidth(width)}
 * />
 * ```
 */
export default function SplitSidebarResizeHandle({
  initialWidth,
  minWidth,
  maxWidth,
  snapPoints,
  onWidthChange,
  enabled = true,
  className = '',
}: SplitSidebarResizeHandleProps) {
  const { isResizing, startResize } = useResize({
    initialWidth,
    minWidth,
    maxWidth,
    snapPoints,
    onWidthChange,
    enabled,
  });

  if (!enabled) {
    return null;
  }

  return (
    <div
      className={`
        group
        absolute
        top-0
        right-0
        w-1
        h-full
        cursor-col-resize
        hover:bg-indigo-500/50
        active:bg-indigo-600
        transition-colors
        duration-150
        z-10
        flex
        items-center
        justify-center
        ${isResizing ? 'bg-indigo-600' : ''}
        ${className}
      `}
      onMouseDown={startResize}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      aria-valuenow={initialWidth}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const delta = e.key === 'ArrowLeft' ? -10 : 10;
          const newWidth = Math.max(
            minWidth || 0,
            Math.min(maxWidth || Infinity, initialWidth + delta)
          );
          onWidthChange?.(newWidth);
        }
      }}
    >
      <div
        className={`
          w-0.5
          h-8
          bg-gray-400
          rounded-full
          opacity-0
          group-hover:opacity-100
          transition-opacity
          ${isResizing ? 'opacity-100' : ''}
        `}
      />
      <GripVertical
        className={`
          h-4
          w-4
          text-gray-400
          opacity-0
          group-hover:opacity-100
          transition-opacity
          ${isResizing ? 'opacity-100' : ''}
        `}
        aria-hidden="true"
      />
    </div>
  );
}
