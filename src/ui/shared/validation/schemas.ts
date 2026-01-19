import { z } from 'zod';

/**
 * Base Validation Schemas
 *
 * Zod schemas for runtime validation of registry entries.
 */

/**
 * Metadata Schema
 * Used across all registry entries
 */
export const MetadataSchema = z.object({
  order: z.number().int().nonnegative().optional(),
  label: z.string().min(1).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  icon: z.any().optional(), // ReactNode - can't validate precisely
}).strict();

/**
 * Base Registry Entry Schema
 */
export const RegistryEntrySchema = z.object({
  id: z.string().min(1, 'ID is required'),
  metadata: MetadataSchema.optional(),
}).strict();

/**
 * Validate that a value is a React component
 * Note: This is a loose check since we can't validate React components at runtime precisely
 */
export const ReactComponentSchema = z.function().or(z.object({}));

/**
 * Helper function to create a safe validator
 * Returns validation result with typed errors
 */
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
    const result = schema.safeParse(data);

    if (result.success) {
      return { success: true, data: result.data };
    }

    const errors = result.error.issues.map(issue =>
      `${issue.path.join('.')}: ${issue.message}`
    );

    return { success: false, errors };
  };
}

/**
 * Helper to validate and throw on error
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown, errorPrefix: string = 'Validation failed'): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.issues
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');
    throw new Error(`${errorPrefix}: ${errors}`);
  }

  return result.data;
}
