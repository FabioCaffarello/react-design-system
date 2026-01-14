/**
 * Layout Registry
 * 
 * Registry pattern for managing layout strategies.
 */

import type { LayoutStrategyName, LayoutOptions, LayoutResult } from '../organisms/FlowTypes';
import type { Node, Edge } from '@xyflow/react';
import { layoutEngine } from '../utils/layoutEngine';

/**
 * Layout Strategy Definition
 */
export interface LayoutStrategyDefinition {
  name: LayoutStrategyName;
  calculate: (nodes: Node[], edges: Edge[], options?: LayoutOptions) => Promise<LayoutResult>;
  getDefaultOptions: () => LayoutOptions;
  validate?: (options: LayoutOptions) => boolean;
  metadata?: {
    description?: string;
    supportsDirection?: boolean;
    supportsSpacing?: boolean;
  };
}

/**
 * Default layout strategies
 */
const defaultStrategies: Record<LayoutStrategyName, LayoutStrategyDefinition> = {
  dagre: {
    name: 'dagre',
    calculate: async (nodes, edges, options) => {
      return layoutEngine.calculate('dagre', nodes, edges, options);
    },
    getDefaultOptions: () => ({
      direction: 'TB',
      nodeWidth: 150,
      nodeHeight: 100,
      spacing: 50,
    }),
    validate: (options) => {
      return ['TB', 'BT', 'LR', 'RL'].includes(options.direction || 'TB');
    },
    metadata: {
      description: 'Hierarchical layout using Dagre algorithm',
      supportsDirection: true,
      supportsSpacing: true,
    },
  },
  elk: {
    name: 'elk',
    calculate: async (nodes, edges, options) => {
      return layoutEngine.calculate('elk', nodes, edges, options);
    },
    getDefaultOptions: () => ({
      direction: 'TB',
      nodeWidth: 150,
      nodeHeight: 100,
      spacing: 50,
    }),
    validate: (options) => {
      return ['TB', 'BT', 'LR', 'RL'].includes(options.direction || 'TB');
    },
    metadata: {
      description: 'Advanced hierarchical layout using ELK algorithm',
      supportsDirection: true,
      supportsSpacing: true,
    },
  },
  force: {
    name: 'force',
    calculate: async (nodes, edges, options) => {
      return layoutEngine.calculate('force', nodes, edges, options);
    },
    getDefaultOptions: () => ({
      spacing: 100,
    }),
    validate: () => true,
    metadata: {
      description: 'Force-directed layout using physics simulation',
      supportsDirection: false,
      supportsSpacing: true,
    },
  },
};

/**
 * Layout Registry
 * 
 * Manages registration and retrieval of layout strategies.
 */
export class LayoutRegistry {
  private static registry: Map<LayoutStrategyName, LayoutStrategyDefinition> = new Map();

  /**
   * Initialize with default strategies
   */
  static initialize() {
    if (this.registry.size === 0) {
      Object.values(defaultStrategies).forEach((strategy) => {
        this.registry.set(strategy.name, strategy);
      });
    }
  }

  /**
   * Register a new layout strategy
   */
  static register(strategy: LayoutStrategyDefinition): void {
    this.registry.set(strategy.name, strategy);
  }

  /**
   * Get a layout strategy
   */
  static get(name: LayoutStrategyName): LayoutStrategyDefinition | undefined {
    this.initialize();
    return this.registry.get(name);
  }

  /**
   * Get all registered strategies
   */
  static getAll(): LayoutStrategyDefinition[] {
    this.initialize();
    return Array.from(this.registry.values());
  }

  /**
   * Get all strategy names
   */
  static getNames(): LayoutStrategyName[] {
    this.initialize();
    return Array.from(this.registry.keys());
  }

  /**
   * Check if a strategy is registered
   */
  static has(name: LayoutStrategyName): boolean {
    this.initialize();
    return this.registry.has(name);
  }

  /**
   * Remove a layout strategy
   */
  static unregister(name: LayoutStrategyName): boolean {
    return this.registry.delete(name);
  }

  /**
   * Calculate layout using a registered strategy
   */
  static async calculateLayout(
    name: LayoutStrategyName,
    nodes: Node[],
    edges: Edge[],
    options?: LayoutOptions
  ): Promise<LayoutResult> {
    const strategy = this.get(name);
    if (!strategy) {
      throw new Error(`Layout strategy "${name}" not found`);
    }

    // Validate options if validator exists
    if (strategy.validate && options) {
      if (!strategy.validate(options)) {
        throw new Error(`Invalid options for layout strategy "${name}"`);
      }
    }

    // Merge with default options
    const finalOptions = {
      ...strategy.getDefaultOptions(),
      ...options,
    };

    return strategy.calculate(nodes, edges, finalOptions);
  }
}
