/**
 * Playground Helpers for Flow Components
 * 
 * Utility functions to help with Flow playground functionality
 * including node/edge management, export/import, and validation.
 */

import type { Node, Edge, ReactFlowJsonObject } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';
import type { BackgroundConfig, ReactFlowConfig } from '../types/playgroundTypes';

/**
 * Validation functions for playground state
 */

/**
 * Validate BackgroundConfig
 */
export function validateBackgroundConfig(config: BackgroundConfig): boolean {
  return (
    typeof config.show === 'boolean' &&
    ['dots', 'lines', 'cross'].includes(config.variant) &&
    typeof config.size === 'number' &&
    config.size >= 8 &&
    config.size <= 32
  );
}

/**
 * Validate ReactFlowConfig zoom values
 */
export function validateReactFlowConfig(config: ReactFlowConfig): boolean {
  // Validate zoom values if present
  if (config.minZoom !== undefined && (typeof config.minZoom !== 'number' || config.minZoom < 0)) {
    return false;
  }
  if (config.maxZoom !== undefined && (typeof config.maxZoom !== 'number' || config.maxZoom <= 0)) {
    return false;
  }
  if (config.defaultZoom !== undefined && (typeof config.defaultZoom !== 'number' || config.defaultZoom <= 0)) {
    return false;
  }
  
  // Validate zoom range consistency
  if (config.minZoom !== undefined && config.maxZoom !== undefined) {
    if (config.minZoom >= config.maxZoom) {
      return false;
    }
  }
  if (config.defaultZoom !== undefined && config.minZoom !== undefined && config.defaultZoom < config.minZoom) {
    return false;
  }
  if (config.defaultZoom !== undefined && config.maxZoom !== undefined && config.defaultZoom > config.maxZoom) {
    return false;
  }
  
  // Validate snapGrid if present
  if (config.snapGrid !== undefined) {
    if (!Array.isArray(config.snapGrid) || config.snapGrid.length !== 2) {
      return false;
    }
    if (typeof config.snapGrid[0] !== 'number' || typeof config.snapGrid[1] !== 'number') {
      return false;
    }
    if (config.snapGrid[0] <= 0 || config.snapGrid[1] <= 0) {
      return false;
    }
  }
  
  // Validate nodeOrigin if present
  if (config.nodeOrigin !== undefined) {
    if (!Array.isArray(config.nodeOrigin) || config.nodeOrigin.length !== 2) {
      return false;
    }
    if (typeof config.nodeOrigin[0] !== 'number' || typeof config.nodeOrigin[1] !== 'number') {
      return false;
    }
  }
  
  return true;
}

/**
 * Export flow to JSON
 */
export function exportFlowToJSON(
  nodes: Node<FlowNodeData>[],
  edges: Edge<FlowEdgeData>[]
): ReactFlowJsonObject {
  return {
    nodes,
    edges,
    viewport: {
      x: 0,
      y: 0,
      zoom: 1,
    },
  };
}

/**
 * Import flow from JSON
 */
export function importFlowFromJSON(
  json: ReactFlowJsonObject
): { nodes: Node<FlowNodeData>[]; edges: Edge<FlowEdgeData>[] } {
  return {
    nodes: json.nodes || [],
    edges: json.edges || [],
  };
}

/**
 * Download flow as JSON file
 */
export function downloadFlowAsJSON(
  nodes: Node<FlowNodeData>[],
  edges: Edge<FlowEdgeData>[],
  filename: string = 'flow.json'
): void {
  const json = exportFlowToJSON(nodes, edges);
  const dataStr = JSON.stringify(json, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Load flow from uploaded JSON file
 */
export function loadFlowFromFile(
  file: File
): Promise<{ nodes: Node<FlowNodeData>[]; edges: Edge<FlowEdgeData>[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string) as ReactFlowJsonObject;
        resolve(importFlowFromJSON(json));
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Generate a unique node ID
 */
export function generateNodeId(prefix: string = 'node'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique edge ID
 */
export function generateEdgeId(prefix: string = 'edge'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new node with default properties
 */
export function createNode(
  position: { x: number; y: number },
  data: Partial<FlowNodeData> = {}
): Node<FlowNodeData> {
  return {
    id: generateNodeId(),
    type: 'default',
    position,
    data: {
      label: 'New Node',
      ...data,
    },
  };
}

/**
 * Create a new edge between two nodes
 */
export function createEdge(
  source: string,
  target: string,
  data: Partial<FlowEdgeData> = {}
): Edge<FlowEdgeData> {
  return {
    id: generateEdgeId(),
    source,
    target,
    data: {
      ...data,
    },
  };
}

/**
 * Validate flow structure
 */
export function validateFlow(
  nodes: Node[],
  edges: Edge[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Ensure nodes and edges are arrays
  const safeNodes = nodes || [];
  const safeEdges = edges || [];

  // Check for duplicate node IDs
  const nodeIds = new Set<string>();
  safeNodes.forEach((node) => {
    if (node?.id) {
      if (nodeIds.has(node.id)) {
        errors.push(`Duplicate node ID: ${node.id}`);
      }
      nodeIds.add(node.id);
    }
  });

  // Check for duplicate edge IDs
  const edgeIds = new Set<string>();
  safeEdges.forEach((edge) => {
    if (edge?.id) {
      if (edgeIds.has(edge.id)) {
        errors.push(`Duplicate edge ID: ${edge.id}`);
      }
      edgeIds.add(edge.id);
    }
  });

  // Check for edges with invalid source/target
  safeEdges.forEach((edge) => {
    if (edge?.source && !nodeIds.has(edge.source)) {
      errors.push(`Edge ${edge.id || 'unknown'} has invalid source: ${edge.source}`);
    }
    if (edge?.target && !nodeIds.has(edge.target)) {
      errors.push(`Edge ${edge.id || 'unknown'} has invalid target: ${edge.target}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get flow statistics
 */
export function getFlowStats(
  nodes: Node[],
  edges: Edge[]
): {
  nodeCount: number;
  edgeCount: number;
  isolatedNodes: number;
  maxConnections: number;
} {
  // Ensure nodes and edges are arrays
  const safeNodes = nodes || [];
  const safeEdges = edges || [];
  
  const nodeConnections = new Map<string, number>();
  
  safeEdges.forEach((edge) => {
    if (edge?.source) {
      nodeConnections.set(edge.source, (nodeConnections.get(edge.source) || 0) + 1);
    }
    if (edge?.target) {
      nodeConnections.set(edge.target, (nodeConnections.get(edge.target) || 0) + 1);
    }
  });

  let isolatedNodes = 0;
  let maxConnections = 0;

  safeNodes.forEach((node) => {
    if (node?.id) {
      const connections = nodeConnections.get(node.id) || 0;
      if (connections === 0) {
        isolatedNodes++;
      }
      maxConnections = Math.max(maxConnections, connections);
    }
  });

  return {
    nodeCount: safeNodes.length,
    edgeCount: safeEdges.length,
    isolatedNodes,
    maxConnections,
  };
}

/**
 * Clone node
 */
export function cloneNode(node: Node<FlowNodeData>): Node<FlowNodeData> {
  return {
    ...node,
    id: generateNodeId(),
    position: {
      x: node.position.x + 50,
      y: node.position.y + 50,
    },
  };
}

/**
 * Clone edge
 */
export function cloneEdge(edge: Edge<FlowEdgeData>): Edge<FlowEdgeData> {
  return {
    ...edge,
    id: generateEdgeId(),
  };
}
