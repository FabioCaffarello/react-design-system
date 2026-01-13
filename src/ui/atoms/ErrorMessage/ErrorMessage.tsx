import type { HTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  message: string;
  id?: string;
}

/**
 * ErrorMessage Component
 * 
 * A component for displaying validation error messages.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <ErrorMessage message="This field is required" id="email-error" />
 * ```
 */
export default function ErrorMessage({
  message,
  id,
  className = "",
  ...props
}: Props) {
  const baseClasses = [
    "mt-1",
    "text-sm",
    "text-red-600",
    "flex",
    "items-center",
    "gap-1",
  ];

  const classes = [
    ...baseClasses,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      role="alert"
      id={id}
      className={classes}
      aria-live="polite"
      {...props}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
