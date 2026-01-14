'use client';

import React from 'react';
import { Panel, type PanelProps } from '@xyflow/react';
import { getColorClass, getSpacingClass, getRadiusClass, getShadowClass } from '../../../tokens';
import { useFlowContext } from './FlowContext';

/**
 * FlowPanel Component
 * 
 * Wrapper for React Flow's Panel component with design system tokens.
 * Single Responsibility: Render panel with design system styling.
 */
export interface FlowPanelProps extends PanelProps {
  variant?: 'default' | 'elevated' | 'outlined';
}

export function FlowPanel({
  variant = 'default',
  className = '',
  ...props
}: FlowPanelProps) {
  const { theme } = useFlowContext();
  
  // Theme-based styling
  const bgColor = theme === 'dark'
    ? getColorClass('neutral', 'dark', 'bg')
    : getColorClass('neutral', 'light', 'bg');
  
  const borderColor = getColorClass('neutral', 'DEFAULT', 'border');
  const spacing = getSpacingClass('md', 'p');
  const radius = getRadiusClass('lg');
  const shadow = variant === 'elevated' ? getShadowClass('lg') : getShadowClass('sm');
  
  const panelClasses = `
    ${bgColor}
    ${variant === 'outlined' ? `${borderColor} border` : ''}
    ${spacing}
    ${radius}
    ${shadow}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <Panel
      {...props}
      className={panelClasses}
    />
  );
}
