---
name: component-patterns
description: React component patterns used in this design system
license: MIT
compatibility: opencode
metadata:
  domain: react
  framework: typescript
---

# Component Patterns Skill

This skill provides knowledge about React component patterns used in this design system.

## Component Template

```typescript
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { getColorClass, getSpacingClass, getRadiusClass } from '../../tokens'
import { cn } from '../../utils'

const componentVariants = cva(
  cn(
    'base-classes',
    getSpacingClass('md', 'p'),
    getRadiusClass('md')
  ),
  {
    variants: {
      variant: {
        default: cn(
          getColorClass('primary', 'DEFAULT', 'bg'),
          getColorClass('primary', 'contrast', 'text')
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

export interface ComponentNameProps
  extends React.ComponentProps<'div'>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

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

Use CVA for variant management.

### 2. Design Tokens

Always use design tokens, never hardcoded values.

### 3. forwardRef

Always use forwardRef for components that need ref forwarding.

### 4. TypeScript Types

Export proper TypeScript types with VariantProps.

### 5. Compound Components

Use compound component pattern for complex components.

## Design Token Usage

```typescript
// ✅ Correct
import { getColorClass, getSpacingClass } from "../../tokens";
const bgClass = getColorClass("primary", "DEFAULT", "bg");

// ❌ Wrong
const bgClass = "bg-indigo-500"; // Hardcoded
```

## File Structure

```
{ComponentName}/
├── {ComponentName}.tsx
├── {ComponentName}.test.tsx
├── {ComponentName}.stories.tsx
└── index.ts
```

## References

- Context file: `.opencode/context/design-system/component-patterns.md`
- Examples: `src/ui/atoms/Button/Button.tsx`
