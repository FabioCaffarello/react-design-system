---
status: filled
generated: 2026-01-19
---

# Tooling & Productivity Guide

This guide covers all the tools, scripts, and automation that make development efficient in the React Design System.

## Required Tooling

### Node.js

- **Version**: Node.js 18+ (check `package.json` engines)
- **Installation**: Use [nvm](https://github.com/nvm-sh/nvm) for version management
- **Verification**: `node --version`

### Package Manager

- **npm**: Comes with Node.js
- **Version**: npm 9+ recommended
- **Installation**: `npm install` in project root

### Git

- **Version**: Git 2.30+
- **Configuration**: Set up user name and email
- **SSH Keys**: Required for GitHub access

### Browsers (for E2E Testing)

- **Playwright**: Automatically installs browsers
- **Installation**: `npx playwright install`
- **Browsers**: Chromium, Firefox, WebKit

## Development Scripts

### Core Development

```bash
npm run dev              # Start Vite dev server (localhost:5173)
npm run dev:playground   # Dev server with playground mode
npm run storybook        # Start Storybook (localhost:6006)
npm run build            # Build for production
npm run preview          # Preview production build
```

### Testing

```bash
npm run test             # Run all tests (unit + stories)
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # E2E tests with Playwright UI
npm run test:e2e:debug   # E2E tests in debug mode
npm run test:visual      # Visual regression (Chromatic)
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run validate:all     # Run all validation scripts
npm run validate-stories # Validate story structure
npm run validate-architecture # Validate component architecture
npm run validate-a11y    # Validate accessibility
npm run validate-themes  # Validate theme tokens
```

### Code Generation

```bash
npm run plop             # Interactive component generator
```

### Analysis & Reporting

```bash
npm run generate-story-index      # Generate story index
npm run generate-component-registry # Generate component registry
npm run generate-context-diagram  # Generate context diagram
npm run generate-insights         # Generate insights report
npm run analyze-bundle-size       # Analyze bundle size
npm run analyze-component        # Analyze component metrics
npm run analyze-performance      # Performance analysis
```

### MCP (Model Context Protocol) Scripts

```bash
npm run mcp:health-check         # Check MCP server health
npm run mcp:generate-docs          # Generate docs via MCP
npm run mcp:figma-sync-tokens     # Sync tokens from Figma
npm run mcp:validate-architecture # Validate via MCP
npm run mcp:extract-metadata      # Extract component metadata
npm run mcp:sync-all              # Sync all MCP resources
npm run mcp:validate-all          # Validate all via MCP
```

## Recommended Automation

### Pre-commit Workflow

While not enforced by git hooks, recommended workflow:

1. Run linter: `npm run lint`
2. Run tests: `npm run test`
3. Check validations: `npm run validate:all`
4. Format code: Prettier (auto-format on save recommended)

### Code Formatting

- **Prettier**: Configured in `prettier.config.mjs`
- **Auto-format**: Enable "Format on Save" in your editor
- **Manual format**: Prettier formats automatically via editor integration

### Component Generation

Use Plop for consistent component scaffolding:

```bash
npm run plop
```

Follows prompts to generate:

- Component file with TypeScript
- Test file template
- Story file template
- Index export file

**Templates available**:

- Atom component
- Molecule component
- Organism component
- Factory pattern
- Story template

### Watch Modes

- **Test Watch**: `npm run test:watch` - Auto-reruns tests on file changes
- **Storybook**: Auto-reloads on component changes
- **Vite Dev**: Hot module replacement for fast feedback

## Git Hooks with Husky

The project uses **Husky** to automatically enforce code quality and commit standards.

### Installation

Husky is automatically set up when you run `npm install` (via the `prepare` script).

### Configuration Files

- **`.husky/`**: Git hooks directory (versioned in repository)
- **`.lintstagedrc.json`**: Configuration for lint-staged (runs on staged files only)
- **`commitlint.config.js`**: Configuration for commit message validation

### Available Hooks

#### pre-commit

- **Location**: `.husky/pre-commit`
- **Runs**: `lint-staged` (ESLint + Prettier on staged files)
- **Performance**: < 10 seconds

#### commit-msg

- **Location**: `.husky/commit-msg`
- **Runs**: `commitlint` (validates Conventional Commits format)
- **Performance**: < 1 second

#### pre-push

- **Location**: `.husky/pre-push`
- **Runs**: Tests + full lint check
- **Performance**: < 60 seconds

### Manual Setup (if needed)

If hooks aren't working after `npm install`:

```bash
# Reinitialize Husky
npx husky init

# Or manually run prepare script
npm run prepare
```

### Troubleshooting

**Hooks not executing?**

1. Check `.husky/` directory exists
2. Verify hooks are executable: `chmod +x .husky/*`
3. Run `npm run prepare` to reinstall hooks

**Want to skip hooks temporarily?**

```bash
git commit --no-verify  # Skip pre-commit and commit-msg
git push --no-verify    # Skip pre-push
```

⚠️ **Warning**: Skipping hooks will cause CI to fail. Only use in emergencies.

See [Development Workflow](./development-workflow.md#git-hooks-with-husky) for detailed hook documentation.

## IDE / Editor Setup

### VS Code (Recommended)

**Essential Extensions**:

- **ESLint**: `dbaeumer.vscode-eslint` - Linting
- **Prettier**: `esbenp.prettier-vscode` - Code formatting
- **TypeScript**: Built-in - Type checking
- **Storybook**: `storybook.storybook-vscode` - Storybook integration
- **Tailwind CSS IntelliSense**: `bradlc.vscode-tailwindcss` - Tailwind autocomplete

**Recommended Settings** (`settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

**Workspace Settings** (`.vscode/settings.json`):

```json
{
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true,
    "**/.storybook-static": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true
  }
}
```

### Other Editors

**WebStorm/IntelliJ**:

- Enable ESLint integration
- Configure Prettier as formatter
- Install Tailwind CSS plugin
- Enable TypeScript strict mode

**Vim/Neovim**:

- Use `coc.nvim` or `nvim-lspconfig` for LSP
- Configure ESLint and Prettier plugins
- Use `vim-test` for test running

## Productivity Tips

### Terminal Aliases

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
# React Design System shortcuts
alias rds-dev="cd /path/to/react-design-system && npm run dev"
alias rds-sb="cd /path/to/react-design-system && npm run storybook"
alias rds-test="cd /path/to/react-design-system && npm run test:watch"
alias rds-lint="cd /path/to/react-design-system && npm run lint"
alias rds-validate="cd /path/to/react-design-system && npm run validate:all"
```

### NPM Script Shortcuts

Create `package.json` scripts for common workflows:

```json
{
  "scripts": {
    "quick-check": "npm run lint && npm run test",
    "pre-commit": "npm run lint && npm run test && npm run validate:all"
  }
}
```

### Debugging

**VS Code Debug Configuration** (`.vscode/launch.json`):

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test", "--"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug E2E",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test:e2e:debug"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Storybook Addons

Essential addons already configured:

- **@storybook/addon-a11y**: Accessibility testing
- **@storybook/addon-docs**: Documentation
- **@storybook/addon-coverage**: Test coverage
- **@storybook/addon-mcp**: Model Context Protocol
- **@storybook/addon-measure**: Component measurements
- **@storybook/addon-outline**: Element outlines

### Component Development Workflow

1. **Generate**: `npm run plop` → Select component type
2. **Develop**: Write component in generated files
3. **Test**: `npm run test:watch` in separate terminal
4. **Document**: Add stories in Storybook
5. **Validate**: `npm run validate:all`
6. **Review**: Check Storybook for visual verification

### Performance Monitoring

- **Bundle Analysis**: `npm run analyze-bundle-size`
- **Component Analysis**: `npm run analyze-component`
- **Performance Metrics**: `npm run analyze-performance`
- **Storybook Performance**: Use `storybook-addon-performance` addon

### Git Workflow Helpers

```bash
# Quick commit with validation
git add . && npm run validate:all && git commit -m "feat: ..."

# Pre-push validation
git push --no-verify  # Skip hooks if needed (not recommended)
```

### Environment Variables

Create `.env.local` for local development:

```env
VITE_APP_MODE=development
CHROMATIC_PROJECT_TOKEN=your-token-here  # For visual regression
```

### Useful Commands Reference

```bash
# Quick validation before commit
npm run lint && npm run test && npm run validate:all

# Full check (lint + test + build)
npm run lint && npm run test && npm run build

# Clean install
rm -rf node_modules package-lock.json && npm install

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

## Troubleshooting Tools

### Dependency Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### TypeScript Issues

```bash
# Restart TypeScript server (VS Code)
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# Check TypeScript version
npx tsc --version
```

### Storybook Issues

```bash
# Clear Storybook cache
rm -rf node_modules/.cache
npm run storybook
```

### Test Issues

```bash
# Clear test cache
rm -rf node_modules/.vite
npm run test
```
