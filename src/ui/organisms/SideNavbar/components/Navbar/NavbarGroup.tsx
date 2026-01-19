'use client';

import React, { useState, type HTMLAttributes } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../../../utils';
import type { NavbarGroupProps } from '../../types';

/**
 * NavbarGroup Component
 *
 * Groups navbar items with optional label and collapsible behavior.
 *
 * @example
 * ```tsx
 * <SideNavbar.Navbar>
 *   <SideNavbar.Navbar.Group label="Main" collapsible>
 *     <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
 *     <SideNavbar.Navbar.Item icon={<Settings />} label="Settings" />
 *   </SideNavbar.Navbar.Group>
 * </SideNavbar.Navbar>
 * ```
 */
export function NavbarGroup({
  id,
  label,
  collapsible = false,
  defaultCollapsed = false,
  children,
  className,
  ...props
}: NavbarGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div
      id={id}
      className={cn('flex flex-col', className)}
      {...props}
    >
      {label && (
        <div
          className={cn(
            'px-2 py-1.5 text-xs text-gray-500 uppercase tracking-wider', // py-1.5 para melhor espaçamento vertical
            collapsible && 'cursor-pointer hover:text-gray-700'
          )}
          onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
        >
          <div className="flex items-center gap-1.5"> {/* gap-1.5 para melhor espaçamento entre chevron e label */}
            {collapsible && (
              <span className="shrink-0">
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3" style={{ transition: 'none', transform: 'none' }} />
                ) : (
                  <ChevronDown className="w-3 h-3" style={{ transition: 'none', transform: 'none' }} />
                )}
              </span>
            )}
            <span>{label}</span>
          </div>
        </div>
      )}
      {!isCollapsed && (
        <div className="flex flex-col gap-2"> {/* gap-2 para consistência com outros componentes */}
          {children}
        </div>
      )}
    </div>
  );
}
