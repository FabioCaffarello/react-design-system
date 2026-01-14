/**
 * Layout Config Panel Component
 * 
 * Panel for configuring and applying layout algorithms to flows.
 */

import React, { useState, useCallback } from 'react';
import { Card } from '../../../molecules';
import { Label, Select, Button, Input } from '../../../atoms';
import type { LayoutConfig } from '../types/playgroundTypes';
import type { LayoutStrategyName, LayoutOptions } from '../organisms/FlowTypes';
import { layoutEngine } from '../utils/layoutEngine';
import { 
  getSpacingClass, 
  getColorClass, 
  getTypographyClasses 
} from '../../../tokens';

export interface LayoutConfigPanelProps {
  config: LayoutConfig;
  onChange: (config: LayoutConfig) => void;
  onApply?: () => void;
}

/**
 * Available layout strategies
 */
const layoutStrategies: Array<{ value: LayoutStrategyName; label: string; description: string }> = [
  { value: 'dagre', label: 'Dagre', description: 'Hierarchical layout (top-bottom, left-right)' },
  { value: 'elk', label: 'ELK', description: 'Advanced hierarchical layout' },
  { value: 'force', label: 'Force-Directed', description: 'Physics-based layout' },
];

export function LayoutConfigPanel({
  config,
  onChange,
  onApply,
}: LayoutConfigPanelProps) {
  const [direction, setDirection] = useState<string>(config.options?.direction || 'TB');
  const [spacing, setSpacing] = useState<number>(config.options?.spacing || 50);
  const [nodeWidth, setNodeWidth] = useState<number>(config.options?.nodeWidth || 150);
  const [nodeHeight, setNodeHeight] = useState<number>(config.options?.nodeHeight || 100);

  // Update config when local state changes
  React.useEffect(() => {
    onChange({
      ...config,
      options: {
        direction: direction as LayoutOptions['direction'],
        spacing,
        nodeWidth,
        nodeHeight,
        ...config.options,
      },
    });
  }, [direction, spacing, nodeWidth, nodeHeight]);

  const handleStrategyChange = useCallback((strategy: LayoutStrategyName | null) => {
    onChange({
      ...config,
      strategy,
    });
  }, [config, onChange]);

  const handleApply = useCallback(() => {
    onApply?.();
  }, [onApply]);

  const handleReset = useCallback(() => {
    setDirection('TB');
    setSpacing(50);
    setNodeWidth(150);
    setNodeHeight(100);
    onChange({
      strategy: null,
      options: {},
    });
  }, [onChange]);

  return (
    <div className={`flex flex-col ${getSpacingClass('base', 'gap')}`}>
      {/* Strategy Selection */}
      <Card padding="md">
        <Label 
          htmlFor="layout-strategy" 
          className={`${getSpacingClass('sm', 'mb')} block`}
        >
          Layout Strategy
        </Label>
        <Select
          id="layout-strategy"
          value={config.strategy || ''}
          onChange={(e) => handleStrategyChange(e.target.value as LayoutStrategyName || null)}
          options={[
            { value: '', label: 'None (Manual)' },
            ...layoutStrategies.map((s) => ({ value: s.value, label: s.label })),
          ]}
        />
        {config.strategy && (
          <p
            className={`
              ${getTypographyClasses('caption')}
              ${getColorClass('neutral', 'DEFAULT', 'text')}
              ${getSpacingClass('xs', 'mt')}
              m-0
            `}
          >
            {layoutStrategies.find((s) => s.value === config.strategy)?.description}
          </p>
        )}
      </Card>

      {/* Layout Options */}
      {config.strategy && (
        <>
          {/* Direction (for hierarchical layouts) */}
          {(config.strategy === 'dagre' || config.strategy === 'elk') && (
            <Card padding="md">
              <Label 
                htmlFor="layout-direction" 
                className={`${getSpacingClass('sm', 'mb')} block`}
              >
                Direction
              </Label>
              <Select
                id="layout-direction"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                options={[
                  { value: 'TB', label: 'Top to Bottom' },
                  { value: 'BT', label: 'Bottom to Top' },
                  { value: 'LR', label: 'Left to Right' },
                  { value: 'RL', label: 'Right to Left' },
                ]}
              />
            </Card>
          )}

          {/* Spacing */}
          <Card padding="md">
            <Label 
              htmlFor="layout-spacing" 
              className={`${getSpacingClass('sm', 'mb')} block`}
            >
              Spacing: {spacing}px
            </Label>
            <Input
              id="layout-spacing"
              type="range"
              min="20"
              max="200"
              step="10"
              value={spacing}
              onChange={(e) => setSpacing(Number(e.target.value))}
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
              <span>20px</span>
              <span>200px</span>
            </div>
          </Card>

          {/* Node Dimensions */}
          <Card padding="md">
            <div className={`grid grid-cols-2 ${getSpacingClass('md', 'gap')}`}>
              <div>
                <Label 
                  htmlFor="layout-node-width" 
                  className={`
                    ${getSpacingClass('xs', 'mb')}
                    block
                    ${getTypographyClasses('label')}
                  `}
                >
                  Node Width: {nodeWidth}px
                </Label>
                <Input
                  id="layout-node-width"
                  type="number"
                  min="50"
                  max="500"
                  step="10"
                  value={nodeWidth}
                  onChange={(e) => setNodeWidth(Number(e.target.value))}
                />
              </div>
              <div>
                <Label 
                  htmlFor="layout-node-height" 
                  className={`
                    ${getSpacingClass('xs', 'mb')}
                    block
                    ${getTypographyClasses('label')}
                  `}
                >
                  Node Height: {nodeHeight}px
                </Label>
                <Input
                  id="layout-node-height"
                  type="number"
                  min="50"
                  max="500"
                  step="10"
                  value={nodeHeight}
                  onChange={(e) => setNodeHeight(Number(e.target.value))}
                />
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Actions */}
      <Card padding="md">
        <div className={`flex ${getSpacingClass('sm', 'gap')}`}>
          {config.strategy && (
            <Button
              variant="primary"
              onClick={handleApply}
              className="flex-1"
            >
              Apply Layout
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </Card>

      {/* Info */}
      {!config.strategy && (
        <Card padding="md">
          <p
            className={`
              ${getTypographyClasses('body')}
              ${getColorClass('neutral', 'DEFAULT', 'text')}
              m-0
            `}
          >
            Select a layout strategy to automatically arrange your nodes. Manual positioning is available when no strategy is selected.
          </p>
        </Card>
      )}
    </div>
  );
}
