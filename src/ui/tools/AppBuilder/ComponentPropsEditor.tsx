'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ComponentPropsEditorProps, FeatureComponent } from './types';
import { Input, Label, Button, Textarea, Select } from '../../atoms';
import { Card } from '../../molecules';
import { AddPropDialog } from './components/AddPropDialog';

/**
 * Component Props Editor
 * 
 * Edit component props with type validation
 */
export function ComponentPropsEditor({
  component,
  componentMetadata,
  onComponentChange,
}: ComponentPropsEditorProps) {
  const [propsJson, setPropsJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showAddPropDialog, setShowAddPropDialog] = useState(false);

  // Initialize props JSON
  useEffect(() => {
    try {
      setPropsJson(JSON.stringify(component.props, null, 2));
      setError(null);
    } catch (err) {
      setError('Failed to serialize props');
    }
  }, [component.id]);

  const handlePropsChange = useCallback((json: string) => {
    setPropsJson(json);
    setError(null);

    try {
      const parsed = JSON.parse(json);
      const updatedComponent: FeatureComponent = {
        ...component,
        props: parsed,
      };
      onComponentChange(updatedComponent);
    } catch (err) {
      setError(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [component, onComponentChange]);

  const handlePropFieldChange = useCallback((key: string, value: unknown) => {
    const updatedProps = {
      ...component.props,
      [key]: value,
    };

    const updatedComponent: FeatureComponent = {
      ...component,
      props: updatedProps,
    };

    onComponentChange(updatedComponent);
    setPropsJson(JSON.stringify(updatedProps, null, 2));
  }, [component, onComponentChange]);

  const handleRemoveProp = useCallback((key: string) => {
    const updatedProps = { ...component.props };
    delete updatedProps[key];

    const updatedComponent: FeatureComponent = {
      ...component,
      props: updatedProps,
    };

    onComponentChange(updatedComponent);
    setPropsJson(JSON.stringify(updatedProps, null, 2));
  }, [component, onComponentChange]);

  const handleAddProp = useCallback((key: string, value: unknown) => {
    handlePropFieldChange(key, value);
  }, [handlePropFieldChange]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Component Props</h4>
            <Button variant="outline" size="sm" onClick={() => setShowAddPropDialog(true)}>
              + Add Prop
            </Button>
          </div>

          {/* Add Prop Dialog */}
          <AddPropDialog
            open={showAddPropDialog}
            onOpenChange={setShowAddPropDialog}
            onAdd={handleAddProp}
            existingKeys={Object.keys(component.props)}
          />

          {/* Component Info */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="text-sm">
              <div className="font-medium">{component.name}</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                Type: {component.type} • ID: {component.id}
              </div>
            </div>
          </div>

          {/* Simple Props Editor (for common props) */}
          <div className="space-y-3 mb-4">
            {Object.entries(component.props).map(([key, value]) => {
              const valueType = typeof value;
              const isString = valueType === 'string';
              const isNumber = valueType === 'number';
              const isBoolean = valueType === 'boolean';

              return (
                <div key={key} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`prop-${key}`} className="text-xs">
                      {key} ({valueType})
                    </Label>
                    {isString && (
                      <Input
                        id={`prop-${key}`}
                        type="text"
                        value={value as string}
                        onChange={(e) => handlePropFieldChange(key, e.target.value)}
                        size="sm"
                      />
                    )}
                    {isNumber && (
                      <Input
                        id={`prop-${key}`}
                        type="number"
                        value={value as number}
                        onChange={(e) => handlePropFieldChange(key, Number(e.target.value))}
                        size="sm"
                      />
                    )}
                    {isBoolean && (
                      <Select
                        id={`prop-${key}`}
                        value={String(value)}
                        onChange={(e) => handlePropFieldChange(key, e.target.value === 'true')}
                        size="sm"
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </Select>
                    )}
                    {!isString && !isNumber && !isBoolean && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Complex type - edit in JSON editor
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveProp(key)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </Button>
                </div>
              );
            })}
          </div>

          {/* JSON Editor */}
          <div>
            <Label htmlFor="props-json">Props (JSON)</Label>
            <Textarea
              id="props-json"
              value={propsJson}
              onChange={(e) => handlePropsChange(e.target.value)}
              rows={10}
              className={`font-mono text-sm ${
                error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {error && (
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</div>
            )}
          </div>

          {/* Component Metadata Info */}
          {componentMetadata && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="text-xs font-medium mb-1">Component Info</div>
              {componentMetadata.description && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {componentMetadata.description}
                </div>
              )}
              {componentMetadata.config.variants && (
                <div className="text-xs">
                  <span className="font-medium">Variants:</span>{' '}
                  {componentMetadata.config.variants.join(', ')}
                </div>
              )}
              {componentMetadata.config.sizes && (
                <div className="text-xs">
                  <span className="font-medium">Sizes:</span>{' '}
                  {componentMetadata.config.sizes.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
