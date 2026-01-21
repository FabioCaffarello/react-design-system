/**
 * Tokens Factory
 * 
 * Main factory for creating all types of tokens.
 * Implements Factory Pattern for unified token creation.
 */

import { SpacingTokenFactory, type SpacingScale, type SpacingToken } from './spacing';
import { TypographyTokenFactory, type TypographyToken, type FontSize, type LineHeight, type FontWeight } from './typography';
import { ColorTokenFactory, type ColorRole, type SemanticColor, LightColorStrategy, DarkColorStrategy, type ThemeMode } from './colors';
import { BreakpointTokenFactory, type BreakpointName, type BreakpointToken } from './breakpoints';
import { ShadowTokenFactory, type ShadowSize, type ShadowToken } from './shadows';
import { RadiusTokenFactory, type RadiusSize, type RadiusToken } from './radius';
import { BorderTokenFactory, type BorderWidth, type BorderToken } from './borders';
import { AnimationTokenFactory, type AnimationDuration, type EasingFunction, type AnimationToken } from './animations';
import { ZIndexTokenFactory, type ZIndexLayer, type ZIndexToken } from './z-index';
import { OpacityTokenFactory, type OpacityValue, type OpacityToken } from './opacity';
import { GradientTokenFactory, type GradientRole, type GradientDirection, type GradientToken } from './gradients';

export interface TokenSet {
  spacing: Record<string, SpacingToken>;
  typography: Record<string, TypographyToken>;
  colors: Record<ColorRole, SemanticColor>;
  breakpoints: Record<BreakpointName, BreakpointToken>;
  shadows: Record<string, ShadowToken>;
  radius: Record<string, RadiusToken>;
  borders: Record<string, BorderToken>;
  animations: Record<string, AnimationToken>;
  zIndex: Record<string, ZIndexToken>;
  opacity: Record<string, OpacityToken>;
  gradients: Record<string, GradientToken>;
}

/**
 * Tokens Factory
 * Main factory for creating complete token sets
 */
export class TokensFactory {
  private colorFactory: ColorTokenFactory;

  constructor(theme: ThemeMode = 'light') {
    const strategy = theme === 'light' ? new LightColorStrategy() : new DarkColorStrategy();
    this.colorFactory = new ColorTokenFactory(strategy);
  }

  /**
   * Create spacing token
   */
  createSpacing(scale: SpacingScale): SpacingToken {
    return SpacingTokenFactory.create(scale);
  }

  /**
   * Create typography token
   */
  createTypography(size: FontSize, lineHeight?: LineHeight, weight?: FontWeight): TypographyToken {
    return TypographyTokenFactory.create(size, lineHeight, weight);
  }

  /**
   * Create color palette
   */
  createColorPalette(): Record<ColorRole, SemanticColor> {
    return this.colorFactory.generatePalette();
  }

  /**
   * Create breakpoint token
   */
  createBreakpoint(name: BreakpointName): BreakpointToken {
    return BreakpointTokenFactory.create(name);
  }

  /**
   * Create shadow token
   */
  createShadow(size: ShadowSize): ShadowToken {
    return ShadowTokenFactory.create(size);
  }

  /**
   * Create radius token
   */
  createRadius(size: RadiusSize): RadiusToken {
    return RadiusTokenFactory.create(size);
  }

  /**
   * Create border token
   */
  createBorder(width: BorderWidth): BorderToken {
    return BorderTokenFactory.create(width);
  }

  /**
   * Create animation token
   */
  createAnimation(duration: AnimationDuration, easing?: EasingFunction): AnimationToken {
    return AnimationTokenFactory.create(duration, easing);
  }

  /**
   * Create z-index token
   */
  createZIndex(layer: ZIndexLayer): ZIndexToken {
    return ZIndexTokenFactory.create(layer);
  }

  /**
   * Create opacity token
   */
  createOpacity(value: OpacityValue): OpacityToken {
    return OpacityTokenFactory.create(value);
  }

  /**
   * Create gradient token
   */
  createGradient(role: GradientRole, direction?: GradientDirection): GradientToken {
    return GradientTokenFactory.create(role, direction);
  }

  /**
   * Create complete token set for a theme
   */
  createTokenSet(): TokenSet {
    return {
      spacing: {
        xs: this.createSpacing(1),
        sm: this.createSpacing(2),
        md: this.createSpacing(3),
        base: this.createSpacing(4),
        lg: this.createSpacing(6),
        xl: this.createSpacing(8),
        '2xl': this.createSpacing(10),
        '3xl': this.createSpacing(12),
        '4xl': this.createSpacing(16),
      },
      typography: {
        h1: this.createTypography('4xl', 'tight', 'bold'),
        h2: this.createTypography('3xl', 'tight', 'bold'),
        h3: this.createTypography('2xl', 'snug', 'semibold'),
        body: this.createTypography('base', 'relaxed', 'normal'),
        label: this.createTypography('sm', 'normal', 'medium'),
        caption: this.createTypography('xs', 'normal', 'normal'),
      },
      colors: this.createColorPalette(),
      breakpoints: {
        sm: this.createBreakpoint('sm'),
        md: this.createBreakpoint('md'),
        lg: this.createBreakpoint('lg'),
        xl: this.createBreakpoint('xl'),
        '2xl': this.createBreakpoint('2xl'),
      },
      shadows: {
        none: this.createShadow('none'),
        sm: this.createShadow('sm'),
        md: this.createShadow('md'),
        lg: this.createShadow('lg'),
        xl: this.createShadow('xl'),
        '2xl': this.createShadow('2xl'),
        inner: this.createShadow('inner'),
      },
      radius: {
        none: this.createRadius('none'),
        sm: this.createRadius('sm'),
        md: this.createRadius('md'),
        lg: this.createRadius('lg'),
        xl: this.createRadius('xl'),
        '2xl': this.createRadius('2xl'),
        '3xl': this.createRadius('3xl'),
        full: this.createRadius('full'),
      },
      borders: {
        none: this.createBorder('none'),
        thin: this.createBorder('thin'),
        base: this.createBorder('base'),
        medium: this.createBorder('medium'),
        thick: this.createBorder('thick'),
      },
      animations: {
        fast: this.createAnimation('fast'),
        base: this.createAnimation('base'),
        slow: this.createAnimation('slow'),
        slower: this.createAnimation('slower'),
      },
      zIndex: {
        base: this.createZIndex('base'),
        dropdown: this.createZIndex('dropdown'),
        sticky: this.createZIndex('sticky'),
        fixed: this.createZIndex('fixed'),
        'modal-backdrop': this.createZIndex('modal-backdrop'),
        modal: this.createZIndex('modal'),
        popover: this.createZIndex('popover'),
        tooltip: this.createZIndex('tooltip'),
        toast: this.createZIndex('toast'),
      },
      opacity: {
        transparent: this.createOpacity(0),
        '5': this.createOpacity(5),
        '10': this.createOpacity(10),
        '25': this.createOpacity(25),
        '50': this.createOpacity(50),
        '75': this.createOpacity(75),
        '90': this.createOpacity(90),
        opaque: this.createOpacity(100),
      },
      gradients: {
        primary: this.createGradient('primary'),
        secondary: this.createGradient('secondary'),
        success: this.createGradient('success'),
        error: this.createGradient('error'),
        info: this.createGradient('info'),
        warning: this.createGradient('warning'),
      },
    };
  }

  /**
   * Switch theme
   */
  setTheme(theme: ThemeMode): void {
    const strategy = theme === 'light' ? new LightColorStrategy() : new DarkColorStrategy();
    this.colorFactory.setStrategy(strategy);
  }
}

/**
 * Default factory instance (light theme)
 */
export const defaultTokensFactory = new TokensFactory('light');

/**
 * Helper function to create token set
 */
export function createTokenSet(theme: ThemeMode = 'light'): TokenSet {
  const factory = new TokensFactory(theme);
  return factory.createTokenSet();
}
