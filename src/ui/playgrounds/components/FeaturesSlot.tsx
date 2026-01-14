'use client';

import { useCallback } from 'react';
import type { FeatureConfig } from '../../tools/AppBuilder/types';
import { SortableFeatureList } from '../../tools/AppBuilder/components/SortableFeatureList';
import { getFeatureTemplates } from '../../tools/AppBuilder/templates/FeatureTemplates';
import { Button, Badge } from '../../atoms';
import { Card } from '../../molecules';
import { AlertDialog } from '../../organisms/Dialog/AlertDialog';
import { useState } from 'react';

export interface FeaturesSlotProps {
  features: FeatureConfig[];
  selectedFeatureId?: string;
  onFeaturesChange: (features: FeatureConfig[]) => void;
  onFeatureSelect: (featureId: string) => void;
}

export function FeaturesSlot({
  features,
  selectedFeatureId,
  onFeaturesChange,
  onFeatureSelect,
}: FeaturesSlotProps) {
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

  const handleDeleteFeature = useCallback(
    (featureId: string) => {
      setFeatureToDelete(featureId);
      setShowDeleteDialog(true);
    },
    []
  );

  const confirmDelete = useCallback(() => {
    if (featureToDelete) {
      onFeaturesChange(features.filter((f) => f.id !== featureToDelete));
      if (selectedFeatureId === featureToDelete) {
        onFeatureSelect(features.find((f) => f.id !== featureToDelete)?.id || '');
      }
      setFeatureToDelete(null);
      setShowDeleteDialog(false);
    }
  }, [featureToDelete, features, onFeaturesChange, selectedFeatureId, onFeatureSelect]);

  const handleDuplicateFeature = useCallback(
    (featureId: string) => {
      const feature = features.find((f) => f.id === featureId);
      if (feature) {
        const duplicated: FeatureConfig = {
          ...feature,
          id: `feature-${Date.now()}`,
          name: `${feature.name} (Copy)`,
          metadata: {
            ...feature.metadata,
            createdAt: new Date().toISOString(),
          },
        };
        onFeaturesChange([...features, duplicated]);
        onFeatureSelect(duplicated.id);
      }
    },
    [features, onFeaturesChange, onFeatureSelect]
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Features
          </h3>
          <Badge variant="secondary" size="sm">
            {features.length}
          </Badge>
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
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Feature Templates
          </h4>
          <div className="space-y-2">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                onClick={() => handleAddFromTemplate(template)}
              >
                <div className="p-2">
                  <div className="font-medium text-xs text-gray-900 dark:text-gray-100">
                    {template.name}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {template.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="flex-1 overflow-y-auto p-4">
        <SortableFeatureList
          features={features}
          selectedFeatureId={selectedFeatureId}
          onFeaturesChange={onFeaturesChange}
          onFeatureSelect={onFeatureSelect}
          onDeleteFeature={handleDeleteFeature}
          onDuplicateFeature={handleDuplicateFeature}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Feature"
        description={`Are you sure you want to delete this feature? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
