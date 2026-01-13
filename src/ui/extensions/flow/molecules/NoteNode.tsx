'use client';

import React from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { FlowNodeWrapper } from '../atoms/FlowNodeWrapper';
import { FlowHandle } from '../atoms/FlowHandle';
import type { FlowNodeData } from '../organisms/FlowTypes';

/**
 * NoteNode Component
 * 
 * Post-it style node for annotations and notes.
 * Styled with a yellow/note-like appearance.
 */
export interface NoteNodeData extends FlowNodeData {
  /**
   * Note content
   */
  note?: string;
}

export type NoteNodeProps = NodeProps<NoteNodeData>;

export const NoteNode = React.memo(({
  data,
  selected,
}: NoteNodeProps) => {
  const size = data.size || 'md';
  const note = data.note || data.label || 'Note';

  return (
    <FlowNodeWrapper
      variant="warning"
      size={size}
      selected={selected}
      style={{
        backgroundColor: '#fffbeb',
        borderColor: '#fbbf24',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transform: 'rotate(-1deg)',
      }}
    >
      <FlowHandle type="target" position={Position.Top} variant="warning" />
      <div style={{ padding: '12px', minWidth: '150px', fontStyle: 'italic' }}>
        {note}
      </div>
      <FlowHandle type="source" position={Position.Bottom} variant="warning" />
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

NoteNode.displayName = 'NoteNode';
