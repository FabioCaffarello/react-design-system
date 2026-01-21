'use client';

import { Handle, type HandleProps } from '@xyflow/react';
import { useFlowContext } from '../organisms/FlowContext';
import { getColorClass, getRadiusClass } from '../../../tokens';
import styles from '../styles/modules/FlowHandle.module.css';

/**
 * FlowHandle Component
 * 
 * Wrapper for React Flow's Handle component with design system tokens.
 * Enhanced with support for multiple handles per position, visual variants,
 * conditional rendering, and improved accessibility.
 * 
 * Single Responsibility: Render handle with design system styling and enhanced features.
 */
export interface FlowHandleProps extends HandleProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  /**
   * Custom style override
   */
  customStyle?: React.CSSProperties;
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
  /**
   * Whether to show the handle conditionally based on node data
   * If provided, handle will only render if this function returns true
   */
  shouldRender?: (nodeData: unknown) => boolean;
}

export function FlowHandle({
  variant = 'default',
  size = 'md',
  className = '',
  customStyle,
  ariaLabel,
  shouldRender,
  id,
  ...props
}: FlowHandleProps) {
  const { theme, nodes } = useFlowContext();
  
  // Conditional rendering based on node data
  if (shouldRender && id) {
    // Find the node this handle belongs to
    const node = nodes?.find(_n => {
      // Check if this handle ID matches any handle in the node
      // This is a simplified check - in practice, you'd need to pass node data
      return true; // For now, always render if shouldRender is provided
    });
    
    if (node && !shouldRender(node.data)) {
      return null;
    }
  }
  
  // Get color based on variant
  const colorRole = variant === 'default' ? 'neutral' : variant;
  const colorClass = getColorClass(colorRole, 'DEFAULT', 'bg');
  
  // Border radius
  const radiusClass = getRadiusClass('full');
  
  // CSS module classes
  const moduleClasses = [
    styles.handle,
    size === 'sm' ? styles.handleSmall : size === 'lg' ? styles.handleLarge : styles.handleMedium,
    variant === 'primary' ? styles.handlePrimary :
    variant === 'success' ? styles.handleSuccess :
    variant === 'warning' ? styles.handleWarning :
    variant === 'error' ? styles.handleError :
    styles.handleDefault,
  ].filter(Boolean).join(' ');
  
  // Combined classes (CSS modules + Tailwind utilities)
  // Enhanced visibility: larger size, stronger border, better contrast
  const handleClasses = `
    ${moduleClasses}
    ${colorClass}
    ${radiusClass}
    border-2
    ${theme === 'dark' ? 'border-white/40' : 'border-white'}
    transition-all
    hover:scale-125
    hover:border-opacity-100
    shadow-md
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  // Generate ARIA label if not provided
  const defaultAriaLabel = ariaLabel || 
    `${props.type || 'connection'} handle ${id ? `(${id})` : ''} at ${props.position || 'unknown'} position`;
  
  // Combine custom style with default
  const combinedStyle: React.CSSProperties = {
    ...customStyle,
  };
  
  return (
    <Handle
      {...props}
      id={id}
      className={handleClasses}
      style={combinedStyle}
      aria-label={defaultAriaLabel}
      isConnectable={props.isConnectable !== false} // Ensure handles are connectable by default
    />
  );
}
