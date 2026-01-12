'use client';

import { useTabsContext } from './TabsContext';
import { useRef, useEffect, type HTMLAttributes, ReactNode } from 'react';
import { getRadiusClass } from '../../tokens';

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * TabsList Component
 * 
 * Container for tab triggers.
 * Manages keyboard navigation between tabs.
 * Must be used within a Tabs component.
 */
export function TabsList({
  children,
  className = '',
  ...props
}: TabsListProps) {
  const { orientation } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation at list level
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const triggers = Array.from(
        list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
      );
      const currentIndex = triggers.findIndex(trigger => trigger === document.activeElement);

      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      if (orientation === 'horizontal') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % triggers.length;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        }
      } else {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % triggers.length;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          nextIndex = (currentIndex - 1 + triggers.length) % triggers.length;
        }
      }

      if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = triggers.length - 1;
      }

      if (nextIndex !== currentIndex) {
        triggers[nextIndex]?.focus();
      }
    };

    list.addEventListener('keydown', handleKeyDown);
    return () => list.removeEventListener('keydown', handleKeyDown);
  }, [orientation]);

  const orientationClasses = orientation === 'vertical'
    ? 'flex-col space-y-1'
    : 'flex-row space-x-1';

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={`
        inline-flex
        ${orientationClasses}
        p-1
        bg-gray-100
        ${getRadiusClass('md')}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
