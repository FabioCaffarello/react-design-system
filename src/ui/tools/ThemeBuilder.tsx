'use client';

import { useState, useMemo } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { Badge, Button, Input, Label } from '../atoms';
import { Card } from '../molecules';
import { SPACING_TOKENS } from '../tokens/spacing';
import { TypographyTokenFactory } from '../tokens/typography';
import { ThemeBuilder } from '../themes/ThemeBuilder';
import type { CustomThemeConfig } from '../themes/types';
import type { ColorRole } from '../tokens/colors';
import { COLOR_TOKENS_LIGHT } from '../tokens/colors';

/**
 * Theme Builder Component
 * 
 * Interactive tool for building custom themes with real-time preview.
 * Allows adjusting colors, spacing, typography and exporting themes.
 * 
 * @example
 * ```tsx
 * <ThemeBuilder />
 * ```
 */
export function ThemeBuilderComponent() {
  const { theme, colors } = useTheme();
  const [themeName, setThemeName] = useState('custom-theme');
  const [baseTheme, setBaseTheme] = useState<'light' | 'dark'>('light');
  const [selectedColorRole, setSelectedColorRole] = useState<ColorRole>('primary');
  const [customPrimaryColor, setCustomPrimaryColor] = useState(colors.primary.DEFAULT.hex);
  const [exportFormat, setExportFormat] = useState<'json' | 'css' | 'typescript'>('json');

  const colorRoles: ColorRole[] = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'];

  // Build theme configuration
  const themeConfig: CustomThemeConfig = useMemo(() => ({
    name: themeName,
    base: baseTheme,
    colors: {
      primary: {
        DEFAULT: {
          hex: customPrimaryColor,
          rgb: hexToRgb(customPrimaryColor),
          tailwind: 'custom',
        },
      },
    },
  }), [themeName, baseTheme, customPrimaryColor]);

  // Build theme
  const builtTheme = useMemo(() => {
    try {
      const builder = ThemeBuilder.create(themeConfig);
      return builder.build();
    } catch (error) {
      console.error('Error building theme:', error);
      return null;
    }
  }, [themeConfig]);

  // Export theme
  const exportTheme = () => {
    if (!builtTheme) return;

    let content = '';
    let mimeType = 'application/json';
    let filename = `${themeName}.json`;

    if (exportFormat === 'json') {
      content = JSON.stringify(builtTheme, null, 2);
    } else if (exportFormat === 'css') {
      content = generateCSSVariables(builtTheme.cssVariables);
      mimeType = 'text/css';
      filename = `${themeName}.css`;
    } else if (exportFormat === 'typescript') {
      content = generateTypeScript(builtTheme);
      mimeType = 'text/typescript';
      filename = `${themeName}.ts`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ 
      padding: SPACING_TOKENS.base.px,
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING_TOKENS.lg.px,
      minHeight: '100vh',
      backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000',
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingBottom: SPACING_TOKENS.lg.px,
        borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e5e5e5'}`,
      }}>
        <h1 style={{ 
          fontSize: TypographyTokenFactory.create('3xl').fontSize.px,
          fontWeight: 700,
          margin: 0,
        }}>
          Theme Builder
        </h1>
        <div style={{ display: 'flex', gap: SPACING_TOKENS.sm.px }}>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'json' | 'css' | 'typescript')}
            style={{
              padding: `${SPACING_TOKENS.xs.px} ${SPACING_TOKENS.sm.px}`,
              borderRadius: '4px',
              border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`,
              backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#000000',
            }}
          >
            <option value="json">JSON</option>
            <option value="css">CSS Variables</option>
            <option value="typescript">TypeScript</option>
          </select>
          <Button onClick={exportTheme} disabled={!builtTheme}>
            Export Theme
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: SPACING_TOKENS.lg.px }}>
        {/* Controls Sidebar */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: SPACING_TOKENS.lg.px,
          position: 'sticky',
          top: SPACING_TOKENS.base.px,
          alignSelf: 'start',
          maxHeight: 'calc(100vh - 2rem)',
          overflowY: 'auto',
        }}>
          {/* Theme Configuration */}
          <Card>
            <div style={{ padding: SPACING_TOKENS.md.px, borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e5e5e5'}` }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Theme Configuration</h3>
            </div>
            <div style={{ padding: SPACING_TOKENS.md.px, display: 'flex', flexDirection: 'column', gap: SPACING_TOKENS.md.px }}>
              <div>
                <Label>Theme Name</Label>
                <Input
                  type="text"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="custom-theme"
                />
              </div>
              <div>
                <Label>Base Theme</Label>
                <select
                  value={baseTheme}
                  onChange={(e) => setBaseTheme(e.target.value as 'light' | 'dark')}
                  style={{
                    width: '100%',
                    padding: SPACING_TOKENS.sm.px,
                    borderRadius: '4px',
                    border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`,
                    backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                  }}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Color Customization */}
          <Card>
            <div style={{ padding: SPACING_TOKENS.md.px, borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e5e5e5'}` }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Color Customization</h3>
            </div>
            <div style={{ padding: SPACING_TOKENS.md.px, display: 'flex', flexDirection: 'column', gap: SPACING_TOKENS.md.px }}>
              <Label>Color Role</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING_TOKENS.xs.px }}>
                {colorRoles.map((role) => (
                  <Badge
                    key={role}
                    variant={selectedColorRole === role ? 'primary' : 'secondary'}
                    onClick={() => setSelectedColorRole(role)}
                    style={{ cursor: 'pointer' }}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
              
              {selectedColorRole === 'primary' && (
                <div>
                  <Label>Primary Color</Label>
                  <div style={{ display: 'flex', gap: SPACING_TOKENS.sm.px, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={customPrimaryColor}
                      onChange={(e) => setCustomPrimaryColor(e.target.value)}
                      style={{
                        width: '60px',
                        height: '40px',
                        border: `1px solid ${theme === 'dark' ? '#555' : '#ddd'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    />
                    <Input
                      type="text"
                      value={customPrimaryColor}
                      onChange={(e) => setCustomPrimaryColor(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Theme Info */}
          {builtTheme && (
            <Card>
              <div style={{ padding: SPACING_TOKENS.md.px, borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e5e5e5'}` }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Theme Info</h3>
              </div>
              <div style={{ padding: SPACING_TOKENS.md.px }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '100px 1fr', 
                  gap: SPACING_TOKENS.sm.px,
                  fontSize: '14px',
                }}>
                  <div style={{ fontWeight: 600 }}>Name:</div>
                  <div>{builtTheme.name}</div>
                  
                  <div style={{ fontWeight: 600 }}>Mode:</div>
                  <div>{builtTheme.mode}</div>
                  
                  <div style={{ fontWeight: 600 }}>Variables:</div>
                  <div>{Object.keys(builtTheme.cssVariables).length}</div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Preview Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING_TOKENS.lg.px }}>
          {/* Component Preview */}
          <Card>
            <div style={{ padding: SPACING_TOKENS.md.px, borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e5e5e5'}` }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Component Preview</h3>
            </div>
            <div style={{ padding: SPACING_TOKENS.lg.px, display: 'flex', flexDirection: 'column', gap: SPACING_TOKENS.lg.px }}>
              <Button
                variant="primary"
                style={{
                  backgroundColor: customPrimaryColor,
                  color: '#ffffff',
                }}
              >
                Primary Button
              </Button>
              
              <div style={{
                padding: SPACING_TOKENS.lg.px,
                border: `2px solid ${customPrimaryColor}`,
                borderRadius: '8px',
                backgroundColor: theme === 'dark' ? '#2a2a2a' : '#ffffff',
              }}>
                <div style={{ 
                  fontWeight: 600, 
                  marginBottom: SPACING_TOKENS.xs.px,
                  color: customPrimaryColor,
                }}>
                  Card with Custom Border
                </div>
                <div style={{ fontSize: '14px', color: theme === 'dark' ? '#ccc' : '#666' }}>
                  This card uses your custom primary color for the border.
                </div>
              </div>

              <div style={{
                padding: SPACING_TOKENS.md.px,
                backgroundColor: customPrimaryColor,
                color: '#ffffff',
                borderRadius: '4px',
                textAlign: 'center',
              }}>
                Background with Custom Color
              </div>
            </div>
          </Card>

          {/* CSS Variables Preview */}
          {builtTheme && (
            <Card>
              <div style={{ padding: SPACING_TOKENS.md.px, borderBottom: `1px solid ${theme === 'dark' ? '#333' : '#e5e5e5'}` }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>CSS Variables</h3>
              </div>
              <div style={{ padding: SPACING_TOKENS.lg.px }}>
                <pre style={{
                  padding: SPACING_TOKENS.md.px,
                  backgroundColor: theme === 'dark' ? '#2a2a2a' : '#f5f5f5',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  maxHeight: '400px',
                }}>
                  {generateCSSVariables(builtTheme.cssVariables)}
                </pre>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0, 0, 0';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

function generateCSSVariables(variables: Record<string, string>): string {
  const lines = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
  return `:root {\n${lines}\n}`;
}

function generateTypeScript(theme: any): string {
  return `export const ${theme.name.replace(/-/g, '_')} = ${JSON.stringify(theme, null, 2)} as const;`;
}
