"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import {
  useCollapsible,
  type UseCollapsibleOptions,
} from "../../hooks/useCollapsible";
import { getRadiusClass } from "../../tokens/radius";
import { cn } from "../../utils";

export interface CollapsibleProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  children: ReactNode;
  /**
   * Content for the toggle button. When omitted, Collapsible renders only
   * the animated content panel — the caller is responsible for its own
   * trigger and `open`-state wiring (SidebarGroup/SideNavbarGroup pattern).
   */
  trigger?: ReactNode;
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
const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  function Collapsible(
    {
      children,
      trigger,
      defaultOpen = true,
      open,
      onOpenChange,
      disabled = false,
      duration = 200,
      storageKey,
      className = "",
      ...props
    },
    ref,
  ) {
    const { isOpen, toggle } = useCollapsible({
      defaultOpen,
      open,
      onOpenChange,
      storageKey,
    } as UseCollapsibleOptions);

    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | "auto">(isOpen ? "auto" : 0);

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

    // Stable per-instance ID for the collapsible content panel —
    // referenced by aria-controls on the toggle button. The previous
    // Math.random() approach regenerated the ID on every render, so
    // toggle/content pairing was technically inconsistent across
    // re-renders. useId is SSR-safe and stable.
    const contentId = `collapsible-content-${useId()}`;

    return (
      <div ref={ref} className={className} {...props}>
        {trigger !== undefined && (
          <button
            type="button"
            onClick={toggle}
            onKeyDown={(e: KeyboardEvent<HTMLButtonElement>) => {
              if (e.key === "Enter" || e.key === " ") {
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
            className={cn(
              "w-full",
              "text-left",
              "focus:outline-none",
              "focus:ring-2",
              "focus:ring-line-brand",
              "focus:ring-offset-2",
              getRadiusClass("md"),
            )}
          >
            {trigger}
          </button>
        )}
        <div
          id={contentId}
          ref={contentRef}
          style={{
            height: typeof height === "number" ? `${height}px` : height,
            overflow: "hidden",
            transition: `height ${duration}ms ease-in-out`,
          }}
          aria-hidden={!isOpen}
        >
          <div>{children}</div>
        </div>
      </div>
    );
  },
);

Collapsible.displayName = "Collapsible";

export default Collapsible;
