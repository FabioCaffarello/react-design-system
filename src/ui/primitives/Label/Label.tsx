import type { LabelHTMLAttributes } from "react";
import { forwardRef, memo, useMemo } from "react";
import {
  getTypographySize,
  getTypographyWeight,
} from "../../tokens/typography";
import { getSpacingClass } from "../../tokens/spacing";
import { cn } from "../../utils";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  variant?: "default" | "required" | "optional";
  children: React.ReactNode;
}

/**
 * Label Component
 *
 * A styled label component for form inputs.
 * Follows Atomic Design principles as an Atom component.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email" variant="required">
 *   Email Address
 * </Label>
 * ```
 */
const Label = memo(
  forwardRef<HTMLLabelElement, Props>(function Label(
    { variant = "default", className = "", children, ...props },
    ref,
  ) {
    // Memoize base classes
    const baseClasses = useMemo(
      () =>
        cn(
          "block",
          getTypographySize("label"),
          getTypographyWeight("label"),
          "text-fg-primary",
        ),
      [],
    );

    // Memoize variant classes
    const variantClasses = useMemo<
      Record<NonNullable<Props["variant"]>, string>
    >(
      () => ({
        default: "",
        required: cn(
          "after:content-['*']",
          `after:${getSpacingClass("0.5", "ml")}`,
          "after:text-fg-error",
        ),
        optional: cn(
          "after:content-['(optional)']",
          `after:${getSpacingClass("xs", "ml")}`,
          "after:text-fg-tertiary",
          "after:font-normal",
        ),
      }),
      [],
    );

    // Memoize final classes
    const classes = useMemo(
      () => cn(baseClasses, variantClasses[variant], className),
      [baseClasses, variantClasses, variant, className],
    );

    return (
      <label ref={ref} className={classes} {...props}>
        {children}
      </label>
    );
  }),
);

Label.displayName = "Label";

export default Label;
