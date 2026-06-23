"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { Button } from "../../primitives";
import { Text } from "../../primitives";
import { cn } from "../../utils";
import {
  getSpacingClass,
  getTypographySize,
  getTypographyWeightFromFontWeight,
} from "../../tokens";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  /**
   * Descriptive message below the title.
   * Optional — several empty states have only a title (e.g. a section
   * that speaks for itself). When absent, the `aria-label` is just the
   * title; the `<p>` element is not rendered.
   */
  message?: string;
  /**
   * Action slot — accepts any ReactNode (link, button, custom CTA).
   * Takes priority over `actionLabel` + `onAction`.
   *
   * Use this prop when the action is a server-rendered `<a>` or
   * `next/link` (zero-JS route); the component renders it without
   * wrapping it in a client Button. When you need a callback-driven
   * button, use `actionLabel` + `onAction` instead (or pass
   * `<Button onClick={…}>…</Button>` here).
   *
   * @example
   * // Server-rendered link (zero-JS)
   * <EmptyState title="Sem resultados" action={<a href="/lista">Limpar filtros</a>} />
   */
  action?: ReactNode;
  /** @deprecated Prefer the `action` slot for new code. Still supported for backwards compat. */
  actionLabel?: string;
  onAction?: () => void;
  illustration?: ReactNode;
  variant?: "default" | "withAction" | "withIllustration";
}

/**
 * EmptyState Component
 *
 * A component for displaying empty states when there's no content to show.
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
  action,
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

  // `action` slot takes priority; fall back to the legacy actionLabel+onAction pair.
  const resolvedAction =
    action ??
    (actionLabel && onAction ? (
      <Button variant="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    ) : null);

  const showAction = !!resolvedAction || variant === "withAction";
  const showIllustration = variant === "withIllustration" || illustration;

  return (
    <div
      className={classes}
      role="status"
      aria-live="polite"
      aria-label={message ? `${title}. ${message}` : title}
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
          "text-fg-primary",
          getSpacingClass("sm", "mb"),
        )}
      >
        {title}
      </Text>

      {message && (
        <Text
          as="p"
          className={cn(
            getTypographySize("bodySmall"),
            "text-fg-secondary",
            getSpacingClass("md", "mb"),
            "max-w-sm", // Max width utility - justified as layout constraint
          )}
        >
          {message}
        </Text>
      )}

      {showAction && resolvedAction}
    </div>
  );
}
