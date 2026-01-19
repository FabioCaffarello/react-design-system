import { z } from 'zod';
import { compareByOrder } from '../utils/comparators';
import {
  EntryNotFoundError,
  DuplicateEntryError,
  InvalidEntryError
} from '../errors/RegistryErrors';

/**
 * Registry Entry Base Interface
 */
export interface RegistryEntry {
  id: string;
  metadata?: {
    order?: number;
    label?: string;
    description?: string;
    tags?: string[];
  };
}

/**
 * Registry Configuration Options
 */
export interface RegistryOptions {
  /**
   * Registry name (for error messages and logging)
   */
  name: string;

  /**
   * Whether to allow duplicate registrations (overwrite existing)
   * Default: true (with warning)
   */
  allowDuplicates?: boolean;

  /**
   * Whether to throw errors or log warnings
   * Default: 'warn'
   */
  errorMode?: 'throw' | 'warn' | 'silent';

  /**
   * Whether to validate entries on registration
   * Default: true
   */
  validateOnRegister?: boolean;
}

/**
 * Base Registry Abstract Class
 *
 * Provides common registry functionality with consistent behavior.
 * Subclasses must implement ID generation strategy.
 *
 * @example
 * class ComponentRegistry extends BaseRegistry<ComponentEntry> {
 *   protected generateEntryId(entry: ComponentEntry): string {
 *     return entry.id;
 *   }
 *
 *   protected validateEntry(entry: ComponentEntry): void {
 *     if (!entry.component) {
 *       throw new InvalidEntryError('Missing component');
 *     }
 *   }
 * }
 */
export abstract class BaseRegistry<T extends RegistryEntry> {
  protected entries: Map<string, T> = new Map();
  protected options: Required<RegistryOptions>;
  protected schema?: z.ZodSchema<T>;

  constructor(options: RegistryOptions, schema?: z.ZodSchema<T>) {
    this.options = {
      allowDuplicates: true,
      errorMode: 'warn',
      validateOnRegister: true,
      ...options,
    };
    this.schema = schema;
  }

  /**
   * Generate unique ID for an entry
   * Must be implemented by subclasses
   */
  protected abstract generateEntryId(entry: T): string;

  /**
   * Validate an entry before registration
   * Can be overridden by subclasses for custom validation
   *
   * If a Zod schema is provided, it will be validated first.
   * Then custom validation logic can be added by overriding this method.
   */
  protected validateEntry(entry: T): void {
    // Zod schema validation if provided
    if (this.schema) {
      const result = this.schema.safeParse(entry);
      if (!result.success) {
        const errors = result.error.issues
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        throw new InvalidEntryError(`Schema validation failed: ${errors}`);
      }
    }

    // Basic ID validation
    if (!entry.id && !this.generateEntryId(entry)) {
      throw new InvalidEntryError('Entry must have an ID');
    }
  }

  /**
   * Register an entry
   */
  register(entry: T): void {
    if (this.options.validateOnRegister) {
      this.validateEntry(entry);
    }

    const id = this.generateEntryId(entry);
    const entryWithId = { ...entry, id };

    if (this.entries.has(id)) {
      this.handleDuplicate(id);
    }

    this.entries.set(id, entryWithId);
    this.onRegister(entryWithId);
  }

  /**
   * Register multiple entries at once
   */
  registerMany(entries: T[]): void {
    entries.forEach(entry => this.register(entry));
  }

  /**
   * Unregister an entry by ID
   */
  unregister(id: string): boolean {
    const entry = this.entries.get(id);
    if (!entry) return false;

    this.entries.delete(id);
    this.onUnregister(entry);
    return true;
  }

  /**
   * Unregister multiple entries
   */
  unregisterMany(ids: string[]): number {
    let count = 0;
    ids.forEach(id => {
      if (this.unregister(id)) count++;
    });
    return count;
  }

  /**
   * Get entry by ID
   */
  get(id: string): T | undefined {
    return this.entries.get(id);
  }

  /**
   * Get entry by ID or throw error
   */
  getOrThrow(id: string): T {
    const entry = this.get(id);
    if (!entry) {
      throw new EntryNotFoundError(id, this.options.name);
    }
    return entry;
  }

  /**
   * Check if entry exists
   */
  has(id: string): boolean {
    return this.entries.has(id);
  }

  /**
   * Get all entries
   */
  getAll(): T[] {
    return Array.from(this.entries.values()).sort(compareByOrder);
  }

  /**
   * Get all IDs
   */
  getAllIds(): string[] {
    return Array.from(this.entries.keys());
  }

  /**
   * Get count of entries
   */
  count(): number {
    return this.entries.size;
  }

  /**
   * Check if registry is empty
   */
  isEmpty(): boolean {
    return this.entries.size === 0;
  }

  /**
   * Clear all entries
   */
  clear(): void {
    const entries = Array.from(this.entries.values());
    this.entries.clear();
    entries.forEach(entry => this.onUnregister(entry));
  }

  /**
   * Find entries matching predicate
   */
  find(predicate: (entry: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }

  /**
   * Find first entry matching predicate
   */
  findOne(predicate: (entry: T) => boolean): T | undefined {
    return this.getAll().find(predicate);
  }

  /**
   * Handle duplicate registration
   */
  protected handleDuplicate(id: string): void {
    const message = `Entry "${id}" already exists in ${this.options.name}`;

    switch (this.options.errorMode) {
      case 'throw':
        if (!this.options.allowDuplicates) {
          throw new DuplicateEntryError(id, this.options.name);
        }
        break;
      case 'warn':
        console.warn(message + '. Overwriting.');
        break;
      case 'silent':
        break;
    }
  }

  /**
   * Hook called after successful registration
   * Can be overridden by subclasses
   */
  protected onRegister(entry: T): void {
    // Override in subclasses if needed
  }

  /**
   * Hook called after unregistration
   * Can be overridden by subclasses
   */
  protected onUnregister(entry: T): void {
    // Override in subclasses if needed
  }

  /**
   * Export entries as JSON
   */
  toJSON(): T[] {
    return this.getAll();
  }

  /**
   * Load entries from JSON
   */
  fromJSON(entries: T[]): void {
    this.clear();
    this.registerMany(entries);
  }
}
