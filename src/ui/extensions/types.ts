/**
 * Extension Types
 * 
 * Type definitions for design system extensions.
 */

import type { ComponentType } from 'react';

/**
 * Extension Metadata
 */
export interface ExtensionMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  peerDependencies?: string[];
}

/**
 * Extension Exports
 */
export interface ExtensionExports {
  components?: Record<string, ComponentType<unknown>>;
  hooks?: Record<string, (...args: unknown[]) => unknown>;
  utils?: Record<string, (...args: unknown[]) => unknown>;
  types?: Record<string, unknown>;
  providers?: Record<string, ComponentType<unknown>>;
  factories?: Record<string, unknown>;
  registries?: Record<string, unknown>;
  strategies?: Record<string, unknown>;
}

/**
 * Extension Definition
 */
export interface ExtensionDefinition {
  id: string;
  metadata: ExtensionMetadata;
  exports: ExtensionExports;
  entryPoint: string;
  onRegister?: () => void;
  onUnregister?: () => void;
}

/**
 * Extension Registry Interface
 */
export interface IExtensionRegistry {
  register(extension: ExtensionDefinition): void;
  unregister(id: string): boolean;
  get(id: string): ExtensionDefinition | undefined;
  getAll(): ExtensionDefinition[];
  has(id: string): boolean;
}
