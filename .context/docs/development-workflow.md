---
status: filled
generated: 2026-01-19
---

# Development Workflow

This document outlines the day-to-day engineering process for the React Design System.

## Branching & Releases

### Branching Model

The project uses a **trunk-based development** approach with feature branches:

- **main**: Production-ready code (protected branch)
- **feature/***: New features and enhancements
- **fix/***: Bug fixes
- **docs/***: Documentation updates
- **refactor/***: Code refactoring

### Release Process

The project uses **Semantic Release** for automated versioning and publishing:

- **Automatic Versioning**: Based on [Conventional Commits](https://www.conventionalcommits.org/)
- **Release Triggers**: Push to `main` (excluding docs-only changes)
- **Version Types**:
  - `feat:` → Minor version bump
  - `fix:` → Patch version bump
  - `feat!:` or `BREAKING CHANGE:` → Major version bump
- **Automated Steps**:
  1. Analyze commits since last release
  2. Determine next version
  3. Generate changelog
  4. Publish to NPM
  5. Create GitHub release
  6. Deploy Storybook to GitHub Pages

### Commit Convention

All commits must follow Conventional Commits format:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`

## Local Development

### Initial Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers (for E2E tests)
npx playwright install
```

### Daily Development Commands

**Development Server**:

```bash
npm run dev              # Start Vite dev server (http://localhost:5173)
npm run dev:playground   # Start dev server with playground mode
```

**Storybook**:

```bash
npm run storybook        # Start Storybook (http://localhost:6006)
npm run build-storybook  # Build static Storybook
```

**Testing**:

```bash
npm run test             # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run E2E tests with UI
```

**Code Quality**:

```bash
npm run lint             # Run ESLint
npm run validate:all    # Run all validation scripts
```

**Build**:

```bash
npm run build            # Build for production
npm run preview          # Preview production build
```

### Component Development Workflow

1. **Create Component**:

   ```bash
   npm run plop           # Use Plop to generate component scaffold
   ```

2. **Develop Component**:
   - Write component in `src/ui/{category}/{ComponentName}/`
   - Add tests in `ComponentName.test.tsx`
   - Add stories in `ComponentName.stories.tsx`

3. **Test Locally**:
   - View in Storybook: `npm run storybook`
   - Run tests: `npm run test:watch`
   - Check accessibility: Use Storybook a11y addon

4. **Validate**:

   ```bash
   npm run validate:all   # Run all validations
   ```

5. **Commit**:

   ```bash
   git commit -m "feat(Button): add loading state"
   ```

## Code Review Expectations

### Pre-Submission Checklist

- [ ] All tests pass (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] All validations pass (`npm run validate:all`)
- [ ] Test coverage ≥ 80%
- [ ] Storybook stories added/updated
- [ ] Accessibility verified (Storybook a11y addon)
- [ ] TypeScript compiles without errors
- [ ] Documentation updated (if needed)

### Review Criteria

**Code Quality**:

- Follows TypeScript best practices (no `any` types)
- Uses design tokens (not hardcoded values)
- Follows Atomic Design categorization
- Proper error handling

**Accessibility**:

- Keyboard navigation supported
- ARIA attributes present
- Focus management correct
- Screen reader compatible

**Testing**:

- Unit tests for component logic
- Story tests for interactions
- Edge cases covered
- Accessibility tests included

**Documentation**:

- JSDoc comments on exported functions/components
- Storybook stories with examples
- Props documented in `argTypes`

### Review Process

1. **Automated Checks**: Must pass all CI checks
2. **Code Review**: At least one maintainer approval required
3. **Accessibility Review**: Required for interactive components
4. **Documentation Review**: Required if API changes

### Required Approvals

- **Minor changes** (docs, style): 1 approval
- **Feature additions**: 2 approvals
- **Breaking changes**: 2 approvals + maintainer discussion

## Onboarding Tasks

### For New Contributors

1. **Read Documentation**:
   - [README.md](../../README.md) - Project overview
   - [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guidelines
   - [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) - System architecture
   - [ACCESSIBILITY.md](../../docs/ACCESSIBILITY.md) - A11y guidelines

2. **Set Up Environment**:

   ```bash
   git clone <repository>
   cd react-design-system
   npm install
   npm run storybook  # Verify setup works
   ```

3. **First Contribution**:
   - Pick a "good first issue" from GitHub
   - Or fix a small bug/documentation issue
   - Follow the component development workflow above

4. **Learn the System**:
   - Explore Storybook to see all components
   - Read component source code in `src/ui/`
   - Review test files to understand testing patterns
   - Check existing stories for examples

### Recommended First Tasks

- Fix typos in documentation
- Add missing Storybook stories
- Improve test coverage
- Add accessibility improvements
- Write component examples

### Getting Help

- **Documentation**: Check `docs/` directory
- **Issues**: Search GitHub issues
- **Discussions**: Use GitHub Discussions
- **Code Review**: Ask questions in PR comments
