import { type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import Card from "../Card/Card";
import { CardHeader } from "../Card/CardHeader";
import { CardTitle } from "../Card/CardTitle";
import { CardSubtitle } from "../Card/CardSubtitle";
import { CardBody } from "../Card/CardBody";

export interface SectionCardProps extends Omit<
  HTMLAttributes<HTMLElement>,
  // "title" conflicts: HTMLAttributes.title is string; ours is ReactNode.
  // "onClick" conflicts: Card.onClick is () => void (no args); SectionCard is
  // purely presentational and never needs a click handler.
  "id" | "title" | "onClick"
> {
  /**
   * Section anchor id. Used as the element `id` for anchor-link navigation
   * (`href="#votos"`) and as the stem for the internal `aria-labelledby`
   * pairing (`${id}-title`).
   */
  id: string;
  /**
   * Section title — required. Rendered as the Card title and doubles as
   * the section's accessible name via `aria-labelledby`.
   */
  title: ReactNode;
  /**
   * Optional subtitle rendered below the title inside the card header.
   */
  subtitle?: ReactNode;
  /**
   * Optional icon rendered before the title text. Passed through to
   * `Card.Title`'s `icon` slot.
   */
  icon?: ReactNode;
  /**
   * Optional badge rendered after the title text (e.g. a status badge or
   * count pill). Passed through to `Card.Title`'s `badge` slot.
   */
  badge?: ReactNode;
  /**
   * CSS `scroll-margin-top` value to compensate for a sticky navbar so
   * the section heading is not hidden behind it when the browser scrolls
   * to the anchor. Accepts any valid CSS length string: `"3.5rem"`,
   * `"56px"`, `"var(--nav-height)"`, etc.
   *
   * Applied via `style.scrollMarginTop` (inline) to support dynamic /
   * design-token values that cannot be expressed as static Tailwind
   * classes. This is the intentional mechanism — not an exception.
   *
   * @default "0"
   */
  scrollOffset?: string;
  children?: ReactNode;
}

/**
 * `SectionCard` — a semantic content section with scroll-spy support.
 *
 * Wraps the `Card` compound (`asSection` variant) with:
 * - an `id` for anchor navigation (`href="#section-id"`)
 * - `scroll-margin-top` so sticky navbars don't obscure the heading
 * - `icon` / `badge` slots on the header
 * - an auto-wired `aria-labelledby` pairing the section to its title
 *
 * Server-safe: no hooks, no event handlers on DOM elements.
 *
 * ### Usage with SectionNav
 *
 * ```tsx
 * // Server Component — renders the anchor sections
 * <SectionCard id="votos" title="Votações" icon={<VoteIcon />} scrollOffset="3.5rem">
 *   <VotacoesRecentes />
 * </SectionCard>
 *
 * // Client Component — highlights the active anchor via useScrollSpy
 * <SectionNav items={[{ id: 'votos', label: 'Votações' }]} stickyTop="3.5rem" />
 * ```
 *
 * @example
 * ```tsx
 * <SectionCard
 *   id="gastos"
 *   title="Gastos CEAP"
 *   subtitle="Últimos 30 dias"
 *   badge={<Badge variant="outline">L1</Badge>}
 *   scrollOffset="3.5rem"
 * >
 *   <GastoResumo />
 * </SectionCard>
 * ```
 */
export function SectionCard({
  id,
  title,
  subtitle,
  icon,
  badge,
  scrollOffset = "0",
  children,
  style,
  className,
  ...props
}: SectionCardProps) {
  const titleId = `${id}-title`;

  const mergedStyle: CSSProperties = {
    scrollMarginTop: scrollOffset,
    ...style,
  };

  return (
    <Card
      id={id}
      asSection
      aria-labelledby={titleId}
      style={mergedStyle}
      className={className}
      {...props}
    >
      <CardHeader>
        <CardTitle id={titleId} icon={icon} badge={badge}>
          {title}
        </CardTitle>
        {subtitle ? <CardSubtitle>{subtitle}</CardSubtitle> : null}
      </CardHeader>
      {children !== undefined ? <CardBody>{children}</CardBody> : null}
    </Card>
  );
}

export default SectionCard;
