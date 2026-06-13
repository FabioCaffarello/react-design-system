"use client";

import { useId, useEffect, type HTMLAttributes } from "react";
import { useDialogContext } from "../../providers/DialogContext";
import { getTypographyClasses } from "../../tokens";

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function DialogTitle({
  as: Component = "h2",
  children,
  className = "",
  id,
  ...props
}: DialogTitleProps) {
  const context = useDialogContext();
  const generatedId = useId();
  const finalId = id || context.titleId || generatedId;

  // Tell the dialog a Title is present so it emits aria-labelledby.
  const { registerTitle } = context;
  useEffect(() => registerTitle(), [registerTitle]);

  return (
    <Component
      id={finalId}
      className={`${getTypographyClasses("h3")} font-semibold leading-none tracking-tight ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
