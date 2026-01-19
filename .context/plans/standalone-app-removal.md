# Plano de Remoção: Aplicação Standalone

**Data:** 2026-01-19  
**Versão:** 1.0  
**Status:** Planejado  
**Decisão:** Remover aplicação standalone, manter apenas Storybook

## 📋 Contexto

Foi decidido que a aplicação standalone (Flow Playground) não faz sentido dentro do design system. O Storybook já fornece todas as funcionalidades necessárias para desenvolvimento e testes. Vamos remover os arquivos da aplicação standalone mantendo apenas o Storybook.

## 🎯 Objetivos

1. **Remover arquivos da aplicação standalone** sem quebrar funcionalidades
2. **Manter Storybook funcionando** (usa PlaygroundLayout e helpers)
3. **Simplificar configuração do Vite** (remover modo app)
4. **Limpar dependências** não utilizadas
5. **Atualizar documentação** se necessário

## 📊 Análise de Dependências

### Arquivos a Remover

#### Arquivos da Aplicação Standalone

- ✅ `src/main.tsx` - Entry point da aplicação standalone
- ✅ `src/app.tsx` - Componente principal da aplicação
- ✅ `index.html` - HTML da aplicação standalone
- ❌ `src/style.css` - **MANTER** - Importado pelo Storybook (`.storybook/preview.tsx`)

**✅ CONFIRMADO:** O Storybook importa `src/style.css` em `.storybook/preview.tsx`. Este arquivo deve ser **MANTIDO**.

#### Configurações a Remover/Atualizar

- ✅ `vite.config.ts` - Remover lógica de `isAppMode`
- ✅ Remover referências a `VITE_APP_MODE`
- ✅ Simplificar configuração do servidor

### Arquivos a MANTER (usados pelo Storybook)

#### Componentes Flow Playground

- ✅ `src/ui/extensions/flow/components/PlaygroundLayout.tsx` - **USADO PELO STORYBOOK**
- ✅ `src/ui/extensions/flow/utils/playgroundTemplates.ts` - **USADO PELO STORYBOOK**
- ✅ `src/ui/extensions/flow/utils/playgroundHelpers.ts` - **USADO PELO STORYBOOK**
- ✅ `src/ui/extensions/flow/utils/playgroundSteps.tsx` - **USADO PELO STORYBOOK**

**Evidência:** `src/ui/extensions/flow/organisms/FlowPlayground.stories.tsx` importa:

- `PlaygroundLayout`
- `treeTemplate` (de playgroundTemplates)
- `generateNodeId` (de playgroundHelpers)

#### Estilos

- ✅ `src/styles/` - **USADO PELO STORYBOOK** (importado via `src/style.css`)
- ✅ `src/style.css` - **USADO PELO STORYBOOK** (importado em `.storybook/preview.tsx`)

### Referências a Verificar

1. **Documentação:**
   - `src/docs/GettingStarted.mdx` - Menciona `main.tsx` (linha 52)
   - Verificar outras referências em docs

2. **Configurações:**
   - `vite.config.ts` - Lógica `isAppMode`
   - `package.json` - Scripts relacionados (não há `dev` script, apenas `storybook`)

3. **TypeScript:**
   - `tsconfig.app.json` - Inclui `src/` (pode incluir app.tsx e main.tsx)
   - Verificar se precisa excluir explicitamente

## 🔍 Verificações Necessárias

### 1. Verificar Dependências do Storybook

```bash
# Verificar se Storybook importa src/style.css
grep -r "style.css" .storybook/
grep -r "src/style" .storybook/

# Verificar imports de styles
grep -r "src/styles" .storybook/
```

### 2. Verificar Referências em Código

```bash
# Verificar referências a main.tsx
grep -r "main.tsx" . --exclude-dir=node_modules

# Verificar referências a app.tsx
grep -r "app.tsx" . --exclude-dir=node_modules

# Verificar referências a index.html
grep -r "index.html" . --exclude-dir=node_modules
```

### 3. Verificar Testes

```bash
# Verificar se há testes que dependem da app
find . -name "*.test.*" -exec grep -l "app.tsx\|main.tsx" {} \;
```

## 📝 Plano de Execução

### Fase 1: Análise e Verificação (Dia 1)

#### 1.1 Verificar Dependências do Storybook

- [ ] Verificar se Storybook importa `src/style.css`
- [ ] Verificar se Storybook importa `src/styles/` diretamente
- [ ] Verificar configuração do Storybook (`.storybook/preview.js` ou similar)

#### 1.2 Verificar Referências

- [ ] Buscar todas as referências a `main.tsx`
- [ ] Buscar todas as referências a `app.tsx`
- [ ] Buscar todas as referências a `index.html`
- [ ] Verificar documentação (MDX files)

#### 1.3 Verificar Testes

- [ ] Verificar se há testes que dependem da aplicação
- [ ] Verificar se há testes E2E que usam a aplicação

**Entregáveis:**

- Lista completa de referências
- Relatório de dependências
- Decisão sobre `src/style.css`

### Fase 2: Remoção de Arquivos (Dia 1-2)

#### 2.1 Remover Arquivos da Aplicação

- [ ] Remover `src/main.tsx`
- [ ] Remover `src/app.tsx`
- [ ] Remover `index.html`
- [ ] Decidir sobre `src/style.css` (remover ou manter se Storybook usar)

#### 2.2 Atualizar Configurações

- [ ] Remover lógica `isAppMode` do `vite.config.ts`
- [ ] Simplificar configuração do servidor
- [ ] Remover referências a `VITE_APP_MODE`
- [ ] Atualizar `tsconfig.app.json` se necessário

#### 2.3 Atualizar Documentação

- [ ] Atualizar `src/docs/GettingStarted.mdx` (remover referência a `main.tsx`)
- [ ] Verificar outras documentações
- [ ] Atualizar README se mencionar a aplicação

**Entregáveis:**

- Arquivos removidos
- Configurações atualizadas
- Documentação atualizada

### Fase 3: Validação e Testes (Dia 2)

#### 3.1 Testar Build

- [ ] Executar `npm run build` e verificar se funciona
- [ ] Verificar se não há erros de importação
- [ ] Verificar se build gera corretamente

#### 3.2 Testar Storybook

- [ ] Executar `npm run storybook` e verificar se funciona
- [ ] Verificar se PlaygroundLayout funciona no Storybook
- [ ] Testar stories que usam componentes Flow

#### 3.3 Testar Validações

- [ ] Executar `npm run build:validate`
- [ ] Executar `npm run validate:all`
- [ ] Verificar se não há regressões

**Entregáveis:**

- Build funcionando
- Storybook funcionando
- Validações passando

### Fase 4: Limpeza Final (Dia 2)

#### 4.1 Limpar Referências

- [ ] Verificar se não há referências órfãs
- [ ] Limpar comentários obsoletos
- [ ] Atualizar comentários no código

#### 4.2 Atualizar Documentação

- [ ] Atualizar `.context/docs/` se necessário
- [ ] Atualizar ADRs/RFCs se mencionarem a aplicação
- [ ] Criar changelog entry

**Entregáveis:**

- Código limpo
- Documentação atualizada
- Changelog atualizado

## ✅ Checklist de Remoção

### Arquivos

- [ ] `src/main.tsx` - Removido
- [ ] `src/app.tsx` - Removido
- [ ] `index.html` - Removido
- [ ] `src/style.css` - **MANTIDO** (usado pelo Storybook)

### Configurações

- [ ] `vite.config.ts` - Lógica `isAppMode` removida
- [ ] `vite.config.ts` - Configuração do servidor simplificada
- [ ] `vite.config.ts` - Variável `VITE_APP_MODE` removida
- [ ] `tsconfig.app.json` - Verificado/atualizado se necessário

### Documentação

- [ ] `src/docs/GettingStarted.mdx` - Atualizado
- [ ] Outras documentações - Verificadas
- [ ] README - Verificado/atualizado

### Validação

- [ ] Build funciona (`npm run build`)
- [ ] Storybook funciona (`npm run storybook`)
- [ ] Validações passam (`npm run validate:all`)
- [ ] Testes passam (`npm run test`)

## 🚨 Riscos e Mitigações

### Risco 1: Storybook Depende de `src/style.css`

**Probabilidade:** Média  
**Impacto:** Alto  
**Mitigação:**

- Verificar antes de remover
- Se Storybook usar, manter o arquivo mas remover imports da app
- Ou mover imports para configuração do Storybook

### Risco 2: Referências Órfãs

**Probabilidade:** Baixa  
**Impacto:** Médio  
**Mitigação:**

- Busca completa antes de remover
- Validação após remoção
- Testes abrangentes

### Risco 3: Quebrar Build

**Probabilidade:** Baixa  
**Impacto:** Alto  
**Mitigação:**

- Testar build após cada mudança
- Manter backup dos arquivos
- Reverter se necessário

## 📋 Ordem de Execução Recomendada

1. **Primeiro:** Verificar todas as dependências
2. **Segundo:** Remover arquivos da aplicação
3. **Terceiro:** Atualizar configurações
4. **Quarto:** Testar build e Storybook
5. **Quinto:** Limpar documentação
6. **Sexto:** Validação final

## 🔗 Referências

- [ADR-0001: Build and Distribution Strategy](./adr/0001-build-and-distribution-strategy.md)
- [Implementation Plan](./build-fixes-implementation.md)
- [build-fixes-implementation.md](../docs/completed-changes/build-fixes-implementation.md)

## 📝 Notas

- **PlaygroundLayout e helpers são mantidos** - Usados pelo Storybook
- **Estilos são mantidos** - Usados pelo Storybook
- **Apenas a aplicação standalone é removida** - Entry points e HTML
- **Storybook continua funcionando** - Sem impacto
