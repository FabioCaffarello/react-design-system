'use client';

import type { GlobalTokensConfig } from '../../../types';
import { Card } from '../../../../../molecules';

export interface TypographyPreviewProps {
  config: GlobalTokensConfig;
  focus?: 'fontSizes' | 'fontWeights' | 'lineHeights' | 'fontFamilies';
}

/**
 * TypographyPreview
 * 
 * Preview component for typography tokens.
 * Shows examples of text using the configured typography values.
 */
export function TypographyPreview({ config, focus }: TypographyPreviewProps) {
  const { typography } = config;

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Typography Preview
      </h3>

      {/* Font Sizes Preview */}
      {(focus === 'fontSizes' || !focus) && typography.fontSizes && (
        <Card>
          <div className="p-4 space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Font Sizes
            </h4>
            {Object.entries(typography.fontSizes).map(([key, size]) => (
              <div key={key} className="space-y-1">
                <span className="text-xs text-gray-500">{key}: {size.px} / {size.rem}</span>
                <div style={{ fontSize: size.px }} className="text-gray-900 dark:text-gray-100">
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Font Weights Preview */}
      {(focus === 'fontWeights' || !focus) && typography.fontWeights && (
        <Card>
          <div className="p-4 space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Font Weights
            </h4>
            {Object.entries(typography.fontWeights).map(([key, weight]) => (
              <div key={key} className="space-y-1">
                <span className="text-xs text-gray-500">{key}: {weight.value}</span>
                <div
                  style={{ fontWeight: weight.value }}
                  className="text-base text-gray-900 dark:text-gray-100"
                >
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Line Heights Preview */}
      {(focus === 'lineHeights' || !focus) && typography.lineHeights && (
        <Card>
          <div className="p-4 space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Line Heights
            </h4>
            {Object.entries(typography.lineHeights).map(([key, height]) => (
              <div key={key} className="space-y-1">
                <span className="text-xs text-gray-500">{key}: {height.value}</span>
                <div
                  style={{ lineHeight: height.value }}
                  className="text-base text-gray-900 dark:text-gray-100 max-w-md"
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris.
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Combined Example */}
      {!focus && (
        <Card>
          <div className="p-4 space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Combined Example
            </h4>
            <div className="space-y-2">
              {['h1', 'h2', 'h3', 'h4'].map((heading) => {
                const sizeKey = heading === 'h1' ? '4xl' : heading === 'h2' ? '3xl' : heading === 'h3' ? '2xl' : 'xl';
                const size = typography.fontSizes[sizeKey];
                const weight = typography.fontWeights.bold;
                const lineHeight = typography.lineHeights.tight;
                
                if (!size || !weight || !lineHeight) return null;
                
                return (
                  <div
                    key={heading}
                    style={{
                      fontSize: size.px,
                      fontWeight: weight.value,
                      lineHeight: lineHeight.value,
                    }}
                    className="text-gray-900 dark:text-gray-100"
                  >
                    {heading.toUpperCase()}: The quick brown fox jumps over the lazy dog
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
