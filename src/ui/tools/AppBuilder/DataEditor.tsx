'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { DataEditorProps, FeatureContextData } from './types';
import { validateContextData, parseAndValidateJSON } from './utils/DataValidator';
import { getProviderTemplate, createContextDataFromTemplate, hasTemplate } from './utils/DataTemplates';
import { AVAILABLE_PROVIDERS } from './utils/ProviderIntegration';
import { Button, Label, Select, Textarea } from '../../atoms';
import { Card } from '../../molecules';

/**
 * Data Editor
 * 
 * Edit JSON data for context providers with validation and templates
 */
export function DataEditor({
  contextData,
  onContextDataChange,
  providerTypes,
}: DataEditorProps) {
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[] } | null>(null);

  // Initialize JSON string
  useEffect(() => {
    try {
      setJsonString(JSON.stringify(contextData.data, null, 2));
      setError(null);
    } catch (err) {
      setError('Failed to serialize data');
    }
  }, [contextData.providerName, contextData.data]);

  // Validate on change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const result = parseAndValidateJSON(jsonString);
      if (result.valid) {
        const contextValidation = validateContextData({
          ...contextData,
          data: result.data,
        });
        setValidation(contextValidation);
        setError(null);
      } else {
        setError(result.errors[0] || 'Invalid JSON');
        setValidation(null);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [jsonString, contextData.providerName]);

  const handleJsonChange = useCallback((json: string) => {
    try {
      setJsonString(json);

      const result = parseAndValidateJSON(json);
      if (result.valid) {
        const updatedContextData: FeatureContextData = {
          ...contextData,
          data: result.data,
        };
        onContextDataChange(updatedContextData);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      setError(error instanceof Error ? error.message : 'Failed to parse JSON');
    }
  }, [contextData, onContextDataChange]);

  const handleProviderChange = useCallback((providerName: string) => {
    try {
      if (hasTemplate(providerName)) {
        const templateData = createContextDataFromTemplate(providerName);
        onContextDataChange(templateData);
      } else {
        onContextDataChange({
          ...contextData,
          providerName,
          data: {},
        });
      }
    } catch (error) {
      console.error('Error changing provider:', error);
      setError(error instanceof Error ? error.message : 'Failed to change provider');
    }
  }, [contextData, onContextDataChange]);

  const handleLoadTemplate = useCallback(() => {
    if (hasTemplate(contextData.providerName)) {
      const template = getProviderTemplate(contextData.providerName);
      setJsonString(JSON.stringify(template, null, 2));
      onContextDataChange({
        ...contextData,
        data: template,
      });
    }
  }, [contextData, onContextDataChange]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonString(formatted);
      handleJsonChange(formatted);
    } catch (err) {
      setError(`Failed to format: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [jsonString, handleJsonChange]);

  const availableProviders = useMemo(() => 
    providerTypes.length > 0 ? providerTypes : AVAILABLE_PROVIDERS,
    [providerTypes]
  );

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4">
          <h4 className="font-semibold mb-4">Context Provider Data</h4>

          {/* Provider Selection */}
          <div className="mb-4">
            <Label htmlFor="provider-name">Provider</Label>
            <Select
              id="provider-name"
              value={contextData.providerName}
              onChange={(e) => handleProviderChange(e.target.value)}
            >
              {availableProviders.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-4">
            {hasTemplate(contextData.providerName) && (
              <Button variant="outline" size="sm" onClick={handleLoadTemplate}>
                Load Template
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleFormat}>
              Format JSON
            </Button>
          </div>

          {/* JSON Editor */}
          <div>
            <Label htmlFor="context-data-json">Data (JSON)</Label>
            <Textarea
              id="context-data-json"
              value={jsonString}
              onChange={(e) => handleJsonChange(e.target.value)}
              rows={12}
              className={`font-mono text-sm ${
                error || (validation && !validation.valid)
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : validation && validation.valid
                  ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                  : ''
              }`}
            />
            {error && (
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</div>
            )}
            {validation && !validation.valid && validation.errors.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                  Validation Errors:
                </div>
                <ul className="text-xs text-red-600 dark:text-red-400 list-disc list-inside">
                  {validation.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            {validation && validation.valid && (
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ Valid JSON
              </div>
            )}
          </div>

          {/* Provider Config */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="context-enabled"
                checked={contextData.config?.enabled !== false}
                onChange={(e) =>
                  onContextDataChange({
                    ...contextData,
                    config: {
                      ...contextData.config,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="context-enabled" className="text-sm">
                Enabled
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="context-merge"
                checked={contextData.config?.mergeWithDefault === true}
                onChange={(e) =>
                  onContextDataChange({
                    ...contextData,
                    config: {
                      ...contextData.config,
                      mergeWithDefault: e.target.checked,
                    },
                  })
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="context-merge" className="text-sm">
                Merge with default
              </Label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
