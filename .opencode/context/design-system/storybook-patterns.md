# Storybook Patterns

This document describes the patterns for creating Storybook stories in this design system.

## Story Format

Use **CSF3 (Component Story Format 3)**:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./ComponentName";

const meta: Meta<typeof ComponentName> = {
  title: "Design System/{Type}/{ComponentName}",
  component: ComponentName,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Component description and usage guidelines.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "error"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    // Default props
  },
};
```

## Story Categories

### 1. Default Story

Shows component with default props:

```typescript
export const Default: Story = {
  args: {
    children: "Default component",
  },
};
```

### 2. Variants Story

Shows all variants together:

```typescript
export const Variants: Story = {
  render: () => (
    <div className="flex gap-4">
      <ComponentName variant="default">Default</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="error">Error</ComponentName>
    </div>
  ),
}
```

### 3. Sizes Story

Shows all sizes together:

```typescript
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
}
```

### 4. Interactive Story

Shows user interactions:

```typescript
export const Interactive: Story = {
  args: {
    onClick: () => alert("Clicked!"),
  },
};
```

### 5. Accessibility Story

Shows accessibility features:

```typescript
export const Accessibility: Story = {
  render: () => (
    <div className="space-y-4">
      <h3>Keyboard Navigation</h3>
      <ComponentName aria-label="Accessible button" />
      <p>Use Tab to focus, Enter/Space to activate</p>
    </div>
  ),
}
```

## Meta Configuration

```typescript
const meta: Meta<typeof ComponentName> = {
  title: "Design System/{Type}/{ComponentName}", // Category path
  component: ComponentName,
  parameters: {
    layout: "centered", // or 'padded', 'fullscreen'
    docs: {
      description: {
        component: "Component description.",
      },
    },
  },
  tags: ["autodocs"], // Auto-generate docs
  argTypes: {
    // Control configuration
  },
};
```

## ArgTypes Configuration

```typescript
argTypes: {
  variant: {
    control: 'select',
    options: ['default', 'secondary', 'error'],
    description: 'Visual variant of the component',
  },
  size: {
    control: 'select',
    options: ['sm', 'md', 'lg'],
    description: 'Size of the component',
  },
  disabled: {
    control: 'boolean',
    description: 'Whether the component is disabled',
  },
}
```

## Best Practices

1. **Semantic titles**: Use `Design System/{Type}/{ComponentName}` format
2. **Include descriptions**: Help users understand usage
3. **Show all variants**: Visual comparison helps selection
4. **Add controls**: Enable interactive exploration
5. **Include examples**: Real-world usage patterns
6. **Accessibility showcase**: Demonstrate a11y features

## Storybook Commands

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook

# Visual regression testing
npm run test:visual
```

## References

- Storybook docs: `docs/STORYBOOK_GUIDE.md`
- Existing stories: `src/ui/**/*.stories.tsx`
