/**
 * Design System Configurator
 * 
 * Main component for configuring the entire design system.
 * Provides a unified interface for managing tokens, themes, components, and CSS generation.
 */

import { useEffect } from 'react';
import { useTheme } from '../../providers/ThemeProvider';
import Tabs from '../../molecules/Tabs/Tabs';
import { TokenConfigurator } from './components/TokenConfigurator/TokenConfigurator';
import { ThemeConfigurator } from './components/ThemeConfigurator/ThemeConfigurator';
import { ComponentConfigurator } from './components/ComponentConfigurator/ComponentConfigurator';
import { CSSCodeGenerator } from './components/CSSCodeGenerator/CSSCodeGenerator';
import { useConfiguratorState } from './hooks/useConfiguratorState';
import type { ConfiguratorState } from './types';

export interface DesignSystemConfiguratorProps {
  initialState?: Partial<ConfiguratorState>;
  onStateChange?: (state: ConfiguratorState) => void;
}

/**
 * Design System Configurator Component
 * 
 * Interactive tool for configuring the entire design system.
 * 
 * @example
 * ```tsx
 * <DesignSystemConfigurator />
 * ```
 */
export function DesignSystemConfigurator({
  initialState,
  onStateChange,
}: DesignSystemConfiguratorProps) {
  const { theme } = useTheme();
  const {
    state,
    initializeTokens,
    updateTokens,
    addComponent,
    updateComponent,
    removeComponent,
    addTheme,
    updateTheme,
    setCurrentTheme,
    setSelectedComponent,
  } = useConfiguratorState();

  // Initialize tokens on mount
  useEffect(() => {
    if (!state.tokens || Object.keys(state.tokens).length === 0) {
      initializeTokens(theme === 'dark' ? 'dark' : 'light');
    }
  }, [initializeTokens, theme, state.tokens]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000',
      }}
    >
      <Tabs defaultValue="tokens" className="flex-1 flex flex-col">
        <Tabs.List className="border-b">
          <Tabs.Trigger value="tokens">Tokens</Tabs.Trigger>
          <Tabs.Trigger value="themes">Themes</Tabs.Trigger>
          <Tabs.Trigger value="components">Components</Tabs.Trigger>
          <Tabs.Trigger value="css">CSS Generator</Tabs.Trigger>
        </Tabs.List>

        <div className="flex-1 overflow-auto p-4">
          <Tabs.Content value="tokens" className="h-full">
            {state.tokens && Object.keys(state.tokens).length > 0 && (
              <TokenConfigurator
                tokens={state.tokens}
                onTokensChange={updateTokens}
              />
            )}
          </Tabs.Content>

          <Tabs.Content value="themes">
            <ThemeConfigurator
              themes={state.themes}
              currentTheme={state.currentTheme}
              tokens={state.tokens}
              onThemeChange={addTheme}
              onCurrentThemeChange={setCurrentTheme}
            />
          </Tabs.Content>

          <Tabs.Content value="components">
            <ComponentConfigurator
              components={state.components}
              selectedComponent={state.selectedComponent}
              onComponentAdd={addComponent}
              onComponentUpdate={updateComponent}
              onComponentRemove={removeComponent}
              onComponentSelect={setSelectedComponent}
            />
          </Tabs.Content>

          <Tabs.Content value="css">
            <CSSCodeGenerator state={state} />
          </Tabs.Content>
        </div>
      </Tabs>
    </div>
  );
}
