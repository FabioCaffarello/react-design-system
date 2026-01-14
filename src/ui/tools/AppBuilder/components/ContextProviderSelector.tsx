'use client';

import { useState } from 'react';
import { Select, Label, Button } from '../../../atoms';
import { Card } from '../../../molecules';
import type { FeatureContextData } from '../types';

export interface ProviderTemplate {
  name: string;
  displayName: string;
  description: string;
  defaultData: unknown;
}

const PROVIDER_TEMPLATES: ProviderTemplate[] = [
  {
    name: 'ThemeProvider',
    displayName: 'Theme Provider',
    description: 'Configure theme settings (light/dark mode, colors)',
    defaultData: {
      defaultTheme: 'light',
      themes: ['light', 'dark'],
    },
  },
  {
    name: 'ConfigProvider',
    displayName: 'Config Provider',
    description: 'Configure application settings and features',
    defaultData: {
      features: {
        debug: false,
        analytics: true,
      },
    },
  },
  {
    name: 'ToastProvider',
    displayName: 'Toast Provider',
    description: 'Configure toast notifications',
    defaultData: {
      maxToasts: 5,
      position: 'top-right',
    },
  },
  {
    name: 'DialogProvider',
    displayName: 'Dialog Provider',
    description: 'Configure dialog modals',
    defaultData: {
      closeOnOverlayClick: true,
      closeOnEscape: true,
    },
  },
];

export interface ContextProviderSelectorProps {
  onSelect: (provider: ProviderTemplate) => void;
  onCancel?: () => void;
}

/**
 * ContextProviderSelector
 *
 * Component for selecting and configuring context providers.
 * Provides templates for common providers.
 */
export function ContextProviderSelector({
  onSelect,
  onCancel,
}: ContextProviderSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('');

  const handleSelect = () => {
    const template = PROVIDER_TEMPLATES.find((p) => p.name === selectedProvider);
    if (template) {
      onSelect(template);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="provider-select" className="mb-2">
          Select Provider Type
        </Label>
        <Select
          id="provider-select"
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
        >
          <option value="">Choose a provider...</option>
          {PROVIDER_TEMPLATES.map((template) => (
            <option key={template.name} value={template.name}>
              {template.displayName}
            </option>
          ))}
        </Select>
      </div>

      {selectedProvider && (
        <Card>
          <div className="p-4 space-y-2">
            {(() => {
              const template = PROVIDER_TEMPLATES.find(
                (p) => p.name === selectedProvider
              );
              if (!template) return null;
              return (
                <>
                  <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {template.displayName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {template.description}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-auto">
                      {JSON.stringify(template.defaultData, null, 2)}
                    </pre>
                  </div>
                </>
              );
            })()}
          </div>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSelect}
          disabled={!selectedProvider}
          className="flex-1"
        >
          Add Provider
        </Button>
        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
