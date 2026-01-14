import { memo, type ReactNode } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { Button } from '../../atoms';
import { Badge } from '../../atoms';
import { SPACING_TOKENS } from '../../tokens/spacing';
import { TypographyTokenFactory } from '../../tokens/typography';
import { cn } from '../../utils';

export interface PlaygroundHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  onReset?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onShare?: () => void;
  isDirty?: boolean;
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
}

/**
 * PlaygroundHeader Component
 * 
 * Header component for playgrounds with title, actions, and status indicators.
 * 
 * @example
 * ```tsx
 * <PlaygroundHeader
 *   title="Theme Playground"
 *   description="Experiment with theme tokens"
 *   onReset={handleReset}
 *   onExport={handleExport}
 *   isDirty={hasChanges}
 * />
 * ```
 */
export const PlaygroundHeader = memo(function PlaygroundHeader({
  title,
  description,
  actions,
  onReset,
  onExport,
  onImport,
  onShare,
  isDirty = false,
  onToggleSidebar,
  sidebarCollapsed = false,
}: PlaygroundHeaderProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        'pb-6 border-b',
        isDark ? 'border-gray-700' : 'border-gray-200'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? '→' : '←'}
            </Button>
          )}
          <div className="flex-1 min-w-0">
            <h1
              className={cn('font-bold m-0 truncate')}
              style={{
                fontSize: TypographyTokenFactory.create('3xl').fontSize.px,
              }}
            >
              {title}
            </h1>
            {description && (
              <p
                className={cn('m-0 mt-1', isDark ? 'text-gray-400' : 'text-gray-600')}
                style={{
                  fontSize: TypographyTokenFactory.create('sm').fontSize.px,
                }}
              >
                {description}
              </p>
            )}
          </div>
          {isDirty && (
            <Badge variant="secondary" className="shrink-0">
              Unsaved
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle */}
          <div className="flex gap-1" style={{ gap: SPACING_TOKENS.xs.px }}>
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTheme('light')}
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
          </div>

          {/* Actions */}
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset}>
              Reset
            </Button>
          )}
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              Share
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              Export
            </Button>
          )}
          {onImport && (
            <Button variant="outline" size="sm" onClick={onImport}>
              Import
            </Button>
          )}

          {/* Custom Actions */}
          {actions}
        </div>
      </div>
    </div>
  );
});
