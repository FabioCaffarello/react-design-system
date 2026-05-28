import type { HTMLAttributes } from "react";
import { getRadiusClass } from "../../tokens/radius";
import { getSpacingClass } from "../../tokens/spacing";
import { cn } from "../../utils";

export interface InfoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "error";
}

export default function Info({
  variant = "info",
  className,
  ...props
}: InfoProps) {
  const variantClasses = {
    warning: cn("bg-warning-bg", "text-warning-dark", "border-warning"),
    error: cn("bg-error-bg", "text-error-dark", "border-error"),
    info: cn("bg-info-bg", "text-info-dark", "border-info"),
  };

  return (
    <div
      role="alert"
      className={cn(
        "border",
        getSpacingClass("base", "px"),
        getSpacingClass("sm", "py"),
        getRadiusClass("lg"),
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
