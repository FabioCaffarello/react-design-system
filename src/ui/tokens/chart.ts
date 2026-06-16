/**
 * Data-Visualization Categorical Palette (Okabe-Ito)
 *
 * Eight colorblind-safe categorical colors for chart series (parties, vote
 * types, ranges, …). This is a SEPARATE axis from the semantic feedback
 * colors: `success`/`warning`/`error`/`info` encode *state*, never
 * *category* — using `error` for "series 3" is semantically wrong and
 * destroys meaning. A categorical palette answers "which series is this",
 * and it must stay distinguishable under color-vision deficiency.
 *
 * The values are the canonical Okabe & Ito (2008) palette — the reference
 * categorical palette engineered to be distinguishable in deuteranopia,
 * protanopia, and tritanopia — with `black` swapped for a neutral gray so
 * the 8th series survives on a dark canvas. Light values are the canonical
 * tones; the dark theme lifts each toward higher luminance (hue preserved)
 * so every series clears the WCAG 1.4.11 graphical-object 3:1 contrast over
 * `surface-canvas` (slate-950). The CSS source of truth is
 * `src/styles/semantic/colors.css` (light) and `src/styles/themes/dark.css`
 * (dark, both blocks).
 *
 * On-WHITE caveat: orange/sky-blue/yellow/gray are below 3:1 against a white
 * canvas — an intrinsic property of Okabe-Ito's light hues. Fine for FILLS
 * (bars, areas, large marks); for thin strokes (lines, 1px borders) add a
 * stroke/outline or use a darker series first. Colorblind-safety (the point
 * of the palette) is preserved regardless.
 */

/** Number of distinct colors in the categorical palette. */
export const CHART_PALETTE_SIZE = 8 as const;

/** 1-based position within the categorical palette. */
export type ChartColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ChartColorToken {
  /** 1-based palette position (matches the `--color-chart-N` token). */
  index: ChartColorIndex;
  /** Okabe-Ito hue name — use for legends / documentation. */
  name: string;
  /** Theme-aware CSS reference, e.g. `"var(--color-chart-1)"`. */
  var: string;
  /** Tailwind background class, e.g. `"bg-chart-1"`. */
  bg: string;
  /** Tailwind text class, e.g. `"text-chart-1"`. */
  text: string;
}

/**
 * Palette metadata in canonical order. The actual color values live in CSS
 * (theme-aware); these tokens carry the references and human-readable names.
 */
export const CHART_PALETTE_TOKENS: readonly ChartColorToken[] = [
  {
    index: 1,
    name: "Orange",
    var: "var(--color-chart-1)",
    bg: "bg-chart-1",
    text: "text-chart-1",
  },
  {
    index: 2,
    name: "Sky blue",
    var: "var(--color-chart-2)",
    bg: "bg-chart-2",
    text: "text-chart-2",
  },
  {
    index: 3,
    name: "Bluish green",
    var: "var(--color-chart-3)",
    bg: "bg-chart-3",
    text: "text-chart-3",
  },
  {
    index: 4,
    name: "Vermillion",
    var: "var(--color-chart-4)",
    bg: "bg-chart-4",
    text: "text-chart-4",
  },
  {
    index: 5,
    name: "Blue",
    var: "var(--color-chart-5)",
    bg: "bg-chart-5",
    text: "text-chart-5",
  },
  {
    index: 6,
    name: "Reddish purple",
    var: "var(--color-chart-6)",
    bg: "bg-chart-6",
    text: "text-chart-6",
  },
  {
    index: 7,
    name: "Yellow",
    var: "var(--color-chart-7)",
    bg: "bg-chart-7",
    text: "text-chart-7",
  },
  {
    index: 8,
    name: "Gray",
    var: "var(--color-chart-8)",
    bg: "bg-chart-8",
    text: "text-chart-8",
  },
] as const;

/**
 * Resolve a chart series index to a theme-aware color reference.
 *
 * `seriesIndex` is **0-based** (built for `data.map((d, i) => …)`) and wraps
 * modulo {@link CHART_PALETTE_SIZE}, so a 10-series chart cycles back to the
 * first color rather than running out. Negative indices wrap correctly too.
 * The returned `var(--color-chart-N)` resolves per active theme (light/dark),
 * so charts re-tint automatically — pass it straight to a recharts
 * `fill`/`stroke` or an inline `style`.
 *
 * @example
 * ```tsx
 * import { getChartColor } from "@fabio.caffarello/react-design-system";
 *
 * {series.map((s, i) => (
 *   <Bar key={s.id} dataKey={s.id} fill={getChartColor(i)} />
 * ))}
 * ```
 *
 * @param seriesIndex - 0-based series position.
 * @returns A `var(--color-chart-N)` reference (theme-aware).
 */
export function getChartColor(seriesIndex: number): string {
  const n = Math.trunc(seriesIndex);
  const wrapped =
    ((n % CHART_PALETTE_SIZE) + CHART_PALETTE_SIZE) % CHART_PALETTE_SIZE;
  return `var(--color-chart-${wrapped + 1})`;
}

/**
 * Tailwind class variant of {@link getChartColor} for DOM elements (legend
 * dots, swatches) where a class is more convenient than an inline style.
 *
 * @param seriesIndex - 0-based series position (wraps modulo the palette).
 * @param property - `"bg"` (default) or `"text"`.
 * @returns A `bg-chart-N` / `text-chart-N` class string.
 */
export function getChartColorClass(
  seriesIndex: number,
  property: "bg" | "text" = "bg",
): string {
  const n = Math.trunc(seriesIndex);
  const wrapped =
    ((n % CHART_PALETTE_SIZE) + CHART_PALETTE_SIZE) % CHART_PALETTE_SIZE;
  return `${property}-chart-${wrapped + 1}`;
}
