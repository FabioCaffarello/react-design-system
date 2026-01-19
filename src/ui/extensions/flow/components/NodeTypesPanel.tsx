/**
 * Node Types Panel Component
 * 
 * Panel for demonstrating and previewing different node types.
 */

import React, { useState } from 'react';
import { Card } from '../../../molecules';
import { Label } from '../../../atoms';
import Collapsible from '../../../atoms/Collapsible/Collapsible';
import { FlowProvider } from '../organisms/FlowProvider';
import { FlowCanvas } from '../organisms/FlowCanvas';
import { CardNode } from '../molecules/CardNode';
import { CustomNode } from '../molecules/CustomNode';
import { InputNode } from '../molecules/InputNode';
import { OutputNode } from '../molecules/OutputNode';
import { SelectorNode } from '../molecules/SelectorNode';
import { ResizableNode } from '../molecules/ResizableNode';
import type { Node } from '@xyflow/react';
import type { FlowNodeData } from '../organisms/FlowTypes';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses,
  getRadiusClass
} from '../../../tokens';

export interface NodeTypesPanelProps {
  onSelectNodeType?: (nodeType: string) => void;
}

/**
 * Node type definitions for preview
 */
const nodeTypeDefinitions = [
  {
    id: 'default',
    name: 'Card Node (Default)',
    description: 'Node using Card from design system',
    component: CardNode,
    previewNode: {
      id: 'preview-default',
      type: 'default',
      position: { x: 0, y: 0 },
      data: { label: 'Card Node', variant: 'default' },
    } as Node<FlowNodeData>,
  },
  {
    id: 'custom',
    name: 'Custom Node',
    description: 'Standard node with custom styling',
    component: CustomNode,
    previewNode: {
      id: 'preview-custom',
      type: 'custom',
      position: { x: 0, y: 0 },
      data: { label: 'Custom Node', variant: 'default' },
    } as Node<FlowNodeData>,
  },
  {
    id: 'input',
    name: 'Input',
    description: 'Input node with source handles only (outputs)',
    component: InputNode,
    previewNode: {
      id: 'preview-input',
      type: 'input',
      position: { x: 0, y: 0 },
      data: { label: 'Input Node', variant: 'primary' },
    } as Node<FlowNodeData>,
  },
  {
    id: 'output',
    name: 'Output',
    description: 'Output node with target handles only (inputs)',
    component: OutputNode,
    previewNode: {
      id: 'preview-output',
      type: 'output',
      position: { x: 0, y: 0 },
      data: { label: 'Output Node', variant: 'success' },
    } as Node<FlowNodeData>,
  },
  {
    id: 'selector',
    name: 'Selector',
    description: 'Selector node with multiple source handles',
    component: SelectorNode,
    previewNode: {
      id: 'preview-selector',
      type: 'selector',
      position: { x: 0, y: 0 },
      data: { label: 'Selector Node', variant: 'warning' },
    } as Node<FlowNodeData>,
  },
  {
    id: 'resizable',
    name: 'Resizable',
    description: 'Resizable node with drag handles',
    component: ResizableNode,
    previewNode: {
      id: 'preview-resizable',
      type: 'resizable',
      position: { x: 0, y: 0 },
      data: { label: 'Resizable Node', variant: 'default' },
    } as Node<FlowNodeData>,
  },
];

/**
 * Preview component for a single node type
 * Memoized for performance
 */
const NodeTypePreview = React.memo(function NodeTypePreview({ 
  nodeType, 
  onSelect 
}: { 
  nodeType: typeof nodeTypeDefinitions[0]; 
  onSelect?: () => void 
}) {
  const _nodeTypes = React.useMemo(() => ({
    [nodeType.id]: nodeType.component,
  }), [nodeType.id, nodeType.component]);

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
          <FlowProvider nodes={[nodeType.previewNode]} edges={[]}>
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
        {nodeType.name}
      </div>
      <div
        className={`
          ${getTypographyClasses('caption')}
          ${getColorClass('neutral', 'DEFAULT', 'text')}
        `}
      >
        {nodeType.description}
      </div>
    </Card>
  );
}, (prev, next) => {
  return prev.nodeType.id === next.nodeType.id && 
         prev.onSelect === next.onSelect;
});

export function NodeTypesPanel({ onSelectNodeType }: NodeTypesPanelProps) {
  const [typesOpen, setTypesOpen] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
      <Card padding="md">
        <Collapsible
          trigger={
            <div className="flex items-center justify-between w-full cursor-pointer">
              <Label className="m-0">
                Available Node Types
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
            {nodeTypeDefinitions.map((nodeType) => (
              <NodeTypePreview
                key={nodeType.id}
                nodeType={nodeType}
                onSelect={onSelectNodeType ? () => onSelectNodeType(nodeType.id) : undefined}
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
                Using Node Types
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
            Click on a node type to use it when creating new nodes. Each type has different handle configurations and behaviors.
          </p>
        </Collapsible>
      </Card>
    </div>
  );
}
