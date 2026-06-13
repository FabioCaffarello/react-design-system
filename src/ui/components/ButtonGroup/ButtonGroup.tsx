"use client";

import { type ReactNode, type HTMLAttributes } from "react";
import { getSpacingClass, getRadiusClass } from "../../tokens";
import { cn } from "../../utils";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  attached?: boolean;
}

/**
 * ButtonGroup Component
 *
 * A group of buttons displayed together. A component — composed from
 * `Button` primitives.
 *
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button>Left</Button>
 *   <Button>Middle</Button>
 *   <Button>Right</Button>
 * </ButtonGroup>
 * ```
 */
export default function ButtonGroup({
  children,
  orientation = "horizontal",
  size = "md",
  attached = false,
  className = "",
  ...props
}: ButtonGroupProps) {
  const orientationClasses = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  const spacingClasses = {
    sm: attached ? "" : getSpacingClass("xs", "gap"),
    md: attached ? "" : getSpacingClass("sm", "gap"),
    lg: attached ? "" : getSpacingClass("md", "gap"),
  };

  return (
    <div
      role="group"
      className={cn(
        "inline-flex",
        orientationClasses[orientation],
        spacingClasses[size],
        attached && getRadiusClass("md"),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
