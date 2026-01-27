# Tentativa de Correção: Reestruturação de Providers

**Data:** 2026-01-19  
**Versão:** 1.10.3  
**Status:** ❌ **PROBLEMA PERSISTE**

---

## 📋 Resumo

Tentativa de resolver o problema de inicialização circular movendo `ToastProvider` e `DialogProvider` de `src/ui/organisms/` para `src/ui/providers/`. O problema **persiste** mesmo após a reestruturação.

---

## 🔧 Mudanças Implementadas

### 1. Movimentação de Providers

**Arquivos Movidos:**
- `src/ui/organisms/Toast/ToastProvider.tsx` → `src/ui/providers/ToastProvider.tsx`
- `src/ui/organisms/Toast/ToastContext.tsx` → `src/ui/providers/ToastContext.tsx`
- `src/ui/organisms/Dialog/DialogProvider.tsx` → `src/ui/providers/DialogProvider.tsx`
- `src/ui/organisms/Dialog/DialogContext.tsx` → `src/ui/providers/DialogContext.tsx`

### 2. Atualização de Imports

**Arquivos Atualizados:**
- `src/ui/providers/AppProvider.tsx` - Agora importa de `./ToastProvider` e `./DialogProvider`
- `src/ui/providers/index.ts` - Exporta os novos providers
- `src/ui/organisms/Toast/index.ts` - Re-exporta para compatibilidade
- `src/ui/organisms/Dialog/index.ts` - Re-exporta para compatibilidade
- Todos os componentes que usam os providers foram atualizados

### 3. Re-exports para Compatibilidade

Mantidos re-exports em `organisms/Toast/index.ts` e `organisms/Dialog/index.ts` para garantir que código existente continue funcionando.

---

## ❌ Resultado

**Erro Persiste:**
```
ReferenceError: Cannot access 'aN' before initialization
    at Object.c (.next/server/chunks/325.js:1:29760)
```

**Conclusão:** A reestruturação não resolveu o problema. O erro de inicialização circular persiste.

---

## 🔍 Análise

### Por que não funcionou?

1. **Dependência Circular Mais Profunda:**
   - O problema pode estar em uma dependência circular mais profunda
   - Pode envolver outros módulos além dos providers

2. **Problema com Barrel Exports:**
   - `src/ui/index.ts` ainda exporta `export * from "./providers"` e `export * from "./organisms"`
   - Isso pode criar dependências circulares mesmo com providers separados

3. **Problema com Code Splitting:**
   - O Next.js pode estar fazendo code splitting de forma que causa problemas de inicialização
   - Variáveis minificadas (`aN`) sugerem que o problema está no código minificado

4. **Problema com ESM/CommonJS:**
   - O design system exporta tanto ESM quanto CJS
   - Next.js pode estar tendo problemas ao resolver ambos os formatos

---

## 💡 Próximas Tentativas

### Opção 1: Eliminar Barrel Exports para Providers

**Abordagem:** Exportar providers diretamente em `src/ui/index.ts` ao invés de usar `export * from "./providers"`.

**Vantagens:**
- Elimina dependências circulares de barrel exports
- Mantém API pública

**Desvantagens:**
- Requer mudanças significativas no código
- Pode quebrar tree-shaking

### Opção 2: Usar Entry Points Separados

**Abordagem:** Criar entry points separados no `package.json`:
- `@fabio.caffarello/react-design-system/providers`

**Vantagens:**
- Quebra dependências circulares completamente
- Permite importar providers sem importar organisms

**Desvantagens:**
- Adiciona complexidade para consumidores
- Requer documentação adicional

### Opção 3: Investigar Dependências Circulares Mais Profundas

**Abordagem:** Usar ferramentas como `madge` ou `dependency-cruiser` para detectar todas as dependências circulares.

**Vantagens:**
- Identifica o problema real
- Permite correção cirúrgica

**Desvantagens:**
- Pode ser demorado
- Pode revelar problemas arquiteturais maiores

---

## 📊 Status Atual

- ✅ Build do design system passa
- ✅ Todos os exports estão presentes
- ❌ Build do Next.js ainda falha
- ❌ Erro de inicialização persiste

---

**Próximo Passo:** Investigar dependências circulares mais profundas ou considerar soluções alternativas.
