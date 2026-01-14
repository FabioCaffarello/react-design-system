'use client';

import type { FeatureConfig, FeatureComponent, FeatureContextData } from '../types';
import type { ComponentMetadata } from '../../../builders/ComponentRegistry';
import { Card } from '../../../molecules';
import { FeatureEditor } from '../FeatureEditor';
import { LayoutEditor } from '../LayoutEditor';
import { ComponentPropsEditor } from '../ComponentPropsEditor';
import { DataEditor } from '../DataEditor';

export interface AppBuilderPropertiesProps {
  selectedFeature: FeatureConfig;
  selectedComponent: FeatureComponent | undefined;
  availableComponents: ComponentMetadata[];
  onFeatureChange: (feature: FeatureConfig) => void;
  onComponentChange: (component: FeatureComponent) => void;
}

/**
 * AppBuilderProperties
 *
 * Properties panel for editing feature and component settings.
 */
export function AppBuilderProperties({
  selectedFeature,
  selectedComponent,
  availableComponents,
  onFeatureChange,
  onComponentChange,
}: AppBuilderPropertiesProps) {
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

  const componentMetadata = selectedComponent
    ? availableComponents.find((c) => c.config.name === selectedComponent.name)
    : undefined;

  return (
    <div className="w-96 border-l border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-800">
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Properties</h3>

        {/* Feature Editor */}
        <FeatureEditor
          feature={selectedFeature}
          onFeatureChange={onFeatureChange}
          availableComponents={availableComponents}
        />

        {/* Layout Editor */}
        <LayoutEditor
          layout={selectedFeature.layout}
          onLayoutChange={handleLayoutChange}
          components={selectedFeature.components}
        />

        {/* Component Props Editor */}
        {selectedComponent && (
          componentMetadata ? (
            <ComponentPropsEditor
              component={selectedComponent}
              componentMetadata={componentMetadata}
              onComponentChange={onComponentChange}
            />
          ) : (
            <Card>
              <div className="p-4">
                <div className="text-sm text-red-600 dark:text-red-400">
                  Component metadata not found for: {selectedComponent.name}
                </div>
              </div>
            </Card>
          )
        )}

        {/* Context Data Editors */}
        {selectedFeature.contexts && selectedFeature.contexts.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
              Context Providers
            </h4>
            {selectedFeature.contexts.map((context, idx) => (
              <DataEditor
                key={idx}
                contextData={context}
                onContextDataChange={(data) => handleContextChange(idx, data)}
                providerTypes={[]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
