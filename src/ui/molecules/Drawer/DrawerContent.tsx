'use client';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { getRadiusClass } from '../../tokens/radius';
import { getShadowClass } from '../../tokens/shadows';
import { getZIndexClass } from '../../tokens/z-index';
import { getAnimationClass } from '../../tokens/animations';
import { getSpacingClass } from '../../tokens/spacing';
import { getColorClass } from '../../tokens/colors';
import { useDrawerContext } from './DrawerContext';
import { X } from 'lucide-react';
import { Button } from '../../atoms';

export interface DrawerContentProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

/**
 * DrawerContent Component
 * 
 * The main content container for the drawer.
 * Renders in a portal with overlay.
 */
export default function DrawerContent({
  children,
  className = '',
  showCloseButton = false,
}: DrawerContentProps) {
  const {
    isOpen,
    closeDrawer,
    position,
    size,
    closeOnOverlayClick,
    closeOnEscape,
  } = useDrawerContext();

  // Close on escape
  useEffect(() => {
    if (isOpen && closeOnEscape) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeDrawer();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, closeDrawer]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: position === 'left' || position === 'right' ? 'w-64' : 'h-64',
    md: position === 'left' || position === 'right' ? 'w-96' : 'h-96',
    lg: position === 'left' || position === 'right' ? 'w-[32rem]' : 'h-[32rem]',
    xl: position === 'left' || position === 'right' ? 'w-[42rem]' : 'h-[42rem]',
    full: position === 'left' || position === 'right' ? 'w-full' : 'h-full',
  };

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    top: 'top-0 left-0 right-0',
    bottom: 'bottom-0 left-0 right-0',
  };

  const drawerContent = (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed
          inset-0
          bg-black/50
          ${getZIndexClass('modal')}
          ${getAnimationClass('base')}
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={closeOnOverlayClick ? closeDrawer : undefined}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`
          fixed
          ${positionClasses[position]}
          ${sizeClasses[size]}
          ${position === 'left' || position === 'right' ? 'max-w-[90vw]' : 'max-h-[90vh]'}
          bg-white
          ${getShadowClass('xl')}
          ${getZIndexClass('modal')}
          ${getAnimationClass('base')}
          flex
          flex-col
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <div className={`
            flex
            justify-end
            ${getSpacingClass('sm', 'p')}
            border-b
            ${getColorClass('neutral', 'DEFAULT', 'border')}
          `}>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeDrawer}
              className="h-auto p-1"
              aria-label="Close drawer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {children}
      </div>
    </>
  );

  return typeof window !== 'undefined' ? createPortal(drawerContent, document.body) : null;
}
