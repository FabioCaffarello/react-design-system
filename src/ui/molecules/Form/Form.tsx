'use client';

import type { FormHTMLAttributes, ReactNode } from "react";
import { FormProvider } from './FormProvider';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

// Simple Form Props (backward compatible)
interface SimpleFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  form?: never; // Cannot use form prop in simple mode
}

// React Hook Form Props
interface ReactHookFormProps<TFieldValues extends FieldValues = FieldValues> extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  children: ReactNode;
  form: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  onSubmitError?: (errors: any) => void;
}

type FormProps<TFieldValues extends FieldValues = FieldValues> = 
  | SimpleFormProps 
  | ReactHookFormProps<TFieldValues>;

/**
 * Form Component
 * 
 * A flexible form component that supports both simple forms and react-hook-form integration.
 * 
 * @example
 * ```tsx
 * // Simple form (backward compatible)
 * <Form onSubmit={handleSubmit} loading={isSubmitting}>
 *   <Input name="email" />
 *   <Button type="submit">Submit</Button>
 * </Form>
 * 
 * // With react-hook-form
 * const form = useForm({ resolver: zodResolver(schema) });
 * <Form form={form} onSubmit={handleSubmit}>
 *   <FormField name="email">
 *     {({ register, error }) => (
 *       <>
 *         <Input {...register('email')} />
 *         {error && <ErrorMessage>{error}</ErrorMessage>}
 *       </>
 *     )}
 *   </FormField>
 * </Form>
 * ```
 */
export default function Form<TFieldValues extends FieldValues = FieldValues>({
  children,
  onSubmit,
  loading = false,
  error = null,
  success = null,
  className = "",
  ...props
}: FormProps<TFieldValues>) {
  const baseClasses = ["space-y-4"];
  const classes = [...baseClasses, className].filter(Boolean).join(" ");

  // Check if using react-hook-form
  const isReactHookForm = 'form' in props && props.form !== undefined;
  
  if (isReactHookForm) {
    const { form, onSubmit: onSubmitData, onSubmitError, ...formProps } = props as ReactHookFormProps<TFieldValues>;
    
    const handleSubmit = form.handleSubmit(
      async (data) => {
        try {
          await onSubmitData(data);
        } catch (err) {
          onSubmitError?.(err);
        }
      },
      (errors) => {
        onSubmitError?.(errors);
      }
    );

    return (
      <FormProvider form={form} loading={loading}>
        <form
          className={classes}
          onSubmit={handleSubmit}
          noValidate
          {...formProps}
        >
          {children}
          {error && (
            <div
              role="alert"
              className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              role="alert"
              className="p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded"
            >
              {success}
            </div>
          )}
        </form>
      </FormProvider>
    );
  }

  // Simple form mode (backward compatible)
  // Use onSubmit from props or from direct prop
  const onSubmitSimple = (props as SimpleFormProps).onSubmit || onSubmit;
  const { onSubmit: _, ...simpleProps } = props as SimpleFormProps;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmitSimple && !loading) {
      onSubmitSimple(e);
    }
  };

  return (
    <form
      className={classes}
      onSubmit={handleSubmit}
      noValidate
      {...simpleProps}
    >
      {children}
      {error && (
        <div
          role="alert"
          className="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          role="alert"
          className="p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded"
        >
          {success}
        </div>
      )}
    </form>
  );
}
