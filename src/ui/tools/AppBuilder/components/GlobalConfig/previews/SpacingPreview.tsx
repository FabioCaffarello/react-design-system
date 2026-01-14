'use client';

import type { GlobalTokensConfig } from '../../../types';
import { Card } from '../../../../../molecules';

export interface SpacingPreviewProps {
  config: GlobalTokensConfig;
}

/**
 * SpacingPreview
 * 
 * Preview component for spacing tokens.
 * Shows visual examples of spacing values.
 */
export function SpacingPreview({ config }: SpacingPreviewProps) {
  const { spacing } = config;

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Spacing Preview
      </h3>

      <Card>
        <div className="p-4 space-y-6">
          {spacing &&
            Object.entries(spacing).slice(0, 8).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {key}
                  </span>
                  <span className="text-xs text-gray-500">{value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded" />
                  <div style={{ width: value }} className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-8 h-8 bg-blue-500 rounded" />
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
