# Visual Regression Testing com Chromatic

## 📋 Visão Geral

O Chromatic está configurado e pronto para uso! Ele captura automaticamente screenshots de todas as stories e detecta mudanças visuais.

## ✅ Status Atual

- ✅ `@chromatic-com/storybook` instalado (v4.1.2)
- ✅ Addon configurado no `.storybook/main.ts`
- ✅ Scripts npm criados para execução

## 🚀 Como Usar

### 1. Configuração Inicial

#### Obter Project Token

1. Acesse [chromatic.com](https://www.chromatic.com/)
2. Crie uma conta ou faça login
3. Crie um novo projeto ou conecte um repositório existente
4. Copie o **Project Token** fornecido

#### Configurar Token

**Opção 1: Variável de Ambiente (Recomendado)**

```bash
# No seu .env ou .env.local
export CHROMATIC_PROJECT_TOKEN=seu-token-aqui
```

**Opção 2: Passar como Argumento**

```bash
npx chromatic --project-token=seu-token-aqui
```

### 2. Executar Testes Visuais

#### Execução Local

```bash
# Build do Storybook e execução do Chromatic
npm run test:visual

# Ou apenas o Chromatic (após build)
npm run chromatic
```

#### Execução no CI/CD

```bash
# Para CI/CD (não falha se não houver mudanças)
npm run chromatic:ci
```

### 3. Workflow de Desenvolvimento

1. **Desenvolver componente** - Faça suas mudanças
2. **Build Storybook** - `npm run build-storybook`
3. **Executar Chromatic** - `npm run chromatic`
4. **Review visual** - Aprove ou rejeite mudanças no dashboard do Chromatic
5. **Merge PR** - Após aprovação, faça merge

## 📊 O Que o Chromatic Faz

### Captura Automática
- Screenshots de todas as stories
- Múltiplos viewports (mobile, tablet, desktop)
- Estados interativos (quando aplicável)

### Detecção de Mudanças
- Compara screenshots com baseline
- Destaca diferenças visuais
- Calcula diferenças pixel a pixel

### Review Visual
- Interface web para review
- Aprovação/rejeição de mudanças
- Comentários e anotações
- Histórico de mudanças

## 🎯 Configuração Avançada

### Configurar Viewports

O Chromatic usa os viewports configurados no Storybook:

```typescript
// .storybook/preview.tsx
viewport: {
  viewports: {
    mobile: { width: "375px", height: "667px" },
    tablet: { width: "768px", height: "1024px" },
    desktop: { width: "1280px", height: "800px" },
  },
}
```

### Ignorar Stories Específicas

Para ignorar uma story específica:

```typescript
export const MyStory: Story = {
  parameters: {
    chromatic: { disable: true },
  },
};
```

### Configurar Thresholds

Criar arquivo `.chromatic.config.js`:

```javascript
module.exports = {
  // Threshold para diferenças visuais (0-1)
  diffThreshold: 0.01,
  
  // Stories para incluir/excluir
  onlyChanged: true,
  
  // Viewports customizados
  viewports: [
    { width: 375, height: 667 },
    { width: 1280, height: 800 },
  ],
};
```

## 🔧 Integração com CI/CD

### GitHub Actions

Criar `.github/workflows/chromatic.yml`:

```yaml
name: 'Chromatic Visual Tests'

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - run: npm ci
      
      - uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          buildScriptName: build-storybook
          exitZeroOnChanges: true
```

### GitLab CI

Adicionar ao `.gitlab-ci.yml`:

```yaml
chromatic:
  image: node:20
  script:
    - npm ci
    - npm run build-storybook
    - npx chromatic --project-token=$CHROMATIC_PROJECT_TOKEN --exit-zero-on-changes
  only:
    - merge_requests
    - main
```

## 📝 Boas Práticas

### 1. Baseline Inicial
- Execute o Chromatic na branch principal primeiro
- Estabeleça baseline antes de fazer mudanças
- Aprove todas as stories iniciais

### 2. Review Regular
- Revise mudanças visuais em cada PR
- Aprove apenas mudanças intencionais
- Documente mudanças significativas

### 3. Thresholds
- Use thresholds apropriados (0.01-0.05)
- Ajuste para componentes críticos
- Considere diferenças de renderização entre navegadores

### 4. Stories Estáveis
- Evite stories com conteúdo dinâmico (datas, IDs aleatórios)
- Use mocks consistentes
- Desabilite animações quando possível

## 🐛 Troubleshooting

### Erro: "Project token not found"
- Verifique se `CHROMATIC_PROJECT_TOKEN` está configurado
- Ou passe `--project-token` como argumento

### Screenshots diferentes a cada execução
- Verifique conteúdo dinâmico (datas, IDs)
- Use mocks consistentes
- Desabilite animações com `chromatic: { pauseAnimationAtEnd: true }`

### Build muito lento
- Use `onlyChanged: true` para testar apenas stories modificadas
- Configure `storybookBuildDir` para usar build existente

## 📚 Recursos

- [Documentação do Chromatic](https://www.chromatic.com/docs/)
- [Guia de Integração](https://www.chromatic.com/docs/integrations)
- [Best Practices](https://www.chromatic.com/docs/best-practices)

## ✨ Próximos Passos

1. ✅ Configuração básica - CONCLUÍDO
2. ⏳ Obter Project Token e configurar
3. ⏳ Executar primeira captura
4. ⏳ Configurar CI/CD
5. ⏳ Estabelecer baseline
