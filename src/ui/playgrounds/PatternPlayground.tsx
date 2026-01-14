/**
 * Pattern Playground
 * 
 * Playground for testing design patterns.
 */

import { useState } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { Card } from '../molecules';
import { Button, Select } from '../atoms';
import {
  PlaygroundLayout,
  ControlGroup,
  CodeDisplay,
} from './shared';
import {
  usePlaygroundState,
  usePlaygroundExport,
  usePlaygroundCode,
} from './shared/hooks';
import { generateCode } from './shared/utils/codeGenerator';

interface PatternPlaygroundState {
  pattern: 'factory' | 'builder' | 'strategy' | 'composite';
  componentName: string;
  config: Record<string, unknown>;
}

/**
 * Pattern Playground Component
 * 
 * Interactive playground for testing design patterns.
 * 
 * @example
 * ```tsx
 * <PatternPlayground />
 * ```
 */
export function PatternPlayground() {
  const { theme } = useTheme();

  const initialState: PatternPlaygroundState = {
    pattern: 'factory',
    componentName: 'Button',
    config: {},
  };

  const { state, setState, updateState, reset } = usePlaygroundState({
    initialState,
    storageKey: 'pattern-playground-state',
  });

  const { exportToJSON, importFromJSON, exportToURL } = usePlaygroundExport({
    playgroundName: 'pattern',
    state,
  });

  const { code } = usePlaygroundCode({
    state,
    format: 'typescript',
    playgroundName: 'pattern',
    generateCode: (config, format) =>
      generateCode({
        state: config,
        format,
        playgroundName: 'pattern',
      }),
  });

  return (
    <PlaygroundLayout
      title="Pattern Playground"
      description="Test design patterns with components"
      sidebarContent={
        <>
          <ControlGroup title="Pattern" description="Select design pattern">
            <Select
              value={state.pattern}
              onChange={(e) => updateState('pattern', e.target.value)}
              options={[
                { value: 'factory', label: 'Factory Pattern' },
                { value: 'builder', label: 'Builder Pattern' },
                { value: 'strategy', label: 'Strategy Pattern' },
                { value: 'composite', label: 'Composite Pattern' },
              ]}
            />
          </ControlGroup>

          <ControlGroup title="Component" description="Component name">
            <input
              type="text"
              value={state.componentName}
              onChange={(e) => updateState('componentName', e.target.value)}
              placeholder="Component name"
              className="w-full p-2 border rounded"
            />
          </ControlGroup>
        </>
      }
      previewContent={
        <>
          <Card>
            <div className="p-4 border-b">
              <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                Pattern: {state.pattern}
              </h3>
            </div>
            <div className="p-6">
              <div className="text-sm text-gray-500 mb-4">
                Pattern implementation preview would be shown here
              </div>
              <div className="p-4 bg-gray-100 rounded">
                <div className="text-xs font-mono">
                  {state.pattern === 'factory' && 'ComponentFactory.create(...)'}
                  {state.pattern === 'builder' && 'ComponentBuilder.atom(...).build()'}
                  {state.pattern === 'strategy' && 'Strategy pattern implementation'}
                  {state.pattern === 'composite' && 'Composite pattern implementation'}
                </div>
              </div>
            </div>
          </Card>

          <CodeDisplay
            code={code}
            format="typescript"
            title="Generated Code"
            showCopyButton
          />
        </>
      }
      onReset={reset}
      onExport={() => exportToJSON()}
      onImport={() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            try {
              const imported = await importFromJSON(file);
              setState(imported.config as PatternPlaygroundState);
            } catch (err) {
              console.error('Failed to import:', err);
            }
          }
        };
        input.click();
      }}
      onShare={() => {
        const url = exportToURL();
        navigator.clipboard.writeText(url);
        alert('Share URL copied to clipboard!');
      }}
    />
  );
}
