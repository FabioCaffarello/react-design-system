# Accessibility Guide

This guide outlines accessibility standards, patterns, and best practices for the React Design System, ensuring WCAG 2.1 AA compliance.

## Table of Contents

1. [WCAG 2.1 AA Overview](#wcag-21-aa-overview)
2. [ARIA Attributes](#aria-attributes)
3. [Keyboard Navigation](#keyboard-navigation)
4. [Focus Management](#focus-management)
5. [Color and Contrast](#color-and-contrast)
6. [Screen Reader Support](#screen-reader-support)
7. [Component Patterns](#component-patterns)
8. [Testing](#testing)
9. [Resources](#resources)

## WCAG 2.1 AA Overview

The design system follows **WCAG 2.1 Level AA** standards, which include:

### Perceivable

- **Text Alternatives**: All images, icons, and media have appropriate alt text
- **Time-based Media**: Captions and descriptions for video/audio
- **Adaptable**: Content can be presented in different ways without losing information
- **Distinguishable**: Sufficient color contrast (4.5:1 for normal text, 3:1 for large text)

### Operable

- **Keyboard Accessible**: All functionality available via keyboard
- **Enough Time**: No time limits that cannot be adjusted
- **Seizures**: No content that flashes more than 3 times per second
- **Navigable**: Clear navigation, skip links, and logical focus order

### Understandable

- **Readable**: Language of page is identified
- **Predictable**: Consistent navigation and functionality
- **Input Assistance**: Error identification and suggestions

### Robust

- **Parsing**: Valid HTML markup
- **Name, Role, Value**: Proper ARIA attributes and semantic HTML

## ARIA Attributes

### Common ARIA Patterns

#### Labels

```tsx
// Use aria-label for icon-only buttons
<button aria-label="Close dialog">
  <Icon name="close" />
</button>

// Use aria-labelledby to reference visible labels
<div id="dialog-title">Confirm Action</div>
<dialog aria-labelledby="dialog-title">
  ...
</dialog>
```

#### Descriptions

```tsx
// Use aria-describedby for additional context
<input
  aria-describedby="email-help"
  aria-invalid={hasError}
/>
<span id="email-help">Enter your email address</span>
```

#### States

```tsx
// Use aria-expanded for collapsible content
<button aria-expanded={isOpen} aria-controls="menu">
  Menu
</button>
<div id="menu" hidden={!isOpen}>
  ...
</div>

// Use aria-disabled for disabled elements
<button aria-disabled={isLoading}>
  Submit
</button>
```

#### Roles

```tsx
// Use role="alert" for important messages
<div role="alert" aria-live="assertive">
  Error: Invalid input
</div>

// Use role="status" for less critical updates
<div role="status" aria-live="polite">
  Saved successfully
</div>
```

### ARIA Best Practices

1. **Prefer semantic HTML** over ARIA when possible

   ```tsx
   // Good: Use semantic HTML
   <button>Click me</button>

   // Avoid: Unnecessary ARIA
   <div role="button" tabIndex={0}>Click me</div>
   ```

2. **Don't override native semantics**

   ```tsx
   // Bad: Overriding button semantics
   <button role="link">Click me</button>
   ```

3. **Ensure ARIA attributes are valid**
   - Use valid ARIA attribute names
   - Use valid ARIA attribute values
   - Ensure required ARIA attributes are present

## Keyboard Navigation

### Standard Keyboard Patterns

#### Tab Navigation

- **Tab**: Move forward through interactive elements
- **Shift + Tab**: Move backward through interactive elements
- **Escape**: Close modals, dialogs, dropdowns

#### Arrow Keys

- **Arrow Up/Down**: Navigate lists, menus, dropdowns
- **Arrow Left/Right**: Navigate horizontal lists, tabs

#### Enter/Space

- **Enter**: Activate buttons, links, menu items
- **Space**: Activate buttons, toggle checkboxes/radios

### Focus Management

#### Focus Trapping

```tsx
// Trap focus within modal
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus first focusable element
      const firstFocusable = modalRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      {children}
    </div>
  );
}
```

#### Focus Restoration

```tsx
// Restore focus when modal closes
function useFocusRestore() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    previousFocusRef.current?.focus();
  };

  return { saveFocus, restoreFocus };
}
```

#### Skip Links

```tsx
// Add skip link for main content
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white"
>
  Skip to main content
</a>
<main id="main-content">
  ...
</main>
```

## Focus Management

### Visible Focus Indicators

All interactive elements must have visible focus indicators:

```css
/* Default focus styles */
*:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

/* Custom focus styles for components */
.button:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}
```

### Focus Order

Ensure logical focus order:

1. Header navigation
2. Main content
3. Sidebar (if present)
4. Footer

## Color and Contrast

### Contrast Requirements

- **Normal Text (≤18px)**: 4.5:1 contrast ratio
- **Large Text (>18px or bold)**: 3:1 contrast ratio
- **UI Components**: 3:1 contrast ratio for borders and interactive elements

### Don't Rely on Color Alone

```tsx
// Bad: Only color indicates state
<span style={{ color: 'red' }}>Error</span>

// Good: Icon + color + text
<span>
  <Icon name="error" aria-hidden="true" />
  <span className="text-red-600">Error: Invalid input</span>
</span>
```

### Testing Contrast

Use tools to verify contrast:

- Browser DevTools (Accessibility panel)
- Storybook a11y addon
- Online tools (WebAIM Contrast Checker)

## Screen Reader Support

### Semantic HTML

Use semantic HTML elements:

```tsx
// Good: Semantic HTML
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

// Avoid: Divs with roles
<div role="navigation">
  <div role="list">
    <div role="listitem"><a href="/">Home</a></div>
  </div>
</div>
```

### Live Regions

Use live regions for dynamic content:

```tsx
// For important updates
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>

// For less critical updates
<div role="status" aria-live="polite">
  {statusMessage}
</div>
```

### Hidden Content

Hide decorative content from screen readers:

```tsx
// Hide decorative icons
<Icon name="check" aria-hidden="true" />

// Hide visually but keep accessible
<span className="sr-only">Loading, please wait</span>
```

## Component Patterns

### Button Patterns

```tsx
// Icon-only button
<button aria-label="Close dialog">
  <Icon name="close" />
</button>

// Button with loading state
<button aria-busy={isLoading} aria-disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

### Form Patterns

```tsx
// Proper label association
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-describedby="email-error email-help"
  aria-invalid={hasError}
/>
<span id="email-help">Enter your email address</span>
{hasError && (
  <span id="email-error" role="alert">
    Please enter a valid email
  </span>
)}
```

### Modal Patterns

```tsx
<dialog
  open={isOpen}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  aria-modal="true"
>
  <h2 id="modal-title">Confirm Action</h2>
  <p id="modal-description">Are you sure you want to proceed?</p>
  <button onClick={onClose}>Cancel</button>
  <button onClick={onConfirm}>Confirm</button>
</dialog>
```

## Testing

### Automated Testing

The Storybook a11y addon automatically tests components for:

- Color contrast
- ARIA attributes
- Keyboard navigation
- Semantic HTML

The addon runs in `test: "todo"` mode in `.storybook/preview.tsx` — violations surface in the test UI but do not fail CI. The plan is to move to `test: "error"` once the real backlog (tracked in `BACKLOG.md`) is closed. The bar to flip the switch is: zero `critical` and zero `serious` violations across all stories under the configured rule set **in both light and dark themes**.

#### Baseline is light-mode-only (today)

The Storybook smoke runner and every a11y measurement script in this repo render stories under Playwright's default `chromium.launch({ headless: true })`, which boots in light mode. Neither `.storybook/preview.tsx`, nor `scripts/storybook-smoke.mjs`, nor the ad-hoc baseline scripts ever set `data-theme="dark"`, toggle `.dark` on `<html>`, or pass `emulateMedia({ colorScheme: 'dark' })`. **Every node counted in BACKLOG (Family A–E, 806 nodes) is a light-mode violation; dark-mode contracts are unaudited.** Examples already known by hand calculation: `--color-error-dark` (rose-500) over `--color-error-bg` (rose-950) is 4.26:1 — a contrast failure invisible to the current instrument. The bar to flip `test: "error"` is therefore not satisfied until dark-mode is auditable on equal footing; tracked in `BACKLOG.md` as a first-order item (not a footnote). Plumbing options (Playwright `emulateMedia`, or a per-story `globals.theme` toggle that the smoke runner iterates) are scoped in that BACKLOG entry.

#### Story-iframe exceptions

Three axe rules — `region`, `landmark-one-main`, `page-has-heading-one` — are **disabled globally** in `.storybook/preview.tsx` because they assert page-level structure (one `<main>`, an `<h1>`, all meaningful content inside a landmark) that a Storybook story iframe does not provide by design. The iframe renders only the component under test; the component itself is not a page and has no mandate to emit page chrome.

The Phase C baseline measurement (847 of 852 stories with at least one violation) showed these three rules accounted for **~99% of moderate-severity violations** — instrument noise, not real accessibility debt. Leaving them enabled would block `test: "error"` on every story for the same false positive.

Re-enable on stories that **do** render a full page structure (a `<main>` / landmark composition) via story meta:

```tsx
parameters: {
  a11y: {
    config: {
      rules: [
        { id: "region", enabled: true },
        { id: "landmark-one-main", enabled: true },
        { id: "page-has-heading-one", enabled: true },
      ],
    },
  },
}
```

Currently only `DashboardLayout` meets that bar (renders `<header>` + `<main>` + `<footer>`). `Header` / `Navigation` / `SideNavbar` emit a single landmark each — keep these rules off there.

### Manual Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Verify focus order is logical
   - Test all keyboard shortcuts

2. **Screen Reader Testing**
   - Test with NVDA (Windows)
   - Test with VoiceOver (macOS)
   - Verify all content is announced correctly

3. **Visual Testing**
   - Verify focus indicators are visible
   - Check color contrast ratios
   - Ensure content is readable at 200% zoom

### Testing Checklist

- [ ] All images have alt text
- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical
- [ ] Color contrast meets WCAG AA standards
- [ ] ARIA attributes are valid and appropriate
- [ ] Forms have proper labels and error messages
- [ ] Modals trap focus and restore on close
- [ ] Dynamic content uses live regions
- [ ] Page has proper heading hierarchy
- [ ] Language is specified on HTML element

## Resources

### Documentation

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Screen Readers

- [NVDA](https://www.nvaccess.org/) (Windows, free)
- [VoiceOver](https://www.apple.com/accessibility/vision/) (macOS/iOS, built-in)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) (Windows, paid)

## Component-Specific Guidelines

### Button

- Must have accessible name (text or aria-label)
- Must be keyboard accessible
- Must have visible focus indicator

### Input

- Must have associated label
- Must have error message with aria-describedby
- Must have aria-invalid when invalid

### Modal

- Must trap focus
- Must have aria-modal="true"
- Must have aria-labelledby or aria-label
- Must restore focus on close

### Navigation

- Must have skip link
- Must have proper heading hierarchy
- Must indicate current page

### Table

- Must have caption or aria-label
- Must have proper header associations
- Must be keyboard navigable
