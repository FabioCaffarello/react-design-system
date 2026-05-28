import { forwardRef, memo, useMemo } from "react";
import type { TextareaHTMLAttributes } from "react";
import { getColorClass, getFocusColorClass } from "../../tokens/colors";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import { getTypographySize } from "../../tokens/typography";
import { cn } from "../../utils";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  resize?: "none" | "both" | "horizontal" | "vertical";
}

/**
 * Textarea Component
 *
 * A styled textarea component for longer text input.
 * Follows Atomic Design principles as an Atom component.
 *
 * @example
 * ```tsx
 * <Textarea
 *   placeholder="Enter description..."
 *   rows={4}
 * />
 * ```
 */
const Textarea = memo(
  forwardRef<HTMLTextAreaElement, Props>(function Textarea(
    { error = false, resize = "vertical", className = "", ...props },
    ref,
  ) {
    // Memoize focus ring colors
    const primaryFocusRing = useMemo(
      () => getFocusColorClass("primary", "DEFAULT", "border"),
      [],
    );

    const errorFocusRing = useMemo(
      () => getFocusColorClass("error", "DEFAULT", "border"),
      [],
    );

    const focusRingColor = useMemo(
      () =>
        error
          ? errorFocusRing.replace("focus:border-", "focus:ring-")
          : primaryFocusRing.replace("focus:border-", "focus:ring-"),
      [error, errorFocusRing, primaryFocusRing],
    );

    // Memoize resize classes
    const resizeClasses = useMemo<Record<NonNullable<Props["resize"]>, string>>(
      () => ({
        none: "resize-none",
        both: "resize",
        horizontal: "resize-x",
        vertical: "resize-y",
      }),
      [],
    );

    // Memoize classes
    const classes = useMemo(
      () =>
        cn(
          "block",
          "w-full",
          getRadiusClass("md"),
          getSpacingClass("base", "px"),
          getSpacingClass("md", "py"),
          "border",
          getTypographySize("body"),
          "focus:outline-none",
          "focus:ring-2",
          "focus:ring-offset-2",
          resizeClasses[resize],
          error
            ? cn(getColorClass("error", "DEFAULT", "border"), focusRingColor)
            : cn(getColorClass("neutral", "DEFAULT", "border"), focusRingColor),
          className,
        ),
      [resize, resizeClasses, error, focusRingColor, className],
    );

    // Memoize aria-describedby
    const ariaDescribedBy = useMemo(
      () => (error && props.id ? `${props.id}-error` : undefined),
      [error, props.id],
    );

    return (
      <textarea
        ref={ref}
        className={classes}
        aria-invalid={error}
        aria-describedby={ariaDescribedBy}
        {...props}
      />
    );
  }),
);

Textarea.displayName = "Textarea";

export default Textarea;
