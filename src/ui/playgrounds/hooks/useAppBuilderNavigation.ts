'use client';

import { useState, useCallback, useMemo } from 'react';

export type AppBuilderSection = 'apps' | 'features' | 'templates' | 'settings' | 'global-config';

export interface AppBuilderNavigationState {
  activeSection: AppBuilderSection;
  activeFeatureId?: string;
  sidebarSlot?: string;
  isSetupMode?: boolean; // When creating new app
}

export interface UseAppBuilderNavigationOptions {
  initialSection?: AppBuilderSection;
  initialFeatureId?: string;
}

export interface UseAppBuilderNavigationReturn {
  // State
  activeSection: AppBuilderSection;
  activeFeatureId?: string;
  sidebarSlot?: string;
  // Actions
  setActiveSection: (section: AppBuilderSection) => void;
  setActiveFeatureId: (featureId?: string) => void;
  setSidebarSlot: (slot?: string) => void;
  // Helpers
  isSectionActive: (section: AppBuilderSection) => boolean;
  navigateToSection: (section: AppBuilderSection, slot?: string) => void;
}

/**
 * Hook for managing navigation state in App Builder Playground
 * 
 * Manages navigation between sections (Apps, Features, Templates, Settings)
 * and coordinates sidebar slot content.
 */
export function useAppBuilderNavigation(
  options: UseAppBuilderNavigationOptions = {}
): UseAppBuilderNavigationReturn {
  const { initialSection = 'apps', initialFeatureId } = options;

  const [activeSection, setActiveSectionState] = useState<AppBuilderSection>(initialSection);
  const [activeFeatureId, setActiveFeatureIdState] = useState<string | undefined>(initialFeatureId);
  const [sidebarSlot, setSidebarSlotState] = useState<string | undefined>();

  const setActiveSection = useCallback((section: AppBuilderSection) => {
    setActiveSectionState(section);
    // Auto-set sidebar slot based on section
    if (section === 'apps') {
      setSidebarSlotState('apps');
    } else if (section === 'templates') {
      setSidebarSlotState('templates');
    } else if (section === 'features') {
      setSidebarSlotState('features');
    } else if (section === 'settings') {
      setSidebarSlotState('settings');
    } else if (section === 'global-config') {
      setSidebarSlotState('global-config');
    }
  }, []);

  const setActiveFeatureId = useCallback((featureId?: string) => {
    setActiveFeatureIdState(featureId);
    // When a feature is selected, switch to features section
    if (featureId) {
      setActiveSectionState('features');
      setSidebarSlotState(undefined); // Feature config will be shown in sidebar
    }
  }, []);

  const setSidebarSlot = useCallback((slot?: string) => {
    setSidebarSlotState(slot);
  }, []);

  const isSectionActive = useCallback(
    (section: AppBuilderSection) => activeSection === section,
    [activeSection]
  );

  const navigateToSection = useCallback(
    (section: AppBuilderSection, slot?: string) => {
      setActiveSection(section);
      if (slot) {
        setSidebarSlotState(slot);
      }
    },
    [setActiveSection]
  );

  return {
    activeSection,
    activeFeatureId,
    sidebarSlot,
    setActiveSection,
    setActiveFeatureId,
    setSidebarSlot,
    isSectionActive,
    navigateToSection,
  };
}
