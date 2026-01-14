/**
 * Registry Integration
 * 
 * Utilities for integrating with ComponentRegistry
 */

import { ComponentRegistry } from '../../../builders/ComponentRegistry';
import type { ComponentMetadata } from '../../../builders/ComponentRegistry';
import type { ComponentCategory } from '../../../builders/types';

/**
 * Get all available components from registry
 */
export function getAvailableComponents(): ComponentMetadata[] {
  return ComponentRegistry.getAll();
}

/**
 * Get components by category
 */
export function getComponentsByCategory(
  category: ComponentCategory
): ComponentMetadata[] {
  return ComponentRegistry.getByCategory(category);
}

/**
 * Validate if component exists in registry
 */
export function validateComponentExists(componentName: string): boolean {
  return ComponentRegistry.has(componentName);
}

/**
 * Get component metadata by name
 */
export function getComponentMetadata(
  componentName: string
): ComponentMetadata | undefined {
  return ComponentRegistry.get(componentName);
}

/**
 * Search components by name or tags
 */
export function searchComponents(
  query: string,
  category?: ComponentCategory
): ComponentMetadata[] {
  const allComponents = category
    ? getComponentsByCategory(category)
    : getAvailableComponents();

  const lowerQuery = query.toLowerCase();

  return allComponents.filter((metadata) => {
    const nameMatch = metadata.config.name.toLowerCase().includes(lowerQuery);
    const descriptionMatch = metadata.description?.toLowerCase().includes(lowerQuery);
    const tagsMatch = metadata.tags?.some((tag) =>
      tag.toLowerCase().includes(lowerQuery)
    );

    return nameMatch || descriptionMatch || tagsMatch;
  });
}

/**
 * Filter components by tags
 */
export function filterComponentsByTags(
  tags: string[],
  category?: ComponentCategory
): ComponentMetadata[] {
  const allComponents = category
    ? getComponentsByCategory(category)
    : getAvailableComponents();

  return allComponents.filter((metadata) => {
    if (!metadata.tags || metadata.tags.length === 0) return false;
    return tags.some((tag) => metadata.tags?.includes(tag));
  });
}
