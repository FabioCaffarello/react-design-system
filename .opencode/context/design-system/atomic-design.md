# Atomic Design Methodology

This design system follows **Atomic Design** principles, organizing components into a clear hierarchy: atoms, molecules, and organisms.

## Component Hierarchy

### Atoms

Basic building blocks that cannot be broken down further.

**Characteristics**:

- No business logic
- Highly reusable
- Single responsibility
- Minimal props
- No dependencies on other components

**Examples**: Button, Input, Badge, Avatar, Checkbox, Radio, Switch, Text, Label, Icon, Spinner, Separator

**Location**: `src/ui/atoms/`

**Import Rules**:

- ✅ Can import: tokens, utils, hooks
- ❌ Cannot import: other atoms, molecules, or organisms

### Molecules

Simple combinations of atoms working together.

**Characteristics**:

- Combines 2-4 atoms
- Single purpose
- Reusable in different contexts
- Manages simple internal state

**Examples**: InputWithLabel, Card, SearchInput, ButtonGroup, FormField, Dropdown, Tabs, DatePicker

**Location**: `src/ui/molecules/`

**Import Rules**:

- ✅ Can import: atoms, tokens, utils, hooks
- ❌ Cannot import: other molecules or organisms

### Organisms

Complex components made of molecules and atoms.

**Characteristics**:

- Complex business logic
- Multiple molecules
- Context-aware
- May have local state management

**Examples**: Form, DataTable, Header, Sidebar, Dialog, Modal, Stepper, Timeline, CommandPalette

**Location**: `src/ui/organisms/`

**Import Rules**:

- ✅ Can import: molecules, atoms, tokens, utils, hooks
- ✅ Can import other organisms (with care)

## Project Structure

```
src/ui/
├── atoms/          # 24 components - Basic building blocks
├── molecules/      # 25 components - Simple combinations
├── organisms/      # 11 components - Complex components
├── tokens/        # Design tokens
├── providers/     # Context providers
├── extensions/    # Specialized extensions (Flow, etc.)
├── patterns/      # Design patterns
├── templates/     # Page templates
└── layouts/       # Layout components
```

## When to Use What

### Create Atom when:

- Component is universally reusable
- Has no dependencies on other components
- Represents a single UI element
- Cannot be broken down further

### Create Molecule when:

- Combining 2-4 atoms for specific purpose
- Represents a common UI pattern
- Needs to be reused in multiple organisms
- Has simple internal state

### Create Organism when:

- Complex feature or section
- Combines multiple molecules
- Has significant business logic
- Context-aware behavior needed

## Component File Structure

Each component follows this structure:

```
{ComponentName}/
├── {ComponentName}.tsx        # Component implementation
├── {ComponentName}.test.tsx   # Tests
├── {ComponentName}.stories.tsx # Storybook stories
└── index.ts                   # Exports
```

## Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Configuration**: Build complex from simple
3. **Reusability**: Design for reuse across contexts
4. **Consistency**: Follow established patterns
5. **Accessibility**: WCAG 2.1 AA compliant

## References

- [Atomic Design by Brad Frost](https://atomicdesign.bradfrost.com/)
- Project architecture: `docs/ARCHITECTURE.md`
