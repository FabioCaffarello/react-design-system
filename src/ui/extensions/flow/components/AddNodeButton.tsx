'use client';

/**
 * Add Node Button Component
 * 
 * Simple button to add new nodes to the canvas.
 * Opens a dropdown menu to select node type (without previews).
 */

import React, { useState, useCallback } from 'react';
import { Button, Select } from '../../../atoms';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { generateNodeId } from '../utils/playgroundHelpers';
import type { Node } from '@xyflow/react';
import type { FlowNodeData } from '../organisms/FlowTypes';
import { 
  getSpacingClass 
} from '../../../tokens';

/**
 * Available node types for quick creation
 */
const nodeTypes = [
  { value: 'default', label: 'Default Node' },
  { value: 'input', label: 'Input Node' },
  { value: 'output', label: 'Output Node' },
  { value: 'custom', label: 'Custom Node' },
];

export function AddNodeButton() {
  const { nodes, setNodes, setHasPendingChanges } = usePlaygroundContext();
  const [selectedType, setSelectedType] = useState<string>('default');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddNode = useCallback(() => {
    // Calculate position - center of existing nodes or default position
    let position = { x: 250, y: 250 };
    
    if (nodes.length > 0) {
      // Calculate center of all nodes
      const sumX = nodes.reduce((sum, n) => sum + (n.position.x + (n.width || 200) / 2), 0);
      const sumY = nodes.reduce((sum, n) => sum + (n.position.y + (n.height || 60) / 2), 0);
      position = {
        x: sumX / nodes.length,
        y: sumY / nodes.length + 150, // Offset below center
      };
    }

    const newNode: Node<FlowNodeData> = {
      id: generateNodeId(),
      type: selectedType,
      position,
      data: {
        label: `${nodeTypes.find(t => t.value === selectedType)?.label || 'Node'}`,
      },
      width: 200,
      height: 60,
    };

    setNodes([...nodes, newNode]);
    setHasPendingChanges(true);
    setIsOpen(false);
  }, [nodes, setNodes, selectedType, setHasPendingChanges]);

  return (
    <div className={`flex flex-col ${getSpacingClass('sm', 'gap')}`}>
      <Button
        variant="primary"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-center"
      >
        <span className="mr-2">+</span>
        Add new node
      </Button>
      
      {isOpen && (
        <div className={`flex flex-col ${getSpacingClass('sm', 'gap')}`}>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            options={nodeTypes}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddNode}
            className="w-full"
          >
            Add to Canvas
          </Button>
        </div>
      )}
    </div>
  );
}
