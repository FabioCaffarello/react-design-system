/**
 * Light Theme Tokens
 *
 * Light theme color palette and tokens.
 */

import { COLOR_TOKENS_LIGHT } from "../colors";
import { SPACING_TOKENS } from "../spacing";
import { TYPOGRAPHY_TOKENS } from "../typography";
import { BREAKPOINT_TOKENS } from "../breakpoints";

export const LIGHT_THEME = {
  colors: COLOR_TOKENS_LIGHT,
  spacing: SPACING_TOKENS,
  typography: TYPOGRAPHY_TOKENS,
  breakpoints: BREAKPOINT_TOKENS,
  mode: "light" as const,
} as const;
