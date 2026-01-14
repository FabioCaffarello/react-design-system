'use client';

import { type ReactNode } from 'react';
import { ThemeProvider, type ThemeProviderProps } from './ThemeProvider';
import { ConfigProvider, type ConfigProviderProps } from './ConfigProvider';
import { ToastProvider, type ToastProviderProps } from '../organisms/Toast/ToastProvider';
import { DialogProvider, type DialogProviderProps } from '../organisms/Dialog/DialogProvider';

/**
 * AppProvider Configuration
 * 
 * Allows optional configuration of each provider
 */
export interface AppProviderConfig {
  /**
   * ThemeProvider configuration
   */
  theme?: Omit<ThemeProviderProps, 'children'>;
  
  /**
   * ConfigProvider configuration
   */
  config?: Omit<ConfigProviderProps, 'children'>;
  
  /**
   * ToastProvider configuration
   */
  toast?: Omit<ToastProviderProps, 'children'>;
  
  /**
   * DialogProvider configuration
   */
  dialog?: Omit<DialogProviderProps, 'children'>;
  
  /**
   * Enable/disable specific providers
   */
  providers?: {
    theme?: boolean;
    config?: boolean;
    toast?: boolean;
    dialog?: boolean;
  };
}

export interface AppProviderProps {
  children: ReactNode;
  /**
   * Optional configuration for providers
   */
  config?: AppProviderConfig;
}

/**
 * AppProvider Component
 * 
 * Root provider that composes all global providers of the design system.
 * Uses Composition Pattern to combine providers in a logical hierarchy.
 * 
 * Provider Hierarchy:
 * ```
 * AppProvider (Root)
 *   ├── ThemeProvider (Design System Theme)
 *   ├── ConfigProvider (Design System Config)
 *   └── ComponentProviders (optional, per feature)
 *       ├── ToastProvider
 *       └── DialogProvider
 * ```
 * 
 * @example
 * ```tsx
 * <AppProvider>
 *   <App />
 * </AppProvider>
 * ```
 * 
 * @example With custom configuration
 * ```tsx
 * <AppProvider config={{
 *   theme: { defaultTheme: 'dark' },
 *   config: { config: { features: { debug: true } } },
 *   toast: { maxToasts: 10 }
 * }}>
 *   <App />
 * </AppProvider>
 * ```
 */
export function AppProvider({ children, config }: AppProviderProps) {
  const {
    theme: themeConfig,
    config: configConfig,
    toast: toastConfig,
    dialog: dialogConfig,
    providers = {
      theme: true,
      config: true,
      toast: true,
      dialog: true,
    },
  } = config || {};

  // Compose providers in order: Theme → Config → Component Providers
  let content: ReactNode = children;

  // DialogProvider (most specific, wraps content)
  if (providers.dialog) {
    content = (
      <DialogProvider {...dialogConfig}>
        {content}
      </DialogProvider>
    );
  }

  // ToastProvider (component-level, wraps content)
  if (providers.toast) {
    content = (
      <ToastProvider {...toastConfig}>
        {content}
      </ToastProvider>
    );
  }

  // ConfigProvider (design system config, wraps content)
  if (providers.config) {
    content = (
      <ConfigProvider {...configConfig}>
        {content}
      </ConfigProvider>
    );
  }

  // ThemeProvider (foundation, wraps everything)
  if (providers.theme) {
    content = (
      <ThemeProvider {...themeConfig}>
        {content}
      </ThemeProvider>
    );
  }

  return <>{content}</>;
}

/**
 * Hook to access AppProvider context
 * 
 * This is a convenience hook that provides access to all provider contexts.
 * Individual hooks (useTheme, useConfig, etc.) should be used for specific contexts.
 */
export function useApp() {
  // This hook can be extended in the future to provide unified access
  // For now, use individual hooks: useTheme(), useConfig(), etc.
  return {
    // Placeholder for future unified API
  };
}
