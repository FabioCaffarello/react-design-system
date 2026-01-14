/**
 * Spacing Token Editor Component
 * 
 * Editor for configuring spacing tokens.
 */

import { Card } from '../../../../molecules';
import { Input, Label } from '../../../../atoms';
import type { SpacingTokenConfig } from '../../types';
import { SPACING_TOKENS } from '../../../../tokens/spacing';

export interface SpacingTokenEditorProps {
  spacing: SpacingTokenConfig;
  onChange: (spacing: SpacingTokenConfig) => void;
}

export function SpacingTokenEditor({ spacing, onChange }: SpacingTokenEditorProps) {
  const defaultSpacing = SPACING_TOKENS;
  const currentSpacing = spacing || defaultSpacing;

  const handleSpacingChange = (scale: string, px: string) => {
    const pxValue = parseInt(px, 10);
    if (isNaN(pxValue)) return;

    const updated = {
      ...currentSpacing,
      [scale]: {
        px: `${pxValue}px`,
        rem: `${pxValue / 16}rem`,
        tailwind: `spacing-${scale}`,
      },
    };

    onChange(updated);
  };

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Spacing Tokens</h3>
      </div>
      
      <div className="p-4 space-y-4">
        {Object.entries(currentSpacing).map(([scale, value]) => (
          <div key={scale} className="flex items-center gap-4">
            <Label className="w-24">{scale}</Label>
            <Input
              type="number"
              value={parseInt(value.px, 10)}
              onChange={(e) => handleSpacingChange(scale, e.target.value)}
              className="flex-1"
            />
            <div className="text-sm text-gray-500 w-20">{value.px}</div>
            <div
              className="bg-blue-500"
              style={{
                width: value.px,
                height: '20px',
                minWidth: '4px',
              }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
