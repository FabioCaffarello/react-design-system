/**
 * Custom error classes for Registry operations
 */

export class RegistryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RegistryError';
  }
}

export class EntryNotFoundError extends RegistryError {
  constructor(id: string, registryName: string) {
    super(`Entry "${id}" not found in ${registryName}`);
    this.name = 'EntryNotFoundError';
  }
}

export class DuplicateEntryError extends RegistryError {
  constructor(id: string, registryName: string) {
    super(`Duplicate entry "${id}" in ${registryName}`);
    this.name = 'DuplicateEntryError';
  }
}

export class InvalidEntryError extends RegistryError {
  constructor(reason: string) {
    super(`Invalid entry: ${reason}`);
    this.name = 'InvalidEntryError';
  }
}
