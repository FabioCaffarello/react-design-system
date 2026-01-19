/**
 * Flow Event Context
 * 
 * Context for managing custom events and event bus.
 */

'use client';

import { createContext, useContext, useCallback, useMemo, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Node, Edge } from '@xyflow/react';

/**
 * Flow Event Types
 */
export type FlowEventType =
  | 'node:add'
  | 'node:remove'
  | 'node:update'
  | 'node:select'
  | 'node:deselect'
  | 'edge:add'
  | 'edge:remove'
  | 'edge:update'
  | 'edge:select'
  | 'edge:deselect'
  | 'viewport:change'
  | 'selection:change'
  | 'validation:change'
  | 'custom';

/**
 * Flow Event
 */
export interface FlowEvent<T = unknown> {
  type: FlowEventType;
  payload: T;
  timestamp: number;
  source?: string;
}

/**
 * Event Handler
 */
export type FlowEventHandler<T = unknown> = (event: FlowEvent<T>) => void;

/**
 * Event Subscription
 */
export interface EventSubscription {
  unsubscribe: () => void;
}

/**
 * Flow Event Context Value
 */
export interface FlowEventContextValue {
  // Event bus operations
  subscribe: <T = unknown>(eventType: FlowEventType, handler: FlowEventHandler<T>) => EventSubscription;
  unsubscribe: (eventType: FlowEventType, handler: FlowEventHandler) => void;
  emit: <T = unknown>(eventType: FlowEventType, payload: T, source?: string) => void;
  
  // Event filtering
  once: <T = unknown>(eventType: FlowEventType, handler: FlowEventHandler<T>) => EventSubscription;
  filter: <T = unknown>(
    eventType: FlowEventType,
    predicate: (event: FlowEvent<T>) => boolean,
    handler: FlowEventHandler<T>
  ) => EventSubscription;
  
  // Event history
  getHistory: (eventType?: FlowEventType, limit?: number) => FlowEvent[];
  clearHistory: () => void;
}

const FlowEventContext = createContext<FlowEventContextValue | undefined>(undefined);

/**
 * Hook to access Flow Event context
 */
export function useFlowEventContext(): FlowEventContextValue {
  const context = useContext(FlowEventContext);
  if (context === undefined) {
    throw new Error('useFlowEventContext must be used within FlowEventProvider');
  }
  return context;
}

/**
 * Flow Event Provider Props
 */
export interface FlowEventProviderProps {
  children: ReactNode;
  maxHistorySize?: number;
  enableHistory?: boolean;
}

/**
 * Flow Event Provider
 * 
 * Provides event bus functionality for Flow components.
 */
export function FlowEventProvider({
  children,
  maxHistorySize = 100,
  enableHistory = true,
}: FlowEventProviderProps) {
  const handlersRef = useRef<Map<FlowEventType, Set<FlowEventHandler>>>(new Map());
  const historyRef = useRef<FlowEvent[]>([]);
  
  // Subscribe to events
  const subscribe = useCallback(<T = unknown>(
    eventType: FlowEventType,
    handler: FlowEventHandler<T>
  ): EventSubscription => {
    if (!handlersRef.current.has(eventType)) {
      handlersRef.current.set(eventType, new Set());
    }
    
    handlersRef.current.get(eventType)!.add(handler as FlowEventHandler);
    
    return {
      unsubscribe: () => {
        handlersRef.current.get(eventType)?.delete(handler as FlowEventHandler);
      },
    };
  }, []);
  
  // Unsubscribe from events
  const unsubscribe = useCallback((
    eventType: FlowEventType,
    handler: FlowEventHandler
  ): void => {
    handlersRef.current.get(eventType)?.delete(handler);
  }, []);
  
  // Emit event
  const emit = useCallback(<T = unknown>(
    eventType: FlowEventType,
    payload: T,
    source?: string
  ): void => {
    const event: FlowEvent<T> = {
      type: eventType,
      payload,
      timestamp: Date.now(),
      source,
    };
    
    // Add to history
    if (enableHistory) {
      historyRef.current.push(event);
      if (historyRef.current.length > maxHistorySize) {
        historyRef.current.shift();
      }
    }
    
    // Call handlers
    const handlers = handlersRef.current.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for "${eventType}":`, error);
        }
      });
    }
    
    // Also call handlers for 'custom' type if event is custom
    if (eventType !== 'custom') {
      const customHandlers = handlersRef.current.get('custom');
      if (customHandlers) {
        customHandlers.forEach((handler) => {
          try {
            handler(event);
          } catch (error) {
            console.error('Error in custom event handler:', error);
          }
        });
      }
    }
  }, [enableHistory, maxHistorySize]);
  
  // Subscribe once
  const once = useCallback(<T = unknown>(
    eventType: FlowEventType,
    handler: FlowEventHandler<T>
  ): EventSubscription => {
    const wrappedHandler: FlowEventHandler<T> = (event) => {
      handler(event);
      unsubscribe(eventType, wrappedHandler);
    };
    
    return subscribe(eventType, wrappedHandler);
  }, [subscribe, unsubscribe]);
  
  // Filter events
  const filter = useCallback(<T = unknown>(
    eventType: FlowEventType,
    predicate: (event: FlowEvent<T>) => boolean,
    handler: FlowEventHandler<T>
  ): EventSubscription => {
    const wrappedHandler: FlowEventHandler<T> = (event) => {
      if (predicate(event)) {
        handler(event);
      }
    };
    
    return subscribe(eventType, wrappedHandler);
  }, [subscribe]);
  
  // Get event history
  const getHistory = useCallback((
    eventType?: FlowEventType,
    limit?: number
  ): FlowEvent[] => {
    let history = historyRef.current;
    
    if (eventType) {
      history = history.filter((event) => event.type === eventType);
    }
    
    if (limit) {
      history = history.slice(-limit);
    }
    
    return history;
  }, []);
  
  // Clear history
  const clearHistory = useCallback((): void => {
    historyRef.current = [];
  }, []);
  
  const contextValue = useMemo<FlowEventContextValue>(() => ({
    subscribe,
    unsubscribe,
    emit,
    once,
    filter,
    getHistory,
    clearHistory,
  }), [subscribe, unsubscribe, emit, once, filter, getHistory, clearHistory]);
  
  return (
    <FlowEventContext.Provider value={contextValue}>
      {children}
    </FlowEventContext.Provider>
  );
}
