/**
 * Design Tokens Index
 *
 * Centralized exports for all design tokens.
 *
 * @brand AIppin
 * @version 2.0.0
 */

// Colors - New modular system
export * from "./colors/index";

// Colors - Legacy exports for backward compatibility
export {
  COLOR_TOKENS,
  COLOR_TOKENS_LIGHT,
  COLOR_TOKENS_DARK,
  getColor,
  getColorClass,
  getHoverColorClass,
  getFocusColorClass,
  getFocusRingClass,
} from "./colors";

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

// Gradients
export * from "./gradients";
export { GRADIENT_TOKENS, getGradient, getGradientClass } from "./gradients";

// Sidebar (specific tokens)
export * from "./sidebar";
export { SIDEBAR_TOKENS, getNestedIndentClass } from "./sidebar";

// Tokens Factory
export * from "./tokens.factory";
export {
  TokensFactory,
  defaultTokensFactory,
  createTokenSet,
} from "./tokens.factory";
