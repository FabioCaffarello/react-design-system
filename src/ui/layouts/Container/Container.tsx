import React from 'react';
import { cn } from '../../utils';
import { getSpacingClass } from '../../tokens/spacing';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width of the container
   * @default 'lg'
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /**
   * Horizontal padding
   * @default 'base'
   */
  paddingX?: 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl';
  /**
   * Vertical padding
   * @default 'base'
   */
  paddingY?: 'xs' | 'sm' | 'md' | 'base' | 'lg' | 'xl';
  /**
   * Center the container content
   * @default true
   */
  center?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

/**
 * Container component for constraining content width and providing consistent padding
 * 
 * @example
 * ```tsx
 * <Container maxWidth="lg" paddingX="base">
 *   <h1>Content</h1>
 * </Container>
 * ```
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      maxWidth = 'lg',
      paddingX = 'base',
      paddingY = 'base',
      center = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          maxWidthClasses[maxWidth],
          getSpacingClass(paddingX, 'px'),
          getSpacingClass(paddingY, 'py'),
          center && 'mx-auto',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
