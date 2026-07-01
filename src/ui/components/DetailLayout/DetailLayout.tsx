"use client";

import { type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import Accordion from "../Accordion/Accordion";
import { SectionCard } from "../SectionCard/SectionCard";
import { SectionNav } from "../SectionNav/SectionNav";
import { cn } from "../../utils/cn";
import { getSpacingClass } from "../../tokens/spacing";

/** A single content section in the detail page. */
export interface DetailSection {
  /**
   * Unique section id — used as anchor target (`href="#id"`),
   * `SectionCard` id, `SectionNav` item id, and `Accordion` item id.
   * Must be unique within the page.
   */
  id: string;
  /**
   * Label shown in the desktop sidebar nav and as the mobile Accordion
   * trigger title.
   */
  navLabel: string;
  /**
   * Optional icon shown in the desktop sidebar nav link.
   * Pass `aria-hidden="true"` on the icon element.
   */
  navIcon?: ReactNode;
  /**
   * Title rendered inside the `SectionCard` heading on desktop.
   * Defaults to `navLabel` when omitted.
   */
  title?: ReactNode;
  /** Optional subtitle rendered below the `SectionCard` title on desktop. */
  subtitle?: ReactNode;
  /**
   * Optional badge rendered after the `SectionCard` title on desktop.
   */
  badge?: ReactNode;
  /** Section body content. Rendered in both desktop and mobile views. */
  content: ReactNode;
}

export interface DetailLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Breadcrumb slot — rendered above the header on both breakpoints.
   */
  breadcrumb?: ReactNode;
  /**
   * Page header slot (e.g. `<PageHeader>`, a profile hero, a title block).
   */
  header?: ReactNode;
  /**
   * Stats / KPI slot rendered below the header on both breakpoints.
   */
  stats?: ReactNode;
  /**
   * Ordered list of content sections. Each section drives the sidebar nav
   * item, the desktop `SectionCard`, and the mobile `Accordion` item.
   */
  sections: DetailSection[];
  /**
   * IDs of sections that should render in a 2-column grid on desktop.
   * All other sections render full-width. Order in the page is determined
   * by `sections` array order, not this list.
   */
  desktopGridIds?: string[];
  /**
   * IDs of Accordion items open by default on mobile.
   * Passed to `<Accordion defaultOpen>`. Defaults to the first section.
   */
  defaultOpenMobile?: string[];
  /**
   * CSS `top` value for the sticky sidebar nav on desktop.
   * Also passed as `scrollOffset` to every `SectionCard`.
   * @default "0"
   */
  stickyNavTop?: string;
  /**
   * Accessible name for the desktop `SectionNav` landmark.
   * @default "Page sections"
   */
  navAriaLabel?: string;
}

/**
 * `DetailLayout` — responsive detail-page shell.
 *
 * Eliminates the triple-declaration problem on detail pages (parlamentar,
 * proposição, votação, etc.) where the same sections list had to be
 * declared in three places: the sidebar nav items, the Accordion items,
 * and the SectionCard stack. `DetailLayout` accepts a single `sections[]`
 * and derives all three views automatically.
 *
 * ### Desktop layout
 * - Left: sticky `SectionNav` sidebar (drives scroll-spy highlight).
 * - Right: stack of `SectionCard` sections (anchor targets).
 * - Pass `desktopGridIds` to render specific sections in a 2-column grid.
 *
 * ### Mobile layout
 * - The sidebar is hidden; sections collapse into a `multiple`-mode
 *   `Accordion`. `defaultOpenMobile` controls which panels start open
 *   (defaults to the first section).
 *
 * ### Server / client boundary
 * - `DetailLayout` itself is `"use client"` because it composes
 *   `SectionNav` (which calls `useScrollSpy`) and `Accordion` (which
 *   calls `useState`). Individual `content` slots may themselves be RSC.
 *
 * @example
 * ```tsx
 * <DetailLayout
 *   breadcrumb={<Breadcrumb items={[...]} />}
 *   header={<PerfilHeader nome="Fulano" />}
 *   stats={<StatGroup items={[...]} />}
 *   sections={[
 *     {
 *       id: 'votos',
 *       navLabel: 'Votações',
 *       navIcon: <VoteIcon aria-hidden="true" />,
 *       title: 'Votações recentes',
 *       subtitle: 'Últimos 30 dias',
 *       content: <VotacoesRecentes />,
 *     },
 *   ]}
 *   stickyNavTop="3.5rem"
 * />
 * ```
 */
export function DetailLayout({
  breadcrumb,
  header,
  stats,
  sections,
  desktopGridIds = [],
  defaultOpenMobile,
  stickyNavTop = "0",
  navAriaLabel = "Page sections",
  className,
  style,
  ...props
}: DetailLayoutProps) {
  const defaultOpen =
    defaultOpenMobile ?? (sections.length > 0 ? [sections[0].id] : []);

  const navItems = sections.map((s) => ({
    id: s.id,
    label: s.navLabel,
    icon: s.navIcon,
  }));

  const accordionItems = sections.map((s) => ({
    id: s.id,
    title: s.navLabel,
    content: s.content,
  }));

  const gridSet = new Set(desktopGridIds);

  const mergedStyle: CSSProperties = { ...style };

  return (
    <div
      className={cn("w-full", getSpacingClass("base", "gap-y"), className)}
      style={mergedStyle}
      {...props}
    >
      {/* Breadcrumb */}
      {breadcrumb ? <div>{breadcrumb}</div> : null}

      {/* Header */}
      {header ? <div>{header}</div> : null}

      {/* Stats */}
      {stats ? <div>{stats}</div> : null}

      {/* Mobile: Accordion (hidden on lg+) */}
      <div className="lg:hidden">
        <Accordion
          type="multiple"
          items={accordionItems}
          defaultOpen={defaultOpen}
        />
      </div>

      {/* Desktop: sidebar nav + section cards (hidden below lg) */}
      <div
        className={cn(
          "hidden lg:flex items-start",
          getSpacingClass("base", "gap-x"),
        )}
      >
        {/* Sticky sidebar nav */}
        <aside className="w-44 shrink-0">
          <SectionNav
            items={navItems}
            stickyTop={stickyNavTop}
            aria-label={navAriaLabel}
          />
        </aside>

        {/* Section card stack */}
        <div
          className={cn(
            "flex-1 min-w-0 flex flex-col",
            getSpacingClass("base", "gap-y"),
          )}
        >
          {sections.map((section) => {
            const isGrid = gridSet.has(section.id);
            return (
              <SectionCard
                key={section.id}
                id={section.id}
                title={section.title ?? section.navLabel}
                subtitle={section.subtitle}
                badge={section.badge}
                scrollOffset={stickyNavTop}
              >
                {isGrid ? (
                  <div
                    className={cn(
                      "grid grid-cols-2",
                      getSpacingClass("base", "gap"),
                    )}
                  >
                    {section.content}
                  </div>
                ) : (
                  section.content
                )}
              </SectionCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DetailLayout;
