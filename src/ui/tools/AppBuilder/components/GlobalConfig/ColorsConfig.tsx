'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { GlobalTokensConfig } from '../../types';
import Accordion from '../../../../molecules/Accordion/Accordion';
import { Input, Label } from '../../../../atoms';
import { Card } from '../../../../molecules';

export interface ColorsConfigProps {
  onAccordionChange?: (activeId: string | null) => void;
  className?: string;
}

/**
 * ColorsConfig
 * 
 * Configuration component for color tokens.
 * Uses Accordion with type="single".
 */
export function ColorsConfig({ onAccordionChange, className = '' }: ColorsConfigProps) {
  const form = useFormContext<GlobalTokensConfig>();
  const { register, watch } = form;
  const colors = watch('colors');
  const [openItem, setOpenItem] = useState<string>('palette');

  const handleValueChange = (value: string | string[]) => {
    const activeId = Array.isArray(value) ? value[0] || null : value || null;
    setOpenItem(activeId || '');
    onAccordionChange?.(activeId ? `colors-${activeId}` : null);
  };

  const paletteKeys = colors?.palette ? Object.keys(colors.palette) : [];
  const semanticKeys = colors?.semantic ? Object.keys(colors.semantic) : [];

  const accordionItems = [
    {
      id: 'palette',
      title: 'Color Palette',
      content: (
        <div className="space-y-3">
          {paletteKeys.map((key) => {
            const color = colors?.palette?.[key];
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor={`color-${key}`} className="text-sm">
                    {key}
                  </Label>
                  {color && (
                    <div
                      className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </div>
                <Input
                  id={`color-${key}`}
                  type="text"
                  {...register(`colors.palette.${key}` as const)}
                  placeholder="#6366f1"
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      ),
      disabled: false,
    },
    {
      id: 'semantic',
      title: 'Semantic Colors',
      content: (
        <div className="space-y-3">
          {semanticKeys.length > 0 ? (
            semanticKeys.map((key) => {
              const color = colors?.semantic?.[key];
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`semantic-${key}`} className="text-sm">
                      {key}
                    </Label>
                    {color && (
                      <div
                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color }}
                      />
                    )}
                  </div>
                  <Input
                    id={`semantic-${key}`}
                    type="text"
                    {...register(`colors.semantic.${key}` as const)}
                    placeholder="#ffffff"
                    size="sm"
                  />
                </div>
              );
            })
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No semantic colors configured. Using defaults.
            </p>
          )}
        </div>
      ),
      disabled: false,
    },
  ];

  return (
    <div className={className}>
      <Accordion
        type="single"
        items={accordionItems}
        defaultOpen={openItem}
        onValueChange={handleValueChange}
      />
    </div>
  );
}
