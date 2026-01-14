/**
 * Layout Strategy
 * 
 * Strategy pattern interface for layout algorithms.
 */

import type { Node, Edge } from '@xyflow/react';
import type { LayoutStrategyName, LayoutOptions, LayoutResult } from '../organisms/FlowTypes';
import { LayoutRegistry } from '../registries/LayoutRegistry';

/**
 * Layout Strategy Interface
 */
export interface ILayoutStrategy {
  name: LayoutStrategyName;
  calculate(nodes: Node[], edges: Edge[], options?: LayoutOptions): Promise<LayoutResult>;
  getDefaultOptions(): LayoutOptions;
  validate?(options: LayoutOptions): boolean;
}

/**
 * Layout Strategy Manager
 * 
 * Manages and executes layout strategies using the registry.
 */
export class LayoutStrategyManager {
  /**
   * Calculate layout using a strategy
   */
  static async calculate(
    strategyName: LayoutStrategyName,
    nodes: Node[],
    edges: Edge[],
    options?: LayoutOptions
  ): Promise<LayoutResult> {
    return LayoutRegistry.calculateLayout(strategyName, nodes, edges, options);
  }

  /**
   * Get available strategies
   */
  static getAvailableStrategies(): LayoutStrategyName[] {
    return LayoutRegistry.getNames();
  }

  /**
   * Get strategy metadata
   */
  static getStrategyMetadata(name: LayoutStrategyName) {
    const strategy = LayoutRegistry.get(name);
    return strategy?.metadata;
  }

  /**
   * Validate options for a strategy
   */
  static validateOptions(name: LayoutStrategyName, options: LayoutOptions): boolean {
    const strategy = LayoutRegistry.get(name);
    if (!strategy) {
      return false;
    }
    
    if (strategy.validate) {
      return strategy.validate(options);
    }
    
    return true;
  }
}
