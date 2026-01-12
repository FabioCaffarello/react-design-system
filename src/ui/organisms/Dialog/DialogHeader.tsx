'use client';

import { type HTMLAttributes, type ReactNode } from 'react';

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function DialogHeader({ children, className = '', ...props }: DialogHeaderProps) {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 pb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
