# Guia: Como Documentar Eventos e Estados nas Stories

Este guia explica como documentar eventos e estados diretamente nas stories dos componentes, em vez de usar MDX globais.

## Estrutura de Documentação

Cada story deve ser auto-contida com sua própria documentação de eventos e estados.

### 1. Documentação na Descrição do Componente

Adicione tabelas de Events e States na descrição do componente:

```tsx
const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## ComponentName

Descrição do componente.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onClick\` | Click event | \`(event: MouseEvent) => void\` | When user clicks |
| \`onChange\` | Value change | \`(value: string) => void\` | When value changes |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Default state | Initial state | Normal appearance |
| \`hover\` | Hover state | Mouse over | Highlighted |
| \`disabled\` | Disabled state | \`disabled={true}\` | Grayed out |
        `,
      },
    },
  },
};
```

### 2. Documentação no argTypes

Documente todos os eventos no `argTypes` com `action`:

```tsx
argTypes: {
  onClick: {
    description: 'Callback fired when component is clicked',
    action: 'onClick',
    table: {
      type: { summary: '(event: MouseEvent) => void' },
      category: 'Events',
    },
  },
  onChange: {
    description: 'Callback fired when value changes',
    action: 'onChange',
    table: {
      type: { summary: '(value: string) => void' },
      category: 'Events',
    },
  },
},
```

### 3. Stories para Eventos

Crie stories específicas para demonstrar eventos:

```tsx
export const WithEvents: Story = {
  render: () => {
    const handleClick = fn((event: MouseEvent) => {
      console.log('Clicked:', event);
    });
    
    return (
      <ComponentName onClick={handleClick} />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    // Event will appear in Actions panel
  },
};
```

### 4. Stories para Estados

Crie stories separadas para cada estado principal:

```tsx
export const DefaultState: Story = {
  args: {
    // default props
  },
};

export const HoverState: Story = {
  args: {
    // props for hover
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const component = canvas.getByRole('button');
    await userEvent.hover(component);
  },
};

export const DisabledState: Story = {
  args: {
    disabled: true,
  },
};
```

## Padrões de Nomenclatura

### Eventos
- Use `on` prefix: `onClick`, `onChange`, `onFocus`
- Seja específico: `onOpenChange` em vez de `onToggle`
- Documente parâmetros: `(event: MouseEvent) => void`

### Estados
- Use nomes descritivos: `default`, `hover`, `active`, `disabled`, `loading`
- Seja consistente: use os mesmos nomes em todos os componentes
- Documente como ativar: `disabled={true}`, `hover` (mouse over)

## Exemplo Completo

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within, waitFor } from '@storybook/test';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Button

A versatile button component.

### Events

| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| \`onClick\` | Click event | \`(event: MouseEvent) => void\` | When user clicks |
| \`onMouseEnter\` | Mouse enters | \`(event: MouseEvent) => void\` | When cursor enters |

### States

| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| \`default\` | Default | Initial | Normal appearance |
| \`hover\` | Hover | Mouse over | Highlighted |
| \`disabled\` | Disabled | \`disabled={true}\` | Grayed out |
        `,
      },
    },
  },
  argTypes: {
    onClick: {
      description: 'Callback fired when button is clicked',
      action: 'onClick',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
        category: 'Events',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const WithEvents: Story = {
  render: () => {
    const handleClick = fn((event: React.MouseEvent) => {
      console.log('Clicked');
    });
    
    return <Button onClick={handleClick}>Click me</Button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
  },
};

export const HoverState: Story = {
  args: {
    children: 'Hover over me',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.hover(button);
  },
};
```

## Checklist

Para cada componente, verifique:

- [ ] Story tem seção "Events" na documentação
- [ ] Story tem seção "States" na documentação
- [ ] Todos os eventos estão documentados no argTypes com `action`
- [ ] Stories separadas para cada estado principal
- [ ] Play functions testam interações e eventos
- [ ] Exemplos interativos demonstram eventos em ação

## Migração do EventCatalog/StateCatalog

Após migrar todos os eventos e estados para as stories individuais:

1. ✅ Verificar que todas as stories têm eventos e estados documentados
2. ✅ Executar script de validação: `npm run validate-stories`
3. ✅ Remover `EventCatalog.mdx` e `StateCatalog.mdx`
4. ✅ Atualizar links que referenciam esses arquivos

## Ferramentas

Use o template helper para facilitar a criação:

```tsx
import { createComponentMeta, generateEventsTable } from '../../.storybook/templates/ComponentStoryTemplate';

const events = [
  { name: 'onClick', description: 'Click event', parameters: '(event: MouseEvent) => void', whenFired: 'When clicked' },
];

const meta = createComponentMeta({
  title: 'Atoms/Button',
  component: Button,
  description: 'A button component',
  events,
  // ...
});
```
