# Storybook Integration Guide

Guia de integração das ferramentas do design system com o Storybook.

## Integrações Disponíveis

### Design System Configurator

O Design System Configurator está integrado como um painel no Storybook.

**Uso:**
```tsx
// Em uma story, você pode aplicar configurações via parameters
export const CustomTheme: Story = {
  parameters: {
    designSystemConfig: {
      currentTheme: 'custom-theme',
      tokens: { /* ... */ },
    },
  },
};
```

### Component Builder

O Component Builder pode gerar stories automaticamente.

**Uso:**
```typescript
import { generateStoriesFromBuilder } from '@fabio.caffarello/react-design-system/builders';

const { meta, stories } = generateStoriesFromBuilder({
  name: 'Button',
  category: 'atom',
  variants: ['primary', 'secondary'],
});
```

### Playgrounds

Os playgrounds podem ser embedados nas stories.

**Uso:**
```tsx
import { withPlayground } from '@fabio.caffarello/react-design-system/.storybook/decorators/playground';

export default {
  decorators: [withPlayground({ type: 'typography' })],
};
```

## Configuração

Todas as integrações são automáticas quando os addons são carregados no `.storybook/main.ts`.

## Exemplos

Veja os arquivos de stories existentes para exemplos de uso das integrações.
