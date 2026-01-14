'use client';

import { useState } from 'react';
import { Input, Label, Select, Button } from '../../atoms';
import { Card } from '../../molecules';

export interface SettingsSlotProps {
  onSettingsChange?: (settings: PlaygroundSettings) => void;
}

export interface PlaygroundSettings {
  autoSave: boolean;
  theme: 'light' | 'dark' | 'system';
  defaultViewMode: 'design' | 'preview' | 'code';
}

export function SettingsSlot({ onSettingsChange }: SettingsSlotProps) {
  const [settings, setSettings] = useState<PlaygroundSettings>({
    autoSave: true,
    theme: 'system',
    defaultViewMode: 'design',
  });

  const handleSettingChange = <K extends keyof PlaygroundSettings>(
    key: K,
    value: PlaygroundSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Settings
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Configure playground preferences
        </p>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card>
          <div className="p-4 space-y-4">
            <div>
              <Label htmlFor="auto-save" className="mb-2">
                Auto Save
              </Label>
              <Select
                id="auto-save"
                value={settings.autoSave ? 'true' : 'false'}
                onChange={(e) =>
                  handleSettingChange('autoSave', e.target.value === 'true')
                }
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="theme" className="mb-2">
                Theme
              </Label>
              <Select
                id="theme"
                value={settings.theme}
                onChange={(e) =>
                  handleSettingChange(
                    'theme',
                    e.target.value as PlaygroundSettings['theme']
                  )
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="default-view" className="mb-2">
                Default View Mode
              </Label>
              <Select
                id="default-view"
                value={settings.defaultViewMode}
                onChange={(e) =>
                  handleSettingChange(
                    'defaultViewMode',
                    e.target.value as PlaygroundSettings['defaultViewMode']
                  )
                }
              >
                <option value="design">Design</option>
                <option value="preview">Preview</option>
                <option value="code">Code</option>
              </Select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
