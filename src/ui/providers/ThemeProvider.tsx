'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { COLOR_TOKENS_LIGHT, COLOR_TOKENS_DARK, type ColorRole, type SemanticColor } from '../tokens/colors';
import type { ThemeMode } from '../tokens';

export interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  colors: Record<ColorRole, SemanticColor>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

/**
 * ThemeProvider Component
 * 
 * Provides theme context to the application.
 * Uses Strategy Pattern for different theme strategies (light, dark).
 * Uses Observer Pattern to notify components about theme changes.
 * 
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="light">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error);
    }

    return defaultTheme;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }

    // Apply theme class to document root
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme, storageKey]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const colors = theme === 'light' ? COLOR_TOKENS_LIGHT : COLOR_TOKENS_DARK;

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    setTheme,
    colors,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
