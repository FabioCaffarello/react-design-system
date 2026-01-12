import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "list" | "circle";
  width?: string;
  height?: string;
  lines?: number;
}

/**
 * Skeleton Component
 * 
 * A skeleton loader component for displaying loading states.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <Skeleton variant="card" />
 * <Skeleton variant="text" lines={3} />
 * ```
 */
export default function Skeleton({
  variant = "text",
  width,
  height,
  lines = 1,
  className = "",
  'aria-label': ariaLabel,
  ...props
}: SkeletonProps) {
  const baseClasses = [
    "animate-pulse",
    "bg-gray-200",
    "rounded",
  ];

  const variantClasses: Record<NonNullable<SkeletonProps["variant"]>, string> = {
    text: "h-4",
    card: "h-32",
    list: "h-12",
    circle: "rounded-full",
  };

  const classes = [
    ...baseClasses,
    variantClasses[variant],
    className,
  ].filter(Boolean).join(" ");

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  const defaultAriaLabel = ariaLabel || `Loading ${variant} content`;

  if (variant === "text" && lines > 1) {
    return (
      <div
        className="space-y-2"
        role="status"
        aria-busy="true"
        aria-label={defaultAriaLabel}
        {...props}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={classes}
            style={index === lines - 1 ? { width: "75%" } : style}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={classes}
      style={style}
      role="status"
      aria-busy="true"
      aria-label={defaultAriaLabel}
      {...props}
    />
  );
}
