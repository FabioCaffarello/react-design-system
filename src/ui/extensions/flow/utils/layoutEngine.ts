/**
 * Layout Engine
 * 
 * Strategy pattern for different layout algorithms (Dagre, ELK, Force-Directed).
 */

import type { Node, Edge } from '@xyflow/react';
import type { LayoutOptions, LayoutResult } from '../organisms/FlowTypes';

/**
 * Layout Strategy Interface
 */
export interface LayoutStrategy {
  name: string;
  calculate(nodes: Node[], edges: Edge[], options?: LayoutOptions): Promise<LayoutResult>;
}

/**
 * Dagre Layout Strategy
 * 
 * Hierarchical layout for directed graphs.
 */
export class DagreLayoutStrategy implements LayoutStrategy {
  name = 'dagre';
  
  async calculate(
    nodes: Node[],
    edges: Edge[],
    options: LayoutOptions = {}
  ): Promise<LayoutResult> {
    // Dynamic import to make it optional
    const dagreModule = await import('dagre').catch(() => null);
    
    if (!dagreModule) {
      throw new Error('dagre is not installed. Install it with: npm install dagre @types/dagre');
    }
    
    const dagre = dagreModule.default || dagreModule;
    const Graph = dagre.graphlib?.Graph || (dagre as unknown).Graph;
    const g = new Graph();
    if (g.setDefaultEdgeLabel) {
      g.setDefaultEdgeLabel(() => ({}));
    }
    if (g.setGraph) {
      g.setGraph({
        rankdir: options.direction || 'TB',
        nodesep: options.spacing || 50,
        ranksep: options.spacing || 50,
      });
    }
    
    nodes.forEach((node) => {
      if (g.setNode) {
        g.setNode(node.id, {
          width: options.nodeWidth || 150,
          height: options.nodeHeight || 50,
        });
      }
    });
    
    edges.forEach((edge) => {
      if (g.setEdge) {
        g.setEdge(edge.source, edge.target);
      }
    });
    
    if (dagre.layout) {
      dagre.layout(g);
    } else if ((dagre as unknown).layout) {
      (dagre as unknown).layout(g);
    }
    
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = g.node ? g.node(node.id) : null;
      if (!nodeWithPosition) {
        return node;
      }
      return {
        ...node,
        position: {
          x: (nodeWithPosition.x || 0) - (options.nodeWidth || 150) / 2,
          y: (nodeWithPosition.y || 0) - (options.nodeHeight || 50) / 2,
        },
      };
    });
    
    return { nodes: layoutedNodes, edges };
  }
}

/**
 * ELK Layout Strategy
 * 
 * Complex, configurable layout engine.
 */
export class ELKLayoutStrategy implements LayoutStrategy {
  name = 'elk';
  
  async calculate(
    nodes: Node[],
    edges: Edge[],
    options: LayoutOptions = {}
  ): Promise<LayoutResult> {
    // Dynamic import to make it optional
    const ELK = await import('elkjs').catch(() => null);
    
    if (!ELK) {
      throw new Error('elkjs is not installed. Install it with: npm install elkjs');
    }
    
    const ElkClass = ELK.default || ELK;
    const elk = new ElkClass();
    
    const graph = {
      id: 'root',
      children: nodes.map((node) => ({
        id: node.id,
        width: options.nodeWidth || 150,
        height: options.nodeHeight || 50,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };
    
    const layouted = await elk.layout(graph);
    
    const layoutedNodes = nodes.map((node) => {
      const layoutedNode = layouted.children?.find((n) => n.id === node.id);
      return {
        ...node,
        position: {
          x: layoutedNode?.x || 0,
          y: layoutedNode?.y || 0,
        },
      };
    });
    
    return { nodes: layoutedNodes, edges };
  }
}

/**
 * Force-Directed Layout Strategy
 * 
 * Physical simulation layout for undirected graphs.
 */
export class ForceDirectedLayoutStrategy implements LayoutStrategy {
  name = 'force';
  
  async calculate(
    nodes: Node[],
    edges: Edge[],
    _options: LayoutOptions = {}
  ): Promise<LayoutResult> {
    // Dynamic import to make it optional
    const d3 = await import('d3-force').catch(() => null);
    
    if (!d3) {
      throw new Error('d3-force is not installed. Install it with: npm install d3-force @types/d3-force');
    }
    
    const simulation = d3.forceSimulation(nodes.map((n) => ({ id: n.id } as unknown)))
      .force('link', (d3.forceLink as unknown)(edges).id((d: unknown) => d.id))
      .force('charge', (d3.forceManyBody as unknown)().strength(-300))
      .force('center', (d3.forceCenter as unknown)(400, 400));
    
    return new Promise((resolve) => {
      simulation.on('end', () => {
        const layoutedNodes = nodes.map((node, i) => {
          const simNode = simulation.nodes()[i] as unknown;
          return {
            ...node,
            position: {
              x: simNode.x || 0,
              y: simNode.y || 0,
            },
          };
        });
        resolve({ nodes: layoutedNodes, edges });
      });
    });
  }
}

/**
 * Layout Engine Manager
 * 
 * Manages multiple layout strategies and provides a unified interface.
 */
export class LayoutEngine {
  private strategies: Map<string, LayoutStrategy> = new Map();
  
  constructor() {
    // Register default strategies
    this.register(new DagreLayoutStrategy());
    this.register(new ELKLayoutStrategy());
    this.register(new ForceDirectedLayoutStrategy());
  }
  
  /**
   * Register a layout strategy
   */
  register(strategy: LayoutStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }
  
  /**
   * Calculate layout using a specific strategy
   */
  async calculate(
    strategyName: string,
    nodes: Node[],
    edges: Edge[],
    options?: LayoutOptions
  ): Promise<LayoutResult> {
    const strategy = this.strategies.get(strategyName);
    if (!strategy) {
      throw new Error(`Layout strategy "${strategyName}" not found. Available: ${this.getAvailableStrategies().join(', ')}`);
    }
    return strategy.calculate(nodes, edges, options);
  }
  
  /**
   * Get available layout strategies
   */
  getAvailableStrategies(): string[] {
    return Array.from(this.strategies.keys());
  }
  
  /**
   * Check if a strategy is available
   */
  hasStrategy(name: string): boolean {
    return this.strategies.has(name);
  }
}

// Export singleton instance
export const layoutEngine = new LayoutEngine();
