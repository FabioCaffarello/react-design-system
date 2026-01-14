'use client';

import React from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { FlowNodeWrapper } from '../atoms/FlowNodeWrapper';
import { FlowHandle } from '../atoms/FlowHandle';
import type { FlowNodeData } from '../organisms/FlowTypes';

/**
 * InputNode Component
 * 
 * Specialized node for input nodes - only has source handles (outputs).
 * Typically used as entry points in a flow.
 */
export type InputNodeProps = NodeProps<FlowNodeData>;

export const InputNode = React.memo(({
  data,
  selected,
}: InputNodeProps) => {
  const variant = data.variant || 'primary';
  const size = data.size || 'md';
  
  return (
    <FlowNodeWrapper variant={variant} size={size} selected={selected}>
      {/* Source handles only (outputs) */}
      <FlowHandle
        type="source"
        position={Position.Bottom}
        variant={variant}
      />
      <FlowHandle
        type="source"
        position={Position.Right}
        variant={variant}
      />
      
      {/* Node content */}
      <div className="flex items-center gap-2">
        {data.icon && (
          <div className="flex-shrink-0">
            {data.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {data.label && (
            <div className="font-medium truncate">
              {data.label}
            </div>
          )}
          {data.description && (
            <div className="text-sm text-gray-500 truncate">
              {data.description}
            </div>
          )}
        </div>
      </div>
    </FlowNodeWrapper>
  );
}, (prev, next) => {
  return (
    prev.data === next.data &&
    prev.selected === next.selected &&
    prev.position?.x === next.position?.x &&
    prev.position?.y === next.position?.y &&
    prev.dragging === next.dragging
  );
});

InputNode.displayName = 'InputNode';
