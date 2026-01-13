'use client';

import React from 'react';
import { NodeResizer, type NodeResizerProps } from '@xyflow/react';

/**
 * FlowNodeResizer Component
 * 
 * Wrapper for React Flow's NodeResizer with design system integration.
 * Provides resizing capability for nodes with constraints and aspect ratio support.
 * 
 * Single Responsibility: Render NodeResizer with design system styling.
 */
export interface FlowNodeResizerProps extends NodeResizerProps {
  /**
   * Show resize handles (defaults to selected state)
   */
  isVisible?: boolean;
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
   * Line color for resize handles
   */
  lineColor?: string;
  /**
   * Handle color
   */
  handleColor?: string;
}

export function FlowNodeResizer({
  isVisible = true,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  keepAspectRatio = false,
  lineColor,
  handleColor,
  ...props
}: FlowNodeResizerProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <NodeResizer
      minWidth={minWidth}
      maxWidth={maxWidth}
      minHeight={minHeight}
      maxHeight={maxHeight}
      keepAspectRatio={keepAspectRatio}
      lineColor={lineColor}
      handleColor={handleColor}
      {...props}
    />
  );
}
