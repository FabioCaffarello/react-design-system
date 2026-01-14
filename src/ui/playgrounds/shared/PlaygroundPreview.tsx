import { memo, type ReactNode } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { SPACING_TOKENS } from '../../tokens/spacing';
import { cn } from '../../utils';

export interface PlaygroundPreviewProps {
  children: ReactNode;
  showGrid?: boolean;
  zoom?: number;
  className?: string;
}

/**
 * PlaygroundPreview Component
 * 
 * Preview area for playgrounds with optional grid reference and zoom.
 * 
 * @example
 * ```tsx
 * <PlaygroundPreview showGrid zoom={1.5}>
 *   <ComponentPreview />
 * </PlaygroundPreview>
 * ```
 */
export const PlaygroundPreview = memo(function PlaygroundPreview({
  children,
  showGrid = false,
  zoom = 1,
  className,
}: PlaygroundPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        'overflow-auto',
        className
      )}
      style={{
        gap: SPACING_TOKENS.lg.px,
        backgroundImage: showGrid
          ? `linear-gradient(${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
             linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)`
          : undefined,
        backgroundSize: showGrid ? '20px 20px' : undefined,
        transform: zoom !== 1 ? `scale(${zoom})` : undefined,
        transformOrigin: 'top left',
      }}
    >
      {children}
    </div>
  );
});
