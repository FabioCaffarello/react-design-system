'use client';

import React, { useCallback, useState } from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { FlowNodeWrapper } from '../atoms/FlowNodeWrapper';
import { FlowHandle } from '../atoms/FlowHandle';
import { Input } from '../../../atoms';
import type { FlowNodeData } from '../organisms/FlowTypes';

/**
 * TextNode Component
 * 
 * Node focused on editable text content.
 * Allows inline editing of text content.
 */
export interface TextNodeData extends FlowNodeData {
  /**
   * Text content (editable)
   */
  text?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Callback when text changes
   */
  onTextChange?: (text: string) => void;
}

export type TextNodeProps = NodeProps<TextNodeData>;

export const TextNode = React.memo(({
  data,
  selected,
}: TextNodeProps) => {
  const variant = data.variant || 'default';
  const size = data.size || 'md';
  const [text, setText] = useState(data.text || '');

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (data.onTextChange) {
      data.onTextChange(newText);
    }
  }, [data]);

  return (
    <FlowNodeWrapper variant={variant} size={size} selected={selected}>
      <FlowHandle type="target" position={Position.Top} variant={variant} />
      <FlowHandle type="target" position={Position.Left} variant={variant} />
      <div style={{ padding: '12px', minWidth: '200px' }}>
        <Input
          value={text}
          onChange={handleTextChange}
          placeholder={data.placeholder || 'Enter text...'}
          className={selected ? '' : 'nodrag'}
          style={{ width: '100%' }}
        />
      </div>
      <FlowHandle type="source" position={Position.Bottom} variant={variant} />
      <FlowHandle type="source" position={Position.Right} variant={variant} />
    </FlowNodeWrapper>
  );
}, (prev, next) => {
  return (
    prev.data === next.data &&
    prev.selected === next.selected &&
    prev.position?.x === next.position?.x &&
    prev.position?.y === next.position?.y
  );
});

TextNode.displayName = 'TextNode';
