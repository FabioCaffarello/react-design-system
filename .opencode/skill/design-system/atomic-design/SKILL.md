---
name: atomic-design
description: Atomic Design methodology for component architecture
license: MIT
compatibility: opencode
metadata:
  domain: design-system
  audience: developers
---

# Atomic Design Skill

This skill provides knowledge about Atomic Design methodology for organizing React components.

## Atomic Design Principles

### Atoms

Basic building blocks. Cannot be broken down further.

**Examples**: Button, Input, Badge, Avatar, Checkbox, Radio, Switch, Text, Label, Icon, Spinner, Separator

**Characteristics**:

- No business logic
- Highly reusable
- Single responsibility
- Minimal props
- No dependencies on other components

**Location**: `src/ui/atoms/`

**Import Rules**:

- ✅ Can import: tokens, utils, hooks
- ❌ Cannot import: other atoms, molecules, or organisms

### Molecules

Simple combinations of atoms working together.

**Examples**: InputWithLabel, Card, SearchInput, ButtonGroup, FormField, Dropdown, Tabs, DatePicker

**Characteristics**:

- Combines 2-4 atoms
- Single purpose
- Reusable in different contexts
- Manages simple internal state

**Location**: `src/ui/molecules/`

**Import Rules**:

- ✅ Can import: atoms, tokens, utils, hooks
- ❌ Cannot import: other molecules or organisms

### Organisms

Complex components made of molecules and atoms.

**Examples**: Form, DataTable, Header, Sidebar, Dialog, Modal, Stepper, Timeline, CommandPalette

**Characteristics**:

- Complex business logic
- Multiple molecules
- Context-aware
- May have local state management

**Location**: `src/ui/organisms/`

**Import Rules**:

- ✅ Can import: molecules, atoms, tokens, utils, hooks
- ✅ Can import other organisms (with care)

## When to Use What

**Create Atom when**:

- Component is universally reusable
- Has no dependencies on other components
- Represents a single UI element
- Cannot be broken down further

**Create Molecule when**:

- Combining 2-4 atoms for specific purpose
- Represents a common UI pattern
- Needs to be reused in multiple organisms
- Has simple internal state

**Create Organism when**:

- Complex feature or section
- Combines multiple molecules
- Has significant business logic
- Context-aware behavior needed

## Project Structure

```
src/ui/
├── atoms/          # 24 components - Basic building blocks
├── molecules/      # 25 components - Simple combinations
├── organisms/      # 11 components - Complex components
├── tokens/        # Design tokens
├── providers/     # Context providers
└── extensions/    # Specialized extensions
```

## References

- Context file: `.opencode/context/design-system/atomic-design.md`
- Architecture: `docs/ARCHITECTURE.md`
