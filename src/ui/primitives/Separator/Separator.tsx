import { memo } from "react";
import type { HTMLAttributes } from "react";
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
const separatorOrientationClasses = {
  horizontal: "w-full border-t",
  vertical: "h-full border-l self-stretch",
} as const;

const separatorVariantClasses = {
  solid: "border-solid",
  dashed: "border-dashed",
  dotted: "border-dotted",
} as const;

const Separator = memo(function Separator({
  orientation = "horizontal",
  variant = "solid",
  className = "",
  ...props
}: SeparatorProps) {
  const classes = cn(
    "border-0",
    "border-line-default",
    separatorOrientationClasses[orientation],
    separatorVariantClasses[variant],
    className,
  );

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
