'use client';

import { useState, type ReactNode } from 'react';
import DrawerContent from './DrawerContent';
import DrawerHeader from './DrawerHeader';
import DrawerFooter from './DrawerFooter';
import { DrawerProvider } from './DrawerContext';

export type DrawerPosition = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  position?: DrawerPosition;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

/**
 * Drawer Component
 * 
 * A side drawer component that slides in from different positions.
 * Follows Atomic Design principles as an Atom component.
 * Uses Compound Component pattern.
 * 
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <h2>Title</h2>
 *     </DrawerHeader>
 *     <p>Content goes here</p>
 *     <DrawerFooter>
 *       <Button>Close</Button>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export default function Drawer({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  position = 'right',
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <DrawerProvider
      value={{
        isOpen,
        closeDrawer,
        position,
        size,
        closeOnOverlayClick,
        closeOnEscape,
      }}
    >
      {children}
    </DrawerProvider>
  );
}

// Export sub-components for compound pattern
Drawer.Content = DrawerContent;
Drawer.Header = DrawerHeader;
Drawer.Footer = DrawerFooter;
