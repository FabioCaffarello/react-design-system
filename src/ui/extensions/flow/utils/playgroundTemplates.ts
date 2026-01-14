/**
 * Playground Templates
 * 
 * Pre-defined flow templates for quick start
 */

import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Node<FlowNodeData>[];
  edges: Edge<FlowEdgeData>[];
  category: 'workflow' | 'decision-tree' | 'process' | 'hierarchy' | 'data-flow' | 'custom';
  tags?: string[];
  preview?: string; // URL or base64 image
}

/**
 * Simple Workflow Template
 */
export const simpleWorkflowTemplate: FlowTemplate = {
  id: 'simple-workflow',
  name: 'Simple Workflow',
  description: 'A basic start → process → end workflow',
  category: 'workflow',
  nodes: [
    { id: 'start', type: 'default', position: { x: 250, y: 100 }, width: 200, height: 60, data: { label: 'Start', variant: 'primary' } },
    { id: 'process', type: 'default', position: { x: 250, y: 200 }, width: 200, height: 60, data: { label: 'Process', variant: 'default' } },
    { id: 'end', type: 'default', position: { x: 250, y: 300 }, width: 200, height: 60, data: { label: 'End', variant: 'success' } },
  ],
  edges: [
    { id: 'e1', source: 'start', sourceHandle: 'source-bottom', target: 'process', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e2', source: 'process', sourceHandle: 'source-bottom', target: 'end', targetHandle: 'target-top', type: 'default', data: {} },
  ],
};

/**
 * Decision Tree Template
 */
export const decisionTreeTemplate: FlowTemplate = {
  id: 'decision-tree',
  name: 'Decision Tree',
  description: 'A decision tree with yes/no branches',
  category: 'decision-tree',
  nodes: [
    { id: 'start', type: 'default', position: { x: 300, y: 50 }, width: 200, height: 60, data: { label: 'Start', variant: 'primary' } },
    { id: 'decision', type: 'default', position: { x: 300, y: 150 }, width: 200, height: 60, data: { label: 'Decision?', variant: 'warning' } },
    { id: 'yes', type: 'default', position: { x: 150, y: 250 }, width: 200, height: 60, data: { label: 'Yes Path', variant: 'success' } },
    { id: 'no', type: 'default', position: { x: 450, y: 250 }, width: 200, height: 60, data: { label: 'No Path', variant: 'error' } },
    { id: 'end', type: 'default', position: { x: 300, y: 350 }, width: 200, height: 60, data: { label: 'End', variant: 'primary' } },
  ],
  edges: [
    { id: 'e1', source: 'start', sourceHandle: 'source-bottom', target: 'decision', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e2', source: 'decision', sourceHandle: 'source-bottom', target: 'yes', targetHandle: 'target-top', type: 'default', data: { label: 'Yes' } },
    { id: 'e3', source: 'decision', sourceHandle: 'source-bottom', target: 'no', targetHandle: 'target-top', type: 'default', data: { label: 'No' } },
    { id: 'e4', source: 'yes', sourceHandle: 'source-bottom', target: 'end', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e5', source: 'no', sourceHandle: 'source-bottom', target: 'end', targetHandle: 'target-top', type: 'default', data: {} },
  ],
};

/**
 * Process Flow Template
 */
export const processFlowTemplate: FlowTemplate = {
  id: 'process-flow',
  name: 'Process Flow',
  description: 'A multi-step process flow',
  category: 'process',
  nodes: [
    { id: 'step1', type: 'default', position: { x: 100, y: 150 }, width: 200, height: 60, data: { label: 'Step 1', variant: 'primary' } },
    { id: 'step2', type: 'default', position: { x: 250, y: 150 }, width: 200, height: 60, data: { label: 'Step 2', variant: 'default' } },
    { id: 'step3', type: 'default', position: { x: 400, y: 150 }, width: 200, height: 60, data: { label: 'Step 3', variant: 'default' } },
    { id: 'step4', type: 'default', position: { x: 550, y: 150 }, width: 200, height: 60, data: { label: 'Step 4', variant: 'success' } },
  ],
  edges: [
    { id: 'e1', source: 'step1', sourceHandle: 'source-right', target: 'step2', targetHandle: 'target-left', type: 'default', data: {} },
    { id: 'e2', source: 'step2', sourceHandle: 'source-right', target: 'step3', targetHandle: 'target-left', type: 'default', data: {} },
    { id: 'e3', source: 'step3', sourceHandle: 'source-right', target: 'step4', targetHandle: 'target-left', type: 'default', data: {} },
  ],
};

/**
 * Hierarchy Template
 */
export const hierarchyTemplate: FlowTemplate = {
  id: 'hierarchy',
  name: 'Hierarchy',
  description: 'A hierarchical organization chart',
  category: 'hierarchy',
  nodes: [
    { id: 'root', type: 'default', position: { x: 300, y: 50 }, width: 200, height: 60, data: { label: 'Root', variant: 'primary' } },
    { id: 'child1', type: 'default', position: { x: 150, y: 150 }, width: 200, height: 60, data: { label: 'Child 1', variant: 'default' } },
    { id: 'child2', type: 'default', position: { x: 300, y: 150 }, width: 200, height: 60, data: { label: 'Child 2', variant: 'default' } },
    { id: 'child3', type: 'default', position: { x: 450, y: 150 }, width: 200, height: 60, data: { label: 'Child 3', variant: 'default' } },
    { id: 'grandchild1', type: 'default', position: { x: 100, y: 250 }, width: 200, height: 60, data: { label: 'Grandchild 1', variant: 'default' } },
    { id: 'grandchild2', type: 'default', position: { x: 200, y: 250 }, width: 200, height: 60, data: { label: 'Grandchild 2', variant: 'default' } },
  ],
  edges: [
    { id: 'e1', source: 'root', sourceHandle: 'source-bottom', target: 'child1', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e2', source: 'root', sourceHandle: 'source-bottom', target: 'child2', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e3', source: 'root', sourceHandle: 'source-bottom', target: 'child3', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e4', source: 'child1', sourceHandle: 'source-bottom', target: 'grandchild1', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e5', source: 'child1', sourceHandle: 'source-bottom', target: 'grandchild2', targetHandle: 'target-top', type: 'default', data: {} },
  ],
};

/**
 * Tree Template (based on React Flow playground default)
 * This is the default template used in the official React Flow playground
 */
export const treeTemplate: FlowTemplate = {
  id: 'tree',
  name: 'Tree',
  description: 'A tree structure with root, children, and grandchildren (default playground template)',
  category: 'hierarchy',
  nodes: [
    { id: 'root', type: 'default', position: { x: 250, y: 0 }, width: 200, height: 60, data: { label: 'Root', variant: 'default' } },
    { id: 'child1', type: 'default', position: { x: 0, y: 150 }, width: 200, height: 60, data: { label: 'Child 1', variant: 'default' } },
    { id: 'child2', type: 'default', position: { x: 250, y: 150 }, width: 200, height: 60, data: { label: 'Child 2', variant: 'default' } },
    { id: 'child3', type: 'default', position: { x: 500, y: 150 }, width: 200, height: 60, data: { label: 'Child 3', variant: 'default' } },
    { id: 'grandchild1', type: 'default', position: { x: -100, y: 300 }, width: 200, height: 60, data: { label: 'Grandchild 1', variant: 'default' } },
    { id: 'grandchild2', type: 'default', position: { x: 100, y: 300 }, width: 200, height: 60, data: { label: 'Grandchild 2', variant: 'default' } },
    { id: 'grandchild4', type: 'default', position: { x: 150, y: 300 }, width: 200, height: 60, data: { label: 'Grandchild 4', variant: 'default' } },
    { id: 'grandchild5', type: 'default', position: { x: 350, y: 300 }, width: 200, height: 60, data: { label: 'Grandchild 5', variant: 'default' } },
    { id: 'grandchild7', type: 'default', position: { x: 400, y: 300 }, width: 200, height: 60, data: { label: 'Grandchild 7', variant: 'default' } },
    { id: 'grandchild8', type: 'default', position: { x: 600, y: 300 }, width: 200, height: 60, data: { label: 'Grandchild 8', variant: 'default' } },
  ],
  edges: [
    { id: 'e1', source: 'root', sourceHandle: 'source-bottom', target: 'child1', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e2', source: 'root', sourceHandle: 'source-bottom', target: 'child2', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e3', source: 'root', sourceHandle: 'source-bottom', target: 'child3', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e4', source: 'child1', sourceHandle: 'source-bottom', target: 'grandchild1', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e5', source: 'child1', sourceHandle: 'source-bottom', target: 'grandchild2', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e6', source: 'child2', sourceHandle: 'source-bottom', target: 'grandchild4', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e7', source: 'child2', sourceHandle: 'source-bottom', target: 'grandchild5', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e8', source: 'child3', sourceHandle: 'source-bottom', target: 'grandchild7', targetHandle: 'target-top', type: 'default', data: {} },
    { id: 'e9', source: 'child3', sourceHandle: 'source-bottom', target: 'grandchild8', targetHandle: 'target-top', type: 'default', data: {} },
  ],
};

/**
 * Data Flow Template
 */
export const dataFlowTemplate: FlowTemplate = {
  id: 'data-flow',
  name: 'Data Flow',
  description: 'Input → Transform → Output data flow',
  category: 'data-flow',
  tags: ['data', 'etl', 'pipeline'],
  nodes: [
    { id: 'input', type: 'input', position: { x: 100, y: 150 }, width: 200, height: 60, data: { label: 'Data Input', variant: 'primary' } },
    { id: 'transform1', type: 'default', position: { x: 350, y: 100 }, width: 200, height: 60, data: { label: 'Transform 1', variant: 'default' } },
    { id: 'transform2', type: 'default', position: { x: 350, y: 200 }, width: 200, height: 60, data: { label: 'Transform 2', variant: 'default' } },
    { id: 'output', type: 'output', position: { x: 600, y: 150 }, width: 200, height: 60, data: { label: 'Data Output', variant: 'success' } },
  ],
  edges: [
    { id: 'e1', source: 'input', sourceHandle: 'source-right', target: 'transform1', targetHandle: 'target-left', type: 'default', data: {} },
    { id: 'e2', source: 'input', sourceHandle: 'source-right', target: 'transform2', targetHandle: 'target-left', type: 'default', data: {} },
    { id: 'e3', source: 'transform1', sourceHandle: 'source-right', target: 'output', targetHandle: 'target-left', type: 'default', data: {} },
    { id: 'e4', source: 'transform2', sourceHandle: 'source-right', target: 'output', targetHandle: 'target-left', type: 'default', data: {} },
  ],
};

/**
 * All available templates
 */
export const flowTemplates: FlowTemplate[] = [
  treeTemplate,
  simpleWorkflowTemplate,
  decisionTreeTemplate,
  processFlowTemplate,
  hierarchyTemplate,
  dataFlowTemplate,
];

/**
 * Get templates by tag
 */
export function getTemplatesByTag(tag: string): FlowTemplate[] {
  return flowTemplates.filter(t => t.tags?.includes(tag));
}

/**
 * Search templates
 */
export function searchTemplates(query: string): FlowTemplate[] {
  const lowerQuery = query.toLowerCase();
  return flowTemplates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.category.toLowerCase().includes(lowerQuery) ||
    t.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): FlowTemplate | undefined {
  return flowTemplates.find((t) => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: FlowTemplate['category']): FlowTemplate[] {
  return flowTemplates.filter((t) => t.category === category);
}
