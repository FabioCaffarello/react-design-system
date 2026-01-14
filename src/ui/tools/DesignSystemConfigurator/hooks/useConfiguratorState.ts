/**
 * useConfiguratorState Hook
 * 
 * Manages the state of the Design System Configurator.
 */

import { useState, useCallback, useMemo } from 'react';
import type { ConfiguratorState, TokenConfig, ComponentConfig, ThemeConfig } from '../types';
import { TokensFactory } from '../../tokens/tokens.factory';

const initialState: ConfiguratorState = {
  tokens: {} as TokenConfig,
  components: [],
  themes: [],
  currentTheme: undefined,
  selectedComponent: undefined,
};

export function useConfiguratorState() {
  const [state, setState] = useState<ConfiguratorState>(initialState);

  // Initialize tokens from factory
  const initializeTokens = useCallback((theme: 'light' | 'dark' = 'light') => {
    const factory = new TokensFactory(theme);
    const tokenSet = factory.createTokenSet();
    
    // Convert token set to config format
    const tokens: TokenConfig = {
      colors: {} as TokenConfig['colors'],
      spacing: tokenSet.spacing as TokenConfig['spacing'],
      typography: {
        fontSizes: {},
        fontWeights: {},
        lineHeights: {},
      },
      shadows: tokenSet.shadows as TokenConfig['shadows'],
      radius: tokenSet.radius as TokenConfig['radius'],
      borders: tokenSet.borders as TokenConfig['borders'],
      animations: {
        durations: {},
        easings: {},
      },
    };

    setState((prev) => ({
      ...prev,
      tokens,
    }));
  }, []);

  // Update tokens
  const updateTokens = useCallback((tokens: Partial<TokenConfig>) => {
    setState((prev) => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        ...tokens,
      },
    }));
  }, []);

  // Add component
  const addComponent = useCallback((component: ComponentConfig) => {
    setState((prev) => ({
      ...prev,
      components: [...prev.components, component],
    }));
  }, []);

  // Update component
  const updateComponent = useCallback((name: string, updates: Partial<ComponentConfig>) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.map((comp) =>
        comp.name === name ? { ...comp, ...updates } : comp
      ),
    }));
  }, []);

  // Remove component
  const removeComponent = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      components: prev.components.filter((comp) => comp.name !== name),
      selectedComponent: prev.selectedComponent === name ? undefined : prev.selectedComponent,
    }));
  }, []);

  // Add theme
  const addTheme = useCallback((theme: ThemeConfig) => {
    setState((prev) => ({
      ...prev,
      themes: [...prev.themes, theme],
    }));
  }, []);

  // Update theme
  const updateTheme = useCallback((name: string, updates: Partial<ThemeConfig>) => {
    setState((prev) => ({
      ...prev,
      themes: prev.themes.map((theme) =>
        theme.name === name ? { ...theme, ...updates } : theme
      ),
    }));
  }, []);

  // Set current theme
  const setCurrentTheme = useCallback((name: string | undefined) => {
    setState((prev) => ({
      ...prev,
      currentTheme: name,
    }));
  }, []);

  // Set selected component
  const setSelectedComponent = useCallback((name: string | undefined) => {
    setState((prev) => ({
      ...prev,
      selectedComponent: name,
    }));
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // Get current theme config
  const currentThemeConfig = useMemo(() => {
    if (!state.currentTheme) return undefined;
    return state.themes.find((theme) => theme.name === state.currentTheme);
  }, [state.currentTheme, state.themes]);

  // Get selected component config
  const selectedComponentConfig = useMemo(() => {
    if (!state.selectedComponent) return undefined;
    return state.components.find((comp) => comp.name === state.selectedComponent);
  }, [state.selectedComponent, state.components]);

  return {
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
    reset,
    currentThemeConfig,
    selectedComponentConfig,
  };
}
