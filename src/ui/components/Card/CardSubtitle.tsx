import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils";

export interface CardSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function CardSubtitle({
  children,
  className,
  ...props
}: CardSubtitleProps) {
  return (
    <p className={cn("text-sm text-fg-secondary", className)} {...props}>
      {children}
    </p>
  );
}

export default CardSubtitle;
