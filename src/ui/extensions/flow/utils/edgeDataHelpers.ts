/**
 * Edge Data Helpers
 * 
 * Utility functions for enriching, validating, and calculating
 * edge data structures including weight and bidirectionality.
 */

import type { Edge } from '@xyflow/react';
import type { FlowEdgeData } from '../organisms/FlowTypes';

/**
 * Metadata to enrich edge data
 */
export interface EdgeMetadata {
  tags?: string[];
  category?: string;
  version?: number;
}

/**
 * Enrich edge data with metadata
 */
export function enrichEdgeData(
  edge: Edge<FlowEdgeData>,
  metadata: EdgeMetadata
): Edge<FlowEdgeData> {
  const now = Date.now();
  
  return {
    ...edge,
    data: {
      ...edge.data,
      tags: metadata.tags || edge.data.tags || [],
      category: metadata.category || edge.data.category,
      version: metadata.version || edge.data.version || 1,
      createdAt: edge.data.createdAt || now,
      updatedAt: now,
    },
  };
}

/**
 * Validate edge data structure
 */
export function validateEdgeData(edge: Edge<FlowEdgeData>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate required fields
  if (!edge.id) {
    errors.push('Edge must have an id');
  }

  if (!edge.source) {
    errors.push('Edge must have a source');
  }

  if (!edge.target) {
    errors.push('Edge must have a target');
  }

  // Validate self-connection
  if (edge.source === edge.target) {
    errors.push('Edge cannot connect a node to itself');
  }

  // Validate metadata if present
  if (edge.data.version !== undefined && edge.data.version < 1) {
    errors.push('Version must be >= 1');
  }

  if (edge.data.createdAt !== undefined && edge.data.updatedAt !== undefined) {
    if (edge.data.updatedAt < edge.data.createdAt) {
      errors.push('updatedAt cannot be before createdAt');
    }
  }

  // Validate relationship type if present
  if (edge.data.relationship) {
    const validRelationships = [
      'dependency',
      'association',
      'composition',
      'aggregation',
      'generalization',
    ];
    if (!validRelationships.includes(edge.data.relationship)) {
      errors.push(`Relationship must be one of: ${validRelationships.join(', ')}`);
    }
  }

  // Validate weight if present
  if (edge.data.weight !== undefined) {
    if (edge.data.weight < 0) {
      errors.push('Weight must be >= 0');
    }
    if (edge.data.weight > 1 && !Number.isInteger(edge.data.weight)) {
      errors.push('Weight must be between 0 and 1, or an integer >= 1');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get edge weight (defaults to 1 if not specified)
 */
export function getEdgeWeight(edge: Edge<FlowEdgeData>): number {
  return edge.data.weight !== undefined ? edge.data.weight : 1;
}

/**
 * Check if edge is bidirectional
 */
export function isBidirectional(
  edge: Edge<FlowEdgeData>,
  edges: Edge<FlowEdgeData>[]
): boolean {
  // Check explicit bidirectional flag
  if (edge.data.bidirectional === true) {
    return true;
  }

  // Check if reverse edge exists
  const reverseEdge = edges.find(
    (e) => e.source === edge.target && e.target === edge.source
  );

  return reverseEdge !== undefined;
}

/**
 * Get reverse edge if it exists
 */
export function getReverseEdge(
  edge: Edge<FlowEdgeData>,
  edges: Edge<FlowEdgeData>[]
): Edge<FlowEdgeData> | undefined {
  return edges.find(
    (e) => e.source === edge.target && e.target === edge.source && e.id !== edge.id
  );
}

/**
 * Calculate total weight of edges connected to a node
 */
export function getNodeEdgeWeight(
  nodeId: string,
  edges: Edge<FlowEdgeData>[],
  direction: 'incoming' | 'outgoing' | 'both' = 'both'
): number {
  let totalWeight = 0;

  edges.forEach((edge) => {
    if (direction === 'incoming' || direction === 'both') {
      if (edge.target === nodeId) {
        totalWeight += getEdgeWeight(edge);
      }
    }
    if (direction === 'outgoing' || direction === 'both') {
      if (edge.source === nodeId) {
        totalWeight += getEdgeWeight(edge);
      }
    }
  });

  return totalWeight;
}

/**
 * Get edges by relationship type
 */
export function getEdgesByRelationship(
  edges: Edge<FlowEdgeData>,
  relationship: FlowEdgeData['relationship']
): Edge<FlowEdgeData>[] {
  if (!relationship) {
    return [];
  }

  return edges.filter((edge) => edge.data.relationship === relationship);
}

/**
 * Get edges by category
 */
export function getEdgesByCategory(
  edges: Edge<FlowEdgeData>,
  category: string
): Edge<FlowEdgeData>[] {
  return edges.filter((edge) => edge.data.category === category);
}

/**
 * Get edges by tags
 */
export function getEdgesByTags(
  edges: Edge<FlowEdgeData>,
  tags: string[]
): Edge<FlowEdgeData>[] {
  if (tags.length === 0) {
    return [];
  }

  return edges.filter((edge) => {
    if (!edge.data.tags || edge.data.tags.length === 0) {
      return false;
    }
    return tags.some((tag) => edge.data.tags!.includes(tag));
  });
}
