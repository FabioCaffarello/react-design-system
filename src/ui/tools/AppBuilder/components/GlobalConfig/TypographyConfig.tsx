'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { GlobalTokensConfig } from '../../types';
import Accordion from '../../../../molecules/Accordion/Accordion';
import { FontSizeConfigurator } from './configurators/FontSizeConfigurator';
import { FontWeightConfigurator } from './configurators/FontWeightConfigurator';
import { LineHeightConfigurator } from './configurators/LineHeightConfigurator';
import { Input, Label } from '../../../../atoms';

export interface TypographyConfigProps {
  onAccordionChange?: (activeId: string | null) => void;
  className?: string;
}

/**
 * TypographyConfig
 * 
 * Configuration component for typography tokens.
 * Uses Accordion with type="single" so only one item can be open at a time.
 */
export function TypographyConfig({
  onAccordionChange,
  className = '',
}: TypographyConfigProps) {
  const form = useFormContext<GlobalTokensConfig>();
  const { register, watch } = form;
  const typography = watch('typography');
  const [openItem, setOpenItem] = useState<string>('fontSizes');

  const handleValueChange = (value: string | string[]) => {
    const activeId = Array.isArray(value) ? value[0] || null : value || null;
    setOpenItem(activeId || '');
    onAccordionChange?.(activeId ? `typography-${activeId}` : null);
  };

  const accordionItems = [
    {
      id: 'fontSizes',
      title: 'Font Sizes',
      content: <FontSizeConfigurator />,
      disabled: false,
    },
    {
      id: 'fontWeights',
      title: 'Font Weights',
      content: <FontWeightConfigurator />,
      disabled: false,
    },
    {
      id: 'lineHeights',
      title: 'Line Heights',
      content: <LineHeightConfigurator />,
      disabled: false,
    },
    {
      id: 'fontFamilies',
      title: 'Font Families',
      content: (
        <div className="space-y-3">
          {typography?.fontFamilies &&
            Object.keys(typography.fontFamilies).map((key) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`fontFamily-${key}`} className="text-sm">
                  {key}
                </Label>
                <Input
                  id={`fontFamily-${key}`}
                  type="text"
                  {...register(`typography.fontFamilies.${key}` as const)}
                  placeholder="Arial, sans-serif"
                  size="sm"
                />
              </div>
            ))}
          {(!typography?.fontFamilies || Object.keys(typography.fontFamilies).length === 0) && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No font families configured. Using defaults.
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
