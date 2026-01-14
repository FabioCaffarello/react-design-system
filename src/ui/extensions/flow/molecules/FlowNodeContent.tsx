'use client';

import React from 'react';
import type { ReactNode } from 'react';
import { useNodeId } from '@xyflow/react';
import { useFlowContext } from '../organisms/FlowContext';
import type { FlowNodeData, NodeHeaderProps, NodeBodyProps, NodeFooterProps } from '../organisms/FlowTypes';

/**
 * FlowNodeContent Component
 * 
 * Content wrapper for nodes with support for render props pattern.
 * Single Responsibility: Structure node content with header, body, footer.
 */
export interface FlowNodeContentProps {
  children?: ReactNode;
  renderHeader?: (data: FlowNodeData) => ReactNode;
  renderBody?: (data: FlowNodeData) => ReactNode;
  renderFooter?: (data: FlowNodeData) => ReactNode;
  HeaderComponent?: React.ComponentType<NodeHeaderProps>;
  BodyComponent?: React.ComponentType<NodeBodyProps>;
  FooterComponent?: React.ComponentType<NodeFooterProps>;
  headerSlot?: ReactNode;
  bodySlot?: ReactNode;
  footerSlot?: ReactNode;
}

export function FlowNodeContent({
  children,
  renderHeader,
  renderBody,
  renderFooter,
  HeaderComponent,
  BodyComponent,
  FooterComponent,
  headerSlot,
  bodySlot,
  footerSlot,
}: FlowNodeContentProps) {
  const nodeId = useNodeId();
  const { nodes } = useFlowContext();
  const node = nodes.find((n) => n.id === nodeId);
  const data = node?.data as FlowNodeData | undefined;
  const selected = node?.selected || false;
  
  if (!data) {
    return null;
  }
  
  // Priority: slot > render prop > component > default
  const header = headerSlot || 
                (renderHeader ? renderHeader(data) : null) ||
                (HeaderComponent ? <HeaderComponent data={data} selected={selected} /> : null);
  
  const body = bodySlot ||
              (renderBody ? renderBody(data) : null) ||
              (BodyComponent ? <BodyComponent data={data} selected={selected} /> : null) ||
              children;
  
  const footer = footerSlot ||
                (renderFooter ? renderFooter(data) : null) ||
                (FooterComponent ? <FooterComponent data={data} selected={selected} /> : null);
  
  return (
    <div className="flex flex-col">
      {header && (
        <div className="mb-2">
          {header}
        </div>
      )}
      {body && (
        <div className="flex-1">
          {body}
        </div>
      )}
      {footer && (
        <div className="mt-2">
          {footer}
        </div>
      )}
    </div>
  );
}
