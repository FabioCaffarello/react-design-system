/**
 * Token Preview Component
 * 
 * Preview component for visualizing token configurations.
 */

import { Card } from '../../../../molecules';
import type { TokenConfig } from '../../types';

export interface TokenPreviewProps {
  tokens: TokenConfig;
}

export function TokenPreview({ tokens }: TokenPreviewProps) {
  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Token Preview</h3>
      </div>
      
      <div className="p-4 space-y-4">
        {tokens.colors && (
          <div>
            <h4 className="font-medium mb-2">Colors</h4>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(tokens.colors).map(([role, shades]) =>
                Object.entries(shades).map(([shade, value]) => (
                  <div key={`${role}-${shade}`} className="text-center">
                    <div
                      className="w-full h-16 rounded border"
                      style={{ backgroundColor: value.hex }}
                    />
                    <div className="text-xs mt-1">{role}-{shade}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tokens.spacing && (
          <div>
            <h4 className="font-medium mb-2">Spacing</h4>
            <div className="space-y-2">
              {Object.entries(tokens.spacing).map(([scale, value]) => (
                <div key={scale} className="flex items-center gap-2">
                  <div className="w-16 text-sm">{scale}</div>
                  <div
                    className="bg-blue-500"
                    style={{
                      width: value.px,
                      height: '20px',
                      minWidth: '4px',
                    }}
                  />
                  <div className="text-xs text-gray-500">{value.px}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tokens.typography && (
          <div>
            <h4 className="font-medium mb-2">Typography</h4>
            <div className="space-y-2">
              {Object.entries(tokens.typography.fontSizes).map(([size, value]) => (
                <div key={size} style={{ fontSize: value.px }}>
                  {size}: The quick brown fox jumps over the lazy dog
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
