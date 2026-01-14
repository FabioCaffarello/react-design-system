'use client';

import { useState } from 'react';
import type { LayoutEditorProps, FeatureLayout } from './types';
import { Button, Input, Label, Select } from '../../atoms';
import { Card } from '../../molecules';

/**
 * Layout Editor
 * 
 * Configure layout settings for features (grid, flex, stack, container)
 */
export function LayoutEditor({
  layout,
  onLayoutChange,
  components,
}: LayoutEditorProps) {
  const [localLayout, setLocalLayout] = useState<FeatureLayout>(layout);

  const handleLayoutTypeChange = (type: FeatureLayout['type']) => {
    const newLayout: FeatureLayout = {
      type,
      config: {},
    };

    // Set defaults based on type
    if (type === 'grid') {
      newLayout.config = {
        columns: 3,
        rows: 'auto',
        gap: 'md',
      };
    } else if (type === 'flex') {
      newLayout.config = {
        direction: 'row',
        wrap: 'wrap',
        justify: 'start',
        align: 'start',
      };
    } else if (type === 'stack') {
      newLayout.config = {
        spacing: 'md',
      };
    } else if (type === 'container') {
      newLayout.config = {
        maxWidth: 'xl',
        padding: 'base',
      };
    }

    setLocalLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const handleConfigChange = (key: string, value: unknown) => {
    const newLayout: FeatureLayout = {
      ...localLayout,
      config: {
        ...localLayout.config,
        [key]: value,
      },
    };

    setLocalLayout(newLayout);
    onLayoutChange(newLayout);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h4 className="font-semibold mb-4">Layout Configuration</h4>

          {/* Layout Type */}
          <div className="mb-4">
            <Label htmlFor="layout-type">Layout Type</Label>
            <Select
              id="layout-type"
              value={localLayout.type}
              onChange={(e) => handleLayoutTypeChange(e.target.value as FeatureLayout['type'])}
            >
              <option value="grid">Grid</option>
              <option value="flex">Flex</option>
              <option value="stack">Stack</option>
              <option value="container">Container</option>
              <option value="custom">Custom</option>
            </Select>
          </div>

          {/* Grid Layout Config */}
          {localLayout.type === 'grid' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="grid-columns">Columns</Label>
                <Input
                  id="grid-columns"
                  type="text"
                  value={localLayout.config.columns?.toString() || ''}
                  onChange={(e) => handleConfigChange('columns', e.target.value)}
                  placeholder="e.g., 3 or '1fr 1fr 1fr'"
                />
              </div>
              <div>
                <Label htmlFor="grid-rows">Rows</Label>
                <Input
                  id="grid-rows"
                  type="text"
                  value={localLayout.config.rows?.toString() || ''}
                  onChange={(e) => handleConfigChange('rows', e.target.value)}
                  placeholder="e.g., auto or '1fr 1fr'"
                />
              </div>
              <div>
                <Label htmlFor="grid-gap">Gap</Label>
                <Select
                  id="grid-gap"
                  value={localLayout.config.gap || 'md'}
                  onChange={(e) => handleConfigChange('gap', e.target.value)}
                >
                  <option value="xs">XS</option>
                  <option value="sm">SM</option>
                  <option value="md">MD</option>
                  <option value="lg">LG</option>
                  <option value="xl">XL</option>
                </Select>
              </div>
            </div>
          )}

          {/* Flex Layout Config */}
          {localLayout.type === 'flex' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="flex-direction">Direction</Label>
                <Select
                  id="flex-direction"
                  value={localLayout.config.direction || 'row'}
                  onChange={(e) => handleConfigChange('direction', e.target.value)}
                >
                  <option value="row">Row</option>
                  <option value="column">Column</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="flex-wrap">Wrap</Label>
                <Select
                  id="flex-wrap"
                  value={localLayout.config.wrap || 'wrap'}
                  onChange={(e) => handleConfigChange('wrap', e.target.value)}
                >
                  <option value="wrap">Wrap</option>
                  <option value="nowrap">No Wrap</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="flex-justify">Justify Content</Label>
                <Select
                  id="flex-justify"
                  value={localLayout.config.justify || 'start'}
                  onChange={(e) => handleConfigChange('justify', e.target.value)}
                >
                  <option value="start">Start</option>
                  <option value="center">Center</option>
                  <option value="end">End</option>
                  <option value="space-between">Space Between</option>
                  <option value="space-around">Space Around</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="flex-align">Align Items</Label>
                <Select
                  id="flex-align"
                  value={localLayout.config.align || 'start'}
                  onChange={(e) => handleConfigChange('align', e.target.value)}
                >
                  <option value="start">Start</option>
                  <option value="center">Center</option>
                  <option value="end">End</option>
                  <option value="stretch">Stretch</option>
                </Select>
              </div>
            </div>
          )}

          {/* Stack Layout Config */}
          {localLayout.type === 'stack' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="stack-spacing">Spacing</Label>
                <Select
                  id="stack-spacing"
                  value={localLayout.config.spacing || 'md'}
                  onChange={(e) => handleConfigChange('spacing', e.target.value)}
                >
                  <option value="xs">XS</option>
                  <option value="sm">SM</option>
                  <option value="md">MD</option>
                  <option value="lg">LG</option>
                  <option value="xl">XL</option>
                </Select>
              </div>
            </div>
          )}

          {/* Container Layout Config */}
          {localLayout.type === 'container' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="container-max-width">Max Width</Label>
                <Select
                  id="container-max-width"
                  value={localLayout.config.maxWidth || 'xl'}
                  onChange={(e) => handleConfigChange('maxWidth', e.target.value)}
                >
                  <option value="sm">SM</option>
                  <option value="md">MD</option>
                  <option value="lg">LG</option>
                  <option value="xl">XL</option>
                  <option value="2xl">2XL</option>
                  <option value="full">Full</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="container-padding">Padding</Label>
                <Select
                  id="container-padding"
                  value={localLayout.config.padding || 'base'}
                  onChange={(e) => handleConfigChange('padding', e.target.value)}
                >
                  <option value="xs">XS</option>
                  <option value="sm">SM</option>
                  <option value="base">Base</option>
                  <option value="md">MD</option>
                  <option value="lg">LG</option>
                  <option value="xl">XL</option>
                </Select>
              </div>
            </div>
          )}

          {/* Custom Layout Config */}
          {localLayout.type === 'custom' && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Custom layout configuration. Edit the config object directly in the feature editor.
            </div>
          )}

          {/* Preview Info */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="text-sm font-medium mb-1">Layout Preview</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {components.length} component{components.length !== 1 ? 's' : ''} in layout
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
