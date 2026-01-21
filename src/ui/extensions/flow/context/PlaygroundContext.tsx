'use client';

/**
 * Playground Context
 * 
 * Context for managing global playground state across tabs and steps.
 */

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';
import type { ReactFlowConfig, BackgroundConfig, LayoutConfig } from '../types/playgroundTypes';
import { treeTemplate } from '../utils/playgroundTemplates';
import { generateNodeId } from '../utils/playgroundHelpers';
import { usePlaygroundHistory } from '../hooks/usePlaygroundHistory';
import { 
  loadPersistedState 
} from '../utils/PlaygroundStateManager';
import { useAutoSave } from '../utils/PlaygroundPersistence';

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
  activeTab?: import('../components/PlaygroundTabs').PlaygroundTabId;
}

export interface PlaygroundContextValue extends PlaygroundState {
  setNodes: (nodes: Node<FlowNodeData>[]) => void;
  setEdges: (edges: Edge<FlowEdgeData>[]) => void;
  setReactFlowConfig: (config: ReactFlowConfig) => void;
  setBackgroundConfig: (config: BackgroundConfig) => void;
  setLayoutConfig: (config: LayoutConfig) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setHasPendingChanges: (hasChanges: boolean) => void;
  setActiveTab?: (tab: import('../components/PlaygroundTabs').PlaygroundTabId) => void;
  applyChanges: () => void;
  discardChanges: () => void;
  resetToDefaults: () => void;
  // History
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Array<{ 
    type: 'node' | 'edge'; 
    id: string; 
    label?: string;
    metadata?: {
      variant?: string;
      nodeType?: string;
      edgeType?: string;
      source?: string;
      target?: string;
    };
  }>;
}

const PlaygroundContext = createContext<PlaygroundContextValue | undefined>(undefined);

export interface PlaygroundProviderProps {
  children: React.ReactNode;
  initialState?: Partial<PlaygroundState>;
}

// Prepare default nodes and edges from tree template
const getDefaultNodesAndEdges = (): { nodes: Node<FlowNodeData>[]; edges: Edge<FlowEdgeData>[] } => {
  const defaultNodes: Node<FlowNodeData>[] = treeTemplate.nodes.map((node) => ({
    ...node,
    id: generateNodeId(),
    // Ensure dimensions are set for stable positioning
    width: node.width || 200,
    height: node.height || 60,
  }));

  const nodeIdMap = new Map(treeTemplate.nodes.map((n, i) => [n.id, defaultNodes[i].id]));

  const defaultEdges: Edge<FlowEdgeData>[] = treeTemplate.edges.map((edge) => ({
    ...edge,
    id: `edge-default-${Math.random().toString(36).substring(2, 11)}`,
    source: nodeIdMap.get(edge.source) || edge.source,
    target: nodeIdMap.get(edge.target) || edge.target,
    // Preserve handle IDs for proper connection
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
  }));

  return { nodes: defaultNodes, edges: defaultEdges };
};

const { nodes: defaultNodes, edges: defaultEdges } = getDefaultNodesAndEdges();

const defaultState: PlaygroundState = {
  nodes: defaultNodes,
  edges: defaultEdges,
  reactFlowConfig: {
    panOnDrag: true,
    zoomOnScroll: true,
    zoomOnPinch: true,
    zoomOnDoubleClick: false,
    selectNodesOnDrag: false,
  },
  backgroundConfig: {
    show: true,
    variant: 'dots',
    size: 2,
  },
  layoutConfig: {
    strategy: null,
    options: {},
  },
  theme: 'light',
  selectedNodeId: null,
  selectedEdgeId: null,
  hasPendingChanges: false,
  activeTab: 'nodes-edges',
};

export function PlaygroundProvider({ children, initialState }: PlaygroundProviderProps) {
  // Load persisted state if available
  let persistedState;
  try {
    persistedState = loadPersistedState();
  } catch (error) {
    console.warn('Failed to load persisted state:', error);
    persistedState = null;
  }
  
  const mergedInitialState = {
    ...defaultState,
    ...(persistedState || {}),
    ...(initialState || {}),
  };
  
  // Ensure nodes and edges are arrays
  if (!Array.isArray(mergedInitialState.nodes)) {
    mergedInitialState.nodes = defaultState.nodes;
  }
  if (!Array.isArray(mergedInitialState.edges)) {
    mergedInitialState.edges = defaultState.edges;
  }

  const [state, setState] = useState<PlaygroundState>(mergedInitialState);
  const [savedState, setSavedState] = useState<PlaygroundState>(state);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State manager with middleware (for future use - keeping current implementation for now)
  // const stateManager = usePlaygroundStateManager(state);
  
  // TODO: Fully integrate state manager in future refactoring
  // For now, keeping existing state management for compatibility
  
  // History management
  const history = usePlaygroundHistory();
  const lastUpdateRef = useRef<number>(0);
  
  // Track changes for history
  useEffect(() => {
    const now = Date.now();
    // Debounce history updates
    if (now - lastUpdateRef.current > 500) {
      history.pushState(state.nodes, state.edges);
      lastUpdateRef.current = now;
    }
  }, [state.nodes, state.edges, history]);
  
  // Auto-save functionality
  useAutoSave({
    nodes: state.nodes,
    edges: state.edges,
    reactFlowConfig: state.reactFlowConfig,
    backgroundConfig: state.backgroundConfig,
    layoutConfig: state.layoutConfig,
    theme: state.theme,
    activeTab: state.activeTab,
  }, {
    autoSaveEnabled: true,
    autoSaveInterval: 2000,
    maxVersions: 10,
  });
  
  // Enhanced search functionality with advanced filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: Array<{ 
      type: 'node' | 'edge'; 
      id: string; 
      label?: string;
      metadata?: {
        variant?: string;
        nodeType?: string;
        edgeType?: string;
        source?: string;
        target?: string;
      };
    }> = [];
    
    // Search nodes with enhanced metadata
    state.nodes.forEach((node) => {
      const label = node.data?.label?.toLowerCase() || '';
      const id = node.id.toLowerCase();
      const description = (node.data?.description || '').toLowerCase();
      const variant = (node.data?.variant || '').toLowerCase();
      const nodeType = (node.type || '').toLowerCase();
      
      if (label.includes(query) || id.includes(query) || description.includes(query) || 
          variant.includes(query) || nodeType.includes(query)) {
        results.push({
          type: 'node',
          id: node.id,
          label: node.data?.label || node.id,
          metadata: {
            variant: node.data?.variant,
            nodeType: node.type || 'default',
          },
        });
      }
    });
    
    // Search edges with enhanced metadata
    state.edges.forEach((edge) => {
      const label = edge.data?.label?.toLowerCase() || '';
      const id = edge.id.toLowerCase();
      const edgeType = (edge.type || 'default').toLowerCase();
      const sourceLabel = state.nodes.find(n => n.id === edge.source)?.data?.label?.toLowerCase() || '';
      const targetLabel = state.nodes.find(n => n.id === edge.target)?.data?.label?.toLowerCase() || '';
      
      if (label.includes(query) || id.includes(query) || edgeType.includes(query) ||
          sourceLabel.includes(query) || targetLabel.includes(query)) {
        results.push({
          type: 'edge',
          id: edge.id,
          label: edge.data?.label || edge.id,
          metadata: {
            edgeType: edge.type || 'default',
            source: edge.source,
            target: edge.target,
          },
        });
      }
    });
    
    // Sort results: exact matches first, then by relevance
    return results.sort((a, b) => {
      const aLabel = (a.label || '').toLowerCase();
      const bLabel = (b.label || '').toLowerCase();
      const aExact = aLabel === query || a.id.toLowerCase() === query;
      const bExact = bLabel === query || b.id.toLowerCase() === query;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      if (aLabel.startsWith(query) && !bLabel.startsWith(query)) return -1;
      if (!aLabel.startsWith(query) && bLabel.startsWith(query)) return 1;
      return aLabel.localeCompare(bLabel);
    });
  }, [searchQuery, state.nodes, state.edges]);
  
  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const historyState = history.undo();
    if (historyState) {
      setState((prev) => ({
        ...prev,
        nodes: historyState.nodes,
        edges: historyState.edges,
        hasPendingChanges: true,
      }));
    }
  }, [history]);
  
  const handleRedo = useCallback(() => {
    const historyState = history.redo();
    if (historyState) {
      setState((prev) => ({
        ...prev,
        nodes: historyState.nodes,
        edges: historyState.edges,
        hasPendingChanges: true,
      }));
    }
  }, [history]);

  const setNodes = useCallback((nodes: Node<FlowNodeData>[]) => {
    setState((prev) => ({ ...prev, nodes, hasPendingChanges: true }));
  }, []);

  const setEdges = useCallback((edges: Edge<FlowEdgeData>[]) => {
    setState((prev) => ({ ...prev, edges, hasPendingChanges: true }));
  }, []);

  const setReactFlowConfig = useCallback((config: ReactFlowConfig) => {
    setState((prev) => ({ ...prev, reactFlowConfig: config, hasPendingChanges: true }));
  }, []);

  const setBackgroundConfig = useCallback((config: BackgroundConfig) => {
    setState((prev) => ({ ...prev, backgroundConfig: config, hasPendingChanges: true }));
  }, []);

  const setLayoutConfig = useCallback((config: LayoutConfig) => {
    setState((prev) => ({ ...prev, layoutConfig: config, hasPendingChanges: true }));
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  const setSelectedNodeId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedNodeId: id, selectedEdgeId: null }));
  }, []);

  const setSelectedEdgeId = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedEdgeId: id, selectedNodeId: null }));
  }, []);

  const setHasPendingChanges = useCallback((hasChanges: boolean) => {
    setState((prev) => ({ ...prev, hasPendingChanges: hasChanges }));
  }, []);

  const setActiveTab = useCallback((tab: import('../components/PlaygroundTabs').PlaygroundTabId) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const applyChanges = useCallback(() => {
    setSavedState(state);
    setState((prev) => ({ ...prev, hasPendingChanges: false }));
  }, [state]);

  const discardChanges = useCallback(() => {
    setState(savedState);
    setState((prev) => ({ ...prev, hasPendingChanges: false }));
  }, [savedState]);

  const resetToDefaults = useCallback(() => {
    const resetState = { ...defaultState, ...initialState };
    setState(resetState);
    setSavedState(resetState);
    setState((prev) => ({ ...prev, hasPendingChanges: false }));
  }, [initialState]);

  const value = useMemo<PlaygroundContextValue>(
    () => ({
      ...state,
      setNodes,
      setEdges,
      setReactFlowConfig,
      setBackgroundConfig,
      setLayoutConfig,
      setTheme,
      setSelectedNodeId,
      setSelectedEdgeId,
      setHasPendingChanges,
      setActiveTab,
      applyChanges,
      discardChanges,
      resetToDefaults,
      // History
      canUndo: history.canUndo,
      canRedo: history.canRedo,
      undo: handleUndo,
      redo: handleRedo,
      // Search
      searchQuery,
      setSearchQuery,
      searchResults,
    }),
    [
      state,
      setNodes,
      setEdges,
      setReactFlowConfig,
      setBackgroundConfig,
      setLayoutConfig,
      setTheme,
      setSelectedNodeId,
      setSelectedEdgeId,
      setHasPendingChanges,
      setActiveTab,
      applyChanges,
      discardChanges,
      resetToDefaults,
      history.canUndo,
      history.canRedo,
      handleUndo,
      handleRedo,
      searchQuery,
      searchResults,
    ]
  );

  return <PlaygroundContext.Provider value={value}>{children}</PlaygroundContext.Provider>;
}

export function usePlaygroundContext(): PlaygroundContextValue {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error('usePlaygroundContext must be used within PlaygroundProvider');
  }
  return context;
}
