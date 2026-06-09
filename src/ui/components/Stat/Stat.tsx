import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils";
import { getSpacingClass } from "../../tokens/spacing";

export type StatTone = "neutral" | "success" | "warning" | "error";
export type StatAlign = "start" | "center";

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The metric value to display. Strings are rendered verbatim — formatting
   * (number locale, currency, units, relative time, etc.) is the consumer's
   * responsibility, not the design system's. Pass `null` or `undefined` to
   * render the empty-state placeholder (see "Empty state" below).
   */
  value: ReactNode;
  /**
   * Short metric label (e.g. "Votos", "Alinhamento"). Required for screen
   * reader context — the label describes what the value means.
   */
  label: string;
  /**
   * Optional third line of context below the value (e.g. "no banco",
   * "últimos 12 m", "+3% no mês"). The `tone` prop styles THIS line — see
   * `tone` for the contract.
   */
  hint?: ReactNode;
  /**
   * Optional icon rendered above the value (home-style stats use icons;
   * detail-page stats typically don't).
   */
  icon?: ReactNode;
  /**
   * Block alignment. `start` left-aligns label/value/hint (detail-page
   * style); `center` centers them (home-hero style).
   * @default 'start'
   */
  align?: StatAlign;
  /**
   * Semantic tone for the metric — `neutral` for plain stats, the others
   * for classified states (good/warning/bad).
   *
   * **Scope (contract).** Tone affects ONLY the `hint`, not the `value`,
   * `label`, or `icon`. The `value` always renders in `text-fg-primary`
   * regardless of tone; the `label` in `text-fg-secondary`; the `icon` in
   * `text-icon-default`. This is deliberate — a colored value would
   * compete with the label for attention and bias the reader's
   * interpretation of the metric. If a future requirement needs the
   * `value` (or icon) to inherit tone, that becomes a new prop or a
   * semver-bound default change, not a surprise expansion of `tone`.
   *
   * Tone maps directly to the semantic foreground tokens (no new
   * vocabulary): `neutral` → `text-fg-tertiary`, `success` →
   * `text-fg-success`, `warning` → `text-fg-warning`, `error` →
   * `text-fg-error`. See `.claude/rules/colors.md`.
   *
   * @default 'neutral'
   */
  tone?: StatTone;
}

const alignClasses: Record<StatAlign, string> = {
  start: "items-start text-left",
  center: "items-center text-center",
};

const toneHintClasses: Record<StatTone, string> = {
  neutral: "text-fg-tertiary",
  success: "text-fg-success",
  warning: "text-fg-warning",
  error: "text-fg-error",
};

/**
 * `Stat` — a single statistic block (icon? + value + label + hint?).
 *
 * Composes with `StatGroup` (1-px-divider strip or grid) but is also
 * valid standalone — a single `Stat` outside a group is a legitimate use
 * case for a hero metric.
 *
 * ### Empty state contract
 *
 * When `value` is `null` OR `undefined`, the component renders the
 * em-dash placeholder `—` (U+2014) with `aria-label="No data"` on its
 * wrapper. The label is intentionally hard-coded in English in this
 * version; a screen reader announcing "No data" in an otherwise
 * Portuguese app is a known inconsistency accepted for now — if i18n
 * becomes a requirement, an `emptyLabel?: string` prop will be added in
 * a follow-up PR (semver-safe addition).
 *
 * Other falsy values — `0`, `""`, `false`, an empty fragment — are
 * **legitimate values** and render as-is. The empty trigger is only
 * `null`/`undefined`, because `0` (count = zero) is meaningful data that
 * the consumer would not want masked.
 *
 * ### Server-safe
 *
 * Pure presentation — no hooks, no event handlers on the DOM. Ships in
 * the `./server` entry alongside `StatGroup`. Consumer-supplied `icon`
 * may itself be a client component; React's RSC boundary handles that
 * normally.
 *
 * @example
 * ```tsx
 * // Home-style (centered, with icon)
 * <Stat
 *   icon={<Users size={20} aria-hidden="true" />}
 *   value="9,4 mil"
 *   label="Parlamentares"
 *   align="center"
 * />
 *
 * // Detail-page-style (start-aligned, with hint)
 * <Stat
 *   value="87%"
 *   label="Alinhamento"
 *   hint="últimos 12 meses"
 *   tone="success"
 * />
 * ```
 */
export function Stat({
  value,
  label,
  hint,
  icon,
  align = "start",
  tone = "neutral",
  className,
  ...props
}: StatProps) {
  const isEmpty = value === null || value === undefined;

  return (
    <div
      className={cn(
        "bg-surface-base flex-1 flex flex-col",
        getSpacingClass("base", "p"),
        getSpacingClass("xs", "gap-y"),
        alignClasses[align],
        className,
      )}
      {...props}
    >
      {icon ? (
        <span className="text-icon-default inline-flex">{icon}</span>
      ) : null}
      {isEmpty ? (
        <span
          aria-label="No data"
          className="text-fg-tertiary text-2xl font-semibold leading-tight"
        >
          —
        </span>
      ) : (
        <span className="text-fg-primary text-2xl font-semibold leading-tight">
          {value}
        </span>
      )}
      <span className="text-fg-secondary text-sm">{label}</span>
      {hint ? (
        <span className={cn("text-xs", toneHintClasses[tone])}>{hint}</span>
      ) : null}
    </div>
  );
}

export default Stat;
