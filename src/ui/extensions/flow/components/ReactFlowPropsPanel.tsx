/**
 * React Flow Props Panel
 * 
 * Panel for configuring all ReactFlow props with tooltips
 */

import React, { useMemo, useState } from 'react';
import { Card } from '../../../molecules';
import { Label, Input, Select, Button } from '../../../atoms';
import Collapsible from '../../../atoms/Collapsible/Collapsible';
import Tooltip from '../../../atoms/Tooltip/Tooltip';
import { REACT_FLOW_PROP_DEFINITIONS, getPropsByCategory } from '../utils/reactFlowPropsDefinitions';
import { validateReactFlowConfig } from '../utils/playgroundHelpers';
import type { ReactFlowConfig } from '../types/playgroundTypes';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../../tokens';

export interface ReactFlowPropsPanelProps {
  config: ReactFlowConfig;
  onChange: (config: ReactFlowConfig) => void;
}

/**
 * Tooltip component for prop descriptions
 */
function PropTooltip({ description, children }: { description: string; children: React.ReactNode }) {
  return (
    <Tooltip content={description} position="right" delay={200}>
      <div style={{ cursor: 'help', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {children}
        <Info className="h-3 w-3" style={{ color: '#6b7280' }} />
      </div>
    </Tooltip>
  );
}

/**
 * React Flow Props Panel Component
 */
export const ReactFlowPropsPanel = React.memo(function ReactFlowPropsPanel({ config, onChange }: ReactFlowPropsPanelProps) {
  const appearanceProps = useMemo(() => getPropsByCategory('appearance'), []);
  const interactionProps = useMemo(() => getPropsByCategory('interaction'), []);
  const keyboardProps = useMemo(() => getPropsByCategory('keyboard'), []);
  const zoomProps = useMemo(() => getPropsByCategory('zoom'), []);
  const otherProps = useMemo(() => getPropsByCategory('other'), []);
  
  const [sectionStates, setSectionStates] = useState({
    appearance: true,
    interaction: true,
    keyboard: false,
    zoom: false,
    other: false,
  });
  
  const toggleSection = (section: keyof typeof sectionStates) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePropChange = (key: keyof ReactFlowConfig, value: unknown) => {
    // Validate zoom values
    if (key === 'minZoom' && typeof value === 'number') {
      const maxZoom = config.maxZoom ?? 2;
      if (value >= maxZoom) {
        console.warn(`minZoom (${value}) must be less than maxZoom (${maxZoom})`);
        return;
      }
    }
    if (key === 'maxZoom' && typeof value === 'number') {
      const minZoom = config.minZoom ?? 0.5;
      if (value <= minZoom) {
        console.warn(`maxZoom (${value}) must be greater than minZoom (${minZoom})`);
        return;
      }
    }
    if (key === 'defaultZoom' && typeof value === 'number') {
      const minZoom = config.minZoom ?? 0.5;
      const maxZoom = config.maxZoom ?? 2;
      if (value < minZoom || value > maxZoom) {
        console.warn(`defaultZoom (${value}) must be between minZoom (${minZoom}) and maxZoom (${maxZoom})`);
        return;
      }
    }

    const updatedConfig = {
      ...config,
      [key]: value,
    };

    // Validate the entire config before applying
    if (validateReactFlowConfig(updatedConfig)) {
      onChange(updatedConfig);
    }
  };

  const renderPropControl = (prop: typeof REACT_FLOW_PROP_DEFINITIONS[0]) => {
    const value = config[prop.key];
    const defaultValue = prop.defaultValue;

    switch (prop.type) {
      case 'boolean':
        return (
          <div key={prop.key} style={{ marginBottom: '12px' }}>
            <Label htmlFor={prop.key}>
              <PropTooltip description={prop.description}>
                <span>{prop.label}</span>
              </PropTooltip>
            </Label>
            <Select
              id={prop.key}
              value={value !== undefined ? String(value) : String(defaultValue)}
              onChange={(e) => handlePropChange(prop.key, e.target.value === 'true')}
              options={[
                { value: 'true', label: 'Enabled' },
                { value: 'false', label: 'Disabled' },
              ]}
            />
          </div>
        );

      case 'number':
        const numValue = value !== undefined ? value : defaultValue;
        const min = prop.key === 'minZoom' ? 0.1 : prop.key === 'maxZoom' ? 0.5 : undefined;
        const max = prop.key === 'minZoom' ? 1 : prop.key === 'maxZoom' ? 4 : undefined;
        const step = prop.key.includes('Zoom') ? 0.1 : 1;
        
        return (
          <div key={prop.key} style={{ marginBottom: '12px' }}>
            <Label htmlFor={prop.key}>
              <PropTooltip description={prop.description}>
                <span>{prop.label}</span>
              </PropTooltip>
            </Label>
            <Input
              id={prop.key}
              type="number"
              value={numValue !== undefined ? String(numValue) : ''}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                if (!isNaN(num)) {
                  handlePropChange(prop.key, num);
                }
              }}
              min={min}
              max={max}
              step={step}
            />
          </div>
        );

      case 'select':
        return (
          <div key={prop.key} style={{ marginBottom: '12px' }}>
            <Label htmlFor={prop.key}>
              <PropTooltip description={prop.description}>
                <span>{prop.label}</span>
              </PropTooltip>
            </Label>
            <Select
              id={prop.key}
              value={value !== undefined && value !== null ? String(value) : String(defaultValue || '')}
              onChange={(e) => handlePropChange(prop.key, e.target.value || null)}
              options={prop.options || []}
            />
          </div>
        );

      case 'object':
        // Special handling for nodeOrigin [x, y]
        if (prop.key === 'nodeOrigin') {
          const nodeOrigin = (value as [number, number]) || (defaultValue as [number, number]) || [0.5, 0.5];
          return (
            <div key={prop.key} style={{ marginBottom: '12px' }}>
              <Label htmlFor={prop.key}>
                <PropTooltip description={prop.description}>
                  <span>{prop.label}</span>
                </PropTooltip>
              </Label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <Label htmlFor={`${prop.key}-x`}>X</Label>
                  <Input
                    id={`${prop.key}-x`}
                    type="number"
                    step="0.1"
                    value={nodeOrigin[0]}
                    onChange={(e) => {
                      const newValue: [number, number] = [parseFloat(e.target.value) || 0, nodeOrigin[1]];
                      handlePropChange(prop.key, newValue);
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Label htmlFor={`${prop.key}-y`}>Y</Label>
                  <Input
                    id={`${prop.key}-y`}
                    type="number"
                    step="0.1"
                    value={nodeOrigin[1]}
                    onChange={(e) => {
                      const newValue: [number, number] = [nodeOrigin[0], parseFloat(e.target.value) || 0];
                      handlePropChange(prop.key, newValue);
                    }}
                  />
                </div>
              </div>
            </div>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
      {/* Appearance Props */}
      {appearanceProps.length > 0 && (
        <Card padding="md">
          <Collapsible
            trigger={
              <div className="flex items-center justify-between w-full cursor-pointer">
                <h3 className={`
                  ${getTypographyClasses('h4')}
                  ${getColorClass('neutral', 'dark', 'text')}
                  m-0
                `}>
                  Appearance
                </h3>
                <span className="text-sm opacity-60">
                  {sectionStates.appearance ? '▼' : '▶'}
                </span>
              </div>
            }
            defaultOpen={sectionStates.appearance}
            onOpenChange={(open) => setSectionStates(prev => ({ ...prev, appearance: open }))}
          >
            <div className={getSpacingClass('md', 'mt')}>
              {appearanceProps.map(renderPropControl)}
            </div>
          </Collapsible>
        </Card>
      )}

      {/* Interaction Props */}
      {interactionProps.length > 0 && (
        <Card padding="md">
          <Collapsible
            trigger={
              <div className="flex items-center justify-between w-full cursor-pointer">
                <h3 className={`
                  ${getTypographyClasses('h4')}
                  ${getColorClass('neutral', 'dark', 'text')}
                  m-0
                `}>
                  Interaction
                </h3>
                <span className="text-sm opacity-60">
                  {sectionStates.interaction ? '▼' : '▶'}
                </span>
              </div>
            }
            defaultOpen={sectionStates.interaction}
            onOpenChange={(open) => setSectionStates(prev => ({ ...prev, interaction: open }))}
          >
            <div className={getSpacingClass('md', 'mt')}>
              {interactionProps.map(renderPropControl)}
            </div>
          </Collapsible>
        </Card>
      )}

      {/* Keyboard Props */}
      {keyboardProps.length > 0 && (
        <Card padding="md">
          <Collapsible
            trigger={
              <div className="flex items-center justify-between w-full cursor-pointer">
                <h3 className={`
                  ${getTypographyClasses('h4')}
                  ${getColorClass('neutral', 'dark', 'text')}
                  m-0
                `}>
                  Keyboard
                </h3>
                <span className="text-sm opacity-60">
                  {sectionStates.keyboard ? '▼' : '▶'}
                </span>
              </div>
            }
            defaultOpen={sectionStates.keyboard}
            onOpenChange={(open) => setSectionStates(prev => ({ ...prev, keyboard: open }))}
          >
            <div className={getSpacingClass('md', 'mt')}>
              {keyboardProps.map(renderPropControl)}
            </div>
          </Collapsible>
        </Card>
      )}

      {/* Zoom Props */}
      {zoomProps.length > 0 && (
        <Card padding="md">
          <Collapsible
            trigger={
              <div className="flex items-center justify-between w-full cursor-pointer">
                <h3 className={`
                  ${getTypographyClasses('h4')}
                  ${getColorClass('neutral', 'dark', 'text')}
                  m-0
                `}>
                  Zoom
                </h3>
                <span className="text-sm opacity-60">
                  {sectionStates.zoom ? '▼' : '▶'}
                </span>
              </div>
            }
            defaultOpen={sectionStates.zoom}
            onOpenChange={(open) => setSectionStates(prev => ({ ...prev, zoom: open }))}
          >
            <div className={getSpacingClass('md', 'mt')}>
              {zoomProps.map(renderPropControl)}
            </div>
          </Collapsible>
        </Card>
      )}

      {/* Other Props */}
      {otherProps.length > 0 && (
        <Card padding="md">
          <Collapsible
            trigger={
              <div className="flex items-center justify-between w-full cursor-pointer">
                <h3 className={`
                  ${getTypographyClasses('h4')}
                  ${getColorClass('neutral', 'dark', 'text')}
                  m-0
                `}>
                  Other
                </h3>
                <span className="text-sm opacity-60">
                  {sectionStates.other ? '▼' : '▶'}
                </span>
              </div>
            }
            defaultOpen={sectionStates.other}
            onOpenChange={(open) => setSectionStates(prev => ({ ...prev, other: open }))}
          >
            <div className={getSpacingClass('md', 'mt')}>
              {otherProps.map(renderPropControl)}
            </div>
          </Collapsible>
        </Card>
      )}

      {/* Reset Button */}
      <Tooltip content="Reset all props to their default values" position="top" delay={200}>
        <Button
          variant="secondary"
          onClick={() => {
            // Reset to empty config, which will use defaults from defaultReactFlowConfig
            onChange({});
          }}
          className="w-full transition-all duration-200"
        >
          Reset to Defaults
        </Button>
      </Tooltip>
    </div>
  );
});
