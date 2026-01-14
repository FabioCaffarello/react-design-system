/**
 * Playground Routing Utilities
 * 
 * Provides internal routing for tabs/steps with deep linking support.
 */

import type { PlaygroundTabId } from '../components/PlaygroundTabs';

export interface PlaygroundRoute {
  tab: PlaygroundTabId;
  step?: string;
  params?: Record<string, string>;
}

/**
 * Parse URL hash to get route
 */
export function parseRouteFromHash(): PlaygroundRoute | null {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash.slice(1); // Remove #
  if (!hash) return null;
  
  try {
    const parts = hash.split('/');
    const tab = parts[0] as PlaygroundTabId;
    const step = parts[1];
    const params: Record<string, string> = {};
    
    // Parse query params
    if (parts.length > 2) {
      const queryString = parts.slice(2).join('/');
      const urlParams = new URLSearchParams(queryString);
      urlParams.forEach((value, key) => {
        params[key] = value;
      });
    }
    
    return {
      tab,
      step,
      params: Object.keys(params).length > 0 ? params : undefined,
    };
  } catch (error) {
    console.warn('Failed to parse route from hash:', error);
    return null;
  }
}

/**
 * Generate URL hash from route
 */
export function generateHashFromRoute(route: PlaygroundRoute): string {
  const parts = [route.tab];
  
  if (route.step) {
    parts.push(route.step);
  }
  
  if (route.params && Object.keys(route.params).length > 0) {
    const queryString = new URLSearchParams(route.params).toString();
    parts.push(queryString);
  }
  
  return parts.join('/');
}

/**
 * Update URL hash with route
 */
export function updateRoute(route: PlaygroundRoute, replace: boolean = false): void {
  if (typeof window === 'undefined') return;
  
  const hash = '#' + generateHashFromRoute(route);
  
  if (replace) {
    window.history.replaceState(null, '', hash);
  } else {
    window.history.pushState(null, '', hash);
  }
}

/**
 * Listen to hash changes
 */
export function onRouteChange(callback: (route: PlaygroundRoute | null) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  const handleHashChange = () => {
    const route = parseRouteFromHash();
    callback(route);
  };
  
  // Initial call
  handleHashChange();
  
  window.addEventListener('hashchange', handleHashChange);
  
  return () => {
    window.removeEventListener('hashchange', handleHashChange);
  };
}

/**
 * Get current route
 */
export function getCurrentRoute(): PlaygroundRoute | null {
  return parseRouteFromHash();
}
