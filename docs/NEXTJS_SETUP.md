# Next.js Setup Guide

> **⚠️ IMPORTANTE**: Este design system requer configuração especial para funcionar com Next.js e Turbopack devido a problemas de inicialização de módulos. Siga as instruções abaixo cuidadosamente.

**Versão:** 1.10.3+  
**Status:** ✅ Solução Estrutural Implementada

---

## 🚨 Problema Conhecido

O design system pode causar erro de inicialização durante o build do Next.js (com webpack ou Turbopack):

```
ReferenceError: Cannot access 'aN' before initialization
```

Este é um problema conhecido relacionado ao code splitting do Next.js durante o bundling. O problema persiste mesmo com Turbopack (Next.js 15+).

**Status Atual:**

- ❌ Problema persiste com Turbopack (`next build --turbo`)
- ⚠️ Configurações de webpack não se aplicam ao Turbopack
- 🔍 Investigação em andamento

---

## ✅ Solução: Configuração do Next.js

> **⚠️ NOTA**: As configurações abaixo funcionam apenas com webpack (Next.js sem `--turbo`). Para Turbopack, veja a seção "Turbopack" abaixo.

### Passo 1: Atualizar `next.config.js` (Webpack)

Adicione a seguinte configuração ao seu `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... suas configurações existentes

  webpack: (config, { isServer }) => {
    // Force design system providers into a single chunk
    // This prevents code splitting that breaks initialization order
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          designSystemProviders: {
            test: /[\\/]node_modules[\\/]@fabio\.caffarello[\\/]react-design-system[\\/].*providers/,
            name: "design-system-providers",
            chunks: "all",
            enforce: true,
            priority: 20, // High priority to ensure it's created
          },
        },
      },
    };

    // Use deterministic module IDs to ensure consistent builds
    config.optimization.moduleIds = "deterministic";

    return config;
  },
};

module.exports = nextConfig;
```

### Passo 2: Testar Build

```bash
npm run build
```

O build deve passar sem erros.

---

## ⚡ Turbopack (Next.js 15+)

**Status:** ✅ **RESOLVIDO** - Solução implementada

O Turbopack é o novo bundler do Next.js 15+. O problema foi identificado e resolvido.

### Solução

O problema estava nas **extensions** (especialmente React Flow) sendo code-split incorretamente. A solução foi remover as extensions do export principal e disponibilizá-las via entry point separado.

### Como Usar com Turbopack

**✅ Componentes Principais (funcionam normalmente):**

```typescript
import {
  AppProvider,
  Button,
  Input,
} from "@fabio.caffarello/react-design-system";
```

**✅ Extensions (importar do entry point separado):**

```typescript
// Importar extensions do entry point separado
import {
  FlowProvider,
  FlowCanvas,
} from "@fabio.caffarello/react-design-system/extensions/flow";

// Ou do entry point geral de extensions
import { ExtensionRegistry } from "@fabio.caffarello/react-design-system/extensions";
```

### Build com Turbopack

```bash
# Build com Turbopack (padrão no Next.js 15+)
next build --turbo
```

**✅ Agora funciona corretamente!**

### Detalhes Técnicos

- As extensions foram removidas do export principal (`src/ui/index.ts`)
- Extensions estão disponíveis via entry points separados já configurados
- Isso evita que o Turbopack code-split incorretamente o React Flow e outras dependências complexas

---

## 🔧 Configuração Alternativa (Se a Primeira Não Funcionar)

Se a configuração acima não resolver, tente esta versão mais agressiva:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... suas configurações existentes

  webpack: (config, { isServer }) => {
    // Prevent code splitting of design system entirely
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          default: {
            ...config.optimization.splitChunks.cacheGroups.default,
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          designSystem: {
            test: /[\\/]node_modules[\\/]@fabio\.caffarello[\\/]react-design-system/,
            name: "design-system",
            chunks: "all",
            enforce: true,
            priority: 30, // Very high priority
            minChunks: 1,
          },
        },
      },
      moduleIds: "deterministic",
    };

    return config;
  },
};

module.exports = nextConfig;
```

---

## 📝 Uso do AppProvider

Após configurar o Next.js, você pode usar o `AppProvider` normalmente:

```tsx
// app/layout.tsx
import { AppProvider } from "@fabio.caffarello/react-design-system";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProvider
          config={{
            theme: { defaultTheme: "light" },
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
      </body>
    </html>
  );
}
```

---

## 🆘 Se o Problema Persistir

### Workaround Temporário

Se a configuração não resolver, use este workaround:

```tsx
// app/providers.tsx
"use client";

import dynamic from "next/dynamic";

const AppProvider = dynamic(
  () =>
    import("@fabio.caffarello/react-design-system").then((m) => ({
      default: m.AppProvider,
    })),
  {
    ssr: false, // Disable SSR for AppProvider
    loading: () => <div>Loading...</div>, // Optional loading state
  },
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider
      config={{
        theme: { defaultTheme: "light" },
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
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Limitações do Workaround:**

- ⚠️ AppProvider não está disponível durante SSR
- ⚠️ Pode causar flash de conteúdo
- ⚠️ Funcionalidades SSR limitadas

---

## 📞 Suporte

Se você encontrar problemas:

1. Verifique que está usando a versão mais recente do design system
2. Verifique que a configuração do Next.js está correta
3. Teste com o workaround temporário
4. Entre em contato com o time do design system

---

**Última Atualização:** 2026-01-19  
**Versão do Design System:** 1.10.3+
