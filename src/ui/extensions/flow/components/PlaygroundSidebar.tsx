/**
 * Playground Sidebar Component
 *
 * Professional sidebar for the playground with tabs and content.
 * Enhanced with search, collapsible sections, and better organization.
 * Uses design system tokens for consistent styling.
 *
 * Refactored to use SideNavbar component from the design system.
 * Now uses all advanced features: collapsible, resizable, persistent, responsive.
 */

import React, { useState } from 'react';
import { PlaygroundTabs, type PlaygroundTabId } from './PlaygroundTabs';
import { PlaygroundSidebarContent } from './PlaygroundSidebarContent';
import { SideNavbar } from '../../../organisms/SideNavbar';

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

  return (
    <SideNavbar
      width="320px"
      navigationWidth="56px"
      resizable
      responsive
      minWidth={200}
      maxWidth={600}
      snapPoints={[200, 320, 480]}
      storageKey="playground-sidebar"
      persistWidth
      variant="default"
      className="h-full"
      aria-label="Playground sidebar with configuration panels"
      togglePosition="top"
    >
      <SideNavbar.Navbar>
        <PlaygroundTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          orientation="vertical"
          variant="compact"
        />
      </SideNavbar.Navbar>
      <SideNavbar.Sidebar>
        <SideNavbar.Sidebar.Header title={activeTabInfo.label} />
        <SideNavbar.Sidebar.Content>
          <PlaygroundSidebarContent
            activeTab={activeTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </SideNavbar.Sidebar.Content>
      </SideNavbar.Sidebar>
    </SideNavbar>
  );
}
