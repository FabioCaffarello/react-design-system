'use client';

/**
 * Playground Header Component
 * 
 * Professional header for the playground with Apply Changes functionality.
 * Uses design system tokens for consistent styling.
 */

import React, { useState, useCallback } from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Button, Badge } from '../../../atoms';
import Tooltip from '../../../atoms/Tooltip/Tooltip';
import { PlaygroundBreadcrumbs } from './PlaygroundBreadcrumbs';
import { PlaygroundSearch } from './PlaygroundSearch';
import { usePlaygroundContext } from '../context/PlaygroundContext';
import { useKeyboardShortcuts, PLAYGROUND_SHORTCUTS } from '../hooks/useKeyboardShortcuts';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses,
  getShadowClass 
} from '../../../tokens';

export function PlaygroundHeader() {
  const { 
    hasPendingChanges, 
    applyChanges, 
    discardChanges,
    canUndo,
    canRedo,
    undo,
    redo,
    searchQuery,
    setSearchQuery,
    searchResults,
    activeTab = 'nodes-edges',
  } = usePlaygroundContext();
  
  const [showSearch, setShowSearch] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: true,
    shortcuts: [
      {
        ...PLAYGROUND_SHORTCUTS.UNDO,
        action: () => canUndo && undo(),
      },
      {
        ...PLAYGROUND_SHORTCUTS.REDO,
        action: () => canRedo && redo(),
      },
      {
        ...PLAYGROUND_SHORTCUTS.SEARCH,
        action: () => setShowSearch(!showSearch),
      },
    ],
  });

  const handleApplyChanges = useCallback(async () => {
    setIsApplying(true);
    try {
      applyChanges();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } finally {
      setTimeout(() => setIsApplying(false), 300);
    }
  }, [applyChanges]);

  const handleDiscardChanges = useCallback(async () => {
    if (!window.confirm('Are you sure you want to discard all pending changes?')) {
      return;
    }
    setIsDiscarding(true);
    try {
      discardChanges();
    } finally {
      setTimeout(() => setIsDiscarding(false), 300);
    }
  }, [discardChanges]);

  return (
    <header
      className={`
        ${getSpacingClass('base', 'px')}
        ${getSpacingClass('md', 'py')}
        ${getShadowClass('sm')}
        border-b
        ${getColorClass('neutral', 'DEFAULT', 'border')}
        flex items-center justify-between
        sticky top-0 z-50
        transition-all duration-200
      `}
      style={{
        minHeight: '56px',
        backgroundColor: '#ffffff', // White header for contrast
      }}
      role="banner"
      aria-label="Playground header with navigation and controls"
    >
      {/* ARIA live region for status updates */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        id="playground-status"
      >
        {hasPendingChanges && 'You have unsaved changes'}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5" />
          <h1
            className={`
              ${getTypographyClasses('h3')}
              ${getColorClass('neutral', 'dark', 'text')}
              m-0
            `}
            id="playground-title"
          >
            React Flow Playground
          </h1>
          {hasPendingChanges && (
            <Badge 
              variant="warning" 
              size="sm"
              className="animate-pulse"
            >
              Unsaved
            </Badge>
          )}
          {showSuccess && (
            <Badge 
              variant="success" 
              size="sm"
              className="animate-fade-in flex items-center gap-1"
            >
              <CheckCircle2 className="h-3 w-3" />
              Saved
            </Badge>
          )}
        </div>
      </div>
      
      <div className={`flex items-center ${getSpacingClass('sm', 'gap')}`}>
        {hasPendingChanges && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDiscardChanges}
            disabled={isDiscarding}
            style={{ minWidth: '80px' }}
            className="transition-all duration-200"
          >
            {isDiscarding ? 'Discarding...' : 'Discard'}
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={handleApplyChanges}
          disabled={!hasPendingChanges || isApplying}
          style={{ minWidth: '120px' }}
          className="transition-all duration-200"
        >
          {isApplying ? 'Applying...' : 'Apply Changes'}
        </Button>
      </div>
    </header>
  );
}
