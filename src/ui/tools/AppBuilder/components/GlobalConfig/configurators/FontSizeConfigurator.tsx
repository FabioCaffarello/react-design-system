'use client';

import { useFormContextOptional } from '../../../../../molecules/Form';
import type { GlobalTokensConfig } from '../../../types';
import { Input, Label } from '../../../../../atoms';
import { Card } from '../../../../../molecules';

export interface FontSizeConfiguratorProps {
  className?: string;
}

/**
 * FontSizeConfigurator
 * 
 * Visual component for configuring font sizes.
 * Shows examples of text with different sizes to help users configure tokens.
 */
export function FontSizeConfigurator({ className = '' }: FontSizeConfiguratorProps) {
  const form = useFormContextOptional<GlobalTokensConfig>();
  if (!form) {
    return <div className="text-sm text-gray-500">Form context not available</div>;
  }
  const { register, watch } = form;
  const fontSizes = watch('typography.fontSizes');

  const fontSizeKeys = Object.keys(fontSizes || {});

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Visual Examples */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <Card>
          <div className="p-4 space-y-2">
            {fontSizeKeys.map((key) => {
              const size = fontSizes?.[key];
              if (!size) return null;
              return (
                <div key={key} className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-16">{key}:</span>
                  <span style={{ fontSize: size.px }} className="text-gray-900 dark:text-gray-100">
                    The quick brown fox jumps over the lazy dog
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Configuration Inputs */}
      <div className="space-y-3">
        <Label>Font Sizes</Label>
        {fontSizeKeys.map((key) => {
          const size = fontSizes?.[key];
          if (!size) return null;
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={`fontSize-${key}`} className="text-sm">
                {key}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor={`fontSize-${key}-px`} className="text-xs">
                    Pixels (px)
                  </Label>
                  <Input
                    id={`fontSize-${key}-px`}
                    type="text"
                    {...register(`typography.fontSizes.${key}.px` as const)}
                    placeholder="16px"
                    size="sm"
                  />
                </div>
                <div>
                  <Label htmlFor={`fontSize-${key}-rem`} className="text-xs">
                    Rem (rem)
                  </Label>
                  <Input
                    id={`fontSize-${key}-rem`}
                    type="text"
                    {...register(`typography.fontSizes.${key}.rem` as const)}
                    placeholder="1rem"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
