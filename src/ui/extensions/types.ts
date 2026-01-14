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
  components?: Record<string, ComponentType<any>>;
  hooks?: Record<string, (...args: any[]) => any>;
  utils?: Record<string, (...args: any[]) => any>;
  types?: Record<string, any>;
  providers?: Record<string, ComponentType<any>>;
  factories?: Record<string, any>;
  registries?: Record<string, any>;
  strategies?: Record<string, any>;
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
