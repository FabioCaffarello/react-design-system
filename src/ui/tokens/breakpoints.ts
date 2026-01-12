/**
 * Breakpoint Tokens
 * 
 * Responsive breakpoints for consistent media queries.
 * Uses Factory Pattern for type-safe breakpoint creation.
 */

export type BreakpointName = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BreakpointToken {
  name: BreakpointName;
  minWidth: number;
  px: string;
  rem: string;
  tailwind: string;
}

/**
 * Breakpoint Token Factory
 * Creates breakpoint tokens with consistent values
 */
export class BreakpointTokenFactory {
  /**
   * Create breakpoint token
   */
  static create(name: BreakpointName): BreakpointToken {
    const breakpointMap: Record<BreakpointName, { minWidth: number; tailwind: string }> = {
      sm: { minWidth: 640, tailwind: 'sm' },
      md: { minWidth: 768, tailwind: 'md' },
      lg: { minWidth: 1024, tailwind: 'lg' },
      xl: { minWidth: 1280, tailwind: 'xl' },
      '2xl': { minWidth: 1536, tailwind: '2xl' },
    };

    const config = breakpointMap[name];
    return {
      name,
      minWidth: config.minWidth,
      px: `${config.minWidth}px`,
      rem: `${config.minWidth / 16}rem`,
      tailwind: config.tailwind,
    };
  }
}

/**
 * Pre-defined breakpoint tokens
 */
export const BREAKPOINT_TOKENS: Record<BreakpointName, BreakpointToken> = {
  sm: BreakpointTokenFactory.create('sm'),
  md: BreakpointTokenFactory.create('md'),
  lg: BreakpointTokenFactory.create('lg'),
  xl: BreakpointTokenFactory.create('xl'),
  '2xl': BreakpointTokenFactory.create('2xl'),
} as const;

/**
 * Helper function to get breakpoint token
 */
export function getBreakpoint(name: BreakpointName): BreakpointToken {
  return BREAKPOINT_TOKENS[name];
}

/**
 * Helper function to create media query string
 */
export function getMediaQuery(name: BreakpointName, direction: 'min' | 'max' = 'min'): string {
  const breakpoint = BREAKPOINT_TOKENS[name];
  const operator = direction === 'min' ? 'min-width' : 'max-width';
  return `@media (${operator}: ${breakpoint.px})`;
}
