'use client';

import React, { useMemo } from 'react';
import { 
  BaseEdge, 
  EdgeLabelRenderer, 
  EdgeText,
  getBezierPath,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
  MarkerType,
} from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { useFlowContext } from '../organisms/FlowContext';
import { FlowEdgeToolbar } from '../organisms/FlowEdgeToolbar';
import type { FlowEdgeData } from '../organisms/FlowTypes';
import { getColor } from '../../../tokens/colors';
import { filterAllProps } from '../utils/propFilters';
import styles from '../styles/modules/CustomEdge.module.css';

/**
 * CustomEdge Component
 * 
 * Enhanced custom edge component with support for multiple edge types,
 * custom markers, advanced labels with styling, JSX/ReactNode labels,
 * and edge toolbar integration.
 * Uses React.memo for performance optimization.
 * 
 * @example
 * ```tsx
 * <CustomEdge
 *   data={{
 *     edgeType: 'simplebezier',
 *     label: 'Custom Label',
 *     markerEnd: { type: MarkerType.ArrowClosed },
 *     animated: true
 *   }}
 * />
 * ```
 */
export interface CustomEdgeData extends FlowEdgeData {
  /**
   * Edge type: 'default' | 'bezier' | 'simplebezier' | 'smoothstep' | 'step' | 'straight'
   */
  edgeType?: 'default' | 'bezier' | 'simplebezier' | 'smoothstep' | 'step' | 'straight';
  /**
   * Label can be string or ReactNode
   */
  label?: string | React.ReactNode;
  /**
   * Label styling
   */
  labelStyle?: React.CSSProperties;
  /**
   * Label background style
   */
  labelBgStyle?: React.CSSProperties;
  /**
   * Label background padding [horizontal, vertical]
   */
  labelBgPadding?: [number, number];
  /**
   * Label background border radius
   */
  labelBgBorderRadius?: number;
  /**
   * Show label background
   */
  labelShowBg?: boolean;
  /**
   * Custom marker configuration for start
   */
  customMarkerStart?: {
    type: MarkerType;
    color?: string;
    width?: number;
    height?: number;
    strokeWidth?: number;
    orient?: 'auto' | 'auto-start-reverse';
    markerUnits?: 'userSpaceOnUse' | 'strokeWidth';
  };
  /**
   * Custom marker configuration for end
   */
  customMarkerEnd?: {
    type: MarkerType;
    color?: string;
    width?: number;
    height?: number;
    strokeWidth?: number;
    orient?: 'auto' | 'auto-start-reverse';
    markerUnits?: 'userSpaceOnUse' | 'strokeWidth';
  };
  /**
   * Edge toolbar configuration
   */
  toolbarConfig?: {
    visible?: boolean;
    actions?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      variant?: 'primary' | 'regular' | 'secondary' | 'error' | 'outline' | 'ghost';
    }>;
  };
  /**
   * Path length for animated edges (used with stroke-dasharray)
   */
  pathLength?: number;
  /**
   * Custom CSS class name for the edge
   */
  customClassName?: string;
}

export type CustomEdgeProps = EdgeProps<CustomEdgeData>;

export const CustomEdge = React.memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  style,
  markerEnd: defaultMarkerEnd,
  markerStart: defaultMarkerStart,
  ...props
}: CustomEdgeProps) => {
  // Get edge color based on variant or default
  const variant = data?.variant || 'default';
  const colorRole = variant === 'default' ? 'neutral' : variant;
  const colorToken = getColor(colorRole, 'DEFAULT');
  const edgeColorHex = colorToken.hex;
  
  // Edge type
  const edgeType = data?.edgeType || 'default';
  
  // Animated edge
  const animated = data?.animated || false;
  
  // Memoize path calculation based on edge type
  const { path, labelX, labelY } = useMemo(() => {
    if (edgeType === 'smoothstep' || edgeType === 'step') {
      const [smoothPath, labelXPos, labelYPos] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: edgeType === 'step' ? 0 : 20,
      });
      return { path: smoothPath, labelX: labelXPos, labelY: labelYPos };
    } else if (edgeType === 'straight') {
      const [straightPath, labelXPos, labelYPos] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
      });
      return { path: straightPath, labelX: labelXPos, labelY: labelYPos };
    } else if (edgeType === 'simplebezier') {
      const [simpleBezierPath, labelXPos, labelYPos] = getSimpleBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
      return { path: simpleBezierPath, labelX: labelXPos, labelY: labelYPos };
    } else {
      // Default bezier with adjusted curvature for better connection visibility
      // Based on React Flow documentation: curvature between 0.25-0.5 provides good visibility
      const [bezierPath, labelXPos, labelYPos] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        curvature: 0.3, // Slightly increased for better visibility (documentation recommends 0.25-0.5)
      });
      return { path: bezierPath, labelX: labelXPos, labelY: labelYPos };
    }
  }, [edgeType, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition]);
  
  // Marker configuration - use custom markers if provided, otherwise use defaults
  const markerStart = useMemo(() => {
    if (data?.customMarkerStart) {
      const { type, color, width = 20, height = 20, strokeWidth = 2, orient, markerUnits } = data.customMarkerStart;
      return {
        type,
        color: color || edgeColorHex,
        width,
        height,
        strokeWidth,
        orient,
        markerUnits,
      };
    }
    return defaultMarkerStart;
  }, [data?.customMarkerStart, defaultMarkerStart, edgeColorHex]);
  
  const markerEnd = useMemo(() => {
    if (data?.customMarkerEnd) {
      const { type, color, width = 20, height = 20, strokeWidth = 2, orient, markerUnits } = data.customMarkerEnd;
      return {
        type,
        color: color || edgeColorHex,
        width,
        height,
        strokeWidth,
        orient,
        markerUnits,
      };
    }
    // If no custom marker and no default, use arrowclosed as fallback (documentation best practice)
    if (!defaultMarkerEnd) {
      return {
        type: MarkerType.ArrowClosed,
        color: edgeColorHex,
        width: 20,
        height: 20,
      };
    }
    return defaultMarkerEnd;
  }, [data?.customMarkerEnd, defaultMarkerEnd, edgeColorHex]);
  
  // Combined styles - ensure edges are visible with proper stroke color and width
  // Based on React Flow documentation best practices
  const edgeStyle: React.CSSProperties = useMemo(() => ({
    ...style,
    stroke: style?.stroke || edgeColorHex, // Use provided stroke or default color
    strokeWidth: style?.strokeWidth || (selected ? 3.5 : 3), // Increased width for better visibility
    opacity: style?.opacity !== undefined ? style.opacity : (selected ? 1 : 0.9), // Better opacity for visibility
    filter: selected ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' : undefined, // Subtle shadow when selected
  }), [style, edgeColorHex, selected]);
  
  // Filter out React Flow internal props and boolean attributes before passing to BaseEdge
  const filteredProps = useMemo(() => filterAllProps(props), [props]);
  
  // Label configuration
  const label = data?.label;
  const labelStyle = data?.labelStyle || {};
  const labelBgStyle = data?.labelBgStyle || { fill: 'white', fillOpacity: 0.8 };
  const labelBgPadding = data?.labelBgPadding || [8, 4];
  const labelBgBorderRadius = data?.labelBgBorderRadius || 4;
  const labelShowBg = data?.labelShowBg !== false;
  
  // Edge className
  const edgeClassName = useMemo(() => {
    const classes = [
      styles.edge,
      selected ? styles.selected : '',
      animated ? styles.animated : '',
      data?.customClassName || '',
    ].filter(Boolean).join(' ');
    return classes;
  }, [selected, animated, data?.customClassName]);
  
  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        style={edgeStyle}
        markerEnd={markerEnd}
        markerStart={markerStart}
        pathLength={data?.pathLength}
        className={edgeClassName}
        {...filteredProps}
      />
      {label && (
        <EdgeText
          x={labelX}
          y={labelY}
          label={label}
          labelStyle={labelStyle}
          labelShowBg={labelShowBg}
          labelBgStyle={labelBgStyle}
          labelBgPadding={labelBgPadding}
          labelBgBorderRadius={labelBgBorderRadius}
          className={styles.edgeLabel}
        />
      )}
      {data?.toolbarConfig?.visible !== false && data?.toolbarConfig?.actions && (
        <FlowEdgeToolbar
          visible={data.toolbarConfig.visible}
          actions={data.toolbarConfig.actions}
        />
      )}
    </>
  );
}, (prev, next) => {
  // Enhanced comparison for memoization
  // Quick reference equality check
  if (prev.id === next.id &&
      prev.sourceX === next.sourceX &&
      prev.sourceY === next.sourceY &&
      prev.targetX === next.targetX &&
      prev.targetY === next.targetY &&
      prev.selected === next.selected &&
      prev.data === next.data &&
      prev.sourcePosition === next.sourcePosition &&
      prev.targetPosition === next.targetPosition &&
      prev.markerEnd === next.markerEnd &&
      prev.markerStart === next.markerStart) {
    return true;
  }
  
  // Deep comparison of critical data properties
  const prevData = prev.data;
  const nextData = next.data;
  
  if (prevData?.edgeType !== nextData?.edgeType ||
      prevData?.variant !== nextData?.variant ||
      prevData?.animated !== nextData?.animated ||
      prevData?.label !== nextData?.label ||
      prevData?.pathLength !== nextData?.pathLength ||
      prevData?.customClassName !== nextData?.customClassName) {
    return false;
  }
  
  // Compare marker configurations
  if (prevData?.customMarkerStart !== nextData?.customMarkerStart ||
      prevData?.customMarkerEnd !== nextData?.customMarkerEnd) {
    return false;
  }
  
  // Compare toolbar config
  if (prevData?.toolbarConfig?.visible !== nextData?.toolbarConfig?.visible ||
      prevData?.toolbarConfig?.actions?.length !== nextData?.toolbarConfig?.actions?.length) {
    return false;
  }
  
  return true;
});

CustomEdge.displayName = 'CustomEdge';
