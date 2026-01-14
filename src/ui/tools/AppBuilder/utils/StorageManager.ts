/**
 * Storage Manager
 * 
 * Utilities for persisting and loading app configurations
 */

import type { AppConfig } from '../types';

const STORAGE_PREFIX = 'app-builder:';
const APPS_LIST_KEY = `${STORAGE_PREFIX}apps-list`;

/**
 * Storage Manager
 * 
 * Manages localStorage operations for app configurations
 */
export class StorageManager {
  /**
   * Check if localStorage is available
   */
  private static isStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const test = '__storage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Save app configuration
   */
  static saveApp(appConfig: AppConfig, key: string): void {
    if (!this.isStorageAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      const storageKey = `${STORAGE_PREFIX}${key}`;
      const json = JSON.stringify(appConfig, null, 2);
      localStorage.setItem(storageKey, json);

      // Update apps list
      const appsList = this.listApps();
      if (!appsList.includes(key)) {
        appsList.push(key);
        localStorage.setItem(APPS_LIST_KEY, JSON.stringify(appsList));
      }
    } catch (error) {
      console.error('Failed to save app:', error);
      throw new Error(`Failed to save app: ${String(error)}`);
    }
  }

  /**
   * Load app configuration
   */
  static loadApp(key: string): AppConfig | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    try {
      const storageKey = `${STORAGE_PREFIX}${key}`;
      const json = localStorage.getItem(storageKey);

      if (!json) {
        return null;
      }

      return JSON.parse(json) as AppConfig;
    } catch (error) {
      console.error('Failed to load app:', error);
      return null;
    }
  }

  /**
   * List all saved apps
   */
  static listApps(): string[] {
    if (!this.isStorageAvailable()) {
      return [];
    }

    try {
      const json = localStorage.getItem(APPS_LIST_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Failed to list apps:', error);
      return [];
    }
  }

  /**
   * Delete app configuration
   */
  static deleteApp(key: string): void {
    if (!this.isStorageAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      const storageKey = `${STORAGE_PREFIX}${key}`;
      localStorage.removeItem(storageKey);

      // Update apps list
      const appsList = this.listApps();
      const filtered = appsList.filter((app) => app !== key);
      localStorage.setItem(APPS_LIST_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete app:', error);
      throw new Error(`Failed to delete app: ${String(error)}`);
    }
  }

  /**
   * Export app configuration as JSON string
   */
  static exportApp(appConfig: AppConfig): string {
    try {
      return JSON.stringify(appConfig, null, 2);
    } catch (error) {
      console.error('Failed to export app:', error);
      throw new Error(`Failed to export app: ${String(error)}`);
    }
  }

  /**
   * Import app configuration from JSON string
   */
  static importApp(json: string): AppConfig {
    try {
      const parsed = JSON.parse(json);
      
      // Basic validation
      if (!parsed.name || !parsed.features || !Array.isArray(parsed.features)) {
        throw new Error('Invalid app configuration format');
      }

      return parsed as AppConfig;
    } catch (error) {
      console.error('Failed to import app:', error);
      throw new Error(`Failed to import app: ${String(error)}`);
    }
  }

  /**
   * Clear all saved apps
   */
  static clearAll(): void {
    if (!this.isStorageAvailable()) {
      throw new Error('localStorage is not available');
    }

    try {
      const appsList = this.listApps();
      for (const key of appsList) {
        const storageKey = `${STORAGE_PREFIX}${key}`;
        localStorage.removeItem(storageKey);
      }
      localStorage.removeItem(APPS_LIST_KEY);
    } catch (error) {
      console.error('Failed to clear apps:', error);
      throw new Error(`Failed to clear apps: ${String(error)}`);
    }
  }
}
