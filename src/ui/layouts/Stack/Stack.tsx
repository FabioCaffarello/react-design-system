import React from "react";
import { cn } from "../../utils";
import { getSpacingClass } from "../../tokens/spacing";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Spacing between children
   * @default 'base'
   */
  spacing?: "xs" | "sm" | "md" | "base" | "lg" | "xl" | "2xl";
  /**
   * Alignment of children
   * @default 'stretch'
   */
  align?: "start" | "center" | "end" | "stretch";
  /**
   * Justification of children
   * @default 'start'
   */
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /**
   * Direction of stack
   * @default 'column'
   */
  direction?: "row" | "column";
}

/**
 * Stack component for vertical or horizontal layout with consistent spacing
 *
 * @example
 * ```tsx
 * <Stack spacing="md" align="center">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Stack>
 * ```
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      spacing = "base",
      align = "stretch",
      justify = "start",
      direction = "column",
      children,
      ...props
    },
    ref,
  ) => {
    const spacingClass =
      direction === "column"
        ? getSpacingClass(spacing, "gap-y")
        : getSpacingClass(spacing, "gap-x");

    const alignClasses = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };

    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction === "column" ? "flex-col" : "flex-row",
          spacingClass,
          alignClasses[align],
          justifyClasses[justify],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Stack.displayName = "Stack";
