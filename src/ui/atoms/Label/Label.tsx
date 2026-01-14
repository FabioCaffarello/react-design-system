import type { LabelHTMLAttributes } from "react";
import { forwardRef, memo, useMemo } from "react";
import { getTypographyClasses, getTypographySize, getTypographyWeight } from '../../tokens/typography';
import { getColorClass } from '../../tokens/colors';
import { getSpacingClass } from '../../tokens/spacing';
import { cn } from '../../utils';

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
const Label = memo(forwardRef<HTMLLabelElement, Props>(function Label({
  variant = "default",
  className = "",
  children,
  ...props
}, ref) {
  // Memoize base classes
  const baseClasses = useMemo(() => cn(
    "block",
    getTypographySize('label'),
    getTypographyWeight('label'),
    getColorClass('neutral', 'dark', 'text')
  ), []);

  // Memoize variant classes
  const variantClasses = useMemo<Record<NonNullable<Props["variant"]>, string>>(() => ({
    default: "",
    required: cn(
      "after:content-['*']",
      "after:ml-0.5", // xs spacing = 0.5 (2px)
      "after:text-red-500" // error DEFAULT color
    ),
    optional: cn(
      "after:content-['(optional)']",
      "after:ml-1", // xs spacing = 1 (4px) - note: test expects ml-1, not ml-0.5
      "after:text-gray-400", // neutral DEFAULT color
      "after:font-normal"
    ),
  }), []);

  // Memoize final classes
  const classes = useMemo(() => 
    cn(baseClasses, variantClasses[variant], className),
    [baseClasses, variantClasses, variant, className]
  );

  return (
    <label ref={ref} className={classes} {...props}>
      {children}
    </label>
  );
}));

Label.displayName = 'Label';

export default Label;
