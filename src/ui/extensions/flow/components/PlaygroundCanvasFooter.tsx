/**
 * Playground Canvas Footer Component
 * 
 * Footer with tabs for Node Inspector and Viewport Logger.
 * Positioned at bottom-right of the canvas.
 */

import React, { useState } from 'react';
import { Card } from '../../../molecules';
import { Button } from '../../../atoms';
import { NodeEditor, EdgeEditor } from './';
import { ViewportLogger } from './ViewportLogger';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { useFlowContext } from '../organisms/FlowContext';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../../tokens';

type FooterTab = 'inspector' | 'viewport';

export function PlaygroundCanvasFooter() {
  const [activeTab, setActiveTab] = useState<FooterTab>('inspector');
  const { nodes, edges, selectedNodeId, selectedEdgeId, setNodes, setEdges } = usePlaygroundContext();
  // ViewportLogger needs FlowContext, so we get it here
  const { reactFlowInstance } = useFlowContext();

  const selectedNode = React.useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  const selectedEdge = React.useMemo(
    () => edges.find((e) => e.id === selectedEdgeId),
    [edges, selectedEdgeId]
  );

  const handleNodeUpdate = React.useCallback(
    (nodeId: string, updates: any) => {
      setNodes(nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)));
    },
    [nodes, setNodes]
  );

  const handleEdgeUpdate = React.useCallback(
    (edgeId: string, updates: any) => {
      setEdges(edges.map((e) => (e.id === edgeId ? { ...e, ...updates } : e)));
    },
    [edges, setEdges]
  );

  const handleNodeDelete = React.useCallback(
    (nodeId: string) => {
      setNodes(nodes.filter((n) => n.id !== nodeId));
    },
    [nodes, setNodes]
  );

  const handleEdgeDelete = React.useCallback(
    (edgeId: string) => {
      setEdges(edges.filter((e) => e.id !== edgeId));
    },
    [edges, setEdges]
  );

  return (
    <div
      className="absolute bottom-4 right-4 z-40"
      style={{
        maxWidth: '350px',
        width: '100%',
      }}
    >
      <Card
        padding="sm"
        className={`
          shadow-lg
          border
          ${getColorClass('neutral', 'DEFAULT', 'border')}
        `}
        style={{
          backgroundColor: '#ffffff',
        }}
      >
        {/* Tabs */}
        <div className={`flex items-center gap-2 ${getSpacingClass('sm', 'mb')} border-b ${getColorClass('neutral', 'DEFAULT', 'border')} pb-2`}>
          <Button
            variant={activeTab === 'inspector' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('inspector')}
            className="text-xs"
          >
            Node Inspector
          </Button>
          <Button
            variant={activeTab === 'viewport' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('viewport')}
            className="text-xs"
          >
            Viewport Logger
          </Button>
        </div>

        {/* Content */}
        <div className="max-h-[300px] overflow-y-auto">
          {activeTab === 'inspector' ? (
            <div>
              {selectedNode ? (
                <NodeEditor
                  node={selectedNode}
                  onUpdate={handleNodeUpdate}
                  onDelete={handleNodeDelete}
                  onDuplicate={() => {}}
                />
              ) : selectedEdge ? (
                <EdgeEditor
                  edge={selectedEdge}
                  nodes={nodes}
                  onUpdate={handleEdgeUpdate}
                  onDelete={handleEdgeDelete}
                />
              ) : (
                <p
                  className={`
                    ${getTypographyClasses('body')}
                    ${getColorClass('neutral', 'DEFAULT', 'text')}
                    m-0
                    text-center
                    py-4
                  `}
                >
                  Select a node or edge to inspect
                </p>
              )}
            </div>
          ) : (
            <ViewportLogger />
          )}
        </div>

        {/* React Flow Attribution */}
        <div
          className={`
            ${getSpacingClass('xs', 'mt')}
            ${getTypographyClasses('caption')}
            ${getColorClass('neutral', 'DEFAULT', 'text')}
            text-right
            opacity-60
          `}
        >
          React Flow
        </div>
      </Card>
    </div>
  );
}
