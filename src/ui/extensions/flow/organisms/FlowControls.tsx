'use client';

import React from 'react';
import { Controls, type ControlsProps } from '@xyflow/react';
import { useFlowContext } from './FlowContext';
import { getColorClass, getSpacingClass, getRadiusClass } from '../../../tokens';
import styles from '../styles/modules/FlowControls.module.css';

/**
 * FlowControls Component
 * 
 * Wrapper for React Flow's Controls component with design system tokens.
 * Single Responsibility: Render controls with design system styling.
 */
export interface FlowControlsProps extends Omit<ControlsProps, 'className' | 'position'> {
  className?: string;
  variant?: 'default' | 'minimal' | 'full';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function FlowControls({
  className = '',
  variant = 'default',
  position = 'bottom-left',
  ...props
}: FlowControlsProps) {
  const { theme } = useFlowContext();
  
  // Theme-based styling
  const bgColor = theme === 'dark'
    ? getColorClass('neutral', 'dark', 'bg')
    : getColorClass('neutral', 'light', 'bg');
  
  const borderColor = getColorClass('neutral', 'DEFAULT', 'border');
  const spacing = getSpacingClass('sm', 'p');
  const radius = getRadiusClass('md');
  
  const controlsClasses = `
    ${styles.controls}
    ${variant === 'full' ? '' : styles.horizontal}
    ${bgColor}
    ${borderColor}
    ${spacing}
    ${radius}
    border
    shadow-md
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  // Show/hide controls based on variant
  const showZoomIn = variant === 'full' || variant === 'default';
  const showZoomOut = variant === 'full' || variant === 'default';
  const showFitView = variant === 'full' || variant === 'default';
  const showInteractive = variant === 'full';
  
  return (
    <Controls
      {...props}
      className={controlsClasses}
      showZoom={showZoomIn && showZoomOut}
      showFitView={showFitView}
      showInteractive={showInteractive}
      position={position}
      aria-label="Flow diagram controls"
    />
  );
}
