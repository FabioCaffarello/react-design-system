/**
 * Edge Routing Strategy
 * 
 * Strategy pattern for different edge routing algorithms.
 */

import { getBezierPath, getSmoothStepPath, getStraightPath } from '@xyflow/react';

/**
 * Edge Routing Strategy Interface
 */
export interface IEdgeRoutingStrategy {
  name: string;
  calculatePath(params: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition: string;
    targetPosition: string;
  }): string;
}

/**
 * Bezier Edge Routing Strategy
 */
export class BezierRoutingStrategy implements IEdgeRoutingStrategy {
  name = 'bezier';

  calculatePath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  }: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition: string;
    targetPosition: string;
  }): string {
    const [path] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition: sourcePosition as unknown,
      targetX,
      targetY,
      targetPosition: targetPosition as unknown,
    });
    return path;
  }
}

/**
 * Smooth Step Edge Routing Strategy
 */
export class SmoothStepRoutingStrategy implements IEdgeRoutingStrategy {
  name = 'smoothstep';

  calculatePath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  }: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition: string;
    targetPosition: string;
  }): string {
    const [path] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition: sourcePosition as unknown,
      targetX,
      targetY,
      targetPosition: targetPosition as unknown,
    });
    return path;
  }
}

/**
 * Step Edge Routing Strategy
 */
export class StepRoutingStrategy implements IEdgeRoutingStrategy {
  name = 'step';

  calculatePath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  }: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition: string;
    targetPosition: string;
  }): string {
    const [path] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition: sourcePosition as unknown,
      targetX,
      targetY,
      targetPosition: targetPosition as unknown,
      borderRadius: 0,
    });
    return path;
  }
}

/**
 * Straight Edge Routing Strategy
 */
export class StraightRoutingStrategy implements IEdgeRoutingStrategy {
  name = 'straight';

  calculatePath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  }: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition: string;
    targetPosition: string;
  }): string {
    const [path] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
    return path;
  }
}

/**
 * Edge Routing Strategy Manager
 */
export class EdgeRoutingStrategyManager {
  private static strategies: Map<string, IEdgeRoutingStrategy> = new Map();

  static {
    // Register default strategies
    this.register(new BezierRoutingStrategy());
    this.register(new SmoothStepRoutingStrategy());
    this.register(new StepRoutingStrategy());
    this.register(new StraightRoutingStrategy());
  }

  /**
   * Register a routing strategy
   */
  static register(strategy: IEdgeRoutingStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  /**
   * Get routing strategy
   */
  static get(name: string): IEdgeRoutingStrategy | undefined {
    return this.strategies.get(name);
  }

  /**
   * Calculate edge path using a strategy
   */
  static calculatePath(
    strategyName: string,
    params: {
      sourceX: number;
      sourceY: number;
      targetX: number;
      targetY: number;
      sourcePosition: string;
      targetPosition: string;
    }
  ): string {
    const strategy = this.get(strategyName);
    if (!strategy) {
      // Default to bezier if strategy not found
      const defaultStrategy = this.get('bezier')!;
      return defaultStrategy.calculatePath(params);
    }
    return strategy.calculatePath(params);
  }

  /**
   * Get available strategies
   */
  static getAvailableStrategies(): string[] {
    return Array.from(this.strategies.keys());
  }
}
