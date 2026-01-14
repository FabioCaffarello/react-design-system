'use client';

import type { GlobalTokensConfig } from '../../../types';
import { Card } from '../../../../../molecules';

export interface ShadowsPreviewProps {
  config: GlobalTokensConfig;
}

/**
 * ShadowsPreview
 * 
 * Preview component for shadow tokens.
 */
export function ShadowsPreview({ config }: ShadowsPreviewProps) {
  const { shadows } = config;

  if (!shadows) {
    return (
      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No shadows configured. Using defaults.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Shadows Preview
      </h3>

      <Card>
        <div className="p-4 grid grid-cols-2 gap-6">
          {Object.entries(shadows).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {key}
              </span>
              <div
                className="p-6 bg-white dark:bg-gray-800 rounded"
                style={{ boxShadow: value === 'none' ? 'none' : value }}
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Card with {key} shadow
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
