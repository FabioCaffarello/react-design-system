/**
 * Playground Layout Component
 * 
 * Main layout component for the playground with split-view:
 * - Left: Tabs and Content
 * - Right: Canvas
 * 
 * Uses design system tokens for consistent styling.
 */

import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { PlaygroundProvider, usePlaygroundContext } from '../context/PlaygroundContext';
import { PlaygroundSidebar } from './PlaygroundSidebar';
import { PlaygroundHeader } from './PlaygroundHeader';
import { PlaygroundCanvas } from './PlaygroundCanvas';
import { PlaygroundErrorBoundary } from './PlaygroundErrorBoundary';
import { PlaygroundDevTools } from './PlaygroundDevTools';
import { useKeyboardShortcuts, PLAYGROUND_SHORTCUTS } from '../hooks/useKeyboardShortcuts';
import { updateRoute, onRouteChange, getCurrentRoute } from '../utils/playgroundRouting';
import { Spinner } from '../../../atoms';
import type { PlaygroundTabId } from './PlaygroundTabs';
import { 
  getColorClass 
} from '../../../tokens';

// Lazy load heavy components for better initial load performance
const PlaygroundOnboarding = lazy(() => 
  import('./PlaygroundOnboarding').then(module => ({ default: module.PlaygroundOnboarding }))
);
const PlaygroundHelpPanel = lazy(() => 
  import('./PlaygroundOnboarding').then(module => ({ default: module.PlaygroundHelpPanel }))
);

/**
 * Inner component that uses context
 */
function PlaygroundLayoutInner() {
  const { activeTab: contextActiveTab, setActiveTab: setContextActiveTab } = usePlaygroundContext();
  const [localActiveTab, setLocalActiveTab] = useState<PlaygroundTabId>(
    (contextActiveTab as PlaygroundTabId) || 'nodes-edges'
  );
  
  const activeTab = (contextActiveTab as PlaygroundTabId) || localActiveTab;
  
  const handleTabChange = useCallback((tabId: PlaygroundTabId) => {
    setLocalActiveTab(tabId);
    if (setContextActiveTab) {
      setContextActiveTab(tabId);
    }
    // Update URL hash for deep linking
    updateRoute({ tab: tabId }, true);
  }, [setContextActiveTab]);
  
  // Initialize from URL hash
  useEffect(() => {
    const currentRoute = getCurrentRoute();
    if (currentRoute && currentRoute.tab) {
      handleTabChange(currentRoute.tab);
    }
    
    // Listen to hash changes
    const unsubscribe = onRouteChange((route) => {
      if (route && route.tab) {
        handleTabChange(route.tab);
      }
    });
    
    return unsubscribe;
  }, [handleTabChange]);
  
  // Keyboard shortcuts for tab navigation
  useKeyboardShortcuts({
    enabled: true,
    shortcuts: [
      {
        ...PLAYGROUND_SHORTCUTS.TAB_1,
        action: () => handleTabChange('nodes-edges'),
      },
      {
        ...PLAYGROUND_SHORTCUTS.TAB_2,
        action: () => handleTabChange('canvas'),
      },
      {
        ...PLAYGROUND_SHORTCUTS.TAB_3,
        action: () => handleTabChange('background'),
      },
      {
        ...PLAYGROUND_SHORTCUTS.TAB_4,
        action: () => handleTabChange('layout'),
      },
      {
        ...PLAYGROUND_SHORTCUTS.TAB_5,
        action: () => handleTabChange('validation'),
      },
      {
        ...PLAYGROUND_SHORTCUTS.TAB_6,
        action: () => handleTabChange('code'),
      },
      {
        ...PLAYGROUND_SHORTCUTS.TAB_7,
        action: () => handleTabChange('settings'),
      },
    ],
  });

  return (
    <PlaygroundErrorBoundary>
      <div
        className={`flex flex-col overflow-hidden ${getColorClass('neutral', 'light', 'bg')}`}
        style={{
          height: '100vh',
          width: '100vw',
          backgroundColor: '#fafafa', // Softer than white, more pleasant gray
        }}
      >
        <PlaygroundHeader />
        <div className="flex flex-1 overflow-hidden min-h-0">
          <div data-onboarding="tabs" className="flex-shrink-0 h-full">
            <PlaygroundSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>
          <div
            className="flex-1 relative overflow-hidden min-w-0"
            data-onboarding="canvas"
            style={{
              backgroundColor: '#fafafa', // Softer than white, more pleasant gray
            }}
          >
            <PlaygroundCanvas />
          </div>
        </div>
        <Suspense fallback={null}>
          <PlaygroundOnboarding />
          <PlaygroundHelpPanel />
        </Suspense>
        {import.meta.env.DEV && (
          <PlaygroundDevTools enabled={true} />
        )}
      </div>
    </PlaygroundErrorBoundary>
  );
}

export interface PlaygroundLayoutProps {
  initialState?: Partial<import('../context/PlaygroundContext').PlaygroundState>;
}

/**
 * Main Playground Layout Component
 */
export function PlaygroundLayout({ initialState }: PlaygroundLayoutProps) {
  return (
    <PlaygroundProvider initialState={initialState}>
      <PlaygroundLayoutInner />
    </PlaygroundProvider>
  );
}
