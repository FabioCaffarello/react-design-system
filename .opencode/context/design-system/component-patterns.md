# Component Patterns

This document describes the standard patterns and conventions for creating components in this React design system.

## Component Template

All components follow this structure:

```typescript
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { getColorClass, getSpacingClass, getRadiusClass } from '../../tokens'
import { getTypographyClasses } from '../../tokens/typography'
import { cn } from '../../utils'

// Variant definition using CVA
const componentVariants = cva(
  // Base classes
  cn(
    'inline-flex',
    'items-center',
    'justify-center',
    getSpacingClass('md', 'p'),
    getRadiusClass('md'),
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ),
  {
    variants: {
      variant: {
        default: cn(
          getColorClass('primary', 'DEFAULT', 'bg'),
          getColorClass('primary', 'contrast', 'text')
        ),
        secondary: cn(
          getColorClass('secondary', 'DEFAULT', 'bg'),
          getColorClass('secondary', 'contrast', 'text')
        ),
      },
      size: {
        sm: getSpacingClass('sm', 'p'),
        md: getSpacingClass('md', 'p'),
        lg: getSpacingClass('lg', 'p'),
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

// Props interface
export interface ComponentNameProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

// Component with forwardRef
export const ComponentName = forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)

ComponentName.displayName = 'ComponentName'
```

## Key Patterns

### 1. CVA (Class Variance Authority)

Use CVA for variant management:

```typescript
import { cva } from "class-variance-authority";

const variants = cva("base-classes", {
  variants: {
    variant: {
      /* ... */
    },
    size: {
      /* ... */
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
```

### 2. Design Tokens

**Always use design tokens**, never hardcoded values:

```typescript
// ✅ Correct
import { getColorClass, getSpacingClass, getRadiusClass } from "../../tokens";
const bgClass = getColorClass("primary", "DEFAULT", "bg");
const padding = getSpacingClass("md", "p");

// ❌ Wrong
const bgClass = "bg-indigo-500"; // Hardcoded
const padding = "p-3"; // Hardcoded
```

### 3. forwardRef

Always use `forwardRef` for components that need ref forwarding:

```typescript
export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ ...props }, ref) => {
    return <div ref={ref} {...props} />
  }
)

Component.displayName = 'Component'
```

### 4. TypeScript Types

Export proper TypeScript types:

```typescript
export interface ComponentProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof componentVariants> {
  // Additional props
}
```

### 5. JSDoc Comments

Include JSDoc for complex components:

````typescript
/**
 * ComponentName Component
 *
 * Description of what the component does.
 *
 * @example
 * ```tsx
 * <ComponentName variant="primary" size="md" />
 * ```
 */
````

## Compound Components Pattern

For complex components, use compound component pattern:

```typescript
// Parent
export const Tabs = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState(0)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  )
}

// Children
Tabs.List = TabsList
Tabs.Tab = Tab
Tabs.Panel = TabPanel
```

## Controlled Components

For form components, support both controlled and uncontrolled:

```typescript
export interface ControlledInputProps {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

export const ControlledInput = ({
  value,
  defaultValue,
  onChange
}: ControlledInputProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const currentValue = value !== undefined ? value : internalValue

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  return <input value={currentValue} onChange={handleChange} />
}
```

## Accessibility Patterns

Always include accessibility attributes:

```typescript
<div
  role="button"
  aria-label="Action description"
  aria-disabled={disabled}
  tabIndex={disabled ? -1 : 0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick?.()
    }
  }}
>
```

## File Exports

Always export from `index.ts`:

```typescript
// index.ts
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps } from "./ComponentName";
```

## Examples

See existing components for reference:

- Atoms: `src/ui/atoms/Button/Button.tsx`
- Molecules: `src/ui/molecules/Card/Card.tsx`
- Organisms: `src/ui/organisms/Dialog/Dialog.tsx`
