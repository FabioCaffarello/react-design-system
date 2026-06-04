"use client";

import type {
  HTMLAttributes,
  ReactNode,
  KeyboardEvent,
  FocusEvent,
  ReactElement,
} from "react";
import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useId,
  cloneElement,
  isValidElement,
} from "react";
import { getBorderWidthClass } from "../../tokens/borders";
import { getRadiusClass } from "../../tokens/radius";
import { getShadowClass } from "../../tokens/shadows";
import { getSpacingClass } from "../../tokens/spacing";
import { getTypographySize } from "../../tokens/typography";
import { getZIndexClass } from "../../tokens/z-index";
import { cn, cva, mergeRefs } from "../../utils";

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  "aria-label"?: string;
  /**
   * When true, the tooltip wrapper won't interfere with absolute positioning of children.
   * The wrapper will use `position: static` instead of `position: relative`.
   */
  preservePositioning?: boolean;
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
const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    content,
    children,
    position = "top",
    delay = 200,
    className = "",
    "aria-label": _ariaLabel,
    preservePositioning = false,
    ...props
  },
  ref,
) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Stable per-instance ID for the tooltip popup. useId is SSR-safe and
  // stable across renders — the previous Math.random() approach generated
  // a fresh ID on every render, which silently breaks the
  // aria-describedby <-> tooltip id pairing observed by assistive tech
  // across re-renders.
  const tooltipId = `tooltip-${useId()}`;

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    timeoutIdRef.current = id;
  };

  const handleMouseLeave = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
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
    if (e.key === "Escape") {
      setIsVisible(false);
      triggerRef.current?.blur();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
    };
  }, []);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  // Helper to get arrow border color
  // Uses complete classes that Tailwind can detect
  const getArrowBorderColor = (
    position: "top" | "bottom" | "left" | "right",
  ): string => {
    // Arrow follows the tooltip body's surface-inverse color so the
    // triangle's point visually merges into the body.
    const borderMap: Record<"top" | "bottom" | "left" | "right", string> = {
      top: "border-t-surface-inverse",
      bottom: "border-b-surface-inverse",
      left: "border-l-surface-inverse",
      right: "border-r-surface-inverse",
    };
    return borderMap[position];
  };

  // Tooltip variants using CVA
  const tooltipVariants = cva(
    cn(
      "absolute",
      getZIndexClass("tooltip"),
      getSpacingClass("sm", "px"),
      getSpacingClass("xs", "py"),
      getTypographySize("caption"),
      "text-fg-inverse",
      "bg-surface-inverse",
      getRadiusClass("md"),
      getShadowClass("lg"),
      "whitespace-nowrap",
    ),
    {
      variants: {
        position: {
          top: cn(
            "bottom-full",
            "left-1/2",
            "transform",
            "-translate-x-1/2",
            getSpacingClass("sm", "mb"),
          ),
          bottom: cn(
            "top-full",
            "left-1/2",
            "transform",
            "-translate-x-1/2",
            getSpacingClass("sm", "mt"),
          ),
          left: cn(
            "right-full",
            "top-1/2",
            "transform",
            "-translate-y-1/2",
            getSpacingClass("sm", "mr"),
          ),
          right: cn(
            "left-full",
            "top-1/2",
            "transform",
            "-translate-y-1/2",
            getSpacingClass("sm", "ml"),
          ),
        },
      },
      defaultVariants: {
        position: "top",
      },
    },
  );

  const arrowVariants = cva(
    cn(
      "absolute",
      "w-0",
      "h-0",
      getBorderWidthClass("thick"),
      "border-transparent",
    ),
    {
      variants: {
        position: {
          top: cn(
            "top-full",
            "left-1/2",
            "transform",
            "-translate-x-1/2",
            getArrowBorderColor("top"),
          ),
          bottom: cn(
            "bottom-full",
            "left-1/2",
            "transform",
            "-translate-x-1/2",
            getArrowBorderColor("bottom"),
          ),
          left: cn(
            "left-full",
            "top-1/2",
            "transform",
            "-translate-y-1/2",
            getArrowBorderColor("left"),
          ),
          right: cn(
            "right-full",
            "top-1/2",
            "transform",
            "-translate-y-1/2",
            getArrowBorderColor("right"),
          ),
        },
      },
      defaultVariants: {
        position: "top",
      },
    },
  );

  // Clone children to add accessibility props
  const childrenWithProps = isValidElement(children)
    ? (() => {
        const childElement = children as ReactElement<
          HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
        >;
        const existingProps = childElement.props;
        const existingRef = existingProps.ref;

        return cloneElement(childElement, {
          ref: mergeRefs<HTMLElement>(triggerRef, existingRef),
          "aria-describedby": isVisible
            ? tooltipId
            : existingProps["aria-describedby"],
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

  // When preservePositioning is true, use static positioning to avoid interfering
  // with absolute positioned children. The tooltip will still be positioned correctly
  // using absolute positioning relative to the viewport/nearest positioned ancestor.
  const wrapperClassName = preservePositioning
    ? cn("static", "inline-block", className)
    : cn("relative", "inline-block", className);

  return (
    <div ref={ref} className={wrapperClassName} {...props}>
      {childrenWithProps}
      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          className={cn(tooltipVariants({ position }))}
          role="tooltip"
          aria-live="polite"
        >
          {content}
          <div className={cn(arrowVariants({ position }))} aria-hidden="true" />
        </div>
      )}
    </div>
  );
});

Tooltip.displayName = "Tooltip";

export default Tooltip;
