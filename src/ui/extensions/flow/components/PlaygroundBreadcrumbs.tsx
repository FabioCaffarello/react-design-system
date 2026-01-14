/**
 * Playground Breadcrumbs Component
 * 
 * Shows the current location in the playground (tab and context).
 * Provides visual feedback about where the user is in the navigation.
 */

import React from 'react';
import type { PlaygroundTabId } from './PlaygroundTabs';
import { playgroundTabs } from './PlaygroundTabs';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../../tokens';

export interface PlaygroundBreadcrumbsProps {
  activeTab: PlaygroundTabId;
  context?: string;
}

export function PlaygroundBreadcrumbs({ 
  activeTab, 
  context 
}: PlaygroundBreadcrumbsProps) {
  const activeTabInfo = playgroundTabs.find(tab => tab.id === activeTab);
  
  return (
    <nav
      className={`
        flex items-center
        ${getSpacingClass('sm', 'gap')}
        ${getTypographyClasses('caption')}
        ${getColorClass('neutral', 'DEFAULT', 'text')}
      `}
      aria-label="Breadcrumb navigation"
    >
      <span className="opacity-60">Playground</span>
      <span className="opacity-40">/</span>
      {activeTabInfo && (
        <>
          <span className="flex items-center gap-1">
            {activeTabInfo.icon && (
              <span className="text-sm">{activeTabInfo.icon}</span>
            )}
            <span>{activeTabInfo.label}</span>
          </span>
          {context && (
            <>
              <span className="opacity-40">/</span>
              <span className={getColorClass('primary', 'DEFAULT', 'text')}>
                {context}
              </span>
            </>
          )}
        </>
      )}
    </nav>
  );
}
