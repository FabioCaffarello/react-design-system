/**
 * Flow Performance Context
 * 
 * Context for monitoring and optimizing Flow performance.
 */

'use client';

import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  renderTime: number;
  nodeCount: number;
  edgeCount: number;
  memoryUsage?: number;
  frameRate?: number;
  lastUpdate: number;
}

/**
 * Performance Options
 */
export interface PerformanceOptions {
  enableMonitoring?: boolean;
  enableOptimizations?: boolean;
  targetFrameRate?: number;
  maxNodes?: number;
  maxEdges?: number;
  virtualizationThreshold?: number;
}

/**
 * Flow Performance Context Value
 */
export interface FlowPerformanceContextValue {
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
}

const FlowPerformanceContext = createContext<FlowPerformanceContextValue | undefined>(undefined);

/**
 * Hook to access Flow Performance context
 */
export function useFlowPerformanceContext(): FlowPerformanceContextValue {
  const context = useContext(FlowPerformanceContext);
  if (context === undefined) {
    throw new Error('useFlowPerformanceContext must be used within FlowPerformanceProvider');
  }
  return context;
}

/**
 * Flow Performance Provider Props
 */
export interface FlowPerformanceProviderProps {
  children: ReactNode;
  initialOptions?: PerformanceOptions;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

/**
 * Flow Performance Provider
 * 
 * Provides performance monitoring and optimization functionality.
 */
export function FlowPerformanceProvider({
  children,
  initialOptions = {},
  onMetricsUpdate,
}: FlowPerformanceProviderProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    nodeCount: 0,
    edgeCount: 0,
    lastUpdate: Date.now(),
  });
  
  const [isMonitoring, setIsMonitoring] = useState(initialOptions.enableMonitoring ?? false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimizations, setOptimizations] = useState({
    virtualization: false,
    memoization: true,
    lazyLoading: false,
  });
  
  const [options, setOptionsState] = useState<PerformanceOptions>({
    enableMonitoring: false,
    enableOptimizations: true,
    targetFrameRate: 60,
    maxNodes: 1000,
    maxEdges: 2000,
    virtualizationThreshold: 100,
    ...initialOptions,
  });
  
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update metrics
  const updateMetrics = useCallback((newMetrics: Partial<PerformanceMetrics>) => {
    setMetrics((prev) => {
      const updated = { ...prev, ...newMetrics, lastUpdate: Date.now() };
      onMetricsUpdate?.(updated);
      return updated;
    });
  }, [onMetricsUpdate]);
  
  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (monitoringIntervalRef.current) {
      return;
    }
    
    setIsMonitoring(true);
    
    // Monitor performance periodically
    monitoringIntervalRef.current = setInterval(() => {
      if (performance.memory) {
        updateMetrics({
          memoryUsage: (performance.memory as unknown).usedJSHeapSize / 1048576, // MB
        });
      }
    }, 1000);
  }, [updateMetrics]);
  
  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
      monitoringIntervalRef.current = null;
    }
    setIsMonitoring(false);
  }, []);
  
  // Optimize
  const optimize = useCallback(() => {
    const shouldVirtualize = 
      options.enableOptimizations &&
      metrics.nodeCount > (options.virtualizationThreshold || 100);
    
    const shouldLazyLoad =
      options.enableOptimizations &&
      (metrics.nodeCount > 500 || metrics.edgeCount > 1000);
    
    setOptimizations({
      virtualization: shouldVirtualize,
      memoization: true,
      lazyLoading: shouldLazyLoad,
    });
    
    setIsOptimized(true);
  }, [options, metrics]);
  
  // Reset optimizations
  const resetOptimizations = useCallback(() => {
    setOptimizations({
      virtualization: false,
      memoization: true,
      lazyLoading: false,
    });
    setIsOptimized(false);
  }, []);
  
  // Set options
  const setOptions = useCallback((newOptions: Partial<PerformanceOptions>) => {
    setOptionsState((prev) => ({ ...prev, ...newOptions }));
  }, []);
  
  // Auto-start monitoring if enabled
  useEffect(() => {
    if (options.enableMonitoring && !isMonitoring) {
      startMonitoring();
    } else if (!options.enableMonitoring && isMonitoring) {
      stopMonitoring();
    }
    
    return () => {
      stopMonitoring();
    };
  }, [options.enableMonitoring, isMonitoring, startMonitoring, stopMonitoring]);
  
  // Auto-optimize based on metrics
  useEffect(() => {
    if (options.enableOptimizations) {
      optimize();
    }
  }, [options.enableOptimizations, metrics.nodeCount, metrics.edgeCount, optimize]);
  
  const contextValue = useMemo<FlowPerformanceContextValue>(() => ({
    metrics,
    updateMetrics,
    isOptimized,
    optimizations,
    optimize,
    resetOptimizations,
    startMonitoring,
    stopMonitoring,
    isMonitoring,
    options,
    setOptions,
  }), [
    metrics,
    updateMetrics,
    isOptimized,
    optimizations,
    optimize,
    resetOptimizations,
    startMonitoring,
    stopMonitoring,
    isMonitoring,
    options,
    setOptions,
  ]);
  
  return (
    <FlowPerformanceContext.Provider value={contextValue}>
      {children}
    </FlowPerformanceContext.Provider>
  );
}
