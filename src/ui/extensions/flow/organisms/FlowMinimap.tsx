'use client';

import React from 'react';
import { MiniMap, type MiniMapProps } from '@xyflow/react';
import { useFlowContext } from './FlowContext';
import { getColorClass, getSpacingClass, getRadiusClass } from '../../../tokens';
import styles from '../styles/modules/FlowMinimap.module.css';

/**
 * FlowMinimap Component
 * 
 * Wrapper for React Flow's MiniMap component with design system tokens.
 * Single Responsibility: Render minimap with design system styling.
 */
export interface FlowMinimapProps extends Omit<MiniMapProps, 'className'> {
  className?: string;
  nodeColor?: (node: unknown) => string;
}

export function FlowMinimap({
  className = '',
  nodeColor,
  ...props
}: FlowMinimapProps) {
  const { theme } = useFlowContext();
  
  // Theme-based styling
  const bgColor = theme === 'dark'
    ? getColorClass('neutral', 'dark', 'bg')
    : getColorClass('neutral', 'light', 'bg');
  
  const borderColor = getColorClass('neutral', 'DEFAULT', 'border');
  const spacing = getSpacingClass('sm', 'p');
  const radius = getRadiusClass('md');
  
  const minimapClasses = `
    ${styles.minimap}
    ${bgColor}
    ${borderColor}
    ${spacing}
    ${radius}
    border
    shadow-md
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  // Default node color function
  const defaultNodeColor = (node: unknown) => {
    const variant = node.data?.variant || 'default';
    const colorRole = variant === 'default' ? 'neutral' : variant;
    return getColorClass(colorRole, 'DEFAULT', 'bg').replace('bg-', '');
  };
  
  return (
    <MiniMap
      {...props}
      className={minimapClasses}
      nodeColor={nodeColor || defaultNodeColor}
      maskColor={theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'}
      aria-label="Flow diagram minimap"
    />
  );
}
