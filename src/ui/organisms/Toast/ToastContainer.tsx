'use client';

import { createPortal } from 'react-dom';
import { useToastContext } from '../../providers/ToastContext';
import { Toast } from './Toast';

export interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export function ToastContainer({
  position = 'top-right',
  maxToasts,
}: ToastContainerProps) {
  const { toasts, removeToast } = useToastContext();

  const toastsToShow = maxToasts ? toasts.slice(0, maxToasts) : toasts;

  if (toastsToShow.length === 0) return null;

  const container = (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toastsToShow.map((toast, index) => {
        const isTop = position.includes('top');
        // Calculate offset: base 1rem + (index * 5rem for spacing)
        const offset = 1 + index * 5;
        
        return (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={removeToast}
            position={position}
            style={{
              [isTop ? 'top' : 'bottom']: `${offset}rem`,
            }}
          />
        );
      })}
    </div>
  );

  // Portal rendering
  if (typeof window !== 'undefined') {
    return createPortal(container, document.body);
  }

  return container;
}
