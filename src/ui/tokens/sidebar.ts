/**
 * Sidebar Design Tokens
 * 
 * Centralized tokens for sidebar components to ensure consistency
 * and ease of maintenance. All spacing, sizing, and color values
 * should reference these tokens.
 */

export const SIDEBAR_TOKENS = {
  // Icon sizes
  icon: {
    sm: 'h-4 w-4',      // 16px
    md: 'h-5 w-5',      // 20px (default)
    lg: 'h-6 w-6',      // 24px
  },
  
  // Text sizes
  text: {
    xs: 'text-xs',      // 12px (group titles)
    sm: 'text-sm',      // 14px (items - default)
    base: 'text-base',  // 16px
  },
  
  // Spacing
  spacing: {
    itemPaddingX: 'px-4',           // 16px horizontal padding for items
    itemPaddingY: 'py-2',          // 8px vertical padding for items
    nestedIndent: 'pl-6',          // 24px for nested items (level 1)
    nestedIndentLevel2: 'pl-10',   // 40px for nested items (level 2)
    nestedIndentLevel3: 'pl-14',    // 56px for nested items (level 3)
    groupTitlePadding: 'px-4 py-2', // Padding for group titles
    iconMargin: 'mr-3',            // 12px margin between icon and text
  },
  
  // Colors (using Tailwind classes)
  colors: {
    active: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-600',
    },
    inactive: {
      text: 'text-gray-700',
      hover: 'hover:bg-gray-100 hover:text-gray-900',
    },
    groupTitle: 'text-gray-500',
  },
  
  // Chevron (for collapsible groups)
  chevron: {
    size: 'h-3 w-3',      // 12px (reduced from h-4 w-4)
    color: 'text-gray-400', // Subtle gray color
  },
  
  // Navigation column (for split sidebar)
  navigation: {
    width: {
      default: '56px',
      compact: '48px',
      expanded: '200px',
    },
    background: {
      default: '#fafafa',
      hover: '#f5f5f5',
    },
  },
  
  // Split sidebar
  split: {
    transition: 'transition-all duration-300',
    collapsedWidth: '0px',
  },
  
  // Content area
  content: {
    scrollbar: {
      width: 'thin',
      color: {
        thumb: '#cbd5e1',
        track: '#f1f5f9',
      },
    },
  },
} as const;

/**
 * Helper function to get nested indent class based on level
 */
export function getNestedIndentClass(level: number): string {
  if (level <= 0) return SIDEBAR_TOKENS.spacing.itemPaddingX;
  if (level === 1) return SIDEBAR_TOKENS.spacing.nestedIndent;
  if (level === 2) return SIDEBAR_TOKENS.spacing.nestedIndentLevel2;
  if (level === 3) return SIDEBAR_TOKENS.spacing.nestedIndentLevel3;
  // For levels > 3, calculate dynamically: pl-{4 + level * 4}
  return `pl-${4 + level * 4}`;
}
