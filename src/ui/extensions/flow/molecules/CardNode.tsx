/**
 * CardNode Component
 * 
 * Basic node component using Card from design system.
 * Hybrid structure: Card for content + FlowNodeWrapper for handles.
 * Follows Atomic Design principles as a Molecule component.
 */

'use client';

import React from 'react';
import { Position, type NodeProps } from '@xyflow/react';
import { FlowNodeWrapper } from '../atoms/FlowNodeWrapper';
import { FlowHandle } from '../atoms/FlowHandle';
import { Card } from '../../../molecules';
import type { FlowNodeData } from '../organisms/FlowTypes';
import styles from '../styles/modules/CardNode.module.css';

export interface CardNodeData extends FlowNodeData {
  /**
   * Custom source handles configuration
   */
  sourceHandles?: Array<{
    id?: string;
    position: Position;
    variant?: FlowNodeData['variant'];
  }>;
  /**
   * Custom target handles configuration
   */
  targetHandles?: Array<{
    id?: string;
    position: Position;
    variant?: FlowNodeData['variant'];
  }>;
  /**
   * Whether to show default handles if custom handles are not provided
   */
  showDefaultHandles?: boolean;
}

export type CardNodeProps = NodeProps<CardNodeData>;

/**
 * CardNode Component
 * 
 * Uses Card from design system for the node content,
 * wrapped by FlowNodeWrapper for handles and theming.
 */
export const CardNode = React.memo(({
  data,
  selected,
}: CardNodeProps) => {
  const variant = data.variant || 'default';
  const size = data.size || 'md';
  const showDefaultHandles = data.showDefaultHandles !== false;
  
  // Default handles configuration with unique IDs
  // React Flow requires unique IDs for proper edge connection
  const defaultTargetHandles = [
    { id: 'target-top', position: Position.Top, variant },
    { id: 'target-left', position: Position.Left, variant },
  ];
  
  const defaultSourceHandles = [
    { id: 'source-bottom', position: Position.Bottom, variant },
    { id: 'source-right', position: Position.Right, variant },
  ];
  
  // Use custom handles if provided, otherwise use defaults
  // Ensure all handles have IDs for proper connection
  const targetHandles = data.targetHandles || (showDefaultHandles ? defaultTargetHandles : []);
  const sourceHandles = data.sourceHandles || (showDefaultHandles ? defaultSourceHandles : []);
  
  // Map size to Card padding
  const cardPadding = size === 'sm' ? 'small' : size === 'lg' ? 'large' : size === 'xl' ? 'large' : 'medium';
  
  // Map variant to Card variant
  const cardVariant = selected ? 'selected' : 'default';
  
  return (
    <FlowNodeWrapper 
      variant={variant} 
      size={size} 
      selected={selected}
      className="!p-0 !bg-transparent !border-0 !shadow-none"
    >
      {/* Target handles */}
      {targetHandles.map((handle, index) => (
        <FlowHandle
          key={`target-${handle.position}-${index}`}
          type="target"
          position={handle.position}
          id={handle.id}
          variant={handle.variant || variant}
        />
      ))}
      
      {/* Card as main content - Card provides all styling */}
      <div className={styles.cardContainer}>
        <Card
          variant={cardVariant}
          padding={cardPadding}
          className={styles.card}
          style={{
            backgroundColor: '#ffffff',
            boxShadow: selected 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 2px rgba(99, 102, 241, 0.5)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className={styles.cardContent}>
            {data.icon && (
              <div className={styles.cardIcon}>
                {data.icon}
              </div>
            )}
            <div className={styles.cardText}>
              {data.label && (
                <div className={styles.cardLabel}>
                  {data.label}
                </div>
              )}
              {data.description && (
                <div className={styles.cardDescription}>
                  {data.description}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      {/* Source handles */}
      {sourceHandles.map((handle, index) => (
        <FlowHandle
          key={`source-${handle.position}-${index}`}
          type="source"
          position={handle.position}
          id={handle.id}
          variant={handle.variant || variant}
        />
      ))}
    </FlowNodeWrapper>
  );
});

CardNode.displayName = 'CardNode';
