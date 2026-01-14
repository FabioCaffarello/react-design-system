# SideNavbar Evolution Plan - Phase 2

## Overview
This plan covers the next evolution of the SideNavbar component with four main features:
1. Edge-following toggle button
2. Slot system for dynamic sidebar content
3. Enhanced Navbar with labels and grouping
4. Navigation hooks for programmatic control

---

## Phase 1: Type Foundations

### 1.1 Update `types/index.ts`

Add new types for the enhanced features:

```typescript
// Label display modes for NavbarItem
export type NavbarLabelMode = 'tooltip' | 'inline' | 'below';

// Slot system types
export interface SlotDefinition {
  id: string;
  content: ReactNode;
}

export interface SidebarSlotContextValue {
  activeSlot: string | null;
  setActiveSlot: (slotId: string | null) => void;
  slots: Map<string, ReactNode>;
  registerSlot: (id: string, content: ReactNode) => void;
  unregisterSlot: (id: string) => void;
}

// NavbarGroup props
export interface NavbarGroupProps extends HTMLAttributes<HTMLDivElement> {
  id?: string;
  label?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  children: ReactNode;
}

// Updated NavbarItem with label support
export interface NavbarItemProps {
  // ... existing props
  labelMode?: NavbarLabelMode;
  showLabel?: boolean;
}

// Navbar expanded mode
export interface NavbarProps {
  // ... existing props
  labelMode?: NavbarLabelMode;
  expandedWidth?: number | string;
}
```

---

## Phase 2: Edge-Following Toggle

### 2.1 Update `SideNavbarRoot.tsx`

The toggle should position itself at the right edge of the visible sidebar area:
- When collapsed: right edge of navbar
- When expanded: right edge of sidebar content

**Implementation approach:**
- Use CSS variables to track the current sidebar width
- Position toggle absolutely with `right: 0` relative to sidebar container
- Add `transform: translateX(50%)` to center on edge

```typescript
// In SideNavbarRoot.tsx
const toggleStyles = {
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translate(50%, -50%)',
  zIndex: 50,
};
```

### 2.2 Update `SideNavbarToggle.tsx`

Remove position prop complexity, make edge-following the default:
- Add `floating` variant that sits on the edge
- Smooth transition when sidebar expands/collapses

---

## Phase 3: Slot System

### 3.1 Create `contexts/SidebarSlotContext.tsx`

```typescript
export interface SidebarSlotContextValue {
  activeSlot: string | null;
  setActiveSlot: (slotId: string | null) => void;
  slots: Map<string, ReactNode>;
  registerSlot: (id: string, content: ReactNode) => void;
  unregisterSlot: (id: string) => void;
}

export const SidebarSlotContext = createContext<SidebarSlotContextValue | null>(null);
export const useSidebarSlot = () => useContext(SidebarSlotContext);
export const useSidebarSlotRequired = () => {
  const context = useSidebarSlot();
  if (!context) throw new Error('useSidebarSlotRequired must be used within SidebarSlotProvider');
  return context;
};
```

### 3.2 Create `providers/SidebarSlotProvider.tsx`

```typescript
export function SidebarSlotProvider({ children, defaultSlot }: Props) {
  const [activeSlot, setActiveSlot] = useState<string | null>(defaultSlot ?? null);
  const slotsRef = useRef(new Map<string, ReactNode>());

  const registerSlot = useCallback((id: string, content: ReactNode) => {
    slotsRef.current.set(id, content);
  }, []);

  const unregisterSlot = useCallback((id: string) => {
    slotsRef.current.delete(id);
  }, []);

  return (
    <SidebarSlotContext.Provider value={{
      activeSlot,
      setActiveSlot,
      slots: slotsRef.current,
      registerSlot,
      unregisterSlot,
    }}>
      {children}
    </SidebarSlotContext.Provider>
  );
}
```

### 3.3 Create `components/Sidebar/SidebarSlot.tsx`

```typescript
export function SidebarSlot({ id, children }: { id: string; children: ReactNode }) {
  const { activeSlot, registerSlot, unregisterSlot } = useSidebarSlotRequired();

  useEffect(() => {
    registerSlot(id, children);
    return () => unregisterSlot(id);
  }, [id, children, registerSlot, unregisterSlot]);

  if (activeSlot !== id) return null;
  return <>{children}</>;
}
```

### 3.4 Create `components/Sidebar/SidebarSlotContent.tsx`

Container that renders the active slot:

```typescript
export function SidebarSlotContent({ fallback }: { fallback?: ReactNode }) {
  const { activeSlot, slots } = useSidebarSlotRequired();

  if (!activeSlot || !slots.has(activeSlot)) {
    return fallback ?? null;
  }

  return <>{slots.get(activeSlot)}</>;
}
```

---

## Phase 4: Enhanced Navbar

### 4.1 Update `NavbarItem.tsx`

Add label display modes:

```typescript
const LABEL_STYLES = {
  tooltip: '', // Uses existing tooltip behavior
  inline: 'flex-row gap-2 w-full px-3',
  below: 'flex-col gap-1',
};

export function NavbarItem({
  labelMode = 'tooltip',
  showLabel = true,
  // ... other props
}) {
  const { labelMode: contextLabelMode } = useNavbarRequired();
  const effectiveLabelMode = labelMode ?? contextLabelMode;

  // Render label based on mode
  const labelElement = effectiveLabelMode !== 'tooltip' && showLabel && label && (
    <span className={`text-xs ${effectiveLabelMode === 'below' ? 'text-center' : ''}`}>
      {label}
    </span>
  );

  // Wrap with tooltip only if mode is 'tooltip'
  // ...
}
```

### 4.2 Create `components/Navbar/NavbarGroup.tsx`

```typescript
export function NavbarGroup({
  id,
  label,
  collapsible = false,
  defaultCollapsed = false,
  children,
  className,
  ...props
}: NavbarGroupProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {label && (
        <div
          className="px-2 py-1 text-xs text-gray-500 uppercase tracking-wider"
          onClick={collapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
        >
          {label}
          {collapsible && <ChevronIcon collapsed={isCollapsed} />}
        </div>
      )}
      {!isCollapsed && (
        <div className="flex flex-col gap-1">
          {children}
        </div>
      )}
    </div>
  );
}
```

### 4.3 Update `Navbar.tsx`

Add expanded mode and label support:

```typescript
export function Navbar({
  labelMode = 'tooltip',
  expandedWidth = 200,
  showToggle,
  togglePosition,
  children,
  ...props
}: NavbarProps) {
  const { collapsed } = useSideNavbarStateRequired();

  // When labelMode is 'inline', navbar should expand
  const shouldExpand = labelMode === 'inline' && !collapsed;

  return (
    <NavbarContext.Provider value={{ labelMode, ... }}>
      <nav
        style={{
          width: shouldExpand ? expandedWidth : undefined,
        }}
        className={cn(
          'flex flex-col items-center gap-2 py-4',
          shouldExpand && 'items-stretch'
        )}
        {...props}
      >
        {children}
      </nav>
    </NavbarContext.Provider>
  );
}
```

---

## Phase 5: Navigation Hooks

### 5.1 Create `hooks/useSideNavbarNavigation.ts`

Convenience hook for navigation-related state:

```typescript
export function useSideNavbarNavigation() {
  const { activeItem, setActiveItem } = useNavbarRequired();
  const { setActiveSlot } = useSidebarSlot() ?? {};

  const navigate = useCallback((itemId: string, slotId?: string) => {
    setActiveItem(itemId);
    if (slotId && setActiveSlot) {
      setActiveSlot(slotId);
    }
  }, [setActiveItem, setActiveSlot]);

  return {
    activeItem,
    setActiveItem,
    navigate,
  };
}
```

### 5.2 Create `hooks/useSideNavbarContent.ts`

Convenience hook for content/slot management:

```typescript
export function useSideNavbarContent() {
  const slotContext = useSidebarSlot();
  const sidebarContext = useSidebar();

  return {
    activeSlot: slotContext?.activeSlot ?? null,
    setActiveSlot: slotContext?.setActiveSlot ?? (() => {}),
    scrollPosition: sidebarContext?.scrollPosition ?? 0,
    setScrollPosition: sidebarContext?.setScrollPosition ?? (() => {}),
  };
}
```

---

## Phase 6: Integration & Testing

### 6.1 Update Exports in `index.ts`

```typescript
// New context exports
export { SidebarSlotContext, useSidebarSlot, useSidebarSlotRequired } from './contexts/SidebarSlotContext';

// New provider exports
export { SidebarSlotProvider } from './providers/SidebarSlotProvider';

// New component exports
export { SidebarSlot, SidebarSlotContent } from './components/Sidebar';
export { NavbarGroup } from './components/Navbar';

// New hook exports
export { useSideNavbarNavigation, useSideNavbarContent } from './hooks';
```

### 6.2 Update Stories

Create comprehensive stories demonstrating:
- Edge-following toggle behavior
- Slot system with navigation-driven content switching
- Navbar with labels in different modes
- NavbarGroup usage

### 6.3 Update Tests

Add tests for:
- Toggle positioning at sidebar edge
- Slot registration and switching
- Label mode rendering
- NavbarGroup collapse behavior
- Navigation hooks functionality

---

## File Changes Summary

### New Files
- `src/ui/organisms/SideNavbar/contexts/SidebarSlotContext.tsx`
- `src/ui/organisms/SideNavbar/providers/SidebarSlotProvider.tsx`
- `src/ui/organisms/SideNavbar/components/Sidebar/SidebarSlot.tsx`
- `src/ui/organisms/SideNavbar/components/Sidebar/SidebarSlotContent.tsx`
- `src/ui/organisms/SideNavbar/components/Navbar/NavbarGroup.tsx`
- `src/ui/organisms/SideNavbar/hooks/useSideNavbarNavigation.ts`
- `src/ui/organisms/SideNavbar/hooks/useSideNavbarContent.ts`

### Modified Files
- `src/ui/organisms/SideNavbar/types/index.ts` - Add new types
- `src/ui/organisms/SideNavbar/components/SideNavbarRoot.tsx` - Edge toggle positioning
- `src/ui/organisms/SideNavbar/components/SideNavbarToggle.tsx` - Floating edge variant
- `src/ui/organisms/SideNavbar/components/Navbar/Navbar.tsx` - Label mode support
- `src/ui/organisms/SideNavbar/components/Navbar/NavbarItem.tsx` - Label rendering
- `src/ui/organisms/SideNavbar/components/Navbar/index.ts` - Export NavbarGroup
- `src/ui/organisms/SideNavbar/components/Sidebar/index.ts` - Export slot components
- `src/ui/organisms/SideNavbar/index.ts` - Update all exports
- `src/ui/organisms/SideNavbar/SideNavbar.stories.tsx` - New stories
- `src/ui/organisms/SideNavbar/SideNavbar.test.tsx` - New tests

---

## Implementation Order

1. **Types first** - Add all new types to establish contracts
2. **Slot system** - Context, provider, and components
3. **Edge toggle** - Update positioning logic
4. **Navbar enhancements** - Labels and groups
5. **Hooks** - Convenience hooks for external use
6. **Stories & Tests** - Documentation and validation

This order ensures each phase builds on the previous, with types defining the API before implementation.
