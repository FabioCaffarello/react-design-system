/**
 * Color Token Editor Component
 * 
 * Editor for configuring color tokens.
 */

import { useState } from 'react';
import { useTheme } from '../../../../providers/ThemeProvider';
import { Card } from '../../../../molecules';
import { Input, Label, Button } from '../../../../atoms';
import type { ColorTokenConfig } from '../../types';
import { COLOR_TOKENS_LIGHT } from '../../../../tokens/colors';

export interface ColorTokenEditorProps {
  colors: ColorTokenConfig;
  onChange: (colors: ColorTokenConfig) => void;
}

export function ColorTokenEditor({ colors, onChange }: ColorTokenEditorProps) {
  const { theme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<string>('primary');
  const [selectedShade, setSelectedShade] = useState<string>('DEFAULT');

  const roles = Object.keys(colors || COLOR_TOKENS_LIGHT);
  const shades = selectedRole ? Object.keys(colors?.[selectedRole] || COLOR_TOKENS_LIGHT[selectedRole as keyof typeof COLOR_TOKENS_LIGHT] || {}) : [];

  const currentColor = colors?.[selectedRole]?.[selectedShade]?.hex || '#000000';

  const handleColorChange = (hex: string) => {
    if (!colors) return;
    
    const updated = {
      ...colors,
      [selectedRole]: {
        ...colors[selectedRole],
        [selectedShade]: {
          hex,
          rgb: hexToRgb(hex),
          tailwind: 'custom',
        },
      },
    };
    
    onChange(updated);
  };

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Color Tokens</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <div>
          <Label>Color Role</Label>
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              const firstShade = Object.keys(colors?.[e.target.value] || {})[0];
              setSelectedShade(firstShade || 'DEFAULT');
            }}
            className="w-full p-2 border rounded"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Shade</Label>
          <select
            value={selectedShade}
            onChange={(e) => setSelectedShade(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {shades.map((shade) => (
              <option key={shade} value={shade}>
                {shade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Color Value</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={currentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-20 h-10"
            />
            <Input
              type="text"
              value={currentColor}
              onChange={(e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                  handleColorChange(e.target.value);
                }
              }}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        <div className="p-4 rounded" style={{ backgroundColor: currentColor }}>
          <div className="text-sm" style={{ color: getContrastColor(currentColor) }}>
            Preview Text
          </div>
        </div>
      </div>
    </Card>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : 'rgb(0, 0, 0)';
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}
