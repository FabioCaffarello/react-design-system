/**
 * Dark Theme Tokens
 * 
 * Dark theme color palette and tokens.
 */

import { COLOR_TOKENS_DARK } from '../colors';
import { SPACING_TOKENS } from '../spacing';
import { TYPOGRAPHY_TOKENS } from '../typography';
import { BREAKPOINT_TOKENS } from '../breakpoints';

export const DARK_THEME = {
  colors: COLOR_TOKENS_DARK,
  spacing: SPACING_TOKENS,
  typography: TYPOGRAPHY_TOKENS,
  breakpoints: BREAKPOINT_TOKENS,
  mode: 'dark' as const,
} as const;
