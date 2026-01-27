# Bug Report: ReferenceError durante Build do Next.js com Design System v1.10.1

**Data:** 2026-01-19  
**Severidade:** Bloqueante (P0)  
**Status:** Aberto - Aguardando Correção  
**Versão do Design System:** `@fabio.caffarello/react-design-system@1.10.1`  
**Versão do Next.js:** `15.5.9`  
**Versão do React:** `19.0.3`

---

## 📋 Resumo Executivo

O pacote `@fabio.caffarello/react-design-system@1.10.1` está causando erro de build no Next.js 15.5.9 durante a fase de prerendering/static generation. O erro `ReferenceError: Cannot access 'aT' before initialization` indica um problema de ordem de inicialização no código transpilado do design system.

**Impacto:** Build de produção completamente bloqueado - aplicação não pode ser deployada.

---

## 🔍 Descrição Detalhada do Bug

### Erro Observado

```
Error occurred prerendering page "/_not-found". Read more: https://nextjs.org/docs/messages/prerender-error
ReferenceError: Cannot access 'aT' before initialization
    at Object.c (.next/server/chunks/152.js:130:14337)
    at 6165 (.next/server/chunks/152.js:215:1734)
    at c (.next/server/webpack-runtime.js:1:127)
    at 3792 (.next/server/chunks/152.js:6:17848)
    at c (.next/server/webpack-runtime.js:1:127)
    at 4369 (.next/server/chunks/152.js:130:14579)
    at c (.next/server/webpack-runtime.js:1:127)
    at 7705 (.next/server/chunks/152.js:215:76861)
    at c (.next/server/webpack-runtime.js:1:127)
    at 2161 (.next/server/app/(features)/challenges/page.js:1:2131) {
  digest: '1396495851'
}
```

### Contexto

- O erro ocorre durante a fase de **"Generating static pages"** do build do Next.js
- O problema está relacionado ao código minificado/transpilado do design system (variável `aT`)
- O erro acontece mesmo quando o `AppProvider` está em um componente client (`'use client'`)
- O stack trace aponta para chunks do design system sendo carregados durante o prerendering

### Análise Técnica

O erro `Cannot access 'aT' before initialization` é um **ReferenceError** de Temporal Dead Zone (TDZ) em JavaScript. Isso indica que:

1. Uma variável/constante está sendo acessada antes de ser inicializada
2. O problema está no código transpilado/minificado do design system
3. A ordem de inicialização dos módulos está incorreta durante o build do Next.js
4. Pode ser causado por:
   - Dependências circulares entre módulos
   - Ordem incorreta de exports/imports no build
   - Problema com tree-shaking que remove código necessário
   - Conflito entre ESM e CommonJS no build

---

## 🔬 Passos para Reproduzir

### Ambiente

```json
{
  "next": "15.5.9",
  "react": "19.0.3",
  "react-dom": "19.0.3",
  "@fabio.caffarello/react-design-system": "1.10.1"
}
```

### Configuração do Next.js

```javascript
// next.config.js
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@fabio.caffarello/react-design-system'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        worker_threads: false,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
      };
    }
    return config;
  },
};
```

### Código de Exemplo

```tsx
// src/app/layout.tsx (Server Component)
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

```tsx
// src/app/providers.tsx (Client Component)
'use client';

import React from 'react';
import { AppProvider } from '@fabio.caffarello/react-design-system';

export function Providers({ children }) {
  return (
    <AppProvider
      config={{
        theme: { defaultTheme: 'light' },
        providers: {
          theme: true,
          config: true,
          toast: true,
          dialog: true,
        },
      }}
    >
      {children}
    </AppProvider>
  );
}
```

```tsx
// src/app/(features)/challenges/page.tsx
'use client';

import { ChallengeList } from '@/features/challenges/components/ChallengeList';

export const dynamic = 'force-dynamic';

export default function ChallengesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Challenges</h1>
      <ChallengeList />
    </div>
  );
}
```

### Comando para Reproduzir

```bash
npm run build
# ou
next build
```

### Resultado Esperado

Build completo sem erros.

### Resultado Atual

```
✓ Compiled successfully in 9.4s
✓ Checking validity of types ...
⚠ Collecting page data ...
⚠ Generating static pages (0/7) ...
❌ Error occurred prerendering page "/_not-found"
   ReferenceError: Cannot access 'aT' before initialization
```

---

## 🔍 Análise da Causa Raiz (Hipóteses)

### Hipótese 1: Dependência Circular

O design system pode ter dependências circulares entre módulos que causam problemas durante o bundling do Next.js.

**Evidência:**
- O erro ocorre em chunks específicos (152.js, 965.js)
- Stack trace mostra múltiplas chamadas recursivas através do webpack-runtime

### Hipótese 2: Problema com Tree-Shaking

O build do design system pode estar removendo código necessário devido a tree-shaking agressivo.

**Evidência:**
- A versão 1.10.1 incluiu configurações de tree-shaking no Vite
- O erro menciona variáveis minificadas (`aT`) que podem ter sido removidas incorretamente

### Hipótese 3: Conflito ESM/CommonJS

Pode haver um conflito entre módulos ESM e CommonJS no build do design system.

**Evidência:**
- O design system exporta tanto ESM quanto CJS
- Next.js usa webpack que precisa resolver ambos os formatos

### Hipótese 4: Ordem de Inicialização de Context Providers

Os providers do design system (ThemeProvider, ConfigProvider, etc.) podem ter dependências de inicialização que não são respeitadas durante o SSR.

**Evidência:**
- O erro ocorre especificamente durante o prerendering
- O AppProvider compõe múltiplos providers que podem ter dependências entre si

---

## 🛠️ Workarounds Tentados (Sem Sucesso)

### 1. Configuração de Webpack

```javascript
webpack: (config) => {
  config.ignoreWarnings = [
    { module: /node_modules\/@fabio\.caffarello\/react-design-system/ },
  ];
  return config;
}
```

**Resultado:** Não resolve o problema.

### 2. Desabilitar Static Generation

```tsx
export const dynamic = 'force-dynamic';
```

**Resultado:** Não resolve - o erro ainda ocorre durante o prerendering.

### 3. Otimização de Imports

```javascript
experimental: {
  optimizePackageImports: ['@fabio.caffarello/react-design-system'],
}
```

**Resultado:** Não resolve - pode até piorar o problema.

### 4. Página not-found Customizada

Criar uma página `not-found.tsx` sem usar o design system.

**Resultado:** Não resolve - o erro ocorre em outras páginas também.

---

## ✅ Comportamento Esperado

1. O build do Next.js deve completar com sucesso
2. O design system deve funcionar corretamente durante SSR/prerendering
3. Não deve haver erros de inicialização durante o build

---

## 📊 Impacto

### Impacto Atual

- ❌ **Bloqueante:** Build de produção completamente falhando
- ❌ **Deploy:** Impossível fazer deploy da aplicação
- ❌ **CI/CD:** Pipeline de build quebrado
- ⚠️ **Desenvolvimento:** Build local funciona, mas build de produção falha

### Impacto se não Corrigido

- Aplicação não pode ser deployada em produção
- Time bloqueado esperando correção
- Necessidade de remover o design system (workaround extremo)

---

## 🔗 Informações Adicionais

### Logs Completos do Build

```
▲ Next.js 15.5.9
  - Experiments (use with caution):
    · optimizePackageImports

  Creating an optimized production build ...
✓ Compiled successfully in 9.4s
  Skipping linting
  Checking validity of types ...
⚠ TypeScript project references are not fully supported. Attempting to build in incremental mode.
  Collecting page data ...
  Generating static pages (0/7) ...
  Generating static pages (1/7) 
  Generating static pages (3/7) 
Error occurred prerendering page "/_not-found". Read more: https://nextjs.org/docs/messages/prerender-error
ReferenceError: Cannot access 'aT' before initialization
    at Object.c (.next/server/chunks/152.js:130:14337)
    at 6165 (.next/server/chunks/152.js:215:1734)
    at c (.next/server/webpack-runtime.js:1:127)
    at 3792 (.next/server/chunks/152.js:6:17848)
    at c (.next/server/webpack-runtime.js:1:127)
    at 4369 (.next/server/chunks/152.js:130:14579)
    at c (.next/server/webpack-runtime.js:1:127)
    at 7705 (.next/server/chunks/152.js:215:76861)
    at c (.next/server/webpack-runtime.js:1:127)
    at 2161 (.next/server/app/(features)/challenges/page.js:1:2131) {
  digest: '1396495851'
}
Export encountered an error on /_not-found/page: /_not-found, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null
```

### Versões Testadas

- ✅ `1.10.0` - Mesmo problema
- ❌ `1.10.1` - Problema persiste
- ⏳ `1.10.2+` - Não testado (não disponível)

### Ambiente de Build

- **OS:** Linux (Docker Alpine)
- **Node:** 20-alpine
- **Build Tool:** Next.js 15.5.9 com webpack
- **Mode:** Production build (`next build`)

---

## 💡 Sugestões de Correção

### 1. Revisar Ordem de Exports no Build

Garantir que todos os exports sejam inicializados na ordem correta, especialmente:
- `AppProvider` e seus providers dependentes
- Context providers que dependem uns dos outros
- Hooks que dependem de contextos

### 2. Verificar Dependências Circulares

Usar ferramentas como `madge` ou `dependency-cruiser` para detectar e quebrar dependências circulares.

### 3. Ajustar Configuração de Tree-Shaking

Revisar a configuração do Vite para garantir que código crítico não seja removido:

```typescript
// vite.config.ts
rollupOptions: {
  treeshake: {
    moduleSideEffects: (id) => {
      // Garantir que providers não sejam removidos
      if (id.includes('providers') || id.includes('AppProvider')) {
        return true;
      }
      return false;
    },
  },
}
```

### 4. Testar Build com Next.js

Adicionar testes de build do Next.js no CI/CD do design system para detectar esses problemas antes de publicar.

### 5. Garantir Compatibilidade SSR

Verificar se todos os providers e componentes funcionam corretamente durante SSR/prerendering.

---

## 📞 Contato

**Time Chronicle:** [Adicionar contato]  
**Reporter:** [Adicionar nome]  
**Issue Tracker:** [Adicionar link se aplicável]

---

## 📝 Checklist para Correção

- [ ] Reproduzir o problema em ambiente isolado
- [ ] Identificar a causa raiz exata (dependência circular, tree-shaking, etc.)
- [ ] Corrigir a ordem de inicialização dos módulos
- [ ] Testar build com Next.js 15.5.9
- [ ] Testar build com React 19.0.3
- [ ] Validar que AppProvider funciona corretamente
- [ ] Adicionar testes de build do Next.js no CI/CD
- [ ] Publicar versão corrigida (1.10.2+)
- [ ] Atualizar changelog com a correção

---

**Última atualização:** 2026-01-19  
**Prioridade:** P0 - Bloqueante  
**Status:** Aguardando correção do time do Design System
