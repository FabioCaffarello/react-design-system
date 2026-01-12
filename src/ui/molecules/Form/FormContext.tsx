'use client';

import { createContext, useContext } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

export interface FormContextValue<TFieldValues extends FieldValues = FieldValues> {
  form?: UseFormReturn<TFieldValues>;
  loading?: boolean;
}

const FormContext = createContext<FormContextValue<FieldValues> | undefined>(undefined);

/**
 * Hook to access Form context
 * 
 * @throws Error if used outside of Form component with react-hook-form
 */
export function useFormContext<TFieldValues extends FieldValues = FieldValues>(): FormContextValue<TFieldValues> {
  const context = useContext(FormContext);
  
  if (context === undefined) {
    throw new Error('useFormContext must be used within a Form component with react-hook-form integration');
  }
  
  return context as FormContextValue<TFieldValues>;
}

/**
 * Hook to access Form context (optional, returns undefined if not in Form)
 */
export function useFormContextOptional<TFieldValues extends FieldValues = FieldValues>(): FormContextValue<TFieldValues> | undefined {
  return useContext(FormContext) as FormContextValue<TFieldValues> | undefined;
}

export { FormContext };
