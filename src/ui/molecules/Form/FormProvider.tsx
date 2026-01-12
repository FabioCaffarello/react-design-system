'use client';

import { FormContext, type FormContextValue } from './FormContext';
import type { ReactNode } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export interface FormProviderProps<TFieldValues extends FieldValues = FieldValues> {
  form?: UseFormReturn<TFieldValues>;
  loading?: boolean;
  children: ReactNode;
}

/**
 * FormProvider Component
 * 
 * Provides react-hook-form context to form children.
 * Used internally by Form component when react-hook-form is integrated.
 */
export function FormProvider<TFieldValues extends FieldValues = FieldValues>({
  form,
  loading = false,
  children,
}: FormProviderProps<TFieldValues>) {
  const contextValue: FormContextValue<TFieldValues> = {
    form,
    loading,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}
