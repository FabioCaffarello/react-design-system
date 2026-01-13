'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../atoms';
import Tooltip from '../../../atoms/Tooltip/Tooltip';
import { useSplitSidebar } from '../hooks/useSplitSidebar';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

export interface SplitSidebarToggleProps {
  /**
   * Position of the toggle button
   * @default 'top'
   */
  position?: 'top' | 'bottom' | 'inside';
  
  /**
   * Whether to show tooltip
   * @default true
   */
  showTooltip?: boolean;
  
  /**
   * Keyboard shortcut (e.g., 'Ctrl+B')
   * @default 'Ctrl+B'
   */
  keyboardShortcut?: string;
  
  /**
   * Whether keyboard shortcut is enabled
   * @default true
   */
  enableKeyboardShortcut?: boolean;
  
  /**
   * Custom className
   */
  className?: string;
  
  /**
   * Custom aria-label
   */
  'aria-label'?: string;
}

/**
 * SplitSidebar Toggle Component
 * 
 * Button to toggle sidebar collapse/expand state.
 * Supports keyboard shortcuts and tooltips.
 * 
 * @example
 * ```tsx
 * <SplitSidebar.Toggle position="top" showTooltip={true} />
 * ```
 */
export default function SplitSidebarToggle({
  position = 'top',
  showTooltip = true,
  keyboardShortcut = 'Ctrl+B',
  enableKeyboardShortcut = true,
  className = '',
  'aria-label': ariaLabel,
}: SplitSidebarToggleProps) {
  const { collapsed, toggle } = useSplitSidebar();

  // Parse keyboard shortcut
  const parseShortcut = (shortcut: string) => {
    const parts = shortcut.toLowerCase().split('+').map(s => s.trim());
    return {
      key: parts[parts.length - 1],
      ctrl: parts.includes('ctrl') || parts.includes('cmd'),
      shift: parts.includes('shift'),
      alt: parts.includes('alt'),
      meta: parts.includes('meta') || parts.includes('cmd'),
    };
  };

  const shortcutConfig = parseShortcut(keyboardShortcut);

  // Register keyboard shortcut
  useKeyboardShortcut({
    key: shortcutConfig.key,
    ctrl: shortcutConfig.ctrl,
    shift: shortcutConfig.shift,
    alt: shortcutConfig.alt,
    meta: shortcutConfig.meta,
    onTrigger: toggle,
    enabled: enableKeyboardShortcut,
  });

  const defaultAriaLabel = collapsed
    ? 'Expand sidebar'
    : 'Collapse sidebar';

  const tooltipContent = showTooltip
    ? `${collapsed ? 'Expand' : 'Collapse'} sidebar (${keyboardShortcut})`
    : undefined;

  const button = (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className={`
        ${position === 'inside' ? 'absolute top-2 right-2 z-10' : ''}
        ${className}
      `}
      aria-label={ariaLabel || defaultAriaLabel}
      aria-expanded={!collapsed}
      aria-controls="split-sidebar-content"
    >
      {collapsed ? (
        <ChevronRight className="h-4 w-4 transition-transform duration-200" />
      ) : (
        <ChevronLeft className="h-4 w-4 transition-transform duration-200" />
      )}
    </Button>
  );

  if (showTooltip && tooltipContent) {
    return (
      <Tooltip content={tooltipContent} position={position === 'top' ? 'right' : position === 'bottom' ? 'right' : 'top'}>
        {button}
      </Tooltip>
    );
  }

  return button;
}
