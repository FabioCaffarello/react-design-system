/**
 * Component Builder Types
 * 
 * Type definitions for the Component Builder system.
 */

import type { ColorRole } from '../tokens/colors';
import type { SpacingScale } from '../tokens/spacing';
import type { FontSize, FontWeight, LineHeight } from '../tokens/typography';

/**
 * Component Category
 */
export type ComponentCategory = 'atom' | 'molecule' | 'organism' | 'template' | 'pattern' | 'layout';

/**
 * Component Builder Configuration
 */
export interface ComponentBuilderConfig {
  name: string;
  category: ComponentCategory;
  variants?: string[];
  sizes?: string[];
  states?: string[];
  tokens?: {
    colors?: ColorRole[];
    spacing?: SpacingScale[];
    typography?: {
      sizes?: FontSize[];
      weights?: FontWeight[];
      lineHeights?: LineHeight[];
    };
  };
  accessibility?: {
    ariaLabel?: boolean;
    keyboardNavigation?: boolean;
    focusManagement?: boolean;
  };
  props?: Record<string, unknown>;
  children?: boolean;
}

/**
 * Built Component
 */
export interface BuiltComponent {
  name: string;
  category: ComponentCategory;
  code: string;
  types: string;
  stories?: string;
  tests?: string;
  config: ComponentBuilderConfig;
}

/**
 * Component Factory Options
 */
export interface ComponentFactoryOptions {
  includeStories?: boolean;
  includeTests?: boolean;
  includeTypes?: boolean;
  template?: 'default' | 'factory' | 'builder' | 'strategy';
}
