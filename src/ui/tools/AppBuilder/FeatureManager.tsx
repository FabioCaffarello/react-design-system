'use client';

import { useState, useCallback } from 'react';
import type { FeatureManagerProps, FeatureConfig } from './types';
import { getFeatureTemplates } from './templates/FeatureTemplates';
import { Button, Badge } from '../../atoms';
import { Card } from '../../molecules';
import { AlertDialog } from '../../organisms/Dialog/AlertDialog';
import { SortableFeatureList } from './components/SortableFeatureList';

/**
 * Feature Manager
 *
 * Manages features: create, edit, delete, reorder with drag-and-drop, and use templates
 */
export function FeatureManager({
  features,
  onFeaturesChange,
  onFeatureSelect,
  selectedFeatureId,
}: FeatureManagerProps) {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);

  const templates = getFeatureTemplates();

  const handleAddFeature = useCallback(() => {
    const newFeature: FeatureConfig = {
      id: `feature-${Date.now()}`,
      name: 'New Feature',
      description: '',
      category: 'page',
      components: [],
      layout: {
        type: 'container',
        config: {
          maxWidth: 'xl',
          padding: 'base',
        },
      },
      metadata: {
        tags: [],
        version: '1.0.0',
        createdAt: new Date().toISOString(),
      },
    };

    onFeaturesChange([...features, newFeature]);
    onFeatureSelect(newFeature.id);
  }, [features, onFeaturesChange, onFeatureSelect]);

  const handleAddFromTemplate = useCallback(
    (template: ReturnType<typeof getFeatureTemplates>[0]) => {
      const newFeature = template.create();
      onFeaturesChange([...features, newFeature]);
      onFeatureSelect(newFeature.id);
      setShowTemplates(false);
    },
    [features, onFeaturesChange, onFeatureSelect]
  );

  const handleDeleteFeature = useCallback((featureId: string) => {
    setFeatureToDelete(featureId);
    setShowDeleteDialog(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (featureToDelete) {
      const updated = features.filter((f) => f.id !== featureToDelete);
      onFeaturesChange(updated);
      if (selectedFeatureId === featureToDelete && updated.length > 0) {
        onFeatureSelect(updated[0].id);
      } else if (selectedFeatureId === featureToDelete) {
        onFeatureSelect(undefined as any);
      }
      setFeatureToDelete(null);
    }
  }, [featureToDelete, features, onFeaturesChange, selectedFeatureId, onFeatureSelect]);

  const handleDuplicateFeature = useCallback(
    (feature: FeatureConfig) => {
      const duplicated: FeatureConfig = {
        ...feature,
        id: `${feature.id}-copy-${Date.now()}`,
        name: `${feature.name} (Copy)`,
        metadata: {
          ...feature.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      onFeaturesChange([...features, duplicated]);
      onFeatureSelect(duplicated.id);
    },
    [features, onFeaturesChange, onFeatureSelect]
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Features
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {features.length}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddFeature}
            className="flex-1"
          >
            + Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            Templates
          </Button>
        </div>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-64 overflow-y-auto">
          <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Feature Templates
          </div>
          <div className="space-y-2">
            {templates.map((template) => (
              <Card
                key={template.name}
                onClick={() => handleAddFromTemplate(template)}
                className="cursor-pointer hover:border-blue-500 transition-colors p-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {template.description}
                    </div>
                  </div>
                  <Badge variant="secondary" size="sm">
                    {template.category}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Features List with Drag-and-Drop */}
      <div className="flex-1 overflow-y-auto p-4">
        <SortableFeatureList
          features={features}
          onFeaturesChange={onFeaturesChange}
          onFeatureSelect={onFeatureSelect}
          selectedFeatureId={selectedFeatureId}
          onDuplicateFeature={handleDuplicateFeature}
          onDeleteFeature={handleDeleteFeature}
        />
      </div>

      {/* Drag hint */}
      {features.length > 1 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center">
          Drag features to reorder
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Feature"
        description="Are you sure you want to delete this feature? This action cannot be undone."
        variant="destructive"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setFeatureToDelete(null);
        }}
      />
    </div>
  );
}
