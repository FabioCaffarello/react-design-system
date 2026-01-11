import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "selected";
  padding?: "none" | "small" | "medium" | "large";
}

/**
 * Card Component
 * 
 * A versatile card component for displaying content in containers.
 * Follows Atomic Design principles as a Molecule component.
 * Can be used to replace BoxWrapper in many cases with more flexibility.
 * 
 * @example
 * ```tsx
 * <Card variant="hover" padding="large">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 * ```
 */
export default function Card({
  variant = "default",
  padding = "medium",
  className = "",
  children,
  ...props
}: Props) {
  const baseClasses = [
    "bg-white",
    "rounded-lg",
    "border",
    "border-gray-200",
    "shadow-sm",
  ];

  const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
    default: "",
    hover: "hover:shadow-md transition-shadow cursor-pointer",
    selected: "border-indigo-500 shadow-md",
  };

  const paddingClasses: Record<NonNullable<Props["padding"]>, string> = {
    none: "",
    small: "p-2",
    medium: "p-4",
    large: "p-6",
  };

  const classes = [
    ...baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
