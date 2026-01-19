'use client';

/**
 * Playground Canvas Component
 * 
 * Wrapper for the main React Flow canvas.
 * Manages flow state and integrates with PlaygroundContext.
 */

import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useNodesState, useEdgesState, addEdge, useReactFlow, type Connection } from '@xyflow/react';
import { FlowProvider } from '../organisms/FlowProvider';
import { FlowCanvas } from '../organisms/FlowCanvas';
import { LayoutApplier } from './LayoutApplier';
import { PlaygroundCanvasFooter } from './PlaygroundCanvasFooter';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';
import { generateNodeId } from '../utils/playgroundHelpers';

/**
 * Inner component that uses React Flow hooks (must be inside ReactFlowProvider)
 */
function PlaygroundCanvasInner() {
  const {
    nodes: contextNodes,
    edges: contextEdges,
    reactFlowConfig,
    backgroundConfig,
    layoutConfig,
    theme: _theme,
    selectedNodeId,
    selectedEdgeId,
    setNodes: setContextNodes,
    setEdges: setContextEdges,
    setSelectedNodeId,
    setSelectedEdgeId,
  } = usePlaygroundContext();

  // Ensure we have valid arrays
  const safeContextNodes = useMemo(() => Array.isArray(contextNodes) ? contextNodes : [], [contextNodes]);
  const safeContextEdges = useMemo(() => Array.isArray(contextEdges) ? contextEdges : [], [contextEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(safeContextNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(safeContextEdges);
  const [shouldApplyLayout, setShouldApplyLayout] = useState(false);
  const reactFlowInstance = useReactFlow();
  
  // Ensure configs have default values
  const safeReactFlowConfig = useMemo(() => ({
    panOnDrag: true,
    zoomOnScroll: true,
    zoomOnPinch: true,
    zoomOnDoubleClick: false,
    selectNodesOnDrag: false,
    ...reactFlowConfig,
  }), [reactFlowConfig]);
  
  const safeBackgroundConfig = useMemo(() => ({
    show: true,
    variant: 'dots' as const,
    size: 2,
    ...backgroundConfig,
  }), [backgroundConfig]);
  
  const safeLayoutConfig = useMemo(() => ({
    strategy: null,
    options: {},
    ...layoutConfig,
  }), [layoutConfig]);
  
  // Enhanced keyboard navigation - use ref to avoid dependency issues
  const canvasRef = useRef<HTMLDivElement | null>(null);
  
  // Handle keyboard navigation manually to avoid hook dependency issues
  // Use refs to avoid re-creating the handler on every render
  const selectedNodeIdRef = useRef(selectedNodeId);
  const selectedEdgeIdRef = useRef(selectedEdgeId);
  
  useEffect(() => {
    selectedNodeIdRef.current = selectedNodeId;
    selectedEdgeIdRef.current = selectedEdgeId;
  }, [selectedNodeId, selectedEdgeId]);
  
  // Memoize handlers to avoid recreating on every render
  const handleDeleteNode = useCallback(() => {
    setNodes((nds) => {
      const filtered = nds.filter(n => n.id !== selectedNodeIdRef.current);
      setContextNodes(filtered);
      return filtered;
    });
    setSelectedNodeId(null);
  }, [setNodes, setContextNodes, setSelectedNodeId]);
  
  const handleDeleteEdge = useCallback(() => {
    setEdges((eds) => {
      const filtered = eds.filter(e => e.id !== selectedEdgeIdRef.current);
      setContextEdges(filtered);
      return filtered;
    });
    setSelectedEdgeId(null);
  }, [setEdges, setContextEdges, setSelectedEdgeId]);
  
  const handleEscape = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [setSelectedNodeId, setSelectedEdgeId]);
  
  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Only handle if canvas is focused
      if (!canvasRef.current?.contains(target)) {
        return;
      }

      switch (event.key) {
        case 'Delete':
        case 'Backspace':
          if (event.ctrlKey || event.metaKey) return;
          
          if (selectedNodeIdRef.current) {
            event.preventDefault();
            handleDeleteNode();
          } else if (selectedEdgeIdRef.current) {
            event.preventDefault();
            handleDeleteEdge();
          }
          break;

        case 'Escape':
          event.preventDefault();
          handleEscape();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleDeleteNode, handleDeleteEdge, handleEscape]);
  
  // Expose focusNode function to context for search integration
  const focusNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && reactFlowInstance) {
      setSelectedNodeId(nodeId);
      // Fit view to node
      setTimeout(() => {
        reactFlowInstance.fitView({
          nodes: [node],
          padding: 0.2,
          duration: 400,
        });
      }, 100);
    }
  }, [nodes, reactFlowInstance, setSelectedNodeId]);
  
  const focusEdge = useCallback((edgeId: string) => {
    const edge = edges.find(e => e.id === edgeId);
    if (edge && reactFlowInstance) {
      setSelectedEdgeId(edgeId);
      // Fit view to edge (show both source and target nodes)
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      if (sourceNode && targetNode) {
        setTimeout(() => {
          reactFlowInstance.fitView({
            nodes: [sourceNode, targetNode],
            padding: 0.2,
            duration: 400,
          });
        }, 100);
      }
    }
  }, [edges, nodes, reactFlowInstance, setSelectedEdgeId]);
  
  // Expose focus functions via effect to context (if needed)
  useEffect(() => {
    // Store focus functions in a way that can be accessed by search
    (window as unknown).__playgroundFocusNode = focusNode;
    (window as unknown).__playgroundFocusEdge = focusEdge;
    return () => {
      delete (window as unknown).__playgroundFocusNode;
      delete (window as unknown).__playgroundFocusEdge;
    };
  }, [focusNode, focusEdge]);
  
  // Refs to track if we're updating from context (to avoid loops)
  const isUpdatingFromContextRef = useRef(false);
  const lastContextNodesRef = useRef(contextNodes);
  const lastContextEdgesRef = useRef(contextEdges);

  // Sync local state with context when context changes externally
  // Use a timeout ref to track the reset timeout
  const resetFlagTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Memoize comparison functions to avoid recreating on every render
  const compareNodes = useCallback((nodes1: Node[], nodes2: Node[]): boolean => {
    if (nodes1.length !== nodes2.length) return true;
    return nodes1.some((node, idx) => {
      const other = nodes2[idx];
      return !other || 
        node.id !== other.id ||
        node.position.x !== other.position.x ||
        node.position.y !== other.position.y;
    });
  }, []);
  
  const compareEdges = useCallback((edges1: typeof edges, edges2: typeof edges): boolean => {
    if (edges1.length !== edges2.length) return true;
    return edges1.some((edge, idx) => {
      const other = edges2[idx];
      return !other ||
        edge.id !== other.id ||
        edge.source !== other.source ||
        edge.target !== other.target;
    });
  }, []);
  
  useEffect(() => {
    // Compare by length and IDs to avoid unnecessary updates
    const nodesChanged = compareNodes(safeContextNodes, lastContextNodesRef.current);
    const edgesChanged = compareEdges(safeContextEdges, lastContextEdgesRef.current);
    
    if (nodesChanged || edgesChanged) {
      isUpdatingFromContextRef.current = true;
      setNodes(safeContextNodes);
      setEdges(safeContextEdges);
      lastContextNodesRef.current = safeContextNodes;
      lastContextEdgesRef.current = safeContextEdges;
      
      // Clear existing timeout
      if (resetFlagTimeoutRef.current) {
        clearTimeout(resetFlagTimeoutRef.current);
      }
      
      // Reset flag after React Flow processes the update
      resetFlagTimeoutRef.current = setTimeout(() => {
        isUpdatingFromContextRef.current = false;
        resetFlagTimeoutRef.current = null;
      }, 100);
    }
    
    // Cleanup function
    return () => {
      if (resetFlagTimeoutRef.current) {
        clearTimeout(resetFlagTimeoutRef.current);
        resetFlagTimeoutRef.current = null;
      }
    };
  }, [safeContextNodes, safeContextEdges, setNodes, setEdges, compareNodes, compareEdges]);

  // Sync local changes back to context (debounced and only if not updating from context)
  // Use refs to track debounce timeouts
  const nodesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const edgesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    // Compare nodes using memoized function
    const nodesChanged = compareNodes(nodes, lastContextNodesRef.current);
    
    if (!isUpdatingFromContextRef.current && nodesChanged) {
      // Clear existing timeout
      if (nodesTimeoutRef.current) {
        clearTimeout(nodesTimeoutRef.current);
        nodesTimeoutRef.current = null;
      }
      // Set new debounced timeout
      nodesTimeoutRef.current = setTimeout(() => {
        if (!isUpdatingFromContextRef.current) {
          setContextNodes(nodes);
          lastContextNodesRef.current = nodes;
        }
        nodesTimeoutRef.current = null;
      }, 300);
    }
    
    // Cleanup function
    return () => {
      if (nodesTimeoutRef.current) {
        clearTimeout(nodesTimeoutRef.current);
        nodesTimeoutRef.current = null;
      }
    };
  }, [nodes, setContextNodes, compareNodes]);

  useEffect(() => {
    // Compare edges using memoized function
    const edgesChanged = compareEdges(edges, lastContextEdgesRef.current);
    
    if (!isUpdatingFromContextRef.current && edgesChanged) {
      // Clear existing timeout
      if (edgesTimeoutRef.current) {
        clearTimeout(edgesTimeoutRef.current);
        edgesTimeoutRef.current = null;
      }
      // Set new debounced timeout
      edgesTimeoutRef.current = setTimeout(() => {
        if (!isUpdatingFromContextRef.current) {
          setContextEdges(edges);
          lastContextEdgesRef.current = edges;
        }
        edgesTimeoutRef.current = null;
      }, 300);
    }
    
    // Cleanup function
    return () => {
      if (edgesTimeoutRef.current) {
        clearTimeout(edgesTimeoutRef.current);
        edgesTimeoutRef.current = null;
      }
    };
  }, [edges, setContextEdges, compareEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, data: {} }, eds || []));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<FlowNodeData>) => {
      setSelectedNodeId(node.id);
      // Announce selection for screen readers
      if (canvasRef.current) {
        const announcement = `Node ${node.data?.label || node.id} selected`;
        canvasRef.current.setAttribute('aria-label', announcement);
      }
    },
    [setSelectedNodeId]
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge<FlowEdgeData>) => {
      setSelectedEdgeId(edge.id);
      // Announce selection for screen readers
      if (canvasRef.current) {
        const announcement = `Edge from ${edge.source} to ${edge.target} selected`;
        canvasRef.current.setAttribute('aria-label', announcement);
      }
    },
    [setSelectedEdgeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [setSelectedNodeId, setSelectedEdgeId]);

  // Drag & Drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    
    if (!type || !reactFlowInstance) {
      return;
    }

    // Get position relative to flow
    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Create new node
    const newNode: Node<FlowNodeData> = {
      id: generateNodeId(),
      type,
      position,
      data: {
        label: `${type} node`,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  // Memoize nodes and edges to prevent unnecessary re-renders
  const safeNodes = useMemo(() => nodes || [], [nodes]);
  const safeEdges = useMemo(() => edges || [], [edges]);

  // Note: fitView is handled by FlowCanvas.Root's onInit handler if fitView prop is provided
  // No need to manually call fitView here as it could cause conflicts

  return (
    <div ref={canvasRef} style={{ width: '100%', height: '100%' }}>
      <FlowCanvas.Root
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{ width: '100%', height: '100%' }}
        onlyRenderVisibleElements={safeReactFlowConfig.onlyRenderVisibleElements !== false}
        aria-label={`Flow diagram canvas with ${safeNodes.length} nodes and ${safeEdges.length} edges. Use Delete or Backspace to remove selected items, Escape to deselect, and arrow keys to navigate.`}
        aria-describedby="canvas-instructions"
        role="application"
        tabIndex={0}
        {...safeReactFlowConfig}
      >
        {/* Hidden instructions for screen readers */}
        <div id="canvas-instructions" className="sr-only">
          Interactive flow diagram. Press Delete or Backspace to remove selected items. 
          Press Escape to deselect. Use mouse or touch to drag nodes and create connections.
        </div>
        {safeLayoutConfig.strategy && (
          <LayoutApplier
            strategy={safeLayoutConfig.strategy}
            nodes={safeNodes}
            edges={safeEdges}
            options={safeLayoutConfig.options}
            shouldApply={shouldApplyLayout}
            onLayoutApplied={() => setShouldApplyLayout(false)}
          />
        )}
        {safeBackgroundConfig && safeBackgroundConfig.show === true ? (
          <FlowCanvas.Background
            key={`bg-${safeBackgroundConfig.variant}-${safeBackgroundConfig.size}-${safeBackgroundConfig.show}`}
            variant={safeBackgroundConfig.variant}
            size={safeBackgroundConfig.size}
            bgColor={safeBackgroundConfig.bgColor}
            patternColor={safeBackgroundConfig.patternColor}
          />
        ) : null}
        <FlowCanvas.Controls position="bottom-left" />
        <FlowCanvas.Minimap position="bottom-right" />
        {/* Canvas Footer - inside FlowCanvas.Root so it has access to FlowContext */}
        <PlaygroundCanvasFooter />
      </FlowCanvas.Root>
    </div>
  );
}

/**
 * Main PlaygroundCanvas component
 * Wraps the inner component with FlowProvider
 */
export function PlaygroundCanvas() {
  // All hooks must be called before any try/catch or early returns
  let contextNodes, contextEdges, theme;
  try {
    const context = usePlaygroundContext();
    contextNodes = context.nodes;
    contextEdges = context.edges;
    theme = context.theme || 'light';
  } catch (error) {
    console.error('PlaygroundCanvas error accessing context:', error);
    contextNodes = [];
    contextEdges = [];
    theme = 'light';
  }

  const safeNodes = useMemo(() => {
    if (!Array.isArray(contextNodes)) {
      if (import.meta.env.DEV) {
        console.warn('PlaygroundCanvas: contextNodes is not an array', contextNodes);
      }
      return [];
    }
    return contextNodes;
  }, [contextNodes]);
  
  const safeEdges = useMemo(() => {
    if (!Array.isArray(contextEdges)) {
      if (import.meta.env.DEV) {
        console.warn('PlaygroundCanvas: contextEdges is not an array', contextEdges);
      }
      return [];
    }
    return contextEdges;
  }, [contextEdges]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <FlowProvider nodes={safeNodes} edges={safeEdges} theme={theme}>
        <PlaygroundCanvasInner />
      </FlowProvider>
    </div>
  );
}
