/**
 * Design Tokens Versioning System
 * 
 * Provides versioning and migration support for design tokens.
 * Allows tracking changes, detecting breaking changes, and generating migration guides.
 */

export interface TokenVersion {
  version: string;
  timestamp: string;
  changes: TokenChange[];
  breakingChanges: BreakingChange[];
}

export interface TokenChange {
  type: 'added' | 'modified' | 'removed' | 'deprecated';
  category: string;
  token: string;
  oldValue?: any;
  newValue?: any;
  description?: string;
}

export interface BreakingChange {
  category: string;
  token: string;
  reason: string;
  migration: string;
  severity: 'major' | 'minor' | 'patch';
}

/**
 * Current tokens version
 */
export const CURRENT_TOKENS_VERSION = '1.8.0';

/**
 * Token version history
 */
export const TOKEN_VERSIONS: TokenVersion[] = [
  {
    version: '1.8.0',
    timestamp: new Date().toISOString(),
    changes: [],
    breakingChanges: [],
  },
  // Add previous versions as needed
];

/**
 * Get version information
 */
export function getTokenVersion(version: string): TokenVersion | undefined {
  return TOKEN_VERSIONS.find((v) => v.version === version);
}

/**
 * Get all changes between two versions
 */
export function getChangesBetweenVersions(
  fromVersion: string,
  toVersion: string
): TokenChange[] {
  const from = getTokenVersion(fromVersion);
  const to = getTokenVersion(toVersion);

  if (!from || !to) {
    return [];
  }

  // Combine changes from all versions between from and to
  const changes: TokenChange[] = [];
  const fromIndex = TOKEN_VERSIONS.findIndex((v) => v.version === fromVersion);
  const toIndex = TOKEN_VERSIONS.findIndex((v) => v.version === toVersion);

  if (fromIndex === -1 || toIndex === -1) {
    return [];
  }

  for (let i = fromIndex + 1; i <= toIndex; i++) {
    changes.push(...TOKEN_VERSIONS[i].changes);
  }

  return changes;
}

/**
 * Get breaking changes between two versions
 */
export function getBreakingChangesBetweenVersions(
  fromVersion: string,
  toVersion: string
): BreakingChange[] {
  const from = getTokenVersion(fromVersion);
  const to = getTokenVersion(toVersion);

  if (!from || !to) {
    return [];
  }

  const breakingChanges: BreakingChange[] = [];
  const fromIndex = TOKEN_VERSIONS.findIndex((v) => v.version === fromVersion);
  const toIndex = TOKEN_VERSIONS.findIndex((v) => v.version === toVersion);

  if (fromIndex === -1 || toIndex === -1) {
    return [];
  }

  for (let i = fromIndex + 1; i <= toIndex; i++) {
    breakingChanges.push(...TOKEN_VERSIONS[i].breakingChanges);
  }

  return breakingChanges;
}

/**
 * Check if migration is needed
 */
export function needsMigration(currentVersion: string, targetVersion: string): boolean {
  const breakingChanges = getBreakingChangesBetweenVersions(currentVersion, targetVersion);
  return breakingChanges.length > 0;
}

/**
 * Generate migration guide
 */
export function generateMigrationGuide(
  fromVersion: string,
  toVersion: string
): string {
  const changes = getChangesBetweenVersions(fromVersion, toVersion);
  const breakingChanges = getBreakingChangesBetweenVersions(fromVersion, toVersion);

  let guide = `# Migration Guide: Tokens ${fromVersion} → ${toVersion}\n\n`;

  if (breakingChanges.length === 0) {
    guide += '✅ No breaking changes. Safe to upgrade.\n\n';
  } else {
    guide += `⚠️ **${breakingChanges.length} breaking change(s) detected**\n\n`;
    guide += `## Breaking Changes\n\n`;

    breakingChanges.forEach((change) => {
      guide += `### ${change.category}.${change.token}\n\n`;
      guide += `**Severity**: ${change.severity}\n\n`;
      guide += `**Reason**: ${change.reason}\n\n`;
      guide += `**Migration**:\n\n\`\`\`typescript\n${change.migration}\n\`\`\`\n\n`;
    });
  }

  if (changes.length > 0) {
    guide += `## All Changes\n\n`;

    const byType = changes.reduce((acc, change) => {
      if (!acc[change.type]) {
        acc[change.type] = [];
      }
      acc[change.type].push(change);
      return acc;
    }, {} as Record<string, TokenChange[]>);

    Object.entries(byType).forEach(([type, changes]) => {
      guide += `### ${type.charAt(0).toUpperCase() + type.slice(1)}\n\n`;
      changes.forEach((change) => {
        guide += `- **${change.category}.${change.token}**`;
        if (change.description) {
          guide += `: ${change.description}`;
        }
        guide += `\n`;
      });
      guide += `\n`;
    });
  }

  return guide;
}

/**
 * Validate token compatibility
 */
export function validateTokenCompatibility(
  token: string,
  category: string,
  version: string
): boolean {
  const versionInfo = getTokenVersion(version);
  if (!versionInfo) {
    return false;
  }

  // Check if token was removed or deprecated in this version
  const removed = versionInfo.changes.some(
    (change) =>
      change.category === category &&
      change.token === token &&
      (change.type === 'removed' || change.type === 'deprecated')
  );

  return !removed;
}
