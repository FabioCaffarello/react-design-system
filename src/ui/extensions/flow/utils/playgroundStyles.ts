/**
 * Playground Styles Utilities
 * 
 * Helper functions and constants for playground styling.
 * Wrappers for design system tokens to ensure consistency.
 */

import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses,
  getShadowClass,
  getRadiusClass 
} from '../../../tokens';

/**
 * Common style combinations for playground components
 */
export const playgroundStyles = {
  /**
   * Container styles
   */
  container: `
    flex flex-col
    ${getSpacingClass('base', 'gap')}
  `,
  
  /**
   * Card container
   */
  cardContainer: `
    ${getSpacingClass('base', 'gap')}
  `,
  
  /**
   * Section title
   */
  sectionTitle: `
    ${getTypographyClasses('h4')}
    ${getColorClass('neutral', 'dark', 'text')}
    m-0
    ${getSpacingClass('sm', 'mb')}
  `,
  
  /**
   * Section description
   */
  sectionDescription: `
    ${getTypographyClasses('body')}
    ${getColorClass('neutral', 'DEFAULT', 'text')}
    m-0
  `,
  
  /**
   * Label style
   */
  label: `
    ${getTypographyClasses('label')}
    ${getSpacingClass('sm', 'mb')}
    block
  `,
  
  /**
   * Caption style
   */
  caption: `
    ${getTypographyClasses('caption')}
    ${getColorClass('neutral', 'DEFAULT', 'text')}
  `,
  
  /**
   * Grid layout for previews
   */
  previewGrid: `
    grid
    ${getSpacingClass('md', 'gap')}
  `,
  
  /**
   * Flex row with gap
   */
  flexRow: `
    flex
    ${getSpacingClass('sm', 'gap')}
    items-center
  `,
  
  /**
   * Flex column with gap
   */
  flexCol: `
    flex flex-col
    ${getSpacingClass('sm', 'gap')}
  `,
};

/**
 * Get preview grid style with custom columns
 */
export function getPreviewGridStyle(minWidth: string = '140px'): string {
  return `
    ${playgroundStyles.previewGrid}
  `;
}

/**
 * Get card preview container style
 */
export function getCardPreviewStyle(): string {
  return `
    ${getRadiusClass('md')}
    overflow-hidden relative
    ${getColorClass('neutral', 'light', 'bg')}
    border
    ${getColorClass('neutral', 'DEFAULT', 'border')}
  `;
}
