/**
 * Design Tokens Index
 *
 * Centralized exports for all design tokens.
 *
 * @brand brasil-a-vera (default, overridable)
 * @version 2.0.0
 */

// Colors - canonical exports from the modular new system
export * from "./colors/index";

// Spacing
export * from "./spacing";
export { SPACING_TOKENS, getSpacing, getSpacingClass } from "./spacing";

// Typography
export * from "./typography";
export {
  TYPOGRAPHY_TOKENS,
  FONT_FAMILY_TOKENS,
  FONT_WEIGHT_TOKENS,
  getTypography,
  getTypographyClasses,
  getTypographySize,
  getTypographySizeFromFontSize,
  getTypographyWeight,
  getTypographyWeightFromFontWeight,
  getTypographyLineHeight,
} from "./typography";

// Shadows
export * from "./shadows";
export { SHADOW_TOKENS, getShadow, getShadowClass } from "./shadows";

// Radius
export * from "./radius";
export { RADIUS_TOKENS, getRadius, getRadiusClass } from "./radius";

// Borders
export * from "./borders";
export {
  BORDER_TOKENS,
  getBorder,
  getBorderWidthClass,
  getBorderStyleClass,
  getBorderClasses,
} from "./borders";

// Breakpoints
export * from "./breakpoints";
export { BREAKPOINT_TOKENS, getBreakpoint, getMediaQuery } from "./breakpoints";

// Animations
export * from "./animations";
export {
  ANIMATION_TOKENS,
  getAnimation,
  getAnimationClass,
  getTransitionClass,
} from "./animations";

// Z-Index
export * from "./z-index";
export { Z_INDEX_TOKENS, getZIndex, getZIndexClass } from "./z-index";

// Opacity
export * from "./opacity";
export { OPACITY_TOKENS, getOpacity, getOpacityClass } from "./opacity";

// Sidebar (specific tokens)
export * from "./sidebar";
export { SIDEBAR_TOKENS, getNestedIndentClass } from "./sidebar";

// Switch (component-scoped tokens)
export * from "./switch";
export { SWITCH_TOKENS, getSwitchClasses } from "./switch";
export type { SwitchSizeToken } from "./switch";

// Chart (data-visualization categorical palette — Okabe-Ito)
export * from "./chart";
export {
  CHART_PALETTE_SIZE,
  CHART_PALETTE_TOKENS,
  getChartColor,
  getChartColorClass,
} from "./chart";
export type { ChartColorIndex, ChartColorToken } from "./chart";
