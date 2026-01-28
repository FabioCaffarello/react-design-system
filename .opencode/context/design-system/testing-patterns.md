# Testing Patterns

This document describes the testing patterns for components in this design system.

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
    expect(screen.getByRole('...')).toBeInTheDocument()
  })

  it('renders with custom props', () => {
    render(<ComponentName variant="secondary" size="lg" />)
    // Assertions
  })

  it('handles user interaction', () => {
    const handler = vi.fn()
    render(<ComponentName onClick={handler} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('is accessible', () => {
    const { container } = render(<ComponentName />)
    // Accessibility assertions
  })
})
```

## Test Categories

### 1. Rendering Tests

Test that components render correctly:

```typescript
it('renders with default props', () => {
  render(<ComponentName />)
  expect(screen.getByRole('button')).toBeInTheDocument()
})

it('renders with all variants', () => {
  render(<ComponentName variant="primary" />)
  render(<ComponentName variant="secondary" />)
  render(<ComponentName variant="error" />)
})
```

### 2. Props Validation

Test that props work correctly:

```typescript
it('applies custom className', () => {
  const { container } = render(<ComponentName className="custom" />)
  expect(container.firstChild).toHaveClass('custom')
})

it('applies all size variants', () => {
  render(<ComponentName size="sm" />)
  render(<ComponentName size="md" />)
  render(<ComponentName size="lg" />)
})
```

### 3. User Interactions

Test user interactions:

```typescript
it('handles click events', () => {
  const handler = vi.fn()
  render(<ComponentName onClick={handler} />)
  fireEvent.click(screen.getByRole('button'))
  expect(handler).toHaveBeenCalledTimes(1)
})

it('handles keyboard navigation', () => {
  render(<ComponentName />)
  const element = screen.getByRole('button')
  element.focus()
  fireEvent.keyDown(element, { key: 'Enter' })
})
```

### 4. Accessibility Tests

Test accessibility features:

```typescript
it('is accessible', () => {
  const { container } = render(<ComponentName />)

  // Check ARIA attributes
  expect(container.querySelector('[aria-label]')).toBeInTheDocument()

  // Check keyboard navigation
  const element = screen.getByRole('button')
  element.focus()
  expect(element).toHaveFocus()
})
```

### 5. Edge Cases

Test edge cases:

```typescript
it('handles null props gracefully', () => {
  render(<ComponentName value={null} />)
  // Should not crash
})

it('handles empty states', () => {
  render(<ComponentName items={[]} />)
  expect(screen.getByText('No items')).toBeInTheDocument()
})
```

## Testing Library Best Practices

### Use Semantic Selectors

```typescript
// ✅ Preferred
screen.getByRole("button", { name: "Submit" });
screen.getByLabelText("Email");
screen.getByText("Welcome");

// ❌ Avoid
screen.getByTestId("submit-button");
container.querySelector(".button");
```

### Arrange-Act-Assert Pattern

```typescript
it('handles user interaction', () => {
  // Arrange
  const handler = vi.fn()
  render(<ComponentName onClick={handler} />)

  // Act
  fireEvent.click(screen.getByRole('button'))

  // Assert
  expect(handler).toHaveBeenCalledTimes(1)
})
```

## Test Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test ComponentName
```

## Coverage Requirements

- **Minimum**: 80% coverage
- **Target**: 90%+ coverage
- **Critical**: 100% for utility functions and hooks

## References

- Testing guide: `docs/TESTING_STRATEGY.md`
- Existing tests: `src/ui/**/*.test.tsx`
