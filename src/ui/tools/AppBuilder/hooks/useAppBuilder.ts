'use client';

import { useState, useMemo, useCallback } from 'react';
import type { AppConfig, FeatureConfig, FeatureComponent } from '../types';
import { generateAppCode } from '../codeGenerators/AppCodeGenerator';
import {
  exportAppAsJSON,
  exportAppAsCode,
  copyCodeToClipboard,
} from '../ExportManager';
import { StorageManager } from '../utils/StorageManager';
import { validateApp } from '../utils/Validation';
import { getAvailableComponents } from '../utils/RegistryIntegration';
import type { ComponentMetadata } from '../../../builders/ComponentRegistry';

export type LoadingState = 'save' | 'exportJson' | 'exportCode' | 'viewCode' | null;
export type ViewMode = 'design' | 'code' | 'preview';

export interface UseAppBuilderOptions {
  initialAppConfig?: AppConfig;
  onSave?: (config: AppConfig) => void;
  onExport?: (config: AppConfig, type: 'json' | 'code') => void;
}

export interface UseAppBuilderReturn {
  // State
  appConfig: AppConfig;
  selectedFeatureId: string | undefined;
  selectedComponentId: string | undefined;
  viewMode: ViewMode;
  sidebarCollapsed: boolean;
  showComponentPalette: boolean;
  isLoading: LoadingState;

  // Derived State
  selectedFeature: FeatureConfig | undefined;
  selectedComponent: FeatureComponent | undefined;
  availableComponents: ComponentMetadata[];
  validation: ReturnType<typeof validateApp>;

  // State Setters
  setViewMode: (mode: ViewMode) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setShowComponentPalette: (show: boolean) => void;
  setSelectedComponentId: (id: string | undefined) => void;

  // Actions
  updateAppName: (name: string) => void;
  handleFeaturesChange: (features: FeatureConfig[]) => void;
  handleFeatureSelect: (featureId: string) => void;
  handleFeatureChange: (feature: FeatureConfig) => void;
  handleComponentSelect: (component: ComponentMetadata) => Promise<{ success: boolean; message?: string }>;
  handleComponentChange: (component: FeatureComponent) => void;
  handleSave: () => Promise<{ success: boolean; message?: string }>;
  handleExportJSON: () => Promise<{ success: boolean; message?: string }>;
  handleExportCode: () => Promise<{ success: boolean; message?: string }>;
  handleViewCode: () => Promise<{ success: boolean; message?: string }>;
}

const DEFAULT_APP_CONFIG: AppConfig = {
  name: 'New Application',
  description: '',
  features: [],
  metadata: {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
  },
};

/**
 * useAppBuilder Hook
 *
 * Centralizes all state management and actions for the App Builder.
 * Provides a clean interface for building and managing applications.
 */
export function useAppBuilder(options: UseAppBuilderOptions = {}): UseAppBuilderReturn {
  const { initialAppConfig, onSave, onExport } = options;

  // Core State
  const [appConfig, setAppConfig] = useState<AppConfig>(
    initialAppConfig || DEFAULT_APP_CONFIG
  );
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | undefined>();
  const [selectedComponentId, setSelectedComponentId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('design');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showComponentPalette, setShowComponentPalette] = useState(false);
  const [isLoading, setIsLoading] = useState<LoadingState>(null);

  // Derived State
  const selectedFeature = useMemo(() => {
    if (!selectedFeatureId) return undefined;
    return appConfig.features.find((f) => f.id === selectedFeatureId);
  }, [appConfig.features, selectedFeatureId]);

  const selectedComponent = useMemo(() => {
    if (!selectedFeature || !selectedComponentId) return undefined;

    function findComponent(components: FeatureComponent[]): FeatureComponent | undefined {
      for (const comp of components) {
        if (comp.id === selectedComponentId) return comp;
        if (comp.children) {
          const found = findComponent(comp.children);
          if (found) return found;
        }
      }
      return undefined;
    }

    return findComponent(selectedFeature.components);
  }, [selectedFeature, selectedComponentId]);

  const availableComponents = useMemo(() => getAvailableComponents(), []);

  const validation = useMemo(() => validateApp(appConfig), [appConfig]);

  // Actions
  const updateAppName = useCallback((name: string) => {
    setAppConfig((prev) => ({ ...prev, name }));
  }, []);

  const handleFeaturesChange = useCallback((features: FeatureConfig[]) => {
    setAppConfig((prev) => ({ ...prev, features }));
  }, []);

  const handleFeatureSelect = useCallback((featureId: string) => {
    setSelectedFeatureId(featureId);
    setSelectedComponentId(undefined);
  }, []);

  const handleFeatureChange = useCallback((feature: FeatureConfig) => {
    setAppConfig((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === feature.id ? feature : f)),
    }));
  }, []);

  const handleComponentSelect = useCallback(
    async (component: ComponentMetadata): Promise<{ success: boolean; message?: string }> => {
      if (!selectedFeature) {
        return { success: false, message: 'Please select a feature first' };
      }

      const newComponent: FeatureComponent = {
        id: `component-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        type: component.config.category,
        name: component.config.name,
        props: component.config.props || {},
      };

      setAppConfig((prev) => ({
        ...prev,
        features: prev.features.map((f) => {
          if (f.id === selectedFeature.id) {
            return {
              ...f,
              components: [...f.components, newComponent],
            };
          }
          return f;
        }),
      }));

      setShowComponentPalette(false);
      return { success: true, message: `${component.config.name} added to feature` };
    },
    [selectedFeature]
  );

  const handleComponentChange = useCallback(
    (component: FeatureComponent) => {
      if (!selectedFeature) return;

      const updateComponent = (components: FeatureComponent[]): FeatureComponent[] => {
        return components.map((comp) => {
          if (comp.id === component.id) {
            return component;
          }
          if (comp.children) {
            return { ...comp, children: updateComponent(comp.children) };
          }
          return comp;
        });
      };

      setAppConfig((prev) => ({
        ...prev,
        features: prev.features.map((f) => {
          if (f.id === selectedFeature.id) {
            return {
              ...f,
              components: updateComponent(f.components),
            };
          }
          return f;
        }),
      }));
    },
    [selectedFeature]
  );

  const handleSave = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    setIsLoading('save');
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const key = `app-${appConfig.name.toLowerCase().replace(/\s+/g, '-')}`;
      StorageManager.saveApp(appConfig, key);
      onSave?.(appConfig);
      return { success: true, message: 'App configuration saved successfully' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save app',
      };
    } finally {
      setIsLoading(null);
    }
  }, [appConfig, onSave]);

  const handleExportJSON = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    setIsLoading('exportJson');
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      exportAppAsJSON(appConfig);
      onExport?.(appConfig, 'json');
      return { success: true, message: 'App configuration exported as JSON' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to export app',
      };
    } finally {
      setIsLoading(null);
    }
  }, [appConfig, onExport]);

  const handleExportCode = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    setIsLoading('exportCode');
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      exportAppAsCode(appConfig);
      onExport?.(appConfig, 'code');
      return { success: true, message: 'App code exported successfully' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to export code',
      };
    } finally {
      setIsLoading(null);
    }
  }, [appConfig, onExport]);

  const handleViewCode = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    setIsLoading('viewCode');
    try {
      const generated = generateAppCode(appConfig);
      const codePreview = `// ${appConfig.name}\n\n${generated.mainFile}\n\n// Features:\n${Object.entries(
        generated.featureFiles
      )
        .map(([name, code]) => `\n// ${name}.tsx\n${code}`)
        .join('\n\n')}`;

      const copied = await copyCodeToClipboard(codePreview);
      if (copied) {
        return { success: true, message: 'Code has been copied to clipboard' };
      } else {
        return { success: false, message: 'Failed to copy code to clipboard' };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate code',
      };
    } finally {
      setIsLoading(null);
    }
  }, [appConfig]);

  return {
    // State
    appConfig,
    selectedFeatureId,
    selectedComponentId,
    viewMode,
    sidebarCollapsed,
    showComponentPalette,
    isLoading,

    // Derived State
    selectedFeature,
    selectedComponent,
    availableComponents,
    validation,

    // State Setters
    setViewMode,
    setSidebarCollapsed,
    setShowComponentPalette,
    setSelectedComponentId,

    // Actions
    updateAppName,
    handleFeaturesChange,
    handleFeatureSelect,
    handleFeatureChange,
    handleComponentSelect,
    handleComponentChange,
    handleSave,
    handleExportJSON,
    handleExportCode,
    handleViewCode,
  };
}
