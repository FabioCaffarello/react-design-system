"use client";

import { memo, useMemo, useCallback } from "react";
import type { HTMLAttributes } from "react";
import { cn, cva } from "../../utils";
import { getColorClass, getRadiusClass, getSpacingClass } from "../../tokens";

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "selected";
  padding?: "none" | "small" | "medium" | "large";
  onClick?: () => void;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * Card Component
 *
 * A versatile card component for displaying content in containers.
 * Follows Atomic Design principles as a Molecule component.
 * Can be used to replace BoxWrapper in many cases with more flexibility.
 * Optimized with React.memo to prevent unnecessary re-renders.
 *
 * @example
 * ```tsx
 * <Card variant="hover" padding="large">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 * ```
 */
const Card = memo(function Card({
  variant = "default",
  padding = "medium",
  className = "",
  onClick,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  ...props
}: Props) {
  const cardVariants = cva(
    cn(
      "bg-white",
      getRadiusClass("lg"),
      "border",
      getColorClass("neutral", "DEFAULT", "border"),
      "shadow-sm",
    ),
    {
      variants: {
        variant: {
          default: "",
          hover: cn("hover:shadow-md", "transition-shadow", "cursor-pointer"),
          selected: cn("border-line-brand", "shadow-md"),
        },
        padding: {
          none: "",
          small: getSpacingClass("xs", "p"),
          medium: getSpacingClass("base", "p"),
          large: getSpacingClass("lg", "p"),
        },
      },
      defaultVariants: {
        variant: "default",
        padding: "medium",
      },
    },
  );

  const isInteractive = useMemo(
    () => onClick !== undefined || variant === "hover",
    [onClick, variant],
  );
  const role = isInteractive ? "button" : undefined;
  const tabIndex = isInteractive ? 0 : undefined;

  const classes = cn(cardVariants({ variant, padding }), className);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isInteractive && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick?.();
      }
    },
    [isInteractive, onClick],
  );

  return (
    <div
      className={classes}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
