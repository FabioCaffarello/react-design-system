/**
 * Advanced Theme Provider
 * 
 * Enhanced ThemeProvider with support for:
 * - Multiple themes simultaneously
 * - CSS variables
 * - Theme inheritance
 * - Smooth transitions
 */

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import { themeRegistry } from '../themes/ThemeRegistry';
import { ThemeBuilder } from '../themes/ThemeBuilder';
import { applyCSSVariables, removeCSSVariables } from '../themes/utils';
import type { Theme, CustomThemeConfig, ThemeBuilderOptions } from '../themes/types';
import type { ThemeMode } from '../tokens/tokens.factory';

export interface AdvancedThemeContextValue {
  // Current active theme
  currentTheme: string;
  themes: Record<string, Theme>;
  
  // Theme operations
  setTheme: (themeName: string) => void;
  registerTheme: (config: CustomThemeConfig) => Theme;
  removeTheme: (themeName: string) => boolean;
  
  // Get theme
  getTheme: (themeName?: string) => Theme | undefined;
  
  // Theme tokens (from current theme)
  tokens: Theme | null;
  
  // Options
  options: ThemeBuilderOptions;
  setOptions: (options: Partial<ThemeBuilderOptions>) => void;
}

const AdvancedThemeContext = createContext<AdvancedThemeContextValue | undefined>(undefined);

export interface AdvancedThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  options?: ThemeBuilderOptions;
  initialThemes?: CustomThemeConfig[];
}

/**
 * Advanced ThemeProvider Component
 * 
 * Provides advanced theme management with support for multiple themes,
 * CSS variables, inheritance, and smooth transitions.
 * 
 * @example
 * ```tsx
 * <AdvancedThemeProvider
 *   defaultTheme="light"
 *   options={{
 *     enableCSSVariables: true,
 *     enableTransitions: true,
 *   }}
 * >
 *   <App />
 * </AdvancedThemeProvider>
 * ```
 */
export function AdvancedThemeProvider({
  children,
  defaultTheme = 'light',
  options: initialOptions = {},
  initialThemes = [],
}: AdvancedThemeProviderProps) {
  const [currentThemeName, setCurrentThemeName] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }

    try {
      const storageKey = initialOptions.storageKey || 'theme';
      const stored = localStorage.getItem(storageKey);
      if (stored && themeRegistry.has(stored)) {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }

    return defaultTheme;
  });

  const [options, setOptionsState] = useState<ThemeBuilderOptions>({
    enableCSSVariables: true,
    enableTransitions: true,
    transitionDuration: '200ms',
    storageKey: 'theme',
    ...initialOptions,
  });

  // Register initial themes
  useEffect(() => {
    for (const config of initialThemes) {
      themeRegistry.register(config);
    }
  }, [initialThemes]);

  // Get current theme
  const currentTheme = useMemo(() => {
    return themeRegistry.get(currentThemeName);
  }, [currentThemeName]);

  // Get all themes
  const themes = useMemo(() => {
    return themeRegistry.getAll();
  }, [currentThemeName]);

  // Apply CSS variables
  useEffect(() => {
    if (!currentTheme || !options.enableCSSVariables) {
      return;
    }

    const root = document.documentElement;
    const variableNames = Object.keys(currentTheme.cssVariables);

    // Apply transition if enabled
    if (options.enableTransitions) {
      const duration = options.transitionDuration || '200ms';
      root.style.setProperty('--theme-transition', `all ${duration} ease-in-out`);
      root.style.transition = 'var(--theme-transition)';
    }

    // Apply CSS variables
    applyCSSVariables(root, currentTheme.cssVariables);

    // Apply theme class
    root.classList.remove(...themeRegistry.getThemeNames());
    root.classList.add(currentThemeName);

    // Cleanup function
    return () => {
      if (options.enableTransitions) {
        root.style.removeProperty('--theme-transition');
        root.style.removeProperty('transition');
      }
      removeCSSVariables(root, variableNames);
    };
  }, [currentTheme, currentThemeName, options]);

  // Persist theme to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storageKey = options.storageKey || 'theme';
      localStorage.setItem(storageKey, currentThemeName);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [currentThemeName, options.storageKey]);

  // Set theme
  const setTheme = useCallback((themeName: string) => {
    if (themeRegistry.has(themeName)) {
      setCurrentThemeName(themeName);
    } else {
      console.warn(`Theme "${themeName}" not found. Available themes: ${themeRegistry.getThemeNames().join(', ')}`);
    }
  }, []);

  // Register new theme
  const registerTheme = useCallback((config: CustomThemeConfig): Theme => {
    return themeRegistry.register(config);
  }, []);

  // Remove theme
  const removeTheme = useCallback((themeName: string): boolean => {
    return themeRegistry.remove(themeName);
  }, []);

  // Get theme
  const getTheme = useCallback((themeName?: string): Theme | undefined => {
    const name = themeName || currentThemeName;
    return themeRegistry.get(name);
  }, [currentThemeName]);

  // Set options
  const setOptions = useCallback((newOptions: Partial<ThemeBuilderOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions }));
  }, []);

  const value: AdvancedThemeContextValue = {
    currentTheme: currentThemeName,
    themes,
    setTheme,
    registerTheme,
    removeTheme,
    getTheme,
    tokens: currentTheme || null,
    options,
    setOptions,
  };

  return (
    <AdvancedThemeContext.Provider value={value}>
      {children}
    </AdvancedThemeContext.Provider>
  );
}

/**
 * Hook to use advanced theme context
 */
export function useAdvancedTheme(): AdvancedThemeContextValue {
  const context = useContext(AdvancedThemeContext);
  if (context === undefined) {
    throw new Error('useAdvancedTheme must be used within an AdvancedThemeProvider');
  }
  return context;
}
