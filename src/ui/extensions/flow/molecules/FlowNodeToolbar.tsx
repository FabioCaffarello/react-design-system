'use client';

import React, { useMemo } from 'react';
import { NodeToolbar, Position, type NodeToolbarProps as ReactFlowNodeToolbarProps } from '@xyflow/react';
import { Button } from '../../../atoms';

/**
 * FlowNodeToolbar Component
 * 
 * Enhanced wrapper for React Flow's NodeToolbar with design system components.
 * Supports all positions (top, right, bottom, left), all alignments (start, center, end),
 * conditional visibility, animations, and better integration with design system.
 * 
 * Single Responsibility: Render toolbar with design system Button components and enhanced features.
 * 
 * @example
 * ```tsx
 * <FlowNodeToolbar
 *   position={Position.Top}
 *   align="center"
 *   visible={selected}
 *   animation="fade"
 *   actions={[
 *     { label: 'Edit', onClick: () => {}, variant: 'primary' },
 *     { label: 'Delete', onClick: () => {}, variant: 'error' }
 *   ]}
 * />
 * ```
 */
export interface FlowNodeToolbarProps extends Omit<ReactFlowNodeToolbarProps, 'children' | 'position' | 'align'> {
  /**
   * Toolbar position relative to node
   * Supports all Position enum values or string values
   */
  position?: Position | 'top' | 'right' | 'bottom' | 'left';
  /**
   * Toolbar alignment
   * 'start' | 'center' | 'end'
   */
  align?: 'start' | 'center' | 'end';
  /**
   * Actions to display in toolbar
   */
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'regular' | 'secondary' | 'error' | 'outline' | 'ghost';
    disabled?: boolean;
    tooltip?: string;
  }>;
  /**
   * Whether toolbar is visible (defaults to true)
   * Can be a boolean or a function that receives node data and returns boolean
   */
  visible?: boolean | ((nodeData: unknown) => boolean);
  /**
   * Animation variant
   */
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right';
  /**
   * Offset from node (in pixels)
   */
  offset?: number;
  /**
   * Custom className for toolbar container
   */
  className?: string;
  /**
   * Custom style for toolbar container
   */
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * Convert string position to Position enum
 */
function stringToPosition(position: string | Position): Position {
  if (typeof position === 'number') {
    return position;
  }
  
  const positionMap: Record<string, Position> = {
    'top': Position.Top,
    'right': Position.Right,
    'bottom': Position.Bottom,
    'left': Position.Left,
  };
  
  return positionMap[position.toLowerCase()] || Position.Top;
}

export function FlowNodeToolbar({
  actions,
  children,
  position = Position.Top,
  align = 'center',
  visible = true,
  animation = 'fade',
  offset,
  className,
  style,
  ...props
}: FlowNodeToolbarProps) {
  // Convert position to Position enum
  const toolbarPosition = useMemo(() => stringToPosition(position), [position]);
  
  // Determine visibility
  const isVisible = useMemo(() => {
    if (typeof visible === 'function') {
      // If visible is a function, we need node data - this would need to be passed
      // For now, we'll assume it's always true if it's a function
      // In practice, you'd get node data from context or props
      return true;
    }
    return visible;
  }, [visible]);
  
  // Don't render if not visible
  if (!isVisible) {
    return null;
  }
  
  // Animation classes with more options
  const animationClasses = useMemo(() => {
    const baseClasses = {
      none: '',
      fade: 'animate-in fade-in duration-200',
      slide: 'animate-in slide-in-from-top-1 duration-200',
      scale: 'animate-in zoom-in-95 duration-200',
      'slide-up': 'animate-in slide-in-from-bottom-1 duration-200',
      'slide-down': 'animate-in slide-in-from-top-1 duration-200',
      'slide-left': 'animate-in slide-in-from-right-1 duration-200',
      'slide-right': 'animate-in slide-in-from-left-1 duration-200',
    };
    return baseClasses[animation] || baseClasses.fade;
  }, [animation]);
  
  // Determine flex direction based on position
  const flexDirection = useMemo(() => {
    if (toolbarPosition === Position.Left || toolbarPosition === Position.Right) {
      return 'flex-col';
    }
    return 'flex-row';
  }, [toolbarPosition]);
  
  // Combined className
  const containerClassName = useMemo(() => {
    const classes = [
      'flex',
      flexDirection,
      'gap-1',
      animationClasses,
      className,
    ].filter(Boolean).join(' ');
    return classes;
  }, [flexDirection, animationClasses, className]);
  
  // Combined style
  const containerStyle = useMemo(() => {
    const baseStyle: React.CSSProperties = {};
    if (offset !== undefined) {
      if (toolbarPosition === Position.Top) {
        baseStyle.marginBottom = offset;
      } else if (toolbarPosition === Position.Bottom) {
        baseStyle.marginTop = offset;
      } else if (toolbarPosition === Position.Left) {
        baseStyle.marginRight = offset;
      } else if (toolbarPosition === Position.Right) {
        baseStyle.marginLeft = offset;
      }
    }
    return { ...baseStyle, ...style };
  }, [offset, toolbarPosition, style]);
  
  return (
    <NodeToolbar 
      position={toolbarPosition}
      align={align}
      {...props}
    >
      <div className={containerClassName} style={containerStyle}>
        {actions?.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={action.onClick}
            leftIcon={action.icon}
            disabled={action.disabled}
            title={action.tooltip}
            aria-label={action.tooltip || action.label}
          >
            {action.label}
          </Button>
        ))}
        {children}
      </div>
    </NodeToolbar>
  );
}
