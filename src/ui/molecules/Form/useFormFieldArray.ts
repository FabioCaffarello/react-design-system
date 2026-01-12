'use client';

import { useFormContext } from './FormContext';
import { useFieldArray } from 'react-hook-form';
import type { FieldValues, Path, UseFieldArrayProps } from 'react-hook-form';

/**
 * Hook for managing field arrays in forms
 * 
 * Wrapper around react-hook-form's useFieldArray that integrates with Form context.
 * 
 * @example
 * ```tsx
 * const { fields, append, remove } = useFormFieldArray({
 *   name: 'items',
 * });
 * 
 * return (
 *   <>
 *     {fields.map((field, index) => (
 *       <div key={field.id}>
 *         <FormField name={`items.${index}.name`}>
 *           {({ register }) => <Input {...register(`items.${index}.name`)} />}
 *         </FormField>
 *         <Button onClick={() => remove(index)}>Remove</Button>
 *       </div>
 *     ))}
 *     <Button onClick={() => append({ name: '' })}>Add Item</Button>
 *   </>
 * );
 * ```
 */
export function useFormFieldArray<TFieldValues extends FieldValues = FieldValues, TFieldArrayName extends Path<TFieldValues> = Path<TFieldValues>>(
  props: Omit<UseFieldArrayProps<TFieldValues, TFieldArrayName>, 'control'>
) {
  const { form } = useFormContext<TFieldValues>();
  
  if (!form) {
    throw new Error('useFormFieldArray must be used within a Form component with react-hook-form integration');
  }

  return useFieldArray<TFieldValues, TFieldArrayName>({
    ...props,
    control: form.control,
  });
}
