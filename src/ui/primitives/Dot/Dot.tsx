"use client";

import { memo, forwardRef, useMemo } from "react";
import type { HTMLAttributes } from "react";
import { getRadiusClass } from "../../tokens/radius";
import { cn, cva } from "../../utils";

export type DotVariant =
  | "online"
  | "offline"
  | "pending"
  | "warning"
  | "error"
  | "info";
export type DotSize = "sm" | "md" | "lg";

export interface DotProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: DotVariant;
  size?: DotSize;
  "aria-label"?: string;
}

/**
 * Dot Component
 *
 * A simple colored circle for status indication. A primitive —
 * indivisible, composes no other UI. Uses semantic color tokens for
 * consistent theming.
 *
 * @example
 * ```tsx
 * <Dot variant="online" aria-label="User is online" />
 * <Dot variant="error" size="lg" aria-label="Error occurred" />
 * <Dot variant="pending" size="sm" aria-label="Action pending" />
 * ```
 */
// Dot variants using CVA
const dotVariants = cva(
  // Base classes
  cn("inline-block", getRadiusClass("full")),
  {
    variants: {
      variant: {
        online: "",
        offline: "",
        pending: "",
        warning: "",
        error: "",
        info: "",
      },
      size: {
        sm: "w-1.5 h-1.5",
        md: "w-2 h-2",
        lg: "w-2.5 h-2.5",
      },
    },
    compoundVariants: [
      // Map semantic variants to color tokens
      { variant: "online", class: "bg-success" },
      { variant: "offline", class: "bg-status-neutral" },
      { variant: "pending", class: "bg-warning" },
      { variant: "warning", class: "bg-warning" },
      { variant: "error", class: "bg-error" },
      { variant: "info", class: "bg-info" },
    ],
    defaultVariants: {
      variant: "offline",
      size: "md",
    },
  },
);

const Dot = memo(
  forwardRef<HTMLSpanElement, DotProps>(function Dot(
    {
      variant = "offline",
      size = "md",
      className = "",
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    // Memoize classes
    const classes = useMemo(
      () => cn(dotVariants({ variant, size }), className),
      [variant, size, className],
    );

    // Memoize accessible label with default fallback
    const accessibleLabel = useMemo(() => {
      if (ariaLabel) return ariaLabel;
      // Provide default labels based on variant
      const defaultLabels: Record<DotVariant, string> = {
        online: "Online",
        offline: "Offline",
        pending: "Pending",
        warning: "Warning",
        error: "Error",
        info: "Info",
      };
      return defaultLabels[variant];
    }, [ariaLabel, variant]);

    return (
      <span
        ref={ref}
        role="status"
        aria-label={accessibleLabel}
        className={classes}
        {...props}
      />
    );
  }),
);

Dot.displayName = "Dot";

export default Dot;
