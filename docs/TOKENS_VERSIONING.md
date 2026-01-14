# Versionamento de Design Tokens

Este documento descreve o sistema de versionamento de design tokens e como migrar entre versões.

## Visão Geral

O sistema de versionamento de tokens permite:
- Rastrear mudanças em tokens
- Detectar breaking changes
- Gerar guias de migração automáticos
- Validar compatibilidade

## Estrutura de Versionamento

### Versão Atual

A versão atual dos tokens é: **1.8.0**

### Formato de Versão

Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes (tokens removidos, APIs mudadas)
- **MINOR**: Novos tokens adicionados (backward compatible)
- **PATCH**: Correções e ajustes (backward compatible)

## Tipos de Mudanças

### 1. Added (Adicionado)

Novo token adicionado ao sistema.

```typescript
{
  type: 'added',
  category: 'colors',
  token: 'primary.lightest',
  newValue: '#e0e7ff',
  description: 'New lightest shade for primary color'
}
```

### 2. Modified (Modificado)

Token existente teve seu valor alterado.

```typescript
{
  type: 'modified',
  category: 'spacing',
  token: 'md',
  oldValue: '10px',
  newValue: '12px',
  description: 'Increased medium spacing for better visual hierarchy'
}
```

### 3. Deprecated (Deprecated)

Token marcado como deprecated, será removido no futuro.

```typescript
{
  type: 'deprecated',
  category: 'colors',
  token: 'primary.old',
  description: 'Use primary.DEFAULT instead'
}
```

### 4. Removed (Removido)

Token removido do sistema (breaking change).

```typescript
{
  type: 'removed',
  category: 'colors',
  token: 'primary.legacy',
  description: 'Removed in favor of primary.DEFAULT'
}
```

## Breaking Changes

### Severidade

- **major**: Requer mudanças obrigatórias no código
- **minor**: Mudanças recomendadas mas não obrigatórias
- **patch**: Mudanças opcionais

### Exemplo de Breaking Change

```typescript
{
  category: 'colors',
  token: 'primary.legacy',
  reason: 'Token removed in favor of semantic naming',
  migration: `// Before
getColorClass('primary', 'legacy', 'bg')

// After
getColorClass('primary', 'DEFAULT', 'bg')`,
  severity: 'major'
}
```

## Uso do Sistema

### Verificar Versão Atual

```typescript
import { CURRENT_TOKENS_VERSION } from './tokens/versioning';

console.log(CURRENT_TOKENS_VERSION); // '1.8.0'
```

### Obter Mudanças Entre Versões

```typescript
import { getChangesBetweenVersions } from './tokens/versioning';

const changes = getChangesBetweenVersions('1.7.0', '1.8.0');
console.log(changes);
```

### Obter Breaking Changes

```typescript
import { getBreakingChangesBetweenVersions } from './tokens/versioning';

const breakingChanges = getBreakingChangesBetweenVersions('1.7.0', '1.8.0');
if (breakingChanges.length > 0) {
  console.warn('Breaking changes detected!');
}
```

### Verificar se Migração é Necessária

```typescript
import { needsMigration } from './tokens/versioning';

if (needsMigration('1.7.0', '1.8.0')) {
  console.log('Migration required');
}
```

### Gerar Guia de Migração

```typescript
import { generateMigrationGuide } from './tokens/versioning';

const guide = generateMigrationGuide('1.7.0', '1.8.0');
console.log(guide);
```

## Scripts de Migração

### Gerar Guia de Migração

```bash
npm run migrate:tokens
```

Este script:
- Detecta breaking changes
- Gera guia de migração
- Escaneia código para uso de tokens
- Gera relatório de arquivos afetados

### Validar Compatibilidade

```typescript
import { validateTokenCompatibility } from './tokens/versioning';

const isValid = validateTokenCompatibility('primary', 'colors', '1.8.0');
if (!isValid) {
  console.warn('Token is deprecated or removed');
}
```

## Adicionar Nova Versão

Quando fazer mudanças nos tokens:

1. **Criar entrada de versão**:

```typescript
export const TOKEN_VERSIONS: TokenVersion[] = [
  {
    version: '1.9.0',
    timestamp: new Date().toISOString(),
    changes: [
      {
        type: 'added',
        category: 'colors',
        token: 'primary.lightest',
        newValue: '#e0e7ff',
        description: 'New lightest shade'
      }
    ],
    breakingChanges: []
  }
];
```

2. **Atualizar versão atual**:

```typescript
export const CURRENT_TOKENS_VERSION = '1.9.0';
```

3. **Documentar mudanças**:

Adicione descrições claras de todas as mudanças.

## Best Practices

### 1. Sempre Documente Mudanças

Todas as mudanças devem ser documentadas no histórico de versões.

### 2. Evite Breaking Changes

Sempre que possível, adicione novos tokens em vez de modificar existentes.

### 3. Use Deprecation First

Antes de remover um token, marque como deprecated por pelo menos uma versão.

### 4. Forneça Migrações Claras

Sempre forneça exemplos de código para migração.

### 5. Teste Migrações

Teste os scripts de migração antes de fazer release.

## Histórico de Versões

### v1.8.0 (Atual)

- Sistema de versionamento implementado
- Suporte a temas light/dark
- Factory pattern para tokens

### v1.7.0

- Versão base inicial

## Recursos

- [Semantic Versioning](https://semver.org/)
- [Token Migration Scripts](../scripts/migrate-tokens.ts)
- [Token Versioning API](../src/ui/tokens/versioning.ts)
