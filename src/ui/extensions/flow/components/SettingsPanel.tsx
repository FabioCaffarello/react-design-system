/**
 * Settings Panel Component
 * 
 * Panel for general playground settings (theme, performance, debug).
 */

import React, { useState, useCallback } from 'react';
import { Card } from '../../../molecules';
import { Label, Select, Button, Checkbox } from '../../../atoms';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../../tokens';

export interface SettingsPanelProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  performanceMode?: boolean;
  onPerformanceModeChange?: (enabled: boolean) => void;
  debugMode?: boolean;
  onDebugModeChange?: (enabled: boolean) => void;
}

export function SettingsPanel({
  theme,
  onThemeChange,
  performanceMode = false,
  onPerformanceModeChange,
  debugMode = false,
  onDebugModeChange,
}: SettingsPanelProps) {
  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
      {/* Theme Selection */}
      <Card padding="md">
        <Label 
          htmlFor="settings-theme" 
          className={`${getSpacingClass('sm', 'mb')} block`}
        >
          Theme
        </Label>
        <Select
          id="settings-theme"
          value={theme}
          onChange={(e) => onThemeChange(e.target.value as 'light' | 'dark')}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
        <p
          className={`
            ${getTypographyClasses('caption')}
            ${getColorClass('neutral', 'DEFAULT', 'text')}
            ${getSpacingClass('xs', 'mt')}
            m-0
          `}
        >
          Choose between light and dark theme for the playground
        </p>
      </Card>

      {/* Performance Mode */}
      {onPerformanceModeChange && (
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="settings-performance">Performance Mode</Label>
              <p
                className={`
                  ${getTypographyClasses('caption')}
                  ${getColorClass('neutral', 'DEFAULT', 'text')}
                  ${getSpacingClass('xs', 'mt')}
                  m-0
                `}
              >
                Optimize rendering for large flows
              </p>
            </div>
            <Checkbox
              id="settings-performance"
              checked={performanceMode}
              onChange={onPerformanceModeChange}
            />
          </div>
        </Card>
      )}

      {/* Debug Mode */}
      {onDebugModeChange && (
        <Card padding="md">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="settings-debug">Debug Mode</Label>
              <p
                className={`
                  ${getTypographyClasses('caption')}
                  ${getColorClass('neutral', 'DEFAULT', 'text')}
                  ${getSpacingClass('xs', 'mt')}
                  m-0
                `}
              >
                Show debug information and logs
              </p>
            </div>
            <Checkbox
              id="settings-debug"
              checked={debugMode}
              onChange={onDebugModeChange}
            />
          </div>
        </Card>
      )}

      {/* Info */}
      <Card padding="md">
        <h3
          className={`
            ${getTypographyClasses('h4')}
            ${getColorClass('neutral', 'dark', 'text')}
            m-0
            ${getSpacingClass('sm', 'mb')}
          `}
        >
          About Settings
        </h3>
        <p
          className={`
            ${getTypographyClasses('body')}
            ${getColorClass('neutral', 'DEFAULT', 'text')}
            m-0
          `}
        >
          These settings affect the entire playground experience. Changes are applied immediately.
        </p>
      </Card>
    </div>
  );
}
