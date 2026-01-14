'use client';

import React from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { FlowNodeWrapper } from '../atoms/FlowNodeWrapper';
import { FlowHandle } from '../atoms/FlowHandle';
import type { FlowNodeData } from '../organisms/FlowTypes';

/**
 * OutputNode Component
 * 
 * Specialized node for output nodes - only has target handles (inputs).
 * Typically used as exit points in a flow.
 */
export type OutputNodeProps = NodeProps<FlowNodeData>;

export const OutputNode = React.memo(({
  data,
  selected,
}: OutputNodeProps) => {
  const variant = data.variant || 'success';
  const size = data.size || 'md';
  
  return (
    <FlowNodeWrapper variant={variant} size={size} selected={selected}>
      {/* Target handles only (inputs) */}
      <FlowHandle
        type="target"
        position={Position.Top}
        variant={variant}
      />
      <FlowHandle
        type="target"
        position={Position.Left}
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

OutputNode.displayName = 'OutputNode';
