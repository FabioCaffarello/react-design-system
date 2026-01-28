---
name: storybook-patterns
description: Storybook story patterns for component documentation
license: MIT
compatibility: opencode
metadata:
  domain: storybook
  format: csf3
---

# Storybook Patterns Skill

This skill provides knowledge about creating Storybook stories for components.

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
  },
  tags: ["autodocs"],
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

1. **Default Story**: Shows component with default props
2. **Variants Story**: Shows all variants together
3. **Sizes Story**: Shows all sizes together
4. **Interactive Story**: Shows user interactions
5. **Accessibility Story**: Shows accessibility features

## Best Practices

- Use semantic titles: `Design System/{Type}/{ComponentName}`
- Include descriptions
- Show all variants
- Add controls for interactive exploration
- Include accessibility showcase

## References

- Context file: `.opencode/context/design-system/storybook-patterns.md`
- Existing stories: `src/ui/**/*.stories.tsx`
