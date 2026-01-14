/**
 * Typography Token Editor Component
 * 
 * Editor for configuring typography tokens.
 */

import { Card } from '../../../../molecules';
import { Input, Label } from '../../../../atoms';
import type { TypographyTokenConfig } from '../../types';
import { TypographyTokenFactory, FONT_WEIGHT_TOKENS } from '../../../../tokens/typography';

export interface TypographyTokenEditorProps {
  typography: TypographyTokenConfig;
  onChange: (typography: TypographyTokenConfig) => void;
}

export function TypographyTokenEditor({ typography, onChange }: TypographyTokenEditorProps) {
  const fontSizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] as const;
  const fontWeights = ['light', 'normal', 'medium', 'semibold', 'bold'] as const;
  const lineHeights = ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'] as const;

  const currentTypography = typography || {
    fontSizes: {},
    fontWeights: {},
    lineHeights: {},
  };

  const handleFontSizeChange = (size: string, px: string) => {
    const pxValue = parseInt(px, 10);
    if (isNaN(pxValue)) return;

    const updated = {
      ...currentTypography,
      fontSizes: {
        ...currentTypography.fontSizes,
        [size]: {
          px: `${pxValue}px`,
          rem: `${pxValue / 16}rem`,
          tailwind: `text-${size}`,
        },
      },
    };

    onChange(updated);
  };

  const handleFontWeightChange = (weight: string, value: string) => {
    const weightValue = parseInt(value, 10);
    if (isNaN(weightValue)) return;

    const updated = {
      ...currentTypography,
      fontWeights: {
        ...currentTypography.fontWeights,
        [weight]: {
          value: weightValue,
          tailwind: `font-${weight}`,
        },
      },
    };

    onChange(updated);
  };

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Typography Tokens</h3>
      </div>
      
      <div className="p-4 space-y-6">
        <div>
          <h4 className="font-medium mb-2">Font Sizes</h4>
          <div className="space-y-2">
            {fontSizes.map((size) => {
              const token = TypographyTokenFactory.createFontSize(size);
              const currentValue = currentTypography.fontSizes[size]?.px || token.px;
              return (
                <div key={size} className="flex items-center gap-4">
                  <Label className="w-24">{size}</Label>
                  <Input
                    type="number"
                    value={parseInt(currentValue, 10)}
                    onChange={(e) => handleFontSizeChange(size, e.target.value)}
                    className="flex-1"
                  />
                  <div className="text-sm text-gray-500 w-20">{currentValue}</div>
                  <div
                    style={{
                      fontSize: currentValue,
                    }}
                  >
                    Aa
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Font Weights</h4>
          <div className="space-y-2">
            {fontWeights.map((weight) => {
              const token = FONT_WEIGHT_TOKENS[weight];
              const currentValue = currentTypography.fontWeights[weight]?.value || token.value;
              return (
                <div key={weight} className="flex items-center gap-4">
                  <Label className="w-24">{weight}</Label>
                  <Input
                    type="number"
                    value={currentValue}
                    onChange={(e) => handleFontWeightChange(weight, e.target.value)}
                    className="flex-1"
                  />
                  <div
                    style={{
                      fontWeight: currentValue,
                    }}
                  >
                    Sample Text
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
