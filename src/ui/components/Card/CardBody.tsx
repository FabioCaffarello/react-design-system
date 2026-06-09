import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../utils";

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardBody({ children, className, ...props }: CardBodyProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export default CardBody;
