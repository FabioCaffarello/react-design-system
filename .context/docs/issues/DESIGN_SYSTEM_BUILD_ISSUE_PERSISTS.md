# 🚨 Problema Persiste: Erro de Inicialização no Next.js

**Data:** 2026-01-19  
**Versão Testada:** `@fabio.caffarello/react-design-system@1.10.3`  
**Status:** ❌ **PROBLEMA NÃO RESOLVIDO**

---

## 📋 Resumo

O problema de inicialização **persiste na versão 1.10.3**. O erro continua ocorrendo durante o build do Next.js, apenas com uma variável minificada diferente (`aN` ao invés de `aT`).

**Build completamente bloqueado - aplicação não pode ser deployada.**

---

## 🔍 Erro Atual

```
Error occurred prerendering page "/_not-found"
ReferenceError: Cannot access 'aN' before initialization
    at Object.c (.next/server/chunks/325.js:233:1031)
```

**Comparação:**
- **Versão 1.10.1/1.10.2:** `Cannot access 'aT' before initialization`
- **Versão 1.10.3:** `Cannot access 'aN' before initialization` ❌ **Ainda falha**

**Conclusão:** O problema fundamental não foi corrigido. Apenas a variável minificada mudou.

---

## 🔧 Correções Tentadas (Sem Sucesso)

### 1. Reorganização da Ordem de Exports
- ✅ Reorganizado `src/ui/index.ts` em ordem de dependência
- ✅ Reorganizado `src/ui/providers/index.ts` em ordem de dependência
- ❌ **Resultado:** Problema persiste

### 2. Ajustes na Configuração de Build
- ✅ Ajustado `vite.config.ts` para manter providers no bundle principal
- ✅ Configurado tree-shaking para preservar side effects
- ✅ Mantido ToastProvider e DialogProvider no bundle principal
- ❌ **Resultado:** Problema persiste

### 3. Correções de Compatibilidade SSR
- ✅ Adicionadas verificações SSR-safe nos providers
- ✅ Substituído `useMemo` por `useEffect` onde necessário
- ❌ **Resultado:** Problema persiste

### 4. Imports Diretos no AppProvider
- ✅ Alterado AppProvider para importar ToastProvider e DialogProvider diretamente
- ✅ Evitado uso de barrel exports para providers críticos
- ❌ **Resultado:** Problema persiste

---

## 🔬 Análise Técnica

### Causa Raiz Provável

O erro `Cannot access 'aN' before initialization` indica uma **dependência circular** ou **ordem de inicialização incorreta** durante o bundling do Next.js. O problema ocorre:

1. **Durante o build do Next.js** (não durante a execução)
2. **No webpack bundling** (não no Vite build do design system)
3. **Durante o prerendering** (SSR)

### Possíveis Causas

1. **Dependência Circular Real:**
   - `AppProvider` → `ToastProvider` → (algum módulo) → `AppProvider`
   - Não detectada nas análises anteriores

2. **Problema com Barrel Exports:**
   - `src/ui/index.ts` exporta `export * from "./providers"`
   - `src/ui/providers/index.ts` exporta `AppProvider`
   - `AppProvider` importa de `organisms`
   - `src/ui/index.ts` também exporta `export * from "./organisms"`
   - Isso pode criar uma dependência circular durante o bundling

3. **Problema com Code Splitting:**
   - Mesmo mantendo providers no bundle principal, o Next.js pode estar fazendo code splitting de forma incorreta
   - Variáveis minificadas (`aN`, `aT`) sugerem que o problema está no código minificado

4. **Problema com ESM/CommonJS:**
   - O design system exporta tanto ESM quanto CJS
   - Next.js pode estar tendo problemas ao resolver ambos os formatos

---

## 💡 Soluções Alternativas Propostas

### Solução 1: Separar Providers de Organisms

**Abordagem:** Mover `ToastProvider` e `DialogProvider` para `src/ui/providers/` ao invés de `src/ui/organisms/`.

**Vantagens:**
- Elimina dependência de `AppProvider` em `organisms`
- Quebra possível dependência circular
- Agrupa todos os providers em um único local

**Desvantagens:**
- Mudança arquitetural significativa
- Pode quebrar imports existentes
- Requer refatoração de outros componentes

### Solução 2: Exportar AppProvider Separadamente

**Abordagem:** Criar um entry point separado para providers:
- `@fabio.caffarello/react-design-system/providers`

**Vantagens:**
- Não quebra a API existente
- Permite importar providers sem importar organisms
- Reduz dependências circulares

**Desvantagens:**
- Adiciona complexidade para consumidores
- Requer documentação adicional

### Solução 3: Usar Dynamic Imports no AppProvider

**Abordagem:** Usar `React.lazy()` ou dynamic imports para carregar ToastProvider e DialogProvider.

**Vantagens:**
- Quebra dependência circular durante bundling
- Mantém API existente

**Desvantagens:**
- Pode causar problemas de SSR
- Adiciona complexidade ao código
- Pode não resolver o problema fundamental

### Solução 4: Reestruturar Exports

**Abordagem:** Evitar barrel exports para providers, usar exports nomeados diretos.

**Vantagens:**
- Elimina dependências circulares de barrel exports
- Mantém API existente

**Desvantagens:**
- Requer mudanças significativas no código
- Pode quebrar tree-shaking

---

## 🎯 Recomendação

**Solução Recomendada:** **Solução 1 - Separar Providers de Organisms**

Esta é a solução mais limpa e resolve o problema na raiz:

1. Mover `ToastProvider` e `DialogProvider` para `src/ui/providers/`
2. Atualizar imports no `AppProvider`
3. Manter exports em `src/ui/organisms/index.ts` para compatibilidade (re-exportar)
4. Testar build do Next.js

**Justificativa:**
- Resolve a dependência circular arquiteturalmente
- Mantém a API pública (através de re-exports)
- Agrupa providers logicamente
- É a solução mais sustentável a longo prazo

---

## 📝 Próximos Passos

1. **Implementar Solução 1:**
   - Mover `ToastProvider` e `DialogProvider` para `src/ui/providers/`
   - Atualizar imports
   - Adicionar re-exports para compatibilidade

2. **Testar Build:**
   - Executar `npm run build` no design system
   - Executar `npm run test:nextjs` para validar

3. **Publicar Versão:**
   - Incrementar versão para `1.10.4`
   - Publicar no npm
   - Atualizar documentação

---

## 📊 Impacto

### Atual (Com Problema)
- ❌ Build do Next.js completamente bloqueado
- ❌ Aplicação não pode ser deployada
- ❌ Workaround necessário (não ideal)

### Após Correção (Esperado)
- ✅ Build do Next.js funciona corretamente
- ✅ Aplicação pode ser deployada
- ✅ Sem necessidade de workarounds
- ✅ API pública mantida (compatibilidade)

---

**Prioridade:** P0 - Bloqueante  
**Impacto:** Build de produção completamente bloqueado  
**Status:** Requer ação imediata
