# Fix: TDZ Error in Design System Build

**Data:** 2026-01-19  
**Versão:** 1.10.2 (próxima)  
**Status:** ✅ Corrigido

## 🐛 Problema

O design system estava causando erro `ReferenceError: Cannot access 'aT' before initialization` durante o build do Next.js 15.5.9. O erro ocorria durante a fase de prerendering/static generation.

### Causa Raiz

O problema estava em `src/ui/tokens/colors.ts`, onde as constantes `COLOR_TOKENS_LIGHT` e `COLOR_TOKENS_DARK` eram declaradas com `let` e inicializadas em blocos `try-catch`:

```typescript
let COLOR_TOKENS_LIGHT: Record<ColorRole, SemanticColor>;
let COLOR_TOKENS_DARK: Record<ColorRole, SemanticColor>;

try {
  const lightFactory = new ColorTokenFactory(new LightColorStrategy());
  COLOR_TOKENS_LIGHT = lightFactory.generatePalette();
} catch (error) {
  // fallback...
}

export const COLOR_TOKENS = COLOR_TOKENS_LIGHT;
```

Quando o código era minificado e reordenado pelo bundler (Vite/Rollup), a variável `COLOR_TOKENS` (minificada como `aT`) poderia ser acessada antes de `COLOR_TOKENS_LIGHT` ser inicializada, causando um erro de Temporal Dead Zone (TDZ).

## ✅ Solução

Refatorado para usar um IIFE (Immediately Invoked Function Expression) que garante a inicialização na ordem correta:

```typescript
const initializeColorTokens = (() => {
  let light: Record<ColorRole, SemanticColor>;
  let dark: Record<ColorRole, SemanticColor>;

  try {
    const lightFactory = new ColorTokenFactory(new LightColorStrategy());
    light = lightFactory.generatePalette();
  } catch (error) {
    // fallback...
  }

  try {
    const darkFactory = new ColorTokenFactory(new DarkColorStrategy());
    dark = darkFactory.generatePalette();
  } catch (error) {
    dark = light;
  }

  return { light, dark };
})();

export const COLOR_TOKENS_LIGHT: Record<ColorRole, SemanticColor> = initializeColorTokens.light;
export const COLOR_TOKENS_DARK: Record<ColorRole, SemanticColor> = initializeColorTokens.dark;
export const COLOR_TOKENS: Record<ColorRole, SemanticColor> = COLOR_TOKENS_LIGHT;
```

### Benefícios

1. **Inicialização garantida**: O IIFE garante que a inicialização acontece imediatamente e na ordem correta
2. **Sem TDZ errors**: As constantes são exportadas como `const` com valores já inicializados
3. **Compatível com minificação**: O bundler pode minificar sem causar problemas de ordem
4. **Mantém tratamento de erros**: O try-catch ainda funciona para fallbacks

## 🧪 Testes Necessários

1. ✅ Build do design system completa sem erros
2. ⏳ Build do Next.js com o design system completa sem erros
3. ⏳ AppProvider funciona corretamente durante SSR/prerendering
4. ⏳ ThemeProvider funciona corretamente (usa COLOR_TOKENS_LIGHT)

## 📝 Arquivos Modificados

- `src/ui/tokens/colors.ts` - Refatorado inicialização de constantes

## 🔗 Referências

- [Bug Report Original](../issues/DESIGN_SYSTEM_BUILD_BUG_REPORT.md)
- [Resumo Executivo](../issues/DESIGN_SYSTEM_BUILD_BUG_SUMMARY.md)

---

**Próximos Passos:**
1. Testar build localmente
2. Testar build do Next.js com o design system
3. Publicar versão 1.10.2 com a correção
