'use client';

import { useState } from 'react';
import type { FeatureEditorProps, FeatureConfig, FeatureComponent } from './types';
import { Input, Label, Select, Button, Textarea } from '../../atoms';
import { Card } from '../../molecules';
import Dialog from '../../organisms/Dialog/Dialog';
import { DialogContent } from '../../organisms/Dialog/DialogContent';
import { DialogHeader } from '../../organisms/Dialog/DialogHeader';
import { ComponentPalette } from './ComponentPalette';
import { getAvailableComponents } from './utils/RegistryIntegration';

/**
 * Feature Editor
 * 
 * Edit feature properties, add/remove components, configure contexts
 */
export function FeatureEditor({
  feature,
  onFeatureChange,
  availableComponents,
}: FeatureEditorProps) {
  const [showComponentPalette, setShowComponentPalette] = useState(false);

  const handleNameChange = (name: string) => {
    onFeatureChange({ ...feature, name });
  };

  const handleDescriptionChange = (description: string) => {
    onFeatureChange({ ...feature, description });
  };

  const handleCategoryChange = (category: FeatureConfig['category']) => {
    onFeatureChange({ ...feature, category });
  };

  const handleAddComponent = (component: typeof availableComponents[0]) => {
    const newComponent: FeatureComponent = {
      id: `component-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      type: component.config.category,
      name: component.config.name,
      props: component.config.props || {},
    };

    onFeatureChange({
      ...feature,
      components: [...feature.components, newComponent],
    });

    setShowComponentPalette(false);
  };

  const handleRemoveComponent = (componentId: string) => {
    const removeFromArray = (components: FeatureComponent[]): FeatureComponent[] => {
      return components
        .filter((c) => c.id !== componentId)
        .map((c) => {
          if (c.children) {
            return { ...c, children: removeFromArray(c.children) };
          }
          return c;
        });
    };

    onFeatureChange({
      ...feature,
      components: removeFromArray(feature.components),
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h4 className="font-semibold mb-4">Feature Configuration</h4>

          {/* Name */}
          <div className="mb-4">
            <Label htmlFor="feature-name">Name</Label>
            <Input
              id="feature-name"
              type="text"
              value={feature.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <Label htmlFor="feature-description">Description</Label>
            <Textarea
              id="feature-description"
              value={feature.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <Label htmlFor="feature-category">Category</Label>
            <Select
              id="feature-category"
              value={feature.category}
              onChange={(e) => handleCategoryChange(e.target.value as FeatureConfig['category'])}
            >
              <option value="page">Page</option>
              <option value="module">Module</option>
              <option value="flow">Flow</option>
              <option value="pattern">Pattern</option>
            </Select>
          </div>

          {/* Components List */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Components ({feature.components.length})</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComponentPalette(!showComponentPalette)}
              >
                + Add Component
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {feature.components.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No components. Click "Add Component" to add one.
                </div>
              ) : (
                feature.components.map((component) => (
                  <div
                    key={component.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div className="text-sm">
                      <div className="font-medium">{component.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {component.type}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveComponent(component.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Component Palette Modal */}
          <Dialog open={showComponentPalette} onOpenChange={setShowComponentPalette}>
            <DialogContent size="xl" className="h-[70vh] flex flex-col">
              <DialogHeader>
                <Dialog.Title>Select Component</Dialog.Title>
                <Dialog.Description>
                  Choose a component from the design system to add to this feature.
                </Dialog.Description>
              </DialogHeader>
              <div className="flex-1 overflow-hidden -mx-6">
                <ComponentPalette
                  onComponentSelect={handleAddComponent}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
}
