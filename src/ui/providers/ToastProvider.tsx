'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { ToastContext, type Toast, type ToastContextValue } from './ToastContext';

export interface ToastProviderProps {
  children: ReactNode;
  defaultDuration?: number; // Default auto-dismiss duration in ms
  maxToasts?: number; // Maximum number of toasts to show
}

export function ToastProvider({
  children,
  defaultDuration = 5000,
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration,
    };

    setToasts((prev) => {
      const updated = [newToast, ...prev];
      // Limit number of toasts
      return updated.slice(0, maxToasts);
    });

    return id;
  }, [defaultDuration, maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    clearAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}
