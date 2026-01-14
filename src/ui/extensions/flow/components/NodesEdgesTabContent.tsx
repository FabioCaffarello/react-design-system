/**
 * Nodes & Edges Tab Content Component
 *
 * Organizes content in exact sections matching the reference:
 * - OPTIONS: Handle Positions, Floating Edges
 * - NODES & EDGES: Dataset selector, Add new node button
 * - NODE INSPECTOR: Editor for selected node/edge or empty message
 */

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Label, Select } from '../../../atoms';
import Collapsible from '../../../atoms/Collapsible/Collapsible';
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
 * Collapsible Section wrapper component
 */
function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  storageKey,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  storageKey?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={getSpacingClass('md', 'mb')}>
      <Collapsible
        defaultOpen={defaultOpen}
        onOpenChange={setIsOpen}
        storageKey={storageKey}
        trigger={
          <div className="flex items-center justify-between w-full cursor-pointer py-1 hover:bg-gray-50 rounded transition-colors">
            <Label
              className={`
                ${getTypographyClasses('label')}
                ${getColorClass('neutral', 'dark', 'text')}
                block
                font-semibold
                uppercase
                text-xs
                cursor-pointer
              `}
            >
              {title}
            </Label>
            <ChevronDown
              className={`
                h-4 w-4
                ${getColorClass('neutral', 'DEFAULT', 'text')}
                transition-transform duration-200
                ${isOpen ? 'rotate-180' : ''}
              `}
            />
          </div>
        }
      >
        <div className={getSpacingClass('md', 'mt')}>
          {children}
        </div>
      </Collapsible>
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
      <CollapsibleSection
        title="OPTIONS"
        defaultOpen={true}
        storageKey="playground-options"
      >
        <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
          <HandlePositionsDropdown />
          <FloatingEdgesCheckbox />
        </div>
      </CollapsibleSection>

      {/* NODES & EDGES Section */}
      <CollapsibleSection
        title="NODES & EDGES"
        defaultOpen={true}
        storageKey="playground-nodes-edges"
      >
        <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
          <SimpleDatasetSelector />
          <AddNodeButton />
        </div>
      </CollapsibleSection>

      {/* NODE INSPECTOR Section */}
      <CollapsibleSection
        title="NODE INSPECTOR"
        defaultOpen={true}
        storageKey="playground-inspector"
      >
        <NodeInspector />
      </CollapsibleSection>
    </div>
  );
}
