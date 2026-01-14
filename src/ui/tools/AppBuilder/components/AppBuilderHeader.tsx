'use client';

import { Button, Input } from '../../../atoms';
import type { ValidationResult } from '../types';
import type { LoadingState } from '../hooks/useAppBuilder';

export interface AppBuilderHeaderProps {
  appName: string;
  onAppNameChange: (name: string) => void;
  validation: ValidationResult;
  isLoading: LoadingState;
  onSave: () => void;
  onExportJSON: () => void;
  onExportCode: () => void;
  onViewCode: () => void;
}

/**
 * AppBuilderHeader
 *
 * Header component with app name input and action buttons.
 */
export function AppBuilderHeader({
  appName,
  onAppNameChange,
  validation,
  isLoading,
  onSave,
  onExportJSON,
  onExportCode,
  onViewCode,
}: AppBuilderHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            App Builder
          </h1>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={appName}
              onChange={(e) => onAppNameChange(e.target.value)}
              placeholder="App name"
              size="sm"
              className="w-48"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!validation.valid && (
            <span className="text-xs text-red-600 dark:text-red-400">
              {validation.errors.length} error
              {validation.errors.length !== 1 ? 's' : ''}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isLoading !== null}
          >
            {isLoading === 'save' ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportJSON}
            disabled={isLoading !== null}
          >
            {isLoading === 'exportJson' ? 'Exporting...' : 'Export JSON'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExportCode}
            disabled={isLoading !== null}
          >
            {isLoading === 'exportCode' ? 'Exporting...' : 'Export Code'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onViewCode}
            disabled={isLoading !== null}
          >
            {isLoading === 'viewCode' ? 'Copying...' : 'View Code'}
          </Button>
        </div>
      </div>
    </div>
  );
}
