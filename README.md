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

## Roadmap

- [x] Atomic Design structure
- [x] Storybook integration
- [x] Automated unit and story testing
- [x] TailwindCSS theming
- [ ] Improve components design
- [ ] New components (Cards, Modals, etc.)
- [ ] Customizable themes and dark mode
- [ ] Accessibility improvements
