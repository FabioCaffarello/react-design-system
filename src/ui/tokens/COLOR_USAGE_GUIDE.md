# Color Usage Guide

## Overview

This guide defines the strategic use of color tokens across the design system. Colors are used semantically to convey meaning and create visual hierarchy.

## Color Roles

### Primary
**Purpose**: Main actions, important links, primary CTAs

**Usage**:
- Primary action buttons
- Important links
- Key navigation elements
- Brand elements

**Example**:
```tsx
<Button variant="primary">Save Changes</Button>
```

### Secondary
**Purpose**: Accents, active states, highlights (pink/rose in playground)

**Usage**:
- Active tab indicators
- Accent elements
- Secondary actions
- Interactive highlights

**Example**:
```tsx
className={getColorClass('secondary', 'DEFAULT', 'bg')}
```

### Success
**Purpose**: Validation, confirmations, positive feedback

**Usage**:
- Success messages
- Validation indicators
- Confirmation states
- Positive feedback

**Example**:
```tsx
<Badge variant="success">Valid</Badge>
```

### Warning
**Purpose**: Warnings, pending states, attention needed

**Usage**:
- Warning messages
- Pending states
- Attention indicators
- Caution states

**Example**:
```tsx
<Badge variant="warning">Unsaved</Badge>
```

### Error
**Purpose**: Errors, critical states, destructive actions

**Usage**:
- Error messages
- Critical states
- Destructive actions
- Failure indicators

**Example**:
```tsx
<Badge variant="error">Error</Badge>
```

### Info
**Purpose**: Information, tooltips, neutral information

**Usage**:
- Information messages
- Tooltips
- Help text
- Neutral information

**Example**:
```tsx
<Tooltip>Information</Tooltip>
```

### Neutral
**Purpose**: Text, borders, backgrounds, default states

**Usage**:
- Body text
- Borders
- Backgrounds
- Default states
- Disabled states

**Example**:
```tsx
className={getColorClass('neutral', 'DEFAULT', 'text')}
```

## Color Shades

Each color role has three shades:

- **light**: Lighter variant, used for backgrounds, hover states
- **DEFAULT**: Standard variant, used for primary elements
- **dark**: Darker variant, used for emphasis, active states
- **contrast**: Contrast color for text on colored backgrounds

## Usage Patterns

### States

#### Active State
```tsx
className={isActive 
  ? `${getColorClass('secondary', 'DEFAULT', 'bg')} ${getColorClass('secondary', 'contrast', 'text')}`
  : 'hover:bg-gray-100'
}
```

#### Hover State
```tsx
className={`hover:${getColorClass('primary', 'light', 'bg')}`}
```

#### Disabled State
```tsx
className={`${getColorClass('neutral', 'DEFAULT', 'text')} opacity-50`}
```

### Contexts

#### Buttons
- Primary actions: `primary`
- Secondary actions: `secondary` or `outline`
- Destructive: `error`
- Neutral: `neutral`

#### Badges
- Success: `success`
- Warning: `warning`
- Error: `error`
- Info: `info`
- Default: `neutral`

#### Borders
- Default: `neutral`
- Active: `primary` or `secondary`
- Error: `error`

#### Backgrounds
- Default: `neutral` (light)
- Active: `primary` or `secondary` (light)
- Hover: `neutral` or `primary` (light)

## Best Practices

1. **Consistency**: Always use color tokens, never hardcode colors
2. **Semantic Meaning**: Use colors that match their semantic meaning
3. **Contrast**: Ensure sufficient contrast for accessibility (WCAG AA minimum)
4. **Hierarchy**: Use color to establish visual hierarchy
5. **States**: Use consistent color patterns for states (active, hover, disabled)

## Anti-Patterns

❌ **Don't**: Hardcode colors
```tsx
className="bg-pink-500" // ❌
```

✅ **Do**: Use tokens
```tsx
className={getColorClass('secondary', 'DEFAULT', 'bg')} // ✅
```

❌ **Don't**: Use wrong semantic meaning
```tsx
<Button className={getColorClass('error', 'DEFAULT', 'bg')}>Save</Button> // ❌
```

✅ **Do**: Use appropriate semantic meaning
```tsx
<Button className={getColorClass('primary', 'DEFAULT', 'bg')}>Save</Button> // ✅
```

## Theme Support

Colors automatically adapt to light/dark themes through the `ColorStrategy` pattern. The system uses:
- `LightColorStrategy` for light theme
- `DarkColorStrategy` for dark theme

Colors are generated at runtime and cached for performance.

## Migration Guide

When migrating from hardcoded colors to tokens:

1. Identify hardcoded color values
2. Determine appropriate color role
3. Replace with `getColorClass()` or `getColor()`
4. Test in both light and dark themes
5. Verify accessibility contrast

## Examples

### Tab Navigation
```tsx
<Tabs.Trigger
  className={isActive 
    ? `${getColorClass('secondary', 'DEFAULT', 'bg')} ${getColorClass('secondary', 'contrast', 'text')}`
    : 'hover:bg-gray-100'
  }
>
  Tab Label
</Tabs.Trigger>
```

### Status Badge
```tsx
<Badge
  className={`
    ${getColorClass(status === 'success' ? 'success' : 'error', 'DEFAULT', 'bg')}
    ${getColorClass(status === 'success' ? 'success' : 'error', 'contrast', 'text')}
  `}
>
  {status}
</Badge>
```

### Border
```tsx
<div
  className={`
    border
    ${getColorClass('neutral', 'DEFAULT', 'border')}
  `}
>
  Content
</div>
```
