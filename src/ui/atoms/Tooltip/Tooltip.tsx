'use client';

import type { HTMLAttributes, ReactNode, KeyboardEvent, FocusEvent, ReactElement } from "react";
import { useState, useRef, useEffect, cloneElement, isValidElement } from "react";

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  'aria-label'?: string;
}

/**
 * Tooltip Component
 * 
 * A tooltip component for displaying additional information on hover.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <Tooltip content="This is a tooltip">
 *   <Button>Hover me</Button>
 * </Tooltip>
 * ```
 */
export default function Tooltip({
  content,
  children,
  position = "top",
  delay = 200,
  className = "",
  'aria-label': ariaLabel,
  ...props
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Generate unique ID for tooltip
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const handleFocus = () => {
    // Show tooltip immediately on focus (no delay for keyboard users)
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsVisible(false);
      triggerRef.current?.blur();
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const positionClasses: Record<NonNullable<TooltipProps["position"]>, string> = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  const arrowClasses: Record<NonNullable<TooltipProps["position"]>, string> = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-900",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900",
    left: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-900",
    right: "right-full top-1/2 transform -translate-y-1/2 border-r-gray-900",
  };

  // Clone children to add accessibility props
  const childrenWithProps = isValidElement(children)
    ? (() => {
        const childElement = children as ReactElement<HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;
        const existingProps = childElement.props;
        const existingRef = existingProps.ref;
        
        return cloneElement(childElement, {
          ref: (node: HTMLElement | null) => {
            triggerRef.current = node;
            // Preserve existing ref if any
            if (typeof existingRef === 'function') {
              existingRef(node);
            } else if (existingRef && typeof existingRef === 'object' && 'current' in existingRef) {
              (existingRef as React.MutableRefObject<HTMLElement | null>).current = node;
            }
          },
          'aria-describedby': isVisible ? tooltipId : existingProps['aria-describedby'],
          onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
            handleMouseEnter();
            existingProps.onMouseEnter?.(e);
          },
          onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
            handleMouseLeave();
            existingProps.onMouseLeave?.(e);
          },
          onFocus: (e: FocusEvent<HTMLElement>) => {
            handleFocus();
            existingProps.onFocus?.(e);
          },
          onBlur: (e: FocusEvent<HTMLElement>) => {
            handleBlur();
            existingProps.onBlur?.(e);
          },
          onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
            handleKeyDown(e);
            existingProps.onKeyDown?.(e);
          },
        } as Partial<typeof existingProps>);
      })()
    : children;

  return (
    <div
      className={`relative inline-block ${className}`}
      {...props}
    >
      {childrenWithProps}
      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg whitespace-nowrap ${positionClasses[position]}`}
          role="tooltip"
          aria-live="polite"
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
