'use client';

/**
 * useFlowViewport Hook
 * 
 * Hook for viewport management (zoom, pan, fit view).
 */

import { useCallback, useEffect, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { XYPosition, FitViewOptions } from '@xyflow/react';

/**
 * Flow Viewport Hook Return
 */
export interface UseFlowViewportReturn {
  // Viewport state
  viewport: { x: number; y: number; zoom: number };
  isInitialized: boolean;
  
  // Zoom operations
  zoomIn: (options?: { duration?: number }) => void;
  zoomOut: (options?: { duration?: number }) => void;
  zoomTo: (zoomLevel: number, options?: { duration?: number }) => void;
  getZoom: () => number;
  setZoom: (zoom: number) => void;
  
  // Pan operations
  panTo: (position: XYPosition, options?: { duration?: number }) => void;
  panBy: (delta: XYPosition, options?: { duration?: number }) => void;
  getCenter: () => XYPosition;
  setCenter: (x: number, y: number, options?: { duration?: number }) => void;
  
  // Fit view
  fitView: (options?: FitViewOptions) => void;
  fitBounds: (bounds: { x: number; y: number; width: number; height: number }, options?: FitViewOptions) => void;
  
  // Viewport operations
  getViewport: () => { x: number; y: number; zoom: number };
  setViewport: (viewport: { x: number; y: number; zoom: number }, options?: { duration?: number }) => void;
  resetViewport: () => void;
  
  // Screen/Flow coordinate conversion
  screenToFlowPosition: (screenPosition: XYPosition) => XYPosition;
  flowToScreenPosition: (flowPosition: XYPosition) => XYPosition;
}

/**
 * Hook for viewport management
 */
export function useFlowViewport(): UseFlowViewportReturn {
  const reactFlowInstance = useReactFlow();
  const [viewport, setViewportState] = useState({ x: 0, y: 0, zoom: 1 });
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Update viewport state when it changes
  useEffect(() => {
    if (reactFlowInstance) {
      const currentViewport = reactFlowInstance.getViewport();
      setViewportState(currentViewport);
      setIsInitialized(true);
    }
  }, [reactFlowInstance]);
  
  // Zoom operations
  const zoomIn = useCallback((options?: { duration?: number }) => {
    reactFlowInstance.zoomIn(options);
    const newViewport = reactFlowInstance.getViewport();
    setViewportState(newViewport);
  }, [reactFlowInstance]);
  
  const zoomOut = useCallback((options?: { duration?: number }) => {
    reactFlowInstance.zoomOut(options);
    const newViewport = reactFlowInstance.getViewport();
    setViewportState(newViewport);
  }, [reactFlowInstance]);
  
  const zoomTo = useCallback((zoomLevel: number, options?: { duration?: number }) => {
    reactFlowInstance.zoomTo(zoomLevel, options);
    const newViewport = reactFlowInstance.getViewport();
    setViewportState(newViewport);
  }, [reactFlowInstance]);
  
  const getZoom = useCallback((): number => {
    return reactFlowInstance.getZoom();
  }, [reactFlowInstance]);
  
  const setZoom = useCallback((zoom: number) => {
    reactFlowInstance.setZoom(zoom);
    const newViewport = reactFlowInstance.getViewport();
    setViewportState(newViewport);
  }, [reactFlowInstance]);
  
  // Pan operations
  const panTo = useCallback((position: XYPosition, options?: { duration?: number }) => {
    reactFlowInstance.setCenter(position.x, position.y, options);
    const newViewport = reactFlowInstance.getViewport();
    setViewportState(newViewport);
  }, [reactFlowInstance]);
  
  const panBy = useCallback((delta: XYPosition, options?: { duration?: number }) => {
    const currentViewport = reactFlowInstance.getViewport();
    reactFlowInstance.setCenter(
      currentViewport.x + delta.x,
      currentViewport.y + delta.y,
      options
    );
    const newViewport = reactFlowInstance.getViewport();
    setViewportState(newViewport);
  }, [reactFlowInstance]);
  
  const getCenter = useCallback((): XYPosition => {
    return reactFlowInstance.getCenter();
  }, [reactFlowInstance]);
  
  const setCenter = useCallback((x: number, y: number, options?: { duration?: number }) => {
    reactFlowInstance.setCenter(x, y, options);
    const newViewport = reactFlowInstance.getViewport();
    setViewportState(newViewport);
  }, [reactFlowInstance]);
  
  // Fit view
  const fitView = useCallback((options?: FitViewOptions) => {
    reactFlowInstance.fitView(options);
    const newViewport = reactFlowInstance.getViewport();
    setViewportState(newViewport);
  }, [reactFlowInstance]);
  
  const fitBounds = useCallback((bounds: { x: number; y: number; width: number; height: number }, options?: FitViewOptions) => {
    reactFlowInstance.fitBounds(
      { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height },
      options
    );
    const newViewport = reactFlowInstance.getViewport();
    setViewportState(newViewport);
  }, [reactFlowInstance]);
  
  // Viewport operations
  const getViewport = useCallback(() => {
    return reactFlowInstance.getViewport();
  }, [reactFlowInstance]);
  
  const setViewport = useCallback((newViewport: { x: number; y: number; zoom: number }, options?: { duration?: number }) => {
    reactFlowInstance.setViewport(newViewport, options);
    setViewportState(newViewport);
  }, [reactFlowInstance]);
  
  const resetViewport = useCallback(() => {
    reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 });
    setViewportState({ x: 0, y: 0, zoom: 1 });
  }, [reactFlowInstance]);
  
  // Coordinate conversion
  const screenToFlowPosition = useCallback((screenPosition: XYPosition): XYPosition => {
    return reactFlowInstance.screenToFlowPosition(screenPosition);
  }, [reactFlowInstance]);
  
  const flowToScreenPosition = useCallback((flowPosition: XYPosition): XYPosition => {
    return reactFlowInstance.flowToScreenPosition(flowPosition);
  }, [reactFlowInstance]);
  
  return {
    viewport,
    isInitialized,
    zoomIn,
    zoomOut,
    zoomTo,
    getZoom,
    setZoom,
    panTo,
    panBy,
    getCenter,
    setCenter,
    fitView,
    fitBounds,
    getViewport,
    setViewport,
    resetViewport,
    screenToFlowPosition,
    flowToScreenPosition,
  };
}
