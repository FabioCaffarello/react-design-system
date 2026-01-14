# Guias de Migração

Este documento contém guias de migração entre versões do React Design System.

## Visão Geral

Quando há breaking changes ou mudanças significativas entre versões, este documento fornece instruções detalhadas para migrar seu código.

## Estrutura dos Guias

Cada guia de migração inclui:
- **Versão de origem e destino**
- **Breaking changes**
- **Mudanças não-breaking**
- **Passo a passo de migração**
- **Exemplos de código**
- **FAQ**

## Versão 1.8.0 → 1.9.0 (Futuro)

### Breaking Changes

#### 1. Remoção de Componentes Deprecated

**Componentes removidos**:
- `OldButton` (use `Button` instead)
- `LegacyInput` (use `Input` instead)

**Migração**:
```tsx
// ❌ Antes
import { OldButton } from '@fabio.caffarello/react-design-system';

// ✅ Depois
import { Button } from '@fabio.caffarello/react-design-system';
```

#### 2. Mudança na API de Props

**Antes**:
```tsx
<Button variant="primary" size="large" />
```

**Depois**:
```tsx
<Button variant="primary" size="lg" />
```

**Migração automática**:
Use o script de migração:
```bash
npm run migrate:props
```

### Mudanças Não-Breaking

#### 1. Novos Componentes

- `CommandPalette` - Nova adição
- `DataGrid` - Nova adição

#### 2. Melhorias de Performance

- Componentes agora usam `React.memo` por padrão
- Lazy loading implementado para stories pesadas

#### 3. Novos Hooks

- `useTheme` - Hook para acessar tema
- `useMediaQuery` - Hook para media queries

## Versão 1.7.0 → 1.8.0

### Breaking Changes

#### 1. Mudança na Estrutura de Exports

**Antes**:
```tsx
import { Button } from '@fabio.caffarello/react-design-system/atoms';
```

**Depois**:
```tsx
import { Button } from '@fabio.caffarello/react-design-system';
// ou
import { Button } from '@fabio.caffarello/react-design-system/atoms';
```

**Migração**:
As importações antigas ainda funcionam, mas são deprecated. Migre para a nova estrutura.

#### 2. Atualização de Dependências Peer

**React**: `>=18` → `>=19`

**Migração**:
Atualize React para versão 19:
```bash
npm install react@^19 react-dom@^19
```

### Mudanças Não-Breaking

#### 1. Novos Design Tokens

Novos tokens de espaçamento e cores adicionados.

#### 2. Melhorias de Acessibilidade

- Melhor suporte a screen readers
- Melhor navegação por teclado

## Guia de Migração Passo a Passo

### Passo 1: Verificar Versão Atual

```bash
npm list @fabio.caffarello/react-design-system
```

### Passo 2: Ler Changelog

Consulte o `CHANGELOG.md` para ver todas as mudanças.

### Passo 3: Atualizar Dependências

```bash
npm install @fabio.caffarello/react-design-system@latest
```

### Passo 4: Executar Scripts de Migração

Se disponíveis:
```bash
npm run migrate:all
```

### Passo 5: Verificar Breaking Changes

Execute o linter e testes:
```bash
npm run lint
npm run test
```

### Passo 6: Atualizar Código Manualmente

Siga os guias específicos acima para atualizar seu código.

### Passo 7: Testar

Execute testes completos:
```bash
npm run test
npm run test:e2e
```

## Scripts de Migração

### Migração Automática de Props

```bash
npm run migrate:props
```

Este script:
- Detecta uso de props antigas
- Sugere substituições
- Pode aplicar mudanças automaticamente (com confirmação)

### Validação de Migração

```bash
npm run validate:migration
```

Este script:
- Verifica se todas as mudanças foram aplicadas
- Identifica código que precisa de atualização
- Gera relatório de migração

## FAQ

### Como saber se preciso migrar?

Consulte o `CHANGELOG.md` e verifique se há breaking changes entre sua versão atual e a nova.

### Posso pular versões?

Não recomendado. Migre versão por versão para evitar problemas.

### E se eu encontrar um bug durante a migração?

1. Verifique se é um problema conhecido no GitHub Issues
2. Crie um novo issue se necessário
3. Considere reverter temporariamente se crítico

### Quanto tempo leva a migração?

Depende do tamanho do projeto:
- Projeto pequeno: 1-2 horas
- Projeto médio: 4-8 horas
- Projeto grande: 1-2 dias

## Deprecation Warnings

Componentes e APIs deprecated mostrarão warnings no console. Migre o quanto antes para evitar breaking changes futuros.

### Verificar Deprecations

```bash
npm run check:deprecations
```

## Suporte

Se você encontrar problemas durante a migração:

1. Consulte este guia
2. Verifique GitHub Issues
3. Crie um novo issue se necessário
4. Entre em contato com a equipe

## Histórico de Versões

### v1.8.0 (Atual)
- Storybook 10
- MCP integration
- E2E testing setup
- Performance optimizations

### v1.7.0
- React 19 support
- New export structure
- Accessibility improvements

### v1.6.0
- New components
- Design tokens update
- TypeScript improvements

## Próximas Mudanças Planejadas

### v1.9.0 (Planejado)
- Remoção de componentes deprecated
- Nova API de theming
- Performance improvements

## Recursos

- [CHANGELOG.md](../CHANGELOG.md)
- [GitHub Releases](https://github.com/fabiocaffarello/react-design-system/releases)
- [Breaking Changes Policy](./BREAKING_CHANGES_POLICY.md)
