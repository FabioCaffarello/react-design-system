# Storybook Advanced Guide

Guia avançado para usar todas as funcionalidades do Storybook no react-design-system.

## Visão Geral

O Storybook foi elevado a um nível profissional completo com integração de todas as ferramentas desenvolvidas, addons customizados, automação e análise avançada.

## Addons Ativados

### Addons Gratuitos Ativados

- **@storybook/addon-measure**: Medir elementos na tela
- **@storybook/addon-outline**: Visualizar outlines de elementos
- **@storybook/addon-coverage**: Visualizar code coverage
- **storybook-addon-performance**: Métricas de performance

### Addons Customizados

- **Design System Configurator**: Configure tokens e temas diretamente no Storybook
- **Component Builder**: Gere stories automaticamente
- **Token Inspector**: Inspecione tokens usados em componentes
- **Component Analyzer**: Analise estrutura e detecte violações
- **Story Generator**: Gere stories automaticamente
- **Dashboard**: Métricas do design system
- **Performance Monitor**: Monitore performance de componentes
- **Analytics**: Tracking de uso e insights

## Integração com Ferramentas

### Design System Configurator

Configure tokens e temas diretamente no Storybook:

1. Abra o painel "Design System Config" no Storybook
2. Configure tokens (cores, espaçamento, tipografia)
3. Crie temas customizados
4. Aplique configurações em tempo real

### Component Builder

Gere stories automaticamente:

```typescript
import { ComponentBuilder } from "@fabio.caffarello/react-design-system/builders";

// No painel Component Builder, configure o componente
const config = {
  name: "Button",
  category: "atom",
  variants: ["primary", "secondary"],
};

// A story será gerada automaticamente
```

### Playgrounds

Embed playgrounds nas stories:

```tsx
import { PlaygroundEmbed } from "@fabio.caffarello/react-design-system/playgrounds";

export const TypographyExample = {
  render: () => <PlaygroundEmbed type="Typography" />,
};
```

## Templates Avançados

### Advanced Story Template

Use o template avançado para stories completas:

```typescript
import { createAdvancedStories } from ".storybook/templates/AdvancedStoryTemplate";

const { meta, stories } = createAdvancedStories({
  title: "UI/Atoms/Button",
  component: Button,
  description: "Button component description",
  componentConfig: {
    name: "Button",
    category: "atom",
    variants: ["primary", "secondary"],
  },
  includeInteractionTests: true,
  includeAccessibilityTests: true,
});
```

## Automação

### Gerar Stories Automaticamente

```bash
npm run generate-stories
```

Gera stories para todos os componentes que não possuem stories.

### Validar Stories

```bash
npm run validate-stories-enhanced
```

Valida stories com verificações avançadas:

- Estrutura correta
- Events e States documentados
- Sintaxe válida
- Tags e tipos corretos

### Relatórios

Os relatórios de coverage e performance são gerados automaticamente:

- **Coverage**: Use `npm run test:coverage` para gerar relatórios de cobertura
- **Performance**: Métricas são coletadas automaticamente pelo addon Performance Monitor no Storybook

## Performance Monitoring

O addon Performance Monitor coleta métricas automaticamente:

- Render time
- Re-renders
- Memory usage
- Bundle size

Visualize no painel "Performance" de cada story.

## Analytics

O addon Analytics rastreia:

- Total de visualizações
- Componentes mais usados
- Stories mais visualizadas
- Tendências de uso

Visualize no painel "Analytics".

## Visual Testing

### Chromatic (Free Tier)

```bash
npm run chromatic
```

Configurado para usar apenas recursos gratuitos.

### Playwright (Custom)

```bash
npm run test:e2e
```

Testes visuais customizados usando Playwright.

## Melhores Práticas

### 1. Sempre Use Templates Avançados

Use `AdvancedStoryTemplate` para stories completas com validação automática.

### 2. Documente Events e States

Sempre documente Events e States nas stories:

```tsx
parameters: {
  docs: {
    description: {
      component: `
## Component

Description.

### Events
| Event | Description | Parameters | When Fired |
|-------|-------------|------------|------------|
| onClick | Click event | (event: MouseEvent) => void | When clicked |

### States
| State | Description | How to Activate | Visual |
|-------|-------------|-----------------|--------|
| default | Default state | Initial | Normal |
      `,
    },
  },
}
```

### 3. Use Token Inspector

Adicione tokens parameter para inspecionar uso:

```tsx
parameters: {
  tokens: [
    { type: 'color', name: 'primary', value: '#6366f1', usage: 'bg' },
  ],
}
```

### 4. Monitore Performance

Adicione performance parameter:

```tsx
parameters: {
  performance: {
    renderTime: 50,
    reRenders: 2,
  },
}
```

### 5. Use Component Analyzer

Adicione componentAnalysis parameter:

```tsx
parameters: {
  componentAnalysis: {
    category: 'atom',
    imports: ['./Button'],
    violations: [],
    suggestions: [],
  },
}
```

## Troubleshooting

### Addon não aparece

1. Verifique se está no `.storybook/main.ts`
2. Reinicie o Storybook
3. Verifique console para erros

### Performance não mede

1. Verifique se `storybook-addon-performance` está instalado
2. Adicione performance parameter à story
3. Verifique painel Performance

### Configurator não carrega

1. Verifique se DesignSystemConfigurator está exportado corretamente
2. Verifique console para erros
3. Reinicie o Storybook

## Recursos Adicionais

- [Storybook Guide](./STORYBOOK_GUIDE.md)
- [Storybook Addons](./STORYBOOK_ADDONS.md)
- [STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md) - Guia completo do Storybook
