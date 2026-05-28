"use client";

import { cloneElement, isValidElement, type ReactElement } from "react";
import { useDialogContext } from "../../providers/DialogContext";

export interface DialogTriggerProps {
  children: ReactElement;
  asChild?: boolean;
}

export function DialogTrigger({
  children,
  asChild = false,
}: DialogTriggerProps) {
  const { onOpenChange } = useDialogContext();

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        onOpenChange(true);
        if (children.props.onClick) {
          children.props.onClick(e);
        }
      },
    } as unknown);
  }

  return (
    <button
      type="button"
      onClick={() => onOpenChange(true)}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}
