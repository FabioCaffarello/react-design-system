"use client";

import { cloneElement, isValidElement, type ReactElement } from "react";
import { X } from "lucide-react";
import { useDialogContext } from "../../providers/DialogContext";
import Button from "../../primitives/Button/Button";

export interface DialogCloseProps {
  "aria-label"?: string;
  className?: string;
  asChild?: boolean;
  children?: ReactElement;
}

export function DialogClose({
  "aria-label": ariaLabel = "Close dialog",
  className = "",
  asChild = false,
  children,
}: DialogCloseProps) {
  const { onClose } = useDialogContext();

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        onClose();
        if (children.props.onClick) {
          children.props.onClick(e);
        }
      },
    } as unknown);
  }

  return (
    <Button
      variant="iconOnly"
      size="sm"
      onClick={onClose}
      className={`absolute right-4 top-4 ${className}`}
      aria-label={ariaLabel}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
