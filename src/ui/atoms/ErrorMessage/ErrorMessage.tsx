import type { HTMLAttributes } from "react";

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
      <svg
        className="h-4 w-4 flex-shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}
