'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { SideNavbarStateContext } from '../contexts/SideNavbarStateContext';
import { useSideNavbarThemeRequired } from '../contexts/SideNavbarThemeContext';
import { useSideNavbarConfigRequired } from '../contexts/SideNavbarConfigContext';
import { useResize } from '../hooks/useResize';
import { useResponsiveSidebar } from '../hooks/useResponsiveSidebar';
import { useFocusManagement } from '../hooks/useFocusManagement';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { parseWidthToPixels, parseKeyboardShortcut } from '../utils';
import type { SideNavbarStateProviderProps, SideNavbarStateContextValue } from '../types';

/**
 * State Provider for SideNavbar
 *
 * Provides runtime state management for the sidebar.
 * Manages collapse state, resize, responsive behavior, and group states.
 *
 * Must be nested inside SideNavbarThemeProvider and SideNavbarConfigProvider.
 *
 * @example
 * ```tsx
 * <SideNavbarThemeProvider>
 *   <SideNavbarConfigProvider>
 *     <SideNavbarStateProvider defaultCollapsed onCollapseChange={handleChange}>
 *       <SideNavbarRoot>...</SideNavbarRoot>
 *     </SideNavbarStateProvider>
 *   </SideNavbarConfigProvider>
 * </SideNavbarThemeProvider>
 * ```
 */
export function SideNavbarStateProvider({
  children,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapseChange,
  onWidthChange,
  onMobileChange,
  exclusiveGroups = false,
}: SideNavbarStateProviderProps) {
  const theme = useSideNavbarThemeRequired();
  const config = useSideNavbarConfigRequired();
  const sidebarRef = useRef<HTMLElement | null>(null);

  // Determine if component is controlled
  const isControlled = controlledCollapsed !== undefined;

  // Initialize collapsed state from storage or default
  const getInitialCollapsedState = (): boolean => {
    if (isControlled) return controlledCollapsed;
    if (config.storageKey && config.persistState && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${config.storageKey}-collapsed`);
      if (stored !== null) {
        return stored === 'true';
      }
    }
    return defaultCollapsed;
  };

  // Initialize width state from storage or default
  const getInitialWidth = (): number => {
    if (config.storageKey && config.persistWidth && typeof window !== 'undefined') {
      const stored = localStorage.getItem(`${config.storageKey}-width`);
      if (stored !== null) {
        const parsedWidth = parseInt(stored, 10);
        if (!isNaN(parsedWidth)) return parsedWidth;
      }
    }
    return parseWidthToPixels(theme.contentWidth);
  };

  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(getInitialCollapsedState);
  const [groupStates, setGroupStates] = useState<Record<string, boolean>>({});

  // Responsive sidebar
  const { isMobile } = useResponsiveSidebar({
    mobileBreakpoint: config.mobileBreakpoint,
    onMobileChange: (mobile) => {
      onMobileChange?.(mobile);
      // Auto-collapse on mobile if using collapse variant
      if (mobile && config.mobileVariant === 'collapse' && !isControlled) {
        setInternalCollapsed(true);
      }
    },
    enabled: config.responsive,
  });

  // Resize functionality
  const {
    width: resizeWidth,
    isResizing,
    startResize,
    setWidth: setResizeWidth,
  } = useResize({
    initialWidth: getInitialWidth(),
    minWidth: config.minWidth,
    maxWidth: config.maxWidth,
    snapPoints: config.snapPoints,
    onWidthChange: (newWidth) => {
      onWidthChange?.(newWidth);
      // Persist width if enabled
      if (config.storageKey && config.persistWidth && typeof window !== 'undefined') {
        localStorage.setItem(`${config.storageKey}-width`, String(newWidth));
      }
    },
    enabled: config.resizable && !isMobile,
  });

  // Focus management for mobile overlay
  useFocusManagement({
    isActive: isMobile && config.mobileVariant === 'overlay' && !internalCollapsed,
    containerRef: sidebarRef,
    restoreFocus: true,
  });

  // Derived collapsed state
  const collapsed = isControlled ? controlledCollapsed : internalCollapsed;

  // Set collapsed handler
  const setCollapsed = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalCollapsed(value);
      }
      onCollapseChange?.(value);
    },
    [isControlled, onCollapseChange]
  );

  // Toggle handler
  const toggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  // Keyboard shortcut
  const shortcut = parseKeyboardShortcut(config.keyboardShortcut);
  useKeyboardShortcut({
    key: shortcut.key,
    ctrl: shortcut.ctrl,
    shift: shortcut.shift,
    alt: shortcut.alt,
    meta: shortcut.meta,
    onTrigger: toggle,
    enabled: config.enableKeyboardShortcut,
  });

  // Set width handler
  const setWidth = useCallback(
    (newWidth: number) => {
      setResizeWidth(newWidth);
    },
    [setResizeWidth]
  );

  // Group state handlers
  const toggleGroup = useCallback((groupId: string) => {
    if (exclusiveGroups) {
      // Exclusive behavior: only one group open at a time (like ButtonGroup)
      // When clicking a group:
      // - If it's open (false = expanded), close it (all groups closed)
      // - If it's closed (true = collapsed or undefined), open it and close all others
      // - After closing, user can click any group (including the same one) to open it again
      setGroupStates((prev) => {
        const currentState = prev[groupId];
        const isCurrentlyOpen = currentState === false; // false means expanded (not collapsed)
        const newStates: Record<string, boolean> = {};
        
        // Get all group IDs (from current state and the one being toggled)
        const allGroupIds = new Set([...Object.keys(prev), groupId]);
        
        if (isCurrentlyOpen) {
          // Group is currently open, close it (and all others remain closed)
          allGroupIds.forEach((id) => {
            newStates[id] = true; // true = collapsed
          });
        } else {
          // Group is currently closed, open it and close all others
          allGroupIds.forEach((id) => {
            newStates[id] = id !== groupId; // true = collapsed, false = expanded
          });
        }
        
        return newStates;
      });
    } else {
      // Default behavior: toggle individual group state
      setGroupStates((prev) => ({
        ...prev,
        [groupId]: !prev[groupId],
      }));
    }
  }, [exclusiveGroups]);

  const setGroupCollapsed = useCallback((groupId: string, isCollapsed: boolean) => {
    setGroupStates((prev) => ({
      ...prev,
      [groupId]: isCollapsed,
    }));
  }, []);

  // Sync with controlled value
  useEffect(() => {
    if (isControlled && controlledCollapsed !== internalCollapsed) {
      setInternalCollapsed(controlledCollapsed);
    }
  }, [isControlled, controlledCollapsed, internalCollapsed]);

  // Persist collapsed state to storage
  useEffect(() => {
    if (config.storageKey && config.persistState && typeof window !== 'undefined' && !isControlled) {
      localStorage.setItem(`${config.storageKey}-collapsed`, String(internalCollapsed));
    }
  }, [config.storageKey, config.persistState, internalCollapsed, isControlled]);

  const value: SideNavbarStateContextValue = useMemo(
    () => ({
      collapsed,
      toggle,
      setCollapsed,
      currentWidth: resizeWidth,
      setWidth,
      isMobile,
      isResizing,
      startResize,
      groupStates,
      toggleGroup,
      setGroupCollapsed,
      sidebarRef,
    }),
    [
      collapsed,
      toggle,
      setCollapsed,
      resizeWidth,
      setWidth,
      isMobile,
      isResizing,
      startResize,
      groupStates,
      toggleGroup,
      setGroupCollapsed,
    ]
  );

  return (
    <SideNavbarStateContext.Provider value={value}>
      {children}
    </SideNavbarStateContext.Provider>
  );
}

export default SideNavbarStateProvider;
