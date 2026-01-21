'use client';

/**
 * Playground Dev Tools Component
 * 
 * Development tools panel with debug, state inspector, profiler, and logger.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { X, Wrench } from 'lucide-react';
import { Card } from '../../../molecules';
import { Button, Badge, Label } from '../../../atoms';
import Collapsible from '../../../atoms/Collapsible/Collapsible';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses,
  getRadiusClass
} from '../../../tokens';

export interface PlaygroundDevToolsProps {
  enabled?: boolean;
  position?: 'bottom' | 'top' | 'left' | 'right';
}

/**
 * Dev Tools Panel Component
 */
interface EventLogEntry {
  timestamp: number;
  type: string;
  data: unknown;
}

export function PlaygroundDevTools({ 
  enabled = false,
  position = 'bottom'
}: PlaygroundDevToolsProps) {
  // All hooks must be called before any early returns
  const [isOpen, setIsOpen] = useState(false);
  const [showStateInspector, setShowStateInspector] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);
  const [showEventLog, setShowEventLog] = useState(false);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  
  const {
    nodes,
    edges,
    reactFlowConfig,
    backgroundConfig,
    layoutConfig,
    theme,
    selectedNodeId,
    selectedEdgeId,
    hasPendingChanges,
    activeTab,
  } = usePlaygroundContext();

  // Performance metrics
  const performanceMetrics = useMemo(() => {
    return {
      nodeCount: nodes.length,
      edgeCount: edges.length,
      selectedItems: (selectedNodeId ? 1 : 0) + (selectedEdgeId ? 1 : 0),
      hasPendingChanges,
      activeTab,
    };
  }, [nodes.length, edges.length, selectedNodeId, selectedEdgeId, hasPendingChanges, activeTab]);

  // State inspector data - only depend on what we actually use
  const stateData = useMemo(() => {
    return {
      nodes: nodes.length,
      edges: edges.length,
      config: reactFlowConfig,
      background: backgroundConfig,
      layout: layoutConfig,
      theme,
      selection: {
        node: selectedNodeId,
        edge: selectedEdgeId,
      },
      pendingChanges: hasPendingChanges,
      activeTab,
    };
  }, [nodes.length, edges.length, reactFlowConfig, backgroundConfig, layoutConfig, theme, selectedNodeId, selectedEdgeId, hasPendingChanges, activeTab]);

  const clearEventLog = useCallback(() => {
    setEventLog([]);
  }, []);

  // Early return after all hooks
  if (!enabled) {
    return null;
  }

  const positionClasses = {
    bottom: 'fixed bottom-4 right-4',
    top: 'fixed top-20 right-4',
    left: 'fixed left-4 top-1/2 -translate-y-1/2',
    right: 'fixed right-4 top-1/2 -translate-y-1/2',
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`${positionClasses[position]} z-50`}
        aria-label="Open developer tools"
      >
        <Wrench className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card
      padding="lg"
      className={`
        ${positionClasses[position]} 
        z-50 
        w-96 
        max-h-[600px] 
        overflow-y-auto 
        shadow-2xl
      `}
      role="dialog"
      aria-label="Developer tools panel"
    >
      <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className={`
            ${getTypographyClasses('h4')}
            ${getColorClass('neutral', 'dark', 'text')}
            m-0
          `}>
            Dev Tools
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Close developer tools"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Performance Metrics */}
        <Collapsible
          trigger={
            <div className="flex items-center justify-between w-full cursor-pointer">
              <Label className="m-0">Performance Metrics</Label>
              <span className="text-sm opacity-60">
                {showPerformance ? '▼' : '▶'}
              </span>
            </div>
          }
          defaultOpen={showPerformance}
          onOpenChange={setShowPerformance}
        >
          <div className={`${getSpacingClass('md', 'mt')} space-y-2`}>
            <div className="flex justify-between">
              <span className={getTypographyClasses('body')}>Nodes:</span>
              <Badge variant="outline">{performanceMetrics.nodeCount}</Badge>
            </div>
            <div className="flex justify-between">
              <span className={getTypographyClasses('body')}>Edges:</span>
              <Badge variant="outline">{performanceMetrics.edgeCount}</Badge>
            </div>
            <div className="flex justify-between">
              <span className={getTypographyClasses('body')}>Selected:</span>
              <Badge variant="outline">{performanceMetrics.selectedItems}</Badge>
            </div>
            <div className="flex justify-between">
              <span className={getTypographyClasses('body')}>Pending Changes:</span>
              <Badge variant={hasPendingChanges ? 'warning' : 'success'}>
                {hasPendingChanges ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </Collapsible>

        {/* State Inspector */}
        <Collapsible
          trigger={
            <div className="flex items-center justify-between w-full cursor-pointer">
              <Label className="m-0">State Inspector</Label>
              <span className="text-sm opacity-60">
                {showStateInspector ? '▼' : '▶'}
              </span>
            </div>
          }
          defaultOpen={showStateInspector}
          onOpenChange={setShowStateInspector}
        >
          <div className={`
            ${getSpacingClass('md', 'mt')} 
            p-2 
            ${getColorClass('neutral', 'light', 'bg')} 
            ${getRadiusClass('md')} 
            font-mono 
            text-xs 
            overflow-auto 
            max-h-64
          `}>
            <pre className="m-0 whitespace-pre-wrap">
              {JSON.stringify(stateData, null, 2)}
            </pre>
          </div>
        </Collapsible>

        {/* Event Log */}
        <Collapsible
          trigger={
            <div className="flex items-center justify-between w-full cursor-pointer">
              <Label className="m-0">
                Event Log
                {eventLog.length > 0 && (
                  <Badge variant="outline" size="sm" className="ml-2">
                    {eventLog.length}
                  </Badge>
                )}
              </Label>
              <span className="text-sm opacity-60">
                {showEventLog ? '▼' : '▶'}
              </span>
            </div>
          }
          defaultOpen={showEventLog}
          onOpenChange={setShowEventLog}
        >
          <div className={`${getSpacingClass('md', 'mt')} space-y-2`}>
            {eventLog.length === 0 ? (
              <p className={`
                ${getTypographyClasses('caption')}
                ${getColorClass('neutral', 'DEFAULT', 'text')}
                m-0
              `}>
                No events logged yet
              </p>
            ) : (
              <>
                <div className={`
                  p-2 
                  ${getColorClass('neutral', 'light', 'bg')} 
                  ${getRadiusClass('md')} 
                  font-mono 
                  text-xs 
                  overflow-auto 
                  max-h-48
                  space-y-1
                `}>
                  {eventLog.slice(-20).reverse().map((event, index) => (
                    <div key={index} className={`border-b ${getColorClass('neutral', 'DEFAULT', 'border')} pb-1`}>
                      <div className="flex justify-between">
                        <span className="font-semibold">{event.type}</span>
                        <span className={getColorClass('neutral', 'DEFAULT', 'text')}>
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {event.data && (
                        <pre className="mt-1 text-xs overflow-x-auto">
                          {JSON.stringify(event.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearEventLog}
                  className="w-full"
                >
                  Clear Log
                </Button>
              </>
            )}
          </div>
        </Collapsible>

        {/* Actions */}
        <div className={`flex flex-col ${getSpacingClass('sm', 'gap')} ${getSpacingClass('md', 'pt')} border-t`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('Playground State:', stateData);
                // eslint-disable-next-line no-console
                console.log('Performance:', performanceMetrics);
              }
            }}
            className="w-full"
          >
            Log to Console
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const data = {
                state: stateData,
                performance: performanceMetrics,
                timestamp: Date.now(),
              };
              navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            }}
            className="w-full"
          >
            Copy State to Clipboard
          </Button>
        </div>
      </div>
    </Card>
  );
}
