# Investigação: Problema de Inicialização com Turbopack

## Status
❌ **Problema persiste** mesmo após remover re-exports duplicados de providers

## Erro Atual
```
ReferenceError: Cannot access 'g7' before initialization
    at __TURBOPACK__module__evaluation__ (.next/server/chunks/ssr/react-design-system_54abb88f._.js:124:3124)
```

## Mudanças Implementadas

### 1. Remoção de Re-exports Duplicados
- **Problema**: `src/ui/organisms/Toast/index.ts` e `src/ui/organisms/Dialog/index.ts` re-exportavam `ToastProvider` e `DialogProvider`
- **Solução**: Removidos os re-exports de providers de `organisms/Toast/index.ts` e `organisms/Dialog/index.ts`
- **Resultado**: Build do design system passa, mas Next.js build ainda falha

### 2. Export Explícito em `organisms/index.ts`
- **Problema**: `export * from "./Dialog"` e `export * from "./Toast"` criavam exports duplicados
- **Solução**: Substituído por exports explícitos de apenas componentes (não providers)
- **Resultado**: Elimina duplicação, mas problema persiste

## Análise do Bundle Turbopack

O bundle minificado mostra que o Turbopack está criando módulos separados:
- `react-design-system_dist_index_2d434a8e.js` - módulo principal
- `react-design-system_54abb88f._.js` - módulo interno (providers?)

O erro ocorre durante a avaliação do módulo (`__TURBOPACK__module__evaluation__`), indicando que há uma dependência circular ou ordem de inicialização incorreta.

## Próximos Passos

1. **Investigar o módulo `react-design-system_54abb88f._.js`**
   - Identificar qual código está sendo code-split para este módulo
   - Verificar se há dependências circulares entre módulos

2. **Analisar a ordem de inicialização no bundle**
   - Verificar se o Turbopack está respeitando a ordem de imports
   - Identificar se há algum hoisting ou reordenação de código

3. **Considerar alternativas**:
   - Usar um entry point único para providers
   - Garantir que todos os providers estejam no mesmo chunk
   - Verificar se há configurações do Turbopack que possam ajudar

## Configuração Atual do Next.js

```javascript
const nextConfig = {
  output: 'standalone',
  turbopack: {
    resolveAlias: {
      // Turbopack-specific configuration
    },
  },
};
```

## Observações

- O erro muda de `g8` para `g7` entre builds, indicando que o Turbopack está minificando de forma diferente
- O problema ocorre durante o prerendering, não durante o runtime
- O design system build passa sem erros
- O problema é específico do Turbopack (não testado com webpack ainda)
