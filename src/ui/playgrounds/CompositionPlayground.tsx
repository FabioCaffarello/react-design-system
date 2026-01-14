/**
 * Composition Playground
 * 
 * Playground for experimenting with component composition.
 */

import { useState } from 'react';
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

interface CompositionPlaygroundState {
  components: Array<{
    name: string;
    props: Record<string, unknown>;
  }>;
}

/**
 * Composition Playground Component
 * 
 * Interactive playground for experimenting with component composition.
 * 
 * @example
 * ```tsx
 * <CompositionPlayground />
 * ```
 */
export function CompositionPlayground() {
  const { theme } = useTheme();

  const initialState: CompositionPlaygroundState = {
    components: [
      { name: 'Card', props: {} },
      { name: 'Button', props: { variant: 'primary' } },
    ],
  };

  const { state, setState, updateState, reset } = usePlaygroundState({
    initialState,
    storageKey: 'composition-playground-state',
  });

  const { exportToJSON, importFromJSON, exportToURL } = usePlaygroundExport({
    playgroundName: 'composition',
    state,
  });

  const { code } = usePlaygroundCode({
    state,
    format: 'typescript',
    playgroundName: 'composition',
    generateCode: (config, format) =>
      generateCode({
        state: config,
        format,
        playgroundName: 'composition',
      }),
  });

  const addComponent = () => {
    updateState('components', [
      ...state.components,
      { name: 'NewComponent', props: {} },
    ]);
  };

  const removeComponent = (index: number) => {
    updateState(
      'components',
      state.components.filter((_, i) => i !== index)
    );
  };

  return (
    <PlaygroundLayout
      title="Composition Playground"
      description="Experiment with component composition"
      sidebarContent={
        <>
          <ControlGroup title="Components" description="Manage components">
            <div className="space-y-2">
              {state.components.map((component, index) => (
                <div key={index} className="p-2 border rounded">
                  <Input
                    type="text"
                    value={component.name}
                    onChange={(e) => {
                      const updated = [...state.components];
                      updated[index].name = e.target.value;
                      updateState('components', updated);
                    }}
                    placeholder="Component name"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeComponent(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={addComponent}>Add Component</Button>
            </div>
          </ControlGroup>
        </>
      }
      previewContent={
        <>
          <Card>
            <div className="p-4 border-b">
              <h3 className="m-0 font-semibold" style={{ fontSize: '18px' }}>
                Composition Preview
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {state.components.map((component, index) => (
                <div key={index} className="p-4 border rounded">
                  <div className="text-sm font-medium">{component.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Component preview would be rendered here
                  </div>
                </div>
              ))}
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
              setState(imported.config as CompositionPlaygroundState);
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
