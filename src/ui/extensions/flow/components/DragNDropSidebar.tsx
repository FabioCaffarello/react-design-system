/**
 * Drag & Drop Sidebar Component
 * 
 * Sidebar component for dragging nodes onto the canvas.
 * Based on the React Flow DragNDrop example with design system integration.
 */

import React, { DragEvent } from 'react';
import { Card } from '../../../molecules';
import type { Node } from '@xyflow/react';
import styles from '../styles/modules/DragNDropSidebar.module.css';

export interface DragNDropSidebarProps {
  /**
   * Available node types to drag
   */
  nodeTypes?: Array<{
    type: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
    defaultData?: Partial<Node['data']>;
  }>;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Whether sidebar is visible
   */
  visible?: boolean;
}

/**
 * Default node types available for drag & drop
 */
const defaultNodeTypes = [
  {
    type: 'input',
    label: 'Input Node',
    description: 'Start node with input handle',
    defaultData: { label: 'Input Node' },
  },
  {
    type: 'default',
    label: 'Default Node',
    description: 'Standard node with handles on all sides',
    defaultData: { label: 'Default Node' },
  },
  {
    type: 'output',
    label: 'Output Node',
    description: 'End node with output handle',
    defaultData: { label: 'Output Node' },
  },
  {
    type: 'custom',
    label: 'Custom Node',
    description: 'Custom node with design system styling',
    defaultData: { label: 'Custom Node', variant: 'primary' },
  },
];

/**
 * Handle drag start event
 */
function onDragStart(event: DragEvent, nodeType: string) {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
}

export function DragNDropSidebar({
  nodeTypes = defaultNodeTypes,
  className,
  visible = true,
}: DragNDropSidebarProps) {
  if (!visible) {
    return null;
  }

  return (
    <aside className={`${styles.aside} ${className || ''}`}>
      <div className={styles.description}>
        Drag nodes to the canvas to add them
      </div>
      <div className={styles.nodeList}>
        {nodeTypes.map((nodeType) => (
          <Card
            key={nodeType.type}
            padding="sm"
            className={styles.draggableNode}
            onDragStart={(e: DragEvent) => onDragStart(e, nodeType.type)}
            draggable
          >
            <div className={styles.nodeContent}>
              {nodeType.icon && (
                <div className={styles.nodeIcon}>
                  {nodeType.icon}
                </div>
              )}
              <div className={styles.nodeInfo}>
                <div className={styles.nodeLabel}>
                  {nodeType.label}
                </div>
                {nodeType.description && (
                  <div className={styles.nodeDescription}>
                    {nodeType.description}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </aside>
  );
}
