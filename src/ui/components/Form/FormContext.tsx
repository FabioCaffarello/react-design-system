"use client";

/* eslint-disable react-refresh/only-export-components */
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { createGenericContext } from "../../hooks/createGenericContext";

export interface FormContextValue<
  TFieldValues extends FieldValues = FieldValues,
> {
  form?: UseFormReturn<TFieldValues>;
  loading?: boolean;
}

const formContext = createGenericContext<FormContextValue>({
  displayName: "FormContext",
  errorMessage:
    "useFormContext must be used within a Form component with react-hook-form integration",
});

/**
 * Raw React Context object. Exposed so `useContextSelector(FormContext, …)`
 * keeps working. Prefer the typed hooks below for direct reads.
 */
export const FormContext = formContext.Context;

/**
 * Internal Provider — consumed by `FormProvider.tsx` only. Not re-exported
 * from `Form/index.ts`; keeps the public surface unchanged.
 */
export const FormContextProvider = formContext.Provider;

/**
 * Hook to access Form context.
 *
 * @throws Error if used outside of Form component with react-hook-form
 */
export function useFormContext<
  TFieldValues extends FieldValues = FieldValues,
>(): FormContextValue<TFieldValues> {
  return formContext.useContextRequired<FormContextValue<TFieldValues>>();
}

/**
 * Hook to access Form context (optional, returns undefined if not in Form).
 */
export function useFormContextOptional<
  TFieldValues extends FieldValues = FieldValues,
>(): FormContextValue<TFieldValues> | undefined {
  return formContext.useContextOptional<FormContextValue<TFieldValues>>();
}
