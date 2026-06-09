import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils";
import { getRadiusClass } from "../../tokens/radius";

export type StatGroupLayout = "strip" | "grid";
export type StatGroupCols = 2 | 3 | 4;

export interface StatGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * `strip` — single horizontal row, no wrap. Each `Stat` shares the row
   * width via `flex-1`. Use when you guarantee the horizontal space
   * (hero areas, wide dashboards). On narrow viewports the row does NOT
   * reflow — choose `grid` if you need responsive collapse.
   *
   * `grid` — multi-column grid that reflows. Always 2-up on mobile,
   * expands to `cols` columns at the `md` breakpoint (768 px) and up.
   * Five or more children spill to a second row with the divider lines
   * preserved.
   *
   * @default 'grid'
   */
  layout?: StatGroupLayout;
  /**
   * Desktop column count (≥ 768 px). Only effective in `layout="grid"`;
   * ignored in `layout="strip"`. Mobile is always 2 columns regardless.
   *
   * @default 4
   */
  cols?: StatGroupCols;
  children: ReactNode;
}

// Tailwind v4 generates `md:grid-cols-N` for N ∈ {2,3,4} statically from
// the literal class string. The map below ensures the strings exist
// verbatim in the source so JIT picks them up.
const gridColsMd: Record<StatGroupCols, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

/**
 * `StatGroup` — container for one or more `Stat` blocks with 1-px
 * dividers between them.
 *
 * ### Divider technique
 *
 * The container has `bg-line-default` and `gap-px` (1 px); each child
 * `Stat` carries its own `bg-surface-base`. The 1 px of gap exposes the
 * container's background as the divider line, while each cell masks its
 * own area with `bg-surface-base`. Works identically for the strip
 * layout (vertical dividers) and the grid layout (vertical AND
 * horizontal dividers, automatically, as the grid reflows). No separate
 * `Divider` component, no per-cell border logic.
 *
 * The outer ring is `border border-line-default` matching the gap color,
 * with `rounded-lg` and `overflow-hidden` clipping the inner cells to
 * the radius.
 *
 * ### Server-safe
 *
 * Pure presentation — no hooks, no event handlers on the DOM. Ships in
 * `./server` alongside `Stat`.
 *
 * @example
 * ```tsx
 * <StatGroup layout="strip">
 *   <Stat icon={<Users />} value="9,4 mil" label="Parlamentares" align="center" />
 *   <Stat icon={<FileText />} value="3,2 mil" label="Proposições" align="center" />
 *   <Stat icon={<Vote />} value="1,1 mil" label="Votações" align="center" />
 *   <Stat icon={<Clock />} value="há 18 dias" label="Última atualização" align="center" />
 * </StatGroup>
 *
 * <StatGroup layout="grid" cols={4}>
 *   <Stat value="87%" label="Alinhamento" hint="últimos 12 m" tone="success" />
 *   <Stat value={null} label="Sem orientação" hint="no período" />
 *   <Stat value="R$ 187.472,95" label="Gastos" hint="no mandato" />
 *   <Stat value="42" label="Votações" hint="no banco" />
 * </StatGroup>
 * ```
 */
export function StatGroup({
  layout = "grid",
  cols = 4,
  className,
  children,
  ...props
}: StatGroupProps) {
  const isGrid = layout === "grid";

  return (
    <div
      className={cn(
        "bg-line-default border border-line-default overflow-hidden gap-px",
        getRadiusClass("lg"),
        isGrid ? `grid grid-cols-2 ${gridColsMd[cols]}` : "flex",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default StatGroup;
