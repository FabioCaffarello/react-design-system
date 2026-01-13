/**
 * Floating Edges Checkbox Component
 * 
 * Checkbox to enable/disable floating edges.
 */

import React from 'react';
import { Label } from '../../../atoms';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { 
  getSpacingClass 
} from '../../../tokens';

export function FloatingEdgesCheckbox() {
  const { reactFlowConfig, setReactFlowConfig } = usePlaygroundContext();
  
  // Get current floating edges state from config or default
  const floatingEdges = (reactFlowConfig as any)?.floatingEdges ?? false;

  const handleChange = (checked: boolean) => {
    setReactFlowConfig({
      ...reactFlowConfig,
      floatingEdges: checked,
    });
  };

  return (
    <Label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={floatingEdges}
        onChange={(e) => handleChange(e.target.checked)}
        className={getSpacingClass('sm', 'mr')}
      />
      <span>Floating Edges</span>
    </Label>
  );
}
