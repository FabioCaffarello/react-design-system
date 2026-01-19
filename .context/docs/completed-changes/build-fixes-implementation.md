# Mudanças Implementadas: Correções Estruturais do Build

**Data:** 2026-01-19  
**Status:** Implementado - Aguardando Testes

## ✅ Mudanças Realizadas

### 1. package.json - Remoção de Exports Condicionais

**Antes:**
```json
{
  "exports": {
    ".": {
      "import": {
        "development": "./src/ui/index.ts",  // ← Removido
        "default": "./dist/index.js"
      }
    }
  },
  "files": ["dist", "src"]  // ← Removido "src"
}
```

**Depois:**
```json
{
  "exports": {
    ".": {
      "types": "./dist/ui/index.d.ts",
      "import": "./dist/index.js",      // ← Sempre transpilado
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist", "README.md", "LICENSE"]  // ← Apenas build
}
```

**Impacto:**
- ✅ Elimina necessidade de `transpilePackages` no Next.js
- ✅ Comportamento consistente em todos os ambientes
- ✅ Builds mais rápidos para consumidores

### 2. vite.config.ts - Preservação de Exports

**Mudanças:**
- Adicionado `exports: "named"` para preservar todos os exports nomeados
- Configurado `treeshake.moduleSideEffects` para preservar exports de `src/ui/`
- Ajustado `manualChunks` para não separar o entry point principal

**Configuração Adicionada:**
```typescript
rollupOptions: {
  output: {
    exports: "named",  // ← Preserva todos os exports nomeados
  },
  treeshake: {
    moduleSideEffects: (id) => {
      // Preserva todos os side effects de src/ui/
      if (id.includes('src/ui/')) {
        return true;
      }
      return false;
    },
    propertyReadSideEffects: true,
  },
}
```

**Impacto:**
- ✅ Garante que todos os exports sejam incluídos no build
- ✅ Previne tree-shaking agressivo que remove exports não usados
- ✅ Especialmente importante para AppProvider e outros providers

### 3. Script de Validação de Build

**Novo arquivo:** `scripts/validate-build-exports.ts`

**Funcionalidades:**
- Compara exports do source (`src/ui/index.ts`) com o build (`dist/index.js`)
- Verifica exports críticos (AppProvider, ConfigProvider, ThemeProvider, Button, Input, Text)
- Falha o build se exports críticos estiverem faltando
- Integrado no script de build

**Uso:**
```bash
npm run build:validate
```

**Integração:**
```json
{
  "scripts": {
    "build": "... && npm run build:validate",
    "build:validate": "tsx scripts/validate-build-exports.ts"
  }
}
```

**Impacto:**
- ✅ Previne regressões onde exports são removidos acidentalmente
- ✅ Validação automatizada no CI/CD
- ✅ Feedback imediato durante desenvolvimento

### 4. Scripts de Build Atualizados

**Novos scripts:**
```json
{
  "build": "npm run build:types && npm run build:js && npm run build:validate",
  "build:types": "npx tsc --project tsconfig.app.json --declaration --emitDeclarationOnly --outDir dist",
  "build:js": "vite build",
  "build:validate": "tsx scripts/validate-build-exports.ts"
}
```

**Benefícios:**
- ✅ Build modular (types, js, validate)
- ✅ Validação automática após build
- ✅ Facilita debugging de problemas de build

## 📋 Checklist de Implementação

- [x] Remover exports condicionais do `package.json`
- [x] Atualizar `files` array (remover `src`)
- [x] Configurar Vite para preservar exports
- [x] Adicionar configuração de tree-shaking
- [x] Criar script de validação
- [x] Integrar validação no build
- [ ] Testar build completo (aguardando correção de erros TypeScript)
- [ ] Verificar AppProvider no build
- [ ] Testar em projeto Next.js limpo
- [ ] Validar tree-shaking funciona

## ⚠️ Próximos Passos

### Imediato
1. **Corrigir erros TypeScript** que impedem o build completo
   - Vários erros de tipos em componentes
   - Erros de imports não utilizados
   - Necessário para testar as mudanças

2. **Executar build completo**
   ```bash
   npm run build
   ```

3. **Validar exports**
   ```bash
   npm run build:validate
   ```

### Curto Prazo
1. **Verificar AppProvider no build**
   - Confirmar que AppProvider está em `dist/index.js`
   - Testar importação em projeto de teste

2. **Testar em Next.js**
   - Criar projeto Next.js limpo
   - Instalar design system
   - Verificar que não precisa de `transpilePackages`
   - Testar importação de AppProvider

### Médio Prazo
1. **Atualizar versão**
   - Bump para v2.0.0 (breaking change)
   - Atualizar changelog
   - Preparar release notes

2. **Documentação**
   - Atualizar guia de migração
   - Documentar breaking changes
   - Criar exemplos de uso

## 🔍 Validação Atual

**Status do Script de Validação:**
```
❌ Missing critical exports in build:
   - AppProvider
   - ConfigProvider
   - ThemeProvider
   - Button
   - Input
   - Text
```

**Observação:** O build atual (de 11 de janeiro) não contém esses exports. Após corrigir os erros TypeScript e executar um novo build com as configurações atualizadas, esses exports devem estar presentes.

## 📝 Notas Técnicas

### Por que AppProvider não estava no build?

1. **Tree-shaking agressivo**: Vite/Rollup remove exports que não são usados internamente
2. **Falta de configuração**: Não havia configuração explícita para preservar exports
3. **Manual chunks**: Pode ter separado providers em chunks diferentes

### Como as mudanças resolvem?

1. **`exports: "named"`**: Força preservação de exports nomeados
2. **`moduleSideEffects: true` para src/ui/`**: Previne tree-shaking de módulos do design system
3. **Validação automatizada**: Detecta problemas antes de publicar

## 🔗 Referências

- [ADR-0001: Build and Distribution Strategy](./adr/0001-build-and-distribution-strategy.md)
- [ADR-0002: Provider Exports in Production Build](./adr/0002-provider-exports-in-build.md)
- [RFC-0001: Removal of Conditional Development Exports](./rfc/0001-conditional-exports-removal.md)
- [Implementation Plan](../../plans/build-fixes-implementation.md)
