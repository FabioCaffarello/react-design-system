'use client';

import type { SplitSidebarProps } from '../SplitSidebar';

/**
 * Helper function to create a common playground configuration
 */
export function createPlaygroundSidebarConfig(
  overrides?: Partial<SplitSidebarProps>
): Partial<SplitSidebarProps> {
  return {
    width: '320px',
    collapsible: true,
    responsive: true,
    resizable: true,
    minWidth: 200,
    maxWidth: 600,
    snapPoints: [200, 320, 480],
    storageKey: 'playground-sidebar',
    persistState: 'localStorage',
    persistWidth: true,
    variant: 'default',
    ...overrides,
  };
}

/**
 * Helper function to create a mobile-optimized configuration
 */
export function createMobileSidebarConfig(
  overrides?: Partial<SplitSidebarProps>
): Partial<SplitSidebarProps> {
  return {
    width: '320px',
    collapsible: true,
    responsive: true,
    mobileBreakpoint: 768,
    mobileVariant: 'overlay',
    overlayBackdrop: true,
    storageKey: 'mobile-sidebar',
    persistState: 'localStorage',
    variant: 'default',
    ...overrides,
  };
}

/**
 * Helper function to create a compact sidebar configuration
 */
export function createCompactSidebarConfig(
  overrides?: Partial<SplitSidebarProps>
): Partial<SplitSidebarProps> {
  return {
    width: '240px',
    collapsible: true,
    variant: 'compact',
    ...overrides,
  };
}

/**
 * Parse width string/number to pixels
 */
export function parseWidthToPixels(width: number | string): number {
  if (typeof width === 'number') {
    return width;
  }
  
  const match = width.match(/(\d+)(px|rem|em)?/);
  if (!match) {
    return 320; // Default
  }
  
  const value = parseInt(match[1], 10);
  const unit = match[2] || 'px';
  
  if (unit === 'px') {
    return value;
  }
  
  // Convert rem/em to px (assuming 16px base)
  return value * 16;
}

/**
 * Format pixels to CSS width string
 */
export function formatPixelsToWidth(pixels: number): string {
  return `${pixels}px`;
}
