/**
 * Flow Provider Composition
 * 
 * Composes all Flow providers in a hierarchical structure.
 */

'use client';

import type { ReactNode } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { FlowProvider, type FlowProviderProps } from '../organisms/FlowProvider';
import { FlowStyleProvider, type FlowStyleProviderProps } from './FlowStyleProvider';
import { FlowEventProvider, type FlowEventProviderProps } from './FlowEventProvider';
import { FlowPerformanceProvider, type FlowPerformanceProviderProps } from './FlowPerformanceProvider';
import { FlowDebugProvider, type FlowDebugProviderProps } from './FlowDebugProvider';

/**
 * Flow Provider Composition Props
 */
export interface FlowProviderCompositionProps
  extends Omit<FlowProviderProps, 'children'>,
    Partial<Omit<FlowStyleProviderProps, 'children'>>,
    Partial<Omit<FlowEventProviderProps, 'children'>>,
    Partial<Omit<FlowPerformanceProviderProps, 'children'>>,
    Partial<Omit<FlowDebugProviderProps, 'children'>> {
  children: ReactNode;
  /**
   * Enable debug provider (defaults to development mode)
   */
  enableDebug?: boolean;
  /**
   * Enable performance provider
   */
  enablePerformance?: boolean;
  /**
   * Enable event provider
   */
  enableEvents?: boolean;
  /**
   * Enable style provider
   */
  enableStyles?: boolean;
}

/**
 * Flow Provider Composition
 * 
 * Composes all Flow providers in the correct order:
 * 
 * ReactFlowProvider (base)
 *   └── FlowProvider (base)
 *       ├── FlowStyleProvider (optional)
 *       ├── FlowEventProvider (optional)
 *       ├── FlowPerformanceProvider (optional)
 *       └── FlowDebugProvider (optional, dev only)
 */
export function FlowProviderComposition({
  children,
  enableStyles = true,
  enableEvents = true,
  enablePerformance = true,
  enableDebug = process.env.NODE_ENV === 'development',
  // FlowProvider props
  nodes,
  edges,
  defaultNodes,
  defaultEdges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onBeforeDelete,
  theme,
  validationRules,
  connectionRules,
  layoutStrategy,
  layoutOptions,
  onNodeAdd,
  onNodeRemove,
  onNodeUpdate,
  onEdgeAdd,
  onEdgeRemove,
  onEdgeUpdate,
  // FlowStyleProvider props
  initialTheme,
  initialOverrides,
  onThemeChange,
  // FlowEventProvider props
  maxHistorySize,
  enableHistory,
  // FlowPerformanceProvider props
  initialOptions,
  onMetricsUpdate,
  // FlowDebugProvider props
  initialDebugState,
  ..._rest
}: FlowProviderCompositionProps) {
  // Determine theme from FlowProvider or FlowStyleProvider
  const finalTheme = theme || initialTheme || 'light';
  
  return (
    <ReactFlowProvider>
      <FlowProvider
        nodes={nodes}
        edges={edges}
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onBeforeDelete={onBeforeDelete}
        theme={finalTheme}
        validationRules={validationRules}
        connectionRules={connectionRules}
        layoutStrategy={layoutStrategy}
        layoutOptions={layoutOptions}
        onNodeAdd={onNodeAdd}
        onNodeRemove={onNodeRemove}
        onNodeUpdate={onNodeUpdate}
        onEdgeAdd={onEdgeAdd}
        onEdgeRemove={onEdgeRemove}
        onEdgeUpdate={onEdgeUpdate}
      >
        {enableStyles ? (
          <FlowStyleProvider
            initialTheme={finalTheme}
            initialOverrides={initialOverrides}
            onThemeChange={onThemeChange}
          >
            {enableEvents ? (
              <FlowEventProvider
                maxHistorySize={maxHistorySize}
                enableHistory={enableHistory}
              >
                {enablePerformance ? (
                  <FlowPerformanceProvider
                    initialOptions={initialOptions}
                    onMetricsUpdate={onMetricsUpdate}
                  >
                    {enableDebug ? (
                      <FlowDebugProvider
                        nodes={nodes || []}
                        edges={edges || []}
                        initialDebugState={initialDebugState}
                        enabled={enableDebug}
                      >
                        {children}
                      </FlowDebugProvider>
                    ) : (
                      children
                    )}
                  </FlowPerformanceProvider>
                ) : enableDebug ? (
                  <FlowDebugProvider
                    nodes={nodes || []}
                    edges={edges || []}
                    initialDebugState={initialDebugState}
                    enabled={enableDebug}
                  >
                    {children}
                  </FlowDebugProvider>
                ) : (
                  children
                )}
              </FlowEventProvider>
            ) : enablePerformance ? (
              <FlowPerformanceProvider
                initialOptions={initialOptions}
                onMetricsUpdate={onMetricsUpdate}
              >
                {enableDebug ? (
                  <FlowDebugProvider
                    nodes={nodes || []}
                    edges={edges || []}
                    initialDebugState={initialDebugState}
                    enabled={enableDebug}
                  >
                    {children}
                  </FlowDebugProvider>
                ) : (
                  children
                )}
              </FlowPerformanceProvider>
            ) : enableDebug ? (
              <FlowDebugProvider
                nodes={nodes || []}
                edges={edges || []}
                initialDebugState={initialDebugState}
                enabled={enableDebug}
              >
                {children}
              </FlowDebugProvider>
            ) : (
              children
            )}
          </FlowStyleProvider>
        ) : enableEvents ? (
          <FlowEventProvider
            maxHistorySize={maxHistorySize}
            enableHistory={enableHistory}
          >
            {enablePerformance ? (
              <FlowPerformanceProvider
                initialOptions={initialOptions}
                onMetricsUpdate={onMetricsUpdate}
              >
                {enableDebug ? (
                  <FlowDebugProvider
                    nodes={nodes || []}
                    edges={edges || []}
                    initialDebugState={initialDebugState}
                    enabled={enableDebug}
                  >
                    {children}
                  </FlowDebugProvider>
                ) : (
                  children
                )}
              </FlowPerformanceProvider>
            ) : enableDebug ? (
              <FlowDebugProvider
                nodes={nodes || []}
                edges={edges || []}
                initialDebugState={initialDebugState}
                enabled={enableDebug}
              >
                {children}
              </FlowDebugProvider>
            ) : (
              children
            )}
          </FlowEventProvider>
        ) : enablePerformance ? (
          <FlowPerformanceProvider
            initialOptions={initialOptions}
            onMetricsUpdate={onMetricsUpdate}
          >
            {enableDebug ? (
              <FlowDebugProvider
                nodes={nodes || []}
                edges={edges || []}
                initialDebugState={initialDebugState}
                enabled={enableDebug}
              >
                {children}
              </FlowDebugProvider>
            ) : (
              children
            )}
          </FlowPerformanceProvider>
        ) : enableDebug ? (
          <FlowDebugProvider
            nodes={nodes || []}
            edges={edges || []}
            initialDebugState={initialDebugState}
            enabled={enableDebug}
          >
            {children}
          </FlowDebugProvider>
        ) : (
          children
        )}
      </FlowProvider>
    </ReactFlowProvider>
  );
}
