"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../../primitives";
import { Text } from "../../primitives";
import { cn } from "../../utils";
import {
  getSpacingClass,
  getColorClass,
  getTypographySize,
  getTypographyWeightFromFontWeight,
} from "../../tokens";

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
  const classes = cn(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "text-center",
    getSpacingClass("xl", "py"),
    getSpacingClass("base", "px"),
    className,
  );

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
        <div className={cn(getSpacingClass("base", "mb"))} aria-hidden="true">
          {illustration}
        </div>
      )}

      <Text
        as="h3"
        className={cn(
          getTypographySize("h4"),
          getTypographyWeightFromFontWeight("semibold"),
          getColorClass("neutral", "dark", "text"),
          getSpacingClass("sm", "mb"),
        )}
      >
        {title}
      </Text>

      <Text
        as="p"
        className={cn(
          getTypographySize("bodySmall"),
          getColorClass("neutral", "DEFAULT", "text"),
          getSpacingClass("md", "mb"),
          "max-w-sm", // Max width utility - justified as layout constraint
        )}
      >
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
