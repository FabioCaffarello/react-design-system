/**
 * Providers Export
 * 
 * TURBOPACK COMPATIBILITY: All providers are re-exported from providers-bundle.ts
 * to ensure they're in the same module boundary. This prevents Turbopack from
 * code-splitting them incorrectly.
 * 
 * IMPORTANT: Do NOT import providers directly from individual files.
 * Always import from this index or from providers-bundle.ts.
 */

// Re-export all providers from the bundle (ensures single module boundary)
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
  type ThemeProviderProps,
  type ThemeContextValue,
  type ConfigProviderProps,
  type DesignSystemConfig,
  type ConfigContextValue,
  type ToastProviderProps,
  type DialogProviderProps,
  type Toast,
  type ToastContextValue,
  type ToastVariant,
  type DialogContextValue,
} from './providers-bundle';

// AppProvider must be exported separately as it depends on the bundle
export { AppProvider, useApp, type AppProviderProps, type AppProviderConfig } from './AppProvider';
