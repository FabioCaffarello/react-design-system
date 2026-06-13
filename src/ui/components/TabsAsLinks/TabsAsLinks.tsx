import { forwardRef } from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn, cva } from "../../utils";
import {
  getRadiusClass,
  getSpacingClass,
  getTypographySize,
} from "../../tokens";

// Ambient declaration so the dev-only warn typechecks without pulling
// @types/node in; the `typeof process` guard keeps it safe in browser/edge
// runtimes. Mirrors Card.tsx / HeroSection.tsx.
declare const process: { env: { NODE_ENV?: string } };

/** Visual hierarchy: `default` = primary tab bar, `sub` = nested sub-tabs. */
export type TabsAsLinksVariant = "default" | "sub";

/** A single navigation tab. The active state is decided by the caller. */
export interface TabAsLink {
  /** Visible tab label. */
  label: ReactNode;
  /** Destination URL — pre-computed by the caller. */
  href: string;
  /**
   * Whether this tab is the current one. The caller derives it (from
   * `pathname` / `searchParams`); the component does no detection of its own.
   * @default false
   */
  active?: boolean;
  /** Optional leading icon (decorative — rendered `aria-hidden`). */
  icon?: ReactNode;
  /** Optional trailing count (e.g. number of items behind the tab). */
  count?: number;
}

export interface TabsAsLinksProps extends HTMLAttributes<HTMLElement> {
  /** The tabs to render, in order. */
  items: TabAsLink[];
  /**
   * Visual hierarchy.
   * @default 'default'
   */
  variant?: TabsAsLinksVariant;
  /**
   * Element/component each tab renders as. Defaults to a plain `<a>` (zero
   * JS, works without hydration). Pass a router link — e.g. Next's `Link` —
   * to keep client-side navigation/prefetch: `linkComponent={Link}`. It
   * receives `href`, `className`, `aria-current`, and `children`.
   * @default 'a'
   */
  linkComponent?: ElementType;
  /** Additional CSS classes merged onto the root `<nav>`. */
  className?: string;
}

/**
 * Tab-bar container (the `<nav>` track). Only the gap and the track-line
 * weight differ between tiers; the active underline lives on each link.
 */
const navVariants = cva(cn("flex items-center", "border-b"), {
  variants: {
    variant: {
      default: cn("border-line-default", getSpacingClass("base", "gap-x")),
      sub: cn("border-line-muted", getSpacingClass("sm", "gap-x")),
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

/**
 * A single tab link. The 2px bottom border with `-mb-px` overlaps the 1px
 * `<nav>` track so the active underline visually replaces the track segment
 * (the classic tab-bar look). `active` and `variant` are independent axes.
 */
const tabLinkVariants = cva(
  cn(
    "relative -mb-px inline-flex items-center",
    getSpacingClass("xs", "gap-x"),
    "border-b-2 border-transparent",
    "transition-colors",
    "focus:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-line-focus",
    "focus-visible:ring-offset-2",
    getRadiusClass("sm"),
  ),
  {
    variants: {
      variant: {
        default: cn(
          getSpacingClass("sm", "px"),
          getSpacingClass("sm", "py"),
          getTypographySize("body"),
        ),
        sub: cn(
          getSpacingClass("sm", "px"),
          getSpacingClass("xs", "py"),
          getTypographySize("bodySmall"),
        ),
      },
      active: {
        true: cn("border-line-brand", "text-fg-brand-emphasis", "font-medium"),
        false: cn(
          "text-fg-secondary",
          "hover:text-fg-primary",
          "hover:border-line-muted",
        ),
      },
    },
    compoundVariants: [
      // Sub-tabs sit lower in the hierarchy: lighter resting foreground.
      {
        variant: "sub",
        active: false,
        class: cn("text-fg-tertiary", "hover:text-fg-secondary"),
      },
    ],
    defaultVariants: {
      variant: "default",
      active: false,
    },
  },
);

const countClasses = cn(
  "inline-flex items-center justify-center",
  getRadiusClass("full"),
  getSpacingClass("xs", "px"),
  "bg-surface-muted text-fg-secondary text-xs",
);

/**
 * `TabsAsLinks` — tabs rendered as **navigation links**, with the active tab
 * decided by the caller (from the URL), not by interactive state.
 *
 * This is the server-safe counterpart to the interactive `Tabs` widget. Use
 * it for tab bars whose selection lives in the URL (`?tab=`, `/section`) so
 * they work without JavaScript and survive a shared link. Because each tab is
 * a real link to a distinct destination, the component uses the **navigation**
 * pattern — a named `<nav>` landmark with `aria-current="page"` on the active
 * link — NOT the `role="tab"` widget pattern (which would promise arrow-key
 * semantics that links don't have).
 *
 * ### Accessible name
 *
 * Renders a `<nav>` landmark, which must be named so screen-reader users can
 * tell multiple tab bars apart. Pass `aria-label` (e.g. `"Painel"`) or
 * `aria-labelledby`. With neither, a dev-only warning fires (the landmark
 * still renders, just anonymously).
 *
 * ### Server-safe
 *
 * No hooks, no event handlers on the DOM — pure presentation. Ships in the
 * `./server` entry. Defaults to a plain `<a>`; pass `linkComponent={Link}` to
 * keep a router's client-side navigation, which crosses the RSC boundary as a
 * client reference.
 *
 * @example
 * ```tsx
 * // Next App Router — active derived from searchParams in a Server Component
 * <TabsAsLinks
 *   aria-label="Painel"
 *   linkComponent={Link}
 *   items={[
 *     { label: "Visão geral", href: "/painel?tab=overview", active: tab === "overview" },
 *     { label: "Alertas", href: "/painel?tab=alerts", active: tab === "alerts", count: 3 },
 *   ]}
 * />
 * ```
 */
const TabsAsLinks = forwardRef<HTMLElement, TabsAsLinksProps>(
  function TabsAsLinks(
    {
      items,
      variant = "default",
      linkComponent,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref,
  ) {
    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV !== "production" &&
      !ariaLabel &&
      !ariaLabelledBy
    ) {
      console.warn(
        "[TabsAsLinks] renders a <nav> landmark and should have an " +
          'accessible name. Pass `aria-label` (e.g. "Painel") or ' +
          "`aria-labelledby` — multiple unnamed navs on a page are ambiguous " +
          "to screen readers.",
      );
    }

    const LinkComponent: ElementType = linkComponent ?? "a";

    return (
      <nav
        ref={ref}
        className={cn(navVariants({ variant }), className)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        {...rest}
      >
        {items.map((item, index) => (
          <LinkComponent
            key={item.href || index}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            data-active={item.active ? "true" : undefined}
            className={tabLinkVariants({ variant, active: !!item.active })}
          >
            {item.icon ? (
              <span aria-hidden="true" className="inline-flex shrink-0">
                {item.icon}
              </span>
            ) : null}
            <span>{item.label}</span>
            {item.count !== undefined ? (
              <span className={countClasses}>{item.count}</span>
            ) : null}
          </LinkComponent>
        ))}
      </nav>
    );
  },
);

TabsAsLinks.displayName = "TabsAsLinks";

export default TabsAsLinks;
