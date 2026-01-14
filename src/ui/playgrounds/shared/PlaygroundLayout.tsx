import { useState, memo, type ReactNode } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import { Button } from '../../atoms';
import { SPACING_TOKENS } from '../../tokens/spacing';
import { cn } from '../../utils';
import { PlaygroundHeader } from './PlaygroundHeader';
import { PlaygroundSidebar } from './PlaygroundSidebar';
import { PlaygroundPreview } from './PlaygroundPreview';

export interface PlaygroundLayoutProps {
  title: string;
  description?: string;
  sidebarContent: ReactNode;
  previewContent: ReactNode;
  headerActions?: ReactNode;
  onReset?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onShare?: () => void;
  isDirty?: boolean;
  className?: string;
}

/**
 * PlaygroundLayout Component
 * 
 * Responsive layout component for playgrounds with collapsible sidebar.
 * Adapts to desktop (sidebar + preview) and mobile (tabs) layouts.
 * 
 * @example
 * ```tsx
 * <PlaygroundLayout
 *   title="Theme Playground"
 *   sidebarContent={<Controls />}
 *   previewContent={<Preview />}
 * />
 * ```
 */
export const PlaygroundLayout = memo(function PlaygroundLayout({
  title,
  description,
  sidebarContent,
  previewContent,
  headerActions,
  onReset,
  onExport,
  onImport,
  onShare,
  isDirty = false,
  className,
}: PlaygroundLayoutProps) {
  const { theme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState<'controls' | 'preview'>('controls');

  const isDark = theme === 'dark';

  return (
    <div
      className={cn(
        'flex flex-col',
        'min-h-screen',
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
        className
      )}
      style={{
        padding: SPACING_TOKENS.base.px,
        gap: SPACING_TOKENS.lg.px,
      }}
    >
      <PlaygroundHeader
        title={title}
        description={description}
        actions={headerActions}
        onReset={onReset}
        onExport={onExport}
        onImport={onImport}
        onShare={onShare}
        isDirty={isDirty}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Mobile Tabs */}
      <div className="md:hidden flex gap-2 border-b" style={{ borderColor: isDark ? '#333' : '#e5e5e5' }}>
        <button
          onClick={() => setMobileView('controls')}
          className={cn(
            'px-4 py-2 font-medium transition-colors',
            mobileView === 'controls'
              ? isDark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'
              : isDark ? 'text-gray-400' : 'text-gray-600'
          )}
        >
          Controls
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={cn(
            'px-4 py-2 font-medium transition-colors',
            mobileView === 'preview'
              ? isDark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'
              : isDark ? 'text-gray-400' : 'text-gray-600'
          )}
        >
          Preview
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-[300px_1fr] gap-6 flex-1">
        <PlaygroundSidebar collapsed={sidebarCollapsed}>
          {sidebarContent}
        </PlaygroundSidebar>
        <PlaygroundPreview>
          {previewContent}
        </PlaygroundPreview>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex-1 overflow-auto">
        {mobileView === 'controls' ? (
          <PlaygroundSidebar collapsed={false}>
            {sidebarContent}
          </PlaygroundSidebar>
        ) : (
          <PlaygroundPreview>
            {previewContent}
          </PlaygroundPreview>
        )}
      </div>
    </div>
  );
});
