"use client";

import { memo, forwardRef, useMemo } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { getColorClass } from "../../tokens/colors";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import {
  getTypographySize,
  getTypographyWeight,
} from "../../tokens/typography";
import { cn, cva } from "../../utils";

export type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "primary"
  | "secondary";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeStyle = "solid" | "outline";

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: BadgeStyle;
  children: ReactNode;
  "aria-label"?: string;
}

/**
 * Badge Component
 *
 * A versatile badge component for displaying status, priority, and other labels.
 * Follows Atomic Design principles as an Atom component.
 * Uses tokens for consistent theming.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" size="lg">Critical</Badge>
 * <Badge variant="info" style="outline">New</Badge>
 * ```
 */
// Badge variants using CVA
const badgeVariants = cva(
  // Base classes
  cn(
    "inline-flex",
    "items-center",
    "justify-center",
    getTypographyWeight("label"),
    getRadiusClass("md"),
    "border",
  ),
  {
    variants: {
      variant: {
        success: "",
        warning: "",
        error: "",
        info: "",
        neutral: "",
        primary: "",
        secondary: "",
      },
      size: {
        sm: cn(
          getSpacingClass("1.5", "px"),
          getSpacingClass("0.5", "py"),
          getTypographySize("caption"),
        ),
        md: cn(
          getSpacingClass("sm", "px"),
          getSpacingClass("xs", "py"),
          getTypographySize("caption"),
        ),
        lg: cn(
          getSpacingClass("sm", "px"),
          getSpacingClass("xs", "py"),
          getTypographySize("bodySmall"),
        ),
      },
      style: {
        solid: "",
        outline: "",
      },
    },
    compoundVariants: [
      // Solid style variants
      {
        variant: "success",
        style: "solid",
        class: cn("bg-success-bg", "text-success-dark", "border-success"),
      },
      {
        variant: "warning",
        style: "solid",
        class: cn("bg-warning-bg", "text-warning-dark", "border-warning"),
      },
      {
        variant: "error",
        style: "solid",
        class: cn("bg-error-bg", "text-error-dark", "border-error"),
      },
      {
        variant: "info",
        style: "solid",
        class: cn("bg-info-bg", "text-info-dark", "border-info"),
      },
      {
        variant: "neutral",
        style: "solid",
        class: cn(
          getColorClass("neutral", "light", "bg"),
          getColorClass("neutral", "dark", "text"),
          getColorClass("neutral", "DEFAULT", "border"),
        ),
      },
      {
        variant: "primary",
        style: "solid",
        class: cn("bg-indigo-400", "text-indigo-600", "border-line-brand"),
      },
      {
        variant: "secondary",
        style: "solid",
        class: cn("bg-pink-300", "text-pink-600", "border-line-secondary"),
      },
      // Outline style variants
      {
        variant: "success",
        style: "outline",
        class: cn("bg-transparent", "border-success", "text-fg-success"),
      },
      {
        variant: "warning",
        style: "outline",
        class: cn("bg-transparent", "border-warning", "text-fg-warning"),
      },
      {
        variant: "error",
        style: "outline",
        class: cn("bg-transparent", "border-error", "text-fg-error"),
      },
      {
        variant: "info",
        style: "outline",
        class: cn("bg-transparent", "border-info", "text-fg-info"),
      },
      {
        variant: "neutral",
        style: "outline",
        class: cn(
          "bg-transparent",
          getColorClass("neutral", "DEFAULT", "border"),
          getColorClass("neutral", "DEFAULT", "text"),
        ),
      },
      {
        variant: "primary",
        style: "outline",
        class: cn("bg-transparent", "border-line-brand", "text-fg-brand"),
      },
      {
        variant: "secondary",
        style: "outline",
        class: cn(
          "bg-transparent",
          "border-line-secondary",
          "text-fg-brand-secondary",
        ),
      },
    ],
    defaultVariants: {
      variant: "neutral",
      size: "md",
      style: "solid",
    },
  },
);

const Badge = memo(
  forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
    {
      variant = "neutral",
      size = "md",
      style = "solid",
      className = "",
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) {
    // Memoize classes
    const classes = useMemo(
      () => cn(badgeVariants({ variant, size, style }), className),
      [variant, size, style, className],
    );

    // Memoize accessible label
    const accessibleLabel = useMemo(() => {
      if (ariaLabel) return ariaLabel;
      if (typeof children === "string") return children;
      // Try to extract text from ReactNode
      if (typeof children === "object" && children !== null) {
        if ("props" in children) {
          const childProps = (children as { props?: { children?: unknown } })
            .props;
          if (childProps?.children && typeof childProps.children === "string") {
            return childProps.children;
          }
        }
      }
      return undefined;
    }, [ariaLabel, children]);

    return (
      <span
        ref={ref}
        role="status"
        aria-label={accessibleLabel}
        className={classes}
        {...props}
      >
        {children}
      </span>
    );
  }),
);

Badge.displayName = "Badge";

export default Badge;
