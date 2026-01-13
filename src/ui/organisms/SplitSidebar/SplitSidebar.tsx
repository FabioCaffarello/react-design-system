'use client';

import React, { type ReactNode, type HTMLAttributes, createContext, useContext, useState, useCallback, useRef, useMemo, useEffect, memo, Children, isValidElement } from 'react';
import SidebarNavigation from '../../molecules/SidebarNavigation/SidebarNavigation';
import SidebarContent from '../../molecules/SidebarContent/SidebarContent';
import { 
  getColorClass, 
  getShadowClass 
} from '../../tokens';
import { SIDEBAR_TOKENS } from '../../tokens/sidebar';
import { useCollapsible } from '../../hooks/useCollapsible';
import { useResponsiveSidebar } from './hooks/useResponsiveSidebar';
import { useResize } from './hooks/useResize';
import { useFocusManagement } from './hooks/useFocusManagement';
import { SplitSidebarToggle, SplitSidebarResizeHandle, SplitSidebarLazyContent } from './components';
import { ErrorMessage, Spinner } from '../../atoms';

export interface SplitSidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
  width?: number;
  isMobile?: boolean;
  isResizing?: boolean;
}

export const SplitSidebarContext = createContext<SplitSidebarContextValue | null>(null);

function useSplitSidebarContext() {
  const context = useContext(SplitSidebarContext);
  if (!context) {
    throw new Error('SplitSidebar subcomponents must be used within SplitSidebar.Root');
  }
  return context;
}

export interface SplitSidebarProps extends HTMLAttributes<HTMLAsideElement> {
  /**
   * Initial collapsed state (uncontrolled mode)
   * @default false
   */
  defaultCollapsed?: boolean;
  
  /**
   * Controlled collapsed state
   */
  collapsed?: boolean;
  
  /**
   * Callback when collapse state changes
   */
  onCollapseChange?: (collapsed: boolean) => void;
  
  /**
   * Whether the sidebar can be collapsed
   * @default true
   */
  collapsible?: boolean;
  
  /**
   * Total width of the sidebar
   * @default '320px'
   */
  width?: number | string;
  
  /**
   * Width of the navigation column
   * @default '56px'
   */
  navigationWidth?: number | string;
  
  /**
   * Variant of the sidebar
   * @default 'default'
   */
  variant?: 'default' | 'compact' | 'minimal' | 'elevated' | 'bordered';
  
  /**
   * Whether responsive behavior is enabled
   * @default false
   */
  responsive?: boolean;
  
  /**
   * Breakpoint in pixels for mobile detection
   * @default 768
   */
  mobileBreakpoint?: number;
  
  /**
   * Mobile variant behavior
   * @default 'overlay'
   */
  mobileVariant?: 'overlay' | 'push' | 'collapse';
  
  /**
   * Whether to show backdrop in mobile overlay mode
   * @default true
   */
  overlayBackdrop?: boolean;
  
  /**
   * Callback when mobile state changes
   */
  onMobileChange?: (isMobile: boolean) => void;
  
  /**
   * Storage key for persistence (localStorage)
   */
  storageKey?: string;
  
  /**
   * Persistence type
   * @default 'localStorage'
   */
  persistState?: 'localStorage' | 'sessionStorage' | false;
  
  /**
   * Whether to persist width
   * @default false
   */
  persistWidth?: boolean;
  
  /**
   * Whether sidebar is resizable
   * @default false
   */
  resizable?: boolean;
  
  /**
   * Minimum width constraint
   */
  minWidth?: number | string;
  
  /**
   * Maximum width constraint
   */
  maxWidth?: number | string;
  
  /**
   * Snap points (widths to snap to when dragging)
   */
  snapPoints?: number[];
  
  /**
   * Callback when width changes
   */
  onWidthChange?: (width: number) => void;
  
  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;
  
  /**
   * Animation easing function
   * @default 'ease-in-out'
   */
  animationEasing?: string;
  
  /**
   * Whether animations are enabled
   * @default true
   */
  enableAnimations?: boolean;
  
  /**
   * Children (should include SplitSidebar.Navigation and SplitSidebar.Content)
   */
  children: ReactNode;
}

interface SplitSidebarNavigationProps {
  children: ReactNode;
}

interface SplitSidebarContentProps {
  title?: string;
  showHeader?: boolean;
  scrollable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Empty state
   */
  empty?: boolean;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Error state
   */
  error?: Error | null;
  /**
   * Retry callback for error state
   */
  onRetry?: () => void;
  children: ReactNode;
}

interface SplitSidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Padding size for the footer
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /**
   * Whether to show border top
   * @default true
   */
  showBorder?: boolean;
  
  /**
   * Footer content
   */
  children: ReactNode;
}

/**
 * SplitSidebar Root Component
 * 
 * Main component that combines narrow navigation + content area.
 * Supports collapsible navigation with smooth transitions, responsiveness,
 * persistence, resize, and advanced accessibility.
 * 
 * @example
 * ```tsx
 * <SplitSidebar width="320px" navigationWidth="56px">
 *   <SplitSidebar.Navigation>
 *     <Tabs>...</Tabs>
 *   </SplitSidebar.Navigation>
 *   <SplitSidebar.Content title="Settings">
 *     <div>Content here</div>
 *   </SplitSidebar.Content>
 * </SplitSidebar>
 * ```
 */
function SplitSidebarRoot({
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapseChange,
  collapsible = true,
  width = '320px',
  navigationWidth = SIDEBAR_TOKENS.navigation.width.default,
  variant = 'default',
  responsive = false,
  mobileBreakpoint = 768,
  mobileVariant = 'overlay',
  overlayBackdrop = true,
  onMobileChange,
  storageKey,
  persistState = storageKey ? 'localStorage' : false,
  persistWidth = false,
  resizable = false,
  minWidth,
  maxWidth,
  snapPoints,
  onWidthChange,
  animationDuration = 300,
  animationEasing = 'ease-in-out',
  enableAnimations = true,
  children,
  className = '',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: SplitSidebarProps) {
  const containerRef = useRef<HTMLElement>(null);
  
  // Responsive behavior
  const { isMobile } = useResponsiveSidebar({
    mobileBreakpoint,
    onMobileChange,
    enabled: responsive,
  });

  // Parse width to number for resize functionality
  const parseWidth = (w: number | string): number => {
    if (typeof w === 'number') return w;
    const match = w.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 320;
  };

  const initialWidthNum = parseWidth(width);
  const [currentWidth, setCurrentWidth] = useState(initialWidthNum);

  // Load persisted width
  useEffect(() => {
    if (persistWidth && storageKey && typeof window !== 'undefined') {
      const storage = persistState === 'sessionStorage' ? sessionStorage : localStorage;
      const stored = storage.getItem(`${storageKey}-width`);
      if (stored) {
        const parsedWidth = parseInt(stored, 10);
        if (!isNaN(parsedWidth)) {
          setCurrentWidth(parsedWidth);
        }
      }
    }
  }, [persistWidth, storageKey, persistState]);

  // Persist width changes
  useEffect(() => {
    if (persistWidth && storageKey && typeof window !== 'undefined') {
      const storage = persistState === 'sessionStorage' ? sessionStorage : localStorage;
      storage.setItem(`${storageKey}-width`, String(currentWidth));
    }
  }, [currentWidth, persistWidth, storageKey, persistState]);

  // Resize functionality
  const minWidthNum = minWidth ? parseWidth(minWidth) : undefined;
  const maxWidthNum = maxWidth ? parseWidth(maxWidth) : undefined;

  const { width: resizeWidth, isResizing, setWidth: setResizeWidth } = useResize({
    initialWidth: currentWidth,
    minWidth: minWidthNum,
    maxWidth: maxWidthNum,
    snapPoints,
    onWidthChange: (newWidth) => {
      setCurrentWidth(newWidth);
      onWidthChange?.(newWidth);
    },
    enabled: resizable && !isMobile,
  });

  // Use resize width if resizable, otherwise use currentWidth
  const effectiveWidth = resizable && !isMobile ? resizeWidth : currentWidth;

  // Collapsible state with persistence
  const collapsibleStorageKey = storageKey && persistState ? `${storageKey}-collapsed` : undefined;
  const { isOpen, toggle, setOpen } = useCollapsible({
    defaultOpen: !defaultCollapsed,
    open: controlledCollapsed !== undefined ? !controlledCollapsed : undefined,
    onOpenChange: (open) => {
      onCollapseChange?.(!open);
    },
    storageKey: collapsibleStorageKey,
  });

  const isCollapsed = !isOpen;
  
  // Auto-collapse on mobile if responsive
  useEffect(() => {
    if (responsive && isMobile && mobileVariant === 'collapse' && !isCollapsed) {
      setOpen(false);
    }
  }, [responsive, isMobile, mobileVariant, isCollapsed, setOpen]);

  const handleToggle = useCallback(() => {
    toggle();
  }, [toggle]);
  
  const handleSetCollapsed = useCallback((collapsed: boolean) => {
    setOpen(!collapsed);
  }, [setOpen]);

  // Focus management for mobile overlay
  useFocusManagement({
    isActive: responsive && isMobile && mobileVariant === 'overlay' && !isCollapsed,
    containerRef: containerRef as React.RefObject<HTMLElement>,
    restoreFocus: true,
  });

  // Variant classes
  const variantClasses = useMemo(() => {
    const variants: Record<string, string> = {
      default: '',
      compact: 'p-2',
      minimal: 'border-0 shadow-none',
      elevated: 'shadow-lg',
      bordered: 'border-2',
    };
    return variants[variant] || '';
  }, [variant]);

  // Animation styles
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shouldAnimate = enableAnimations && !prefersReducedMotion;
  const transitionStyle = shouldAnimate
    ? {
        transitionDuration: `${animationDuration}ms`,
        transitionTimingFunction: animationEasing,
      }
    : {};

  // Calculate sidebar width: when collapsed, only show navigation width
  const sidebarWidth = isCollapsed && collapsible 
    ? parseWidth(navigationWidth)
    : effectiveWidth;
  const widthValue = typeof width === 'number' ? `${sidebarWidth}px` : `${sidebarWidth}px`;

  // Mobile overlay classes
  const mobileOverlayClasses = responsive && isMobile && mobileVariant === 'overlay'
    ? `
      fixed
      top-0
      left-0
      h-full
      z-50
      ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}
    `
    : '';

  const contextValue: SplitSidebarContextValue = {
    collapsed: isCollapsed,
    toggle: handleToggle,
    setCollapsed: handleSetCollapsed,
    width: effectiveWidth,
    isMobile,
    isResizing,
  };

  // Separate children into Navigation, Content, and Footer
  // We'll check by component name/displayName since components are defined later
  const { navigation, content, footer, other } = useMemo(() => {
    const nav: ReactNode[] = [];
    const cont: ReactNode[] = [];
    const foot: ReactNode[] = [];
    const rest: ReactNode[] = [];

    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.type) {
        const componentName = (child.type as any)?.displayName || (child.type as any)?.name || '';
        // Check if it's a compound component by name
        if (componentName.includes('SplitSidebarNavigation') || componentName === 'SplitSidebarNavigation') {
          nav.push(child);
        } else if (componentName.includes('SplitSidebarContent') || componentName === 'SplitSidebarContent') {
          cont.push(child);
        } else if (componentName.includes('SplitSidebarFooter') || componentName === 'SplitSidebarFooter') {
          foot.push(child);
        } else {
          rest.push(child);
        }
      } else {
        rest.push(child);
      }
    });

    return {
      navigation: nav,
      content: cont,
      footer: foot,
      other: rest,
    };
  }, [children]);

  return (
    <>
      {/* Backdrop for mobile overlay */}
      {responsive && isMobile && mobileVariant === 'overlay' && overlayBackdrop && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleToggle}
          aria-hidden="true"
        />
      )}
      
      <SplitSidebarContext.Provider value={contextValue}>
        <aside
          ref={containerRef}
          id="split-sidebar"
          className={`
            border-r
            ${getColorClass('neutral', 'DEFAULT', 'border')}
            flex
            flex-col
            h-full
            ${getShadowClass('md')}
            overflow-hidden
            ${shouldAnimate ? SIDEBAR_TOKENS.split.transition : ''}
            ${variantClasses}
            ${mobileOverlayClasses}
            ${className}
          `}
          style={{
            width: widthValue,
            height: '100%',
            ...transitionStyle,
          }}
          role="complementary"
          aria-label={ariaLabel || 'Sidebar navigation'}
          aria-labelledby={ariaLabelledBy}
          aria-expanded={!isCollapsed}
          aria-hidden={isCollapsed && responsive && isMobile}
          {...props}
        >
          {/* Navigation and Content wrapper */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {navigation}
            <div 
              className={`
                flex flex-col
                ${shouldAnimate ? SIDEBAR_TOKENS.split.transition : ''}
                overflow-hidden
                ${isCollapsed && collapsible ? 'w-0 min-w-0' : 'flex-1 min-w-0'}
                min-h-0
              `}
              style={{
                ...(isCollapsed && collapsible 
                  ? { 
                      width: '0px', 
                      minWidth: '0px',
                      opacity: 0,
                      ...transitionStyle,
                    }
                  : { 
                      opacity: 1,
                      ...transitionStyle,
                    }
                ),
              }}
              aria-hidden={isCollapsed && collapsible}
            >
              {content}
              {footer}
            </div>
          </div>
          
          {/* Other children (for backwards compatibility) */}
          {other}
          
          {/* Resize handle */}
          {resizable && !isMobile && (
            <SplitSidebarResizeHandle
              initialWidth={effectiveWidth}
              minWidth={minWidthNum}
              maxWidth={maxWidthNum}
              snapPoints={snapPoints}
              onWidthChange={(newWidth) => {
                setResizeWidth(newWidth);
                setCurrentWidth(newWidth);
              }}
              enabled={resizable}
            />
          )}
        </aside>
      </SplitSidebarContext.Provider>
    </>
  );
}

/**
 * SplitSidebar Navigation Component
 * 
 * Renders the narrow navigation column on the left side.
 */
const SplitSidebarNavigation = memo(function SplitSidebarNavigation({ children }: SplitSidebarNavigationProps) {
  const { collapsed } = useSplitSidebarContext();
  
  // Navigation should always be visible, even when sidebar is collapsed
  // When collapsed, only navigation is visible
  return (
    <SidebarNavigation
      variant="fixed"
      collapsed={false}
      width={SIDEBAR_TOKENS.navigation.width.default}
    >
      {children}
    </SidebarNavigation>
  );
});
SplitSidebarNavigation.displayName = 'SplitSidebarNavigation';

/**
 * SplitSidebar Content Component
 * 
 * Renders the main content area on the right side.
 * Supports loading, empty, and error states.
 */
const SplitSidebarContent = memo(function SplitSidebarContent({
  title,
  showHeader = true,
  scrollable = true,
  padding = 'lg',
  loading = false,
  empty = false,
  emptyMessage = 'No content available',
  error = null,
  onRetry,
  children,
}: SplitSidebarContentProps) {
  if (loading) {
    return (
      <SidebarContent
        title={title}
        showHeader={showHeader}
        scrollable={scrollable}
        padding={padding}
      >
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" />
        </div>
      </SidebarContent>
    );
  }

  if (error) {
    return (
      <SidebarContent
        title={title}
        showHeader={showHeader}
        scrollable={scrollable}
        padding={padding}
      >
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <ErrorMessage>{error.message || 'An error occurred'}</ErrorMessage>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </SidebarContent>
    );
  }

  if (empty) {
    return (
      <SidebarContent
        title={title}
        showHeader={showHeader}
        scrollable={scrollable}
        padding={padding}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      </SidebarContent>
    );
  }

  return (
    <SidebarContent
      title={title}
      showHeader={showHeader}
      scrollable={scrollable}
      padding={padding}
    >
      {children}
    </SidebarContent>
  );
});
SplitSidebarContent.displayName = 'SplitSidebarContent';

/**
 * SplitSidebar Footer Component
 * 
 * Renders a footer section at the bottom of the sidebar content area.
 * Typically used for action buttons, status information, or additional controls.
 * 
 * @example
 * ```tsx
 * <SplitSidebar.Footer>
 *   <Button>Save</Button>
 *   <Button variant="outline">Cancel</Button>
 * </SplitSidebar.Footer>
 * ```
 */
const SplitSidebarFooter = memo(function SplitSidebarFooter({
  padding = 'md',
  showBorder = true,
  children,
  className = '',
  ...props
}: SplitSidebarFooterProps) {
  const paddingClass = padding !== 'none' 
    ? getSpacingClass(padding, 'p')
    : '';

  return (
    <div
      className={`
        shrink-0
        ${showBorder ? `border-t ${getColorClass('neutral', 'DEFAULT', 'border')}` : ''}
        ${getColorClass('neutral', 'light', 'bg')}
        transition-all duration-200
        ${paddingClass}
        ${className}
      `}
      role="contentinfo"
      aria-label="Sidebar footer"
      {...props}
    >
      {children}
    </div>
  );
});
SplitSidebarFooter.displayName = 'SplitSidebarFooter';

// Compound component structure
const SplitSidebar = SplitSidebarRoot as typeof SplitSidebarRoot & {
  Navigation: typeof SplitSidebarNavigation;
  Content: typeof SplitSidebarContent;
  Footer: typeof SplitSidebarFooter;
  Toggle: typeof SplitSidebarToggle;
  ResizeHandle: typeof SplitSidebarResizeHandle;
  LazyContent: typeof SplitSidebarLazyContent;
};

SplitSidebar.Navigation = SplitSidebarNavigation;
SplitSidebar.Content = SplitSidebarContent;
SplitSidebar.Footer = SplitSidebarFooter;
SplitSidebar.Toggle = SplitSidebarToggle;
SplitSidebar.ResizeHandle = SplitSidebarResizeHandle;
SplitSidebar.LazyContent = SplitSidebarLazyContent;

export default SplitSidebar;
export { SplitSidebar };
export type { SplitSidebarProps, SplitSidebarFooterProps };
