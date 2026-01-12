'use client';

import { useFormContext } from './FormContext';
import { ErrorMessage } from '../../atoms';
import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import type { ReactNode } from 'react';

export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  children: (props: {
    name: string;
    register: ReturnType<ReturnType<UseFormReturn<TFieldValues>['register']>>;
    error?: string;
    value?: any;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur?: () => void;
  }) => ReactNode;
  rules?: RegisterOptions<TFieldValues>;
  className?: string;
}

/**
 * FormField Component
 * 
 * A wrapper component for form fields that integrates with react-hook-form.
 * Provides register, error, and validation state to children.
 * 
 * @example
 * ```tsx
 * <FormField name="email" label="Email">
 *   {({ register, error }) => (
 *     <>
 *       <Label htmlFor="email">Email</Label>
 *       <Input id="email" {...register('email')} />
 *       {error && <ErrorMessage>{error}</ErrorMessage>}
 *     </>
 *   )}
 * </FormField>
 * ```
 */
export function FormField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  children,
  rules,
  className = '',
}: FormFieldProps<TFieldValues>) {
  const { form } = useFormContext<TFieldValues>();
  
  if (!form) {
    throw new Error('FormField must be used within a Form component with react-hook-form integration');
  }

  const {
    register,
    formState: { errors },
    watch,
  } = form;

  const fieldRegister = register(name, rules);
  const error = errors[name]?.message as string | undefined;
  const value = watch(name);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children({
        name,
        register: fieldRegister,
        error,
        value,
        onChange: fieldRegister.onChange,
        onBlur: fieldRegister.onBlur,
      })}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
}
