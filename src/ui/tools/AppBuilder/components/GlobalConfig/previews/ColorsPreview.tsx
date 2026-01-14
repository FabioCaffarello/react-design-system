'use client';

import type { GlobalTokensConfig } from '../../../types';
import { Card } from '../../../../../molecules';

export interface ColorsPreviewProps {
  config: GlobalTokensConfig;
  focus?: 'palette' | 'semantic';
}

/**
 * ColorsPreview
 * 
 * Preview component for color tokens.
 * Shows color swatches and examples.
 */
export function ColorsPreview({ config, focus }: ColorsPreviewProps) {
  const { colors } = config;

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Colors Preview
      </h3>

      {/* Color Palette Preview */}
      {(focus === 'palette' || !focus) && colors.palette && (
        <Card>
          <div className="p-4 space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Color Palette
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colors.palette).map(([key, color]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {key}
                      </div>
                      <div className="text-xs text-gray-500">{color}</div>
                    </div>
                  </div>
                  <div
                    className="p-3 rounded text-white text-sm"
                    style={{ backgroundColor: color }}
                  >
                    Sample text
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Semantic Colors Preview */}
      {(focus === 'semantic' || !focus) && colors.semantic && (
        <Card>
          <div className="p-4 space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Semantic Colors
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colors.semantic).map(([key, color]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {key}
                      </div>
                      <div className="text-xs text-gray-500">{color}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
