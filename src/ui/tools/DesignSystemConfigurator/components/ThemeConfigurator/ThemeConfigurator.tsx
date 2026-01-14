/**
 * Theme Configurator Component
 * 
 * Component for configuring themes.
 */

import { useState } from 'react';
import { useTheme } from '../../../../providers/ThemeProvider';
import { Card } from '../../../../molecules';
import { Input, Label, Button, Select } from '../../../../atoms';
import { ThemeBuilder } from '../../../../themes/ThemeBuilder';
import type { ThemeConfig, TokenConfig } from '../../types';
import type { ThemeMode } from '../../../../tokens/tokens.factory';

export interface ThemeConfiguratorProps {
  themes: ThemeConfig[];
  currentTheme?: string;
  tokens: TokenConfig;
  onThemeChange: (theme: ThemeConfig) => void;
  onCurrentThemeChange: (name: string | undefined) => void;
}

export function ThemeConfigurator({
  themes,
  currentTheme,
  tokens,
  onThemeChange,
  onCurrentThemeChange,
}: ThemeConfiguratorProps) {
  const { theme } = useTheme();
  const [themeName, setThemeName] = useState('custom-theme');
  const [baseTheme, setBaseTheme] = useState<ThemeMode>('light');

  const handleCreateTheme = () => {
    const newTheme: ThemeConfig = {
      name: themeName,
      base: baseTheme,
      tokens,
    };

    onThemeChange(newTheme);
    onCurrentThemeChange(themeName);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Theme Configuration</h3>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <Label>Theme Name</Label>
            <Input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="Enter theme name"
            />
          </div>

          <div>
            <Label>Base Theme</Label>
            <Select
              value={baseTheme}
              onChange={(e) => setBaseTheme(e.target.value as ThemeMode)}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          </div>

          <Button onClick={handleCreateTheme}>Create Theme</Button>
        </div>
      </Card>

      {themes.length > 0 && (
        <Card>
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Existing Themes</h3>
          </div>
          
          <div className="p-4 space-y-2">
            {themes.map((theme) => (
              <div
                key={theme.name}
                className={`p-2 rounded cursor-pointer ${
                  currentTheme === theme.name ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => onCurrentThemeChange(theme.name)}
              >
                <div className="font-medium">{theme.name}</div>
                <div className="text-sm text-gray-500">Base: {theme.base}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
