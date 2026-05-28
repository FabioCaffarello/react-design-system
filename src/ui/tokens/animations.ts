/**
 * Animation Tokens
 *
 * Centralized animation and transition system for consistent timing and easing.
 * Uses Factory Pattern for type-safe token creation.
 */

export type AnimationDuration = "fast" | "base" | "slow" | "slower";
export type EasingFunction = "ease-in" | "ease-out" | "ease-in-out" | "spring";

export interface AnimationToken {
  duration: {
    value: string;
    ms: number;
    tailwind: string;
  };
  easing: {
    value: string;
    tailwind: string;
    description: string;
  };
}

export interface TransitionToken {
  property: string;
  duration: string;
  timingFunction: string;
  tailwind: string;
}

/**
 * Animation Token Factory
 * Creates animation tokens with consistent timing and easing
 */
export class AnimationTokenFactory {
  /**
   * Create an animation token
   */
  static create(
    duration: AnimationDuration,
    easing: EasingFunction = "ease-in-out",
  ): AnimationToken {
    const durationMap: Record<
      AnimationDuration,
      { value: string; ms: number; tailwind: string }
    > = {
      fast: {
        value: "150ms",
        ms: 150,
        tailwind: "duration-150",
      },
      base: {
        value: "200ms",
        ms: 200,
        tailwind: "duration-200",
      },
      slow: {
        value: "300ms",
        ms: 300,
        tailwind: "duration-300",
      },
      slower: {
        value: "500ms",
        ms: 500,
        tailwind: "duration-500",
      },
    };

    const easingMap: Record<
      EasingFunction,
      { value: string; tailwind: string; description: string }
    > = {
      "ease-in": {
        value: "cubic-bezier(0.4, 0, 1, 1)",
        tailwind: "ease-in",
        description: "Slow start, fast end",
      },
      "ease-out": {
        value: "cubic-bezier(0, 0, 0.2, 1)",
        tailwind: "ease-out",
        description: "Fast start, slow end",
      },
      "ease-in-out": {
        value: "cubic-bezier(0.4, 0, 0.2, 1)",
        tailwind: "ease-in-out",
        description: "Slow start and end, fast middle",
      },
      spring: {
        value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        tailwind: "ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
        description: "Spring-like bounce effect",
      },
    };

    return {
      duration: durationMap[duration],
      easing: easingMap[easing],
    };
  }

  /**
   * Create a transition token
   */
  static createTransition(
    property: string | string[],
    duration: AnimationDuration = "base",
    easing: EasingFunction = "ease-in-out",
  ): TransitionToken {
    const durationToken = this.create(duration, easing);
    const properties = Array.isArray(property) ? property.join(", ") : property;
    const tailwindClasses = [
      durationToken.duration.tailwind,
      durationToken.easing.tailwind,
    ].join(" ");

    return {
      property: properties,
      duration: durationToken.duration.value,
      timingFunction: durationToken.easing.value,
      tailwind: tailwindClasses,
    };
  }
}

/**
 * Pre-defined animation tokens
 */
export const ANIMATION_TOKENS = {
  fast: AnimationTokenFactory.create("fast"),
  base: AnimationTokenFactory.create("base"),
  slow: AnimationTokenFactory.create("slow"),
  slower: AnimationTokenFactory.create("slower"),

  // Common transitions
  colors: AnimationTokenFactory.createTransition(
    ["color", "background-color", "border-color"],
    "base",
  ),
  opacity: AnimationTokenFactory.createTransition("opacity", "fast"),
  transform: AnimationTokenFactory.createTransition("transform", "base"),
  all: AnimationTokenFactory.createTransition("all", "base"),
} as const;

/**
 * Helper function to get animation token
 */
export function getAnimation(
  duration: AnimationDuration,
  easing?: EasingFunction,
): AnimationToken {
  return AnimationTokenFactory.create(duration, easing);
}

/**
 * Helper function to get animation classes
 */
export function getAnimationClass(
  duration: AnimationDuration,
  easing: EasingFunction = "ease-in-out",
): string {
  const token = AnimationTokenFactory.create(duration, easing);
  return `${token.duration.tailwind} ${token.easing.tailwind}`;
}

/**
 * Helper function to get transition classes
 */
export function getTransitionClass(
  property: string | string[],
  duration: AnimationDuration = "base",
  easing: EasingFunction = "ease-in-out",
): string {
  const transition = AnimationTokenFactory.createTransition(
    property,
    duration,
    easing,
  );
  return transition.tailwind;
}
