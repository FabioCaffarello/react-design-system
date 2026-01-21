/**
 * Centralized ID Generation Utility
 *
 * Provides consistent, collision-resistant ID generation across the application.
 * Uses crypto.randomUUID() when available, with robust fallback.
 */

export class IdGenerator {
  private static counter: number = 0;

  /**
   * Generate a unique ID with optional prefix
   *
   * @param prefix - Optional prefix for the ID
   * @param length - Length of random part (default: 12)
   * @returns Unique ID string
   *
   * @example
   * IdGenerator.generate('component') // 'component-a1b2c3d4e5f6'
   * IdGenerator.generate() // 'a1b2c3d4e5f6g7h8'
   */
  static generate(prefix?: string, length: number = 12): string {
    // Prefer crypto.randomUUID() if available
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      const uuid = crypto.randomUUID();
      return prefix ? `${prefix}-${uuid}` : uuid;
    }

    // Fallback: timestamp + random + counter
    const timestamp = Date.now().toString(36);
    const randomPart = this.generateRandomString(length);
    const counterPart = (++this.counter).toString(36);

    const id = `${timestamp}-${randomPart}-${counterPart}`;
    return prefix ? `${prefix}-${id}` : id;
  }

  /**
   * Generate composite ID from multiple parts
   *
   * @param parts - String parts to join
   * @returns Composite ID with parts joined by hyphens
   *
   * @example
   * IdGenerator.composite('user', '123', 'profile') // 'user-123-profile'
   */
  static composite(...parts: (string | undefined)[]): string {
    return parts.filter(Boolean).join('-');
  }

  /**
   * Generate a short ID (for less critical use cases)
   *
   * @param length - Length of ID (default: 8)
   * @returns Short random ID
   */
  static short(length: number = 8): string {
    return this.generateRandomString(length);
  }

  /**
   * Check if an ID is valid (non-empty string)
   */
  static isValid(id: unknown): id is string {
    return typeof id === 'string' && id.length > 0;
  }

  /**
   * Extract prefix from prefixed ID
   *
   * @example
   * IdGenerator.extractPrefix('component-abc123') // 'component'
   */
  static extractPrefix(id: string): string | null {
    const match = id.match(/^([a-z]+)-/i);
    return match ? match[1] : null;
  }

  private static generateRandomString(length: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = '';

    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      // Use crypto for better randomness
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
      }
    } else {
      // Fallback to Math.random()
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    return result;
  }

  /**
   * Reset counter (useful for testing)
   */
  static resetCounter(): void {
    this.counter = 0;
  }
}
