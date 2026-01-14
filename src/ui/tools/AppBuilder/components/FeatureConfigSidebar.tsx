'use client';

import type { FeatureConfig, FeatureComponent, FeatureContextData } from '../types';
import type { ComponentMetadata } from '../../../builders/ComponentRegistry';
import { SideNavbar } from '../../../organisms/SideNavbar';
import { FeatureEditor } from '../FeatureEditor';
import { LayoutEditor } from '../LayoutEditor';
import { ComponentPropsEditor } from '../ComponentPropsEditor';
import { DataEditor } from '../DataEditor';
import { ContextProviderSelector } from './ContextProviderSelector';
import { Button } from '../../../atoms';
import { useState } from 'react';

export interface FeatureConfigSidebarProps {
  selectedFeature: FeatureConfig;
  selectedComponent: FeatureComponent | undefined;
  availableComponents: ComponentMetadata[];
  onFeatureChange: (feature: FeatureConfig) => void;
  onComponentChange: (component: FeatureComponent) => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

/**
 * FeatureConfigSidebar
 *
 * Sidebar component for configuring a selected feature.
 * Uses SideNavbar.Sidebar with groups for Context Providers, Components, and Layout.
 */
export function FeatureConfigSidebar({
  selectedFeature,
  selectedComponent,
  availableComponents,
  onFeatureChange,
  onComponentChange,
  onDuplicate,
  onDelete,
}: FeatureConfigSidebarProps) {
  const handleLayoutChange = (layout: FeatureConfig['layout']) => {
    onFeatureChange({ ...selectedFeature, layout });
  };

  const handleContextChange = (index: number, data: FeatureContextData) => {
    const updatedContexts = [...(selectedFeature.contexts || [])];
    updatedContexts[index] = data;
    onFeatureChange({
      ...selectedFeature,
      contexts: updatedContexts,
    });
  };

  const [showProviderSelector, setShowProviderSelector] = useState(false);

  const handleAddContext = () => {
    setShowProviderSelector(true);
  };

  const handleProviderSelect = (template: import('./ContextProviderSelector').ProviderTemplate) => {
    const newContext: FeatureContextData = {
      providerName: template.name,
      data: template.defaultData,
      config: {
        enabled: true,
        mergeWithDefault: false,
      },
    };
    onFeatureChange({
      ...selectedFeature,
      contexts: [...(selectedFeature.contexts || []), newContext],
    });
    setShowProviderSelector(false);
  };

  const handleRemoveContext = (index: number) => {
    const updatedContexts = [...(selectedFeature.contexts || [])];
    updatedContexts.splice(index, 1);
    onFeatureChange({
      ...selectedFeature,
      contexts: updatedContexts,
    });
  };

  const componentMetadata = selectedComponent
    ? availableComponents.find((c) => c.config.name === selectedComponent.name)
    : undefined;

  return (
    <SideNavbar.Sidebar>
      <SideNavbar.Sidebar.Header title={selectedFeature.name} />
      <SideNavbar.Sidebar.Content>
        {/* Context Providers Group */}
        <SideNavbar.Sidebar.Group id="context" title="Context Providers">
          <div className="space-y-3">
            {showProviderSelector ? (
              <ContextProviderSelector
                onSelect={handleProviderSelect}
                onCancel={() => setShowProviderSelector(false)}
              />
            ) : (
              <>
                {selectedFeature.contexts && selectedFeature.contexts.length > 0 ? (
                  selectedFeature.contexts.map((context, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {context.providerName}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveContext(idx)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                      <DataEditor
                        contextData={context}
                        onContextDataChange={(data) => handleContextChange(idx, data)}
                        providerTypes={[]}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No context providers configured
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddContext}
                  className="w-full"
                >
                  + Add Context Provider
                </Button>
              </>
            )}
          </div>
        </SideNavbar.Sidebar.Group>

        {/* Components Group */}
        <SideNavbar.Sidebar.Group id="components" title="Components">
          <FeatureEditor
            feature={selectedFeature}
            onFeatureChange={onFeatureChange}
            availableComponents={availableComponents}
          />
          {selectedComponent && componentMetadata && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Component Props
              </h4>
              <ComponentPropsEditor
                component={selectedComponent}
                componentMetadata={componentMetadata}
                onComponentChange={onComponentChange}
              />
            </div>
          )}
        </SideNavbar.Sidebar.Group>

        {/* Layout Group */}
        <SideNavbar.Sidebar.Group id="layout" title="Layout">
          <LayoutEditor
            layout={selectedFeature.layout}
            onLayoutChange={handleLayoutChange}
            components={selectedFeature.components}
          />
        </SideNavbar.Sidebar.Group>
      </SideNavbar.Sidebar.Content>
      <SideNavbar.Sidebar.Footer>
        <div className="flex gap-2">
          {onDuplicate && (
            <Button variant="outline" size="sm" onClick={onDuplicate} className="flex-1">
              Duplicate
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete} className="flex-1 text-red-600 hover:text-red-700">
              Delete
            </Button>
          )}
        </div>
      </SideNavbar.Sidebar.Footer>
    </SideNavbar.Sidebar>
  );
}
