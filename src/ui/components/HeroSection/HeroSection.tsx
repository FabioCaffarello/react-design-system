import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
// Concrete-source-file import (NOT the `../../primitives` barrel): the barrel
// re-exports client primitives like Input (useMemo), which would taint the
// static server-safe analysis of this module and bar it from `./server`.
// See issue #178 in `.claude/rules/server-entry.md` for the worked example.
import Text from "../../primitives/Text/Text";
import { cn, cva } from "../../utils";
import { getSpacingClass } from "../../tokens/spacing";

// Ambient declaration so the dev-only warn typechecks without pulling
// @types/node into the app tsconfig; the `typeof process` guard keeps the
// branch safe in browser/edge runtimes where `process` doesn't exist. At
// runtime the consumer's bundler replaces `process.env.NODE_ENV` with a
// literal. Mirrors the precedent in Card.tsx / Button.tsx.
declare const process: { env: { NODE_ENV?: string } };

/**
 * Visual treatment of the hero surface.
 *
 * - `plain` — no decorative background; the hero is text + padding on
 *   whatever surface it sits on.
 * - `gradient` — a soft brand→secondary wash (theme-aware, see
 *   `utilities/gradients.css`).
 * - `gradient-glow` — the same wash plus a brand-colored outer glow for
 *   top-of-funnel emphasis (landing / home).
 */
export type HeroSectionVariant = "plain" | "gradient" | "gradient-glow";

/** Block alignment of the hero content. */
export type HeroSectionAlign = "start" | "center";

export interface HeroSectionProps
  // `title` is omitted from the inherited DOM attributes because the native
  // `title` attribute is typed `string`, which is incompatible with our
  // `ReactNode` title slot. Everything else (id, aria-*, data-*, className)
  // still flows through to the root <section>.
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Eyebrow / kicker above the title (rendered uppercase, brand-colored). */
  kicker?: ReactNode;
  /**
   * The hero title. Rendered as the section's `<h1>`. **Required.**
   *
   * When `title` is a plain string it also becomes the accessible name of
   * the hero `<section>` landmark (the FilterChips `label` pattern). When it
   * is a non-string `ReactNode`, supply `aria-label` or `aria-labelledby`
   * yourself — otherwise the landmark renders without an accessible name and
   * the component emits a dev-only warning.
   */
  title: ReactNode;
  /** Supporting copy below the title (constrained to a readable measure). */
  description?: ReactNode;
  /** Call-to-action slot — typically one or more `<Button>`s. */
  actions?: ReactNode;
  /** Metrics slot — typically a `<StatGroup>` of `<Stat>`s. Spans full width. */
  kpis?: ReactNode;
  /** A line of metadata below everything else (low emphasis). */
  meta?: ReactNode;
  /**
   * Visual treatment of the hero surface.
   * @default 'plain'
   */
  variant?: HeroSectionVariant;
  /**
   * Block alignment of the content.
   * @default 'start'
   */
  align?: HeroSectionAlign;
  /** Additional CSS classes merged onto the root `<section>`. */
  className?: string;
}

/**
 * HeroSection variants (CVA).
 *
 * The decorative `variant` axis only swaps background / shadow; the `align`
 * axis only swaps text-alignment. Per-block flex alignment (centering the
 * text column, the actions row) is handled by the lookup records below,
 * because those classes land on child elements, not the root.
 */
const heroSectionVariants = cva(
  cn(
    "w-full flex flex-col",
    getSpacingClass("2xl", "py"), // 40px vertical breathing room
    getSpacingClass("lg", "px"), // 24px horizontal
    getSpacingClass("xl", "gap-y"), // 32px between major blocks
  ),
  {
    variants: {
      variant: {
        plain: "",
        gradient: "hero-gradient",
        "gradient-glow": cn("hero-gradient", "hero-glow"),
      },
      align: {
        start: "text-left",
        center: "text-center",
      },
    },
    defaultVariants: {
      variant: "plain",
      align: "start",
    },
  },
);

/** Cross-axis alignment for the inner text column (kicker/title/description). */
const blockItems: Record<HeroSectionAlign, string> = {
  start: "items-start",
  center: "items-center",
};

/** Main-axis alignment for the actions row. */
const actionsJustify: Record<HeroSectionAlign, string> = {
  start: "justify-start",
  center: "justify-center",
};

/**
 * `HeroSection` — top-of-page hero: kicker + title + description + actions +
 * kpis + meta, in three visual treatments (`plain` / `gradient` /
 * `gradient-glow`) and two alignments (`start` / `center`).
 *
 * Distinct from `PageHeader` (contextual navigation: breadcrumb + title +
 * actions). The hero is a page/landing **introduction** with a visual
 * identity and slots for KPIs and metadata.
 *
 * ### Slots
 *
 * Every slot except `title` is optional and collapses cleanly when absent —
 * no empty wrapper leaks into the DOM. `kpis` is an opaque slot: pass a
 * `<StatGroup>` (or any node); the consumer chooses the metric layout.
 *
 * ### Landmark & accessible name
 *
 * Renders as a `<section>`. A `<section>` is only exposed as a navigable
 * region when it has an accessible name, so the component derives one:
 * - a string `title` becomes the `aria-label` automatically;
 * - an explicit `aria-label` / `aria-labelledby` from the consumer always
 *   wins (and `aria-labelledby` suppresses the derived label to avoid a
 *   redundant name);
 * - a non-string `title` with no consumer-supplied name triggers a dev-only
 *   `console.warn` (dead-code-eliminated in production builds).
 *
 * ### Server-safe
 *
 * Pure presentation — no hooks, no event handlers on the DOM. Ships in the
 * `./server` entry. Interactive children supplied via `actions` (e.g.
 * `<Button onClick>`) cross the RSC boundary as client references normally.
 *
 * @example
 * ```tsx
 * <HeroSection
 *   variant="gradient-glow"
 *   align="center"
 *   kicker="Transparência"
 *   title="Acompanhe o Congresso em tempo real"
 *   description="Proposições, votações e parlamentares — tudo em um só lugar."
 *   actions={<Button variant="primary">Começar</Button>}
 *   kpis={
 *     <StatGroup layout="strip">
 *       <Stat value="9,4 mil" label="Parlamentares" align="center" />
 *       <Stat value="3,2 mil" label="Proposições" align="center" />
 *     </StatGroup>
 *   }
 *   meta="Atualizado diariamente"
 * />
 * ```
 */
const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  function HeroSection(
    {
      kicker,
      title,
      description,
      actions,
      kpis,
      meta,
      variant = "plain",
      align = "start",
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...rest
    },
    ref,
  ) {
    const hasExplicitName = ariaLabel != null || ariaLabelledBy != null;
    const resolvedAriaLabel =
      ariaLabel ?? (typeof title === "string" ? title : undefined);

    if (
      typeof process !== "undefined" &&
      process.env.NODE_ENV !== "production" &&
      !hasExplicitName &&
      typeof title !== "string"
    ) {
      console.warn(
        "[HeroSection] A non-string `title` was provided without `aria-label` " +
          "or `aria-labelledby`. The hero <section> landmark will have no " +
          "accessible name. Pass `aria-label`, or set `aria-labelledby` to " +
          "your title's id.",
      );
    }

    return (
      <section
        ref={ref}
        className={cn(heroSectionVariants({ variant, align }), className)}
        aria-label={resolvedAriaLabel}
        aria-labelledby={ariaLabelledBy}
        {...rest}
      >
        {/* Text column — tighter internal rhythm than the major-block gap. */}
        <div
          className={cn(
            "flex flex-col",
            getSpacingClass("md", "gap-y"),
            blockItems[align],
          )}
        >
          {kicker ? (
            <Text
              as="span"
              variant="caption"
              colorRole="primary"
              colorShade="DEFAULT"
              className="text-sm font-semibold tracking-wide uppercase"
            >
              {kicker}
            </Text>
          ) : null}

          <Text
            as="h1"
            variant="heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {title}
          </Text>

          {description ? (
            <Text
              as="p"
              variant="body"
              colorRole="neutral"
              colorShade="DEFAULT"
              className="max-w-2xl text-base leading-relaxed sm:text-lg"
            >
              {description}
            </Text>
          ) : null}
        </div>

        {actions ? (
          <div
            className={cn(
              "flex flex-wrap",
              getSpacingClass("sm", "gap"),
              actionsJustify[align],
            )}
          >
            {actions}
          </div>
        ) : null}

        {kpis ? <div className="w-full">{kpis}</div> : null}

        {meta ? (
          <Text
            as="p"
            variant="caption"
            colorRole="neutral"
            colorShade="light"
            className="text-sm"
          >
            {meta}
          </Text>
        ) : null}
      </section>
    );
  },
);

HeroSection.displayName = "HeroSection";

export default HeroSection;
