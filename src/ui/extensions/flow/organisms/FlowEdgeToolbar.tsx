'use client';

import React from 'react';
import { EdgeToolbar, Position, type EdgeToolbarProps as ReactFlowEdgeToolbarProps } from '@xyflow/react';
import { Button } from '../../../atoms';

/**
 * FlowEdgeToolbar Component
 * 
 * Enhanced wrapper for React Flow's EdgeToolbar with design system components.
 * Similar to FlowNodeToolbar but for edges.
 * 
 * Single Responsibility: Render edge toolbar with design system Button components.
 */
export interface FlowEdgeToolbarProps extends Omit<ReactFlowEdgeToolbarProps, 'children'> {
  /**
   * Toolbar position relative to edge
   */
  position?: Position | 'top' | 'right' | 'bottom' | 'left';
  /**
   * Toolbar alignment
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
  }>;
  /**
   * Whether toolbar is visible (defaults to true)
   */
  visible?: boolean;
  /**
   * Animation variant
   */
  animation?: 'none' | 'fade' | 'slide' | 'scale';
  children?: React.ReactNode;
}

export function FlowEdgeToolbar({
  actions,
  children,
  position = Position.Top,
  align = 'center',
  visible = true,
  animation = 'fade',
  ...props
}: FlowEdgeToolbarProps) {
  // Don't render if not visible
  if (!visible) {
    return null;
  }
  
  // Animation classes
  const animationClasses = {
    none: '',
    fade: 'animate-in fade-in duration-200',
    slide: 'animate-in slide-in-from-top-1 duration-200',
    scale: 'animate-in zoom-in-95 duration-200',
  };
  
  // Convert string position to Position enum if needed
  const toolbarPosition = typeof position === 'string' 
    ? Position[position.charAt(0).toUpperCase() + position.slice(1) as keyof typeof Position] || Position.Top
    : position;
  
  return (
    <EdgeToolbar 
      position={toolbarPosition}
      align={align}
      {...props}
    >
      <div className={`flex gap-1 ${animationClasses[animation]}`}>
        {actions?.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={action.onClick}
            leftIcon={action.icon}
            disabled={action.disabled}
          >
            {action.label}
          </Button>
        ))}
        {children}
      </div>
    </EdgeToolbar>
  );
}
