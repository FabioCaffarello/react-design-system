/**
 * Border Tokens
 * 
 * Centralized border system for consistent borders and dividers.
 * Uses Factory Pattern for type-safe token creation.
 */

export type BorderWidth = 'none' | 'thin' | 'base' | 'medium' | 'thick';
export type BorderStyle = 'solid' | 'dashed' | 'dotted';

export interface BorderToken {
  width: {
    value: number;
    px: string;
    tailwind: string;
  };
  style: BorderStyle;
  description: string;
}

/**
 * Border Token Factory
 * Creates border tokens with consistent values
 */
export class BorderTokenFactory {
  /**
   * Create a border width token
   */
  static createWidth(width: BorderWidth): BorderToken['width'] {
    const widthMap: Record<BorderWidth, { px: number; tailwind: string }> = {
      none: {
        px: 0,
        tailwind: 'border-0',
      },
      thin: {
        px: 1,
        tailwind: 'border',
      },
      base: {
        px: 1,
        tailwind: 'border',
      },
      medium: {
        px: 2,
        tailwind: 'border-2',
      },
      thick: {
        px: 4,
        tailwind: 'border-4',
      },
    };

    const config = widthMap[width];
    return {
      value: config.px,
      px: `${config.px}px`,
      tailwind: config.tailwind,
    };
  }

  /**
   * Create a complete border token
   */
  static create(width: BorderWidth, style: BorderStyle = 'solid'): BorderToken {
    return {
      width: this.createWidth(width),
      style,
      description: `${width} ${style} border`,
    };
  }
}

/**
 * Pre-defined border tokens
 */
export const BORDER_TOKENS = {
  none: BorderTokenFactory.create('none'),
  thin: BorderTokenFactory.create('thin'),
  base: BorderTokenFactory.create('base'),
  medium: BorderTokenFactory.create('medium'),
  thick: BorderTokenFactory.create('thick'),
  // Dashed variants
  thinDashed: BorderTokenFactory.create('thin', 'dashed'),
  baseDashed: BorderTokenFactory.create('base', 'dashed'),
  // Dotted variants
  thinDotted: BorderTokenFactory.create('thin', 'dotted'),
  baseDotted: BorderTokenFactory.create('base', 'dotted'),
} as const;

/**
 * Helper function to get border token
 */
export function getBorder(size: keyof typeof BORDER_TOKENS): BorderToken {
  return BORDER_TOKENS[size];
}

/**
 * Helper function to get border width as Tailwind class
 */
export function getBorderWidthClass(width: BorderWidth): string {
  return BorderTokenFactory.createWidth(width).tailwind;
}

/**
 * Helper function to get border style as Tailwind class
 */
export function getBorderStyleClass(style: BorderStyle): string {
  const styleMap: Record<BorderStyle, string> = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };
  return styleMap[style];
}

/**
 * Helper function to get complete border classes
 */
export function getBorderClasses(width: BorderWidth, style: BorderStyle = 'solid'): string {
  return `${getBorderWidthClass(width)} ${getBorderStyleClass(style)}`;
}
