'use client';

import React, { ChangeEvent } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { FlowNodeWrapper } from '../atoms/FlowNodeWrapper';
import { FlowHandle } from '../atoms/FlowHandle';
import type { FlowNodeData } from '../organisms/FlowTypes';

/**
 * SelectorNode Component
 * 
 * Specialized node with interactive controls (e.g., color picker, selectors).
 * Supports multiple source handles for different outputs.
 */
export interface SelectorNodeData extends FlowNodeData {
  /**
   * Callback for when selector value changes
   */
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  /**
   * Current value of the selector
   */
  value?: string;
  /**
   * Type of selector: 'color' | 'select' | 'text' | 'number'
   */
  selectorType?: 'color' | 'select' | 'text' | 'number';
  /**
   * Options for select type
   */
  options?: Array<{ label: string; value: string }>;
  /**
   * Multiple source handles configuration
   */
  sourceHandles?: Array<{
    id: string;
    position: Position;
    label?: string;
  }>;
}

export type SelectorNodeProps = NodeProps<SelectorNodeData>;

export const SelectorNode = React.memo(({
  data,
  selected,
}: SelectorNodeProps) => {
  const variant = data.variant || 'default';
  const size = data.size || 'md';
  const selectorType = data.selectorType || 'text';
  const sourceHandles = data.sourceHandles || [
    { id: 'a', position: Position.Right },
    { id: 'b', position: Position.Right },
  ];
  
  return (
    <FlowNodeWrapper variant={variant} size={size} selected={selected}>
      {/* Target handles */}
      <FlowHandle
        type="target"
        position={Position.Left}
        variant={variant}
      />
      
      {/* Node content */}
      <div className="flex flex-col gap-2">
        {data.label && (
          <div className="font-medium">
            {data.label}
          </div>
        )}
        
        {/* Interactive selector */}
        <div className="nodrag">
          {selectorType === 'color' && (
            <input
              type="color"
              value={data.value || '#000000'}
              onChange={data.onChange}
              className="w-full h-8 rounded cursor-pointer"
            />
          )}
          {selectorType === 'select' && (
            <select
              value={data.value || ''}
              onChange={data.onChange as unknown}
              className="w-full px-2 py-1 rounded border"
            >
              {data.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {selectorType === 'text' && (
            <input
              type="text"
              value={data.value || ''}
              onChange={data.onChange as unknown}
              className="w-full px-2 py-1 rounded border"
              placeholder="Enter text..."
            />
          )}
          {selectorType === 'number' && (
            <input
              type="number"
              value={data.value || ''}
              onChange={data.onChange as unknown}
              className="w-full px-2 py-1 rounded border"
              placeholder="Enter number..."
            />
          )}
        </div>
        
        {data.description && (
          <div className="text-sm text-gray-500">
            {data.description}
          </div>
        )}
      </div>
      
      {/* Multiple source handles */}
      {sourceHandles.map((handle, index) => (
        <FlowHandle
          key={handle.id}
          type="source"
          position={handle.position}
          id={handle.id}
          variant={variant}
          customStyle={{
            top: handle.position === Position.Right ? `${10 + index * 20}px` : undefined,
            bottom: handle.position === Position.Right ? undefined : `${10 + index * 20}px`,
          }}
          ariaLabel={handle.label || `Output ${handle.id}`}
        />
      ))}
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

SelectorNode.displayName = 'SelectorNode';
