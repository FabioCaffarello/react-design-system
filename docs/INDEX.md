# Índice de Documentação - React Design System

Índice completo de toda a documentação do React Design System.

## 🚀 Quick Start

- [**QUICK_START_MCP.md**](./QUICK_START_MCP.md) - Comece a usar MCPs em 5 minutos

## 📖 Documentação Principal

### Storybook

- [**STORYBOOK_GUIDE.md**](./STORYBOOK_GUIDE.md) - Guia completo do Storybook
- [**STORYBOOK_ADDONS.md**](./STORYBOOK_ADDONS.md) - Guia completo de todos os addons
- [**VISUAL_REGRESSION_TESTING.md**](./VISUAL_REGRESSION_TESTING.md) - Testes de regressão visual
- [**CHROMATIC_SETUP.md**](./CHROMATIC_SETUP.md) - Setup do Chromatic

### Arquitetura

- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Arquitetura do design system
- [**CATEGORIZATION_GUIDE.md**](./CATEGORIZATION_GUIDE.md) - Guia de categorização
- [**ADVANCED_COMPOSITION.md**](./ADVANCED_COMPOSITION.md) - Padrões de composição avançada

### MCP (Model Context Protocol)

- [**MCP_STRATEGY.md**](./MCP_STRATEGY.md) - Estratégia completa de MCPs
- [**MCP_SETUP.md**](./MCP_SETUP.md) - Setup e configuração
- [**MCP_AUTOMATIONS.md**](./MCP_AUTOMATIONS.md) - Automações disponíveis
- [**DESIGN_SYSTEMS_MCP.md**](./DESIGN_SYSTEMS_MCP.md) - Design Systems MCP
- [**MCP_EXTRACTOR.md**](./MCP_EXTRACTOR.md) - MCP Design System Extractor

### Testes

- [**TESTING_STRATEGY.md**](./TESTING_STRATEGY.md) - Estratégia completa de testes
- [**E2E_TESTING.md**](./E2E_TESTING.md) - Testes end-to-end com Playwright

### Design Tokens

- [**TOKENS_VERSIONING.md**](./TOKENS_VERSIONING.md) - Versionamento de tokens
- [**COLOR_USAGE_GUIDE.md**](../src/ui/tokens/COLOR_USAGE_GUIDE.md) - Guia de uso de cores

### Integração

- [**CDN_DISTRIBUTION.md**](./CDN_DISTRIBUTION.md) - Distribuição via CDN

### Acessibilidade

- [**ACCESSIBILITY.md**](./ACCESSIBILITY.md) - Guia completo de acessibilidade
- [**EVENTS_STATES_GUIDE.md**](./EVENTS_STATES_GUIDE.md) - Guia de eventos e estados

### Performance

- [**PERFORMANCE_GUIDE.md**](./PERFORMANCE_GUIDE.md) - Otimização de performance

### Processos

- [**RELEASE_PROCESS.md**](./RELEASE_PROCESS.md) - Processo de release
- [**CI_CD_PIPELINE.md**](./CI_CD_PIPELINE.md) - Pipeline CI/CD

## 🔧 Scripts Disponíveis

### Validação

```bash
npm run validate:all              # Todas as validações
npm run validate-stories          # Valida stories
npm run validate-architecture    # Valida arquitetura
npm run validate-a11y             # Valida acessibilidade
npm run validate-themes           # Valida temas
```

### Geração

```bash
npm run generate-story-index      # Índice de stories
npm run generate-context-diagram # Diagrama de contextos
npm run generate-component-registry # Registry de componentes
```

### MCP

```bash
npm run mcp:health-check          # Valida conexão MCP
npm run mcp:generate-docs         # Gera documentação via MCP
npm run mcp:figma-sync-tokens     # Sync tokens do Figma
npm run mcp:validate-architecture # Valida arquitetura via MCP
npm run mcp:extract-metadata      # Extrai metadata
npm run mcp:sync-all              # Sync completo
npm run mcp:validate-all          # Validação completa
```

### Testes

```bash
npm run test                      # Testes unitários
npm run test:coverage             # Testes com coverage
npm run test:e2e                 # Testes E2E
npm run test:e2e:ui              # E2E com UI
npm run test:e2e:debug           # E2E em modo debug
npm run test:visual              # Visual regression
```

### Migração

A migração de tokens é gerenciada através da API de versioning em `src/ui/tokens/versioning.ts`.

## 📚 Por Tópico

### Para Começar

1. [QUICK_START_MCP.md](./QUICK_START_MCP.md)
2. [STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md)
3. [ARCHITECTURE.md](./ARCHITECTURE.md)

### Para Desenvolvedores

1. [ADVANCED_COMPOSITION.md](./ADVANCED_COMPOSITION.md)
2. [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
3. [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md)

### Para Designers

1. [TOKENS_VERSIONING.md](./TOKENS_VERSIONING.md)
2. [CATEGORIZATION_GUIDE.md](./CATEGORIZATION_GUIDE.md)

### Para Automação

1. [MCP_STRATEGY.md](./MCP_STRATEGY.md)
2. [MCP_AUTOMATIONS.md](./MCP_AUTOMATIONS.md)
3. [MCP_SETUP.md](./MCP_SETUP.md)

## 🔍 Busca Rápida

### Quero...

**...usar MCPs**: [QUICK_START_MCP.md](./QUICK_START_MCP.md)

**...entender addons**: [STORYBOOK_ADDONS.md](./STORYBOOK_ADDONS.md)

**...escrever testes**: [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

**...otimizar performance**: [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md)

**...integrar Figma**: [MCP_AUTOMATIONS.md](./MCP_AUTOMATIONS.md) (via MCP)

**...migrar tokens**: [TOKENS_VERSIONING.md](./TOKENS_VERSIONING.md)

**...compor componentes**: [ADVANCED_COMPOSITION.md](./ADVANCED_COMPOSITION.md)

**...validar arquitetura**: [ARCHITECTURE.md](./ARCHITECTURE.md)

**...automatizar tarefas**: [MCP_AUTOMATIONS.md](./MCP_AUTOMATIONS.md)

## 📊 Estatísticas

- **Documentação completa** de todos os aspectos do design system
- **9 scripts** de automação MCP
- **8 scripts** de geração/validação
- **Testes E2E** configurados com Playwright

## 🆘 Precisa de Ajuda?

1. Consulte o documento relevante acima
2. Verifique [Troubleshooting](./STORYBOOK_ADDONS.md#troubleshooting) nos guias
3. Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para visão geral da arquitetura

## 🔗 Links Externos

- [GitHub Repository](https://github.com/fabiocaffarello/react-design-system)
- [Storybook Live](https://fabiocaffarello.github.io/react-design-system)
- [NPM Package](https://www.npmjs.com/package/@fabio.caffarello/react-design-system)
