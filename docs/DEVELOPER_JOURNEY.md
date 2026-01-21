# Developer Journey Guide

Este guia fornece uma jornada completa para desenvolvedores que estão começando a usar o react-design-system.

## Visão Geral

O react-design-system fornece um conjunto completo de ferramentas para facilitar o desenvolvimento de componentes consistentes e acessíveis. Este guia irá ajudá-lo a navegar através das diferentes ferramentas e recursos disponíveis.

## Primeiros Passos

### 1. Instalação

```bash
npm install @fabio.caffarello/react-design-system
```

### 2. Configuração Inicial

Configure o Theme Provider na sua aplicação:

```tsx
import { AdvancedThemeProvider } from '@fabio.caffarello/react-design-system';

function App() {
  return (
    <AdvancedThemeProvider defaultTheme="light">
      {/* Sua aplicação */}
    </AdvancedThemeProvider>
  );
}
```

### 3. Primeiro Componente

```tsx
import { Button } from '@fabio.caffarello/react-design-system';

function MyComponent() {
  return <Button variant="primary">Click me</Button>;
}
```

## Ferramentas Disponíveis

### Design System Configurator

O **Design System Configurator** é uma ferramenta visual interativa para configurar todo o design system:

- **Token Configurator**: Configure cores, espaçamento, tipografia e outros tokens
- **Theme Configurator**: Crie e gerencie temas customizados
- **Component Configurator**: Configure componentes individuais
- **CSS Code Generator**: Gere código CSS/Tailwind a partir da configuração

#### Uso

```tsx
import { DesignSystemConfigurator } from '@fabio.caffarello/react-design-system/tools';

function ConfigPage() {
  return <DesignSystemConfigurator />;
}
```

### Component Builder

O **Component Builder** permite criar componentes seguindo design patterns:

```typescript
import { ComponentBuilder } from '@fabio.caffarello/react-design-system/builders';

const button = ComponentBuilder
  .atom('Button')
  .withVariants(['primary', 'secondary', 'outline'])
  .withSizes(['sm', 'md', 'lg'])
  .withTokens({
    colors: ['primary', 'secondary'],
    spacing: ['sm', 'md', 'lg'],
  })
  .withAccessibility({
    ariaLabel: true,
    keyboardNavigation: true,
  })
  .build();
```

### Component Assistant

O **Component Assistant** é um wizard interativo para criar componentes passo a passo:

```tsx
import { ComponentAssistant } from '@fabio.caffarello/react-design-system/tools';

function AssistantPage() {
  return <ComponentAssistant />;
}
```

### Playgrounds

Os playgrounds permitem experimentar com componentes e tokens:

- **Typography Playground**: Experimente com tipografia
- **Colors Playground**: Explore o sistema de cores
- **Spacing Playground**: Visualize espaçamento
- **Component Playground**: Teste qualquer componente
- **Composition Playground**: Experimente composição de componentes
- **Pattern Playground**: Teste design patterns

## Criando Componentes

### Usando Plop

O sistema inclui templates melhorados para criação rápida de componentes:

```bash
npm run plop
```

Siga os prompts para criar componentes com:
- Variants e sizes
- Design patterns (Factory, Builder, Strategy)
- Stories e testes automáticos

### Usando Component Builder

```typescript
import { ComponentBuilder } from '@fabio.caffarello/react-design-system/builders';

const myComponent = ComponentBuilder
  .molecule('Card')
  .withVariants(['default', 'outlined', 'elevated'])
  .withChildren(true)
  .build();
```

## Design Patterns

O design system suporta vários design patterns:

### Factory Pattern

```typescript
import { ComponentFactory } from '@fabio.caffarello/react-design-system/builders';

const component = ComponentFactory.create({
  name: 'Button',
  category: 'atom',
  variants: ['primary', 'secondary'],
});
```

### Builder Pattern

```typescript
import { ComponentBuilder } from '@fabio.caffarello/react-design-system/builders';

const component = ComponentBuilder
  .atom('Button')
  .withVariants(['primary', 'secondary'])
  .build();
```

## Melhores Práticas

1. **Use Tokens**: Sempre use design tokens em vez de valores hardcoded
2. **Siga a Hierarquia**: Atoms → Molecules → Organisms → Templates
3. **Acessibilidade**: Todos os componentes devem ser acessíveis
4. **Type Safety**: Use TypeScript para type safety completo
5. **Documentação**: Documente componentes com stories

## Recursos Adicionais

- [Builder Guide](./BUILDER_GUIDE.md)
- [Configurator Guide](./CONFIGURATOR_GUIDE.md)
- [Playground Guide](./PLAYGROUND_GUIDE.md)
- [Template Guide](./TEMPLATE_GUIDE.md)

## Suporte

Para dúvidas ou problemas, consulte a documentação completa ou abra uma issue no repositório.
