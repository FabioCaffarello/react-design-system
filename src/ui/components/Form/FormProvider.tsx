"use client";

import { FormContext, type FormContextValue } from "./FormContext";
import type { ReactNode } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export interface FormProviderProps<
  TFieldValues extends FieldValues = FieldValues,
> {
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

  // TODO(phase2): FormContext perde TFieldValues — createContext não
  // carrega genérico, então o tipo do contexto é achatado para
  // FormContextValue<FieldValues>; useFormContext faz o cast inverso
  // na leitura. Migração para context factory genérico elimina o cast
  // (ver TODO simétrico em TableContext/TableProvider).
  return (
    <FormContext.Provider
      value={contextValue as unknown as FormContextValue<FieldValues>}
    >
      {children}
    </FormContext.Provider>
  );
}
