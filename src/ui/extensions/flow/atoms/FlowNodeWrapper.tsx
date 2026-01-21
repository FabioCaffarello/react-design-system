'use client';

import type { ReactNode, HTMLAttributes } from 'react';
import { useFlowContext } from '../organisms/FlowContext';
import { getColorClass, getSpacingClass, getRadiusClass, getShadowClass } from '../../../tokens';
import styles from '../styles/modules/FlowNodeWrapper.module.css';

/**
 * FlowNodeWrapper Component
 * 
 * Wrapper for node styling with design system tokens.
 * Enhanced with support for resizing, grouped nodes (parent/child),
 * custom styles, and animations.
 * 
 * Single Responsibility: Provide consistent styling wrapper for nodes with advanced features.
 */
export interface FlowNodeWrapperProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  selected?: boolean;
  children: ReactNode;
  /**
   * Whether this is a child node (inside a parent node)
   */
  isChild?: boolean;
  /**
   * Whether this is a parent node (contains child nodes)
   */
  isParent?: boolean;
  /**
   * Enable resizing capability (requires NodeResizer from @xyflow/react)
   */
  resizable?: boolean;
  /**
   * Animation variant
   */
  animation?: 'none' | 'fade' | 'slide' | 'scale';
  /**
   * Custom style override
   */
  customStyle?: React.CSSProperties;
}

export function FlowNodeWrapper({
  variant = 'default',
  size = 'md',
  selected = false,
  className = '',
  children,
  isChild = false,
  isParent = false,
  resizable: _resizable = false,
  animation = 'fade',
  customStyle,
  ...props
}: FlowNodeWrapperProps) {
  const { theme: _theme } = useFlowContext();
  
  // Base color - use transparent for wrapper when Card is used inside
  const colorRole = variant === 'default' ? 'neutral' : variant;
  // Note: Background is handled by Card component, wrapper should be transparent
  const bgColorClass = 'bg-transparent';
  
  // Border color - removed as Card handles borders
  const _borderColorClass = '';
  
  // Spacing based on size
  const _spacingClasses = {
    sm: getSpacingClass('sm', 'p'),
    md: getSpacingClass('md', 'p'),
    lg: getSpacingClass('lg', 'p'),
    xl: getSpacingClass('xl', 'p'),
  };
  
  // Radius
  const _radiusClass = getRadiusClass('lg');
  
  // Shadow
  const _shadowClass = selected ? getShadowClass('lg') : getShadowClass('md');
  
  // Selection indicator
  const _selectionClass = selected
    ? `ring-2 ring-offset-2 ${getColorClass(colorRole, 'DEFAULT', 'ring')}`
    : '';
  
  // Child node styling (lighter, smaller)
  const _childNodeClass = isChild ? 'opacity-90 scale-95' : '';
  
  // Parent node styling (stronger border, more padding)
  const _parentNodeClass = isParent ? 'border-2' : '';
  
  // CSS module classes
  const moduleClasses = [
    styles.wrapper,
    selected ? styles.selected : '',
    size === 'sm' ? styles.wrapperSmall :
    size === 'lg' ? styles.wrapperLarge :
    size === 'xl' ? styles.wrapperExtraLarge :
    styles.wrapperMedium,
    isChild ? styles.wrapperChild : '',
    isParent ? styles.wrapperParent : '',
    animation === 'fade' ? styles.wrapperFade :
    animation === 'slide' ? styles.wrapperSlide :
    animation === 'scale' ? styles.wrapperScale : '',
  ].filter(Boolean).join(' ');
  
  // Combined classes (CSS modules + Tailwind utilities)
  // Note: When used with Card, spacing/radius/shadow are handled by Card
  const wrapperClasses = `
    ${moduleClasses}
    ${bgColorClass}
    transition-all
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  // Combine custom style with default
  const combinedStyle: React.CSSProperties = {
    position: 'relative',
    ...customStyle,
  };
  
  // ARIA attributes for accessibility
  const ariaProps = {
    role: props.role || 'group',
    'aria-label': props['aria-label'] || (selected ? 'Selected node' : 'Flow node'),
    'aria-selected': props['aria-selected'] !== undefined ? props['aria-selected'] : selected,
    tabIndex: props.tabIndex !== undefined ? props.tabIndex : (selected ? 0 : -1),
  };

  return (
    <div
      className={wrapperClasses}
      style={combinedStyle}
      {...ariaProps}
      {...props}
    >
      {children}
    </div>
  );
}
