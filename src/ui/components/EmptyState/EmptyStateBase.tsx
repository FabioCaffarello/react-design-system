import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
// Concrete source-file imports so the server analyser walk stays clean
// (the barrel ../../primitives transitively imports Input.tsx → useId()).
import Text from "../../primitives/Text/Text";
import { getSpacingClass } from "../../tokens/spacing";
import {
  getTypographySize,
  getTypographyWeightFromFontWeight,
} from "../../tokens/typography";
import { cn } from "../../utils";

export interface EmptyStateBaseProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  title: string;
  /**
   * Descriptive message below the title. Optional — several empty states
   * have only a title. When absent, `aria-label` is just the title and no
   * `<p>` element is rendered.
   */
  message?: string;
  /**
   * Optional decorative illustration (icon, SVG, image). Rendered
   * `aria-hidden` above the title.
   */
  illustration?: ReactNode;
  /**
   * Action slot — any ReactNode (link, button, custom CTA). Rendered
   * below the message (or title when message is absent).
   *
   * Use a plain `<a href>` or `next/link` here to keep the component
   * zero-JS in Server Components; the slot is passed through with no
   * wrapper or event handler added.
   *
   * @example
   * // Zero-JS link — Server Component safe
   * <EmptyStateBase
   *   title="Sem resultados"
   *   action={<a href="/">Limpar filtros</a>}
   * />
   */
  action?: ReactNode;
}

/**
 * EmptyStateBase — the **server-safe presentational core** of `EmptyState`
 * (issue #252 follow-up).
 *
 * It holds no React client state (no hooks, no `"use client"` directive), so
 * it can be imported from `@fabio.caffarello/react-design-system/server` and
 * rendered inside React Server Components and zero-JS routes.
 *
 * ### Trade-off vs `EmptyState`
 *
 * | Feature                      | EmptyStateBase       | EmptyState                  |
 * |------------------------------|----------------------|-----------------------------|
 * | `action` ReactNode slot      | ✅                   | ✅                          |
 * | `onAction` callback button   | ❌ (needs client JS) | ✅                          |
 * | `./server` exportable        | ✅                   | ❌ (barrel pulls Input/useId)|
 *
 * Use `EmptyState` when you need a client-driven callback button (`onAction`).
 * Use `EmptyStateBase` in Server Components where the CTA is a zero-JS link.
 */
const EmptyStateBase = forwardRef<HTMLDivElement, EmptyStateBaseProps>(
  function EmptyStateBase(
    { title, message, illustration, action, className = "", ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          "flex-col",
          "items-center",
          "justify-center",
          "text-center",
          getSpacingClass("xl", "py"),
          getSpacingClass("base", "px"),
          className,
        )}
        role="status"
        aria-live="polite"
        aria-label={message ? `${title}. ${message}` : title}
        {...props}
      >
        {illustration && (
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
              "max-w-sm",
            )}
          >
            {message}
          </Text>
        )}

        {action}
      </div>
    );
  },
);

EmptyStateBase.displayName = "EmptyStateBase";

export default EmptyStateBase;
