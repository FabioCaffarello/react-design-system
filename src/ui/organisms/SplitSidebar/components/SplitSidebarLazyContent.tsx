'use client';

import React, { lazy, Suspense, type ReactNode } from 'react';
import { Spinner } from '../../../atoms';
import SplitSidebarContent from '../SplitSidebar';

export interface SplitSidebarLazyContentProps {
  /**
   * Lazy load function that returns a component
   */
  lazyLoad: () => Promise<{ default: React.ComponentType<any> }>;
  
  /**
   * Props to pass to SplitSidebar.Content
   */
  contentProps?: {
    title?: string;
    showHeader?: boolean;
    scrollable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
  };
  
  /**
   * Fallback component while loading
   */
  fallback?: ReactNode;
  
  /**
   * Props to pass to the lazy-loaded component
   */
  componentProps?: Record<string, any>;
}

/**
 * SplitSidebar Lazy Content Component
 * 
 * Wrapper for lazy loading SplitSidebar.Content.
 * Useful for code splitting and performance optimization.
 * 
 * @example
 * ```tsx
 * <SplitSidebar.LazyContent
 *   lazyLoad={() => import('./HeavyContent')}
 *   contentProps={{ title: 'Settings' }}
 * />
 * ```
 */
export default function SplitSidebarLazyContent({
  lazyLoad,
  contentProps = {},
  fallback,
  componentProps = {},
}: SplitSidebarLazyContentProps) {
  const LazyComponent = lazy(lazyLoad);
  
  const defaultFallback = (
    <div className="flex items-center justify-center h-full">
      <Spinner size="lg" />
    </div>
  );

  return (
    <SplitSidebarContent {...contentProps} loading={false}>
      <Suspense fallback={fallback || defaultFallback}>
        <LazyComponent {...componentProps} />
      </Suspense>
    </SplitSidebarContent>
  );
}
