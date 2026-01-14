/**
 * Storybook Integration for Playgrounds
 * 
 * Components and utilities for embedding playgrounds in Storybook.
 */

import { TypographyPlayground } from './TypographyPlayground';
import { ColorsPlayground } from './ColorsPlayground';
import { SpacingPlayground } from './SpacingPlayground';
import { ComponentPlayground } from './ComponentPlayground';
import { CompositionPlayground } from './CompositionPlayground';
import { PatternPlayground } from './PatternPlayground';

/**
 * Playground components available for Storybook
 */
export const StorybookPlaygrounds = {
  Typography: TypographyPlayground,
  Colors: ColorsPlayground,
  Spacing: SpacingPlayground,
  Component: ComponentPlayground,
  Composition: CompositionPlayground,
  Pattern: PatternPlayground,
};

/**
 * Embed a playground in a story
 * 
 * @example
 * ```tsx
 * import { PlaygroundEmbed } from './StorybookIntegration';
 * 
 * export const TypographyExample = {
 *   render: () => <PlaygroundEmbed type="Typography" />,
 * };
 * ```
 */
export function PlaygroundEmbed({ type }: { type: keyof typeof StorybookPlaygrounds }) {
  const Playground = StorybookPlaygrounds[type];
  if (!Playground) {
    return <div>Playground type "{type}" not found</div>;
  }
  return <Playground />;
}
