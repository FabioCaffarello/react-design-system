'use client';

import { type ReactNode, type HTMLAttributes } from 'react';
import { getSpacingClass } from '../../tokens/spacing';
import { getRadiusClass } from '../../tokens/radius';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  attached?: boolean;
}

/**
 * ButtonGroup Component
 * 
 * A group of buttons displayed together.
 * Follows Atomic Design principles as a Molecule component.
 * 
 * @example
 * ```tsx
 * <ButtonGroup>
 *   <Button>Left</Button>
 *   <Button>Middle</Button>
 *   <Button>Right</Button>
 * </ButtonGroup>
 * ```
 */
export default function ButtonGroup({
  children,
  orientation = 'horizontal',
  size = 'md',
  attached = false,
  className = '',
  ...props
}: ButtonGroupProps) {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  };

  const spacingClasses = {
    sm: attached ? '' : 'gap-1',
    md: attached ? '' : 'gap-2',
    lg: attached ? '' : 'gap-3',
  };

  return (
    <div
      role="group"
      className={`
        inline-flex
        ${orientationClasses[orientation]}
        ${spacingClasses[size]}
        ${attached ? getRadiusClass('md') : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
