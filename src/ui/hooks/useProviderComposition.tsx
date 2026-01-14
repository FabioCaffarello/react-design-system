'use client';

import { type ReactNode, type ComponentType, type ReactElement } from 'react';

/**
 * Provider composition configuration
 * 
 * Defines how to compose multiple providers
 */
export interface ProviderCompositionConfig {
  /**
   * Provider component
   */
  Provider: ComponentType<{ children: ReactNode }>;
  
  /**
   * Props to pass to provider
   */
  props?: Record<string, unknown>;
  
  /**
   * Whether provider is enabled (default: true)
   */
  enabled?: boolean;
}

/**
 * Hook to compose multiple providers in a type-safe way
 * 
 * This hook helps compose multiple providers ensuring correct order
 * and type safety. Useful for reducing boilerplate when composing providers.
 * 
 * @param providers - Array of provider configurations
 * @param children - Children to wrap
 * 
 * @returns Composed providers with children
 * 
 * @example
 * ```tsx
 * const ComposedProviders = useProviderComposition([
 *   { Provider: ThemeProvider, props: { defaultTheme: 'light' } },
 *   { Provider: ConfigProvider },
 *   { Provider: ToastProvider, props: { maxToasts: 10 } },
 * ], children);
 * 
 * return <>{ComposedProviders}</>;
 * ```
 */
export function useProviderComposition(
  providers: ProviderCompositionConfig[],
  children: ReactNode
): ReactElement {
  // Filter enabled providers
  const enabledProviders = providers.filter(p => p.enabled !== false);
  
  // Compose providers from innermost to outermost
  let result: ReactNode = children;
  
  for (let i = enabledProviders.length - 1; i >= 0; i--) {
    const { Provider, props = {} } = enabledProviders[i];
    result = <Provider {...props}>{result}</Provider>;
  }
  
  return <>{result}</>;
}

/**
 * Higher-order component to create a composed provider
 * 
 * Creates a single component that composes multiple providers.
 * 
 * @param providers - Array of provider configurations
 * @returns Component that wraps children with all providers
 * 
 * @example
 * ```tsx
 * const AppProviders = createProviderComposition([
 *   { Provider: ThemeProvider, props: { defaultTheme: 'light' } },
 *   { Provider: ConfigProvider },
 *   { Provider: ToastProvider },
 * ]);
 * 
 * function App() {
 *   return (
 *     <AppProviders>
 *       <YourApp />
 *     </AppProviders>
 *   );
 * }
 * ```
 */
export function createProviderComposition(
  providers: ProviderCompositionConfig[]
): ComponentType<{ children: ReactNode }> {
  return function ComposedProvider({ children }) {
    return useProviderComposition(providers, children);
  };
}
