# Guia de Setup do Chromatic

## 🎯 Objetivo

Configurar Chromatic para visual regression testing no design system.

## ✅ Status da Configuração

- ✅ `@chromatic-com/storybook` instalado
- ✅ Addon configurado no `.storybook/main.ts`
- ✅ Scripts npm criados
- ✅ Arquivo de configuração `.chromatic.config.js` criado
- ✅ GitHub Actions workflow criado

## 📋 Passos para Ativar

### 1. Obter Project Token do Chromatic

1. Acesse [chromatic.com](https://www.chromatic.com/)
2. Faça login ou crie uma conta
3. Crie um novo projeto ou conecte seu repositório GitHub
4. Copie o **Project Token** fornecido

### 2. Configurar Token

#### Para Desenvolvimento Local

Crie um arquivo `.env.local` na raiz do projeto `react-design-system/`:

```bash
CHROMATIC_PROJECT_TOKEN=seu-token-aqui
```

#### Para CI/CD (GitHub Actions)

1. Vá para Settings > Secrets and variables > Actions
2. Adicione um novo secret:
   - Name: `CHROMATIC_PROJECT_TOKEN`
   - Value: seu token do Chromatic

### 3. Testar Localmente

```bash
cd react-design-system

# Build do Storybook
npm run build-storybook

# Executar Chromatic
npm run chromatic
```

### 4. Verificar no Dashboard

1. Acesse o dashboard do Chromatic
2. Verifique se os screenshots foram capturados
3. Aprove as stories iniciais para estabelecer baseline

## 🚀 Uso no CI/CD

O workflow do GitHub Actions está configurado em `.github/workflows/chromatic.yml`.

Ele será executado automaticamente em:
- Pull requests para `main`, `develop`, ou `master`
- Pushes para `main`, `develop`, ou `master`

## 📝 Comandos Disponíveis

```bash
# Executar Chromatic (local)
npm run chromatic

# Executar Chromatic no CI (não falha se não houver mudanças)
npm run chromatic:ci

# Build + Chromatic
npm run test:visual
```

## 🔧 Configuração Avançada

Edite `.chromatic.config.js` para ajustar:
- Threshold de diferenças visuais
- Viewports customizados
- Timeouts e retries
- Outras opções do Chromatic

## 📚 Documentação

- [Guia Completo](./VISUAL_REGRESSION_TESTING.md)
- [Documentação do Chromatic](https://www.chromatic.com/docs/)

## ⚠️ Notas Importantes

1. **Primeira Execução**: Pode demorar mais tempo para capturar todas as stories
2. **Baseline**: Aprove todas as stories na primeira execução
3. **Token**: Mantenha o token seguro, não commite no repositório
4. **CI/CD**: O workflow só funciona após configurar o secret no GitHub
