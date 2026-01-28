/**
 * PROVIDERS BUNDLE - Turbopack Compatibility
 * 
 * This file creates a single module boundary for all providers to prevent
 * Turbopack from code-splitting them incorrectly. All providers are imported
 * and re-exported from this single file, ensuring they're in the same chunk.
 * 
 * CRITICAL: This file must be imported before any provider is used to ensure
 * correct initialization order in Turbopack builds.
 */

// Import all providers in dependency order
import { ThemeProvider, type ThemeProviderProps, type ThemeContextValue } from './ThemeProvider';
import { ConfigProvider, type ConfigProviderProps, type DesignSystemConfig, type ConfigContextValue } from './ConfigProvider';
import { ToastProvider, type ToastProviderProps } from './ToastProvider';
import { DialogProvider, type DialogProviderProps } from './DialogProvider';
import { useTheme } from './ThemeProvider';
import { useConfig } from './ConfigProvider';
import { useToastContext, useToastContextOptional, type Toast, type ToastContextValue, type ToastVariant } from './ToastContext';
import { useDialogContext, useDialogContextOptional, type DialogContextValue } from './DialogContext';
import { ToastContext } from './ToastContext';
import { DialogContext } from './DialogContext';

/**
 * Providers Bundle Object
 * 
 * This object ensures all providers are referenced together, creating a
 * module boundary that Turbopack cannot break. By accessing providers
 * through this object, we guarantee they're all in the same chunk.
 */
export const ProvidersBundle = {
  ThemeProvider,
  ConfigProvider,
  ToastProvider,
  DialogProvider,
  // Contexts
  ToastContext,
  DialogContext,
  // Hooks
  useTheme,
  useConfig,
  useToastContext,
  useToastContextOptional,
  useDialogContext,
  useDialogContextOptional,
} as const;

// Re-export all providers individually for convenience
export {
  ThemeProvider,
  ConfigProvider,
  ToastProvider,
  DialogProvider,
  useTheme,
  useConfig,
  useToastContext,
  useToastContextOptional,
  useDialogContext,
  useDialogContextOptional,
  ToastContext,
  DialogContext,
};

// Re-export types
export type {
  ThemeProviderProps,
  ThemeContextValue,
  ConfigProviderProps,
  DesignSystemConfig,
  ConfigContextValue,
  ToastProviderProps,
  DialogProviderProps,
  Toast,
  ToastContextValue,
  ToastVariant,
  DialogContextValue,
};
