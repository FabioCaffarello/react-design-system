/**
 * Shallow equality comparison function
 * 
 * Compares two values using shallow equality (only first level of properties).
 * Useful for comparing objects/arrays in React hooks.
 * 
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns True if values are shallowly equal
 * 
 * @example
 * ```tsx
 * shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
 * shallowEqual({ a: 1, b: { c: 3 } }, { a: 1, b: { c: 3 } }); // false (nested object)
 * shallowEqual([1, 2, 3], [1, 2, 3]); // true
 * ```
 */
export function shallowEqual<T>(a: T, b: T): boolean {
  // Same reference
  if (a === b) {
    return true;
  }
  
  // Null/undefined check
  if (a == null || b == null) {
    return false;
  }
  
  // Type check
  if (typeof a !== typeof b) {
    return false;
  }
  
  // Primitive types
  if (typeof a !== 'object') {
    return a === b;
  }
  
  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    
    return true;
  }
  
  // Objects
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    
    if (keysA.length !== keysB.length) {
      return false;
    }
    
    for (const key of keysA) {
      if (!(key in (b as Record<string, unknown>))) {
        return false;
      }
      
      if ((a as Record<string, unknown>)[key] !== (b as Record<string, unknown>)[key]) {
        return false;
      }
    }
    
    return true;
  }
  
  return false;
}
