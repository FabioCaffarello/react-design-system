'use client';

import type { GlobalTokensConfig } from '../../../types';
import { Card } from '../../../../../molecules';

export interface RadiusPreviewProps {
  config: GlobalTokensConfig;
}

/**
 * RadiusPreview
 * 
 * Preview component for radius tokens.
 */
export function RadiusPreview({ config }: RadiusPreviewProps) {
  const { radius } = config;

  if (!radius) {
    return (
      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No radius values configured. Using defaults.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Radius Preview
      </h3>

      <Card>
        <div className="p-4 grid grid-cols-3 gap-6">
          {Object.entries(radius).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {key}
              </span>
              <div className="space-y-2">
                <div
                  className="w-20 h-20 bg-blue-500"
                  style={{ borderRadius: value }}
                />
                <div className="text-xs text-gray-500">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
