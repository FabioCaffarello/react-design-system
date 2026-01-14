/**
 * App Builder Types
 * 
 * Type definitions for the App Builder system.
 */

import type { ComponentCategory } from '../../builders/types';
import type { ComponentMetadata } from '../../builders/ComponentRegistry';

/**
 * Feature Category
 * - page: Página completa (Dashboard, Login, etc.)
 * - module: Módulo funcional (User Management, Product Catalog)
 * - flow: Fluxo de usuário (Wizard, Checkout)
 * - pattern: Padrão de design reutilizável
 */
export type FeatureCategory = 'page' | 'module' | 'flow' | 'pattern';

/**
 * Component Instance in Feature
 */
export interface FeatureComponent {
  id: string; // Unique ID within feature
  type: ComponentCategory;
  name: string; // Component name from registry
  props: Record<string, unknown>; // Component props
  children?: FeatureComponent[]; // Nested components
  parentId?: string; // ID of parent component (for hierarchical structure)
  position?: {
    x: number;
    y: number;
  };
  layout?: {
    gridArea?: string;
    flexOrder?: number;
  };
}

/**
 * Layout Configuration
 */
export interface FeatureLayout {
  type: 'grid' | 'flex' | 'stack' | 'container' | 'custom';
  config: {
    // Grid
    columns?: number | string;
    rows?: number | string;
    gap?: string;
    // Flex
    direction?: 'row' | 'column';
    wrap?: 'wrap' | 'nowrap';
    justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
    align?: 'start' | 'center' | 'end' | 'stretch';
    // Stack
    spacing?: string;
    // Container
    maxWidth?: string;
    padding?: string;
  };
}

/**
 * Context Provider Data
 */
export interface FeatureContextData {
  providerName: string; // e.g., 'ThemeProvider', 'ConfigProvider', 'CustomProvider'
  data: unknown; // JSON data structure
  config?: {
    enabled?: boolean;
    mergeWithDefault?: boolean;
  };
}

/**
 * Route Configuration (optional)
 */
export interface FeatureRoute {
  path: string;
  component: string; // Feature component name
  exact?: boolean;
  protected?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Feature Configuration
 */
export interface FeatureConfig {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  components: FeatureComponent[];
  layout: FeatureLayout;
  contexts?: FeatureContextData[];
  routes?: FeatureRoute[];
  dependencies?: string[]; // Other feature IDs
  metadata?: {
    tags?: string[];
    version?: string;
    author?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

/**
 * Typography Token Configuration
 */
export interface TypographyTokenConfig {
  fontSizes: Record<string, { px: string; rem: string }>;
  fontWeights: Record<string, { value: number }>;
  lineHeights: Record<string, { value: number }>;
  fontFamilies?: Record<string, string>; // Optional
}

/**
 * Color Token Configuration
 */
export interface ColorTokenConfig {
  palette: Record<string, string>;
  semantic?: Record<string, string>; // Optional
}

/**
 * Global Tokens Configuration
 * 
 * Complete configuration for all design system tokens.
 * Some tokens are required, others are optional with defaults.
 */
export interface GlobalTokensConfig {
  typography: TypographyTokenConfig;
  colors: ColorTokenConfig;
  spacing: Record<string, string>;
  shadows?: Record<string, string>; // Optional
  radius?: Record<string, string>; // Optional
  sideNavbar?: {
    width?: string;
    navigationWidth?: string;
    variant?: 'default' | 'elevated' | 'compact';
  }; // Optional
}

/**
 * Application Configuration
 */
export interface AppConfig {
  name: string;
  description: string;
  features: FeatureConfig[];
  globalContexts?: FeatureContextData[];
  routes?: FeatureRoute[];
  theme?: {
    name?: string;
    mode?: 'light' | 'dark';
  };
  globalTokens?: GlobalTokensConfig;
  globalTokensRequired?: string[]; // Which tokens are required (e.g., ['typography', 'colors', 'spacing'])
  metadata?: {
    version?: string;
    author?: string;
    createdAt?: string;
  };
}

/**
 * Validation Result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Generated App Structure
 */
export interface GeneratedApp {
  mainFile: string; // App.tsx
  featureFiles: Record<string, string>; // FeatureName.tsx
  contextFiles: Record<string, string>; // contexts/ProviderName.tsx
  routeFile?: string; // routes.tsx (if routes defined)
  indexFile: string; // index.ts
  packageJson?: string; // package.json (if needed)
  readme?: string; // README.md
}

/**
 * App Builder State
 */
export interface AppBuilderState {
  appConfig: AppConfig;
  selectedFeatureId?: string;
  selectedComponentId?: string;
  viewMode: 'design' | 'code' | 'preview';
  sidebarCollapsed: boolean;
}

/**
 * Feature Manager Props
 */
export interface FeatureManagerProps {
  features: FeatureConfig[];
  onFeaturesChange: (features: FeatureConfig[]) => void;
  onFeatureSelect: (featureId: string) => void;
  selectedFeatureId?: string;
}

/**
 * Feature Editor Props
 */
export interface FeatureEditorProps {
  feature: FeatureConfig;
  onFeatureChange: (feature: FeatureConfig) => void;
  availableComponents: ComponentMetadata[];
}

/**
 * Component Palette Props
 */
export interface ComponentPaletteProps {
  onComponentSelect: (component: ComponentMetadata) => void;
  selectedComponentId?: string;
  filter?: {
    category?: ComponentCategory[];
    search?: string;
    tags?: string[];
  };
}

/**
 * Component Props Editor Props
 */
export interface ComponentPropsEditorProps {
  component: FeatureComponent;
  componentMetadata: ComponentMetadata;
  onComponentChange: (component: FeatureComponent) => void;
}

/**
 * Layout Editor Props
 */
export interface LayoutEditorProps {
  layout: FeatureLayout;
  onLayoutChange: (layout: FeatureLayout) => void;
  components: FeatureComponent[];
}

/**
 * Data Editor Props
 */
export interface DataEditorProps {
  contextData: FeatureContextData;
  onContextDataChange: (data: FeatureContextData) => void;
  providerTypes: string[]; // Available provider types
}

/**
 * Preview Props
 */
export interface PreviewProps {
  appConfig: AppConfig;
  selectedFeatureId?: string;
  onComponentSelect?: (componentId: string) => void;
}
