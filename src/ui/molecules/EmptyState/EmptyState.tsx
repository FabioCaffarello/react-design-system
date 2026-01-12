'use client';

import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../../atoms";
import { Text } from "../../atoms";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: ReactNode;
  variant?: "default" | "withAction" | "withIllustration";
}

/**
 * EmptyState Component
 * 
 * A component for displaying empty states when there's no content to show.
 * Follows Atomic Design principles as a Molecule component.
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   title="No epics yet"
 *   message="Get started by creating your first epic"
 *   actionLabel="Create Epic"
 *   onAction={() => router.push('/epics/new')}
 * />
 * ```
 */
export default function EmptyState({
  title,
  message,
  actionLabel,
  onAction,
  illustration,
  variant = "default",
  className = "",
  ...props
}: EmptyStateProps) {
  const baseClasses = [
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "text-center",
    "py-12",
    "px-4",
  ];

  const classes = [
    ...baseClasses,
    className,
  ].filter(Boolean).join(" ");

  const showAction = variant === "withAction" || (actionLabel && onAction);
  const showIllustration = variant === "withIllustration" || illustration;

  return (
    <div
      className={classes}
      role="status"
      aria-live="polite"
      aria-label={`${title}. ${message}`}
      {...props}
    >
      {showIllustration && illustration && (
        <div className="mb-4" aria-hidden="true">
          {illustration}
        </div>
      )}
      
      <Text as="h3" className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </Text>
      
      <Text as="p" className="text-sm text-gray-500 mb-6 max-w-sm">
        {message}
      </Text>
      
      {showAction && actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
