'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { GlobalTokensConfig } from '../../types';
import { Input, Label } from '../../../../atoms';
import { Card } from '../../../../molecules';

export interface ShadowsConfigProps {
  onAccordionChange?: (activeId: string | null) => void;
  className?: string;
}

/**
 * ShadowsConfig
 * 
 * Configuration component for shadow tokens (optional).
 */
export function ShadowsConfig({ onAccordionChange, className = '' }: ShadowsConfigProps) {
  const form = useFormContext<GlobalTokensConfig>();
  const { register, watch } = form;
  const shadows = watch('shadows');

  const shadowKeys = shadows ? Object.keys(shadows) : [];

  // Notify parent when component mounts
  React.useEffect(() => {
    onAccordionChange?.('shadows');
  }, [onAccordionChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Visual Examples */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <Card>
          <div className="p-4 grid grid-cols-2 gap-4">
            {shadowKeys.map((key) => {
              const value = shadows?.[key];
              if (!value) return null;
              return (
                <div
                  key={key}
                  className="p-4 bg-white dark:bg-gray-800 rounded"
                  style={{ boxShadow: value === 'none' ? 'none' : value }}
                >
                  <span className="text-xs text-gray-500">{key}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Configuration Inputs */}
      <div className="space-y-3">
        <Label>Shadow Values</Label>
        {shadowKeys.map((key) => {
          const value = shadows?.[key];
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={`shadow-${key}`} className="text-sm">
                {key}
              </Label>
              <Input
                id={`shadow-${key}`}
                type="text"
                {...register(`shadows.${key}` as const)}
                placeholder="0 1px 2px 0 rgb(0 0 0 / 0.05)"
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
