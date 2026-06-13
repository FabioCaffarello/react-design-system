import { memo, forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
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

export interface BadgeProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "style"
> {
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
        class: cn("bg-surface-muted", "text-fg-primary", "border-line-default"),
      },
      {
        variant: "primary",
        style: "solid",
        class: cn(
          "bg-surface-brand-subtle",
          "text-fg-brand-emphasis",
          "border-line-brand",
        ),
      },
      {
        variant: "secondary",
        style: "solid",
        // bg-pink-300: secondary solid badge — no semantic equivalent
        // (would shift 2 shades to bg-surface-secondary). Kept literal until
        // secondary brand surface palette expands beyond DEFAULT.
        class: cn(
          "bg-pink-300",
          "text-fg-brand-secondary-emphasis",
          "border-line-secondary",
        ),
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
        class: cn("bg-transparent", "border-line-default", "text-fg-secondary"),
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
    const classes = cn(badgeVariants({ variant, size, style }), className);

    // Best-effort accessible name resolution: explicit aria-label wins;
    // string children become the label; single-wrapped string children
    // (e.g. <Badge><span>Active</span></Badge>) are unwrapped one level.
    // Otherwise undefined and the consumer is responsible for naming
    // the badge externally.
    let accessibleLabel: string | undefined;
    if (ariaLabel) {
      accessibleLabel = ariaLabel;
    } else if (typeof children === "string") {
      accessibleLabel = children;
    } else if (
      typeof children === "object" &&
      children !== null &&
      "props" in children
    ) {
      const childProps = (children as { props?: { children?: unknown } }).props;
      if (childProps?.children && typeof childProps.children === "string") {
        accessibleLabel = childProps.children;
      }
    }

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
