'use client';

/**
 * Keyboard Shortcuts Hook
 * 
 * Hook for managing keyboard shortcuts in the playground
 */

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
}

export interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  shortcuts: KeyboardShortcut[];
}

/**
 * Hook for managing keyboard shortcuts
 */
export function useKeyboardShortcuts({ enabled = true, shortcuts }: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Check if input/textarea is focused (don't trigger shortcuts)
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow some shortcuts even in inputs (like Ctrl+Z for undo)
      const allowedInInput = ['z', 'y', 'a', 'c', 'v', 'x'];
      if (!allowedInInput.includes(event.key.toLowerCase())) {
        return;
      }
    }

    shortcuts.forEach((shortcut) => {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        event.stopPropagation();
        shortcut.action();
      }
    });
  }, [enabled, shortcuts]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}

/**
 * Common keyboard shortcuts for playground
 */
export const PLAYGROUND_SHORTCUTS = {
  UNDO: { key: 'z', ctrl: true, description: 'Undo' },
  REDO: { key: 'y', ctrl: true, description: 'Redo' },
  REDO_ALT: { key: 'z', ctrl: true, shift: true, description: 'Redo (alternative)' },
  DELETE: { key: 'Delete', description: 'Delete selected' },
  DELETE_ALT: { key: 'Backspace', description: 'Delete selected (alternative)' },
  SELECT_ALL: { key: 'a', ctrl: true, description: 'Select all' },
  COPY: { key: 'c', ctrl: true, description: 'Copy' },
  PASTE: { key: 'v', ctrl: true, description: 'Paste' },
  CUT: { key: 'x', ctrl: true, description: 'Cut' },
  SEARCH: { key: 'f', ctrl: true, description: 'Search' },
  FIT_VIEW: { key: 'f', description: 'Fit view' },
  ZOOM_IN: { key: '+', ctrl: true, description: 'Zoom in' },
  ZOOM_OUT: { key: '-', ctrl: true, description: 'Zoom out' },
  ZOOM_RESET: { key: '0', ctrl: true, description: 'Reset zoom' },
  TAB_1: { key: '1', alt: true, description: 'Switch to Nodes & Edges tab' },
  TAB_2: { key: '2', alt: true, description: 'Switch to Canvas tab' },
  TAB_3: { key: '3', alt: true, description: 'Switch to Background tab' },
  TAB_4: { key: '4', alt: true, description: 'Switch to Layout tab' },
  TAB_5: { key: '5', alt: true, description: 'Switch to Validation tab' },
  TAB_6: { key: '6', alt: true, description: 'Switch to Code tab' },
  TAB_7: { key: '7', alt: true, description: 'Switch to Settings tab' },
} as const;
