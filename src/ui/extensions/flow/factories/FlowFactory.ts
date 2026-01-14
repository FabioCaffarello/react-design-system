/**
 * Flow Factory
 * 
 * Main factory for creating flows, nodes, and edges.
 * Provides a unified interface for flow construction.
 */

import type { Node, Edge, XYPosition } from '@xyflow/react';
import { NodeBuilder } from './builders/NodeBuilder';
import { EdgeBuilder } from './builders/EdgeBuilder';
import { NodeFactory } from '../utils/nodeFactory';
import { EdgeFactory } from '../utils/edgeFactory';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';

/**
 * Flow Factory
 * 
 * Main factory for creating flow elements with fluent API.
 */
export class FlowFactory {
  /**
   * Create a node builder
   */
  static node<T extends FlowNodeData = FlowNodeData>(id?: string): NodeBuilder<T> {
    return new NodeBuilder<T>(id);
  }

  /**
   * Create an edge builder
   */
  static edge<T extends FlowEdgeData = FlowEdgeData>(source: string, target: string): EdgeBuilder<T> {
    return new EdgeBuilder<T>(source, target);
  }

  /**
   * Create a node using factory method
   */
  static createNode<T extends FlowNodeData = FlowNodeData>(
    type: string,
    id: string,
    position: XYPosition,
    data: T
  ): Node<T> {
    return NodeFactory.create(type, id, position, data);
  }

  /**
   * Create an edge using factory method
   */
  static createEdge<T extends FlowEdgeData = FlowEdgeData>(
    source: string,
    target: string,
    id?: string,
    type?: string,
    data?: T
  ): Edge<T> {
    return EdgeFactory.create(source, target, id, type, data);
  }

  /**
   * Create multiple nodes
   */
  static createNodes<T extends FlowNodeData = FlowNodeData>(
    nodes: Array<{
      type: string;
      id: string;
      position: XYPosition;
      data: T;
    }>
  ): Node<T>[] {
    return nodes.map((node) => this.createNode(node.type, node.id, node.position, node.data));
  }

  /**
   * Create multiple edges
   */
  static createEdges<T extends FlowEdgeData = FlowEdgeData>(
    edges: Array<{
      source: string;
      target: string;
      id?: string;
      type?: string;
      data?: T;
    }>
  ): Edge<T>[] {
    return edges.map((edge) => this.createEdge(edge.source, edge.target, edge.id, edge.type, edge.data));
  }

  /**
   * Create a complete flow (nodes and edges)
   */
  static createFlow<TNodeData extends FlowNodeData = FlowNodeData, TEdgeData extends FlowEdgeData = FlowEdgeData>(config: {
    nodes: Array<{
      type: string;
      id: string;
      position: XYPosition;
      data: TNodeData;
    }>;
    edges: Array<{
      source: string;
      target: string;
      id?: string;
      type?: string;
      data?: TEdgeData;
    }>;
  }): { nodes: Node<TNodeData>[]; edges: Edge<TEdgeData>[] } {
    return {
      nodes: this.createNodes(config.nodes),
      edges: this.createEdges(config.edges),
    };
  }

  /**
   * Create a node from template (convenience method)
   */
  static nodeFromTemplate<T extends FlowNodeData = FlowNodeData>(
    type: string,
    position: XYPosition,
    data: Partial<T>
  ): Node<T> {
    return this.node<T>()
      .withType(type)
      .withPosition(position)
      .withData(data as T)
      .build();
  }

  /**
   * Create an edge from template (convenience method)
   */
  static edgeFromTemplate<T extends FlowEdgeData = FlowEdgeData>(
    source: string,
    target: string,
    type?: string,
    data?: Partial<T>
  ): Edge<T> {
    return this.edge<T>(source, target)
      .withType(type || 'default')
      .withData(data as T)
      .build();
  }
}
