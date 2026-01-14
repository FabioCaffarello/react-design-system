/**
 * Global Config Cache
 * 
 * Manages caching of global tokens configuration during app setup.
 * Cache expires after 24 hours and is cleared when app is created.
 */

import type { GlobalTokensConfig } from '../types';

const CACHE_KEY = 'app-builder:global-config-cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedConfig {
  config: GlobalTokensConfig;
  timestamp: number;
}

/**
 * Global Config Cache Manager
 */
export class GlobalConfigCache {
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
   * Save configuration to cache
   */
  static save(config: GlobalTokensConfig): void {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available, cannot cache configuration');
      return;
    }

    try {
      const cacheData: CachedConfig = {
        config,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to save config to cache:', error);
    }
  }

  /**
   * Load configuration from cache
   * Returns null if cache doesn't exist or is expired
   */
  static load(): GlobalTokensConfig | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) {
        return null;
      }

      const cacheData: CachedConfig = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - cacheData.timestamp > CACHE_EXPIRY) {
        this.clear();
        return null;
      }

      return cacheData.config;
    } catch (error) {
      console.error('Failed to load config from cache:', error);
      this.clear();
      return null;
    }
  }

  /**
   * Clear cache
   */
  static clear(): void {
    if (!this.isStorageAvailable()) {
      return;
    }

    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Check if cache exists and is valid
   */
  static exists(): boolean {
    if (!this.isStorageAvailable()) {
      return false;
    }

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) {
        return false;
      }

      const cacheData: CachedConfig = JSON.parse(cached);
      return Date.now() - cacheData.timestamp <= CACHE_EXPIRY;
    } catch {
      return false;
    }
  }

  /**
   * Check if cache is expired
   */
  static isExpired(): boolean {
    if (!this.isStorageAvailable()) {
      return true;
    }

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) {
        return true;
      }

      const cacheData: CachedConfig = JSON.parse(cached);
      const isExpired = Date.now() - cacheData.timestamp > CACHE_EXPIRY;
      
      if (isExpired) {
        this.clear();
      }
      
      return isExpired;
    } catch {
      return true;
    }
  }

  /**
   * Get cache age in milliseconds
   */
  static getAge(): number | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) {
        return null;
      }

      const cacheData: CachedConfig = JSON.parse(cached);
      return Date.now() - cacheData.timestamp;
    } catch {
      return null;
    }
  }
}
