'use client';

import React, { useMemo } from 'react';
import { Background, type BackgroundProps } from '@xyflow/react';
import { useFlowContext } from './FlowContext';
import { useFlowStylesOptional } from '../hooks/useFlowStyles';
import { getCSSVariable } from '../utils/cssUtils';
import styles from '../styles/modules/FlowBackground.module.css';

/**
 * FlowBackground Component
 * 
 * Wrapper for React Flow's Background component with design system integration.
 * Uses CSS variables from React Flow (--xy-background-*) and integrates with
 * FlowStyleContext for theming support.
 * 
 * @example
 * ```tsx
 * <FlowBackground variant="dots" size={2} />
 * ```
 * 
 * @example
 * ```tsx
 * <FlowBackground 
 *   variant="lines" 
 *   bgColor="#ffffff" 
 *   patternColor="#e5e7eb" 
 * />
 * ```
 */
export interface FlowBackgroundProps extends Omit<BackgroundProps, 'bgColor' | 'patternColor'> {
  /**
   * Background pattern variant
   * @default 'dots'
   */
  variant?: 'dots' | 'lines' | 'cross';
  
  /**
   * Pattern size in pixels
   * @default 2
   */
  size?: number;
  
  /**
   * Custom background color (overrides CSS variable)
   */
  bgColor?: string;
  
  /**
   * Custom pattern color (overrides CSS variable)
   */
  patternColor?: string;
  
  /**
   * Additional CSS class name
   */
  className?: string;
  
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Get CSS variable value with fallback
 */
function getBackgroundCSSVariable(
  varName: string,
  fallback: string,
  customValue?: string
): string {
  // If custom value provided, use it
  if (customValue) {
    return customValue;
  }
  
  // Try to get from computed styles
  const value = getCSSVariable(varName);
  if (value) {
    return value;
  }
  
  // Fallback to default
  return fallback;
}

/**
 * Get pattern color based on variant
 */
function getPatternColorForVariant(
  variant: 'dots' | 'lines' | 'cross',
  customPatternColor?: string,
  flowStyles?: ReturnType<typeof useFlowStylesOptional>
): string {
  // If custom pattern color provided, use it
  if (customPatternColor) {
    return customPatternColor;
  }
  
  // Try to get from FlowStyleContext
  if (flowStyles) {
    const varName = 
      variant === 'dots' ? 'backgroundPatternDotsColor' :
      variant === 'lines' ? 'backgroundPatternLinesColor' :
      'backgroundPatternCrossColor';
    
    const themeValue = flowStyles.getVariable(varName);
    if (themeValue) {
      return themeValue;
    }
  }
  
  // Try CSS variables from React Flow
  const cssVarName = 
    variant === 'dots' ? '--xy-background-pattern-dots-color-default' :
    variant === 'lines' ? '--xy-background-pattern-lines-color-default' :
    '--xy-background-pattern-cross-color-default';
  
  const cssValue = getCSSVariable(cssVarName);
  if (cssValue) {
    return cssValue;
  }
  
  // Fallback values
  const fallbacks = {
    dots: '#91919a',
    lines: '#e5e7eb',
    cross: '#e2e2e2',
  };
  
  return fallbacks[variant];
}

export function FlowBackground({
  variant = 'dots',
  size = 2,
  bgColor: customBgColor,
  patternColor: customPatternColor,
  className,
  style,
  ...props
}: FlowBackgroundProps) {
  const { theme } = useFlowContext();
  const flowStyles = useFlowStylesOptional();
  
  // Get background color with fallback chain
  const bgColor = useMemo(() => {
    return getBackgroundCSSVariable(
      '--xy-background-color-default',
      theme === 'dark' ? '#141414' : 'transparent',
      customBgColor
    );
  }, [customBgColor, theme, flowStyles]);
  
  // Get pattern color based on variant
  const patternColor = useMemo(() => {
    return getPatternColorForVariant(variant, customPatternColor, flowStyles);
  }, [variant, customPatternColor, flowStyles]);
  
  // Combine className
  const combinedClassName = useMemo(() => {
    const classes = [styles.background];
    if (className) {
      classes.push(className);
    }
    return classes.join(' ');
  }, [className]);
  
  return (
    <div className={combinedClassName} style={style}>
      <Background
        {...props}
        variant={variant}
        size={size}
        bgColor={bgColor}
        patternColor={patternColor}
        className={styles.pattern}
      />
    </div>
  );
}
