'use client';

import React, { CSSProperties, useMemo } from 'react';
import { useStore, getBezierPath, type EdgeProps } from '@xyflow/react';
import type { FlowEdgeData } from '../organisms/FlowTypes';
import { getColor } from '../../../tokens/colors';
import { getEdgeParams } from '../utils/floatingEdgeUtils';
import styles from '../styles/modules/CustomEdge.module.css';

/**
 * FloatingEdge Component
 * 
 * Enhanced edge that dynamically adapts to node positions, useful for nodes that can move.
 * Uses React Flow's store to get current node positions and calculates intersection points
 * for better edge routing.
 * 
 * Based on the official React Flow FloatingEdges example with improvements:
 * - Better intersection point calculation
 * - Support for animated edges
 * - Better styling integration
 * - Improved memoization
 */
export type FloatingEdgeProps = EdgeProps<FlowEdgeData>;

export const FloatingEdge = React.memo(({
  id,
  source,
  target,
  style,
  data,
  selected,
}: FloatingEdgeProps) => {
  const { sourceNode, targetNode } = useStore((s) => {
    const sourceNode = s.nodeLookup.get(source);
    const targetNode = s.nodeLookup.get(target);

    return { sourceNode, targetNode };
  });

  if (!sourceNode || !targetNode) {
    return null;
  }

  // Get edge parameters with improved intersection calculation
  const { sx, sy, tx, ty, sourcePos, targetPos } = useMemo(
    () => getEdgeParams(sourceNode, targetNode),
    [sourceNode, targetNode]
  );

  // Calculate path
  const path = useMemo(() => {
    const [pathString] = getBezierPath({
      sourceX: sx,
      sourceY: sy,
      sourcePosition: sourcePos,
      targetPosition: targetPos,
      targetX: tx,
      targetY: ty,
    });
    return pathString;
  }, [sx, sy, tx, ty, sourcePos, targetPos]);

  // Get edge color based on variant or default
  const variant = data?.variant || 'default';
  const colorRole = variant === 'default' ? 'neutral' : variant;
  const colorToken = getColor(colorRole, 'DEFAULT');
  const edgeColorHex = colorToken.hex;
  
  // Animated edge
  const animated = data?.animated || false;

  // Edge styling with better defaults
  const edgeStyle: CSSProperties = useMemo(() => ({
    ...style,
    stroke: edgeColorHex,
    strokeWidth: selected ? 3.5 : 3,
    opacity: selected ? 1 : 0.85,
    filter: selected ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' : undefined,
  }), [style, edgeColorHex, selected]);

  // Edge className
  const edgeClassName = useMemo(() => {
    const classes = [
      'react-flow__edge-path',
      styles.edge,
      selected ? styles.selected : '',
      animated ? styles.animated : '',
    ].filter(Boolean).join(' ');
    return classes;
  }, [selected, animated]);

  return (
    <g className="react-flow__connection">
      <path 
        id={id} 
        className={edgeClassName}
        d={path} 
        style={edgeStyle}
      />
    </g>
  );
}, (prev, next) => {
  // Enhanced comparison for memoization
  if (prev.id === next.id &&
      prev.source === next.source &&
      prev.target === next.target &&
      prev.selected === next.selected &&
      prev.data === next.data) {
    return true;
  }
  
  // Deep comparison of critical data properties
  const prevData = prev.data;
  const nextData = next.data;
  
  if (prevData?.variant !== nextData?.variant ||
      prevData?.animated !== nextData?.animated) {
    return false;
  }
  
  return true;
});

FloatingEdge.displayName = 'FloatingEdge';
