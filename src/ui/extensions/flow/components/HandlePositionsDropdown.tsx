/**
 * Handle Positions Dropdown Component
 * 
 * Dropdown to select default handle positions for nodes.
 */

import React from 'react';
import { Label, Select } from '../../../atoms';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { 
  getSpacingClass 
} from '../../../tokens';

export type HandlePosition = 'top-bottom' | 'left-right' | 'all';

const handlePositionOptions = [
  { value: 'top-bottom', label: 'Top-Bottom' },
  { value: 'left-right', label: 'Left-Right' },
  { value: 'all', label: 'All Sides' },
];

export function HandlePositionsDropdown() {
  const { reactFlowConfig, setReactFlowConfig } = usePlaygroundContext();
  
  // Get current handle position from config or default
  const currentPosition = (reactFlowConfig as any)?.handlePositions || 'top-bottom';

  const handleChange = (value: string) => {
    setReactFlowConfig({
      ...reactFlowConfig,
      handlePositions: value as HandlePosition,
    });
  };

  return (
    <div className={`flex flex-col ${getSpacingClass('sm', 'gap')}`}>
      <Label htmlFor="handle-positions">Handle Positions</Label>
      <Select
        id="handle-positions"
        value={currentPosition}
        onChange={(e) => handleChange(e.target.value)}
        options={handlePositionOptions}
      />
    </div>
  );
}
