import type { LabelHTMLAttributes } from "react";

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
export default function Label({
  variant = "default",
  className = "",
  children,
  ...props
}: Props) {
  const baseClasses = [
    "block",
    "text-sm",
    "font-medium",
    "text-gray-700",
  ];

  const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
    default: "",
    required: "after:content-['*'] after:ml-0.5 after:text-red-500",
    optional: "after:content-['(optional)'] after:ml-1 after:text-gray-400 after:font-normal",
  };

  const classes = [
    ...baseClasses,
    variantClasses[variant],
    className,
  ].filter(Boolean).join(" ");

  return (
    <label className={classes} {...props}>
      {children}
    </label>
  );
}
