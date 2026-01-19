/**
 * Performance Utilities
 * 
 * Utility functions for performance optimization.
 */

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request Animation Frame throttle
 */
export function rafThrottle<T extends (...args: unknown[]) => unknown>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...args);
        rafId = null;
      });
    }
  };
}

/**
 * Memoize function result
 */
export function memoize<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  getKey?: (...args: Args) => string
): (...args: Args) => Return {
  const cache = new Map<string, Return>();
  
  return (...args: Args): Return => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Batch updates
 */
export class BatchUpdater {
  private updates: Array<() => void> = [];
  private scheduled = false;
  
  add(update: () => void): void {
    this.updates.push(update);
    this.schedule();
  }
  
  private schedule(): void {
    if (!this.scheduled) {
      this.scheduled = true;
      requestAnimationFrame(() => {
        this.flush();
      });
    }
  }
  
  flush(): void {
    this.updates.forEach((update) => update());
    this.updates = [];
    this.scheduled = false;
  }
}

/**
 * Create a batch updater instance
 */
export function createBatchUpdater(): BatchUpdater {
  return new BatchUpdater();
}

/**
 * Measure render time
 */
export function measureRenderTime<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  return { result, time: end - start };
}

/**
 * Check if should virtualize based on node/edge count
 */
export function shouldVirtualize(
  nodeCount: number,
  edgeCount: number,
  threshold: number = 100
): boolean {
  return nodeCount > threshold || edgeCount > threshold * 2;
}

/**
 * Calculate optimal batch size for updates
 */
export function calculateOptimalBatchSize(
  totalItems: number,
  targetTime: number = 16 // 60fps = 16ms per frame
): number {
  // Estimate time per item (adjust based on your use case)
  const estimatedTimePerItem = 0.1; // ms
  const optimalBatchSize = Math.floor(targetTime / estimatedTimePerItem);
  
  // Don't exceed total items
  return Math.min(optimalBatchSize, totalItems);
}
