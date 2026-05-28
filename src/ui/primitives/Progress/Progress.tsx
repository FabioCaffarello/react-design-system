"use client";

import type { HTMLAttributes } from "react";
import { forwardRef } from "react";
import { getColorClass, getRadiusClass } from "../../tokens";
import { getSpacingClass } from "../../tokens/spacing";
import {
  getTypographySize,
  getTypographyWeight,
} from "../../tokens/typography";
import { cn, cva } from "../../utils";
import "./Progress.css";

export type ProgressVariant =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info";
export type ProgressSize = "sm" | "md" | "lg";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number; // 0-100, undefined for indeterminate
  max?: number; // Default 100
  variant?: ProgressVariant;
  size?: ProgressSize;
  showLabel?: boolean;
  label?: string;
  "aria-label"?: string;
}

/**
 * Progress Component
 *
 * A progress bar component for displaying progress or loading states.
 * Supports both determinate (with value) and indeterminate (without value) modes.
 * Fully accessible with ARIA attributes.
 *
 * @example
 * ```tsx
 * // Determinate progress
 * <Progress value={75} variant="primary" />
 *
 * // Indeterminate progress
 * <Progress variant="primary" />
 *
 * // With label
 * <Progress value={50} showLabel label="Uploading..." />
 * ```
 */
// Progress variants using CVA
const progressTrackVariants = cva("w-full", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    },
    variant: {
      primary: getColorClass("neutral", "light", "bg"),
      secondary: getColorClass("neutral", "light", "bg"),
      success: "bg-green-300",
      error: "bg-red-300",
      warning: "bg-yellow-300",
      info: "bg-blue-300",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

const progressBarVariants = cva("transition-all", {
  variants: {
    variant: {
      primary: "bg-surface-brand",
      secondary: "bg-surface-secondary",
      success: "bg-success",
      error: "bg-error",
      warning: "bg-warning",
      info: "bg-info",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value,
    max = 100,
    variant = "primary",
    size = "md",
    showLabel = false,
    label,
    "aria-label": ariaLabel,
    className = "",
    ...props
  },
  ref,
) {
  const isIndeterminate = value === undefined;
  const percentage = isIndeterminate
    ? undefined
    : Math.min(Math.max((value / max) * 100, 0), 100);

  const defaultAriaLabel =
    ariaLabel ||
    (isIndeterminate
      ? "Loading in progress"
      : `Progress: ${percentage?.toFixed(0)}%`);

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {showLabel && (label || !isIndeterminate) && (
        <div
          className={cn(
            "flex",
            "items-center",
            "justify-between",
            getSpacingClass("xs", "mb"),
          )}
        >
          {label && (
            <span
              className={cn(
                getTypographySize("bodySmall"),
                getTypographyWeight("label"),
                getColorClass("neutral", "dark", "text"),
              )}
            >
              {label}
            </span>
          )}
          {!isIndeterminate && percentage !== undefined && (
            <span
              className={cn(
                getTypographySize("bodySmall"),
                getColorClass("neutral", "DEFAULT", "text"),
              )}
            >
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={isIndeterminate ? undefined : 0}
        aria-valuemax={isIndeterminate ? undefined : max}
        aria-valuenow={isIndeterminate ? undefined : value}
        aria-label={defaultAriaLabel}
        aria-busy={isIndeterminate}
        className={cn(
          "relative",
          "w-full",
          "overflow-hidden",
          progressTrackVariants({ size, variant }),
          getRadiusClass("full"),
        )}
      >
        {isIndeterminate ? (
          <div
            className={cn(
              "absolute",
              "top-0",
              "left-0",
              "bottom-0",
              progressBarVariants({ variant }),
              getRadiusClass("full"),
              "motion-reduce:animate-none",
            )}
            style={{
              width: "30%",
              animation: "progress-indeterminate 1.5s ease-in-out infinite",
            }}
          />
        ) : (
          <div
            className={cn(
              "h-full",
              progressBarVariants({ variant }),
              getRadiusClass("full"),
              "transition-all",
              "duration-300",
              "ease-out",
            )}
            style={{
              width: `${percentage}%`,
            }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

export default Progress;
