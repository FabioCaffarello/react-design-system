"use client";

import { type HTMLAttributes, type ReactNode } from "react";

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
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
