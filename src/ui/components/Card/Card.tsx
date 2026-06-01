"use client";

import { memo, useMemo, useCallback } from "react";
import type { HTMLAttributes } from "react";
import { cn, cva } from "../../utils";
import { getRadiusClass, getSpacingClass } from "../../tokens";

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
      "bg-surface-base",
      getRadiusClass("lg"),
      "border",
      "border-line-default",
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

  // ARIA interactivity is driven by `onClick` ONLY. `variant="hover"` is
  // a visual style (hover shadow + cursor hint via cardVariants) — not a
  // declaration that the card is clickable. The previous coupling made
  // any `variant="hover"` Card a `role="button" tabindex=0` outer, which
  // triggered axe `nested-interactive` whenever the consumer composed
  // Buttons inside (the WithActions story shape — `<Card variant="hover">`
  // with action buttons inside). Decoupling fixes that without changing
  // the visual behavior. Stories that want a clickable card already pass
  // `onClick` (see the InteractiveCard sites at lines 281 and 352).
  const isInteractive = useMemo(() => onClick !== undefined, [onClick]);
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
