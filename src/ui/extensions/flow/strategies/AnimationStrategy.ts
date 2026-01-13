/**
 * Animation Strategy
 * 
 * Strategy pattern for different animation approaches.
 */

/**
 * Animation Strategy Interface
 */
export interface IAnimationStrategy {
  name: string;
  getAnimationClass(): string;
  getAnimationStyle(): React.CSSProperties;
  getKeyframes(): string;
}

/**
 * Fade Animation Strategy
 */
export class FadeAnimationStrategy implements IAnimationStrategy {
  name = 'fade';

  getAnimationClass(): string {
    return 'animate-fade-in';
  }

  getAnimationStyle(): React.CSSProperties {
    return {
      animation: 'fadeIn 0.3s ease-in',
    };
  }

  getKeyframes(): string {
    return `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
  }
}

/**
 * Slide Animation Strategy
 */
export class SlideAnimationStrategy implements IAnimationStrategy {
  name = 'slide';

  getAnimationClass(): string {
    return 'animate-slide-in';
  }

  getAnimationStyle(): React.CSSProperties {
    return {
      animation: 'slideIn 0.3s ease-out',
    };
  }

  getKeyframes(): string {
    return `
      @keyframes slideIn {
        from {
          transform: translateY(-10px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;
  }
}

/**
 * Scale Animation Strategy
 */
export class ScaleAnimationStrategy implements IAnimationStrategy {
  name = 'scale';

  getAnimationClass(): string {
    return 'animate-scale-in';
  }

  getAnimationStyle(): React.CSSProperties {
    return {
      animation: 'scaleIn 0.3s ease-out',
    };
  }

  getKeyframes(): string {
    return `
      @keyframes scaleIn {
        from {
          transform: scale(0.95);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
  }
}

/**
 * Bounce Animation Strategy
 */
export class BounceAnimationStrategy implements IAnimationStrategy {
  name = 'bounce';

  getAnimationClass(): string {
    return 'animate-bounce-in';
  }

  getAnimationStyle(): React.CSSProperties {
    return {
      animation: 'bounceIn 0.5s ease-out',
    };
  }

  getKeyframes(): string {
    return `
      @keyframes bounceIn {
        0% {
          transform: scale(0.3);
          opacity: 0;
        }
        50% {
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
  }
}

/**
 * Animation Strategy Manager
 */
export class AnimationStrategyManager {
  private static strategies: Map<string, IAnimationStrategy> = new Map();

  static {
    // Register default strategies
    this.register(new FadeAnimationStrategy());
    this.register(new SlideAnimationStrategy());
    this.register(new ScaleAnimationStrategy());
    this.register(new BounceAnimationStrategy());
  }

  /**
   * Register an animation strategy
   */
  static register(strategy: IAnimationStrategy): void {
    this.strategies.set(strategy.name, strategy);
  }

  /**
   * Get animation strategy
   */
  static get(name: string): IAnimationStrategy | undefined {
    return this.strategies.get(name);
  }

  /**
   * Get animation class for a strategy
   */
  static getAnimationClass(name: string): string {
    const strategy = this.get(name);
    return strategy?.getAnimationClass() || '';
  }

  /**
   * Get animation style for a strategy
   */
  static getAnimationStyle(name: string): React.CSSProperties {
    const strategy = this.get(name);
    return strategy?.getAnimationStyle() || {};
  }

  /**
   * Get all keyframes for registered strategies
   */
  static getAllKeyframes(): string {
    return Array.from(this.strategies.values())
      .map((strategy) => strategy.getKeyframes())
      .join('\n');
  }

  /**
   * Get available strategies
   */
  static getAvailableStrategies(): string[] {
    return Array.from(this.strategies.keys());
  }
}
