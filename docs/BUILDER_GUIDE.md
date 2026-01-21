# Component Builder Guide

Guia completo para usar o Component Builder System.

## Visão Geral

O Component Builder System fornece uma API fluente para criar componentes seguindo design patterns como Factory e Builder.

## Component Builder

### Criando um Atom

```typescript
import { ComponentBuilder } from '@fabio.caffarello/react-design-system/builders';

const button = ComponentBuilder
  .atom('Button')
  .withVariants(['primary', 'secondary', 'outline'])
  .withSizes(['sm', 'md', 'lg'])
  .build();
```

### Criando um Molecule

```typescript
const card = ComponentBuilder
  .molecule('Card')
  .withVariants(['default', 'outlined', 'elevated'])
  .withChildren(true)
  .build();
```

### Criando um Organism

```typescript
const table = ComponentBuilder
  .organism('Table')
  .withProps({
    data: [],
    columns: [],
  })
  .build();
```

## Component Factory

### Uso Básico

```typescript
import { ComponentFactory } from '@fabio.caffarello/react-design-system/builders';

const component = ComponentFactory.create({
  name: 'Button',
  category: 'atom',
  variants: ['primary', 'secondary'],
  sizes: ['sm', 'md', 'lg'],
});
```

### Validação

```typescript
const validation = ComponentFactory.validate({
  name: 'Button',
  category: 'atom',
});

if (!validation.valid) {
  console.error(validation.errors);
}
```

## Component Registry

### Registrar Componentes

```typescript
import { ComponentRegistry } from '@fabio.caffarello/react-design-system/builders';

ComponentRegistry.register('Button', {
  name: 'Button',
  category: 'atom',
  variants: ['primary', 'secondary'],
});
```

### Buscar Componentes

```typescript
// Por nome
const button = ComponentRegistry.get('Button');

// Por categoria
const atoms = ComponentRegistry.getByCategory('atom');

// Todos
const all = ComponentRegistry.getAll();
```

## Design Patterns

### Factory Pattern

O Factory Pattern é usado para criar componentes com configurações pré-definidas:

```typescript
const component = ComponentFactory.create(config, {
  template: 'factory',
  includeStories: true,
  includeTests: true,
});
```

### Builder Pattern

O Builder Pattern permite construção fluente:

```typescript
const component = ComponentBuilder
  .atom('Button')
  .withVariants(['primary', 'secondary'])
  .withSizes(['sm', 'md', 'lg'])
  .withAccessibility({
    ariaLabel: true,
    keyboardNavigation: true,
  })
  .build();
```

## Exemplos Completos

### Exemplo: Button Component

```typescript
import { ComponentBuilder } from '@fabio.caffarello/react-design-system/builders';

const button = ComponentBuilder
  .atom('Button')
  .withVariants(['primary', 'secondary', 'outline', 'ghost'])
  .withSizes(['sm', 'md', 'lg'])
  .withTokens({
    colors: ['primary', 'secondary'],
    spacing: ['sm', 'md', 'lg'],
    typography: {
      sizes: ['sm', 'base'],
      weights: ['medium', 'semibold'],
    },
  })
  .withAccessibility({
    ariaLabel: true,
    keyboardNavigation: true,
    focusManagement: true,
  })
  .withChildren(true)
  .build();

console.log(button.code); // Código do componente
console.log(button.types); // Tipos TypeScript
console.log(button.stories); // Stories do Storybook
```

## Melhores Práticas

1. **Valide Configurações**: Sempre valide antes de criar
2. **Use Tokens**: Configure tokens apropriados
3. **Acessibilidade**: Configure recursos de acessibilidade
4. **Documentação**: Gere stories e testes automaticamente

## Referências

- [Developer Journey Guide](./DEVELOPER_JOURNEY.md)
- [Component Factory API](../../src/ui/builders/ComponentFactory.ts)
- [Component Builder API](../../src/ui/builders/ComponentBuilder.ts)
