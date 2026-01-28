---
name: testing-patterns
description: Testing patterns for React components
license: MIT
compatibility: opencode
metadata:
  domain: testing
  framework: vitest
---

# Testing Patterns Skill

This skill provides knowledge about testing React components.

## Testing Framework

- **Framework**: Vitest
- **Testing Library**: @testing-library/react
- **Coverage Target**: 80%+ (minimum), 90%+ (target)

## Test Structure

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('renders with default props', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

## Test Categories

1. **Rendering Tests**: Component renders correctly
2. **Props Validation**: Props work correctly
3. **User Interactions**: User events handled
4. **Accessibility Tests**: A11y features work
5. **Edge Cases**: Null/empty/error states

## Best Practices

- Use semantic selectors (getByRole, getByLabelText)
- Follow Arrange-Act-Assert pattern
- Test all variants and props
- Include accessibility tests
- Achieve 80%+ coverage

## References

- Context file: `.opencode/context/design-system/testing-patterns.md`
- Existing tests: `src/ui/**/*.test.tsx`
