'use client';

import type { HTMLAttributes, ReactNode } from "react";
import { Text, Button } from "../../../atoms";

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  children?: ReactNode;
}

/**
 * SidebarHeader Component
 * 
 * Header section of a sidebar with title and optional close button.
 * Follows Atomic Design principles as a Molecule component.
 * 
 * @example
 * ```tsx
 * <SidebarHeader title="Navigation" onClose={handleClose} />
 * ```
 */
export default function SidebarHeader({
  title,
  onClose,
  showCloseButton = false,
  children,
  className = "",
  ...props
}: SidebarHeaderProps) {
  const baseClasses = [
    "flex",
    "items-center",
    "justify-between",
    "px-4",
    "py-4",
    "border-b",
    "border-gray-200",
  ];

  const classes = [
    ...baseClasses,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      <Text as="h2" className="text-lg font-semibold text-gray-900">
        {title}
      </Text>
      <div className="flex items-center space-x-2">
        {children}
        {showCloseButton && onClose && (
          <Button
            variant="secondary"
            onClick={onClose}
            className="p-1"
            aria-label="Close sidebar"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
