# Bug Report: Next.js Build Error com Design System

**Data:** 2026-01-19  
**Severidade:** Bloqueante (P0)  
**Status:** Identificado - Requer correção no Design System  
**Versão do Design System:** `@fabio.caffarello/react-design-system@^1.9.0`  
**Versão do Next.js:** `15.5.9`

---

## 📋 Resumo Executivo

O pacote `@fabio.caffarello/react-design-system` está causando erro de build no Next.js porque exporta arquivos TypeScript (`.ts`) diretamente do `src/` que contêm sintaxe TypeScript não transpilada. O Next.js não consegue processar `export type` sem configuração adicional.

**Workaround Aplicado:** Configuração `transpilePackages` no `next.config.js` (solução temporária)

**Solução Recomendada:** Design System deve exportar código JavaScript transpilado ou fornecer builds compatíveis.

---

## 🔍 Análise da Causa Raiz

### Problema Adicional: AppProvider Não Exportado no Dist Build

**Data de Descoberta:** 2026-01-19  
**Severidade:** Bloqueante (P0)

O pacote `@fabio.caffarello/react-design-system@1.9.1` não inclui `AppProvider` (e outros providers) no build de distribuição (`dist/index.js`). 

**Erro Observado:**
```
Attempted import error: 'AppProvider' is not exported from '@fabio.caffarello/react-design-system' (imported as 'AppProvider').
```

**Análise:**
- O arquivo `dist/index.js` não contém `AppProvider`
- O arquivo `src/ui/providers/AppProvider.tsx` existe e está correto
- O arquivo `src/ui/index.ts` exporta `export * from "./providers"` que inclui `AppProvider`
- O `package.json` do design system usa exports condicionais:
  - `development`: usa `./src/ui/index.ts` (contém AppProvider)
  - `default`: usa `./dist/index.js` (NÃO contém AppProvider)

**Workaround Aplicado:**
- Criado componente `Providers` temporário que retorna children diretamente
- AppProvider e funcionalidades relacionadas (theme, config, toast, dialog) estão desabilitadas
- Arquivo: `apps/web/assessment/src/app/providers.tsx`

**Solução Necessária:**
O design system precisa incluir `AppProvider` e todos os providers no build `dist/index.js`.

### Erro Observado (Original)

```
Module parse failed: Unexpected token (2:7)
| export { default as Info } from "./Info/Info";
> export type { InfoProps } from "./Info/Info";
| 
| export { default as Text } from "./Text/Text";
```

**Arquivo problemático:**
```
node_modules/@fabio.caffarello/react-design-system/src/ui/atoms/index.ts
```

**Cadeia de importação:**
```
./src/app/layout.tsx
  → @fabio.caffarello/react-design-system
    → src/ui/index.ts
      → src/ui/atoms/index.ts (ERRO AQUI)
```

### Por que isso acontece?

1. **Next.js não transpila `node_modules` por padrão**
   - Por performance, o Next.js assume que pacotes em `node_modules` já estão transpilados
   - Arquivos `.ts` em `node_modules` não são processados automaticamente

2. **Design System exporta código fonte TypeScript**
   - O pacote está exportando arquivos `.ts` do diretório `src/`
   - Esses arquivos contêm sintaxe TypeScript pura (`export type`, `type`, `interface`, etc.)
   - O webpack não consegue processar essa sintaxe sem transpilação

3. **Falta de build artifacts**
   - O pacote não fornece uma versão transpilada em `dist/` ou `lib/`
   - O `package.json` do design system provavelmente aponta `main`/`exports` para arquivos `.ts`

---

## 🛠️ Workaround Aplicado (Temporário)

### Configuração no `next.config.js`

```javascript
const nextConfig = {
  // ... outras configurações
  transpilePackages: ['@fabio.caffarello/react-design-system'],
};
```

**O que isso faz:**
- Força o Next.js a transpilar o pacote durante o build
- Resolve o erro imediato
- Adiciona overhead no build (transpila código que deveria já estar pronto)

**Limitações:**
- ⚠️ Aumenta o tempo de build
- ⚠️ Pode causar problemas com tree-shaking
- ⚠️ Não é uma solução ideal para produção
- ⚠️ Pode quebrar se o design system usar features não suportadas pelo Next.js

---

## ✅ Solução Recomendada para o Design System

### Opção 1: Build Transpilado (Recomendado)

O design system deve fornecer builds JavaScript transpilados:

**Estrutura recomendada:**
```
@fabio.caffarello/react-design-system/
├── package.json
│   ├── "main": "./dist/index.js"
│   ├── "types": "./dist/index.d.ts"
│   └── "exports": {
│       ".": {
│         "import": "./dist/index.mjs",
│         "require": "./dist/index.js",
│         "types": "./dist/index.d.ts"
│       }
│     }
├── dist/                    ← Build transpilado
│   ├── index.js
│   ├── index.d.ts
│   └── ...
└── src/                     ← Código fonte (não exportado)
    └── ...
```

**Benefícios:**
- ✅ Consumidores não precisam de configuração especial
- ✅ Builds mais rápidos
- ✅ Melhor tree-shaking
- ✅ Compatibilidade universal

### Opção 2: Dual Package (ESM + CJS)

Fornecer builds separados para ESM e CommonJS:

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### Opção 3: TypeScript com Declarações de Tipo Separadas

Se precisar manter `.ts` no build:
- Usar `export type` apenas em arquivos `.d.ts`
- Separar exports de tipos dos exports de valores
- Garantir que o código JavaScript não contenha sintaxe TypeScript

---

## 📝 Checklist para Correção no Design System

### Build & Distribuição

- [ ] Configurar build step que transpila TypeScript → JavaScript
- [ ] Gerar arquivos `.d.ts` para tipos TypeScript
- [ ] Atualizar `package.json` com `main`, `types`, e `exports` corretos
- [ ] Garantir que `src/` não seja exportado (usar `.npmignore` ou `files` no `package.json`)
- [ ] Testar o pacote em um projeto Next.js limpo (sem `transpilePackages`)

### Compatibilidade

- [ ] Testar com Next.js 15.x
- [ ] Testar com React 19.x
- [ ] Verificar compatibilidade com bundlers (webpack, turbopack, esbuild)
- [ ] Garantir tree-shaking funciona corretamente

### Documentação

- [ ] Documentar como consumir o pacote
- [ ] Adicionar exemplos de uso
- [ ] Documentar requisitos de versão (Next.js, React, etc.)

---

## 🔬 Como Reproduzir o Problema

1. **Remover o workaround:**
   ```javascript
   // next.config.js - remover esta linha
   transpilePackages: ['@fabio.caffarello/react-design-system'],
   ```

2. **Tentar build:**
   ```bash
   npm run build
   # ou
   nx run @chronicle/assessment:build
   ```

3. **Erro esperado:**
   ```
   Module parse failed: Unexpected token
   export type { InfoProps } from "./Info/Info";
   ```

---

## 📊 Impacto

### Impacto Atual (com workaround)
- ✅ Aplicação funciona
- ⚠️ Build mais lento
- ⚠️ Configuração não padrão

### Impacto se não corrigir
- ❌ Dependência de workaround permanente
- ❌ Builds mais lentos
- ❌ Possíveis problemas futuros com atualizações do Next.js
- ❌ Dificuldade para outros consumidores do design system

---

## 🔗 Referências

- [Next.js: transpilePackages](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)
- [TypeScript: Publishing Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)
- [npm: package.json exports field](https://nodejs.org/api/packages.html#exports)
- [Next.js: Module Resolution](https://nextjs.org/docs/app/building-your-application/configuring/typescript#module-resolution)

---

## 📞 Contato

**Time de Design System:** [Adicionar contato]  
**Time Chronicle:** [Adicionar contato]  
**Issue Tracker:** [Adicionar link se aplicável]

---

**Última atualização:** 2026-01-19  
**Próxima revisão:** Após correção no Design System
