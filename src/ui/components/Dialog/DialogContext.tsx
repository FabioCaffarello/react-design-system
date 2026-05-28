"use client";

import { createContext, useContext } from "react";

export interface DialogContextValue {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  titleId?: string;
  descriptionId?: string;
}

export const DialogContext = createContext<DialogContextValue | undefined>(
  undefined,
);

export function useDialogContext(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog component");
  }
  return context;
}

export function useDialogContextOptional(): DialogContextValue | undefined {
  return useContext(DialogContext);
}
