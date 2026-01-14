'use client';

import { useState, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FeatureConfig } from '../types';
import { validateFeature } from '../utils/Validation';
import { Button, Badge } from '../../../atoms';
import { Card } from '../../../molecules';

export interface SortableFeatureListProps {
  features: FeatureConfig[];
  onFeaturesChange: (features: FeatureConfig[]) => void;
  onFeatureSelect: (featureId: string) => void;
  selectedFeatureId?: string;
  onDuplicateFeature: (feature: FeatureConfig) => void;
  onDeleteFeature: (featureId: string) => void;
}

/**
 * SortableFeatureItem
 *
 * Individual sortable feature item with drag handle.
 */
function SortableFeatureItem({
  feature,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
}: {
  feature: FeatureConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const validation = validateFeature(feature);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: feature.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        onClick={onSelect}
        className={`cursor-pointer transition-all ${
          isSelected
            ? 'ring-2 ring-blue-500 border-blue-500'
            : 'hover:border-gray-300 dark:hover:border-gray-600'
        } ${isDragging ? 'shadow-lg' : ''}`}
      >
        <div className="p-3">
          <div className="flex items-center gap-2 mb-1">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Drag to reorder"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </button>

            <h4 className="flex-1 font-semibold text-gray-900 dark:text-gray-100 truncate">
              {feature.name}
            </h4>
            <div className="flex items-center gap-1">
              <Badge
                variant={validation.valid ? 'success' : 'error'}
                size="sm"
              >
                {validation.valid ? '✓' : '✗'}
              </Badge>
              <Badge variant="secondary" size="sm">
                {feature.category}
              </Badge>
            </div>
          </div>

          {feature.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 ml-7">
              {feature.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2 ml-7">
            <span>{feature.components.length} components</span>
            {feature.contexts && feature.contexts.length > 0 && (
              <span>• {feature.contexts.length} contexts</span>
            )}
          </div>

          {/* Validation Errors */}
          {!validation.valid && validation.errors.length > 0 && (
            <div className="text-xs text-red-600 dark:text-red-400 mb-2 ml-7">
              {validation.errors[0]}
              {validation.errors.length > 1 && (
                <span> (+{validation.errors.length - 1} more)</span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 ml-7">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
            >
              Duplicate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * SortableFeatureList
 *
 * Drag-and-drop sortable list of features.
 */
export function SortableFeatureList({
  features,
  onFeaturesChange,
  onFeatureSelect,
  selectedFeatureId,
  onDuplicateFeature,
  onDeleteFeature,
}: SortableFeatureListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevents accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const featureIds = useMemo(() => features.map((f) => f.id), [features]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = features.findIndex((f) => f.id === active.id);
      const newIndex = features.findIndex((f) => f.id === over.id);
      onFeaturesChange(arrayMove(features, oldIndex, newIndex));
    }
  };

  if (features.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
        <p className="mb-2">No features yet</p>
        <p className="text-sm">Click "Add" to create a new feature</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={featureIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {features.map((feature) => (
            <SortableFeatureItem
              key={feature.id}
              feature={feature}
              isSelected={selectedFeatureId === feature.id}
              onSelect={() => onFeatureSelect(feature.id)}
              onDuplicate={() => onDuplicateFeature(feature)}
              onDelete={() => onDeleteFeature(feature.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
