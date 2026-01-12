/**
 * Z-Index Tokens
 * 
 * Centralized z-index system for consistent layering.
 * Uses Factory Pattern for type-safe token creation.
 */

export type ZIndexLayer = 
  | 'base' 
  | 'dropdown' 
  | 'sticky' 
  | 'fixed' 
  | 'modal-backdrop' 
  | 'modal' 
  | 'popover' 
  | 'tooltip' 
  | 'toast';

export interface ZIndexToken {
  value: number;
  tailwind: string;
  description: string;
}

/**
 * Z-Index Token Factory
 * Creates z-index tokens with consistent layering
 */
export class ZIndexTokenFactory {
  /**
   * Create a z-index token
   */
  static create(layer: ZIndexLayer): ZIndexToken {
    const layerMap: Record<ZIndexLayer, { value: number; tailwind: string; description: string }> = {
      base: {
        value: 0,
        tailwind: 'z-0',
        description: 'Base layer for normal content',
      },
      dropdown: {
        value: 1000,
        tailwind: 'z-[1000]',
        description: 'Dropdown menus and select options',
      },
      sticky: {
        value: 1020,
        tailwind: 'z-[1020]',
        description: 'Sticky headers and navigation',
      },
      fixed: {
        value: 1030,
        tailwind: 'z-[1030]',
        description: 'Fixed position elements',
      },
      'modal-backdrop': {
        value: 1040,
        tailwind: 'z-[1040]',
        description: 'Modal backdrop/overlay',
      },
      modal: {
        value: 1050,
        tailwind: 'z-[1050]',
        description: 'Modal dialogs and drawers',
      },
      popover: {
        value: 1060,
        tailwind: 'z-[1060]',
        description: 'Popovers and tooltips',
      },
      tooltip: {
        value: 1070,
        tailwind: 'z-[1070]',
        description: 'Tooltips (highest priority)',
      },
      toast: {
        value: 1080,
        tailwind: 'z-[1080]',
        description: 'Toast notifications (highest priority)',
      },
    };

    return layerMap[layer];
  }
}

/**
 * Pre-defined z-index tokens
 */
export const Z_INDEX_TOKENS = {
  base: ZIndexTokenFactory.create('base'),
  dropdown: ZIndexTokenFactory.create('dropdown'),
  sticky: ZIndexTokenFactory.create('sticky'),
  fixed: ZIndexTokenFactory.create('fixed'),
  'modal-backdrop': ZIndexTokenFactory.create('modal-backdrop'),
  modal: ZIndexTokenFactory.create('modal'),
  popover: ZIndexTokenFactory.create('popover'),
  tooltip: ZIndexTokenFactory.create('tooltip'),
  toast: ZIndexTokenFactory.create('toast'),
} as const;

/**
 * Helper function to get z-index token
 */
export function getZIndex(layer: ZIndexLayer): ZIndexToken {
  return ZIndexTokenFactory.create(layer);
}

/**
 * Helper function to get z-index as Tailwind class
 */
export function getZIndexClass(layer: ZIndexLayer): string {
  return ZIndexTokenFactory.create(layer).tailwind;
}
