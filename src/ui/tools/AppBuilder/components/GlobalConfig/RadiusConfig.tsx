'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { GlobalTokensConfig } from '../../types';
import { Input, Label } from '../../../../atoms';
import { Card } from '../../../../molecules';

export interface RadiusConfigProps {
  onAccordionChange?: (activeId: string | null) => void;
  className?: string;
}

/**
 * RadiusConfig
 * 
 * Configuration component for radius tokens (optional).
 */
export function RadiusConfig({ onAccordionChange, className = '' }: RadiusConfigProps) {
  const form = useFormContext<GlobalTokensConfig>();
  const { register, watch } = form;
  const radius = watch('radius');

  const radiusKeys = radius ? Object.keys(radius) : [];

  // Notify parent when component mounts
  React.useEffect(() => {
    onAccordionChange?.('radius');
  }, [onAccordionChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Visual Examples */}
      <div className="space-y-2">
        <Label>Preview</Label>
        <Card>
          <div className="p-4 grid grid-cols-3 gap-4">
            {radiusKeys.map((key) => {
              const value = radius?.[key];
              if (!value) return null;
              return (
                <div key={key} className="space-y-1">
                  <span className="text-xs text-gray-500">{key}</span>
                  <div
                    className="w-16 h-16 bg-blue-500"
                    style={{ borderRadius: value }}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Configuration Inputs */}
      <div className="space-y-3">
        <Label>Radius Values</Label>
        {radiusKeys.map((key) => {
          const value = radius?.[key];
          return (
            <div key={key} className="space-y-2">
              <Label htmlFor={`radius-${key}`} className="text-sm">
                {key}
              </Label>
              <Input
                id={`radius-${key}`}
                type="text"
                {...register(`radius.${key}` as const)}
                placeholder="8px"
                size="sm"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
