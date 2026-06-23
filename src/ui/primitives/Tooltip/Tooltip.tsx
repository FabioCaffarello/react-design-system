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

// Omit the native HTML `content` attribute (string | undefined) so we can
// widen it to ReactNode without a type conflict.
export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content"
> {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  /**
   * When true, the tooltip panel stays open while the pointer hovers over it
   * (150 ms grace-period bridge), and keyboard focus may move into focusable
   * elements inside the panel (e.g. links). Use for educational / rich
   * tooltips that contain interactive content.
   *
   * @default false
   */
  interactive?: boolean;
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
 *
 * Pass `content` as a plain string for simple labels, or as a `ReactNode`
 * for rich / educational content. Set `interactive` when the panel contains
 * clickable elements (links, buttons) — the tooltip then stays open while
 * the pointer is over the panel and while keyboard focus is inside it.
 *
 * @example
 * ```tsx
 * // Simple string
 * <Tooltip content="This is a tooltip">
 *   <Button>Hover me</Button>
 * </Tooltip>
 *
 * // Rich interactive content
 * <Tooltip
 *   interactive
 *   content={
 *     <>
 *       <strong>Pirâmide de Confiança L2</strong>
 *       <p>Dados verificados por fonte oficial.</p>
 *       <a href="/ajuda/piramide">Saiba mais</a>
 *     </>
 *   }
 * >
 *   <Badge>L2</Badge>
 * </Tooltip>
 * ```
 */
const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    content,
    children,
    position = "top",
    delay = 200,
    interactive = false,
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
    if (!interactive) {
      setIsVisible(false);
      return;
    }
    // Grace period — allows the pointer to travel from the trigger to the
    // tooltip panel without the tooltip closing in between.
    const id = setTimeout(() => setIsVisible(false), 150);
    timeoutIdRef.current = id;
  };

  const handleFocus = () => {
    // Show tooltip immediately on focus (no delay for keyboard users)
    setIsVisible(true);
  };

  const handleBlur = (e: FocusEvent<HTMLElement>) => {
    // When interactive, keep the tooltip open if focus moves into the panel.
    if (interactive && tooltipRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsVisible(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsVisible(false);
      triggerRef.current?.blur();
    }
  };

  // --- Interactive tooltip panel handlers ---

  const handleTooltipMouseEnter = () => {
    // Cancel the pending close started by handleMouseLeave's grace period.
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    setIsVisible(false);
  };

  const handleTooltipBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Close only when focus leaves both the panel AND the trigger.
    if (
      !tooltipRef.current?.contains(e.relatedTarget as Node) &&
      !triggerRef.current?.contains(e.relatedTarget as Node)
    ) {
      setIsVisible(false);
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
    pos: "top" | "bottom" | "left" | "right",
  ): string => {
    // Arrow follows the tooltip body's surface-inverse color so the
    // triangle's point visually merges into the body.
    const borderMap: Record<"top" | "bottom" | "left" | "right", string> = {
      top: "border-t-surface-inverse",
      bottom: "border-b-surface-inverse",
      left: "border-l-surface-inverse",
      right: "border-r-surface-inverse",
    };
    return borderMap[pos];
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
            handleBlur(e);
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
          className={cn(
            tooltipVariants({ position }),
            // Interactive tooltips contain rich / wrappable content — override
            // the CVA whitespace-nowrap with whitespace-normal and cap the width.
            interactive && "whitespace-normal max-w-xs",
          )}
          role="tooltip"
          aria-live="polite"
          onMouseEnter={interactive ? handleTooltipMouseEnter : undefined}
          onMouseLeave={interactive ? handleTooltipMouseLeave : undefined}
          onBlur={interactive ? handleTooltipBlur : undefined}
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
