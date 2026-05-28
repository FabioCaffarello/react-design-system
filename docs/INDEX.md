# Índice de Documentação - React Design System

Índice completo de toda a documentação do React Design System.

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

### Testes

- [**TESTING_STRATEGY.md**](./TESTING_STRATEGY.md) - Estratégia completa de testes
- [**E2E_TESTING.md**](./E2E_TESTING.md) - Testes end-to-end com Playwright

### Design Tokens

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

## 📚 Por Tópico

### Para Começar

1. [STORYBOOK_GUIDE.md](./STORYBOOK_GUIDE.md)
2. [ARCHITECTURE.md](./ARCHITECTURE.md)

### Para Desenvolvedores

1. [ADVANCED_COMPOSITION.md](./ADVANCED_COMPOSITION.md)
2. [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)
3. [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md)

### Para Designers

1. [CATEGORIZATION_GUIDE.md](./CATEGORIZATION_GUIDE.md)

## 🔍 Busca Rápida

### Quero...

**...entender addons**: [STORYBOOK_ADDONS.md](./STORYBOOK_ADDONS.md)

**...escrever testes**: [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)

**...otimizar performance**: [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md)

**...compor componentes**: [ADVANCED_COMPOSITION.md](./ADVANCED_COMPOSITION.md)

**...validar arquitetura**: [ARCHITECTURE.md](./ARCHITECTURE.md)

## 📊 Estatísticas

- **Documentação completa** de todos os aspectos do design system
- **Testes E2E** configurados com Playwright

## 🆘 Precisa de Ajuda?

1. Consulte o documento relevante acima
2. Verifique [Troubleshooting](./STORYBOOK_ADDONS.md#troubleshooting) nos guias
3. Veja [ARCHITECTURE.md](./ARCHITECTURE.md) para visão geral da arquitetura

## 🔗 Links Externos

- [GitHub Repository](https://github.com/fabiocaffarello/react-design-system)
- [Storybook Live](https://fabiocaffarello.github.io/react-design-system)
- [NPM Package](https://www.npmjs.com/package/@fabio.caffarello/react-design-system)
