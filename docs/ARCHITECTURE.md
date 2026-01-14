# Arquitetura do Design System

Este documento descreve a arquitetura completa do design system.

## Visão Geral

O design system é organizado em categorias hierárquicas baseadas no Atomic Design, expandido com categorias adicionais para maior flexibilidade e poder.

## Estrutura de Diretórios

```
src/ui/
├── atoms/          # Componentes básicos indivisíveis
├── molecules/      # Combinações de atoms
├── organisms/      # Componentes complexos
├── templates/      # Layouts de página completos
├── patterns/       # Padrões de design reutilizáveis
├── layouts/        # Componentes de estrutura
├── utilities/      # Componentes utilitários
├── providers/      # Context providers
├── extensions/     # Extensões especializadas
├── tokens/         # Design tokens
└── hooks/          # Custom hooks
```

## Categorias

### Atoms

Componentes básicos e indivisíveis que formam a base do sistema.

**Características:**
- Não podem ser quebrados em componentes menores do design system
- Sem dependências de outros componentes do design system
- Funcionalidade única e simples
- Altamente reutilizáveis

**Exemplos:** Button, Input, Text, Badge, Avatar

### Molecules

Combinações de atoms que formam componentes mais complexos.

**Características:**
- Combina apenas atoms
- Resolve um problema de UI específico
- Reutilizável em múltiplos contextos

**Exemplos:** SearchInput, Card, Form

### Organisms

Componentes complexos que combinam molecules e atoms.

**Características:**
- Combina molecules e atoms
- Componente único e complexo
- Pode ter lógica de negócio
- Resolve problemas complexos de UI

**Exemplos:** Table, DataGrid, CommandPalette, SideNavbar

### Templates

Layouts completos de página que combinam organisms, molecules e atoms.

**Características:**
- Combina múltiplos organisms
- Define estrutura de página completa
- Configurável mas com padrões sensatos
- Inclui slots para conteúdo customizado

**Exemplos:** DashboardLayout, AuthLayout, FormLayout

### Patterns

Padrões de design reutilizáveis que combinam múltiplos componentes.

**Características:**
- Combina múltiplos componentes de forma específica
- Resolve um problema de UX comum
- Documentado com casos de uso
- Inclui exemplos de variações

**Exemplos:** DataTablePattern, FormWizardPattern, SearchAndFilterPattern

### Layouts

Componentes de estrutura de página e grid systems.

**Características:**
- Focam em estrutura e espaçamento
- Não têm lógica de negócio
- Altamente reutilizáveis
- Base para templates

**Exemplos:** Container, Grid, Stack, Flex

### Utilities

Componentes utilitários e helpers visuais.

**Características:**
- Funcionalidade pura, sem UI visual
- Reutilizáveis em múltiplos contextos
- Hooks ou componentes wrapper

**Exemplos:** Portal, FocusTrap, ClickOutside, ScrollLock

### Providers

Context providers para estado global e configuração.

**Características:**
- Gerenciam estado global
- Configuração do design system
- Temas, toast, dialogs, etc.

**Exemplos:** ThemeProvider, ToastProvider, DialogProvider

### Extensions

Extensões especializadas do design system.

**Características:**
- Funcionalidades avançadas
- Dependências externas específicas
- Casos de uso especializados

**Exemplos:** flow/ (React Flow), charts/ (futuro), maps/ (futuro)

## Regras de Importação

### Atoms
- ❌ NÃO pode importar outros atoms, molecules, ou organisms
- ✅ Pode importar tokens, utils, hooks

### Molecules
- ✅ Pode importar atoms
- ❌ NÃO pode importar molecules ou organisms

### Organisms
- ✅ Pode importar molecules e atoms
- ✅ Pode importar organisms (com cuidado)

### Templates
- ✅ Pode importar organisms, molecules, atoms
- ✅ Deve importar pelo menos um organism

### Patterns
- ✅ Pode importar organisms, molecules, atoms
- ✅ Deve combinar pelo menos 2 componentes

### Layouts
- ✅ Pode importar tokens, utils
- ❌ NÃO deve importar componentes de negócio

### Utilities
- ✅ Pode importar tokens, utils, hooks
- ❌ NÃO deve importar componentes visuais

## Design Tokens

Os design tokens são a base visual do sistema:

- **Colors**: Sistema semântico de cores
- **Typography**: Escala tipográfica
- **Spacing**: Sistema de espaçamento (base 4px)
- **Shadows**: Sistema de elevação
- **Radius**: Bordas arredondadas
- **Animations**: Durações e easing

## Hooks

Hooks customizados para funcionalidades reutilizáveis:

- `useCollapsible`: Gerenciamento de estado colapsável
- (outros hooks conforme necessário)

## Validação

Use o script de validação para verificar a arquitetura:

```bash
npm run validate-architecture
```

## Princípios

1. **Composição sobre Configuração**: Prefira compor componentes simples
2. **Reutilização**: Componentes devem ser reutilizáveis
3. **Consistência**: Use design tokens para consistência
4. **Acessibilidade**: Todos os componentes devem ser acessíveis (WCAG 2.1 AA)
5. **Type Safety**: TypeScript estrito em todo o código
6. **Documentação**: Cada componente deve ter stories completas

## Evolução

A arquitetura evolui conforme necessário. Quando adicionar novos componentes:

1. Determine a categoria usando o [Guia de Categorização](./CATEGORIZATION_GUIDE.md)
2. Siga as regras de importação
3. Crie stories completas
4. Execute validação
5. Documente mudanças

## Referências

- [Atomic Design](https://atomicdesign.bradfrost.com/)
- [Guia de Categorização](./CATEGORIZATION_GUIDE.md)
- [Guia do Storybook](./STORYBOOK_GUIDE.md)
