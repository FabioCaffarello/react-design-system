'use client';

import type { AppConfig, FeatureConfig } from '../types';
import { Card } from '../../../molecules';
import { Preview } from '../Preview';
import { generateAppCode } from '../codeGenerators/AppCodeGenerator';
import type { ViewMode } from '../hooks/useAppBuilder';

export interface AppBuilderCanvasProps {
  viewMode: ViewMode;
  appConfig: AppConfig;
  selectedFeature: FeatureConfig | undefined;
  selectedFeatureId: string | undefined;
  onComponentSelect: (componentId: string) => void;
}

/**
 * AppBuilderCanvas
 *
 * Main canvas area that renders Design, Preview, or Code view.
 */
export function AppBuilderCanvas({
  viewMode,
  appConfig,
  selectedFeature,
  selectedFeatureId,
  onComponentSelect,
}: AppBuilderCanvasProps) {
  if (viewMode === 'preview') {
    return (
      <Preview
        appConfig={appConfig}
        selectedFeatureId={selectedFeatureId}
        onComponentSelect={onComponentSelect}
      />
    );
  }

  if (viewMode === 'code') {
    const generated = generateAppCode(appConfig);
    return (
      <div className="flex-1 overflow-auto p-4 bg-gray-900 text-gray-100">
        <pre className="text-sm font-mono whitespace-pre-wrap">{generated.mainFile}</pre>
      </div>
    );
  }

  // Design view
  return (
    <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
      {selectedFeature ? (
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="p-4">
              <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
                {selectedFeature.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedFeature.description || 'No description'}
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div>Components: {selectedFeature.components.length}</div>
                <div>Layout: {selectedFeature.layout.type}</div>
                {selectedFeature.contexts && selectedFeature.contexts.length > 0 && (
                  <div>Contexts: {selectedFeature.contexts.length}</div>
                )}
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <p className="text-lg font-medium mb-2">No feature selected</p>
            <p className="text-sm">Select a feature from the sidebar to start editing</p>
          </div>
        </div>
      )}
    </div>
  );
}
