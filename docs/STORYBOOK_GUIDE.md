# Guia Completo do Storybook

Este guia explica como usar e contribuir para o Storybook do design system.

## Visão Geral

O Storybook é a documentação interativa do design system. Cada componente tem suas próprias stories que demonstram:

- Variantes do componente
- Estados (default, hover, active, disabled, etc.)
- Eventos (onClick, onChange, etc.)
- Exemplos de uso
- Testes de interação
- Acessibilidade

## Estrutura de Stories

### Organização

As stories estão organizadas por categoria:

```
Design System/
├── Atoms/
│   ├── Button/
│   │   ├── Overview
│   │   ├── Variants
│   │   ├── States
│   │   ├── Events
│   │   └── Examples
│   └── ...
├── Molecules/
├── Organisms/
├── Templates/
├── Patterns/
├── Layouts/
└── ...
```

### Estrutura de um Arquivo de Story

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { expect, userEvent, within } from '@storybook/test';
import Component from './Component';

const meta: Meta<typeof Component> = {
  title: 'Category/Component',
  component: Component,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `...`, // Documentação com Events e States
      },
    },
  },
  argTypes: {
    // Documentação de props e eventos
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

// Stories de variantes
export const Primary: Story = { ... };

// Stories de estados
export const HoverState: Story = { ... };

// Stories de eventos
export const WithEvents: Story = { ... };
```

## Seções Obrigatórias

Cada story deve ter:

1. **Overview**: Descrição do componente
2. **Props**: Tabela completa de props com argTypes
3. **Variants**: Todas as variantes do componente
4. **States**: Stories para cada estado
5. **Events**: Stories demonstrando eventos
6. **Examples**: Exemplos de uso real
7. **Accessibility**: Testes e guias de acessibilidade

## Testes de Interação

Use `play` functions para testar interações:

```tsx
export const InteractionTest: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Click button", async () => {
      const button = canvas.getByRole("button");
      await userEvent.click(button);
    });

    await step("Verify state change", async () => {
      await waitFor(() => {
        expect(canvas.getByText(/success/i)).toBeInTheDocument();
      });
    });
  },
};
```

## Addons Disponíveis

### @storybook/addon-docs

- Documentação automática
- Controls para props
- Actions para eventos
- Viewport para responsividade

### @storybook/addon-a11y

- Testes de acessibilidade
- Verificação WCAG 2.1 AA
- Relatórios de acessibilidade

### @storybook/addon-vitest

- Integração com Vitest
- Testes unitários nas stories

### @storybook/addon-mcp

- Model Context Protocol
- Integração com AI agents

## Comandos

```bash
# Iniciar Storybook em desenvolvimento
npm run storybook

# Build do Storybook
npm run build-storybook

# Validar stories
npm run validate-stories

# Gerar índice de stories
npm run generate-story-index
```

## Boas Práticas

### 1. Sempre Documente Eventos e Estados

Cada story deve ter:

- Tabela de Events na documentação
- Tabela de States na documentação
- argTypes para todos os eventos
- Stories separadas para estados principais

### 2. Use Play Functions

Teste interações reais:

```tsx
play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button"));
};
```

### 3. Demonstre Comportamento Real

Não apenas props estáticas:

```tsx
// ✅ Bom
export const WithState: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return <Input value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

// ❌ Evitar
export const Static: Story = {
  args: {
    value: "Static value",
  },
};
```

### 4. Teste Acessibilidade

Inclua stories de acessibilidade:

```tsx
export const Accessibility: Story = {
  render: () => (
    <div>
      <Button aria-label="Save">Save</Button>
      <Button disabled aria-disabled="true">
        Disabled
      </Button>
    </div>
  ),
};
```

## Validação

Execute o script de validação para verificar se todas as stories seguem os padrões:

```bash
npm run validate-stories
```

O script verifica:

- ✅ Events documentados
- ✅ States documentados
- ✅ Play functions presentes
- ✅ Estrutura correta

## Troubleshooting

### Story não aparece no Storybook

- Verifique se o arquivo termina com `.stories.tsx`
- Verifique se o `title` está correto
- Verifique se há erros no console

### Eventos não aparecem no Actions panel

- Certifique-se de usar `action: 'eventName'` no argTypes
- Use `fn()` do `@storybook/test` para handlers

### Play functions não executam

- Verifique se está usando `async/await`
- Verifique se os seletores estão corretos
- Use `waitFor` para estados assíncronos

## Recursos

- [Documentação oficial do Storybook](https://storybook.js.org/)
- [Guia de Events e States](./EVENTS_STATES_GUIDE.md)
- [Guia de Categorização](./CATEGORIZATION_GUIDE.md)
