'use client';

import React, { useMemo, useCallback } from 'react';
import { Position, type NodeProps, type Connection, type Edge } from '@xyflow/react';
import { FlowNodeWrapper } from '../atoms/FlowNodeWrapper';
import { FlowHandle } from '../atoms/FlowHandle';
import { FlowNodeContent } from './FlowNodeContent';
import type { FlowNodeData } from '../organisms/FlowTypes';
import styles from '../styles/modules/CustomNode.module.css';

/**
 * CustomNode Component
 * 
 * Enhanced custom node component that follows the design system.
 * Supports dynamic handles with custom styles, conditional rendering,
 * content slots, and improved flexibility.
 * 
 * Composes atoms (FlowNodeWrapper, FlowHandle) into a reusable node.
 * Uses React.memo with granular comparison for performance optimization.
 * 
 * @example
 * ```tsx
 * <CustomNode
 *   data={{
 *     label: 'My Node',
 *     sourceHandles: [
 *       { id: 'a', position: Position.Right, style: { top: 10 } },
 *       { id: 'b', position: Position.Right, style: { bottom: 10, top: 'auto' } }
 *     ],
 *     customContent: <div>Custom content</div>
 *   }}
 * />
 * ```
 */
export interface CustomNodeData extends FlowNodeData {
  /**
   * Custom source handles configuration with enhanced options
   */
  sourceHandles?: Array<{
    id?: string;
    position: Position;
    variant?: FlowNodeData['variant'];
    style?: React.CSSProperties;
    isConnectable?: boolean;
    onConnect?: (params: Connection | Edge) => void;
    onMouseDown?: (event: React.MouseEvent) => void;
    ariaLabel?: string;
  }>;
  /**
   * Custom target handles configuration with enhanced options
   */
  targetHandles?: Array<{
    id?: string;
    position: Position;
    variant?: FlowNodeData['variant'];
    style?: React.CSSProperties;
    isConnectable?: boolean;
    onConnect?: (params: Connection | Edge) => void;
    ariaLabel?: string;
  }>;
  /**
   * Whether to show default handles if custom handles are not provided
   */
  showDefaultHandles?: boolean;
  /**
   * Custom content slot - overrides default content rendering
   */
  customContent?: React.ReactNode;
  /**
   * Custom style for the node wrapper
   */
  customStyle?: React.CSSProperties;
  /**
   * Custom className for the node wrapper
   */
  customClassName?: string;
  /**
   * Use FlowNodeContent for structured content rendering
   */
  useStructuredContent?: boolean;
  /**
   * Render props for header, body, footer
   */
  renderHeader?: (data: FlowNodeData) => React.ReactNode;
  renderBody?: (data: FlowNodeData) => React.ReactNode;
  renderFooter?: (data: FlowNodeData) => React.ReactNode;
  /**
   * Slots for header, body, footer
   */
  headerSlot?: React.ReactNode;
  bodySlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
}

export type CustomNodeProps = NodeProps<CustomNodeData>;

export const CustomNode = React.memo(({
  data,
  selected,
  isConnectable,
  ..._nodeProps
}: CustomNodeProps) => {
  const variant = data.variant || 'default';
  const size = data.size || 'md';
  const showDefaultHandles = data.showDefaultHandles !== false;
  
  // Memoize default handles configuration
  const defaultTargetHandles = useMemo(() => [
    { position: Position.Top, variant },
    { position: Position.Left, variant },
  ], [variant]);
  
  const defaultSourceHandles = useMemo(() => [
    { position: Position.Bottom, variant },
    { position: Position.Right, variant },
  ], [variant]);
  
  // Use custom handles if provided, otherwise use defaults
  const targetHandles = useMemo(() => 
    data.targetHandles || (showDefaultHandles ? defaultTargetHandles : []),
    [data.targetHandles, showDefaultHandles, defaultTargetHandles]
  );
  
  const sourceHandles = useMemo(() => 
    data.sourceHandles || (showDefaultHandles ? defaultSourceHandles : []),
    [data.sourceHandles, showDefaultHandles, defaultSourceHandles]
  );
  
  // Handle connection callback
  const handleConnect = useCallback((_params: Connection | Edge) => {
    // Connection handler - can be extended with actual logic
  }, []);
  
  // Render node content
  const renderContent = useMemo(() => {
    // Priority: customContent > structured content > default content
    if (data.customContent) {
      return data.customContent;
    }
    
    if (data.useStructuredContent) {
      return (
        <FlowNodeContent
          renderHeader={data.renderHeader}
          renderBody={data.renderBody}
          renderFooter={data.renderFooter}
          headerSlot={data.headerSlot}
          bodySlot={data.bodySlot}
          footerSlot={data.footerSlot}
        />
      );
    }
    
    // Default content rendering
    return (
      <div className={styles.node}>
        <div className={styles.nodeContent}>
          {data.icon && (
            <div className={styles.nodeIcon}>
              {data.icon}
            </div>
          )}
          <div className={styles.nodeText}>
            {data.label && (
              <div className={styles.nodeLabel}>
                {data.label}
              </div>
            )}
            {data.description && (
              <div className={styles.nodeDescription}>
                {data.description}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    data.customContent,
    data.useStructuredContent,
    data.renderHeader,
    data.renderBody,
    data.renderFooter,
    data.headerSlot,
    data.bodySlot,
    data.footerSlot,
    data.icon,
    data.label,
    data.description,
  ]);
  
  // Generate ARIA label for the node
  const nodeAriaLabel = useMemo(() => {
    const parts: string[] = [];
    if (data.label) parts.push(`Node: ${data.label}`);
    if (data.description) parts.push(data.description);
    if (variant !== 'default') parts.push(`Variant: ${variant}`);
    if (selected) parts.push('Selected');
    return parts.length > 0 ? parts.join('. ') : `Flow node ${data.id || 'unnamed'}`;
  }, [data.label, data.description, variant, selected, data.id]);

  return (
    <FlowNodeWrapper
      variant={variant}
      size={size}
      selected={selected}
      style={data.customStyle}
      className={data.customClassName}
      role="group"
      aria-label={nodeAriaLabel}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
    >
      {/* Target handles */}
      {targetHandles.map((handle, index) => (
        <FlowHandle
          key={`target-${handle.position}-${handle.id || index}`}
          type="target"
          position={handle.position}
          id={handle.id}
          variant={handle.variant || variant}
          customStyle={handle.style}
          isConnectable={handle.isConnectable !== undefined ? handle.isConnectable : isConnectable}
          onConnect={handle.onConnect || handleConnect}
          ariaLabel={handle.ariaLabel || `Target connection point at ${handle.position} for ${data.label || 'node'}`}
        />
      ))}
      
      {/* Node content */}
      <div role="region" aria-label="Node content">
        {renderContent}
      </div>
      
      {/* Source handles */}
      {sourceHandles.map((handle, index) => (
        <FlowHandle
          key={`source-${handle.position}-${handle.id || index}`}
          type="source"
          position={handle.position}
          id={handle.id}
          variant={handle.variant || variant}
          customStyle={handle.style}
          isConnectable={handle.isConnectable !== undefined ? handle.isConnectable : isConnectable}
          onConnect={handle.onConnect || handleConnect}
          onMouseDown={handle.onMouseDown}
          ariaLabel={handle.ariaLabel || `Source connection point at ${handle.position} for ${data.label || 'node'}`}
        />
      ))}
    </FlowNodeWrapper>
  );
}, (prev, next) => {
  // Granular comparison for memoization
  // Compare data properties individually for better performance
  const prevData = prev.data;
  const nextData = next.data;
  
  // Quick reference equality check
  if (prevData === nextData && 
      prev.selected === next.selected &&
      prev.isConnectable === next.isConnectable &&
      prev.position?.x === next.position?.x &&
      prev.position?.y === next.position?.y &&
      prev.dragging === next.dragging) {
    return true;
  }
  
  // Deep comparison of critical data properties
  if (prevData?.label !== nextData?.label ||
      prevData?.variant !== nextData?.variant ||
      prevData?.size !== nextData?.size ||
      prevData?.icon !== nextData?.icon ||
      prevData?.description !== nextData?.description ||
      prevData?.customContent !== nextData?.customContent ||
      prevData?.showDefaultHandles !== nextData?.showDefaultHandles ||
      prevData?.useStructuredContent !== nextData?.useStructuredContent) {
    return false;
  }
  
  // Compare handles arrays
  const prevSourceHandles = prevData?.sourceHandles;
  const nextSourceHandles = nextData?.sourceHandles;
  if (prevSourceHandles?.length !== nextSourceHandles?.length) {
    return false;
  }
  if (prevSourceHandles && nextSourceHandles) {
    for (let i = 0; i < prevSourceHandles.length; i++) {
      const prevHandle = prevSourceHandles[i];
      const nextHandle = nextSourceHandles[i];
      if (prevHandle.id !== nextHandle.id ||
          prevHandle.position !== nextHandle.position ||
          prevHandle.variant !== nextHandle.variant) {
        return false;
      }
    }
  }
  
  const prevTargetHandles = prevData?.targetHandles;
  const nextTargetHandles = nextData?.targetHandles;
  if (prevTargetHandles?.length !== nextTargetHandles?.length) {
    return false;
  }
  if (prevTargetHandles && nextTargetHandles) {
    for (let i = 0; i < prevTargetHandles.length; i++) {
      const prevHandle = prevTargetHandles[i];
      const nextHandle = nextTargetHandles[i];
      if (prevHandle.id !== nextHandle.id ||
          prevHandle.position !== nextHandle.position ||
          prevHandle.variant !== nextHandle.variant) {
        return false;
      }
    }
  }
  
  return true;
});

CustomNode.displayName = 'CustomNode';
