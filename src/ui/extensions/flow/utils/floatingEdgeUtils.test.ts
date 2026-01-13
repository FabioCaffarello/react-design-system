import { describe, it, expect } from 'vitest';
import { Position } from '@xyflow/react';
import { getNodeIntersection, getEdgePosition, getEdgeParams } from './floatingEdgeUtils';
import type { InternalNode } from '@xyflow/react';

describe('floatingEdgeUtils', () => {
  const createMockNode = (
    id: string,
    x: number,
    y: number,
    width: number = 100,
    height: number = 50
  ): InternalNode => ({
    id,
    type: 'default',
    position: { x, y },
    data: {},
    measured: { width, height },
    internals: {
      positionAbsolute: { x, y },
      width,
      height,
    },
  } as InternalNode);
  
  describe('getNodeIntersection', () => {
    it('calculates intersection point between two nodes', () => {
      const sourceNode = createMockNode('1', 0, 0, 100, 50);
      const targetNode = createMockNode('2', 200, 0, 100, 50);
      
      const intersection = getNodeIntersection(sourceNode, targetNode);
      
      expect(intersection).toHaveProperty('x');
      expect(intersection).toHaveProperty('y');
      expect(typeof intersection.x).toBe('number');
      expect(typeof intersection.y).toBe('number');
    });
    
    it('handles nodes at different positions', () => {
      const sourceNode = createMockNode('1', 0, 0, 100, 50);
      const targetNode = createMockNode('2', 0, 200, 100, 50);
      
      const intersection = getNodeIntersection(sourceNode, targetNode);
      
      expect(intersection.x).toBeGreaterThanOrEqual(0);
      expect(intersection.y).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('getEdgePosition', () => {
    it('returns Position.Left for intersection on left side', () => {
      const node = createMockNode('1', 100, 100, 100, 50);
      const intersectionPoint = { x: 100, y: 125 };
      
      const position = getEdgePosition(node, intersectionPoint);
      
      expect(position).toBe(Position.Left);
    });
    
    it('returns Position.Right for intersection on right side', () => {
      const node = createMockNode('1', 100, 100, 100, 50);
      const intersectionPoint = { x: 200, y: 125 };
      
      const position = getEdgePosition(node, intersectionPoint);
      
      expect(position).toBe(Position.Right);
    });
    
    it('returns Position.Top for intersection on top', () => {
      const node = createMockNode('1', 100, 100, 100, 50);
      const intersectionPoint = { x: 150, y: 100 };
      
      const position = getEdgePosition(node, intersectionPoint);
      
      expect(position).toBe(Position.Top);
    });
    
    it('returns Position.Bottom for intersection on bottom', () => {
      const node = createMockNode('1', 100, 100, 100, 50);
      const intersectionPoint = { x: 150, y: 150 };
      
      const position = getEdgePosition(node, intersectionPoint);
      
      expect(position).toBe(Position.Bottom);
    });
  });
  
  describe('getEdgeParams', () => {
    it('returns edge parameters for two nodes', () => {
      const sourceNode = createMockNode('1', 0, 0, 100, 50);
      const targetNode = createMockNode('2', 200, 0, 100, 50);
      
      const params = getEdgeParams(sourceNode, targetNode);
      
      expect(params).toHaveProperty('sx');
      expect(params).toHaveProperty('sy');
      expect(params).toHaveProperty('tx');
      expect(params).toHaveProperty('ty');
      expect(params).toHaveProperty('sourcePos');
      expect(params).toHaveProperty('targetPos');
      expect([Position.Left, Position.Right, Position.Top, Position.Bottom]).toContain(params.sourcePos);
      expect([Position.Left, Position.Right, Position.Top, Position.Bottom]).toContain(params.targetPos);
    });
  });
});
