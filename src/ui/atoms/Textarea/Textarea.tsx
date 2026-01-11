import type { TextareaHTMLAttributes } from "react";

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
export default function Textarea({
  error = false,
  resize = "vertical",
  className = "",
  ...props
}: Props) {
  const baseClasses = [
    "block",
    "w-full",
    "rounded",
    "px-large",
    "py-medium",
    "border",
    "text-base",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
  ];

  const resizeClasses: Record<NonNullable<Props["resize"]>, string> = {
    none: "resize-none",
    both: "resize",
    horizontal: "resize-x",
    vertical: "resize-y",
  };

  const errorClasses = error
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-indigo-500";

  const classes = [
    ...baseClasses,
    resizeClasses[resize],
    errorClasses,
    className,
  ].filter(Boolean).join(" ");

  return (
    <textarea
      className={classes}
      aria-invalid={error}
      aria-describedby={error && props.id ? `${props.id}-error` : undefined}
      {...props}
    />
  );
}
