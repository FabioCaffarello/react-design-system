/**
 * React Flow Props Definitions
 * 
 * Definitions for all configurable ReactFlow props with descriptions
 */

import type { PropDefinition } from '../types/playgroundTypes';

/**
 * All ReactFlow prop definitions with tooltips
 */
export const REACT_FLOW_PROP_DEFINITIONS: PropDefinition[] = [
  // Appearance Props
  {
    key: 'fitView',
    label: 'Fit View',
    description: 'Automatically fit the view to show all nodes on mount',
    type: 'boolean',
    defaultValue: false,
    category: 'appearance',
  },
  {
    key: 'nodeOrigin',
    label: 'Node Origin',
    description: 'Origin point for node positioning [x, y]. Default is [0.5, 0.5] (center)',
    type: 'object',
    defaultValue: [0.5, 0.5],
    category: 'appearance',
  },
  
  // Interaction Props
  {
    key: 'panOnDrag',
    label: 'Pan on Drag',
    description: 'Enable panning by dragging. Can be boolean or array of mouse buttons [1, 2]',
    type: 'boolean',
    defaultValue: true,
    category: 'interaction',
  },
  {
    key: 'panOnScroll',
    label: 'Pan on Scroll',
    description: 'Enable panning by scrolling',
    type: 'boolean',
    defaultValue: false,
    category: 'interaction',
  },
  {
    key: 'zoomOnScroll',
    label: 'Zoom on Scroll',
    description: 'Enable zooming by scrolling',
    type: 'boolean',
    defaultValue: true,
    category: 'interaction',
  },
  {
    key: 'zoomOnPinch',
    label: 'Zoom on Pinch',
    description: 'Enable zooming by pinch gesture (touch devices)',
    type: 'boolean',
    defaultValue: true,
    category: 'interaction',
  },
  {
    key: 'zoomOnDoubleClick',
    label: 'Zoom on Double Click',
    description: 'Enable zooming by double clicking',
    type: 'boolean',
    defaultValue: true,
    category: 'interaction',
  },
  {
    key: 'selectOnClick',
    label: 'Select on Click',
    description: 'Select nodes/edges on click',
    type: 'boolean',
    defaultValue: true,
    category: 'interaction',
  },
  {
    key: 'nodesDraggable',
    label: 'Nodes Draggable',
    description: 'Allow nodes to be dragged',
    type: 'boolean',
    defaultValue: true,
    category: 'interaction',
  },
  {
    key: 'nodesConnectable',
    label: 'Nodes Connectable',
    description: 'Allow nodes to be connected',
    type: 'boolean',
    defaultValue: true,
    category: 'interaction',
  },
  {
    key: 'elementsSelectable',
    label: 'Elements Selectable',
    description: 'Allow nodes and edges to be selected',
    type: 'boolean',
    defaultValue: true,
    category: 'interaction',
  },
  {
    key: 'selectionOnDrag',
    label: 'Selection on Drag',
    description: 'Enable selection box by dragging',
    type: 'boolean',
    defaultValue: false,
    category: 'interaction',
  },
  
  // Keyboard Props
  {
    key: 'deleteKeyCode',
    label: 'Delete Key Code',
    description: 'Keyboard key code for deleting selected elements',
    type: 'select',
    defaultValue: 'Delete',
    options: [
      { value: 'Delete', label: 'Delete' },
      { value: 'Backspace', label: 'Backspace' },
      { value: '', label: 'Disabled' },
    ],
    category: 'keyboard',
  },
  {
    key: 'multiSelectKeyCode',
    label: 'Multi Select Key Code',
    description: 'Keyboard key code for multi-selection (hold to select multiple)',
    type: 'select',
    defaultValue: 'Meta',
    options: [
      { value: 'Meta', label: 'Meta (Cmd on Mac)' },
      { value: 'Control', label: 'Control' },
      { value: 'Shift', label: 'Shift' },
      { value: '', label: 'Disabled' },
    ],
    category: 'keyboard',
  },
  
  // Zoom Props
  {
    key: 'minZoom',
    label: 'Min Zoom',
    description: 'Minimum zoom level (0.1 to 1)',
    type: 'number',
    defaultValue: 0.5,
    category: 'zoom',
  },
  {
    key: 'maxZoom',
    label: 'Max Zoom',
    description: 'Maximum zoom level (1 to 4)',
    type: 'number',
    defaultValue: 2,
    category: 'zoom',
  },
  {
    key: 'defaultZoom',
    label: 'Default Zoom',
    description: 'Initial zoom level (0.1 to 4)',
    type: 'number',
    defaultValue: 1,
    category: 'zoom',
  },
  
  // Other Props
  {
    key: 'snapToGrid',
    label: 'Snap to Grid',
    description: 'Snap nodes to grid when dragging',
    type: 'boolean',
    defaultValue: false,
    category: 'other',
  },
];

/**
 * Get props by category
 */
export function getPropsByCategory(category: PropDefinition['category']): PropDefinition[] {
  return REACT_FLOW_PROP_DEFINITIONS.filter((prop) => prop.category === category);
}

/**
 * Get prop definition by key
 */
export function getPropDefinition(key: keyof import('../types/playgroundTypes').ReactFlowConfig): PropDefinition | undefined {
  return REACT_FLOW_PROP_DEFINITIONS.find((prop) => prop.key === key);
}
