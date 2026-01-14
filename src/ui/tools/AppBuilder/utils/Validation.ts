/**
 * Validation System
 * 
 * Comprehensive validation for features, apps, components, and JSON data
 */

import type {
  ValidationResult,
  FeatureConfig,
  AppConfig,
  FeatureComponent,
} from '../types';
import { validateComponentExists } from './RegistryIntegration';
import { validateContextData } from './DataValidator';

/**
 * Validate feature configuration
 */
export function validateFeature(feature: FeatureConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate ID
  if (!feature.id || feature.id.trim().length === 0) {
    errors.push('Feature ID is required');
  }

  // Validate name
  if (!feature.name || feature.name.trim().length === 0) {
    errors.push('Feature name is required');
  }

  // Validate category
  const validCategories: FeatureConfig['category'][] = ['page', 'module', 'flow', 'pattern'];
  if (!validCategories.includes(feature.category)) {
    errors.push(`Invalid feature category: ${feature.category}`);
  }

  // Validate components
  if (!Array.isArray(feature.components)) {
    errors.push('Feature components must be an array');
  } else {
    // Validate each component
    for (const component of feature.components) {
      const componentValidation = validateComponent(component);
      if (!componentValidation.valid) {
        errors.push(...componentValidation.errors.map((e) => `Component ${component.id}: ${e}`));
      }
      if (componentValidation.warnings) {
        warnings.push(...componentValidation.warnings.map((w) => `Component ${component.id}: ${w}`));
      }
    }
  }

  // Validate layout
  const layoutValidation = validateLayout(feature.layout);
  if (!layoutValidation.valid) {
    errors.push(...layoutValidation.errors.map((e) => `Layout: ${e}`));
  }

  // Validate contexts if present
  if (feature.contexts) {
    for (const context of feature.contexts) {
      const contextValidation = validateContextData(context);
      if (!contextValidation.valid) {
        errors.push(...contextValidation.errors.map((e) => `Context ${context.providerName}: ${e}`));
      }
    }
  }

  // Validate dependencies if present
  if (feature.dependencies) {
    if (!Array.isArray(feature.dependencies)) {
      errors.push('Feature dependencies must be an array');
    } else {
      // Check for circular dependencies (basic check)
      const seen = new Set<string>();
      for (const dep of feature.dependencies) {
        if (seen.has(dep)) {
          warnings.push(`Circular dependency detected: ${dep}`);
        }
        seen.add(dep);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validate component instance
 */
export function validateComponent(component: FeatureComponent): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate ID
  if (!component.id || component.id.trim().length === 0) {
    errors.push('Component ID is required');
  }

  // Validate type
  const validTypes: FeatureComponent['type'][] = [
    'atom',
    'molecule',
    'organism',
    'template',
    'pattern',
    'layout',
  ];
  if (!validTypes.includes(component.type)) {
    errors.push(`Invalid component type: ${component.type}`);
  }

  // Validate name
  if (!component.name || component.name.trim().length === 0) {
    errors.push('Component name is required');
  } else {
    // Check if component exists in registry
    if (!validateComponentExists(component.name)) {
      warnings.push(`Component ${component.name} not found in registry`);
    }
  }

  // Validate props
  if (component.props && typeof component.props !== 'object') {
    errors.push('Component props must be an object');
  }

  // Validate children recursively
  if (component.children) {
    if (!Array.isArray(component.children)) {
      errors.push('Component children must be an array');
    } else {
      for (const child of component.children) {
        const childValidation = validateComponent(child);
        if (!childValidation.valid) {
          errors.push(...childValidation.errors.map((e) => `Child ${child.id}: ${e}`));
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validate layout configuration
 */
export function validateLayout(layout: FeatureConfig['layout']): ValidationResult {
  const errors: string[] = [];

  if (!layout) {
    errors.push('Layout is required');
    return { valid: false, errors };
  }

  // Validate type
  const validTypes: FeatureConfig['layout']['type'][] = [
    'grid',
    'flex',
    'stack',
    'container',
    'custom',
  ];
  if (!validTypes.includes(layout.type)) {
    errors.push(`Invalid layout type: ${layout.type}`);
  }

  // Validate config
  if (!layout.config || typeof layout.config !== 'object') {
    errors.push('Layout config is required and must be an object');
  } else {
    // Type-specific validations
    if (layout.type === 'grid') {
      if (layout.config.columns !== undefined && typeof layout.config.columns !== 'number' && typeof layout.config.columns !== 'string') {
        errors.push('Grid columns must be a number or string');
      }
      if (layout.config.rows !== undefined && typeof layout.config.rows !== 'number' && typeof layout.config.rows !== 'string') {
        errors.push('Grid rows must be a number or string');
      }
    } else if (layout.type === 'flex') {
      const validDirections = ['row', 'column'];
      if (layout.config.direction && !validDirections.includes(layout.config.direction)) {
        errors.push(`Invalid flex direction: ${layout.config.direction}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate app configuration
 */
export function validateApp(appConfig: AppConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate name
  if (!appConfig.name || appConfig.name.trim().length === 0) {
    errors.push('App name is required');
  }

  // Validate features
  if (!Array.isArray(appConfig.features)) {
    errors.push('App features must be an array');
  } else if (appConfig.features.length === 0) {
    warnings.push('App has no features');
  } else {
    // Validate each feature
    const featureIds = new Set<string>();
    for (const feature of appConfig.features) {
      // Check for duplicate IDs
      if (featureIds.has(feature.id)) {
        errors.push(`Duplicate feature ID: ${feature.id}`);
      }
      featureIds.add(feature.id);

      // Validate feature
      const featureValidation = validateFeature(feature);
      if (!featureValidation.valid) {
        errors.push(...featureValidation.errors.map((e) => `Feature ${feature.id}: ${e}`));
      }
      if (featureValidation.warnings) {
        warnings.push(...featureValidation.warnings.map((w) => `Feature ${feature.id}: ${w}`));
      }

      // Validate dependencies
      if (feature.dependencies) {
        for (const depId of feature.dependencies) {
          if (!featureIds.has(depId) && !appConfig.features.some((f) => f.id === depId)) {
            errors.push(`Feature ${feature.id} depends on non-existent feature: ${depId}`);
          }
        }
      }
    }
  }

  // Validate global contexts if present
  if (appConfig.globalContexts) {
    for (const context of appConfig.globalContexts) {
      const contextValidation = validateContextData(context);
      if (!contextValidation.valid) {
        errors.push(...contextValidation.errors.map((e) => `Global context ${context.providerName}: ${e}`));
      }
    }
  }

  // Validate routes if present
  if (appConfig.routes) {
    if (!Array.isArray(appConfig.routes)) {
      errors.push('App routes must be an array');
    } else {
      const paths = new Set<string>();
      for (const route of appConfig.routes) {
        if (!route.path || route.path.trim().length === 0) {
          errors.push('Route path is required');
        }
        if (paths.has(route.path)) {
          warnings.push(`Duplicate route path: ${route.path}`);
        }
        paths.add(route.path);

        if (!route.component || route.component.trim().length === 0) {
          errors.push('Route component is required');
        } else {
          // Check if component exists in features
          const componentExists = appConfig.features.some(
            (f) => f.name === route.component || f.id === route.component
          );
          if (!componentExists) {
            warnings.push(`Route component not found: ${route.component}`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validate feature dependencies (check for circular dependencies)
 */
export function validateFeatureDependencies(
  features: FeatureConfig[]
): ValidationResult {
  const errors: string[] = [];
  const featureMap = new Map<string, FeatureConfig>();

  // Build feature map
  for (const feature of features) {
    featureMap.set(feature.id, feature);
  }

  // Check for circular dependencies
  function hasCircularDependency(
    featureId: string,
    visited: Set<string>,
    path: string[]
  ): boolean {
    if (path.includes(featureId)) {
      return true; // Circular dependency detected
    }

    if (visited.has(featureId)) {
      return false; // Already checked
    }

    visited.add(featureId);
    const feature = featureMap.get(featureId);

    if (!feature || !feature.dependencies) {
      return false;
    }

    for (const depId of feature.dependencies) {
      if (hasCircularDependency(depId, visited, [...path, featureId])) {
        return true;
      }
    }

    return false;
  }

  for (const feature of features) {
    if (feature.dependencies && feature.dependencies.length > 0) {
      const visited = new Set<string>();
      if (hasCircularDependency(feature.id, visited, [])) {
        errors.push(`Circular dependency detected in feature: ${feature.id}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
