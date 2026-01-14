'use client';

import { useFormContext } from 'react-hook-form';
import type { GlobalTokensConfig } from '../../../types';
import { Input, Label } from '../../../../../atoms';
import { Card } from '../../../../../molecules';

export interface FontWeightConfiguratorProps {
  className?: string;
}

/**
 * FontWeightConfigurator
 * 
 * Visual component for configuring font weights.
 * Shows examples of text with different weights.
 */
export function FontWeightConfigurator({ className = '' }: FontWeightConfiguratorProps) {
  const form = useFormContext<GlobalTokensConfig>();
  const { register, watch } = form;
  const fontWeights = watch('typography.fontWeights');

  const weightKeys = Object.keys(fontWeights || {});

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Visual Examples */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <Card>
          <div className="p-4 space-y-2">
            {weightKeys.map((key) => {
              const weight = fontWeights?.[key];
              if (!weight) return null;
              return (
                <div key={key} className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-20">{key}:</span>
                  <span
                    style={{ fontWeight: weight.value }}
                    className="text-base text-gray-900 dark:text-gray-100"
                  >
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
        <Label>Font Weights</Label>
        {weightKeys.map((key) => {
          const weight = fontWeights?.[key];
          if (!weight) return null;
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={`fontWeight-${key}`} className="text-sm">
                {key}
              </Label>
              <Input
                id={`fontWeight-${key}`}
                type="number"
                min="100"
                max="900"
                step="100"
                {...register(`typography.fontWeights.${key}.value` as const, {
                  valueAsNumber: true,
                })}
                placeholder="400"
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
