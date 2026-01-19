/**
 * Flow Theme System
 * 
 * Maps design system tokens to React Flow CSS variables.
 * Provides theming support with light/dark modes and custom overrides.
 */

import type { ThemeMode } from '../../../tokens';
import { COLOR_TOKENS, COLOR_TOKENS_LIGHT, COLOR_TOKENS_DARK } from '../../../tokens/colors';
import { SPACING_TOKENS } from '../../../tokens/spacing';
import { SHADOW_TOKENS } from '../../../tokens/shadows';
import { RADIUS_TOKENS } from '../../../tokens/radius';

/**
 * Flow Theme Configuration
 */
export interface FlowThemeConfig {
  mode: ThemeMode;
  overrides?: Partial<FlowThemeVariables>;
}

/**
 * Flow CSS Variables Map
 */
export interface FlowThemeVariables {
  // Edge Variables
  edgeStroke: string;
  edgeStrokeWidth: string;
  edgeStrokeSelected: string;
  
  // Connection Line Variables
  connectionLineStroke: string;
  connectionLineStrokeWidth: string;
  
  // Node Variables
  nodeColor: string;
  nodeBorder: string;
  nodeBorderSelected: string;
  nodeBackgroundColor: string;
  nodeGroupBackgroundColor: string;
  nodeBoxShadowHover: string;
  nodeBoxShadowSelected: string;
  nodeBorderRadius: string;
  
  // Handle Variables
  handleBackgroundColor: string;
  handleBorderColor: string;
  
  // Selection Variables
  selectionBackgroundColor: string;
  selectionBorder: string;
  
  // Controls Variables
  controlsButtonBackgroundColor: string;
  controlsButtonBackgroundColorHover: string;
  controlsButtonColor: string;
  controlsButtonColorHover: string;
  controlsButtonBorderColor: string;
  controlsBoxShadow: string;
  
  // Minimap Variables
  minimapBackgroundColor: string;
  minimapMaskBackgroundColor: string;
  minimapMaskStrokeColor: string;
  minimapMaskStrokeWidth: string;
  minimapNodeBackgroundColor: string;
  minimapNodeStrokeColor: string;
  minimapNodeStrokeWidth: string;
  
  // Background Variables
  backgroundColor: string;
  backgroundPatternDotsColor: string;
  backgroundPatternLinesColor: string;
  backgroundPatternCrossColor: string;
  
  // Edge Label Variables
  edgeLabelBackgroundColor: string;
  edgeLabelColor: string;
  
  // Attribution Variables
  attributionBackgroundColor: string;
}

/**
 * Default Light Theme
 */
export function getDefaultLightTheme(): FlowThemeVariables {
  const colors = COLOR_TOKENS_LIGHT;
  const spacing = SPACING_TOKENS;
  const shadows = SHADOW_TOKENS;
  const radius = RADIUS_TOKENS;
  
  return {
    // Edge Variables
    edgeStroke: colors.neutral.DEFAULT.hex,
    edgeStrokeWidth: '1px',
    edgeStrokeSelected: colors.neutral.dark.hex,
    
    // Connection Line Variables
    connectionLineStroke: colors.neutral.DEFAULT.hex,
    connectionLineStrokeWidth: '1px',
    
    // Node Variables
    nodeColor: 'inherit',
    nodeBorder: `1px solid ${colors.neutral.dark.hex}`,
    nodeBorderSelected: `1px solid ${colors.neutral.dark.hex}`,
    nodeBackgroundColor: '#fff',
    nodeGroupBackgroundColor: 'rgba(240, 240, 240, 0.25)',
    nodeBoxShadowHover: shadows.sm.value,
    nodeBoxShadowSelected: `0 0 0 0.5px ${colors.neutral.dark.hex}`,
    nodeBorderRadius: radius.md.value,
    
    // Handle Variables
    handleBackgroundColor: colors.neutral.dark.hex,
    handleBorderColor: '#fff',
    
    // Selection Variables
    selectionBackgroundColor: 'rgba(0, 89, 220, 0.08)',
    selectionBorder: '1px dotted rgba(0, 89, 220, 0.8)',
    
    // Controls Variables
    controlsButtonBackgroundColor: '#fefefe',
    controlsButtonBackgroundColorHover: '#f4f4f4',
    controlsButtonColor: 'inherit',
    controlsButtonColorHover: 'inherit',
    controlsButtonBorderColor: colors.neutral.light.hex,
    controlsBoxShadow: shadows.sm.value,
    
    // Minimap Variables
    minimapBackgroundColor: '#fff',
    minimapMaskBackgroundColor: 'rgba(240, 240, 240, 0.6)',
    minimapMaskStrokeColor: 'transparent',
    minimapMaskStrokeWidth: '1px',
    minimapNodeBackgroundColor: '#e2e2e2',
    minimapNodeStrokeColor: 'transparent',
    minimapNodeStrokeWidth: '2px',
    
    // Background Variables
    backgroundColor: 'transparent',
    backgroundPatternDotsColor: '#91919a',
    backgroundPatternLinesColor: colors.neutral.light.hex,
    backgroundPatternCrossColor: '#e2e2e2',
    
    // Edge Label Variables
    edgeLabelBackgroundColor: '#ffffff',
    edgeLabelColor: 'inherit',
    
    // Attribution Variables
    attributionBackgroundColor: 'rgba(255, 255, 255, 0.5)',
  };
}

/**
 * Default Dark Theme
 */
export function getDefaultDarkTheme(): FlowThemeVariables {
  const colors = COLOR_TOKENS_DARK;
  const spacing = SPACING_TOKENS;
  const shadows = SHADOW_TOKENS;
  const radius = RADIUS_TOKENS;
  
  return {
    // Edge Variables
    edgeStroke: '#3e3e3e',
    edgeStrokeWidth: '1px',
    edgeStrokeSelected: '#727272',
    
    // Connection Line Variables
    connectionLineStroke: '#b1b1b7',
    connectionLineStrokeWidth: '1px',
    
    // Node Variables
    nodeColor: colors.neutral.light.hex,
    nodeBorder: `1px solid #3c3c3c`,
    nodeBorderSelected: `1px solid #999`,
    nodeBackgroundColor: '#1e1e1e',
    nodeGroupBackgroundColor: 'rgba(240, 240, 240, 0.25)',
    nodeBoxShadowHover: '0 1px 4px 1px rgba(255, 255, 255, 0.08)',
    nodeBoxShadowSelected: `0 0 0 0.5px #999`,
    nodeBorderRadius: radius.md.value,
    
    // Handle Variables
    handleBackgroundColor: '#bebebe',
    handleBorderColor: '#1e1e1e',
    
    // Selection Variables
    selectionBackgroundColor: 'rgba(200, 200, 220, 0.08)',
    selectionBorder: '1px dotted rgba(200, 200, 220, 0.8)',
    
    // Controls Variables
    controlsButtonBackgroundColor: '#2b2b2b',
    controlsButtonBackgroundColorHover: '#3e3e3e',
    controlsButtonColor: colors.neutral.light.hex,
    controlsButtonColorHover: '#fff',
    controlsButtonBorderColor: '#5b5b5b',
    controlsBoxShadow: shadows.sm.value,
    
    // Minimap Variables
    minimapBackgroundColor: '#141414',
    minimapMaskBackgroundColor: 'rgba(60, 60, 60, 0.6)',
    minimapMaskStrokeColor: 'transparent',
    minimapMaskStrokeWidth: '1px',
    minimapNodeBackgroundColor: '#2b2b2b',
    minimapNodeStrokeColor: 'transparent',
    minimapNodeStrokeWidth: '2px',
    
    // Background Variables
    backgroundColor: '#141414',
    backgroundPatternDotsColor: '#777',
    backgroundPatternLinesColor: '#777',
    backgroundPatternCrossColor: '#777',
    
    // Edge Label Variables
    edgeLabelBackgroundColor: '#141414',
    edgeLabelColor: colors.neutral.light.hex,
    
    // Attribution Variables
    attributionBackgroundColor: 'rgba(150, 150, 150, 0.25)',
  };
}

/**
 * Get theme variables for a specific mode
 */
export function getFlowTheme(mode: ThemeMode = 'light', overrides?: Partial<FlowThemeVariables>): FlowThemeVariables {
  const baseTheme = mode === 'dark' ? getDefaultDarkTheme() : getDefaultLightTheme();
  
  if (overrides) {
    return { ...baseTheme, ...overrides };
  }
  
  return baseTheme;
}

/**
 * Convert theme variables to CSS custom properties
 */
export function themeToCSSVariables(theme: FlowThemeVariables): Record<string, string> {
  return {
    '--xy-edge-stroke-default': theme.edgeStroke,
    '--xy-edge-stroke-width-default': theme.edgeStrokeWidth,
    '--xy-edge-stroke-selected-default': theme.edgeStrokeSelected,
    '--xy-connectionline-stroke-default': theme.connectionLineStroke,
    '--xy-connectionline-stroke-width-default': theme.connectionLineStrokeWidth,
    '--xy-node-color-default': theme.nodeColor,
    '--xy-node-border-default': theme.nodeBorder,
    '--xy-node-border-selected-default': theme.nodeBorderSelected,
    '--xy-node-background-color-default': theme.nodeBackgroundColor,
    '--xy-node-group-background-color-default': theme.nodeGroupBackgroundColor,
    '--xy-node-boxshadow-hover-default': theme.nodeBoxShadowHover,
    '--xy-node-boxshadow-selected-default': theme.nodeBoxShadowSelected,
    '--xy-node-border-radius-default': theme.nodeBorderRadius,
    '--xy-handle-background-color-default': theme.handleBackgroundColor,
    '--xy-handle-border-color-default': theme.handleBorderColor,
    '--xy-selection-background-color-default': theme.selectionBackgroundColor,
    '--xy-selection-border-default': theme.selectionBorder,
    '--xy-controls-button-background-color-default': theme.controlsButtonBackgroundColor,
    '--xy-controls-button-background-color-hover-default': theme.controlsButtonBackgroundColorHover,
    '--xy-controls-button-color-default': theme.controlsButtonColor,
    '--xy-controls-button-color-hover-default': theme.controlsButtonColorHover,
    '--xy-controls-button-border-color-default': theme.controlsButtonBorderColor,
    '--xy-controls-box-shadow-default': theme.controlsBoxShadow,
    '--xy-minimap-background-color-default': theme.minimapBackgroundColor,
    '--xy-minimap-mask-background-color-default': theme.minimapMaskBackgroundColor,
    '--xy-minimap-mask-stroke-color-default': theme.minimapMaskStrokeColor,
    '--xy-minimap-mask-stroke-width-default': theme.minimapMaskStrokeWidth,
    '--xy-minimap-node-background-color-default': theme.minimapNodeBackgroundColor,
    '--xy-minimap-node-stroke-color-default': theme.minimapNodeStrokeColor,
    '--xy-minimap-node-stroke-width-default': theme.minimapNodeStrokeWidth,
    '--xy-background-color-default': theme.backgroundColor,
    '--xy-background-pattern-dots-color-default': theme.backgroundPatternDotsColor,
    '--xy-background-pattern-lines-color-default': theme.backgroundPatternLinesColor,
    '--xy-background-pattern-cross-color-default': theme.backgroundPatternCrossColor,
    '--xy-edge-label-background-color-default': theme.edgeLabelBackgroundColor,
    '--xy-edge-label-color-default': theme.edgeLabelColor,
    '--xy-attribution-background-color-default': theme.attributionBackgroundColor,
  };
}

/**
 * Apply theme to an element
 */
export function applyFlowTheme(
  element: HTMLElement | null,
  theme: FlowThemeVariables
): void {
  if (!element) return;
  
  const variables = themeToCSSVariables(theme);
  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

/**
 * Get CSS variable value from theme
 */
export function getFlowCSSVariable(
  variableName: keyof FlowThemeVariables,
  theme: FlowThemeVariables
): string {
  return theme[variableName];
}
