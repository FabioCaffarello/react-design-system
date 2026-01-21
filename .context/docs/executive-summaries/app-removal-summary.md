# Resumo Executivo: Remoção da Aplicação Standalone

**Data:** 2026-01-19  
**Status:** Planejado - Integrado ao Plano de Implementação

## 📋 Decisão

Remover a aplicação standalone (Flow Playground) do design system, mantendo apenas o Storybook para desenvolvimento e testes.

## 🎯 Justificativa

- **Storybook já fornece todas as funcionalidades** necessárias para desenvolvimento e testes
- **Reduz complexidade** do projeto
- **Clareza de propósito** - design system focado em biblioteca, não aplicação
- **Simplifica manutenção** - menos código para manter

## 📊 Arquivos a Remover

### Arquivos da Aplicação Standalone

- ✅ `src/main.tsx` - Entry point da aplicação
- ✅ `src/app.tsx` - Componente principal da aplicação  
- ✅ `index.html` - HTML da aplicação standalone

### Arquivos a MANTER

- ✅ `src/style.css` - **MANTIDO** - Importado pelo Storybook (`.storybook/preview.tsx`)
- ✅ `src/styles/` - **MANTIDO** - Usado pelo Storybook
- ✅ `src/ui/extensions/flow/components/PlaygroundLayout.tsx` - **MANTIDO** - Usado pelo Storybook
- ✅ `src/ui/extensions/flow/utils/playgroundTemplates.ts` - **MANTIDO** - Usado pelo Storybook
- ✅ `src/ui/extensions/flow/utils/playgroundHelpers.ts` - **MANTIDO** - Usado pelo Storybook

## 🔧 Configurações a Atualizar

### vite.config.ts

- Remover lógica `isAppMode`
- Simplificar configuração do servidor
- Remover variável `VITE_APP_MODE`

### Documentação

- Atualizar `src/docs/GettingStarted.mdx` (remover referência a `main.tsx`)

## ✅ Checklist de Execução

### Fase 1: Verificação

- [x] Confirmar que Storybook usa `src/style.css`
- [x] Confirmar que PlaygroundLayout é usado pelo Storybook
- [x] Identificar todos os arquivos a remover

### Fase 2: Remoção

- [ ] Remover `src/main.tsx`
- [ ] Remover `src/app.tsx`
- [ ] Remover `index.html`
- [ ] Atualizar `vite.config.ts`
- [ ] Atualizar documentação

### Fase 3: Validação

- [ ] Build funciona (`npm run build`)
- [ ] Storybook funciona (`npm run storybook`)
- [ ] Validações passam (`npm run validate:all`)

## 📝 Integração com Plano de Implementação

Esta tarefa está integrada ao [build-fixes-implementation.md](../../plans/build-fixes-implementation.md) como parte do **Dia 5: Validação e Testes + Remoção da Aplicação Standalone**.

## 🔗 Referências

- [Plano Detalhado de Remoção](../../plans/standalone-app-removal.md)
- [Plano de Implementação](../../plans/build-fixes-implementation.md)

## ⚠️ Notas Importantes

1. **`src/style.css` NÃO deve ser removido** - É usado pelo Storybook
2. **Componentes Playground são mantidos** - Usados pelo Storybook
3. **Apenas entry points da aplicação são removidos** - main.tsx, app.tsx, index.html
4. **Storybook continua funcionando normalmente** - Sem impacto
