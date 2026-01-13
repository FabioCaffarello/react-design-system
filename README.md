# React Design System

![Vite](https://img.shields.io/badge/built%20with-vite-646cff)
![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=flat&logo=typescript&logoColor=white)
![Storybook](https://img.shields.io/badge/storybook-%23FF4785.svg?style=flat&logo=storybook&logoColor=white)
![Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18)
![TailwindCSS](https://img.shields.io/badge/styled%20with-tailwindcss-38bdf8)

## Overview

This repository is a modern, scalable, and flexible Design System built with React, TypeScript, and Vite. It provides a robust foundation for building consistent, accessible, and reusable UI components across multiple frontend projects.

- **Atomic Design:** Organized into Atoms, Molecules, and Organisms for maximum reusability.
- **Interactive Documentation:** Storybook for live component visualization, documentation, and testing.
- **Automated Testing:** Vitest and Testing Library for unit and integration tests.
- **Styling:** TailwindCSS for utility-first, customizable styles.
- **Developer Experience:** ESLint, Prettier, and strict TypeScript configuration.

## Technologies

- **React 19**
- **TypeScript 5**
- **Vite** (fast dev/build)
- **Storybook 10** (with accessibility and docs addons)
- **Vitest** (unit and story testing)
- **Testing Library** (DOM assertions)
- **TailwindCSS** (utility-first CSS)
- **Plop** (component code generation)
- **ESLint & Prettier** (code quality and formatting)

## Folder Structure

```sh
src/
  ui/
    atoms/        # Basic components (Button, Input, Text, etc.)
    molecules/    # Combinations of atoms (InputWithLabel, etc.)
    organisms/    # Complex blocks (LoginBox, etc.)
  assets/         # Images, icons, etc.
  style.css       # TailwindCSS and custom theme variables
public/           # Static files
.storybook/       # Storybook configuration
plop-templates/   # Component and story templates
```

## Getting Started

1. **Install dependencies:**

    ```sh
    npm install
    ```

2. **Start development server:**

    ```sh
    npm run dev
    ```

3. **View and document components in Storybook:**

    ```sh
    npm run storybook
    ```

4. **Run unit and story tests:**

    ```sh
    npm run test
    ```

5. **Lint and format code:**

    ```sh
    npm run lint
    ```

## Component Generation

Create new components using Plop:

```sh
npm run plop
```

Follow the prompts to generate Atoms, Molecules, Organisms, or Views with ready-to-use templates and Storybook stories.

## Testing & Quality

- **Unit tests:** Located alongside components as `.test.tsx` files, run with Vitest.
- **Storybook tests:** Story files are also tested for visual and interaction regressions.
- **Linting:** ESLint with recommended rules for React, TypeScript, and Storybook.
- **Formatting:** Prettier for consistent code style.

## TailwindCSS & Theming

- Utility classes are used throughout components for rapid styling.
- Custom theme variables are defined in `src/style.css` for spacing, colors, and shadows.
- Easily extend or override Tailwind and theme tokens for your brand.

## Contribution

1. Fork the repository and create a feature branch from `main`.
2. Add or update components, stories, and tests.
3. Ensure all tests and lints pass.
4. Open a Pull Request with a clear description and motivation.

## Storybook Demo

Explore the live documentation and interactive components:

[Storybook on GitHub Pages](https://fabiocaffarello.github.io/react-design-system)

### Flow Playground

The Storybook includes an interactive **Flow Playground** for creating and testing flow diagrams:

- **Interactive Editor**: Add, edit, and remove nodes and edges in real-time
- **Customization**: Modify node properties (labels, variants, etc.)
- **Validation**: Validate flow structure and connection rules
- **Export/Import**: Save and load flows as JSON
- **Themes**: Switch between light and dark themes
- **Statistics**: View real-time flow statistics

Access it in Storybook: `Extensions/Flow/FlowPlayground`

See the [Flow Playground Guide](./src/ui/extensions/flow/PLAYGROUND_GUIDE.md) for detailed usage instructions.

## Features

### Accessibility

- **WCAG 2.1 AA Compliance**: All components meet accessibility standards
- **Keyboard Navigation**: Full keyboard support for all interactive components
- **ARIA Attributes**: Proper ARIA labels, roles, and states
- **Screen Reader Support**: Optimized for assistive technologies
- **Focus Management**: Proper focus trapping and restoration

### Testing

- **High Test Coverage**: > 80% coverage for all components
- **Accessibility Tests**: Automated a11y testing with @testing-library/jest-dom
- **Storybook Tests**: Visual regression and interaction testing
- **Edge Cases**: Comprehensive test coverage including error states

### Documentation

- **Storybook**: Interactive documentation with live examples
- **MDX Docs**: Detailed documentation for complex components
- **JSDoc**: Complete inline documentation
- **Type Safety**: Full TypeScript support with strict types

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run storybook` - Start Storybook
- `npm run build-storybook` - Build static Storybook
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code
- `npm run plop` - Generate new components

## Quality Standards

- **Type Safety**: Zero use of `any` (except where absolutely necessary)
- **Test Coverage**: Minimum 80% coverage required
- **Accessibility**: WCAG 2.1 AA compliance
- **Code Quality**: ESLint + Prettier enforced
- **Documentation**: All components documented in Storybook

## Flow Components

The design system includes a comprehensive Flow/Graph system built on React Flow:

- **FlowCanvas**: Main canvas component with compound pattern
- **FlowProvider**: Context provider with state management
- **Custom Nodes & Edges**: Pre-built components with design system integration
- **Layout Engines**: Support for Dagre, ELK, and Force-Directed layouts
- **Validation**: Connection rules and flow validation
- **Playground**: Interactive playground in Storybook

### Quick Start with Flow

```tsx
import { FlowCanvas, FlowProvider } from '@fabio.caffarello/react-design-system';
import { useNodesState, useEdgesState } from '@xyflow/react';

function MyFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  return (
    <FlowProvider nodes={nodes} edges={edges}>
      <FlowCanvas.Root>
        <FlowCanvas.Background />
        <FlowCanvas.Controls />
        <FlowCanvas.MiniMap />
      </FlowCanvas.Root>
    </FlowProvider>
  );
}
```

See [Flow Documentation](./src/ui/organisms/Flow/Flow.mdx) for complete API reference.

## Roadmap

- [x] Atomic Design structure
- [x] Storybook integration
- [x] Automated unit and story testing
- [x] TailwindCSS theming
- [x] Accessibility improvements (WCAG 2.1 AA)
- [x] Comprehensive test coverage
- [x] MDX documentation for complex components
- [x] Flow/Graph components with playground
- [ ] Create Publish npm package cd step
- [ ] Customizable themes and dark mode
- [ ] Performance optimizations (code splitting)
