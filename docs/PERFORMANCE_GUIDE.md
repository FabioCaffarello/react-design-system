# Guia de Performance

Este documento descreve estratégias e técnicas para otimizar performance do React Design System.

## Visão Geral

Performance é crítica para um design system. Este guia cobre:

- Otimizações de build
- Code splitting
- Lazy loading
- Bundle size optimization
- Runtime performance

## Build Performance

### Bundle único + entries múltiplas

O bundle principal (`.`) é **um único arquivo, por design** — sem `manualChunks`. Dividir o bundle por categoria reintroduzia um bug de referência cruzada do `cva` entre chunks (o histórico está no cabeçalho de `vite.config.ts`), então tokens, primitives, components e layouts vivem todos no mesmo bundle, sem referências cross-chunk.

A granularidade para o consumidor vem de **entries adicionais**, não de chunks internos:

- `@fabio.caffarello/react-design-system/granular` (issue #208) — a superfície pública emitida como árvore `preserveModules` (`vite.config.granular.ts`); importe um componente folha em rotas sensíveis a tamanho sem puxar o bundle inteiro.
- `@fabio.caffarello/react-design-system/server` (issue #150) — o subconjunto server-safe (RSC), sem o banner `"use client"`.
- `@fabio.caffarello/react-design-system/hooks` (issue #203) — os hooks públicos num bundle sub-1KB.

**Benefícios**:

- Bundle principal estável (sem o bug de cross-chunk do `cva`)
- Tree-shaking real via `./granular` para imports folha
- RSC via `./server` sem cruzar a fronteira client

### Lazy Loading de Stories

Stories pesadas podem ser carregadas sob demanda:

```typescript
// .storybook/main.ts
stories: [
  "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  // Stories pesadas podem ser lazy loaded
];
```

### Tree Shaking

O Vite já otimiza tree shaking automaticamente. Para garantir:

```typescript
// Use named exports
export { Button } from "./Button";
export { Input } from "./Input";

// Evite barrel exports muito grandes
// ❌ export * from './all-components';
```

## Runtime Performance

### React.memo

Componentes já usam `React.memo` quando apropriado:

```tsx
export const Button = React.memo(function Button({ ... }) {
  // ...
});
```

### useMemo e useCallback

Use para valores e funções computadas:

```tsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

### Virtualização

Para listas grandes, use virtualização:

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

// Virtualize long lists
```

## Bundle Size

### Análise de Bundle

```bash
npm run build
npx vite-bundle-visualizer
```

### Otimizações

1. **Evite dependências pesadas**
2. **Use imports específicos**
3. **Code splitting**
4. **Tree shaking**

## Storybook Performance

### Selective Addon Loading

Carregue apenas addons necessários em desenvolvimento:

```typescript
// .storybook/main.ts
addons: process.env.NODE_ENV === "production"
  ? [
      /* all addons */
    ]
  : [
      /* essential addons only */
    ];
```

### Lazy Story Loading

Stories podem ser carregadas sob demanda.

### Build Optimization

```bash
# Build otimizado
npm run build-storybook

# Verificar tamanho
du -sh storybook-static
```

## Métricas

### Build Time

- **Target**: < 30s
- **Atual**: Medir com `time npm run build`

### Bundle Size

- **Target**: < 500KB gzipped
- **Medir**: `npm run build && gzip -c dist/index.js | wc -c`

### Storybook Load Time

- **Target**: < 3s
- **Medir**: Lighthouse ou Performance API

## Monitoring

### Performance Addon

Use `storybook-addon-performance` para monitorar:

```typescript
// Já configurado
"storybook-addon-performance";
```

### Lighthouse CI

Integre Lighthouse para métricas contínuas:

```yaml
# .github/workflows/performance.yml
- name: Lighthouse CI
  run: |
    npm run build-storybook
    lhci autorun
```

## Best Practices

### 1. Lazy Load Components Pesados

```tsx
const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

### 2. Otimize Imagens

Use formatos modernos (WebP, AVIF) e lazy loading.

### 3. Minimize Re-renders

Use React.memo, useMemo, useCallback apropriadamente.

### 4. Code Split por Rota/Categoria

Separe código por funcionalidade.

### 5. Monitor Regularmente

Execute análises de performance regularmente.

## Troubleshooting

### Build lento

1. Verifique dependências
2. Use cache do Vite
3. Considere parallel builds
4. Otimize imports

### Bundle grande

1. Analise com bundle visualizer
2. Identifique dependências pesadas
3. Use code splitting
4. Remova código não usado

### Runtime lento

1. Use React DevTools Profiler
2. Identifique componentes lentos
3. Otimize re-renders
4. Use memoization

## Recursos

- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Bundle Analysis](https://www.npmjs.com/package/vite-bundle-visualizer)
