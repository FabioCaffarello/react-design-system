"use client";

import {
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { cn } from "../../utils/cn";
import { getSpacingClass } from "../../tokens/spacing";
import { getTypographyClasses } from "../../tokens/typography";
import { getRadiusClass } from "../../tokens/radius";

// Ambient declaration so the dev-only warn typechecks without pulling
// @types/node into the app tsconfig. Mirrors Card.tsx / HeroSection.tsx.
declare const process: { env: { NODE_ENV?: string } };

/** A single navigation item in the section nav. */
export interface SectionNavItem {
  /**
   * Matches the `id` prop on the corresponding `SectionCard` (or any
   * element with that id on the page). Used both as the anchor href
   * (`#${id}`) and as the scroll-spy target.
   */
  id: string;
  /** Visible label for the nav link. */
  label: string;
  /** Optional leading icon (decorative — pass `aria-hidden="true"`). */
  icon?: ReactNode;
}

export interface SectionNavProps extends HTMLAttributes<HTMLElement> {
  /** Ordered list of sections to navigate. */
  items: SectionNavItem[];
  /**
   * CSS `top` value for the sticky positioning — typically the height of
   * the page's sticky navbar (e.g. `"3.5rem"`, `"56px"`).
   * Applied via inline `style.top` to support design-token values.
   * @default "0"
   */
  stickyTop?: string;
  /**
   * Element/component each link renders as. Defaults to a plain `<a>`.
   * Pass a router link (e.g. Next.js `Link`) for prefetching:
   * `linkComponent={Link}`. Receives `href`, `className`, `aria-current`,
   * and `children` as props.
   * @default 'a'
   */
  linkComponent?: ElementType;
  /**
   * `IntersectionObserver` rootMargin forwarded to `useScrollSpy`.
   * Shrink the top edge to compensate for a sticky header:
   * e.g. `"-56px 0px -40% 0px"`.
   * @default "0px 0px -50% 0px"
   */
  rootMargin?: string;
  /** Additional CSS classes merged onto the root `<nav>`. */
  className?: string;
}

/**
 * `SectionNav` — sticky anchor navigation driven by `useScrollSpy`.
 *
 * Renders a vertical `<nav>` sidebar that highlights the anchor link
 * corresponding to the section currently visible in the viewport.
 * Designed for detail pages with multiple `SectionCard` sections.
 *
 * - Uses the RDS `useScrollSpy` hook — must be a Client Component.
 * - Marks the active link with `aria-current="true"`.
 * - Defaults to plain `<a>` links; pass `linkComponent={Link}` for
 *   client-side router navigation (Next.js, React Router, etc.).
 * - The `stickyTop` prop controls `top` in sticky mode — pair it with the
 *   same value as `SectionCard`'s `scrollOffset` so the scroll-spy fires
 *   at the right point.
 *
 * ### Usage
 *
 * ```tsx
 * // layout.tsx (Server Component)
 * <div className="flex gap-8">
 *   <aside className="hidden lg:block w-48 shrink-0">
 *     <SectionNav
 *       items={[
 *         { id: 'votos', label: 'Votações', icon: <VoteIcon aria-hidden="true" /> },
 *         { id: 'gastos', label: 'Gastos', icon: <WalletIcon aria-hidden="true" /> },
 *       ]}
 *       stickyTop="3.5rem"
 *     />
 *   </aside>
 *   <main>
 *     <SectionCard id="votos" title="Votações" scrollOffset="3.5rem">…</SectionCard>
 *     <SectionCard id="gastos" title="Gastos" scrollOffset="3.5rem">…</SectionCard>
 *   </main>
 * </div>
 * ```
 *
 * @example
 * ```tsx
 * <SectionNav
 *   items={sections.map(s => ({ id: s.id, label: s.navLabel, icon: s.navIcon }))}
 *   stickyTop="3.5rem"
 * />
 * ```
 */
export function SectionNav({
  items,
  stickyTop = "0",
  linkComponent,
  rootMargin,
  className,
  style,
  "aria-label": ariaLabel,
  ...props
}: SectionNavProps) {
  const ids = items.map((item) => item.id);
  const activeId = useScrollSpy(ids, rootMargin ? { rootMargin } : undefined);

  // Warn when the nav has no accessible name (mirrors HeroSection / Card pattern).
  if (
    typeof process !== "undefined" &&
    process.env.NODE_ENV !== "production" &&
    !ariaLabel &&
    !props["aria-labelledby"]
  ) {
    console.warn(
      "[SectionNav] A <nav> landmark requires an accessible name. " +
        'Pass aria-label (e.g. aria-label="Page sections") or aria-labelledby.',
    );
  }

  const mergedStyle: CSSProperties = {
    top: stickyTop,
    ...style,
  };

  const LinkEl: ElementType = linkComponent ?? "a";

  return (
    <nav
      aria-label={ariaLabel}
      style={mergedStyle}
      className={cn(
        "sticky flex flex-col",
        getSpacingClass("xs", "gap-y"),
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <LinkEl
            key={item.id}
            href={`#${item.id}`}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "flex items-center",
              getSpacingClass("sm", "gap-x"),
              getSpacingClass("xs", "px"),
              getSpacingClass("xs", "py"),
              getRadiusClass("sm"),
              getTypographyClasses("label"),
              "transition-colors",
              isActive
                ? "bg-surface-brand-muted text-fg-brand-emphasis"
                : "text-fg-secondary hover:bg-surface-hover hover:text-fg-primary",
            )}
          >
            {item.icon ? (
              <span
                className="shrink-0 inline-flex text-inherit"
                aria-hidden="true"
              >
                {item.icon}
              </span>
            ) : null}
            <span>{item.label}</span>
          </LinkEl>
        );
      })}
    </nav>
  );
}

export default SectionNav;
