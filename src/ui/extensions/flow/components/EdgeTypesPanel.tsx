/**
 * Edge Types Panel Component
 * 
 * Panel for demonstrating and previewing different edge types.
 */

import React, { useState } from 'react';
import { Card } from '../../../molecules';
import { Label } from '../../../atoms';
import Collapsible from '../../../atoms/Collapsible/Collapsible';
import { FlowProvider } from '../organisms/FlowProvider';
import { FlowCanvas } from '../organisms/FlowCanvas';
import { CustomEdge } from '../molecules/CustomEdge';
import { FloatingEdge } from '../molecules/FloatingEdge';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses,
  getRadiusClass 
} from '../../../tokens';

export interface EdgeTypesPanelProps {
  onSelectEdgeType?: (edgeType: string) => void;
}

/**
 * Edge type definitions for preview
 */
const edgeTypeDefinitions = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard bezier edge',
    component: CustomEdge,
    previewNodes: [
      { id: 'node1', type: 'default', position: { x: 50, y: 50 }, data: { label: 'Node 1', variant: 'primary' } },
      { id: 'node2', type: 'default', position: { x: 200, y: 50 }, data: { label: 'Node 2', variant: 'default' } },
    ] as Node<FlowNodeData>[],
    previewEdge: {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      type: 'default',
      data: {},
    } as Edge<FlowEdgeData>,
  },
  {
    id: 'smoothstep',
    name: 'Smooth Step',
    description: 'Smooth step edge with rounded corners',
    component: CustomEdge,
    previewNodes: [
      { id: 'node1', type: 'default', position: { x: 50, y: 50 }, data: { label: 'Node 1', variant: 'primary' } },
      { id: 'node2', type: 'default', position: { x: 200, y: 50 }, data: { label: 'Node 2', variant: 'default' } },
    ] as Node<FlowNodeData>[],
    previewEdge: {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      type: 'smoothstep',
      data: {},
    } as Edge<FlowEdgeData>,
  },
  {
    id: 'straight',
    name: 'Straight',
    description: 'Straight line edge',
    component: CustomEdge,
    previewNodes: [
      { id: 'node1', type: 'default', position: { x: 50, y: 50 }, data: { label: 'Node 1', variant: 'primary' } },
      { id: 'node2', type: 'default', position: { x: 200, y: 50 }, data: { label: 'Node 2', variant: 'default' } },
    ] as Node<FlowNodeData>[],
    previewEdge: {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      type: 'straight',
      data: {},
    } as Edge<FlowEdgeData>,
  },
  {
    id: 'step',
    name: 'Step',
    description: 'Step edge with sharp corners',
    component: CustomEdge,
    previewNodes: [
      { id: 'node1', type: 'default', position: { x: 50, y: 50 }, data: { label: 'Node 1', variant: 'primary' } },
      { id: 'node2', type: 'default', position: { x: 200, y: 50 }, data: { label: 'Node 2', variant: 'default' } },
    ] as Node<FlowNodeData>[],
    previewEdge: {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      type: 'step',
      data: {},
    } as Edge<FlowEdgeData>,
  },
  {
    id: 'floating',
    name: 'Floating',
    description: 'Floating edge that avoids nodes',
    component: FloatingEdge,
    previewNodes: [
      { id: 'node1', type: 'default', position: { x: 50, y: 50 }, data: { label: 'Node 1', variant: 'primary' } },
      { id: 'node2', type: 'default', position: { x: 200, y: 50 }, data: { label: 'Node 2', variant: 'default' } },
    ] as Node<FlowNodeData>[],
    previewEdge: {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      type: 'floating',
      data: {},
    } as Edge<FlowEdgeData>,
  },
];

/**
 * Preview component for a single edge type
 * Memoized for performance
 */
const EdgeTypePreview = React.memo(function EdgeTypePreview({ 
  edgeType, 
  onSelect 
}: { 
  edgeType: typeof edgeTypeDefinitions[0]; 
  onSelect?: () => void 
}) {
  const _edgeTypes = React.useMemo(() => ({
    [edgeType.id]: edgeType.component,
  }), [edgeType.id, edgeType.component]);

  return (
    <Card
      variant={onSelect ? 'hover' : 'default'}
      padding="small"
      onClick={onSelect}
      className={`
        ${onSelect ? 'cursor-pointer' : 'cursor-default'}
        transition-all duration-200
      `}
    >
      <div className={getSpacingClass('sm', 'mb')}>
        <div
          className={`
            w-full h-20
            ${getRadiusClass('md')}
            overflow-hidden relative
            ${getColorClass('neutral', 'light', 'bg')}
            border
            ${getColorClass('neutral', 'DEFAULT', 'border')}
          `}
        >
          <FlowProvider nodes={edgeType.previewNodes} edges={[edgeType.previewEdge]}>
            <FlowCanvas.Root style={{ width: '100%', height: '100%' }}>
              <FlowCanvas.Background variant="dots" size={4} />
            </FlowCanvas.Root>
          </FlowProvider>
        </div>
      </div>
      <div
        className={`
          ${getTypographyClasses('label')}
          ${getColorClass('neutral', 'dark', 'text')}
          ${getSpacingClass('xs', 'mb')}
        `}
      >
        {edgeType.name}
      </div>
      <div
        className={`
          ${getTypographyClasses('caption')}
          ${getColorClass('neutral', 'DEFAULT', 'text')}
        `}
      >
        {edgeType.description}
      </div>
    </Card>
  );
}, (prev, next) => {
  return prev.edgeType.id === next.edgeType.id && 
         prev.onSelect === next.onSelect;
});

export function EdgeTypesPanel({ onSelectEdgeType }: EdgeTypesPanelProps) {
  const [typesOpen, setTypesOpen] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
      <Card padding="md">
        <Collapsible
          trigger={
            <div className="flex items-center justify-between w-full cursor-pointer">
              <Label className="m-0">
                Available Edge Types
              </Label>
              <span className="text-sm opacity-60">
                {typesOpen ? '▼' : '▶'}
              </span>
            </div>
          }
          defaultOpen={typesOpen}
          onOpenChange={setTypesOpen}
        >
          <div
            className={`
              grid
              ${getSpacingClass('md', 'gap')}
              ${getSpacingClass('md', 'mt')}
            `}
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            }}
          >
            {edgeTypeDefinitions.map((edgeType) => (
              <EdgeTypePreview
                key={edgeType.id}
                edgeType={edgeType}
                onSelect={onSelectEdgeType ? () => onSelectEdgeType(edgeType.id) : undefined}
              />
            ))}
          </div>
        </Collapsible>
      </Card>

      <Card padding="md">
        <Collapsible
          trigger={
            <div className="flex items-center justify-between w-full cursor-pointer">
              <h3
                className={`
                  ${getTypographyClasses('h4')}
                  ${getColorClass('neutral', 'dark', 'text')}
                  m-0
                `}
              >
                Using Edge Types
              </h3>
              <span className="text-sm opacity-60">
                {helpOpen ? '▼' : '▶'}
              </span>
            </div>
          }
          defaultOpen={helpOpen}
          onOpenChange={setHelpOpen}
        >
          <p
            className={`
              ${getTypographyClasses('body')}
              ${getColorClass('neutral', 'DEFAULT', 'text')}
              m-0
              ${getSpacingClass('md', 'mt')}
            `}
          >
            Different edge types provide different visual styles and routing algorithms. Select an edge type to use it for new connections.
          </p>
        </Collapsible>
      </Card>
    </div>
  );
}
