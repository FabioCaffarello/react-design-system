/**
 * useFlowEvents Hook
 * 
 * Hook for subscribing to and emitting Flow events.
 */

import { useFlowEventContext } from '../context/FlowEventContext';
import type { FlowEventType, FlowEvent, FlowEventHandler } from '../context/FlowEventContext';

/**
 * Flow Events Hook Return
 */
export interface UseFlowEventsReturn {
  // Event bus operations
  subscribe: <T = any>(eventType: FlowEventType, handler: FlowEventHandler<T>) => { unsubscribe: () => void };
  unsubscribe: (eventType: FlowEventType, handler: FlowEventHandler) => void;
  emit: <T = any>(eventType: FlowEventType, payload: T, source?: string) => void;
  
  // Event filtering
  once: <T = any>(eventType: FlowEventType, handler: FlowEventHandler<T>) => { unsubscribe: () => void };
  filter: <T = any>(
    eventType: FlowEventType,
    predicate: (event: FlowEvent<T>) => boolean,
    handler: FlowEventHandler<T>
  ) => { unsubscribe: () => void };
  
  // Event history
  getHistory: (eventType?: FlowEventType, limit?: number) => FlowEvent[];
  clearHistory: () => void;
  
  // Convenience methods
  onNodeAdd: (handler: FlowEventHandler<Node>) => { unsubscribe: () => void };
  onNodeRemove: (handler: FlowEventHandler<string>) => { unsubscribe: () => void };
  onNodeUpdate: (handler: FlowEventHandler<{ nodeId: string; data: any }>) => { unsubscribe: () => void };
  onEdgeAdd: (handler: FlowEventHandler<Edge>) => { unsubscribe: () => void };
  onEdgeRemove: (handler: FlowEventHandler<string>) => { unsubscribe: () => void };
  onSelectionChange: (handler: FlowEventHandler<{ nodes: Node[]; edges: Edge[] }>) => { unsubscribe: () => void };
}

/**
 * Hook for subscribing to and emitting Flow events
 */
export function useFlowEvents(): UseFlowEventsReturn {
  const context = useFlowEventContext();
  
  // Convenience methods for common events
  const onNodeAdd = (handler: FlowEventHandler<any>) => {
    return context.subscribe('node:add', handler);
  };
  
  const onNodeRemove = (handler: FlowEventHandler<any>) => {
    return context.subscribe('node:remove', handler);
  };
  
  const onNodeUpdate = (handler: FlowEventHandler<any>) => {
    return context.subscribe('node:update', handler);
  };
  
  const onEdgeAdd = (handler: FlowEventHandler<any>) => {
    return context.subscribe('edge:add', handler);
  };
  
  const onEdgeRemove = (handler: FlowEventHandler<any>) => {
    return context.subscribe('edge:remove', handler);
  };
  
  const onSelectionChange = (handler: FlowEventHandler<any>) => {
    return context.subscribe('selection:change', handler);
  };
  
  return {
    ...context,
    onNodeAdd,
    onNodeRemove,
    onNodeUpdate,
    onEdgeAdd,
    onEdgeRemove,
    onSelectionChange,
  };
}
