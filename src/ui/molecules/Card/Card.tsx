import { memo, useMemo, useCallback } from 'react';
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "selected";
  padding?: "none" | "small" | "medium" | "large";
  onClick?: () => void;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/**
 * Card Component
 * 
 * A versatile card component for displaying content in containers.
 * Follows Atomic Design principles as a Molecule component.
 * Can be used to replace BoxWrapper in many cases with more flexibility.
 * Optimized with React.memo to prevent unnecessary re-renders.
 * 
 * @example
 * ```tsx
 * <Card variant="hover" padding="large">
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 * ```
 */
const Card = memo(function Card({
  variant = "default",
  padding = "medium",
  className = "",
  onClick,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
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

  const isInteractive = useMemo(() => 
    onClick !== undefined || variant === "hover",
    [onClick, variant]
  );
  const role = isInteractive ? "button" : undefined;
  const tabIndex = isInteractive ? 0 : undefined;

  const classes = useMemo(() => [
    ...baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    className,
  ].filter(Boolean).join(" "), [variant, padding, className]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.();
    }
  }, [isInteractive, onClick]);

  return (
    <div
      className={classes}
      role={role}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
