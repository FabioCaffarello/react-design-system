/**
 * Playground Keyboard Navigation Hook
 * 
 * Enhanced keyboard navigation for the playground with focus management.
 */

import { useEffect, useCallback, useRef } from 'react';
import { usePlaygroundContext } from '../context/PlaygroundContext';

export interface PlaygroundKeyboardNavigationOptions {
  enabled?: boolean;
  onNodeDelete?: (nodeId: string) => void;
  onEdgeDelete?: (edgeId: string) => void;
  onNodeSelect?: (nodeId: string) => void;
  onEdgeSelect?: (edgeId: string) => void;
}

/**
 * Hook for enhanced keyboard navigation in playground
 */
export function usePlaygroundKeyboardNavigation({
  enabled = true,
  onNodeDelete,
  onEdgeDelete,
  onNodeSelect,
  onEdgeSelect,
}: PlaygroundKeyboardNavigationOptions = {}) {
  const {
    selectedNodeId,
    selectedEdgeId,
    nodes,
    edges,
    setSelectedNodeId,
    setSelectedEdgeId,
  } = usePlaygroundContext();
  
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = useCallback((event: globalThis.KeyboardEvent) => {
    if (!enabled) return;

    // Don't handle shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        if (event.ctrlKey || event.metaKey) return; // Allow browser shortcuts
        
        if (selectedNodeId) {
          event.preventDefault();
          if (onNodeDelete) {
            onNodeDelete(selectedNodeId);
          }
          setSelectedNodeId(null);
        } else if (selectedEdgeId) {
          event.preventDefault();
          if (onEdgeDelete) {
            onEdgeDelete(selectedEdgeId);
          }
          setSelectedEdgeId(null);
        }
        break;

      case 'Escape':
        event.preventDefault();
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        break;

      case 'ArrowRight':
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowDown':
        // Only handle if canvas is focused
        if (canvasRef.current?.contains(target)) {
          // Navigate between nodes
          if (nodes.length > 0) {
            const currentIndex = selectedNodeId
              ? nodes.findIndex(n => n.id === selectedNodeId)
              : -1;
            
            let nextIndex = currentIndex;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
              nextIndex = currentIndex < nodes.length - 1 ? currentIndex + 1 : 0;
            } else {
              nextIndex = currentIndex > 0 ? currentIndex - 1 : nodes.length - 1;
            }
            
            if (nextIndex >= 0 && nextIndex < nodes.length) {
              event.preventDefault();
              const nextNode = nodes[nextIndex];
              setSelectedNodeId(nextNode.id);
              setSelectedEdgeId(null);
              if (onNodeSelect) {
                onNodeSelect(nextNode.id);
              }
            }
          }
        }
        break;

      case 'Tab':
        // Allow default tab behavior but ensure focus management
        if (event.shiftKey) {
          // Shift+Tab: focus previous element
        } else {
          // Tab: focus next element
        }
        break;
    }
  }, [
    enabled,
    selectedNodeId,
    selectedEdgeId,
    nodes,
    edges,
    setSelectedNodeId,
    setSelectedEdgeId,
    onNodeDelete,
    onEdgeDelete,
    onNodeSelect,
    onEdgeSelect,
  ]);

  useEffect(() => {
    if (!enabled) return;

    const handler = handleKeyDown as unknown as EventListener;
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [enabled, handleKeyDown]);

  return {
    canvasRef,
  };
}
