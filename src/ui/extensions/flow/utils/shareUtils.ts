/**
 * Share Utilities for Flow Playground
 * 
 * Functions for sharing and loading playground state
 */

import type { PlaygroundState } from '../types/playgroundTypes';

/**
 * Generate shareable link from playground state
 */
export function generateShareableLink(state: PlaygroundState): string {
  try {
    const encoded = btoa(JSON.stringify(state));
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}${window.location.pathname}`
      : '';
    return `${baseUrl}?flow=${encoded}`;
  } catch {
    console.error('Failed to generate shareable link');
    return '';
  }
}

/**
 * Load playground state from shareable link
 */
export function loadFromShareableLink(): PlaygroundState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const params = new URLSearchParams(window.location.search);
    const flow = params.get('flow');
    if (flow) {
      return JSON.parse(atob(flow)) as PlaygroundState;
    }
  } catch {
    console.error('Failed to load from shareable link');
  }
  return null;
}

/**
 * Export playground state as JSON
 */
export function exportPlaygroundState(state: PlaygroundState, filename: string = 'flow-playground.json'): void {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import playground state from JSON file
 */
export function importPlaygroundState(file: File): Promise<PlaygroundState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string) as PlaygroundState;
        resolve(json);
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
