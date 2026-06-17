import { memo, forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import {
  getTypographySize,
  getTypographyWeight,
} from "../../tokens/typography";
import { cn, cva } from "../../utils";

/**
 * Semantic tone for a {@link DataBadge}. The status/brand members mirror the
 * `Badge` vocabulary (role, not tone) so the soft-wash treatment is shared
 * and already AA-verified; `dataviz` adds a CATEGORICAL member (a
 * reddish-purple wash for "category / analytical" data, the badge-facing
 * counterpart to the chart palette) that is intentionally NOT a status.
 * Map a consumer's tone names onto these roles: `default → neutral`,
 * `destructive → error`, `brand → primary`, `accent → dataviz` (the
 * data-viz purple — RDS `accent` is cyan, so the category tone is `dataviz`).
 */
export type DataBadgeTone =
  | "neutral"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "primary"
  | "secondary"
  | "dataviz";

export type DataBadgeSize = "sm" | "md";

export interface DataBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Primary datum — the value the badge is about (e.g. "L2", "Aprovada"). */
  label: ReactNode;
  /**
   * Provenance of the datum, rendered as a lesser-emphasis sub-label after
   * the label (e.g. "Câmara", "Portal Transparência"). Omitted when absent.
   */
  source?: ReactNode;
  /** Semantic tone (role-based color). Defaults to `neutral`. */
  tone?: DataBadgeTone;
  /** Optional decorative leading icon (rendered `aria-hidden`). */
  icon?: ReactNode;
  /** Size scale. Defaults to `md`. */
  size?: DataBadgeSize;
}

// Tone → soft-wash classes, mirroring Badge's already-AA-verified scale.
const dataBadgeVariants = cva(
  cn("inline-flex", "items-center", "border", getRadiusClass("md")),
  {
    variants: {
      tone: {
        neutral: cn(
          "bg-surface-muted",
          "text-fg-primary",
          "border-line-default",
        ),
        success: cn("bg-success-bg", "text-success-dark", "border-success"),
        warning: cn("bg-warning-bg", "text-warning-dark", "border-warning"),
        error: cn("bg-error-bg", "text-error-dark", "border-error"),
        info: cn("bg-info-bg", "text-info-dark", "border-info"),
        primary: cn(
          "bg-surface-brand-subtle",
          "text-fg-brand-emphasis",
          "border-line-brand",
        ),
        secondary: cn(
          "bg-surface-secondary-subtle",
          "text-fg-brand-secondary-emphasis",
          "border-line-secondary",
        ),
        // Categorical data-viz tone — fuchsia soft-wash, sibling to the
        // chart palette. Not a status; distinct from secondary (brand violet).
        dataviz: cn("bg-dataviz-bg", "text-dataviz-dark", "border-dataviz"),
      },
      size: {
        sm: cn(
          getSpacingClass("1.5", "px"),
          getSpacingClass("0.5", "py"),
          getSpacingClass("0.5", "gap"),
          "[&_svg]:size-3",
        ),
        md: cn(
          getSpacingClass("sm", "px"),
          getSpacingClass("0.5", "py"),
          getSpacingClass("xs", "gap"),
          "[&_svg]:size-3.5",
        ),
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

/**
 * DataBadge
 *
 * An inline metadata chip: a primary `label`, an optional lesser-emphasis
 * `source` sub-label (the datum's provenance), a semantic `tone`, and an
 * optional decorative `icon`. Built for transparency/data UIs where a value
 * must travel with where it came from ("L2 · Portal Transparência").
 *
 * Why a separate primitive and not `Badge`: `Badge` is a single-string
 * status label; `DataBadge` carries a value + its source as a structured
 * pair. The `source` is the differentiator — it has no slot in `Badge` /
 * `Chip` / `Info`.
 *
 * Accessibility: the visible text (label, then source) IS the accessible
 * name — the separator and any `icon` are `aria-hidden`. Hierarchy between
 * label and source is conveyed by size + weight, never by dropping the
 * source below its tone's AA-safe text color. The root is a plain inline
 * `<span>` with no live-region role (metadata is static, not announced);
 * pass `role` / `aria-label` via props if a grouping role is wanted.
 *
 * Server-safe: no hooks, no client APIs, no DOM handlers of its own — ships
 * from the `./server` entry.
 *
 * @example
 * ```tsx
 * <DataBadge label="L2" source="Portal Transparência" tone="warning" />
 * <DataBadge label="Aprovada" tone="success" />
 * ```
 */
const DataBadge = memo(
  forwardRef<HTMLSpanElement, DataBadgeProps>(function DataBadge(
    {
      label,
      source,
      tone = "neutral",
      size = "md",
      icon,
      className = "",
      ...rest
    },
    ref,
  ) {
    const hasSource = source !== undefined && source !== null && source !== "";
    // Label is the larger/heavier tier; source is one size smaller and a
    // lighter weight. Both keep the tone's AA-safe text color — hierarchy
    // comes from size + weight, not from reducing contrast.
    const labelSize = size === "sm" ? "caption" : "bodySmall";

    return (
      <span
        ref={ref}
        className={cn(dataBadgeVariants({ tone, size }), className)}
        {...rest}
      >
        {icon ? (
          <span
            className="inline-flex shrink-0 items-center"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
        <span
          className={cn(
            getTypographySize(labelSize),
            getTypographyWeight("label"),
          )}
        >
          {label}
        </span>
        {hasSource ? (
          <>
            <span aria-hidden="true" className={getTypographySize("caption")}>
              ·
            </span>
            <span
              className={cn(
                getTypographySize("caption"),
                getTypographyWeight("caption"),
              )}
            >
              {source}
            </span>
          </>
        ) : null}
      </span>
    );
  }),
);

DataBadge.displayName = "DataBadge";

export default DataBadge;
