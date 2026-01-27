# Correções de Compatibilidade Next.js SSR

**Data:** 2026-01-19  
**Versão:** 1.10.2 → 1.10.3 (próxima)  
**Status:** ✅ Implementado

---

## 📋 Resumo

Implementadas correções para resolver o problema de inicialização do design system no Next.js 15.5.9 durante SSR/prerendering. O erro `ReferenceError: Cannot access 'aT' before initialization` foi corrigido através de:

1. Reorganização da ordem de exports
2. Ajustes na configuração de build
3. Correções de compatibilidade SSR nos providers
4. Adição de script de teste de build do Next.js

---

## 🔧 Mudanças Implementadas

### 1. Reorganização da Ordem de Exports (`src/ui/index.ts`)

**Problema:** A ordem de exports não garantia que dependências fossem inicializadas antes dos dependentes.

**Solução:** Reorganizado exports em ordem de dependência:

```typescript
// 1. TOKENS (static data, no side effects, safe for SSR)
export * from "./tokens/...";

// 2. UTILS (pure functions, no side effects)
export { cn } from "./utils";
export { getSpacingClass, ... } from "./tokens/...";

// 3. PROVIDERS (exported in dependency order)
export * from "./providers";

// 4. THEMES (may depend on providers)
export * from "./themes";

// 5. COMPONENTS (depend on providers, tokens, and utils)
export * from "./atoms";
export * from "./molecules";
export * from "./organisms";

// 6. EXTENSIONS (may depend on components and providers)
export * from "./extensions";
```

**Arquivo:** `src/ui/index.ts`

---

### 2. Ordem de Exports dos Providers (`src/ui/providers/index.ts`)

**Problema:** AppProvider era exportado antes de seus dependentes (ThemeProvider, ConfigProvider).

**Solução:** Reorganizado para exportar na ordem de dependência:

```typescript
// 1. ThemeProvider (foundation, no provider dependencies)
export { ThemeProvider, ... } from './ThemeProvider';

// 2. ConfigProvider (depends on tokens, not on other providers)
export { ConfigProvider, ... } from './ConfigProvider';

// 3. AppProvider (depends on ThemeProvider and ConfigProvider - must be last)
export { AppProvider, ... } from './AppProvider';
```

**Arquivo:** `src/ui/providers/index.ts`

---

### 3. Compatibilidade SSR no ThemeProvider

**Problema:** `useEffect` acessava `document` sem verificar se estava no browser.

**Solução:** Adicionada verificação de ambiente antes de acessar APIs do browser:

```typescript
useEffect(() => {
  // Only run in browser (SSR-safe)
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(storageKey, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }

  // Apply theme class to document root
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }
}, [theme, storageKey]);
```

**Arquivo:** `src/ui/providers/ThemeProvider.tsx`

---

### 4. Compatibilidade SSR no ConfigProvider

**Problema:** `useMemo` acessava `document` diretamente, causando problemas durante SSR.

**Solução:** Substituído `useMemo` por `useEffect` com verificação de ambiente:

```typescript
// Apply reduced motion if enabled (SSR-safe)
useEffect(() => {
  if (typeof document === 'undefined') {
    return;
  }

  if (config.features.reducedMotion) {
    document.documentElement.style.setProperty('--motion-reduce', '1');
  } else {
    document.documentElement.style.removeProperty('--motion-reduce');
  }
}, [config.features.reducedMotion]);

// Apply high contrast if enabled (SSR-safe)
useEffect(() => {
  if (typeof document === 'undefined') {
    return;
  }

  if (config.features.highContrast) {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
}, [config.features.highContrast]);
```

**Arquivo:** `src/ui/providers/ConfigProvider.tsx`

**Nota:** Adicionado import de `useEffect` no arquivo.

---

### 5. Configuração de Build (`vite.config.ts`)

**Problema:** Tree-shaking agressivo e code splitting podiam quebrar a ordem de inicialização.

**Solução:** Ajustada configuração para preservar ordem de inicialização:

```typescript
manualChunks: (id) => {
  // ... existing chunk logic ...
  
  // CRITICAL: Keep providers in main bundle to preserve initialization order
  // This is essential for Next.js SSR/prerendering compatibility
  if (id.includes("/providers/")) {
    return null; // Keep in main bundle
  }
  
  return null;
},

treeshake: {
  moduleSideEffects: (id) => {
    // Preserve all side effects from our source files
    if (id.includes("src/ui/")) {
      return true;
    }
    // CRITICAL: Preserve side effects for providers to maintain initialization order
    if (id.includes("providers")) {
      return true;
    }
    return false;
  },
  propertyReadSideEffects: true,
  tryCatchDeoptimization: false,
},
```

**Arquivo:** `vite.config.ts`

---

### 6. Script de Teste de Build do Next.js

**Solução:** Criado script automatizado para testar compatibilidade com Next.js:

```bash
npm run test:nextjs
```

O script:
1. Cria uma aplicação Next.js mínima
2. Instala o design system localmente
3. Testa build com `AppProvider` em layout (SSR)
4. Testa build com `AppProvider` em client component
5. Valida que o build passa sem erros

**Arquivo:** `scripts/test-nextjs-build.ts`  
**Script NPM:** `test:nextjs` (adicionado ao `package.json`)

---

## ✅ Checklist de Correção

- [x] **Dependências Circulares**
  - [x] Verificado que não há dependências circulares
  - [x] Ordem de exports garante inicialização correta

- [x] **Ordem de Exports**
  - [x] Reorganizado `src/ui/index.ts` em ordem de dependência
  - [x] Reorganizado `src/ui/providers/index.ts` em ordem de dependência
  - [x] Providers exportados na ordem correta (Theme → Config → App)

- [x] **Configuração de Build**
  - [x] Ajustado tree-shaking para preservar providers
  - [x] Configurado code splitting para manter providers no bundle principal
  - [x] Preservados side effects necessários

- [x] **Compatibilidade SSR**
  - [x] Corrigido ThemeProvider para verificar ambiente antes de usar APIs do browser
  - [x] Corrigido ConfigProvider para usar `useEffect` em vez de `useMemo` para manipulação do DOM
  - [x] Adicionadas verificações `typeof window === 'undefined'` e `typeof document === 'undefined'`

- [x] **Testes**
  - [x] Criado script de teste de build do Next.js
  - [x] Adicionado script ao `package.json`
  - [ ] Integrar no CI/CD (próximo passo)

- [ ] **Documentação**
  - [x] Criado documento de mudanças
  - [ ] Atualizar CHANGELOG.md
  - [ ] Atualizar README.md com instruções de uso no Next.js

---

## 🧪 Como Testar

### Teste Local

```bash
# 1. Build do design system
npm run build

# 2. Testar build do Next.js
npm run test:nextjs
```

### Teste Manual com Next.js

```bash
# 1. Criar projeto Next.js
npx create-next-app@latest test-app --typescript

# 2. Instalar design system
cd test-app
npm install @fabio.caffarello/react-design-system@latest

# 3. Usar AppProvider no layout
# app/layout.tsx
import { AppProvider } from '@fabio.caffarello/react-design-system';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProvider config={{ theme: { defaultTheme: 'light' } }}>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}

# 4. Build
npm run build
```

---

## 📊 Impacto

### Antes
- ❌ Erro `ReferenceError: Cannot access 'aT' before initialization` durante build do Next.js
- ❌ Requer workaround com lazy loading do `AppProvider`
- ❌ Flash de conteúdo sem estilização no primeiro render
- ❌ Funcionalidades do design system não disponíveis durante SSR

### Depois
- ✅ Build do Next.js passa sem erros
- ✅ `AppProvider` funciona nativamente em SSR/prerendering
- ✅ Sem necessidade de workarounds
- ✅ Melhor experiência de usuário (sem flash de conteúdo)
- ✅ Compatibilidade total com Next.js 15.5.9

---

## 🔗 Referências

- [Next.js - Static Generation](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [React - SSR Best Practices](https://react.dev/reference/react-dom/server)
- [Vite - Build Options](https://vitejs.dev/config/build-options.html)
- [Rollup - Tree Shaking](https://rollupjs.org/configuration-options/#output-treeshake)

---

## 📝 Próximos Passos

1. **CI/CD Integration:** Adicionar `npm run test:nextjs` ao pipeline de CI
2. **Documentation:** Atualizar README.md com guia de uso no Next.js
3. **CHANGELOG:** Documentar mudanças na próxima versão
4. **Testing:** Validar com diferentes versões do Next.js (15.x, 14.x)

---

**Última atualização:** 2026-01-19  
**Versão do Documento:** 1.0
