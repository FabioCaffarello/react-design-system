/**
 * Geometry Utilities
 * 
 * Utility functions for geometry calculations in Flow diagrams.
 * Based on examples from react-flow repository.
 */

import { Position, XYPosition, Node, Edge, InternalNode } from '@xyflow/react';

/**
 * Get node intersection point
 * 
 * Returns the intersection point of the line between the center of the
 * intersectionNode and the target node.
 * Based on: https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
 */
export function getNodeIntersection(intersectionNode: InternalNode, targetNode: InternalNode): XYPosition {
  const { internals: intersectionInternals } = intersectionNode;
  const { width: intersectionNodeWidth, height: intersectionNodeHeight } = intersectionNode.measured ?? {
    width: 0,
    height: 0,
  };
  const targetPosition = targetNode.internals.positionAbsolute;

  const w = (intersectionNodeWidth ?? 0) / 2;
  const h = (intersectionNodeHeight ?? 0) / 2;

  const x2 = intersectionInternals.positionAbsolute.x + w;
  const y2 = intersectionInternals.positionAbsolute.y + h;
  const x1 = targetPosition.x + w;
  const y1 = targetPosition.y + h;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

/**
 * Get edge position
 * 
 * Returns the position (top, right, bottom or left) of the node compared to the intersection point.
 */
export function getEdgePosition(node: InternalNode, intersectionPoint: XYPosition): Position {
  const n = { ...node.internals.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + (n.measured?.width ?? 0) - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + (n.measured?.height ?? 0) - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

/**
 * Get edge parameters
 * 
 * Returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) needed to create an edge.
 * Used for floating edges.
 */
export function getEdgeParams(source: InternalNode, target: InternalNode) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

/**
 * Create nodes and edges in a circular pattern
 * 
 * Useful for creating test flows or example flows.
 */
export function createCircularFlow(
  center: XYPosition,
  radius: number,
  nodeCount: number,
  centerNode?: { id: string; data: any }
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Add center node if provided
  if (centerNode) {
    nodes.push({
      id: centerNode.id,
      data: centerNode.data,
      position: center,
    });
  }

  // Create nodes in circle
  for (let i = 0; i < nodeCount; i++) {
    const degrees = i * (360 / nodeCount);
    const radians = degrees * (Math.PI / 180);
    const x = radius * Math.cos(radians) + center.x;
    const y = radius * Math.sin(radians) + center.y;

    nodes.push({
      id: `node-${i}`,
      data: { label: `Node ${i}` },
      position: { x, y },
    });

    // Create edges
    if (centerNode) {
      edges.push({
        id: `edge-${centerNode.id}-${i}`,
        source: centerNode.id,
        target: `node-${i}`,
      });
    } else if (i > 0) {
      edges.push({
        id: `edge-${i - 1}-${i}`,
        source: `node-${i - 1}`,
        target: `node-${i}`,
      });
    }
  }

  // Close the circle if no center node
  if (!centerNode && nodeCount > 0) {
    edges.push({
      id: `edge-${nodeCount - 1}-0`,
      source: `node-${nodeCount - 1}`,
      target: 'node-0',
    });
  }

  return { nodes, edges };
}

/**
 * Calculate distance between two points
 */
export function getDistance(point1: XYPosition, point2: XYPosition): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle between two points
 */
export function getAngle(point1: XYPosition, point2: XYPosition): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

/**
 * Get bounding box for nodes
 */
export function getNodesBoundingBox(nodes: Node[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  center: XYPosition;
} {
  if (nodes.length === 0) {
    return {
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: 0,
      height: 0,
      center: { x: 0, y: 0 },
    };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    const x = node.position.x;
    const y = node.position.y;
    const width = node.width || 150;
    const height = node.height || 50;

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    center: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
    },
  };
}
