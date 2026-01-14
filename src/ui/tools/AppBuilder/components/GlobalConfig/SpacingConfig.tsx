'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { GlobalTokensConfig } from '../../types';
import { Input, Label } from '../../../../atoms';
import { Card } from '../../../../molecules';

export interface SpacingConfigProps {
  onAccordionChange?: (activeId: string | null) => void;
  className?: string;
}

/**
 * SpacingConfig
 * 
 * Configuration component for spacing tokens.
 * Shows visual examples of spacing values.
 */
export function SpacingConfig({ onAccordionChange, className = '' }: SpacingConfigProps) {
  const form = useFormContext<GlobalTokensConfig>();
  const { register, watch } = form;
  const spacing = watch('spacing');

  const spacingKeys = spacing ? Object.keys(spacing) : [];

  // Notify parent when component mounts (spacing doesn't have accordion, it's always visible)
  React.useEffect(() => {
    onAccordionChange?.('spacing');
  }, [onAccordionChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Visual Examples */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <Card>
          <div className="p-4 space-y-4">
            {spacingKeys.slice(0, 6).map((key) => {
              const value = spacing?.[key];
              if (!value) return null;
              return (
                <div key={key} className="space-y-1">
                  <span className="text-xs text-gray-500">{key}: {value}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded" />
                    <div style={{ width: value }} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="w-4 h-4 bg-blue-500 rounded" />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Configuration Inputs */}
      <div className="space-y-3">
        <Label>Spacing Values</Label>
        {spacingKeys.map((key) => {
          const value = spacing?.[key];
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={`spacing-${key}`} className="text-sm">
                {key}
              </Label>
              <Input
                id={`spacing-${key}`}
                type="text"
                {...register(`spacing.${key}` as const)}
                placeholder="16px"
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
