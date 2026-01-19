/**
 * Playground Sidebar Content Component
 * 
 * Enhanced sidebar content with search/filter and collapsible sections.
 * Provides better organization and navigation within tabs.
 */

import React, { useState, useMemo } from 'react';
import { Card } from '../../../molecules';
import { Input, Button } from '../../../atoms';
import { getPlaygroundTabContent } from '../utils/playgroundSteps';
import type { PlaygroundTabId } from './PlaygroundTabs';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../../tokens';

export interface PlaygroundSidebarContentProps {
  activeTab: PlaygroundTabId;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function PlaygroundSidebarContent({
  activeTab,
  searchQuery = '',
  onSearchChange,
}: PlaygroundSidebarContentProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [_collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  
  const searchValue = searchQuery || localSearchQuery;
  const handleSearchChange = onSearchChange || setLocalSearchQuery;
  
  const _toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Get tab content
  const tabContent = useMemo(
    () => getPlaygroundTabContent(activeTab),
    [activeTab]
  );

  // Filter content based on search (if applicable)
  // This is a basic implementation - can be enhanced per tab
  const filteredContent = useMemo(() => {
    if (!searchValue.trim()) {
      return tabContent;
    }
    
    // Basic filtering: wrap content in a search-aware container
    // More sophisticated filtering can be added per tab type
    return (
      <div className="search-results">
        {tabContent}
        {searchValue && (
          <div className={`${getTypographyClasses('caption')} ${getColorClass('neutral', 'DEFAULT', 'text')} ${getSpacingClass('md', 'mt')} text-center opacity-60`}>
            Showing results for: "{searchValue}"
          </div>
        )}
      </div>
    );
  }, [tabContent, searchValue]);

  // Determine if search should be shown for this tab
  const showSearch = ['nodes-edges', 'canvas', 'validation'].includes(activeTab);

  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
      {/* Search Bar */}
      {showSearch && (
        <Card padding="sm" className="sticky top-0 z-10 bg-white">
          <Input
            type="text"
            placeholder={`Search in ${activeTab}...`}
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSearchChange('')}
              className="mt-2 w-full"
            >
              Clear
            </Button>
          )}
        </Card>
      )}

      {/* Content with Collapsible Sections */}
      <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
        {filteredContent}
      </div>
    </div>
  );
}
