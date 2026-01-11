import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
}

/**
 * Badge Component
 * 
 * A versatile badge component for displaying status, priority, and other labels.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error">Critical</Badge>
 * ```
 */
export default function Badge({ 
  variant = "neutral", 
  className = "",
  children,
  ...props 
}: Props) {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "px-2",
    "py-1",
    "rounded",
    "text-xs",
    "font-medium",
    "border",
  ];

  const variantClasses: Record<NonNullable<Props["variant"]>, string> = {
    success: "bg-green-100 text-green-800 border-green-500",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-500",
    error: "bg-red-100 text-red-800 border-red-500",
    info: "bg-blue-100 text-blue-800 border-blue-500",
    neutral: "bg-gray-100 text-gray-800 border-gray-500",
  };

  const classes = [
    ...baseClasses,
    variantClasses[variant as NonNullable<Props["variant"]>],
    className,
  ].filter(Boolean).join(" ");

  return (
    <span
      role="status"
      aria-label={typeof children === "string" ? children : undefined}
      className={classes}
      {...props}
    >
      {children}
    </span>
  );
}
