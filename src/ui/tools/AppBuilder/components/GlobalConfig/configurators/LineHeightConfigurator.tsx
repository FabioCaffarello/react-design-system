'use client';

import { useFormContext } from 'react-hook-form';
import type { GlobalTokensConfig } from '../../../types';
import { Input, Label } from '../../../../../atoms';
import { Card } from '../../../../../molecules';

export interface LineHeightConfiguratorProps {
  className?: string;
}

/**
 * LineHeightConfigurator
 * 
 * Visual component for configuring line heights.
 * Shows examples of text with different line heights.
 */
export function LineHeightConfigurator({ className = '' }: LineHeightConfiguratorProps) {
  const form = useFormContext<GlobalTokensConfig>();
  const { register, watch } = form;
  const lineHeights = watch('typography.lineHeights');

  const heightKeys = Object.keys(lineHeights || {});

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Visual Examples */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <Card>
          <div className="p-4 space-y-4">
            {heightKeys.map((key) => {
              const height = lineHeights?.[key];
              if (!height) return null;
              return (
                <div key={key} className="space-y-1">
                  <span className="text-xs text-gray-500">{key}:</span>
                  <div
                    style={{ lineHeight: height.value }}
                    className="text-base text-gray-900 dark:text-gray-100 max-w-md"
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris.
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Configuration Inputs */}
      <div className="space-y-3">
        <Label>Line Heights</Label>
        {heightKeys.map((key) => {
          const height = lineHeights?.[key];
          if (!height) return null;
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={`lineHeight-${key}`} className="text-sm">
                {key}
              </Label>
              <Input
                id={`lineHeight-${key}`}
                type="number"
                min="0.5"
                max="3"
                step="0.125"
                {...register(`typography.lineHeights.${key}.value` as const, {
                  valueAsNumber: true,
                })}
                placeholder="1.5"
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
