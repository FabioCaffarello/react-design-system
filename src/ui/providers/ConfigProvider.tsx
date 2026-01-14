'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { SPACING_TOKENS } from '../tokens/spacing';
import { TYPOGRAPHY_TOKENS } from '../tokens/typography';
import { BREAKPOINT_TOKENS } from '../tokens/breakpoints';
import { ANIMATION_TOKENS } from '../tokens/animations';
import type { BreakpointName, BreakpointToken } from '../tokens/breakpoints';
import type { SpacingToken } from '../tokens/spacing';
import type { TypographyToken } from '../tokens/typography';
import type { AnimationToken } from '../tokens/animations';

/**
 * Design System Configuration
 * 
 * Centralizes all design system configuration including:
 * - Breakpoints for responsive design
 * - Design tokens (spacing, typography, colors)
 * - Behavior configurations (animations, transitions)
 * - Feature flags
 */
export interface DesignSystemConfig {
  /**
   * Responsive breakpoints
   */
  breakpoints: Record<BreakpointName, { name: BreakpointName; minWidth: number; px: string; rem: string; tailwind: string }>;
  
  /**
   * Spacing tokens
   */
  spacing: typeof SPACING_TOKENS;
  
  /**
   * Typography tokens
   */
  typography: typeof TYPOGRAPHY_TOKENS;
  
  /**
   * Animation tokens
   */
  animations: typeof ANIMATION_TOKENS;
  
  /**
   * Feature flags
   */
  features: {
    /**
     * Enable reduced motion for accessibility
     */
    reducedMotion?: boolean;
    
    /**
     * Enable high contrast mode
     */
    highContrast?: boolean;
    
    /**
     * Enable debug mode
     */
    debug?: boolean;
  };
  
  /**
   * Behavior configurations
   */
  behavior: {
    /**
     * Default animation duration in ms
     */
    defaultAnimationDuration?: number;
    
    /**
     * Default transition duration in ms
     */
    defaultTransitionDuration?: number;
    
    /**
     * Enable focus visible outline
     */
    focusVisible?: boolean;
  };
}

/**
 * Default design system configuration
 */
const defaultConfig: DesignSystemConfig = {
  breakpoints: BREAKPOINT_TOKENS,
  spacing: SPACING_TOKENS,
  typography: TYPOGRAPHY_TOKENS,
  animations: ANIMATION_TOKENS,
  features: {
    reducedMotion: false,
    highContrast: false,
    debug: false,
  },
  behavior: {
    defaultAnimationDuration: 200,
    defaultTransitionDuration: 150,
    focusVisible: true,
  },
};

export interface ConfigContextValue {
  config: DesignSystemConfig;
  /**
   * Get spacing token by scale
   */
  getSpacing: (scale: keyof typeof SPACING_TOKENS) => SpacingToken;
  /**
   * Get breakpoint value
   */
  getBreakpoint: (name: BreakpointName) => BreakpointToken;
  /**
   * Check if feature is enabled
   */
  isFeatureEnabled: (feature: keyof DesignSystemConfig['features']) => boolean;
  /**
   * Update configuration (for runtime updates)
   */
  updateConfig: (updates: Partial<DesignSystemConfig>) => void;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export interface ConfigProviderProps {
  children: ReactNode;
  /**
   * Custom configuration to override defaults
   */
  config?: Partial<DesignSystemConfig>;
  /**
   * Strategy for configuration (default, custom, theme-based)
   */
  strategy?: 'default' | 'custom' | 'theme-based';
}

/**
 * ConfigProvider Component
 * 
 * Provides design system configuration context to the application.
 * Uses Strategy Pattern for different configuration strategies.
 * 
 * @example
 * ```tsx
 * <ConfigProvider config={{ features: { debug: true } }}>
 *   <App />
 * </ConfigProvider>
 * ```
 */
export function ConfigProvider({
  children,
  config: customConfig,
  strategy = 'default',
}: ConfigProviderProps) {
  // Merge custom config with defaults
  const config = useMemo<DesignSystemConfig>(() => {
    const baseConfig = { ...defaultConfig };
    
    if (customConfig) {
      return {
        ...baseConfig,
        ...customConfig,
        breakpoints: customConfig.breakpoints || baseConfig.breakpoints,
        spacing: customConfig.spacing || baseConfig.spacing,
        typography: customConfig.typography || baseConfig.typography,
        animations: customConfig.animations || baseConfig.animations,
        features: {
          ...baseConfig.features,
          ...customConfig.features,
        },
        behavior: {
          ...baseConfig.behavior,
          ...customConfig.behavior,
        },
      };
    }
    
    return baseConfig;
  }, [customConfig]);

  // Apply reduced motion if enabled
  useMemo(() => {
    if (config.features.reducedMotion && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--motion-reduce', '1');
    } else if (typeof document !== 'undefined') {
      document.documentElement.style.removeProperty('--motion-reduce');
    }
  }, [config.features.reducedMotion]);

  // Apply high contrast if enabled
  useMemo(() => {
    if (config.features.highContrast && typeof document !== 'undefined') {
      document.documentElement.classList.add('high-contrast');
    } else if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [config.features.highContrast]);

  const getSpacing = useMemo(
    () => (scale: keyof typeof SPACING_TOKENS) => {
      return config.spacing[scale];
    },
    [config.spacing]
  );

  const getBreakpoint = useMemo(
    () => (name: BreakpointName) => {
      return config.breakpoints[name];
    },
    [config.breakpoints]
  );

  const isFeatureEnabled = useMemo(
    () => (feature: keyof DesignSystemConfig['features']) => {
      return config.features[feature] ?? false;
    },
    [config.features]
  );

  const updateConfig = useMemo(
    () => (updates: Partial<DesignSystemConfig>) => {
      // This is a placeholder - in a real implementation, you'd use state
      // For now, config is immutable. Future enhancement could add state management.
      console.warn('ConfigProvider: updateConfig called but config is immutable. Consider using state management for dynamic updates.');
    },
    []
  );

  const value: ConfigContextValue = {
    config,
    getSpacing,
    getBreakpoint,
    isFeatureEnabled,
    updateConfig,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

/**
 * Hook to use config context
 * 
 * @throws Error if used outside ConfigProvider
 */
export function useConfig(): ConfigContextValue {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
