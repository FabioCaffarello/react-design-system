/**
 * Playground Persistence Utilities
 * 
 * Handles auto-save, version history, and export/import functionality.
 */

import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';
import type { ReactFlowConfig, BackgroundConfig, LayoutConfig } from '../types/playgroundTypes';
import type { PlaygroundTabId } from '../components/PlaygroundTabs';

export interface PlaygroundSnapshot {
  id: string;
  timestamp: number;
  nodes: Node<FlowNodeData>[];
  edges: Edge<FlowEdgeData>[];
  reactFlowConfig?: ReactFlowConfig;
  backgroundConfig?: BackgroundConfig;
  layoutConfig?: LayoutConfig;
  theme?: 'light' | 'dark';
  activeTab?: PlaygroundTabId;
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface PlaygroundPersistenceOptions {
  autoSaveEnabled?: boolean;
  autoSaveInterval?: number; // milliseconds
  maxVersions?: number;
  storageKey?: string;
}

const DEFAULT_OPTIONS: Required<PlaygroundPersistenceOptions> = {
  autoSaveEnabled: true,
  autoSaveInterval: 2000, // 2 seconds
  maxVersions: 10,
  storageKey: 'playground-autosave',
};

/**
 * Save playground state
 */
export function savePlaygroundState(
  snapshot: Omit<PlaygroundSnapshot, 'id' | 'timestamp'>,
  options: PlaygroundPersistenceOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const fullSnapshot: PlaygroundSnapshot = {
    ...snapshot,
    id: `snapshot-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    timestamp: Date.now(),
  };

  try {
    // Save current state
    localStorage.setItem(opts.storageKey, JSON.stringify(fullSnapshot));

    // Save to version history
    const historyKey = `${opts.storageKey}-history`;
    const history = loadVersionHistory(historyKey);
    
    // Add to history
    history.unshift(fullSnapshot);
    
    // Limit history size
    if (history.length > opts.maxVersions) {
      history.splice(opts.maxVersions);
    }
    
    localStorage.setItem(historyKey, JSON.stringify(history));
    
    return fullSnapshot.id;
  } catch (error) {
    console.warn('Failed to save playground state:', error);
    throw error;
  }
}

/**
 * Load playground state
 */
export function loadPlaygroundState(
  options: PlaygroundPersistenceOptions = {}
): PlaygroundSnapshot | null {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    const saved = localStorage.getItem(opts.storageKey);
    if (saved) {
      return JSON.parse(saved) as PlaygroundSnapshot;
    }
  } catch (error) {
    console.warn('Failed to load playground state:', error);
  }
  
  return null;
}

/**
 * Load version history
 */
export function loadVersionHistory(historyKey: string = 'playground-autosave-history'): PlaygroundSnapshot[] {
  try {
    const saved = localStorage.getItem(historyKey);
    if (saved) {
      return JSON.parse(saved) as PlaygroundSnapshot[];
    }
  } catch (error) {
    console.warn('Failed to load version history:', error);
  }
  
  return [];
}

/**
 * Get version by ID
 */
export function getVersionById(
  versionId: string,
  historyKey: string = 'playground-autosave-history'
): PlaygroundSnapshot | null {
  const history = loadVersionHistory(historyKey);
  return history.find(v => v.id === versionId) || null;
}

/**
 * Delete version
 */
export function deleteVersion(
  versionId: string,
  historyKey: string = 'playground-autosave-history'
): boolean {
  try {
    const history = loadVersionHistory(historyKey);
    const filtered = history.filter(v => v.id !== versionId);
    localStorage.setItem(historyKey, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.warn('Failed to delete version:', error);
    return false;
  }
}

/**
 * Clear all saved state
 */
export function clearPlaygroundState(options: PlaygroundPersistenceOptions = {}): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  try {
    localStorage.removeItem(opts.storageKey);
    localStorage.removeItem(`${opts.storageKey}-history`);
  } catch (error) {
    console.warn('Failed to clear playground state:', error);
  }
}

/**
 * Export to JSON
 */
export function exportToJSON(snapshot: PlaygroundSnapshot): string {
  return JSON.stringify(snapshot, null, 2);
}

/**
 * Import from JSON
 */
export function importFromJSON(json: string): PlaygroundSnapshot {
  try {
    const parsed = JSON.parse(json);
    // Validate structure
    if (!parsed.nodes || !parsed.edges) {
      throw new Error('Invalid playground state format');
    }
    return parsed as PlaygroundSnapshot;
  } catch (error) {
    console.error('Failed to import playground state:', error);
    throw error;
  }
}

/**
 * Generate shareable URL
 */
export function generateShareableURL(snapshot: PlaygroundSnapshot): string {
  // Compress snapshot to base64 for URL
  const compressed = btoa(JSON.stringify(snapshot));
  const url = new URL(window.location.href);
  url.hash = `#share/${compressed}`;
  return url.toString();
}

/**
 * Load from shareable URL
 */
export function loadFromShareableURL(): PlaygroundSnapshot | null {
  try {
    const hash = window.location.hash;
    if (hash.startsWith('#share/')) {
      const compressed = hash.slice(7); // Remove '#share/'
      const json = atob(compressed);
      return importFromJSON(json);
    }
  } catch (error) {
    console.warn('Failed to load from shareable URL:', error);
  }
  
  return null;
}

/**
 * Auto-save hook
 */
export function useAutoSave(
  snapshot: Omit<PlaygroundSnapshot, 'id' | 'timestamp'>,
  options: PlaygroundPersistenceOptions = {}
) {
  const opts = React.useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastSnapshotRef = React.useRef<string>('');

  React.useEffect(() => {
    if (!opts.autoSaveEnabled) return;

    // Create snapshot string for comparison
    const currentSnapshot = JSON.stringify(snapshot);
    
    // Only save if changed
    if (currentSnapshot === lastSnapshotRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        savePlaygroundState(snapshot, opts);
        lastSnapshotRef.current = currentSnapshot;
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }
    }, opts.autoSaveInterval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [snapshot, opts]);
}

// Import React for useAutoSave hook
import React from 'react';
