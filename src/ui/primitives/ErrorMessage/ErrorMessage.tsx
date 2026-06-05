import type { HTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import { getTypographySize } from "../../tokens/typography";
import { getSpacingClass } from "../../tokens/spacing";
import { cn } from "../../utils";

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
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
}: ErrorMessageProps) {
  const baseClasses = [
    getSpacingClass("xs", "mt"),
    getTypographySize("bodySmall"),
    "text-fg-error",
    "flex",
    "items-center",
    getSpacingClass("xs", "gap"),
  ];

  const classes = cn(...baseClasses, className);

  return (
    <div role="alert" id={id} className={classes} aria-live="polite" {...props}>
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
