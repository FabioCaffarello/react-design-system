import type { HTMLAttributes, ReactNode } from "react";
import { getSpacingClass } from "../../tokens/spacing";
import { cn } from "../../utils";

export interface FilterChipsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Optional group label rendered as neutral text at the left of the
   * chips (e.g. "Filtros"). Deliberately NOT a `<legend>`/`<fieldset>`
   * pair — FilterChips groups navigation/selection chips, not form
   * controls, and fieldset semantics would imply a form that isn't
   * there. When `label` is a plain string it doubles as the group's
   * accessible name (see the aria-label contract in the component
   * JSDoc).
   */
  label?: ReactNode;
  /**
   * The chips. Typically `<Chip>` elements — including the
   * `<Chip asChild><Link/></Chip>` navigation form — but any inline
   * content composes.
   */
  children: ReactNode;
  /**
   * Whether chips wrap to new lines when they overflow the container
   * width. `true` (default) applies `flex-wrap` — the responsive
   * filter-bar behavior; `false` applies `flex-nowrap` and keeps
   * everything on one line (consumer owns overflow handling).
   * @default true
   */
  wrap?: boolean;
}

/**
 * `FilterChips` — groups `Chip`s into a labeled filter bar.
 *
 * The shell of every chip-based filter row: a `role="group"` container
 * with an optional neutral text label at the left and a flex run of
 * chips that wraps responsively by default. Purely presentational — the
 * interactive identity (select, navigate, remove) lives in each `Chip`
 * (`onClick`/`onRemove`, or `asChild` with a consumer `<Link>`), never
 * in this wrapper.
 *
 * ### Accessible name contract
 *
 * The container carries `role="group"` so assistive technology can
 * announce the chips as one named unit. The accessible name resolves in
 * this order:
 *
 * 1. An explicit `aria-label` OR `aria-labelledby` passed by the
 *    consumer always wins — when either is present, no name is derived
 *    from `label`, so the consumer's attribute is the only naming on the
 *    element (no redundant `aria-label` is left alongside an
 *    `aria-labelledby`).
 * 2. Otherwise, when `label` is a non-empty plain string, it is reused
 *    as the group's `aria-label` automatically.
 * 3. When `label` is a non-string `ReactNode` (or absent), no
 *    `aria-label` is derived — supply `aria-label`/`aria-labelledby`
 *    yourself if the group needs a name AT users can identify it by.
 *
 * ### Server-safe
 *
 * Pure presentation — no hooks, no event handlers on the DOM. Ships in
 * the `./server` entry. Consumer-supplied chips may themselves be
 * client components (`<Chip onRemove>`); React's RSC boundary handles
 * that normally, and the zero-JS path (`<Chip asChild><Link/></Chip>`)
 * stays fully server-rendered.
 *
 * @example
 * ```tsx
 * // Navigation filter bar — server-rendered, zero-JS-friendly.
 * <FilterChips label="Filtros">
 *   <Chip asChild selected>
 *     <Link href="?uf=SP" aria-current="page">UF: SP</Link>
 *   </Chip>
 *   <Chip asChild>
 *     <Link href="?partido=PT">Partido: PT</Link>
 *   </Chip>
 * </FilterChips>
 *
 * // Single-line variant (consumer owns horizontal overflow).
 * <FilterChips label="Período" wrap={false}>
 *   <Chip>2024</Chip>
 *   <Chip>2025</Chip>
 * </FilterChips>
 * ```
 */
export function FilterChips({
  label,
  children,
  wrap = true,
  className,
  ...props
}: FilterChipsProps) {
  // The string label doubles as the group's accessible name — but only
  // when the consumer supplies no naming of their own. An explicit
  // `aria-label` OR `aria-labelledby` (both spread onto the root below)
  // takes precedence; deriving a name alongside `aria-labelledby` would
  // leave a redundant `aria-label` on the element, so suppress it here
  // rather than relying on ARIA name-computation precedence to hide it.
  const hasConsumerName =
    props["aria-label"] != null || props["aria-labelledby"] != null;
  const derivedAriaLabel =
    !hasConsumerName && typeof label === "string" && label !== ""
      ? label
      : undefined;

  return (
    <div
      role="group"
      aria-label={derivedAriaLabel}
      className={cn(
        "flex items-center",
        wrap ? "flex-wrap" : "flex-nowrap",
        getSpacingClass("sm", "gap"),
        className,
      )}
      {...props}
    >
      {label ? (
        // shrink-0 keeps the label a stable leading unit: in the wrapping
        // flex run it must not be squeezed or mid-word-wrapped when the
        // chips overflow — it stays on one line and the chips wrap around it.
        <span className="shrink-0 text-fg-secondary text-sm">{label}</span>
      ) : null}
      {children}
    </div>
  );
}

export default FilterChips;
