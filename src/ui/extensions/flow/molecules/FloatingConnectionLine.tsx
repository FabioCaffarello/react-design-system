'use client';

import React, { useMemo } from 'react';
import { getBezierPath, type ConnectionLineComponentProps, type InternalNode } from '@xyflow/react';
import { getNodeIntersection } from '../utils/floatingEdgeUtils';

/**
 * FloatingConnectionLine Component
 * 
 * Connection line component for floating edges that shows a preview
 * of the edge being created. Uses the same intersection calculation
 * as FloatingEdge for consistency.
 * 
 * Based on the official React Flow FloatingConnectionLine example.
 */
export function FloatingConnectionLine({
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode,
}: ConnectionLineComponentProps) {
  if (!fromNode) {
    return null;
  }

  // Create a target node at the connection point
  const targetNode = useMemo(() => ({
    id: 'connection-target',
    width: 1,
    height: 1,
    internals: {
      positionAbsolute: { x: toX, y: toY },
    },
    measured: {
      width: 1,
      height: 1,
    },
  } as InternalNode), [toX, toY]);

  // Get edge parameters
  const { sx, sy } = useMemo(() => {
    const sourceIntersectionPoint = getNodeIntersection(fromNode, targetNode);
    return {
      sx: sourceIntersectionPoint.x,
      sy: sourceIntersectionPoint.y,
    };
  }, [fromNode, targetNode]);

  // Calculate path
  const path = useMemo(() => {
    const [pathString] = getBezierPath({
      sourceX: sx,
      sourceY: sy,
      sourcePosition: fromPosition,
      targetPosition: toPosition,
      targetX: toX,
      targetY: toY,
    });
    return pathString;
  }, [sx, sy, fromPosition, toPosition, toX, toY]);

  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={path}
        style={{
          strokeDasharray: '5',
          animation: 'dashdraw 0.5s linear infinite',
        }}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
}
