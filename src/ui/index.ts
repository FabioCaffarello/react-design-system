// ============================================================================
// EXPORT ORDER: Critical for Next.js SSR compatibility
// ============================================================================
// 1. Types and interfaces (no runtime dependencies)
// 2. Tokens (static data, no side effects)
// 3. Utils and helpers (pure functions)
// 4. Providers (in dependency order: Theme → Config → App)
// 5. Components (depend on providers)
// ============================================================================

// 1. TOKENS (static data, no side effects, safe for SSR)
export * from "./tokens/sidebar";
export * from "./tokens/spacing";
export * from "./tokens/typography";
export * from "./tokens/colors/index";
export * from "./tokens/breakpoints";
export * from "./tokens/tokens.factory";
export * from "./tokens/themes/light";
export * from "./tokens/themes/dark";

// 2. UTILS (pure functions, no side effects)
export { cn } from "./utils";
export { getSpacingClass, getSpacing } from "./tokens/spacing";
export { getTypographyClasses, getTypography } from "./tokens/typography";
export { getColorClass, getColor } from "./tokens/colors/index";
export { getBreakpoint, getMediaQuery } from "./tokens/breakpoints";
export {
  getAnimationClass,
  getAnimation,
  getTransitionClass,
} from "./tokens/animations";
export { getZIndexClass, getZIndex } from "./tokens/z-index";
export { getOpacityClass, getOpacity } from "./tokens/opacity";
export { getGradientClass, getGradient } from "./tokens/gradients";

// 3. PROVIDERS (exported from single bundle for Turbopack compatibility)
// CRITICAL: All providers are exported from providers-bundle.ts to ensure they're
// in the same module boundary. This prevents Turbopack from code-splitting them
// incorrectly, which causes initialization order issues.
//
// The bundle ensures all providers are initialized together, maintaining correct
// dependency order regardless of how Turbopack processes the modules.

// Export all providers from the bundle (ensures single module boundary)
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
} from "./providers/providers-bundle";

// 3.4 AppProvider (depends on all above providers - must be last)
// AppProvider imports from providers-bundle, ensuring all providers are in the same module
export {
  AppProvider,
  useApp,
  type AppProviderProps,
  type AppProviderConfig,
} from "./providers/AppProvider";

// 5. COMPONENTS (depend on providers, tokens, and utils)
export * from "./primitives";
export * from "./components";
