/**
 * Switch Design Tokens
 *
 * Component-scoped tokens for the Switch primitive. These dimensions are
 * anatomical to the control (track / thumb / on-state translation) and do
 * not belong in the global spacing scale — keeping them here prevents the
 * scale from being polluted with one-off values like w-9 / w-11 / w-14 /
 * h-7 that only ever make sense on a switch.
 *
 * Sizes mirror the SwitchSize variants ("sm" | "md" | "lg").
 */

export type SwitchSizeToken = "sm" | "md" | "lg";

export const SWITCH_TOKENS = {
  /**
   * Track (the rounded background bar).
   * w * h:
   *   sm — 36 × 20 px
   *   md — 44 × 24 px
   *   lg — 56 × 28 px
   */
  track: {
    sm: { w: "w-9", h: "h-5" },
    md: { w: "w-11", h: "h-6" },
    lg: { w: "w-14", h: "h-7" },
  },

  /**
   * Thumb (the circular knob).
   * w * h:
   *   sm — 16 × 16 px
   *   md — 20 × 20 px
   *   lg — 24 × 24 px
   */
  thumb: {
    sm: { w: "w-4", h: "h-4" },
    md: { w: "w-5", h: "h-5" },
    lg: { w: "w-6", h: "h-6" },
  },

  /**
   * Translation distance of the thumb when the switch is on. Matches the
   * track width minus the thumb width and border for visual symmetry.
   *   sm — 16 px
   *   md — 20 px
   *   lg — 28 px
   */
  translate: {
    sm: "translate-x-4",
    md: "translate-x-5",
    lg: "translate-x-7",
  },
} as const;

/**
 * Helper: returns the full set of classes for a given switch size.
 */
export function getSwitchClasses(size: SwitchSizeToken): {
  track: string;
  thumb: string;
  translate: string;
} {
  return {
    track: `${SWITCH_TOKENS.track[size].w} ${SWITCH_TOKENS.track[size].h}`,
    thumb: `${SWITCH_TOKENS.thumb[size].w} ${SWITCH_TOKENS.thumb[size].h}`,
    translate: SWITCH_TOKENS.translate[size],
  };
}
