"use client";

import { useId, useEffect, type HTMLAttributes } from "react";
import { useDialogContext } from "../../providers/DialogContext";
import { getTypographyClasses } from "../../tokens";

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export function DialogDescription({
  children,
  className = "",
  id,
  ...props
}: DialogDescriptionProps) {
  const context = useDialogContext();
  const generatedId = useId();
  const finalId = id || context.descriptionId || generatedId;

  // Tell the dialog a Description is present so it emits aria-describedby.
  const { registerDescription } = context;
  useEffect(() => registerDescription(), [registerDescription]);

  return (
    <p
      id={finalId}
      className={`${getTypographyClasses("bodySmall")} text-fg-secondary ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
