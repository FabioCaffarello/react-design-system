# Design Token System

This design system uses a **Factory Pattern** to create type-safe design tokens consistently.

## Token Categories

### 1. Colors (`src/ui/tokens/colors.ts`)

Semantic color system with light/dark theme support.

**Roles**: `primary`, `secondary`, `success`, `warning`, `error`, `info`, `neutral`

**Shades**: `light`, `DEFAULT`, `dark`, `contrast`

**Usage**:

```typescript
import {
  getColorClass,
  getHoverColorClass,
  getFocusRingClass,
} from "../../tokens/colors";

// Background color
const bgClass = getColorClass("primary", "DEFAULT", "bg"); // 'bg-indigo-500'

// Text color
const textClass = getColorClass("error", "dark", "text"); // 'text-red-600'

// Border color
const borderClass = getColorClass("neutral", "DEFAULT", "border"); // 'border-gray-300'

// Hover color
const hoverClass = getHoverColorClass("primary", "DEFAULT", "bg"); // 'hover:bg-indigo-600'

// Focus ring
const focusClass = getFocusRingClass("primary", "DEFAULT"); // 'focus:ring-indigo-500'
```

### 2. Spacing (`src/ui/tokens/spacing.ts`)

Spacing system based on 4px base unit.

**Scale**: `xs` (4px), `sm` (8px), `md` (12px), `base` (16px), `lg` (24px), `xl` (32px), `2xl` (40px), `3xl` (48px), `4xl` (64px), `5xl` (80px), `6xl` (96px)

**Usage**:

```typescript
import { getSpacingClass } from "../../tokens/spacing";

// Padding
const padding = getSpacingClass("md", "p"); // 'p-3'

// Margin
const margin = getSpacingClass("lg", "mx"); // 'mx-6'

// Gap
const gap = getSpacingClass("base", "gap"); // 'gap-4'
```

### 3. Typography (`src/ui/tokens/typography.ts`)

Typography system with sizes, weights, and line heights.

**Sizes**: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`

**Weights**: `light`, `normal`, `medium`, `semibold`, `bold`

**Line Heights**: `none`, `tight`, `snug`, `normal`, `relaxed`, `loose`

**Usage**:

```typescript
import {
  getTypographyClasses,
  getTypographySize,
} from "../../tokens/typography";

// Full typography classes
const textClasses = getTypographyClasses("body"); // 'text-base font-normal leading-normal'

// Size only
const sizeClass = getTypographySize("lg"); // 'text-lg'
```

### 4. Shadows (`src/ui/tokens/shadows.ts`)

Elevation system for shadows.

**Usage**:

```typescript
import { getShadowClass } from "../../tokens/shadows";

const shadow = getShadowClass("md"); // 'shadow-md'
```

### 5. Radius (`src/ui/tokens/radius.ts`)

Border radius system.

**Sizes**: `none`, `sm`, `md`, `lg`, `full`

**Usage**:

```typescript
import { getRadiusClass } from "../../tokens/radius";

const radius = getRadiusClass("md"); // 'rounded-md'
```

## Token Structure

All tokens follow the Factory Pattern:

```typescript
export interface TokenType {
  [key: string]: {
    [key: string]: {
      value: string;
      class: string;
    };
  };
}

export const TOKEN_TYPE: TokenType = {
  role1: {
    shade1: {
      value: "#hex",
      class: "tailwind-class",
    },
  },
};

export function getTokenClass(
  role: string,
  shade: string,
  type: string,
): string {
  return TOKEN_TYPE[role]?.[shade]?.class || "";
}
```

## Token Usage Rules

1. **Always use token helpers**: Never hardcode Tailwind classes
2. **Use semantic roles**: `primary`, `error`, etc., not color names
3. **Respect theme support**: Tokens work with light/dark themes
4. **Type safety**: All tokens are TypeScript typed

## Adding New Tokens

When adding new tokens:

1. Follow Factory Pattern structure
2. Add TypeScript types
3. Create helper function
4. Update token registry
5. Document usage

## Token Registry

Location: `.opencode/context/design-system/registries/tokens.json`

Auto-generated from token files for validation and documentation.

## References

- Token files: `src/ui/tokens/`
- Token README: `src/ui/tokens/README.md`
- Color usage guide: `src/ui/tokens/COLOR_USAGE_GUIDE.md`
