'use client';

import { useEffect, useCallback } from 'react';

export interface UseKeyboardShortcutOptions {
  /**
   * Key to listen for (e.g., 'b', 'Escape', 'Enter')
   */
  key: string;
  
  /**
   * Whether Ctrl/Cmd key should be pressed
   * @default false
   */
  ctrl?: boolean;
  
  /**
   * Whether Shift key should be pressed
   * @default false
   */
  shift?: boolean;
  
  /**
   * Whether Alt key should be pressed
   * @default false
   */
  alt?: boolean;
  
  /**
   * Whether Meta key should be pressed (Cmd on Mac)
   * @default false
   */
  meta?: boolean;
  
  /**
   * Callback when shortcut is triggered
   */
  onTrigger: () => void;
  
  /**
   * Whether the shortcut is enabled
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Whether to prevent default behavior
   * @default true
   */
  preventDefault?: boolean;
}

/**
 * Hook for keyboard shortcuts
 * 
 * Listens for keyboard combinations and triggers callbacks.
 * Automatically ignores input fields unless explicitly allowed.
 * 
 * @example
 * ```tsx
 * useKeyboardShortcut({
 *   key: 'b',
 *   ctrl: true,
 *   onTrigger: () => toggleSidebar(),
 * });
 * ```
 */
export function useKeyboardShortcut({
  key: targetKey,
  ctrl = false,
  shift = false,
  alt = false,
  meta = false,
  onTrigger,
  enabled = true,
  preventDefault = true,
}: UseKeyboardShortcutOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger in input fields (unless it's a system shortcut)
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow Ctrl/Cmd shortcuts in inputs (like Ctrl+B)
      if (isInputField && !ctrl && !meta) {
        return;
      }

      // Check key match (case-insensitive for letter keys)
      const keyMatch =
        targetKey.length === 1
          ? event.key.toLowerCase() === targetKey.toLowerCase()
          : event.key === targetKey;

      // Check modifier keys
      const ctrlMatch = ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;
      const metaMatch = meta ? event.metaKey : !event.metaKey;

      // If ctrl is true, allow either Ctrl or Meta (Cmd on Mac)
      const modifierMatch = ctrl
        ? (event.ctrlKey || event.metaKey) && !meta
        : ctrlMatch && metaMatch;

      if (keyMatch && modifierMatch && shiftMatch && altMatch) {
        if (preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
        onTrigger();
      }
    },
    [enabled, targetKey, ctrl, shift, alt, meta, onTrigger, preventDefault]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}
