# Guia Completo de Addons do Storybook

Este documento descreve todos os addons configurados no React Design System, como usá-los e suas funcionalidades.

> **Nota**: Este guia foi criado como parte da evolução completa do design system. Para quick start, veja [QUICK_START_MCP.md](./QUICK_START_MCP.md).

## Visão Geral

O Storybook do React Design System utiliza vários addons para melhorar a experiência de desenvolvimento, documentação, testes e qualidade. Este guia cobre todos os addons ativos e suas configurações.

## Addons Ativos

### 1. @chromatic-com/storybook

**Versão**: ^4.1.2

**Descrição**: Visual regression testing com Chromatic. Captura screenshots automáticos de todas as stories e detecta mudanças visuais.

**Funcionalidades**:

- Screenshots automáticos de todas as stories
- Detecção de mudanças visuais
- Comparação pixel a pixel
- Review visual via interface web
- Integração com CI/CD

**Como Usar**:

```bash
# Executar Chromatic localmente
npm run chromatic

# Executar no CI (não falha se não houver mudanças)
npm run chromatic:ci

# Build + Chromatic
npm run test:visual
```

**Configuração**:

- Token configurado via variável de ambiente `CHROMATIC_PROJECT_TOKEN`
- Configuração adicional em `.chromatic.config.js`

**Documentação**: [CHROMATIC_SETUP.md](./CHROMATIC_SETUP.md)

---

### 2. @storybook/addon-docs

**Versão**: ^10.0.3

**Descrição**: Suporte completo de documentação. Inclui Controls, Actions, Viewport e Interactions no Storybook 10.

**Funcionalidades**:

- Documentação automática de componentes
- Controls interativos para props
- Actions para eventos
- Viewport para testes responsivos
- Interactions para testes de interação
- Tabelas de props geradas automaticamente

**Como Usar**:

- Automático: Todas as stories com tag `autodocs` geram documentação
- Controls aparecem automaticamente no painel lateral
- Actions capturam eventos automaticamente

**Exemplo**:

```tsx
const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"], // Gera documentação automática
  parameters: {
    docs: {
      description: {
        component: "Button component description",
      },
    },
  },
};
```

**Configuração**: Já configurado em `.storybook/preview.tsx`

---

### 3. @storybook/addon-a11y

**Versão**: ^10.0.3

**Descrição**: Testes de acessibilidade com verificação WCAG 2.1 AA.

**Funcionalidades**:

- Verificação automática de acessibilidade
- 60+ regras WCAG 2.1 AA configuradas
- Relatórios detalhados de violações
- Testes de contraste de cores
- Validação de ARIA attributes
- Keyboard navigation testing

**Como Usar**:

- Painel "Accessibility" aparece automaticamente em cada story
- Violações são mostradas em tempo real
- Configurado para modo "todo" (não falha CI, apenas mostra)

**Regras Configuradas**:

- Text Alternatives (image-alt, object-alt, etc.)
- Keyboard Accessible (keyboard, keyboard-navigation, etc.)
- Color Contrast (4.5:1 para texto normal)
- ARIA Attributes (aria-allowed-attr, aria-required-attr, etc.)
- E muito mais (60+ regras)

**Configuração**: Detalhada em `.storybook/preview.tsx` (linhas 18-320)

**Documentação**: [ACCESSIBILITY.md](./ACCESSIBILITY.md)

---

### 4. @storybook/addon-vitest

**Versão**: ^10.0.3

**Descrição**: Integração com Vitest para testes unitários nas stories.

**Funcionalidades**:

- Executar testes Vitest dentro do Storybook
- Testes de stories com Playwright
- Integração com coverage reports
- Testes em browser real

**Como Usar**:

```bash
# Testes unitários
npm run test

# Testes com coverage
npm run test:coverage

# Testes em watch mode
npm run test:watch
```

**Configuração**: Configurado em `vite.config.ts` com projeto separado para Storybook tests

---

### 5. @storybook/addon-mcp

**Versão**: ^0.1.8

**Descrição**: Model Context Protocol para integração com AI agents.

**Funcionalidades**:

- API MCP server em `http://localhost:6006/mcp`
- AI agents podem interagir com Storybook
- Listagem de componentes e stories
- Captura de screenshots
- Metadata de componentes

**Como Usar**:

1. Iniciar Storybook: `npm run storybook`
2. MCP server disponível em `http://localhost:6006/mcp`
3. Configurar AI agents para conectar ao endpoint

**API Endpoints Disponíveis**:

- `list-all-components` - Lista todos os componentes
- `get-component-info` - Metadata detalhada
- `capture-screenshot` - Screenshots para visual testing
- `get-story-info` - Informações de stories

**Configuração**:

- Adicionar ao `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "storybook": {
      "type": "http",
      "url": "http://localhost:6006/mcp"
    }
  }
}
```

**Documentação**: [MCP_STRATEGY.md](./MCP_STRATEGY.md) (a ser criado)

---

### 6. @storybook/addon-measure

**Versão**: ^9.0.8

**Descrição**: Medição de elementos na tela. Útil para verificar dimensões, espaçamentos e alinhamentos.

**Funcionalidades**:

- Medir distâncias entre elementos
- Verificar dimensões de componentes
- Validar espaçamentos
- Verificar alinhamentos

**Como Usar**:

- Painel "Measure" aparece na toolbar do Storybook
- Ativar/desativar com o botão na toolbar
- Clicar e arrastar para medir elementos

**Casos de Uso**:

- Validar espaçamentos do design system
- Verificar alinhamentos
- Medir gaps entre elementos
- Validar padding e margins

---

### 7. @storybook/addon-outline

**Versão**: ^9.0.8

**Descrição**: Visualização de outlines de elementos. Útil para debug de layout e estrutura.

**Funcionalidades**:

- Mostrar outlines de todos os elementos
- Visualizar estrutura de componentes
- Debug de layout
- Identificar elementos sem conteúdo

**Como Usar**:

- Painel "Outline" aparece na toolbar
- Ativar/desativar com o botão
- Visualiza outlines de todos os elementos DOM

**Casos de Uso**:

- Debug de layout
- Verificar estrutura de componentes
- Identificar elementos vazios
- Validar hierarquia visual

---

### 8. @storybook/addon-designs

**Versão**: ^11.1.1

**Descrição**: Integração com designs do Figma. Permite visualizar designs lado a lado com implementação.

**Funcionalidades**:

- Embed de designs do Figma
- Comparação visual design vs código
- Links para designs originais
- Sincronização de design tokens

**Como Usar**:

```tsx
export const Primary: Story = {
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/...",
    },
  },
};
```

**Configuração**:

- Requer token do Figma (opcional para designs públicos)
- Configurar em cada story que precisa de design link

**Casos de Uso**:

- Comparar implementação com design
- Referência rápida ao design original
- Validação visual
- Documentação de design decisions

**Documentação**: Integração via MCP - veja [MCP_AUTOMATIONS.md](./MCP_AUTOMATIONS.md)

---

### 9. @storybook/addon-coverage

**Versão**: ^3.0.0

**Descrição**: Visualização de code coverage dentro do Storybook.

**Funcionalidades**:

- Mostrar coverage de código
- Identificar código não testado
- Visualizar coverage por componente
- Integração com Vitest coverage

**Como Usar**:

1. Executar testes com coverage: `npm run test:coverage`
2. Painel "Coverage" aparece no Storybook
3. Visualizar coverage por arquivo/componente

**Configuração**:

- Integrado com Vitest coverage
- Configurado em `vite.config.ts`

**Casos de Uso**:

- Identificar componentes sem testes
- Validar cobertura de testes
- Priorizar testes
- Monitorar qualidade de código

---

### 10. storybook-addon-performance

**Versão**: ^0.17.3

**Descrição**: Métricas de performance de componentes. Mede render time, re-renders e performance.

**Funcionalidades**:

- Medir tempo de renderização
- Detectar re-renders desnecessários
- Métricas de performance
- Comparar performance entre versões

**Como Usar**:

- Painel "Performance" aparece automaticamente
- Métricas são coletadas automaticamente
- Visualizar métricas por componente

**Casos de Uso**:

- Identificar componentes lentos
- Otimizar performance
- Validar otimizações
- Monitorar regressões de performance

---

## Configuração Global

### Viewport

Configurado em `.storybook/preview.tsx`:

- Mobile: 375x667
- Tablet: 768x1024
- Desktop: 1280x800
- Desktop Large: 1920x1080

### Backgrounds

Backgrounds configurados:

- Light: #ffffff
- Dark: #1a1a1a
- Gray: #f5f5f5

### Controls

- Expanded por padrão
- Ordenação: requiredFirst
- Matchers para color e date

### Docs

- TOC (Table of Contents) habilitado
- Source code visível
- Type: "code"

## Boas Práticas

### 1. Sempre Use autodocs

```tsx
tags: ["autodocs"]; // Gera documentação automática
```

### 2. Configure Design Links

Para componentes com design no Figma:

```tsx
parameters: {
  design: {
    type: 'figma',
    url: 'https://...',
  },
}
```

### 3. Teste Acessibilidade

Sempre verifique o painel de acessibilidade:

- Corrija violações críticas
- Documente violações conhecidas se necessário

### 4. Use Measure para Espaçamentos

Valide espaçamentos usando o addon Measure:

- Verifique padding/margin
- Valide gaps
- Confirme alinhamentos

### 5. Monitore Performance

Use o addon Performance para:

- Identificar componentes lentos
- Validar otimizações
- Monitorar regressões

## Troubleshooting

### Addon não aparece

1. Verifique se está instalado: `npm list @storybook/addon-xxx`
2. Verifique se está no array de addons em `.storybook/main.ts`
3. Reinicie o Storybook: `npm run storybook`

### MCP não conecta

1. Verifique se Storybook está rodando: `http://localhost:6006`
2. Verifique se MCP está ativo: `http://localhost:6006/mcp`
3. Verifique configuração em `.cursor/mcp.json`

### Coverage não aparece

1. Execute testes com coverage: `npm run test:coverage`
2. Verifique configuração em `vite.config.ts`
3. Certifique-se que coverage está habilitado

### Performance não mede

1. Verifique se addon está instalado
2. Verifique se está no array de addons
3. Reinicie Storybook

## Recursos Adicionais

- [Documentação Oficial do Storybook](https://storybook.js.org/)
- [Addon Catalog](https://storybook.js.org/addons)
- [Storybook 10 Migration Guide](https://storybook.js.org/docs/migration-guide)

## Próximos Passos

1. Configurar Figma MCP Server para sync automático
2. Criar scripts de automação usando MCP
3. Expandir uso do addon-coverage
4. Implementar métricas de performance no CI/CD
