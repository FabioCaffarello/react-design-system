import { memo, type ReactNode } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { SPACING_TOKENS } from '../../tokens/spacing';
import { cn } from '../../utils';

export interface PlaygroundSidebarProps {
  children: ReactNode;
  collapsed?: boolean;
  className?: string;
}

/**
 * PlaygroundSidebar Component
 * 
 * Sidebar container for playground controls with independent scrolling
 * and sticky positioning.
 * 
 * @example
 * ```tsx
 * <PlaygroundSidebar>
 *   <ControlGroup title="Colors">...</ControlGroup>
 *   <ControlGroup title="Spacing">...</ControlGroup>
 * </PlaygroundSidebar>
 * ```
 */
export function PlaygroundSidebar({
  children,
  collapsed = false,
  className,
}: PlaygroundSidebarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (collapsed) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        'sticky top-4 self-start',
        'max-h-[calc(100vh-2rem)]',
        'overflow-y-auto',
        'pr-2',
        className
      )}
      style={{
        gap: SPACING_TOKENS.lg.px,
      }}
    >
      {children}
    </div>
  );
}
