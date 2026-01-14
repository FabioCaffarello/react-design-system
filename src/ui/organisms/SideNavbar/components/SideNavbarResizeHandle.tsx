'use client';

import { type HTMLAttributes } from 'react';
import { GripVertical } from 'lucide-react';
import { useSideNavbarStateRequired } from '../contexts/SideNavbarStateContext';
import { useSideNavbarConfigRequired } from '../contexts/SideNavbarConfigContext';

export interface SideNavbarResizeHandleProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * SideNavbar Resize Handle Component
 *
 * Drag handle for resizing the sidebar width.
 * Uses context for state management - no props needed for resize configuration.
 *
 * @example
 * ```tsx
 * <SideNavbar resizable minWidth={200} maxWidth={600}>
 *   <SideNavbar.ResizeHandle />
 *   ...
 * </SideNavbar>
 * ```
 */
export default function SideNavbarResizeHandle({
  className = '',
  ...props
}: SideNavbarResizeHandleProps) {
  const { currentWidth, setWidth, isResizing, startResize } = useSideNavbarStateRequired();
  const { resizable } = useSideNavbarConfigRequired();

  if (!resizable) {
    return null;
  }

  return (
    <div
      className={`
        group
        absolute
        top-0
        right-0
        w-1
        h-full
        cursor-col-resize
        hover:bg-indigo-500/50
        active:bg-indigo-600
        transition-colors
        duration-150
        z-10
        flex
        items-center
        justify-center
        ${isResizing ? 'bg-indigo-600' : ''}
        ${className}
      `}
      onMouseDown={startResize}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuenow={currentWidth}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const delta = e.key === 'ArrowLeft' ? -10 : 10;
          setWidth(currentWidth + delta);
        }
      }}
      {...props}
    >
      <div
        className={`
          w-0.5
          h-8
          bg-gray-400
          rounded-full
          opacity-0
          group-hover:opacity-100
          transition-opacity
          ${isResizing ? 'opacity-100' : ''}
        `}
      />
      <GripVertical
        className={`
          h-4
          w-4
          text-gray-400
          opacity-0
          group-hover:opacity-100
          transition-opacity
          absolute
          ${isResizing ? 'opacity-100' : ''}
        `}
        aria-hidden="true"
      />
    </div>
  );
}
