'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { GlobalTokensConfig } from '../../types';
import { Input, Label, Select } from '../../../../atoms';

export interface SideNavbarConfigProps {
  onAccordionChange?: (activeId: string | null) => void;
  className?: string;
}

/**
 * SideNavbarConfig
 * 
 * Configuration component for SideNavbar settings (optional).
 */
export function SideNavbarConfig({ onAccordionChange, className = '' }: SideNavbarConfigProps) {
  const form = useFormContext<GlobalTokensConfig>();
  const { register, watch } = form;
  const sideNavbar = watch('sideNavbar');

  // Notify parent when component mounts
  React.useEffect(() => {
    onAccordionChange?.('sideNavbar');
  }, [onAccordionChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="sideNavbar-width">Width</Label>
          <Input
            id="sideNavbar-width"
            type="text"
            {...register('sideNavbar.width')}
            placeholder="320px"
            size="sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sideNavbar-navigationWidth">Navigation Width</Label>
          <Input
            id="sideNavbar-navigationWidth"
            type="text"
            {...register('sideNavbar.navigationWidth')}
            placeholder="56px"
            size="sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sideNavbar-variant">Variant</Label>
          <Select
            id="sideNavbar-variant"
            {...register('sideNavbar.variant')}
            size="sm"
          >
            <option value="default">Default</option>
            <option value="elevated">Elevated</option>
            <option value="compact">Compact</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
