/**
 * Reusable sorting comparator functions
 */

export type OrderableItem = {
  metadata?: {
    order?: number;
  };
};

/**
 * Compare items by metadata.order
 * Items without order are placed at the end
 */
export function compareByOrder<T extends OrderableItem>(a: T, b: T): number {
  const orderA = a.metadata?.order ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.metadata?.order ?? Number.MAX_SAFE_INTEGER;
  return orderA - orderB;
}

/**
 * Compare strings alphabetically (case-insensitive)
 */
export function compareByName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}

/**
 * Compare by multiple criteria
 *
 * @example
 * items.sort(compareByMultiple(
 *   compareByOrder,
 *   compareByName
 * ))
 */
export function compareByMultiple<T>(...comparators: Array<(a: T, b: T) => number>) {
  return (a: T, b: T): number => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
}
