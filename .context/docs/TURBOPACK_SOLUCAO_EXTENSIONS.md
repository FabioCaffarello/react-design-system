# Solução Turbopack - Extensions

## Problema Identificado

O build do Next.js com Turbopack falha quando as extensions são exportadas do index principal:

```
ReferenceError: Cannot access 'g7' before initialization
    at __TURBOPACK__module__evaluation__ (.next/server/chunks/ssr/react-design-system_54abb88f._.js:124:3124)
```

## Causa Raiz

O problema está nas **extensions**, especificamente no **React Flow** (`@xyflow/react`). O Turbopack está code-splitting o React Flow incorretamente, causando problemas de inicialização.

## Solução Implementada

### 1. Remoção de Extensions do Index Principal

As extensions foram removidas do export principal (`src/ui/index.ts`) para evitar que sejam code-split incorretamente pelo Turbopack.

**Antes:**
```typescript
// src/ui/index.ts
export * from "./extensions";
```

**Depois:**
```typescript
// src/ui/index.ts
// NOTE: Extensions are exported separately to avoid Turbopack code-splitting issues
// Import extensions from '@fabio.caffarello/react-design-system/extensions' instead
// export * from "./extensions";
```

### 2. Entry Point Separado para Extensions

As extensions já têm um entry point separado configurado em `package.json`:

```json
{
  "exports": {
    "./extensions": {
      "types": "./dist/ui/extensions/index.d.ts",
      "import": "./dist/extensions/index.js",
      "require": "./dist/extensions/index.cjs"
    },
    "./extensions/flow": {
      "types": "./dist/ui/extensions/flow/index.d.ts",
      "import": "./dist/extensions/flow/index.js",
      "require": "./dist/extensions/flow/index.cjs"
    }
  }
}
```

## Como Usar

### Importar Extensions Separadamente

**Antes (não funciona com Turbopack):**
```typescript
import { FlowProvider, FlowCanvas } from '@fabio.caffarello/react-design-system';
```

**Depois (funciona com Turbopack):**
```typescript
// Importar extensions do entry point separado
import { FlowProvider, FlowCanvas } from '@fabio.caffarello/react-design-system/extensions/flow';

// Ou do entry point geral de extensions
import { ExtensionRegistry } from '@fabio.caffarello/react-design-system/extensions';
```

### Importar Componentes Principais

Os componentes principais continuam funcionando normalmente:

```typescript
import { AppProvider, Button, Input } from '@fabio.caffarello/react-design-system';
```

## Resultado

✅ **Build do design system**: PASSA  
✅ **Build do Next.js com Turbopack**: PASSA (sem extensions no index principal)  
✅ **Extensions disponíveis**: Via entry point separado

## Próximos Passos

1. **Documentar** que extensions devem ser importadas separadamente
2. **Atualizar** exemplos e documentação
3. **Considerar** lazy loading de extensions se necessário
4. **Investigar** se há uma forma de fazer extensions funcionarem no index principal

## Notas Técnicas

- O problema ocorre porque o React Flow (`@xyflow/react`) tem dependências complexas que o Turbopack code-split incorretamente
- A solução de entry point separado isola as extensions, evitando o problema
- Esta é uma solução pragmática que mantém a funcionalidade enquanto resolve o problema de build
