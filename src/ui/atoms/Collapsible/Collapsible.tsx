'use client';

import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type KeyboardEvent } from 'react';
import { useCollapsible, type UseCollapsibleOptions } from '../../hooks/useCollapsible';

export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children: ReactNode;
  trigger: ReactNode; // Content for the toggle button
  defaultOpen?: boolean;
  open?: boolean; // Controlled mode
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  duration?: number; // Animation duration in ms
  storageKey?: string; // For localStorage persistence
}

/**
 * Collapsible Component
 * 
 * A generic, reusable collapsible component for any content.
 * Supports both controlled and uncontrolled modes.
 * Includes smooth animations and full ARIA support.
 * 
 * @example
 * ```tsx
 * <Collapsible
 *   trigger={<button>Toggle</button>}
 *   defaultOpen={true}
 * >
 *   <div>Collapsible content</div>
 * </Collapsible>
 * ```
 */
export default function Collapsible({
  children,
  trigger,
  defaultOpen = true,
  open,
  onOpenChange,
  disabled = false,
  duration = 200,
  storageKey,
  className = '',
  ...props
}: CollapsibleProps) {
  const { isOpen, toggle } = useCollapsible({
    defaultOpen,
    open,
    onOpenChange,
    storageKey,
  } as UseCollapsibleOptions);

  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);

  // Update height when content changes or isOpen changes
  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      // Set to actual height for animation
      setHeight(contentRef.current.scrollHeight);
    } else {
      // Set to 0 for collapse animation
      setHeight(0);
    }
  }, [isOpen, children]);

  // Handle resize to recalculate height
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (contentRef.current && isOpen) {
        setHeight(contentRef.current.scrollHeight);
      }
    });

    resizeObserver.observe(contentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen]);

  const contentId = `collapsible-content-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className} {...props}>
      <button
        type="button"
        onClick={toggle}
        onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) {
              toggle();
            }
          }
        }}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-disabled={disabled}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
      >
        {trigger}
      </button>
      <div
        id={contentId}
        ref={contentRef}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          overflow: 'hidden',
          transition: `height ${duration}ms ease-in-out`,
        }}
        aria-hidden={!isOpen}
      >
        <div>{children}</div>
      </div>
    </div>
  );
}
