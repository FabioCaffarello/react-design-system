'use client';

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { getSpacingClass } from '../../tokens/spacing';
import { getRadiusClass } from '../../tokens/radius';
import { getShadowClass } from '../../tokens/shadows';
import { getZIndexClass } from '../../tokens/z-index';
import { getAnimationClass } from '../../tokens/animations';
import { getColorClass } from '../../tokens/colors';
import { getTypographySize, getTypographyWeight } from '../../tokens/typography';
import Button from '../../atoms/Button/Button';

export type PopoverPlacement = 
  | 'top' 
  | 'top-start' 
  | 'top-end'
  | 'bottom' 
  | 'bottom-start' 
  | 'bottom-end'
  | 'left' 
  | 'left-start' 
  | 'left-end'
  | 'right' 
  | 'right-start' 
  | 'right-end';

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopoverPlacement;
  showCloseButton?: boolean;
  title?: string;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

/**
 * Popover Component
 * 
 * A popover component that displays content in a floating panel.
 * Supports positioning, portal rendering, and keyboard navigation.
 * Follows Atomic Design principles as an Atom component.
 * 
 * @example
 * ```tsx
 * <Popover
 *   trigger={<Button>Open Popover</Button>}
 *   title="Popover Title"
 * >
 *   <p>Popover content goes here</p>
 * </Popover>
 * ```
 */
export default function Popover({
  trigger,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  showCloseButton = false,
  title,
  closeOnClickOutside = true,
  closeOnEscape = true,
  className = '',
  triggerClassName = '',
  contentClassName = '',
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = 0;
    let left = 0;

    // Calculate position based on placement
    if (placement.startsWith('top')) {
      top = triggerRect.top + scrollY - popoverRect.height - 8;
      if (placement === 'top-start') left = triggerRect.left + scrollX;
      else if (placement === 'top-end') left = triggerRect.right + scrollX - popoverRect.width;
      else left = triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2;
    } else if (placement.startsWith('bottom')) {
      top = triggerRect.bottom + scrollY + 8;
      if (placement === 'bottom-start') left = triggerRect.left + scrollX;
      else if (placement === 'bottom-end') left = triggerRect.right + scrollX - popoverRect.width;
      else left = triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2;
    } else if (placement.startsWith('left')) {
      left = triggerRect.left + scrollX - popoverRect.width - 8;
      if (placement === 'left-start') top = triggerRect.top + scrollY;
      else if (placement === 'left-end') top = triggerRect.bottom + scrollY - popoverRect.height;
      else top = triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2;
    } else if (placement.startsWith('right')) {
      left = triggerRect.right + scrollX + 8;
      if (placement === 'right-start') top = triggerRect.top + scrollY;
      else if (placement === 'right-end') top = triggerRect.bottom + scrollY - popoverRect.height;
      else top = triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2;
    }

    // Keep within viewport
    const padding = 8;
    top = Math.max(padding, Math.min(top, window.innerHeight + scrollY - popoverRect.height - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth + scrollX - popoverRect.width - padding));

    setPosition({ top, left });
  }, [placement]);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen, placement, updatePosition]);

  useEffect(() => {
    if (isOpen && popoverRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(updatePosition, 0);
    }
  }, [isOpen, updatePosition]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [isControlled, onOpenChange]);

  const handleClose = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  useEffect(() => {
    if (isOpen && closeOnEscape) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, handleClose]);

  useEffect(() => {
    if (isOpen && closeOnClickOutside) {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          popoverRef.current &&
          triggerRef.current &&
          !popoverRef.current.contains(e.target as Node) &&
          !triggerRef.current.contains(e.target as Node)
        ) {
          handleClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, closeOnClickOutside, handleClose]);

  const popoverContent = isOpen ? (
    <div
      ref={popoverRef}
      className={`
        absolute
        ${getZIndexClass('popover')}
        bg-white
        ${getRadiusClass('lg')}
        ${getShadowClass('lg')}
        border
        ${getColorClass('neutral', 'DEFAULT', 'border')}
        min-w-[200px]
        max-w-[400px]
        ${getAnimationClass('base')}
        ${contentClassName}
      `}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role="dialog"
      aria-modal="false"
    >
      {(title || showCloseButton) && (
        <div className={`
          flex
          items-center
          justify-between
          ${getSpacingClass('base', 'px')}
          ${getSpacingClass('md', 'py')}
          border-b
          ${getColorClass('neutral', 'DEFAULT', 'border')}
        `}>
          {title && (
            <h3 className={`${getTypographySize('bodySmall')} ${getTypographyWeight('h5')} ${getColorClass('neutral', 'dark', 'text')}`}>{title}</h3>
          )}
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-auto p-1"
              aria-label="Close popover"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      <div className={`
        ${getSpacingClass('base', 'p')}
        ${title || showCloseButton ? '' : getSpacingClass('md', 'p')}
      `}>
        {children}
      </div>
    </div>
  ) : null;

  return (
    <div className={`inline-block ${className}`}>
      <div
        ref={triggerRef}
        className={triggerClassName}
        onClick={() => handleOpenChange(!isOpen)}
      >
        {trigger}
      </div>
      {typeof window !== 'undefined' && createPortal(popoverContent, document.body)}
    </div>
  );
}
