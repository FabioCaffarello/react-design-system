'use client';

import React from 'react';
import type { HTMLAttributes } from 'react';

/**
 * FlowDragHandle Component
 * 
 * Custom drag handle for nodes. Use this component to create a specific area
 * within a node that can be used for dragging, while other parts remain non-draggable.
 * 
 * Add the class "nodrag" to other elements to prevent dragging from those areas.
 * 
 * Single Responsibility: Provide a draggable handle area within a node.
 */
export interface FlowDragHandleProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Icon or content to display in the drag handle
   */
  icon?: React.ReactNode;
  /**
   * Size of the drag handle
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Variant for styling
   */
  variant?: 'default' | 'primary' | 'subtle';
}

export function FlowDragHandle({
  icon,
  size = 'md',
  variant = 'default',
  className = '',
  children,
  ...props
}: FlowDragHandleProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const variantClasses = {
    default: 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500',
    primary: 'bg-blue-500 hover:bg-blue-600',
    subtle: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600',
  };

  return (
    <div
      className={`
        custom-drag-handle
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full
        cursor-grab active:cursor-grabbing
        flex items-center justify-center
        transition-colors
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {icon || children || (
        <div className="w-2 h-2 bg-current opacity-50 rounded-full" />
      )}
    </div>
  );
}
