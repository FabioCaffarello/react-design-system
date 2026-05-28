"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { DialogContext, type DialogContextValue } from "./DialogContext";

export interface DialogProviderProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  titleId?: string;
  descriptionId?: string;
}

export function DialogProvider({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  titleId,
  descriptionId,
}: DialogProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Use controlled or uncontrolled state
  const isOpen =
    controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setIsOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  // Store previous active element and restore on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    } else {
      // Restore focus when closing
      const timer = setTimeout(() => {
        previousActiveElement.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const contextValue: DialogContextValue = {
    isOpen,
    onOpenChange: setIsOpen,
    onClose: () => setIsOpen(false),
    titleId,
    descriptionId,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
}
