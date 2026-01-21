import { z } from 'zod';
import { RegistryEntrySchema, ReactComponentSchema } from './schemas';

/**
 * GlobalConfig Validation Schemas
 */

/**
 * Token Category
 */
export const TokenCategorySchema = z.enum(['typography', 'colors', 'spacing', 'shadows', 'radius']);

/**
 * Preview Section Entry Schema
 */
export const PreviewSectionEntrySchema = RegistryEntrySchema.extend({
  category: TokenCategorySchema,
  subcategory: z.string().optional(),
  component: ReactComponentSchema,
}).strict();

/**
 * Configurator Entry Schema
 */
export const ConfiguratorEntrySchema = RegistryEntrySchema.extend({
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  component: ReactComponentSchema,
}).strict();

/**
 * Preview Entry Schema
 */
export const PreviewEntrySchema = RegistryEntrySchema.extend({
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  component: ReactComponentSchema,
}).strict();

/**
 * Content Component Entry Schema
 */
export const ContentComponentEntrySchema = RegistryEntrySchema.extend({
  category: z.string().min(1, 'Category is required'),
  component: ReactComponentSchema,
}).strict();

/**
 * Font Size Token Schema
 */
export const FontSizeTokenSchema = z.object({
  px: z.string().regex(/^\d+px$/, 'Must be in format: XXpx'),
  rem: z.string().regex(/^\d+(\.\d+)?rem$/, 'Must be in format: X.Xrem'),
}).strict();

/**
 * Font Weight Token Schema
 */
export const FontWeightTokenSchema = z.object({
  value: z.number().int().min(100).max(900).multipleOf(100),
}).strict();

/**
 * Line Height Token Schema
 */
export const LineHeightTokenSchema = z.object({
  value: z.number().positive(),
}).strict();

/**
 * Typography Token Config Schema
 */
export const TypographyTokenConfigSchema = z.object({
  fontSizes: z.record(z.string(), FontSizeTokenSchema).refine(
    (sizes) => Object.keys(sizes).length > 0,
    'At least one font size is required'
  ),
  fontWeights: z.record(z.string(), FontWeightTokenSchema).refine(
    (weights) => Object.keys(weights).length > 0,
    'At least one font weight is required'
  ),
  lineHeights: z.record(z.string(), LineHeightTokenSchema).refine(
    (heights) => Object.keys(heights).length > 0,
    'At least one line height is required'
  ),
  fontFamilies: z.record(z.string(), z.string()).optional(),
}).strict();

/**
 * Color Token Config Schema
 */
export const ColorTokenConfigSchema = z.object({
  palette: z.record(z.string(), z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color')).refine(
    (palette) => Object.keys(palette).length > 0,
    'At least one color is required in palette'
  ),
  semantic: z.record(z.string(), z.string()).optional(),
}).strict();

/**
 * Spacing Token Config Schema
 */
export const SpacingTokenConfigSchema = z.record(
  z.string(),
  z.string().regex(/^\d+(\.\d+)?(px|rem|em)$/, 'Must be a valid spacing value (px, rem, or em)')
).refine(
  (spacing) => Object.keys(spacing).length > 0,
  'At least one spacing value is required'
);

/**
 * Shadow Token Config Schema
 */
export const ShadowTokenConfigSchema = z.record(
  z.string(),
  z.string().regex(
    /^-?\d+px\s+-?\d+px\s+\d+px(\s+\d+px)?\s+(#[0-9a-fA-F]{6}|rgba?\([^)]+\))$/,
    'Must be a valid CSS box-shadow value'
  )
);

/**
 * Radius Token Config Schema
 */
export const RadiusTokenConfigSchema = z.record(
  z.string(),
  z.string().regex(/^\d+(\.\d+)?(px|rem|em|%)$/, 'Must be a valid border-radius value')
);

/**
 * SideNavbar Config Schema
 */
export const SideNavbarConfigSchema = z.object({
  width: z.string().optional(),
  navigationWidth: z.string().optional(),
  variant: z.enum(['default', 'elevated', 'compact']).optional(),
}).strict();

/**
 * Global Tokens Config Schema
 */
export const GlobalTokensConfigSchema = z.object({
  typography: TypographyTokenConfigSchema,
  colors: ColorTokenConfigSchema,
  spacing: SpacingTokenConfigSchema,
  shadows: ShadowTokenConfigSchema.optional(),
  radius: RadiusTokenConfigSchema.optional(),
  sideNavbar: SideNavbarConfigSchema.optional(),
}).strict();
