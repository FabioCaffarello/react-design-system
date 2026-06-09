import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils";
import { getSpacingClass } from "../../tokens/spacing";

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "grid items-start",
        getSpacingClass("1.5", "gap"),
        getSpacingClass("base", "mb"),
        "[&:has([data-card-actions])]:grid-cols-[1fr_auto]",
        "[&:has([data-card-actions])>[data-card-actions]]:row-span-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default CardHeader;
