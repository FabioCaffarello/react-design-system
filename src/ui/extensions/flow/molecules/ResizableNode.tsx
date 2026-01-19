'use client';

import React, { useMemo } from 'react';
import { Position, NodeResizer, NodeResizeControl, type NodeProps, useKeyPress } from '@xyflow/react';
import { Maximize2 } from 'lucide-react';
import { FlowNodeWrapper } from '../atoms/FlowNodeWrapper';
import { FlowHandle } from '../atoms/FlowHandle';
import type { FlowNodeData } from '../organisms/FlowTypes';

/**
 * ResizableNode Component
 * 
 * Enhanced specialized node with resizing capability using NodeResizer/NodeResizeControl from @xyflow/react.
 * Supports constraints, aspect ratio, custom resize handlers, and multiple variants.
 * 
 * Variants:
 * - 'default': Full resizer with all handles
 * - 'vertical': Only vertical resizing (top/bottom)
 * - 'horizontal': Only horizontal resizing (left/right)
 * - 'bottom-right': Only bottom-right corner resizing
 * - 'custom': Custom resizer with custom icon
 * 
 * @example
 * ```tsx
 * <ResizableNode
 *   data={{
 *     label: 'Resizable',
 *     variant: 'vertical',
 *     minHeight: 50,
 *     maxHeight: 200,
 *     keepAspectRatio: true
 *   }}
 * />
 * ```
 */
export interface ResizableNodeData extends FlowNodeData {
  /**
   * Minimum width
   */
  minWidth?: number;
  /**
   * Maximum width
   */
  maxWidth?: number;
  /**
   * Minimum height
   */
  minHeight?: number;
  /**
   * Maximum height
   */
  maxHeight?: number;
  /**
   * Keep aspect ratio while resizing
   */
  keepAspectRatio?: boolean;
  /**
   * Show resizer handles (defaults to selected state)
   */
  isVisible?: boolean;
  /**
   * Resizer variant: 'default' | 'vertical' | 'horizontal' | 'bottom-right' | 'custom'
   */
  resizerVariant?: 'default' | 'vertical' | 'horizontal' | 'bottom-right' | 'custom';
  /**
   * Custom resize icon component (for 'custom' variant)
   */
  customResizeIcon?: React.ReactNode;
  /**
   * Resizer color
   */
  resizerColor?: string;
  /**
   * Should resize callback - return false to prevent resize
   */
  shouldResize?: (params: { width: number; height: number }) => boolean;
  /**
   * Callback when resize starts
   */
  onResizeStart?: () => void;
  /**
   * Callback during resize
   */
  onResize?: (width: number, height: number) => void;
  /**
   * Callback when resize ends
   */
  onResizeEnd?: (width: number, height: number) => void;
  /**
   * Expand parent when resizing (for child nodes)
   */
  expandParent?: boolean;
}

export type ResizableNodeProps = NodeProps<ResizableNodeData>;

/**
 * Default resize icon component
 */
const DefaultResizeIcon = () => (
  <Maximize2
    size={20}
    style={{ pointerEvents: 'none' }}
  />
);

export const ResizableNode = React.memo(({
  data,
  selected,
  width: _width,
  height: _height,
}: ResizableNodeProps) => {
  const variant = data.variant || 'default';
  const size = data.size || 'md';
  const resizerVariant = data.resizerVariant || 'default';
  const keepAspectRatioKey = useKeyPress('k');
  const keepAspectRatio = keepAspectRatioKey || data.keepAspectRatio || false;
  const resizerColor = data.resizerColor || '#1a192b';
  
  // Resizer visibility
  const isVisible = useMemo(() => data.isVisible ?? selected, [data.isVisible, selected]);
  
  // Common resizer props
  const commonResizerProps = useMemo(() => ({
    minWidth: data.minWidth,
    maxWidth: data.maxWidth,
    minHeight: data.minHeight,
    maxHeight: data.maxHeight,
    isVisible,
    keepAspectRatio,
    shouldResize: data.shouldResize,
    onResizeStart: data.onResizeStart,
    onResize: data.onResize,
    onResizeEnd: data.onResizeEnd,
  }), [
    data.minWidth,
    data.maxWidth,
    data.minHeight,
    data.maxHeight,
    isVisible,
    keepAspectRatio,
    data.shouldResize,
    data.onResizeStart,
    data.onResize,
    data.onResizeEnd,
  ]);
  
  // Render resizer based on variant
  const renderResizer = useMemo(() => {
    if (resizerVariant === 'vertical') {
      return (
        <>
          <NodeResizeControl
            {...commonResizerProps}
            color={resizerColor}
            position={Position.Top}
          />
          <NodeResizeControl
            {...commonResizerProps}
            color={resizerColor}
            position={Position.Bottom}
          />
        </>
      );
    } else if (resizerVariant === 'horizontal') {
      return (
        <>
          <NodeResizeControl
            {...commonResizerProps}
            color={resizerColor}
            position={Position.Left}
          />
          <NodeResizeControl
            {...commonResizerProps}
            color={resizerColor}
            position={Position.Right}
          />
        </>
      );
    } else if (resizerVariant === 'bottom-right') {
      return (
        <NodeResizeControl
          {...commonResizerProps}
          color={resizerColor}
          position={Position.BottomRight}
        />
      );
    } else if (resizerVariant === 'custom') {
      const ResizeIcon = data.customResizeIcon || DefaultResizeIcon;
      return (
        <NodeResizeControl
          {...commonResizerProps}
          color={resizerColor}
          style={{
            background: 'transparent',
            border: 'none',
          }}
        >
          <ResizeIcon />
        </NodeResizeControl>
      );
    } else {
      // Default: full resizer
      return (
        <NodeResizer
          {...commonResizerProps}
          color={resizerColor}
        />
      );
    }
  }, [resizerVariant, commonResizerProps, resizerColor, data.customResizeIcon]);
  
  return (
    <FlowNodeWrapper variant={variant} size={size} selected={selected}>
      {/* Resizer component(s) */}
      {renderResizer}
      
      {/* Target handles */}
      <FlowHandle
        type="target"
        position={Position.Top}
        variant={variant}
      />
      <FlowHandle
        type="target"
        position={Position.Left}
        variant={variant}
      />
      
      {/* Node content */}
      <div className="flex items-center gap-2">
        {data.icon && (
          <div className="flex-shrink-0">
            {data.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {data.label && (
            <div className="font-medium truncate">
              {data.label}
            </div>
          )}
          {data.description && (
            <div className="text-sm text-gray-500 truncate">
              {data.description}
            </div>
          )}
        </div>
      </div>
      
      {/* Source handles */}
      <FlowHandle
        type="source"
        position={Position.Bottom}
        variant={variant}
      />
      <FlowHandle
        type="source"
        position={Position.Right}
        variant={variant}
      />
    </FlowNodeWrapper>
  );
}, (prev, next) => {
  // Enhanced comparison for memoization
  if (prev.data === next.data &&
      prev.selected === next.selected &&
      prev.position?.x === next.position?.x &&
      prev.position?.y === next.position?.y &&
      prev.dragging === next.dragging &&
      prev.width === next.width &&
      prev.height === next.height) {
    return true;
  }
  
  // Deep comparison of critical data properties
  const prevData = prev.data;
  const nextData = next.data;
  
  if (prevData?.resizerVariant !== nextData?.resizerVariant ||
      prevData?.minWidth !== nextData?.minWidth ||
      prevData?.maxWidth !== nextData?.maxWidth ||
      prevData?.minHeight !== nextData?.minHeight ||
      prevData?.maxHeight !== nextData?.maxHeight ||
      prevData?.keepAspectRatio !== nextData?.keepAspectRatio ||
      prevData?.isVisible !== nextData?.isVisible ||
      prevData?.resizerColor !== nextData?.resizerColor) {
    return false;
  }
  
  return true;
});

ResizableNode.displayName = 'ResizableNode';
