'use client';

import React, { type ReactNode, type HTMLAttributes } from 'react';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../tokens';
import { SIDEBAR_TOKENS } from '../../tokens/sidebar';

export interface SidebarContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Optional title to display in the header
   */
  title?: string;
  
  /**
   * Whether to show the header section
   */
  showHeader?: boolean;
  
  /**
   * Whether the content area should be scrollable
   * @default true
   */
  scrollable?: boolean;
  
  /**
   * Padding size for the content area
   * @default 'lg'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Content to render
   */
  children: ReactNode;
}

/**
 * SidebarContent Component
 * 
 * A scrollable content area for sidebars with optional header.
 * Provides consistent styling and scroll behavior.
 * 
 * @example
 * ```tsx
 * <SidebarContent title="Settings" padding="md">
 *   <div>Content here</div>
 * </SidebarContent>
 * ```
 */
export default function SidebarContent({
  title,
  showHeader = true,
  scrollable = true,
  padding = 'lg',
  children,
  className = '',
  ...props
}: SidebarContentProps) {
  const paddingClass = padding !== 'none' 
    ? getSpacingClass(padding, 'p')
    : '';

  const scrollClasses = scrollable
    ? 'flex-1 overflow-y-auto overflow-x-hidden min-h-0'
    : 'flex-1';

  const scrollbarStyles = scrollable
    ? {
        scrollbarWidth: SIDEBAR_TOKENS.content.scrollbar.width as 'thin',
        scrollbarColor: `${SIDEBAR_TOKENS.content.scrollbar.color.thumb} ${SIDEBAR_TOKENS.content.scrollbar.color.track}`,
      }
    : {};

  return (
    <div className={`flex flex-col flex-1 min-w-0 ${className}`} {...props}>
      {/* Header Section */}
      {showHeader && title && (
        <div
          className={`
            ${getSpacingClass('md', 'px')}
            ${getSpacingClass('sm', 'py')}
            border-b
            ${getColorClass('neutral', 'DEFAULT', 'border')}
            shrink-0
            transition-all duration-200
            ${getColorClass('neutral', 'light', 'bg')}
          `}
        >
          <h2
            className={`
              ${getTypographyClasses('h4')}
              ${getColorClass('neutral', 'dark', 'text')}
              m-0
              font-semibold
            `}
          >
            {title}
          </h2>
        </div>
      )}
      
      {/* Content Section */}
      <div
        className={`
          ${scrollClasses}
          ${paddingClass}
          transition-all duration-200
          ${getColorClass('neutral', 'light', 'bg')}
        `}
        style={scrollbarStyles}
      >
        {children}
      </div>
    </div>
  );
}
