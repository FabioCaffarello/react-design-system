'use client';

/**
 * useFlowPerformance Hook
 * 
 * Hook for monitoring and optimizing Flow performance.
 */

import { useFlowPerformanceContext } from '../context/FlowPerformanceContext';
import type { PerformanceMetrics, PerformanceOptions } from '../context/FlowPerformanceContext';

/**
 * Flow Performance Hook Return
 */
export interface UseFlowPerformanceReturn {
  // Metrics
  metrics: PerformanceMetrics;
  updateMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  
  // Performance state
  isOptimized: boolean;
  optimizations: {
    virtualization: boolean;
    memoization: boolean;
    lazyLoading: boolean;
  };
  
  // Operations
  optimize: () => void;
  resetOptimizations: () => void;
  
  // Monitoring
  startMonitoring: () => void;
  stopMonitoring: () => void;
  isMonitoring: boolean;
  
  // Options
  options: PerformanceOptions;
  setOptions: (options: Partial<PerformanceOptions>) => void;
  
  // Convenience methods
  shouldVirtualize: () => boolean;
  shouldLazyLoad: () => boolean;
  getPerformanceScore: () => number; // 0-100
}

/**
 * Hook for monitoring and optimizing Flow performance
 */
export function useFlowPerformance(): UseFlowPerformanceReturn {
  const context = useFlowPerformanceContext();
  
  // Convenience methods
  const shouldVirtualize = (): boolean => {
    return context.optimizations.virtualization;
  };
  
  const shouldLazyLoad = (): boolean => {
    return context.optimizations.lazyLoading;
  };
  
  const getPerformanceScore = (): number => {
    // Calculate performance score based on metrics
    let score = 100;
    
    // Penalize for high render time
    if (context.metrics.renderTime > 100) {
      score -= 20;
    } else if (context.metrics.renderTime > 50) {
      score -= 10;
    }
    
    // Penalize for high node/edge count
    if (context.metrics.nodeCount > (context.options.maxNodes || 1000)) {
      score -= 30;
    } else if (context.metrics.nodeCount > (context.options.maxNodes || 1000) * 0.8) {
      score -= 15;
    }
    
    // Penalize for high memory usage
    if (context.metrics.memoryUsage && context.metrics.memoryUsage > 100) {
      score -= 20;
    }
    
    // Penalize for low frame rate
    if (context.metrics.frameRate && context.metrics.frameRate < 30) {
      score -= 30;
    } else if (context.metrics.frameRate && context.metrics.frameRate < 45) {
      score -= 15;
    }
    
    return Math.max(0, Math.min(100, score));
  };
  
  return {
    ...context,
    shouldVirtualize,
    shouldLazyLoad,
    getPerformanceScore,
  };
}
