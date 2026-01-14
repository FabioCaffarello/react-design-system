'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  closeMenu: () => void;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export function MenuProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: MenuContextValue;
}) {
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenuContext() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu components must be used within Menu');
  }
  return context;
}
