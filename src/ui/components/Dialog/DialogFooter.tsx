"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { getSpacingClass } from "../../tokens/spacing";

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function DialogFooter({
  children,
  className = "",
  ...props
}: DialogFooterProps) {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:${getSpacingClass("sm", "space-x")} ${getSpacingClass("lg", "p")} ${getSpacingClass("base", "pt")} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
