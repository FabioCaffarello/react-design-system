'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getRadiusClass } from '../../tokens/radius';
import { getShadowClass } from '../../tokens/shadows';
import { getZIndexClass } from '../../tokens/z-index';
import { getSpacingClass } from '../../tokens/spacing';
import { getColorClass } from '../../tokens/colors';
import { useMenuContext } from './MenuContext';

export interface MenuContentProps {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'end' | 'center';
}

/**
 * MenuContent Component
 * 
 * The content container for menu items.
 * Renders in a portal and positions itself relative to the trigger.
 */
export default function MenuContent({
  children,
  className = '',
  align = 'start',
}: MenuContentProps) {
  const { isOpen, closeMenu, placement } = useMenuContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Find trigger element
  useEffect(() => {
    if (isOpen) {
      // Find the trigger by looking for element with aria-haspopup="menu"
      const trigger = document.querySelector('[aria-haspopup="menu"]') as HTMLElement;
      triggerRef.current = trigger;
    }
  }, [isOpen]);

  // Calculate position
  useEffect(() => {
    if (isOpen && contentRef.current && triggerRef.current) {
      const updatePosition = () => {
        const triggerRect = triggerRef.current!.getBoundingClientRect();
        const contentRect = contentRef.current!.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        let top = 0;
        let left = 0;

        if (placement === 'bottom') {
          top = triggerRect.bottom + scrollY + 4;
          if (align === 'start') left = triggerRect.left + scrollX;
          else if (align === 'end') left = triggerRect.right + scrollX - contentRect.width;
          else left = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2;
        } else if (placement === 'top') {
          top = triggerRect.top + scrollY - contentRect.height - 4;
          if (align === 'start') left = triggerRect.left + scrollX;
          else if (align === 'end') left = triggerRect.right + scrollX - contentRect.width;
          else left = triggerRect.left + scrollX + (triggerRect.width - contentRect.width) / 2;
        } else if (placement === 'right') {
          left = triggerRect.right + scrollX + 4;
          if (align === 'start') top = triggerRect.top + scrollY;
          else if (align === 'end') top = triggerRect.bottom + scrollY - contentRect.height;
          else top = triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2;
        } else if (placement === 'left') {
          left = triggerRect.left + scrollX - contentRect.width - 4;
          if (align === 'start') top = triggerRect.top + scrollY;
          else if (align === 'end') top = triggerRect.bottom + scrollY - contentRect.height;
          else top = triggerRect.top + scrollY + (triggerRect.height - contentRect.height) / 2;
        }

        // Keep within viewport
        const padding = 8;
        top = Math.max(padding, Math.min(top, window.innerHeight + scrollY - contentRect.height - padding));
        left = Math.max(padding, Math.min(left, window.innerWidth + scrollX - contentRect.width - padding));

        setPosition({ top, left });
      };

      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, placement, align]);

  // Close on escape
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeMenu();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeMenu]);

  // Close on click outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          contentRef.current &&
          triggerRef.current &&
          !contentRef.current.contains(e.target as Node) &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          closeMenu();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeMenu]);

  if (!isOpen) return null;

  const menuContent = (
    <div
      ref={contentRef}
      role="menu"
      className={`
        absolute
        ${getZIndexClass('popover')}
        bg-white
        ${getRadiusClass('md')}
        ${getShadowClass('lg')}
        border
        ${getColorClass('neutral', 'DEFAULT', 'border')}
        min-w-[160px]
        ${getSpacingClass('xs', 'py')}
        ${className}
      `}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(menuContent, document.body) : null;
}
