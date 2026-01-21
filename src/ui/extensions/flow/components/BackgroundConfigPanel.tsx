/**
 * Background Config Panel Component
 * 
 * Panel for configuring FlowBackground with all options including
 * variant, size, colors, presets, and live preview.
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '../../../molecules';
import { Label, Input, Select, Checkbox } from '../../../atoms';
import { FlowBackground } from '../organisms/FlowBackground';
import { FlowProvider } from '../organisms/FlowProvider';
import { FlowCanvas } from '../organisms/FlowCanvas';
import type { BackgroundConfig } from '../types/playgroundTypes';
import { 
  backgroundPresets, 
  type BackgroundPreset
} from '../utils/backgroundPresets';
import { useFlowStylesOptional } from '../hooks/useFlowStyles';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses,
  getRadiusClass 
} from '../../../tokens';

export interface BackgroundConfigPanelProps {
  config: BackgroundConfig;
  onChange: (config: BackgroundConfig) => void;
  theme?: 'light' | 'dark';
}

/**
 * Preview component for background presets
 */
function BackgroundPreview({ 
  variant, 
  size, 
  bgColor, 
  patternColor 
}: { 
  variant: 'dots' | 'lines' | 'cross';
  size: number;
  bgColor?: string;
  patternColor?: string;
}) {
  return (
    <div
      className={`
        w-full h-20
        ${getRadiusClass('md')}
        overflow-hidden relative
        border
        ${getColorClass('neutral', 'DEFAULT', 'border')}
      `}
      style={{
        backgroundColor: bgColor || 'transparent',
      }}
    >
      <FlowProvider nodes={[]} edges={[]}>
        <FlowCanvas.Root style={{ width: '100%', height: '100%' }}>
          <FlowBackground
            variant={variant}
            size={size}
            bgColor={bgColor}
            patternColor={patternColor}
          />
        </FlowCanvas.Root>
      </FlowProvider>
    </div>
  );
}

/**
 * Preset Card Component
 */
function PresetCard({
  preset,
  isSelected,
  onClick,
}: {
  preset: BackgroundPreset;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      variant={isSelected ? 'selected' : 'hover'}
      padding="small"
      onClick={onClick}
      className="cursor-pointer transition-all duration-200"
    >
      <div className={getSpacingClass('sm', 'mb')}>
        <BackgroundPreview
          variant={preset.config.variant}
          size={preset.config.size}
          bgColor={preset.config.bgColor}
          patternColor={preset.config.patternColor}
        />
      </div>
      <div
        className={`
          ${getTypographyClasses('label')}
          ${getColorClass('neutral', 'dark', 'text')}
          ${getSpacingClass('xs', 'mb')}
        `}
      >
        {preset.name}
      </div>
      <div
        className={`
          ${getTypographyClasses('caption')}
          ${getColorClass('neutral', 'DEFAULT', 'text')}
        `}
      >
        {preset.description}
      </div>
    </Card>
  );
}

export function BackgroundConfigPanel({
  config,
  onChange,
  theme: _theme = 'light',
}: BackgroundConfigPanelProps) {
  const flowStyles = useFlowStylesOptional();
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [_useCustomColors, setUseCustomColors] = useState(false);

  // Check if current config matches a preset
  const currentPresetId = useMemo(() => {
    return backgroundPresets.find((preset) => {
      return (
        preset.config.variant === config.variant &&
        preset.config.size === config.size &&
        preset.config.bgColor === config.bgColor &&
        preset.config.patternColor === config.patternColor
      );
    })?.id;
  }, [config]);

  // Update selected preset when config changes
  React.useEffect(() => {
    if (currentPresetId) {
      setSelectedPresetId(currentPresetId);
    }
  }, [currentPresetId]);

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: BackgroundPreset) => {
    setSelectedPresetId(preset.id);
    setUseCustomColors(false);
    onChange(preset.config);
  }, [onChange]);

  // Handle show/hide toggle
  const handleShowToggle = useCallback((show: boolean) => {
    onChange({ ...config, show });
  }, [config, onChange]);

  // Handle variant change
  const handleVariantChange = useCallback((variant: 'dots' | 'lines' | 'cross') => {
    onChange({ ...config, variant });
    setSelectedPresetId(null);
  }, [config, onChange]);

  // Handle size change
  const handleSizeChange = useCallback((size: number) => {
    onChange({ ...config, size });
    setSelectedPresetId(null);
  }, [config, onChange]);

  // Handle bgColor change
  const handleBgColorChange = useCallback((bgColor: string) => {
    onChange({ ...config, bgColor: bgColor || undefined });
    setUseCustomColors(true);
    setSelectedPresetId(null);
  }, [config, onChange]);

  // Handle patternColor change
  const handlePatternColorChange = useCallback((patternColor: string) => {
    onChange({ ...config, patternColor: patternColor || undefined });
    setUseCustomColors(true);
    setSelectedPresetId(null);
  }, [config, onChange]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    const defaultConfig: BackgroundConfig = {
      show: true,
      variant: 'dots',
      size: 4,
    };
    onChange(defaultConfig);
    setSelectedPresetId(null);
    setUseCustomColors(false);
  }, [onChange]);

  // Apply theme colors
  const handleApplyThemeColors = useCallback(() => {
    const themeBgColor = flowStyles.getVariable('backgroundColor');
    const themePatternColor = 
      config.variant === 'dots' ? flowStyles.getVariable('backgroundPatternDotsColor') :
      config.variant === 'lines' ? flowStyles.getVariable('backgroundPatternLinesColor') :
      flowStyles.getVariable('backgroundPatternCrossColor');
    
    onChange({
      ...config,
      bgColor: themeBgColor || undefined,
      patternColor: themePatternColor || undefined,
    });
    setUseCustomColors(false);
    setSelectedPresetId(null);
  }, [config, onChange, flowStyles]);

  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
      {/* Show/Hide Toggle */}
      <Card padding="md">
        <div className={`flex items-center justify-between`}>
          <Label htmlFor="background-show">Show Background</Label>
          <Checkbox
            id="background-show"
            checked={config.show}
            onChange={handleShowToggle}
          />
        </div>
      </Card>

      {config.show && (
        <>
          {/* Live Preview */}
          <Card padding="md">
            <Label className={`${getSpacingClass('sm', 'mb')} block`}>
              Preview
            </Label>
            <BackgroundPreview
              variant={config.variant}
              size={config.size}
              bgColor={config.bgColor}
              patternColor={config.patternColor}
            />
          </Card>

          {/* Presets */}
          <Card padding="md">
            <div className={`${getSpacingClass('md', 'mb')} flex justify-between items-center`}>
              <Label>Presets</Label>
            </div>
            <div
              className={`
                grid
                ${getSpacingClass('md', 'gap')}
              `}
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              }}
            >
              {backgroundPresets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  isSelected={selectedPresetId === preset.id}
                  onClick={() => handlePresetSelect(preset)}
                />
              ))}
            </div>
          </Card>

          {/* Variant Selection */}
          <Card padding="md">
            <Label 
              htmlFor="background-variant" 
              className={`${getSpacingClass('sm', 'mb')} block`}
            >
              Pattern Variant
            </Label>
            <Select
              id="background-variant"
              value={config.variant}
              onChange={(e) => handleVariantChange(e.target.value as 'dots' | 'lines' | 'cross')}
              options={[
                { value: 'dots', label: 'Dots' },
                { value: 'lines', label: 'Lines' },
                { value: 'cross', label: 'Cross' },
              ]}
            />
          </Card>

          {/* Size Control */}
          <Card padding="md">
            <Label 
              htmlFor="background-size" 
              className={`${getSpacingClass('sm', 'mb')} block`}
            >
              Size: {config.size}px
            </Label>
            <Input
              id="background-size"
              type="range"
              min="4"
              max="64"
              step="2"
              value={config.size}
              onChange={(e) => handleSizeChange(Number(e.target.value))}
              className="w-full"
            />
            <div
              className={`
                flex justify-between
                ${getTypographyClasses('caption')}
                ${getColorClass('neutral', 'DEFAULT', 'text')}
                ${getSpacingClass('xs', 'mt')}
              `}
            >
              <span>4px</span>
              <span>64px</span>
            </div>
          </Card>

          {/* Custom Colors */}
          <Card padding="md">
            <div className={`${getSpacingClass('md', 'mb')} flex justify-between items-center`}>
              <Label>Custom Colors</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleApplyThemeColors}
              >
                Apply Theme
              </Button>
            </div>
            
            <div className={`flex flex-col ${getSpacingClass('md', 'gap')}`}>
              <div>
                <Label 
                  htmlFor="background-bg-color" 
                  className={`
                    ${getSpacingClass('xs', 'mb')}
                    block
                    ${getTypographyClasses('label')}
                  `}
                >
                  Background Color
                </Label>
                <div className={`flex ${getSpacingClass('sm', 'gap')} items-center`}>
                  <Input
                    id="background-bg-color"
                    type="color"
                    value={config.bgColor || '#ffffff'}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className={`
                      w-15 h-8
                      ${getSpacingClass('xs', 'p')}
                      cursor-pointer
                      border
                      ${getColorClass('neutral', 'DEFAULT', 'border')}
                      ${getRadiusClass('md')}
                    `}
                  />
                  <Input
                    type="text"
                    value={config.bgColor || ''}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    placeholder="transparent"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label 
                  htmlFor="background-pattern-color" 
                  className={`
                    ${getSpacingClass('xs', 'mb')}
                    block
                    ${getTypographyClasses('label')}
                  `}
                >
                  Pattern Color
                </Label>
                <div className={`flex ${getSpacingClass('sm', 'gap')} items-center`}>
                  <Input
                    id="background-pattern-color"
                    type="color"
                    value={config.patternColor || '#91919a'}
                    onChange={(e) => handlePatternColorChange(e.target.value)}
                    className={`
                      w-15 h-8
                      ${getSpacingClass('xs', 'p')}
                      cursor-pointer
                      border
                      ${getColorClass('neutral', 'DEFAULT', 'border')}
                      ${getRadiusClass('md')}
                    `}
                  />
                  <Input
                    type="text"
                    value={config.patternColor || ''}
                    onChange={(e) => handlePatternColorChange(e.target.value)}
                    placeholder="auto"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card padding="md">
            <div className={`flex ${getSpacingClass('sm', 'gap')}`}>
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Reset to Defaults
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
