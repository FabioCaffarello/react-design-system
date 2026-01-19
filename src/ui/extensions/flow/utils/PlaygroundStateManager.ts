/**
 * Playground State Manager
 * 
 * Separates state management logic from UI components.
 * Provides layered state management (UI state, Flow state, Config state).
 */

import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';
import type { ReactFlowConfig, BackgroundConfig, LayoutConfig } from '../types/playgroundTypes';
import type { PlaygroundTabId } from '../components/PlaygroundTabs';

export interface PlaygroundState {
  nodes: Node<FlowNodeData>[];
  edges: Edge<FlowEdgeData>[];
  reactFlowConfig: ReactFlowConfig;
  backgroundConfig: BackgroundConfig;
  layoutConfig: LayoutConfig;
  theme: 'light' | 'dark';
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  hasPendingChanges: boolean;
  activeTab?: PlaygroundTabId;
}

export interface StateUpdate {
  type: 'nodes' | 'edges' | 'config' | 'background' | 'layout' | 'theme' | 'selection' | 'pending' | 'tab' | 'reset';
  payload: unknown;
}

export type StateMiddleware = (state: PlaygroundState, update: StateUpdate) => PlaygroundState | null;

/**
 * Playground State Manager
 * 
 * Manages playground state with middleware support for logging, persistence, etc.
 */
export class PlaygroundStateManager {
  private state: PlaygroundState;
  private listeners: Set<(state: PlaygroundState) => void> = new Set();
  private middlewares: StateMiddleware[] = [];
  private history: PlaygroundState[] = [];
  private historyIndex: number = -1;
  private maxHistorySize: number = 50;

  constructor(initialState: PlaygroundState) {
    this.state = initialState;
    this.history.push({ ...initialState });
    this.historyIndex = 0;
  }

  /**
   * Get current state
   */
  getState(): PlaygroundState {
    return { ...this.state };
  }

  /**
   * Update state
   */
  updateState(update: StateUpdate): void {
    // Apply middlewares
    let newState: PlaygroundState | null = null;
    for (const middleware of this.middlewares) {
      const result = middleware(this.state, update);
      if (result !== null) {
        newState = result;
        break;
      }
    }

    // If no middleware handled it, apply default update
    if (newState === null) {
      newState = this.applyUpdate(this.state, update);
    }

    // Update state
    this.state = newState;

    // Add to history (with limit)
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push({ ...newState });
    this.historyIndex++;
    
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.historyIndex--;
    }

    // Notify listeners
    this.notifyListeners();
  }

  /**
   * Apply state update
   */
  private applyUpdate(state: PlaygroundState, update: StateUpdate): PlaygroundState {
    switch (update.type) {
      case 'nodes':
        return { ...state, nodes: update.payload, hasPendingChanges: true };
      case 'edges':
        return { ...state, edges: update.payload, hasPendingChanges: true };
      case 'config':
        return { ...state, reactFlowConfig: update.payload, hasPendingChanges: true };
      case 'background':
        return { ...state, backgroundConfig: update.payload, hasPendingChanges: true };
      case 'layout':
        return { ...state, layoutConfig: update.payload, hasPendingChanges: true };
      case 'theme':
        return { ...state, theme: update.payload };
      case 'selection':
        return {
          ...state,
          selectedNodeId: update.payload.nodeId ?? state.selectedNodeId,
          selectedEdgeId: update.payload.edgeId ?? state.selectedEdgeId,
        };
      case 'pending':
        return { ...state, hasPendingChanges: update.payload };
      case 'tab':
        return { ...state, activeTab: update.payload };
      case 'reset':
        return update.payload;
      default:
        return state;
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: PlaygroundState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }

  /**
   * Add middleware
   */
  addMiddleware(middleware: StateMiddleware): void {
    this.middlewares.push(middleware);
  }

  /**
   * Remove middleware
   */
  removeMiddleware(_strategy: StateMiddleware): void {
    const index = this.middlewares.indexOf(_strategy);
    if (index > -1) {
      this.middlewares.splice(index, 1);
    }
  }

  /**
   * Undo
   */
  undo(): PlaygroundState | null {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.state = { ...this.history[this.historyIndex] };
      this.notifyListeners();
      return this.getState();
    }
    return null;
  }

  /**
   * Redo
   */
  redo(): PlaygroundState | null {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.state = { ...this.history[this.historyIndex] };
      this.notifyListeners();
      return this.getState();
    }
    return null;
  }

  /**
   * Can undo
   */
  canUndo(): boolean {
    return this.historyIndex > 0;
  }

  /**
   * Can redo
   */
  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [this.getState()];
    this.historyIndex = 0;
  }
}

/**
 * Hook for using state manager
 */
export function usePlaygroundStateManager(initialState: PlaygroundState) {
  const managerRef = useRef<PlaygroundStateManager | null>(null);
  
  if (!managerRef.current) {
    managerRef.current = new PlaygroundStateManager(initialState);
  }

  return managerRef.current;
}

/**
 * Logging middleware
 */
export function createLoggingMiddleware(): StateMiddleware {
  return (_state, update) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[PlaygroundState] Update:', update.type, update.payload);
    }
    return null; // Let default handler process
  };
}

/**
 * Persistence middleware
 */
export function createPersistenceMiddleware(storageKey: string = 'playground-state'): StateMiddleware {
  return (state, _updates) => {
    // Only persist certain updates
    if (['nodes', 'edges', 'config', 'background', 'layout', 'theme'].includes(_updates.type)) {
      try {
        const stateToSave = {
          nodes: state.nodes,
          edges: state.edges,
          reactFlowConfig: state.reactFlowConfig,
          backgroundConfig: state.backgroundConfig,
          layoutConfig: state.layoutConfig,
          theme: state.theme,
        };
        localStorage.setItem(storageKey, JSON.stringify(stateToSave));
      } catch (error) {
        console.warn('Failed to persist playground state:', error);
      }
    }
    return null; // Let default handler process
  };
}

/**
 * Load persisted state
 */
export function loadPersistedState(storageKey: string = 'playground-state'): Partial<PlaygroundState> | null {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load persisted playground state:', error);
  }
  return null;
}
