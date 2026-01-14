'use client';

import { useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ReactFlowProvider, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  ReactFlowInstance,
} from '@xyflow/react';
import { FlowContext, type FlowContextValue } from './FlowContext';
import type {
  FlowNodeData,
  FlowEdgeData,
  ValidationRule,
  ConnectionRule,
  LayoutStrategyName,
  LayoutOptions,
} from './FlowTypes';

export interface FlowProviderProps<
  TNodeData extends FlowNodeData = FlowNodeData,
  TEdgeData extends FlowEdgeData = FlowEdgeData
> {
  // React Flow props
  nodes?: Node<TNodeData>[];
  edges?: Edge<TEdgeData>[];
  defaultNodes?: Node<TNodeData>[];
  defaultEdges?: Edge<TEdgeData>[];
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: (connection: Connection) => void;
  /**
   * Callback before deleting nodes/edges - return false to prevent deletion
   */
  onBeforeDelete?: (params: { nodes?: Node<TNodeData>[]; edges?: Edge<TEdgeData>[] }) => boolean | Promise<boolean>;
  
  // Design system props
  theme?: 'light' | 'dark';
  validationRules?: ValidationRule[];
  connectionRules?: ConnectionRule[];
  layoutStrategy?: LayoutStrategyName;
  layoutOptions?: LayoutOptions;
  
  // Callbacks
  onNodeAdd?: (node: Node<TNodeData>) => void;
  onNodeRemove?: (nodeId: string) => void;
  onNodeUpdate?: (nodeId: string, data: Partial<TNodeData>) => void;
  onEdgeAdd?: (edge: Edge<TEdgeData>) => void;
  onEdgeRemove?: (edgeId: string) => void;
  onEdgeUpdate?: (edgeId: string, data: Partial<TEdgeData>) => void;
  
  children: ReactNode;
}

/**
 * FlowProvider Component
 * 
 * Combines ReactFlowProvider (native) with FlowContext (design system).
 * Manages flow state and provides it via Context.
 * Supports both controlled and uncontrolled modes.
 */
export function FlowProvider<
  TNodeData extends FlowNodeData = FlowNodeData,
  TEdgeData extends FlowEdgeData = FlowEdgeData
>({
  nodes: controlledNodes,
  edges: controlledEdges,
  defaultNodes,
  defaultEdges,
  onNodesChange: controlledOnNodesChange,
  onEdgesChange: controlledOnEdgesChange,
  onConnect: controlledOnConnect,
  onBeforeDelete,
  theme: controlledTheme,
  validationRules: controlledValidationRules = [],
  connectionRules: controlledConnectionRules = [],
  layoutStrategy: controlledLayoutStrategy,
  layoutOptions: controlledLayoutOptions = {},
  onNodeAdd,
  onNodeRemove,
  onNodeUpdate,
  onEdgeAdd,
  onEdgeRemove,
  onEdgeUpdate,
  children,
}: FlowProviderProps<TNodeData, TEdgeData>) {
  // Detect controlled/uncontrolled mode
  const isNodesControlled = controlledOnNodesChange !== undefined || controlledNodes !== undefined;
  const isEdgesControlled = controlledOnEdgesChange !== undefined || controlledEdges !== undefined;
  const isThemeControlled = controlledTheme !== undefined;
  const isLayoutStrategyControlled = controlledLayoutStrategy !== undefined;
  
  // Internal state (for uncontrolled mode)
  // Use defaultNodes/defaultEdges if provided, otherwise use controlled or empty array
  const initialNodes = controlledNodes || defaultNodes || [];
  const initialEdges = controlledEdges || defaultEdges || [];
  
  const [internalNodes, setInternalNodes] = useState<Node<TNodeData>[]>(initialNodes);
  const [internalEdges, setInternalEdges] = useState<Edge<TEdgeData>[]>(initialEdges);
  const [internalTheme, setInternalTheme] = useState<'light' | 'dark'>(controlledTheme || 'light');
  const [internalLayoutStrategy, setInternalLayoutStrategy] = useState<LayoutStrategyName | null>(
    controlledLayoutStrategy || null
  );
  const [internalLayoutOptions, setInternalLayoutOptions] = useState<LayoutOptions>(
    controlledLayoutOptions
  );
  
  // Use controlled or internal state
  const nodes = isNodesControlled ? (controlledNodes || internalNodes) : internalNodes;
  const edges = isEdgesControlled ? (controlledEdges || internalEdges) : internalEdges;
  const theme = isThemeControlled ? controlledTheme! : internalTheme;
  const layoutStrategy = isLayoutStrategyControlled ? controlledLayoutStrategy || null : internalLayoutStrategy;
  const layoutOptions = controlledLayoutOptions || internalLayoutOptions;
  
  // React Flow instance
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  
  // Validation rules state
  const [validationRules, setValidationRules] = useState<ValidationRule[]>(controlledValidationRules);
  const [connectionRules, setConnectionRules] = useState<ConnectionRule[]>(controlledConnectionRules);
  
  // Update validation rules when controlled prop changes
  useMemo(() => {
    if (controlledValidationRules.length > 0) {
      setValidationRules(controlledValidationRules);
    }
  }, [controlledValidationRules]);
  
  useMemo(() => {
    if (controlledConnectionRules.length > 0) {
      setConnectionRules(controlledConnectionRules);
    }
  }, [controlledConnectionRules]);
  
  // Node change handler with onBeforeDelete support
  const handleNodesChange = useCallback(async (changes: NodeChange[]) => {
    // Check for delete operations and call onBeforeDelete if provided
    const deleteChanges = changes.filter(c => c.type === 'remove');
    if (deleteChanges.length > 0 && onBeforeDelete) {
      const nodesToDelete = deleteChanges
        .map(c => nodes.find(n => n.id === c.id))
        .filter(Boolean) as Node<TNodeData>[];
      
      const canDelete = await onBeforeDelete({ nodes: nodesToDelete });
      if (!canDelete) {
        // Prevent deletion
        return;
      }
    }
    
    if (isNodesControlled) {
      controlledOnNodesChange?.(changes);
    } else {
      // Apply changes using React Flow's utility
      setInternalNodes((prev) => {
        const updated = applyNodeChanges(changes, prev);
        
        // Trigger callbacks for specific change types
        changes.forEach((change) => {
          if (change.type === 'remove') {
            onNodeRemove?.(change.id);
          } else if (change.type === 'add' && change.item) {
            onNodeAdd?.(change.item as Node<TNodeData>);
          }
        });
        
        return updated;
      });
    }
  }, [isNodesControlled, controlledOnNodesChange, onNodeRemove, onNodeAdd, onBeforeDelete, nodes]);
  
  // Edge change handler with onBeforeDelete support
  const handleEdgesChange = useCallback(async (changes: EdgeChange[]) => {
    // Check for delete operations and call onBeforeDelete if provided
    const deleteChanges = changes.filter(c => c.type === 'remove');
    if (deleteChanges.length > 0 && onBeforeDelete) {
      const edgesToDelete = deleteChanges
        .map(c => edges.find(e => e.id === c.id))
        .filter(Boolean) as Edge<TEdgeData>[];
      
      const canDelete = await onBeforeDelete({ edges: edgesToDelete });
      if (!canDelete) {
        // Prevent deletion
        return;
      }
    }
    
    if (isEdgesControlled) {
      controlledOnEdgesChange?.(changes);
    } else {
      // Apply changes using React Flow's utility
      setInternalEdges((prev) => {
        const updated = applyEdgeChanges(changes, prev);
        
        // Trigger callbacks for specific change types
        changes.forEach((change) => {
          if (change.type === 'remove') {
            onEdgeRemove?.(change.id);
          } else if (change.type === 'add' && change.item) {
            onEdgeAdd?.(change.item as Edge<TEdgeData>);
          }
        });
        
        return updated;
      });
    }
  }, [isEdgesControlled, controlledOnEdgesChange, onEdgeRemove, onEdgeAdd, onBeforeDelete, edges]);
  
  // Connect handler
  const handleConnect = useCallback((connection: Connection) => {
    controlledOnConnect?.(connection);
  }, [controlledOnConnect]);
  
  // Validation rule management
  const addValidationRule = useCallback((rule: ValidationRule) => {
    setValidationRules((prev) => [...prev, rule]);
  }, []);
  
  const removeValidationRule = useCallback((id: string) => {
    setValidationRules((prev) => prev.filter((r) => r.id !== id));
  }, []);
  
  // Connection rule management
  const addConnectionRule = useCallback((rule: ConnectionRule) => {
    setConnectionRules((prev) => [...prev, rule]);
  }, []);
  
  const removeConnectionRule = useCallback((id: string) => {
    setConnectionRules((prev) => prev.filter((r) => r.id !== id));
  }, []);
  
  // Set nodes/edges (for programmatic updates)
  const setNodes = useCallback((
    updater: Node<TNodeData>[] | ((prev: Node<TNodeData>[]) => Node<TNodeData>[])
  ) => {
    if (isNodesControlled) {
      // In controlled mode, we can't directly set nodes
      // The parent component should handle this
      console.warn('Cannot set nodes in controlled mode. Use onNodesChange prop.');
    } else {
      setInternalNodes(updater);
    }
  }, [isNodesControlled]);
  
  const setEdges = useCallback((
    updater: Edge<TEdgeData>[] | ((prev: Edge<TEdgeData>[]) => Edge<TEdgeData>[])
  ) => {
    if (isEdgesControlled) {
      console.warn('Cannot set edges in controlled mode. Use onEdgesChange prop.');
    } else {
      setInternalEdges(updater);
    }
  }, [isEdgesControlled]);
  
  // Context value
  const contextValue = useMemo<FlowContextValue<TNodeData, TEdgeData>>(() => ({
    nodes,
    edges,
    reactFlowInstance,
    setReactFlowInstance,
    setNodes,
    setEdges,
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    onConnect: handleConnect,
    validationRules,
    connectionRules,
    addValidationRule,
    removeValidationRule,
    addConnectionRule,
    removeConnectionRule,
    layoutStrategy,
    setLayoutStrategy: isLayoutStrategyControlled
      ? () => console.warn('Cannot set layout strategy in controlled mode')
      : setInternalLayoutStrategy,
    layoutOptions,
    setLayoutOptions: setInternalLayoutOptions,
    theme,
    setTheme: isThemeControlled
      ? () => console.warn('Cannot set theme in controlled mode')
      : setInternalTheme,
    onNodeAdd,
    onNodeRemove,
    onNodeUpdate,
    onEdgeAdd,
    onEdgeRemove,
    onEdgeUpdate,
  }), [
    nodes,
    edges,
    reactFlowInstance,
    setNodes,
    setEdges,
    handleNodesChange,
    handleEdgesChange,
    handleConnect,
    validationRules,
    connectionRules,
    addValidationRule,
    removeValidationRule,
    addConnectionRule,
    removeConnectionRule,
    layoutStrategy,
    isLayoutStrategyControlled,
    layoutOptions,
    theme,
    isThemeControlled,
    onNodeAdd,
    onNodeRemove,
    onNodeUpdate,
    onEdgeAdd,
    onEdgeRemove,
    onEdgeUpdate,
  ]);
  
  return (
    <ReactFlowProvider>
      <FlowContext.Provider value={contextValue as FlowContextValue}>
        {children}
      </FlowContext.Provider>
    </ReactFlowProvider>
  );
}
