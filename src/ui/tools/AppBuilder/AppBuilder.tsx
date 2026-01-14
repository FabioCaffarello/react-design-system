"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { AppConfig } from "./types";
import { FeatureManager } from "./FeatureManager";
import { ComponentPalette } from "./ComponentPalette";
import { useToast } from "../../organisms/Toast/useToast";
import { ToastContainer } from "../../organisms/Toast/ToastContainer";
import { AppBuilderErrorBoundary } from "./ErrorBoundary";
import { Button } from "../../atoms";
import {
  AppBuilderHeader,
  AppBuilderToolbar,
  AppBuilderCanvas,
  AppBuilderProperties,
} from "./components";
import { useAppBuilder } from "./hooks";

export interface AppBuilderState {
  selectedFeature?: import('./types').FeatureConfig;
  selectedComponent?: import('./types').FeatureComponent;
  availableComponents: import('../../builders/ComponentRegistry').ComponentMetadata[];
  onFeatureChange?: (feature: import('./types').FeatureConfig) => void;
  onComponentChange?: (component: import('./types').FeatureComponent) => void;
}

export interface AppBuilderProps {
  initialAppConfig?: AppConfig;
  onSave?: (config: AppConfig) => void;
  onExport?: (config: AppConfig, type: "json" | "code") => void;
  embedded?: boolean; // When true, hides Features Panel and Properties Panel (managed by parent)
  onStateChange?: (state: AppBuilderState) => void; // Callback to expose internal state
}

/**
 * App Builder
 *
 * Main component for building applications with features, components, and context providers.
 * Uses compound components pattern with extracted sub-components for better maintainability.
 */
export function AppBuilder({ initialAppConfig, onSave, onExport, embedded = false, onStateChange }: AppBuilderProps) {
  const toast = useToast();

  const {
    // State
    appConfig,
    selectedFeatureId,
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
  } = useAppBuilder({ initialAppConfig, onSave, onExport });

  // Wrapper functions to show toast notifications
  const handleSaveWithToast = async () => {
    const result = await handleSave();
    if (result.success) {
      toast.success("App saved", result.message || "");
    } else {
      toast.error("Save failed", result.message || "");
    }
  };

  const handleExportJSONWithToast = async () => {
    const result = await handleExportJSON();
    if (result.success) {
      toast.success("Export successful", result.message || "");
    } else {
      toast.error("Export failed", result.message || "");
    }
  };

  const handleExportCodeWithToast = async () => {
    const result = await handleExportCode();
    if (result.success) {
      toast.success("Export successful", result.message || "");
    } else {
      toast.error("Export failed", result.message || "");
    }
  };

  const handleViewCodeWithToast = async () => {
    const result = await handleViewCode();
    if (result.success) {
      toast.success("Code copied", result.message || "");
    } else {
      toast.error("Error", result.message || "");
    }
  };

  const handleComponentSelectWithToast = async (component: typeof availableComponents[0]) => {
    const result = await handleComponentSelect(component);
    if (result.success) {
      toast.success("Component added", result.message || "");
    } else {
      toast.warning("No feature selected", result.message || "");
    }
  };

  // Expose state to parent when embedded
  useEffect(() => {
    if (embedded && onStateChange) {
      onStateChange({
        selectedFeature,
        selectedComponent,
        availableComponents,
        onFeatureChange: handleFeatureChange,
        onComponentChange: handleComponentChange,
      });
    }
  }, [embedded, onStateChange, selectedFeature, selectedComponent, availableComponents, handleFeatureChange, handleComponentChange]);

  return (
    <AppBuilderErrorBoundary>
      <ToastContainer />

      {/* Header */}
      <AppBuilderHeader
        appName={appConfig.name}
        onAppNameChange={updateAppName}
        validation={validation}
        isLoading={isLoading}
        onSave={handleSaveWithToast}
        onExportJSON={handleExportJSONWithToast}
        onExportCode={handleExportCodeWithToast}
        onViewCode={handleViewCodeWithToast}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Features Panel - Only show when not embedded */}
        {!embedded && !sidebarCollapsed && (
          <div className="w-80 border-r border-gray-200 dark:border-gray-700">
            <FeatureManager
              features={appConfig.features}
              onFeaturesChange={handleFeaturesChange}
              onFeatureSelect={handleFeatureSelect}
              selectedFeatureId={selectedFeatureId}
            />
          </div>
        )}

        {/* Canvas/Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <AppBuilderToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showComponentPalette={showComponentPalette}
            onToggleComponentPalette={() => setShowComponentPalette(!showComponentPalette)}
            sidebarCollapsed={embedded ? true : sidebarCollapsed}
            onToggleSidebar={embedded ? undefined : () => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Canvas */}
          <AppBuilderCanvas
            viewMode={viewMode}
            appConfig={appConfig}
            selectedFeature={selectedFeature}
            selectedFeatureId={selectedFeatureId}
            onComponentSelect={setSelectedComponentId}
          />
        </div>

        {/* Properties Panel - Only show when not embedded */}
        {!embedded && selectedFeature && (
          <AppBuilderProperties
            selectedFeature={selectedFeature}
            selectedComponent={selectedComponent}
            availableComponents={availableComponents}
            onFeatureChange={handleFeatureChange}
            onComponentChange={handleComponentChange}
          />
        )}

        {/* Component Palette (Overlay via Portal) */}
        {showComponentPalette &&
          typeof window !== "undefined" &&
          createPortal(
            <div className="fixed inset-0 z-50">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/20"
                onClick={() => setShowComponentPalette(false)}
              />
              {/* Panel */}
              <div className="absolute inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl animate-in slide-in-from-right duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Component Palette
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComponentPalette(false)}
                  >
                    ×
                  </Button>
                </div>
                <div className="h-[calc(100%-64px)] overflow-hidden">
                  <ComponentPalette
                    onComponentSelect={handleComponentSelectWithToast}
                    selectedComponentId={undefined}
                  />
                </div>
              </div>
            </div>,
            document.body
          )}
      </div>
    </AppBuilderErrorBoundary>
  );
}
