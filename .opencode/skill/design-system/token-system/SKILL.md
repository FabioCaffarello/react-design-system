---
name: token-system
description: Design token system for consistent styling
license: MIT
compatibility: opencode
metadata:
  domain: design-system
  styling: tailwindcss
---

# Token System Skill

This skill provides knowledge about the design token system used in this design system.

## Token Categories

### Colors

Semantic color system with light/dark theme support.

**Usage**:

```typescript
import { getColorClass } from "../../tokens/colors";
const bgClass = getColorClass("primary", "DEFAULT", "bg");
```

### Spacing

Spacing system based on 4px base unit.

**Usage**:

```typescript
import { getSpacingClass } from "../../tokens/spacing";
const padding = getSpacingClass("md", "p");
```

### Typography

Typography system with sizes, weights, and line heights.

**Usage**:

```typescript
import { getTypographyClasses } from "../../tokens/typography";
const textClasses = getTypographyClasses("body");
```

### Shadows

Elevation system for shadows.

**Usage**:

```typescript
import { getShadowClass } from "../../tokens/shadows";
const shadow = getShadowClass("md");
```

### Radius

Border radius system.

**Usage**:

```typescript
import { getRadiusClass } from "../../tokens/radius";
const radius = getRadiusClass("md");
```

## Token Usage Rules

1. **Always use token helpers**: Never hardcode Tailwind classes
2. **Use semantic roles**: `primary`, `error`, etc., not color names
3. **Respect theme support**: Tokens work with light/dark themes
4. **Type safety**: All tokens are TypeScript typed

## Token Structure

All tokens follow the Factory Pattern for type-safety and consistency.

## References

- Context file: `.opencode/context/design-system/token-system.md`
- Token files: `src/ui/tokens/`
