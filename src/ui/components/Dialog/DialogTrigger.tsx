"use client";

import { cloneElement, isValidElement, type ReactElement } from "react";
import { useDialogContext } from "../../providers/DialogContext";

type TriggerChildProps = {
  onClick?: (e: React.MouseEvent) => void;
};

export interface DialogTriggerProps {
  children: ReactElement<TriggerChildProps>;
  asChild?: boolean;
}

export function DialogTrigger({
  children,
  asChild = false,
}: DialogTriggerProps) {
  const { onOpenChange } = useDialogContext();

  if (asChild && isValidElement<TriggerChildProps>(children)) {
    return cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        onOpenChange(true);
        children.props.onClick?.(e);
      },
    });
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
