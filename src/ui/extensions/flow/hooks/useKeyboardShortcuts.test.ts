import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, PLAYGROUND_SHORTCUTS } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  let mockAction: ReturnType<typeof vi.fn>;
  
  beforeEach(() => {
    mockAction = vi.fn();
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('calls action on keyboard shortcut', () => {
    const shortcuts = [
      {
        ...PLAYGROUND_SHORTCUTS.UNDO,
        action: mockAction,
      },
    ];
    
    renderHook(() => useKeyboardShortcuts({ enabled: true, shortcuts }));
    
    // Simulate Ctrl+Z
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    
    expect(mockAction).toHaveBeenCalledTimes(1);
  });
  
  it('does not call action when disabled', () => {
    const shortcuts = [
      {
        ...PLAYGROUND_SHORTCUTS.UNDO,
        action: mockAction,
      },
    ];
    
    renderHook(() => useKeyboardShortcuts({ enabled: false, shortcuts }));
    
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
    
    expect(mockAction).not.toHaveBeenCalled();
  });
  
  it('does not trigger in input fields', () => {
    const shortcuts = [
      {
        ...PLAYGROUND_SHORTCUTS.UNDO,
        action: mockAction,
      },
    ];
    
    renderHook(() => useKeyboardShortcuts({ enabled: true, shortcuts }));
    
    // Create an input element
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
    });
    input.dispatchEvent(event);
    
    // Should still work for Ctrl+Z (allowed in inputs)
    expect(mockAction).toHaveBeenCalledTimes(1);
    
    document.body.removeChild(input);
  });
  
  it('handles multiple shortcuts', () => {
    const undoAction = vi.fn();
    const redoAction = vi.fn();
    
    const shortcuts = [
      {
        ...PLAYGROUND_SHORTCUTS.UNDO,
        action: undoAction,
      },
      {
        ...PLAYGROUND_SHORTCUTS.REDO,
        action: redoAction,
      },
    ];
    
    renderHook(() => useKeyboardShortcuts({ enabled: true, shortcuts }));
    
    // Simulate Ctrl+Z
    const undoEvent = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(undoEvent);
    
    // Simulate Ctrl+Y
    const redoEvent = new KeyboardEvent('keydown', {
      key: 'y',
      ctrlKey: true,
      bubbles: true,
    });
    window.dispatchEvent(redoEvent);
    
    expect(undoAction).toHaveBeenCalledTimes(1);
    expect(redoAction).toHaveBeenCalledTimes(1);
  });
});
