import { z } from 'zod';
import { BaseRegistry, type RegistryEntry, type RegistryOptions } from './BaseRegistry';

/**
 * Entry with category
 */
export interface CategorizedEntry extends RegistryEntry {
  category: string;
}

/**
 * Registry for entries with categories
 * Adds category-based filtering
 */
export abstract class CategorizedRegistry<T extends CategorizedEntry> extends BaseRegistry<T> {
  constructor(options: RegistryOptions, schema?: z.ZodSchema<T>) {
    super(options, schema);
  }
  /**
   * Get all entries in a category
   */
  getByCategory(category: string): T[] {
    return this.find(entry => entry.category === category);
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.entries.forEach(entry => categories.add(entry.category));
    return Array.from(categories).sort();
  }

  /**
   * Check if category exists
   */
  hasCategory(category: string): boolean {
    return Array.from(this.entries.values()).some(entry => entry.category === category);
  }

  /**
   * Count entries in category
   */
  countByCategory(category: string): number {
    return this.getByCategory(category).length;
  }
}
