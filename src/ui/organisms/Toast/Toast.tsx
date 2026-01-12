'use client';

import { useEffect, useState, type HTMLAttributes } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { type Toast as ToastType } from './ToastContext';
import { getColorClass, getRadiusClass, getShadowClass } from '../../tokens';
import Button from '../../atoms/Button/Button';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  toast: ToastType;
  onDismiss: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const variantIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantColors = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
} as const;

export function Toast({ toast, onDismiss, position = 'top-right', className = '', style, ...props }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const Icon = variantIcons[toast.variant];
  const colorRole = variantColors[toast.variant];

  // Auto-dismiss
  useEffect(() => {
    if (toast.duration === undefined) return;

    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss(toast.id);
      }, 300); // Animation duration
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, toast.id, onDismiss]);

  // Show animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300);
  };

  return (
    <div
      className={`
        fixed ${positionClasses[position]} z-50
        w-full max-w-sm
        transition-all duration-300 ease-in-out
        ${isVisible && !isExiting ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
        ${isExiting ? 'opacity-0 translate-y-2' : ''}
        ${className}
      `}
      style={style}
      role="alert"
      aria-live={toast.variant === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      {...props}
    >
      <div
        className={`
          flex items-start gap-3
          p-4
          bg-white
          ${getRadiusClass('lg')}
          ${getShadowClass('lg')}
          border
          ${getColorClass(colorRole, 'DEFAULT', 'border')}
        `}
      >
        {/* Icon */}
        <div className={`flex-shrink-0 ${getColorClass(colorRole, 'DEFAULT', 'text')}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${getColorClass('neutral', 'dark', 'text')}`}>
            {toast.title}
          </div>
          {toast.description && (
            <div className={`mt-1 text-sm ${getColorClass('neutral', 'DEFAULT', 'text')}`}>
              {toast.description}
            </div>
          )}
          {toast.action && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.action?.onClick();
                  handleDismiss();
                }}
              >
                {toast.action.label}
              </Button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <Button
          variant="iconOnly"
          size="sm"
          onClick={handleDismiss}
          className="flex-shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
