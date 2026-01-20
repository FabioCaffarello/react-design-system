import { z } from 'zod';
import { RegistryEntrySchema } from './schemas';

/**
 * StartComponent Validation Schemas
 */

/**
 * Start Component Type
 */
export const StartComponentTypeSchema = z.enum(['required', 'optional']);

/**
 * Start Component Category
 */
export const StartComponentCategorySchema = z.enum(['organism', 'layout', 'molecule', 'atom']);

/**
 * Feature ID
 */
export const FeatureIdSchema = z.enum(['home', 'dashboard', 'settings', 'profile']);

/**
 * Slot ID
 */
export const SlotIdSchema = z.enum([
  'root',
  'navigation',
  'sidebar',
  'main-content',
  'header',
  'footer',
  'card-content'
]);

/**
 * Prop Schema Type
 */
export const PropSchemaTypeSchema = z.enum(['string', 'number', 'boolean', 'select', 'color', 'range']);

/**
 * Base Prop Schema
 */
const PropSchemaBaseSchema = z.object({
  type: PropSchemaTypeSchema,
  label: z.string().min(1),
  description: z.string().optional(),
  required: z.boolean().optional(),
  group: z.string().optional(),
  order: z.number().optional(),
});

/**
 * String Prop Schema
 */
const PropSchemaStringSchema = PropSchemaBaseSchema.extend({
  type: z.literal('string'),
  default: z.string().optional(),
  placeholder: z.string().optional(),
  pattern: z.string().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
});

/**
 * Number Prop Schema
 */
const PropSchemaNumberSchema = PropSchemaBaseSchema.extend({
  type: z.literal('number'),
  default: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  unit: z.string().optional(),
});

/**
 * Boolean Prop Schema
 */
const PropSchemaBooleanSchema = PropSchemaBaseSchema.extend({
  type: z.literal('boolean'),
  default: z.boolean().optional(),
});

/**
 * Select Prop Schema
 */
const PropSchemaSelectSchema = PropSchemaBaseSchema.extend({
  type: z.literal('select'),
  default: z.string().optional(),
  options: z.array(z.object({
    value: z.string(),
    label: z.string(),
    description: z.string().optional(),
  })).min(1),
});

/**
 * Color Prop Schema
 */
const PropSchemaColorSchema = PropSchemaBaseSchema.extend({
  type: z.literal('color'),
  default: z.string().optional(),
  format: z.enum(['hex', 'rgb', 'hsl']).optional(),
});

/**
 * Range Prop Schema
 */
const PropSchemaRangeSchema = PropSchemaBaseSchema.extend({
  type: z.literal('range'),
  default: z.number().optional(),
  min: z.number(),
  max: z.number(),
  step: z.number().optional(),
  showValue: z.boolean().optional(),
});

/**
 * Union of all Prop Schemas
 */
export const PropSchemaSchema = z.discriminatedUnion('type', [
  PropSchemaStringSchema,
  PropSchemaNumberSchema,
  PropSchemaBooleanSchema,
  PropSchemaSelectSchema,
  PropSchemaColorSchema,
  PropSchemaRangeSchema,
]);

/**
 * Component Prop Schema (Record of prop schemas)
 */
export const ComponentPropSchemaSchema = z.record(z.string(), PropSchemaSchema);

/**
 * Start Component Definition Schema
 */
export const StartComponentDefinitionSchema = RegistryEntrySchema.extend({
  name: z.string().min(1, 'Name is required'),
  type: StartComponentTypeSchema,
  category: StartComponentCategorySchema,
  componentName: z.string().min(1, 'Component name is required'),
  defaultProps: z.record(z.unknown()),
  description: z.string().optional(),
  icon: z.any().optional(), // ReactNode
  propSchema: ComponentPropSchemaSchema.optional(),
  features: z.array(FeatureIdSchema).min(1, 'At least one feature is required'),
  allowedSlots: z.array(SlotIdSchema).min(1, 'At least one allowed slot is required'),
  providesSlots: z.array(SlotIdSchema).optional(),
}).strict();

/**
 * Start Component Instance Schema
 */
export const StartComponentInstanceSchema: z.ZodType<{
  id: string;
  definitionId: string;
  props: Record<string, unknown>;
  parentId?: string;
  slotId?: z.infer<typeof SlotIdSchema>;
  children?: Array<z.infer<typeof StartComponentInstanceSchema>>;
}> = z.object({
  id: z.string().min(1),
  definitionId: z.string().min(1),
  props: z.record(z.unknown()),
  parentId: z.string().optional(),
  slotId: SlotIdSchema.optional(),
  children: z.lazy(() => z.array(StartComponentInstanceSchema)).optional(),
}).strict();
