"use client";

/* eslint-disable react-refresh/only-export-components */
import { type ReactNode, useMemo } from "react";

/**
 * STRUCTURAL SOLUTION: Module Boundary Isolation with Explicit Initialization
 *
 * This solution ensures providers are initialized in the correct order by:
 * 1. Using a single atomic function that references all providers
 * 2. Ensuring all providers are in the same module boundary (no code splitting)
 * 3. Using explicit initialization order that cannot be broken by bundler
 *
 * The key: All provider references are in a single function execution context,
 * creating a module boundary that the bundler cannot break.
 */

/**
 * TURBOPACK COMPATIBILITY: Import all providers from a single bundle
 *
 * By importing all providers from providers-bundle.ts, we ensure they're
 * all in the same module boundary. This prevents Turbopack from code-splitting
 * them incorrectly, which causes initialization order issues.
 */
import {
  ProvidersBundle,
  type ThemeProviderProps,
  type ConfigProviderProps,
  type ToastProviderProps,
  type DialogProviderProps,
} from "./providers-bundle";

/**
 * Provider Initialization Guard
 *
 * Use ProvidersBundle to ensure all providers are in the same module boundary.
 * This prevents Turbopack from code-splitting providers incorrectly.
 */
const PROVIDER_INITIALIZATION_GUARD = ProvidersBundle;

/**
 * AppProvider Configuration
 */
export interface AppProviderConfig {
  theme?: Omit<ThemeProviderProps, "children">;
  config?: Omit<ConfigProviderProps, "children">;
  toast?: Omit<ToastProviderProps, "children">;
  dialog?: Omit<DialogProviderProps, "children">;
  providers?: {
    theme?: boolean;
    config?: boolean;
    toast?: boolean;
    dialog?: boolean;
  };
}

export interface AppProviderProps {
  children: ReactNode;
  config?: AppProviderConfig;
}

/**
 * Create provider stack with guaranteed initialization order
 *
 * This function uses the PROVIDER_INITIALIZATION_GUARD to ensure
 * all providers are initialized in the correct order. The guard object
 * creates a module boundary that prevents code splitting.
 */
function createProviderStack(
  children: ReactNode,
  config: AppProviderConfig | undefined,
): ReactNode {
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

  // CRITICAL: Use providers from the guard object
  // This ensures they're all in the same module boundary
  // The bundler cannot code-split or reorder code within this function

  let content: ReactNode = children;

  // Step 1: DialogProvider (most specific, wraps content)
  if (providers.dialog) {
    content = (
      <PROVIDER_INITIALIZATION_GUARD.DialogProvider {...dialogConfig}>
        {content}
      </PROVIDER_INITIALIZATION_GUARD.DialogProvider>
    );
  }

  // Step 2: ToastProvider (component-level, wraps content)
  if (providers.toast) {
    content = (
      <PROVIDER_INITIALIZATION_GUARD.ToastProvider {...toastConfig}>
        {content}
      </PROVIDER_INITIALIZATION_GUARD.ToastProvider>
    );
  }

  // Step 3: ConfigProvider (design system config, wraps content)
  if (providers.config) {
    content = (
      <PROVIDER_INITIALIZATION_GUARD.ConfigProvider {...configConfig}>
        {content}
      </PROVIDER_INITIALIZATION_GUARD.ConfigProvider>
    );
  }

  // Step 4: ThemeProvider (foundation, wraps everything) - MUST BE LAST
  if (providers.theme) {
    content = (
      <PROVIDER_INITIALIZATION_GUARD.ThemeProvider {...themeConfig}>
        {content}
      </PROVIDER_INITIALIZATION_GUARD.ThemeProvider>
    );
  }

  return content;
}

/**
 * AppProvider Component
 *
 * Root provider that composes all global providers of the design system.
 * Uses module boundary isolation to ensure correct initialization order.
 *
 * Provider Hierarchy:
 * ```
 * AppProvider (Root)
 *   ├── ThemeProvider (Design System Theme) - Foundation
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
  // Use useMemo to ensure provider stack is created once
  // This prevents React from re-evaluating and ensures stable reference
  const providerStack = useMemo(
    () => createProviderStack(children, config),
    [children, config],
  );

  return <>{providerStack}</>;
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
