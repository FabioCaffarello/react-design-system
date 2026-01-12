'use client';

import { useId, type HTMLAttributes } from 'react';
import { useDialogContext } from './DialogContext';
import { getTypographyClasses } from '../../tokens';

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
}

export function DialogDescription({
  children,
  className = '',
  id,
  ...props
}: DialogDescriptionProps) {
  const context = useDialogContext();
  const generatedId = useId();
  const finalId = id || context.descriptionId || generatedId;

  return (
    <p
      id={finalId}
      className={`${getTypographyClasses('bodySmall')} text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
