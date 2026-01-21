'use client';

import React, { useCallback, ChangeEvent } from 'react';
import { Position, type NodeProps, type Connection, type Edge } from '@xyflow/react';
import { FlowNodeWrapper } from '../atoms/FlowNodeWrapper';
import { FlowHandle } from '../atoms/FlowHandle';
import type { FlowNodeData } from '../organisms/FlowTypes';

/**
 * ColorSelectorNode Component
 * 
 * Node with integrated color picker, based on the React Flow example.
 * Allows users to select colors and update node/background colors dynamically.
 * 
 * @example
 * ```tsx
 * <ColorSelectorNode
 *   data={{
 *     label: 'Color Picker',
 *     color: '#1A192B',
 *     onChange: (color) => console.log(color)
 *   }}
 * />
 * ```
 */
export interface ColorSelectorNodeData extends FlowNodeData {
  /**
   * Current color value
   */
  color?: string;
  /**
   * Callback when color changes
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export type ColorSelectorNodeProps = NodeProps<ColorSelectorNodeData>;

const targetHandleStyle: React.CSSProperties = { background: '#555' };
const sourceHandleStyleA: React.CSSProperties = { ...targetHandleStyle, top: 10 };
const sourceHandleStyleB: React.CSSProperties = {
  ...targetHandleStyle,
  bottom: 10,
  top: 'auto',
};

const onConnect = (_params: Connection | Edge) => {
  // Connection handler - can be extended with actual logic
};

export const ColorSelectorNode = React.memo(({
  data,
  selected,
  isConnectable,
}: ColorSelectorNodeProps) => {
  const variant = data.variant || 'default';
  const size = data.size || 'md';
  const color = data.color || '#1A192B';

  const handleColorChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (data.onChange) {
      data.onChange(event);
    }
  }, [data]);

  return (
    <FlowNodeWrapper variant={variant} size={size} selected={selected}>
      <FlowHandle
        type="target"
        position={Position.Left}
        style={targetHandleStyle}
        onConnect={onConnect}
        isConnectable={isConnectable}
      />
      <div style={{ padding: '10px', minWidth: '150px' }}>
        <div style={{ marginBottom: '8px', fontWeight: 500 }}>
          Custom Color Picker Node: <strong>{color}</strong>
        </div>
        <Input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="nodrag nokey"
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>
      <FlowHandle
        type="source"
        position={Position.Right}
        id="a"
        style={sourceHandleStyleA}
        isConnectable={isConnectable}
        onMouseDown={(_e) => {
          // Mouse down handler - can be extended with actual logic
        }}
      />
      <FlowHandle
        type="source"
        position={Position.Right}
        id="b"
        style={sourceHandleStyleB}
        isConnectable={isConnectable}
      />
    </FlowNodeWrapper>
  );
}, (prev, next) => {
  return (
    prev.data === next.data &&
    prev.selected === next.selected &&
    prev.isConnectable === next.isConnectable &&
    prev.position?.x === next.position?.x &&
    prev.position?.y === next.position?.y
  );
});

ColorSelectorNode.displayName = 'ColorSelectorNode';
