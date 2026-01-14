/**
 * Node Data Helpers
 * 
 * Utility functions for enriching, validating, and calculating
 * node data structures including hierarchy and relationships.
 */

import type { Node } from '@xyflow/react';
import type { FlowNodeData, NodeHierarchy, NodeRelationships } from '../organisms/FlowTypes';
import type { Edge } from '@xyflow/react';

/**
 * Metadata to enrich node data
 */
export interface NodeMetadata {
  tags?: string[];
  category?: string;
  author?: string;
  version?: number;
}

/**
 * Enrich node data with metadata
 */
export function enrichNodeData(
  node: Node<FlowNodeData>,
  metadata: NodeMetadata
): Node<FlowNodeData> {
  const now = Date.now();
  
  return {
    ...node,
    data: {
      ...node.data,
      tags: metadata.tags || node.data.tags || [],
      category: metadata.category || node.data.category,
      author: metadata.author || node.data.author,
      version: metadata.version || node.data.version || 1,
      createdAt: node.data.createdAt || now,
      updatedAt: now,
    },
  };
}

/**
 * Validate node data structure
 */
export function validateNodeData(node: Node<FlowNodeData>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate required fields
  if (!node.id) {
    errors.push('Node must have an id');
  }

  if (!node.position) {
    errors.push('Node must have a position');
  }

  // Validate metadata if present
  if (node.data.version !== undefined && node.data.version < 1) {
    errors.push('Version must be >= 1');
  }

  if (node.data.createdAt !== undefined && node.data.updatedAt !== undefined) {
    if (node.data.updatedAt < node.data.createdAt) {
      errors.push('updatedAt cannot be before createdAt');
    }
  }

  // Validate hierarchy if present
  if (node.data.hierarchy) {
    if (node.data.hierarchy.level < 0) {
      errors.push('Hierarchy level must be >= 0');
    }
    if (node.data.hierarchy.parentId === node.id) {
      errors.push('Node cannot be its own parent');
    }
  }

  // Validate status if present
  if (node.data.status) {
    const validStatuses = ['draft', 'active', 'archived', 'deprecated'];
    if (!validStatuses.includes(node.data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  // Validate priority if present
  if (node.data.priority) {
    const validPriorities = ['low', 'medium', 'high', 'critical'];
    if (!validPriorities.includes(node.data.priority)) {
      errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate node hierarchy from nodes array
 */
export function getNodeHierarchy(
  nodes: Node<FlowNodeData>[]
): Map<string, NodeHierarchy> {
  const hierarchyMap = new Map<string, NodeHierarchy>();

  // First pass: identify parent-child relationships from edges
  const parentMap = new Map<string, string>();
  const childrenMap = new Map<string, string[]>();

  // Build parent-child relationships
  nodes.forEach((node) => {
    if (node.data.hierarchy?.parentId) {
      const parentId = node.data.hierarchy.parentId;
      parentMap.set(node.id, parentId);
      
      if (!childrenMap.has(parentId)) {
        childrenMap.set(parentId, []);
      }
      childrenMap.get(parentId)!.push(node.id);
    }
  });

  // Second pass: calculate levels
  const calculateLevel = (nodeId: string, visited = new Set<string>()): number => {
    if (visited.has(nodeId)) {
      return 0; // Cycle detected, return 0
    }
    visited.add(nodeId);

    const parentId = parentMap.get(nodeId);
    if (!parentId) {
      return 0; // Root node
    }

    const parent = nodes.find((n) => n.id === parentId);
    if (!parent) {
      return 0; // Parent not found
    }

    return calculateLevel(parentId, visited) + 1;
  };

  // Build hierarchy for each node
  nodes.forEach((node) => {
    const level = calculateLevel(node.id);
    const parentId = parentMap.get(node.id);
    const childrenIds = childrenMap.get(node.id) || [];

    hierarchyMap.set(node.id, {
      level,
      parentId,
      childrenIds,
    });
  });

  return hierarchyMap;
}

/**
 * Calculate node relationships from edges
 */
export function getNodeRelationships(
  node: Node<FlowNodeData>,
  edges: Edge[]
): NodeRelationships {
  const incoming: string[] = [];
  const outgoing: string[] = [];

  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incoming.push(edge.source);
    }
    if (edge.source === node.id) {
      outgoing.push(edge.target);
    }
  });

  return {
    incoming: incoming.length > 0 ? incoming : undefined,
    outgoing: outgoing.length > 0 ? outgoing : undefined,
  };
}

/**
 * Update node hierarchy based on current nodes and edges
 */
export function updateNodeHierarchy(
  node: Node<FlowNodeData>,
  nodes: Node<FlowNodeData>[],
  edges: Edge[]
): Node<FlowNodeData> {
  const hierarchy = getNodeHierarchy(nodes).get(node.id);
  const relationships = getNodeRelationships(node, edges);

  return {
    ...node,
    data: {
      ...node.data,
      hierarchy: hierarchy || node.data.hierarchy,
      relationships: relationships.incoming || relationships.outgoing ? relationships : node.data.relationships,
    },
  };
}

/**
 * Get all descendant node IDs
 */
export function getDescendantIds(
  nodeId: string,
  nodes: Node<FlowNodeData>[]
): string[] {
  const descendants: string[] = [];
  const node = nodes.find((n) => n.id === nodeId);

  if (!node || !node.data.hierarchy?.childrenIds) {
    return descendants;
  }

  node.data.hierarchy.childrenIds.forEach((childId) => {
    descendants.push(childId);
    descendants.push(...getDescendantIds(childId, nodes));
  });

  return descendants;
}

/**
 * Get all ancestor node IDs
 */
export function getAncestorIds(
  nodeId: string,
  nodes: Node<FlowNodeData>[]
): string[] {
  const ancestors: string[] = [];
  const node = nodes.find((n) => n.id === nodeId);

  if (!node || !node.data.hierarchy?.parentId) {
    return ancestors;
  }

  const parentId = node.data.hierarchy.parentId;
  ancestors.push(parentId);
  ancestors.push(...getAncestorIds(parentId, nodes));

  return ancestors;
}
