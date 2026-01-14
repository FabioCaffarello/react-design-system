import type { HTMLAttributes } from "react";
import { getColorClass } from '../../tokens/colors';
import { getRadiusClass } from '../../tokens/radius';
import { getSpacingClass } from '../../tokens/spacing';
import { cn } from '../../utils';

export interface InfoProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "warning" | "error";
}

export default function Info({ variant = "info", className, ...props }: InfoProps) {
  const variantClasses = {
    warning: cn(
      getColorClass('warning', 'light', 'bg'),
      getColorClass('warning', 'dark', 'text'),
      getColorClass('warning', 'DEFAULT', 'border')
    ),
    error: cn(
      getColorClass('error', 'light', 'bg'),
      getColorClass('error', 'dark', 'text'),
      getColorClass('error', 'DEFAULT', 'border')
    ),
    info: cn(
      getColorClass('info', 'light', 'bg'),
      getColorClass('info', 'dark', 'text'),
      getColorClass('info', 'DEFAULT', 'border')
    ),
  };

  return (
    <div
      role="alert"
      className={cn(
        'border',
        getSpacingClass('base', 'px'),
        getSpacingClass('sm', 'py'),
        getRadiusClass('lg'),
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
