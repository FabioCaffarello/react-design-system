"use client";

import { useCallback } from "react";
import {
  useToastContext,
  type ToastVariant,
} from "../../providers/ToastContext";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // in milliseconds, undefined = no auto-dismiss
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * useToast Hook
 *
 * Hook for showing toast notifications.
 *
 * @example
 * ```tsx
 * const toast = useToast();
 *
 * toast.success('Success!', 'Operation completed successfully');
 * toast.error('Error!', 'Something went wrong');
 * toast.info('Info', 'Here is some information');
 * toast.warning('Warning', 'Please be careful');
 * ```
 */
export function useToast() {
  const { addToast, removeToast, clearAll } = useToastContext();

  const show = useCallback(
    (options: ToastOptions) => {
      return addToast({
        title: options.title,
        description: options.description,
        variant: options.variant || "info",
        duration: options.duration,
        action: options.action,
      });
    },
    [addToast],
  );

  const success = useCallback(
    (
      title: string,
      description?: string,
      options?: Omit<ToastOptions, "title" | "description" | "variant">,
    ) => {
      return show({ title, description, variant: "success", ...options });
    },
    [show],
  );

  const error = useCallback(
    (
      title: string,
      description?: string,
      options?: Omit<ToastOptions, "title" | "description" | "variant">,
    ) => {
      return show({ title, description, variant: "error", ...options });
    },
    [show],
  );

  const warning = useCallback(
    (
      title: string,
      description?: string,
      options?: Omit<ToastOptions, "title" | "description" | "variant">,
    ) => {
      return show({ title, description, variant: "warning", ...options });
    },
    [show],
  );

  const info = useCallback(
    (
      title: string,
      description?: string,
      options?: Omit<ToastOptions, "title" | "description" | "variant">,
    ) => {
      return show({ title, description, variant: "info", ...options });
    },
    [show],
  );

  const withUndo = useCallback(
    (
      title: string,
      description: string | undefined,
      onUndo: () => void,
      variant: ToastVariant = "info",
      duration?: number,
    ) => {
      return show({
        title,
        description,
        variant,
        duration,
        action: {
          label: "Undo",
          onClick: onUndo,
        },
      });
    },
    [show],
  );

  return {
    show,
    success,
    error,
    warning,
    info,
    withUndo,
    dismiss: removeToast,
    clearAll,
  };
}
