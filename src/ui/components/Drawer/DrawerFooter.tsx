"use client";

import { type ReactNode, type HTMLAttributes } from "react";
import { getSpacingClass } from "../../tokens/spacing";

export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * DrawerFooter Component
 *
 * Footer section for drawer content, typically contains action buttons.
 *
 * @example
 * ```tsx
 * <DrawerFooter>
 *   <Button>Save</Button>
 *   <Button variant="outline">Cancel</Button>
 * </DrawerFooter>
 * ```
 */
export default function DrawerFooter({
  children,
  className = "",
  ...props
}: DrawerFooterProps) {
  return (
    <div
      className={`
        ${getSpacingClass("lg", "p")}
        border-t
        border-line-default
        flex
        justify-end
        ${getSpacingClass("sm", "gap")}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
