/**
 * Component Playground
 * 
 * Generic playground for experimenting with any component from the design system.
 */

import { useState, useMemo } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { Card } from '../molecules';
import { Button, Input, Label } from '../atoms';
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

interface ComponentPlaygroundState {
  componentName: string;
  variant?: string;
  size?: string;
  props: Record<string, unknown>;
}

/**
 * Component Playground Component
 * 
 * Interactive playground for experimenting with any component.
 * 
 * @example
 * ```tsx
 * <ComponentPlayground />
 * ```
 */
export function ComponentPlayground() {
  const { theme } = useTheme();

  const initialState: ComponentPlaygroundState = {
    componentName: 'Button',
    variant: 'primary',
    size: 'md',
    props: {},
  };

  const { state, setState, updateState, reset } = usePlaygroundState({
    initialState,
    storageKey: 'component-playground-state',
  });

  const { exportToJSON, importFromJSON, exportToURL } = usePlaygroundExport({
    playgroundName: 'component',
    state,
  });

  const { code } = usePlaygroundCode({
    state,
    format: 'typescript',
    playgroundName: 'component',
    generateCode: (config, format) =>
      generateCode({
        state: config,
        format,
        playgroundName: 'component',
      }),
  });

  // This would dynamically import the component - simplified for now
  const ComponentPreview = useMemo(() => {
    // In a real implementation, this would dynamically load the component
    return (
      <div className="p-4 border rounded">
        <div className="text-sm text-gray-500 mb-2">Component: {state.componentName}</div>
        <div className="text-xs text-gray-400">
          Component preview would be rendered here dynamically
        </div>
      </div>
    );
  }, [state.componentName]);

  return (
    <PlaygroundLayout
      title="Component Playground"
      description="Experiment with any component from the design system"
      sidebarContent={
        <>
          <ControlGroup title="Component" description="Select component">
            <Input
              type="text"
              value={state.componentName}
              onChange={(e) => updateState('componentName', e.target.value)}
              placeholder="Component name"
            />
          </ControlGroup>

          <ControlGroup title="Variant" description="Select variant">
            <Input
              type="text"
              value={state.variant || ''}
              onChange={(e) => updateState('variant', e.target.value)}
              placeholder="variant"
            />
          </ControlGroup>

          <ControlGroup title="Size" description="Select size">
            <Input
              type="text"
              value={state.size || ''}
              onChange={(e) => updateState('size', e.target.value)}
              placeholder="size"
            />
          </ControlGroup>
        </>
      }
      previewContent={
        <>
          <Card>
            <div className="p-4 border-b">
              <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                Preview
              </h3>
            </div>
            <div className="p-6">
              {ComponentPreview}
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
              setState(imported.config as ComponentPlaygroundState);
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
