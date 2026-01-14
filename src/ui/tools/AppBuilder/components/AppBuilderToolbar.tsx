'use client';

import { Button } from '../../../atoms';
import type { ViewMode } from '../hooks/useAppBuilder';

export interface AppBuilderToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  showComponentPalette: boolean;
  onToggleComponentPalette: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

/**
 * AppBuilderToolbar
 *
 * Toolbar with view mode tabs and panel toggles.
 */
export function AppBuilderToolbar({
  viewMode,
  onViewModeChange,
  showComponentPalette,
  onToggleComponentPalette,
  sidebarCollapsed,
  onToggleSidebar,
}: AppBuilderToolbarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'design' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('design')}
        >
          Design
        </Button>
        <Button
          variant={viewMode === 'preview' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('preview')}
        >
          Preview
        </Button>
        <Button
          variant={viewMode === 'code' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onViewModeChange('code')}
        >
          Code
        </Button>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleComponentPalette}
        >
          {showComponentPalette ? 'Hide' : 'Show'} Palette
        </Button>
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            title={sidebarCollapsed ? 'Show sidebar' : 'Hide sidebar'}
          >
            {sidebarCollapsed ? '▶' : '◀'}
          </Button>
        )}
      </div>
    </div>
  );
}
