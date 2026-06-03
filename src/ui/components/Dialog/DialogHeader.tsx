"use client";

import { type HTMLAttributes, type ReactNode } from "react";
import { getSpacingClass } from "../../tokens/spacing";

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function DialogHeader({
  children,
  className = "",
  ...props
}: DialogHeaderProps) {
  return (
    <div
      className={`flex flex-col ${getSpacingClass("1.5", "space-y")} ${getSpacingClass("lg", "p")} ${getSpacingClass("base", "pb")} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
