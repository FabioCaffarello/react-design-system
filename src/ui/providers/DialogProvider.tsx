"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { DialogContext, type DialogContextValue } from "./DialogContext";
import { useFocusRestore } from "../hooks/useFocusRestore";

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

  // Presence tracking so DialogContent only emits aria-labelledby /
  // aria-describedby when a Title / Description is actually mounted.
  // Without this the dialog always pointed those IDREFs at ids that
  // only exist when the corresponding subcomponent is rendered — a
  // dangling reference for every title-only (or bare) dialog.
  const [titleCount, setTitleCount] = useState(0);
  const [descriptionCount, setDescriptionCount] = useState(0);

  const registerTitle = useCallback(() => {
    setTitleCount((c) => c + 1);
    return () => setTitleCount((c) => c - 1);
  }, []);
  const registerDescription = useCallback(() => {
    setDescriptionCount((c) => c + 1);
    return () => setDescriptionCount((c) => c - 1);
  }, []);

  // Use controlled or uncontrolled state
  const isOpen =
    controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setIsOpen = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  // Modal focus restore — consumed from the shared hook introduced in
  // Phase 3 PR 1. Replaces an inline `previousActiveElement` ref +
  // `setTimeout(0)` block that this hook now owns. Timing identity is
  // preserved (the hook uses setTimeout(0)), so Dialog.test.tsx's
  // restore tests do not need to change.
  useFocusRestore(isOpen);

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
    hasTitle: titleCount > 0,
    hasDescription: descriptionCount > 0,
    registerTitle,
    registerDescription,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
}
