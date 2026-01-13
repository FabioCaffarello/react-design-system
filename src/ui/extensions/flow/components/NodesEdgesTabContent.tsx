/**
 * Nodes & Edges Tab Content Component
 * 
 * Organizes content in exact sections matching the reference:
 * - OPTIONS: Handle Positions, Floating Edges
 * - NODES & EDGES: Dataset selector, Add new node button
 * - NODE INSPECTOR: Editor for selected node/edge or empty message
 */

import React from 'react';
import { Card } from '../../../molecules';
import { Label, Select } from '../../../atoms';
import { AddNodeButton } from './AddNodeButton';
import { HandlePositionsDropdown } from './HandlePositionsDropdown';
import { FloatingEdgesCheckbox } from './FloatingEdgesCheckbox';
import { NodeEditor, EdgeEditor } from './';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { flowTemplates } from '../utils/playgroundTemplates';
import { generateNodeId } from '../utils/playgroundHelpers';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../../tokens';

/**
 * Section wrapper component
 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={getSpacingClass('md', 'mb')}>
      <Label
        className={`
          ${getTypographyClasses('label')}
          ${getColorClass('neutral', 'dark', 'text')}
          ${getSpacingClass('sm', 'mb')}
          block
          font-semibold
          uppercase
          text-xs
        `}
      >
        {title}
      </Label>
      <div className={getSpacingClass('md', 'mt')}>
        {children}
      </div>
    </div>
  );
}

/**
 * Simplified Dataset Selector (just dropdown)
 */
function SimpleDatasetSelector() {
  const { setNodes, setEdges, setHasPendingChanges } = usePlaygroundContext();
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>('tree');

  const handleLoadTemplate = React.useCallback(
    (templateId: string) => {
      const template = flowTemplates.find((t) => t.id === templateId);
      if (template) {
        const newNodes = template.nodes.map((node) => ({
          ...node,
          id: generateNodeId(),
          width: node.width || 200,
          height: node.height || 60,
        }));

        const nodeIdMap = new Map(
          template.nodes.map((n, i) => [n.id, newNodes[i].id])
        );

        const newEdges = template.edges.map((edge) => ({
          ...edge,
          id: `edge-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          type: edge.type || 'default',
          source: nodeIdMap.get(edge.source) || edge.source,
          target: nodeIdMap.get(edge.target) || edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        }));

        setNodes(newNodes);
        setEdges(newEdges);
        setHasPendingChanges(true);
        setSelectedTemplateId(templateId);
      }
    },
    [setNodes, setEdges, setHasPendingChanges]
  );

  return (
    <div className={`flex flex-col ${getSpacingClass('sm', 'gap')}`}>
      <Label htmlFor="dataset-select">Dataset</Label>
      <Select
        id="dataset-select"
        value={selectedTemplateId}
        onChange={(e) => {
          const templateId = e.target.value;
          setSelectedTemplateId(templateId);
          handleLoadTemplate(templateId);
        }}
        options={flowTemplates.map((template) => ({
          value: template.id,
          label: template.name,
        }))}
      />
    </div>
  );
}

/**
 * Node Inspector Component
 */
function NodeInspector() {
  const { nodes, edges, selectedNodeId, selectedEdgeId, setNodes, setEdges } = usePlaygroundContext();

  const selectedNode = React.useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  const selectedEdge = React.useMemo(
    () => edges.find((e) => e.id === selectedEdgeId),
    [edges, selectedEdgeId]
  );

  const handleNodeUpdate = React.useCallback(
    (nodeId: string, updates: any) => {
      setNodes(nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)));
    },
    [nodes, setNodes]
  );

  const handleEdgeUpdate = React.useCallback(
    (edgeId: string, updates: any) => {
      setEdges(edges.map((e) => (e.id === edgeId ? { ...e, ...updates } : e)));
    },
    [edges, setEdges]
  );

  const handleNodeDelete = React.useCallback(
    (nodeId: string) => {
      setNodes(nodes.filter((n) => n.id !== nodeId));
    },
    [nodes, setNodes]
  );

  const handleEdgeDelete = React.useCallback(
    (edgeId: string) => {
      setEdges(edges.filter((e) => e.id !== edgeId));
    },
    [edges, setEdges]
  );

  if (selectedNode) {
    return (
      <NodeEditor
        node={selectedNode}
        onUpdate={handleNodeUpdate}
        onDelete={handleNodeDelete}
        onDuplicate={() => {}}
      />
    );
  }

  if (selectedEdge) {
    return (
      <EdgeEditor
        edge={selectedEdge}
        nodes={nodes}
        onUpdate={handleEdgeUpdate}
        onDelete={handleEdgeDelete}
      />
    );
  }

  return (
    <p
      className={`
        ${getTypographyClasses('body')}
        ${getColorClass('neutral', 'DEFAULT', 'text')}
        m-0
        text-center
        py-4
      `}
    >
      Select nodes to change their properties.
    </p>
  );
}

/**
 * Main Nodes & Edges Tab Content Component
 */
export function NodesEdgesTabContent() {
  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
      {/* OPTIONS Section */}
      <Section title="OPTIONS">
        <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
          <HandlePositionsDropdown />
          <FloatingEdgesCheckbox />
        </div>
      </Section>

      {/* NODES & EDGES Section */}
      <Section title="NODES & EDGES">
        <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
          <SimpleDatasetSelector />
          <AddNodeButton />
        </div>
      </Section>

      {/* NODE INSPECTOR Section */}
      <Section title="NODE INSPECTOR">
        <NodeInspector />
      </Section>
    </div>
  );
}
