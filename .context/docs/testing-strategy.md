---
status: filled
generated: 2026-01-19
---

# Testing Strategy

This document describes the comprehensive testing strategy for maintaining quality across the React Design System codebase.

## Test Types

### 1. Unit Tests

**Framework**: Vitest + Testing Library  
**Location**: `src/**/*.test.tsx` (co-located with components)  
**Coverage Target**: >80% (goal: 90%)

**What to Test**:

- Component rendering with different props
- User interactions (clicks, input changes)
- State changes and side effects
- Edge cases and error states
- Utility functions and helpers

**Example**:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 2. Story Tests

**Framework**: Vitest + Storybook Test Runner  
**Location**: `src/**/*.stories.tsx`  
**Execution**: `npm run test` (includes story tests)

**What to Test**:

- Visual rendering of all variants
- Interactive behaviors via `play` functions
- Accessibility checks
- Component composition

**Example**:

```typescript
export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(canvas.getByText('Clicked')).toBeInTheDocument();
  },
};
```

### 3. Integration Tests

**Framework**: Vitest + Testing Library  
**Location**: `src/**/*.test.tsx` (in component test files)

**What to Test**:

- Component interactions (e.g., Form with multiple inputs)
- Context provider behavior
- Compound component patterns
- State management across components

### 4. End-to-End Tests

**Framework**: Playwright  
**Location**: `tests/e2e/*.spec.ts`  
**Execution**: `npm run test:e2e`

**What to Test**:

- Complete user flows in Storybook
- Cross-browser compatibility
- Responsive behavior
- Accessibility in real browser environment

**Example**:

```typescript
import { test, expect } from '@playwright/test';

test('button interaction in Storybook', async ({ page }) => {
  await page.goto('/?path=/story/atoms-button--primary');
  const button = page.getByRole('button');
  await button.click();
  // Assertions...
});
```

### 5. Visual Regression Tests

**Framework**: Chromatic  
**Execution**: `npm run test:visual`  
**Coverage**: All Storybook stories

**What to Test**:

- Visual appearance of all component variants
- Responsive layouts
- Theme variations (light/dark)
- Animation states

### 6. Accessibility Tests

**Framework**: @storybook/addon-a11y + axe-core  
**Execution**: Automatic in Storybook + `npm run validate-a11y`  
**Standards**: WCAG 2.1 AA (60+ rules configured)

**What to Test**:

- ARIA attributes
- Keyboard navigation
- Color contrast ratios
- Screen reader compatibility
- Focus management

## Running Tests

### All Tests

```bash
npm run test              # Run all unit and story tests
```

### Watch Mode (Development)

```bash
npm run test:watch        # Run tests in watch mode
```

### Coverage Reports

```bash
npm run test:coverage     # Generate coverage report
```

Coverage reports are generated in `coverage/` directory with HTML report.

### E2E Tests

```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Run with Playwright UI
npm run test:e2e:debug    # Run in debug mode
npm run test:e2e:report   # Show last test report
```

### Visual Regression

```bash
npm run test:visual       # Build Storybook and run Chromatic
```

### Accessibility Validation

```bash
npm run validate-a11y     # Validate accessibility patterns
```

## Quality Gates

### Minimum Coverage Requirements

- **Lines**: 80% minimum (90% target)
- **Functions**: 80% minimum (90% target)
- **Branches**: 80% minimum (90% target)
- **Statements**: 80% minimum (90% target)

### Pre-Merge Requirements

All PRs must pass:

- ✅ All unit tests pass
- ✅ All story tests pass
- ✅ Coverage ≥ 80%
- ✅ ESLint passes (`npm run lint`)
- ✅ TypeScript compiles without errors
- ✅ All validation scripts pass (`npm run validate:all`)
- ✅ Accessibility checks pass (for interactive components)

### CI/CD Integration

Tests run automatically on:

- Every push to any branch
- Every pull request
- Before merging to `main`
- Before releases

**CI Pipeline**:

1. Install dependencies
2. Run ESLint
3. Run unit tests
4. Run story tests
5. Generate coverage report
6. Run E2E tests (if changed files affect E2E)
7. Run visual regression (Chromatic) on PRs

## Testing Best Practices

### 1. Test Behavior, Not Implementation

✅ **Good**: Test what the user sees/interacts with

```typescript
expect(screen.getByRole('button')).toBeEnabled();
```

❌ **Avoid**: Testing internal implementation

```typescript
expect(button.props.disabled).toBe(false);
```

### 2. Use Semantic Selectors

✅ **Good**: Use accessible queries

```typescript
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText('Email');
```

❌ **Avoid**: Fragile selectors

```typescript
screen.getByTestId('button-123');
container.querySelector('.btn-primary');
```

### 3. Test Accessibility

Every interactive component should have:

- Keyboard navigation tests
- ARIA attribute verification
- Focus management tests
- Screen reader compatibility (when possible)

### 4. Test Edge Cases

- Empty states
- Error states
- Loading states
- Disabled states
- Boundary conditions

### 5. Keep Tests Fast

- Use `vi.fn()` for mocks
- Avoid unnecessary renders
- Use `userEvent` over `fireEvent` (more realistic)
- Mock external dependencies

## Test Organization

### File Structure

```text
src/ui/atoms/Button/
├── Button.tsx           # Component
├── Button.test.tsx      # Unit tests
├── Button.stories.tsx  # Storybook stories (with play functions)
└── index.ts            # Exports
```

### Test Naming

- Test files: `ComponentName.test.tsx`
- Story files: `ComponentName.stories.tsx`
- E2E files: `feature.spec.ts`

### Test Categories

Tests are organized by component category:

- **Atoms**: Basic rendering, props, states
- **Molecules**: Interactions, composition
- **Organisms**: Complex flows, state management
- **Templates**: Layout and structure
- **Patterns**: Complete user flows

## Troubleshooting

### Common Issues

**Tests fail after dependency update**:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Playwright browsers not installed**:

```bash
npx playwright install
```

**Coverage not updating**:

```bash
rm -rf coverage
npm run test:coverage
```

**Storybook tests failing**:

- Ensure Storybook is not running (`npm run storybook`)
- Check that stories follow correct format
- Verify all required props are provided

### Flaky Tests

If tests are flaky:

1. Check for timing issues (use `waitFor` or `findBy` queries)
2. Verify async operations are properly awaited
3. Check for race conditions in state updates
4. Ensure proper cleanup in `afterEach`

### Long-Running Tests

- E2E tests may take longer (expected)
- Use `test.only` or `describe.only` during development
- Run specific test files: `npm run test Button.test.tsx`

### Environment Quirks

- **CI vs Local**: Some tests may behave differently
- **Browser Differences**: E2E tests run in multiple browsers
- **Node Version**: Ensure Node.js version matches CI (check `.nvmrc` if present)
