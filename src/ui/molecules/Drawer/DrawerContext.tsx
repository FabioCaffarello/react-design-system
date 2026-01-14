'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { DrawerPosition } from './Drawer';

export interface DrawerContextValue {
  isOpen: boolean;
  closeDrawer: () => void;
  position: DrawerPosition;
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick: boolean;
  closeOnEscape: boolean;
}

const DrawerContext = createContext<DrawerContextValue | undefined>(undefined);

export function DrawerProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: DrawerContextValue;
}) {
  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useDrawerContext() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('Drawer components must be used within Drawer');
  }
  return context;
}
