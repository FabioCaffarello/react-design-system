"use client";

import { useFormContext } from "./FormContext";
import { ErrorMessage, Label } from "../../primitives";
import { cn } from "../../utils";
import {
  getSpacingClass,
  getTypographySizeFromFontSize,
  getTypographyWeightFromFontWeight,
  getColorClass,
} from "../../tokens";
import type { FieldValues, Path, RegisterOptions } from "react-hook-form";
import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  name: Path<TFieldValues>;
  label?: string;
  children: (props: {
    name: string;
    register: (
      fieldName: Path<TFieldValues>,
    ) => ReturnType<UseFormReturn<TFieldValues>["register"]>;
    error?: string;
    value?: unknown;
    onChange?: (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => void;
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
  className = "",
}: FormFieldProps<TFieldValues>) {
  const { form } = useFormContext<TFieldValues>();

  if (!form) {
    throw new Error(
      "FormField must be used within a Form component with react-hook-form integration",
    );
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
    <div
      className={cn(
        "flex",
        "flex-col",
        getSpacingClass("sm", "gap"),
        className,
      )}
    >
      {label && (
        <Label
          htmlFor={name}
          className={cn(
            "block",
            getTypographySizeFromFontSize("sm"),
            getTypographyWeightFromFontWeight("medium"),
            getColorClass("neutral", "dark", "text"),
          )}
        >
          {label}
        </Label>
      )}
      {children({
        name,
        register: (fieldName: Path<TFieldValues>) => register(fieldName, rules),
        error,
        value,
        onChange: fieldRegister.onChange,
        onBlur: fieldRegister.onBlur,
      })}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
