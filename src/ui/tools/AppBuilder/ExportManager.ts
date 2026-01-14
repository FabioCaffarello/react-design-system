/**
 * Export Manager
 * 
 * Utilities for exporting applications in different formats
 */

import type { AppConfig, GeneratedApp } from './types';
import { generateAppCode } from './codeGenerators/AppCodeGenerator';
import { StorageManager } from './utils/StorageManager';

/**
 * Download a file
 */
function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export app as JSON configuration
 */
export function exportAppAsJSON(appConfig: AppConfig, filename?: string): void {
  const json = StorageManager.exportApp(appConfig);
  const name = filename || `${appConfig.name.toLowerCase().replace(/\s+/g, '-')}.json`;
  downloadFile(json, name, 'application/json');
}

/**
 * Export app as code files
 */
export function exportAppAsCode(appConfig: AppConfig, appName?: string): void {
  const generated = generateAppCode(appConfig);
  const name = appName || appConfig.name.toLowerCase().replace(/\s+/g, '-');

  // Download main file
  downloadFile(generated.mainFile, `${name}/src/App.tsx`, 'text/typescript');

  // Download feature files
  Object.entries(generated.featureFiles).forEach(([featureName, code]) => {
    downloadFile(code, `${name}/src/features/${featureName}.tsx`, 'text/typescript');
  });

  // Download context files
  Object.entries(generated.contextFiles).forEach(([contextName, code]) => {
    downloadFile(code, `${name}/src/contexts/${contextName}.tsx`, 'text/typescript');
  });

  // Download route file if exists
  if (generated.routeFile) {
    downloadFile(generated.routeFile, `${name}/src/routes.tsx`, 'text/typescript');
  }

  // Download index file
  downloadFile(generated.indexFile, `${name}/src/index.ts`, 'text/typescript');

  // Download package.json if exists
  if (generated.packageJson) {
    downloadFile(generated.packageJson, `${name}/package.json`, 'application/json');
  }

  // Download README if exists
  if (generated.readme) {
    downloadFile(generated.readme, `${name}/README.md`, 'text/markdown');
  }
}

/**
 * Copy code to clipboard
 */
export async function copyCodeToClipboard(code: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(code);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Export single file code
 */
export function exportCodeFile(code: string, filename: string, mimeType: string = 'text/typescript'): void {
  downloadFile(code, filename, mimeType);
}

/**
 * Generate download link for code
 */
export function generateCodeDownloadLink(code: string, filename: string): string {
  const blob = new Blob([code], { type: 'text/typescript' });
  return URL.createObjectURL(blob);
}

/**
 * Export app configuration and code together
 */
export function exportAppComplete(appConfig: AppConfig): {
  config: string;
  code: GeneratedApp;
} {
  return {
    config: StorageManager.exportApp(appConfig),
    code: generateAppCode(appConfig),
  };
}
