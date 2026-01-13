/**
 * Playground Sidebar Component
 * 
 * Professional sidebar for the playground with tabs and content.
 * Enhanced with search, collapsible sections, and better organization.
 * Uses design system tokens for consistent styling.
 * 
 * Refactored to use SplitSidebar and SidebarContent components from the design system.
 * Now uses all advanced features: collapsible, resizable, persistent, responsive.
 */

import React, { useState } from 'react';
import { PlaygroundTabs, type PlaygroundTabId } from './PlaygroundTabs';
import { PlaygroundSidebarContent } from './PlaygroundSidebarContent';
import SplitSidebar from '../../../organisms/SplitSidebar/SplitSidebar';
import { createPlaygroundSidebarConfig } from '../../../organisms/SplitSidebar/utils/splitSidebarHelpers';

export interface PlaygroundSidebarProps {
  activeTab: PlaygroundTabId;
  onTabChange: (tabId: PlaygroundTabId) => void;
}

export function PlaygroundSidebar({
  activeTab,
  onTabChange,
}: PlaygroundSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Get active tab info for title
  const activeTabInfo = React.useMemo(() => {
    const tabs = [
      { id: 'nodes-edges', label: 'Nodes & Edges' },
      { id: 'canvas', label: 'Canvas' },
      { id: 'background', label: 'Background' },
      { id: 'layout', label: 'Layout' },
      { id: 'validation', label: 'Validation' },
      { id: 'code', label: 'Code' },
      { id: 'settings', label: 'Settings' },
    ];
    return tabs.find(t => t.id === activeTab) || tabs[0];
  }, [activeTab]);

  // Use playground configuration with all advanced features
  const sidebarConfig = createPlaygroundSidebarConfig({
    width: '320px',
    navigationWidth: '56px',
    collapsible: true,
    responsive: true,
    resizable: true,
    minWidth: 200,
    maxWidth: 600,
    snapPoints: [200, 320, 480],
    storageKey: 'playground-sidebar',
    persistState: 'localStorage',
    persistWidth: true,
    variant: 'default',
  });

  return (
    <SplitSidebar
      {...sidebarConfig}
      className="h-full"
      role="complementary"
      aria-label="Playground sidebar with configuration panels"
    >
      <SplitSidebar.Navigation>
        <PlaygroundTabs 
          activeTab={activeTab} 
          onTabChange={onTabChange} 
          orientation="vertical"
          variant="compact"
        />
      </SplitSidebar.Navigation>
      <SplitSidebar.Content title={activeTabInfo.label}>
        <SplitSidebar.Toggle position="top" />
        <PlaygroundSidebarContent
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </SplitSidebar.Content>
    </SplitSidebar>
  );
}
