'use client';

import type { HTMLAttributes, ReactNode } from "react";
import { Text, Button } from "../../../atoms";
import { X } from "lucide-react";
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from "../../../tokens";

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Title text
   */
  title: string;
  
  /**
   * Optional subtitle or description
   */
  subtitle?: string;
  
  /**
   * Optional icon to display before the title
   */
  icon?: ReactNode;
  
  /**
   * Callback when close button is clicked
   */
  onClose?: () => void;
  
  /**
   * Whether to show the close button
   * @default false
   */
  showCloseButton?: boolean;
  
  /**
   * Variant of the header
   * - 'default': Standard header with padding
   * - 'compact': Reduced padding
   * - 'minimal': Minimal styling, no border
   * @default 'default'
   */
  variant?: 'default' | 'compact' | 'minimal';
  
  /**
   * Additional actions/content to display in the header
   */
  children?: ReactNode;
}

/**
 * SidebarHeader Component
 * 
 * Header section of a sidebar with title and optional close button.
 * Enhanced with variants, icons, and better token integration.
 * Follows Atomic Design principles as a Molecule component.
 * 
 * @example
 * ```tsx
 * <SidebarHeader title="Navigation" onClose={handleClose} />
 * <SidebarHeader title="Settings" variant="compact" subtitle="Configure your preferences" />
 * ```
 */
export default function SidebarHeader({
  title,
  subtitle,
  icon,
  onClose,
  showCloseButton = false,
  variant = 'default',
  children,
  className = "",
  ...props
}: SidebarHeaderProps) {
  const paddingClasses = {
    default: `${getSpacingClass('md', 'px')} ${getSpacingClass('sm', 'py')}`,
    compact: `${getSpacingClass('sm', 'px')} ${getSpacingClass('xs', 'py')}`,
    minimal: `${getSpacingClass('sm', 'px')} ${getSpacingClass('xs', 'py')}`,
  };

  const borderClasses = variant === 'minimal' 
    ? '' 
    : `border-b ${getColorClass('neutral', 'DEFAULT', 'border')}`;

  const baseClasses = [
    "flex",
    "items-center",
    "justify-between",
    "shrink-0",
    "transition-all duration-200",
    paddingClasses[variant],
    borderClasses,
    getColorClass('neutral', 'light', 'bg'),
  ];

  const classes = [
    ...baseClasses,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {icon && (
          <div className="shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <Text 
            as="h2" 
            className={`
              ${getTypographyClasses('h4')}
              ${getColorClass('neutral', 'dark', 'text')}
              m-0
              font-semibold
              truncate
            `}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              as="p" 
              className={`
                ${getTypographyClasses('caption')}
                ${getColorClass('neutral', 'DEFAULT', 'text')}
                m-0
                mt-0.5
                truncate
              `}
            >
              {subtitle}
            </Text>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {children}
        {showCloseButton && onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
