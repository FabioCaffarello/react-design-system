"use client";

import { memo, useMemo } from "react";
import type { HTMLAttributes } from "react";
import { getColorClass } from "../../tokens/colors";
import { cn } from "../../utils";

export type SeparatorOrientation = "horizontal" | "vertical";
export type SeparatorVariant = "solid" | "dashed" | "dotted";

export interface SeparatorProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: SeparatorOrientation;
  variant?: SeparatorVariant;
}

/**
 * Separator Component
 *
 * A visual separator component for dividing content.
 * Follows Atomic Design principles as an Atom component.
 * Optimized with React.memo to prevent unnecessary re-renders.
 *
 * @example
 * ```tsx
 * <Separator />
 *
 * <Separator orientation="vertical" variant="dashed" />
 * ```
 */
const Separator = memo(function Separator({
  orientation = "horizontal",
  variant = "solid",
  className = "",
  ...props
}: SeparatorProps) {
  const classes = useMemo(() => {
    const baseClasses = [
      "border-0",
      getColorClass("neutral", "DEFAULT", "border"),
    ];

    const orientationClasses = {
      horizontal: "w-full border-t",
      vertical: "h-full border-l self-stretch",
    };

    const variantClasses = {
      solid: "border-solid",
      dashed: "border-dashed",
      dotted: "border-dotted",
    };

    return cn(
      ...baseClasses,
      orientationClasses[orientation],
      variantClasses[variant],
      className,
    );
  }, [orientation, variant, className]);

  if (orientation === "vertical") {
    return (
      <div
        className={classes}
        role="separator"
        aria-orientation="vertical"
        {...(props as HTMLAttributes<HTMLDivElement>)}
      />
    );
  }

  return (
    <hr
      className={classes}
      role="separator"
      aria-orientation="horizontal"
      {...props}
    />
  );
});

Separator.displayName = "Separator";

export default Separator;
