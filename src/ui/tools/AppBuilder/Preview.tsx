'use client';

import { useMemo, useState } from 'react';
import type { PreviewProps } from './types';
import { AppProvider } from '../../providers/AppProvider';
import { Container, Stack } from '../../layouts';
import { Badge, Button } from '../../atoms';
import { ComponentList } from './components/ComponentRenderer';

type PreviewMode = 'live' | 'structure';

/**
 * Preview Component
 *
 * Renders feature components in real-time for preview.
 * Supports both live rendering (actual components) and structure view (metadata cards).
 */
export function Preview({
  appConfig,
  selectedFeatureId,
  onComponentSelect,
}: PreviewProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('live');

  const selectedFeature = useMemo(() => {
    if (!selectedFeatureId) {
      return appConfig.features[0];
    }
    return appConfig.features.find((f) => f.id === selectedFeatureId);
  }, [appConfig.features, selectedFeatureId]);

  if (!selectedFeature) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No feature selected</p>
          <p className="text-sm">Select a feature to preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {selectedFeature.name}
          </h3>
          <Badge variant="secondary" size="sm">
            {selectedFeature.category}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode === 'live' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('live')}
          >
            Live Preview
          </Button>
          <Button
            variant={previewMode === 'structure' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('structure')}
          >
            Structure
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        <AppProvider>
          <div className="max-w-7xl mx-auto">
            {selectedFeature.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedFeature.description}
              </p>
            )}

            {/* Render based on layout type */}
            {previewMode === 'live' ? (
              <LivePreview
                feature={selectedFeature}
                onComponentSelect={onComponentSelect}
              />
            ) : (
              <StructurePreview
                feature={selectedFeature}
                onComponentSelect={onComponentSelect}
              />
            )}

            {/* Feature Info */}
            <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="text-xs font-medium mb-1 text-blue-700 dark:text-blue-300">
                Feature Info
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>Components: {selectedFeature.components.length}</div>
                {selectedFeature.contexts && selectedFeature.contexts.length > 0 && (
                  <div>Contexts: {selectedFeature.contexts.length}</div>
                )}
                <div>Layout: {selectedFeature.layout.type}</div>
              </div>
            </div>
          </div>
        </AppProvider>
      </div>
    </div>
  );
}

/**
 * LivePreview
 *
 * Renders actual components with their configured props.
 */
function LivePreview({
  feature,
  onComponentSelect,
}: {
  feature: PreviewProps['appConfig']['features'][0];
  onComponentSelect?: (componentId: string) => void;
}) {
  const { layout, components } = feature;

  // Render components inside the appropriate layout
  const renderWithLayout = () => {
    switch (layout.type) {
      case 'container':
        return (
          <Container
            maxWidth={layout.config.maxWidth as any}
            paddingX={layout.config.padding as any}
            paddingY={layout.config.padding as any}
          >
            <ComponentList
              components={components}
              onSelect={onComponentSelect}
            />
          </Container>
        );

      case 'stack':
        return (
          <Stack spacing={layout.config.spacing as any}>
            <ComponentList
              components={components}
              onSelect={onComponentSelect}
            />
          </Stack>
        );

      case 'grid':
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                typeof layout.config.columns === 'number'
                  ? `repeat(${layout.config.columns}, 1fr)`
                  : layout.config.columns || 'repeat(3, 1fr)',
              gridTemplateRows:
                typeof layout.config.rows === 'number'
                  ? `repeat(${layout.config.rows}, auto)`
                  : layout.config.rows || 'auto',
              gap: layout.config.gap || '1rem',
            }}
          >
            <ComponentList
              components={components}
              onSelect={onComponentSelect}
            />
          </div>
        );

      case 'flex':
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: layout.config.direction || 'row',
              justifyContent: layout.config.justify || 'start',
              alignItems: layout.config.align || 'start',
              flexWrap: layout.config.wrap || 'wrap',
              gap: '1rem',
            }}
          >
            <ComponentList
              components={components}
              onSelect={onComponentSelect}
            />
          </div>
        );

      case 'custom':
      default:
        return (
          <ComponentList
            components={components}
            onSelect={onComponentSelect}
          />
        );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 min-h-[200px]">
      {renderWithLayout()}
    </div>
  );
}

/**
 * StructurePreview
 *
 * Shows component structure as metadata cards (original behavior).
 */
function StructurePreview({
  feature,
  onComponentSelect,
}: {
  feature: PreviewProps['appConfig']['features'][0];
  onComponentSelect?: (componentId: string) => void;
}) {
  const { components } = feature;

  if (components.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
        <p className="mb-2">No components in this feature</p>
        <p className="text-sm">Add components from the Component Palette</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {components.map((component) => (
        <StructureCard
          key={component.id}
          component={component}
          onSelect={onComponentSelect}
        />
      ))}
    </div>
  );
}

function StructureCard({
  component,
  onSelect,
  depth = 0,
}: {
  component: PreviewProps['appConfig']['features'][0]['components'][0];
  onSelect?: (componentId: string) => void;
  depth?: number;
}) {
  return (
    <div
      className={`
        p-3 rounded-md border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800
        cursor-pointer hover:border-blue-400 dark:hover:border-blue-500
        transition-colors
      `}
      style={{ marginLeft: depth * 16 }}
      onClick={() => onSelect?.(component.id)}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
          {component.name}
        </span>
        <Badge variant="outline" size="sm">
          {component.type}
        </Badge>
      </div>
      {Object.keys(component.props || {}).length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Props: {Object.keys(component.props || {}).join(', ')}
        </div>
      )}
      {component.children && component.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {component.children.map((child) => (
            <StructureCard
              key={child.id}
              component={child}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
