# Guia de Categorização de Componentes

Este guia ajuda a determinar em qual categoria um componente deve ser colocado no design system.

## Árvore de Decisão

Use esta árvore de decisão para categorizar componentes:

```
1. É um componente básico indivisível?
   ├─ Sim → atoms/
   └─ Não → 2

2. Combina apenas atoms?
   ├─ Sim → molecules/
   └─ Não → 3

3. Combina molecules e atoms, mas é um componente único?
   ├─ Sim → organisms/
   └─ Não → 4

4. É um layout completo de página?
   ├─ Sim → templates/
   └─ Não → 5

5. É um padrão de design específico (combinação de múltiplos componentes)?
   ├─ Sim → patterns/
   └─ Não → 6

6. É apenas estrutura/espaçamento?
   ├─ Sim → layouts/
   └─ Não → 7

7. É funcionalidade sem UI visual?
   ├─ Sim → utilities/
   └─ Não → 8

8. É um provider de contexto?
   ├─ Sim → providers/
   └─ Não → 9

9. É uma extensão especializada?
   └─ Sim → extensions/
```

## Categorias

### Atoms (`src/ui/atoms/`)

**Critérios:**
- ✅ Componente básico e indivisível
- ✅ Não pode ser quebrado em componentes menores do design system
- ✅ Sem dependências de outros componentes do design system
- ✅ Funcionalidade única e simples
- ✅ Reutilizável em múltiplos contextos

**Exemplos:**
- `Button` - Botão básico
- `Input` - Campo de entrada
- `Text` - Texto
- `Badge` - Badge simples
- `Avatar` - Avatar

**Não são Atoms:**
- ❌ Componentes que importam outros atoms/molecules/organisms
- ❌ Componentes com lógica de negócio complexa
- ❌ Componentes que são combinações de outros componentes

### Molecules (`src/ui/molecules/`)

**Critérios:**
- ✅ Combina apenas atoms
- ✅ Resolve um problema de UI específico
- ✅ Pode ser usado em múltiplos contextos
- ✅ Não é um layout completo de página

**Exemplos:**
- `SearchInput` - Input + Icon
- `Card` - Container + Content
- `Form` - Múltiplos inputs organizados

**Não são Molecules:**
- ❌ Combina molecules ou organisms
- ❌ Layout completo de página
- ❌ Padrão de design específico

### Organisms (`src/ui/organisms/`)

**Critérios:**
- ✅ Combina molecules e atoms
- ✅ Componente único e complexo
- ✅ Pode ter lógica de negócio
- ✅ Resolve um problema complexo de UI

**Exemplos:**
- `Table` - Tabela completa com sorting, pagination
- `DataGrid` - Grid de dados complexo
- `CommandPalette` - Paleta de comandos
- `SideNavbar` - Navegação lateral completa

**Não são Organisms:**
- ❌ Layout completo de página (use `templates/`)
- ❌ Padrão de design específico (use `patterns/`)

### Templates (`src/ui/templates/`)

**Critérios:**
- ✅ Combina múltiplos organisms
- ✅ Define estrutura de página completa
- ✅ Configurável mas com padrões sensatos
- ✅ Inclui slots para conteúdo customizado

**Exemplos:**
- `DashboardLayout` - Layout completo de dashboard
- `AuthLayout` - Layout de autenticação
- `FormLayout` - Layout de formulário
- `DetailPageLayout` - Layout de página de detalhes

**Não são Templates:**
- ❌ Componentes individuais (use `organisms/`)
- ❌ Padrões de design (use `patterns/`)

### Patterns (`src/ui/patterns/`)

**Critérios:**
- ✅ Combina múltiplos componentes de forma específica
- ✅ Resolve um problema de UX comum
- ✅ Documentado com casos de uso
- ✅ Inclui exemplos de variações

**Exemplos:**
- `DataTablePattern` - Table + Pagination + Filters + Actions
- `FormWizardPattern` - Stepper + Form + Validation
- `SearchAndFilterPattern` - SearchInput + Filters + Results
- `MasterDetailPattern` - List + Detail View

**Não são Patterns:**
- ❌ Componentes únicos (use `organisms/`)
- ❌ Layouts completos (use `templates/`)

### Layouts (`src/ui/layouts/`)

**Critérios:**
- ✅ Focam em estrutura e espaçamento
- ✅ Não têm lógica de negócio
- ✅ Altamente reutilizáveis
- ✅ Base para templates

**Exemplos:**
- `Container` - Container com max-width
- `Grid` - Sistema de grid
- `Stack` - Layout vertical/horizontal
- `Flex` - Layout flexível

**Não são Layouts:**
- ❌ Componentes com lógica de negócio
- ❌ Componentes visuais complexos

### Utilities (`src/ui/utilities/`)

**Critérios:**
- ✅ Funcionalidade pura, sem UI visual
- ✅ Reutilizáveis em múltiplos contextos
- ✅ Hooks ou componentes wrapper

**Exemplos:**
- `Portal` - Portal para modals
- `FocusTrap` - Trap de foco
- `ClickOutside` - Detectar clique fora
- `ScrollLock` - Bloquear scroll

**Não são Utilities:**
- ❌ Componentes com UI visual
- ❌ Componentes de estrutura (use `layouts/`)

### Providers (`src/ui/providers/`)

**Critérios:**
- ✅ Context providers para estado global
- ✅ Configuração do design system
- ✅ Gerenciamento de tema, toast, etc.

**Exemplos:**
- `ThemeProvider` - Provider de tema
- `ToastProvider` - Provider de toast
- `DialogProvider` - Provider de dialog
- `FormProvider` - Provider de formulário

### Extensions (`src/ui/extensions/`)

**Critérios:**
- ✅ Extensões especializadas do design system
- ✅ Funcionalidades avançadas
- ✅ Dependências externas específicas

**Exemplos:**
- `flow/` - Componentes de flow/graph
- `charts/` - Componentes de gráficos (futuro)
- `maps/` - Componentes de mapas (futuro)

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

## Exemplos de Categorização

### Exemplo 1: Button
- **Categoria:** `atoms/`
- **Razão:** Componente básico, indivisível, sem dependências de outros componentes

### Exemplo 2: SearchInput
- **Categoria:** `molecules/`
- **Razão:** Combina Input (atom) + Icon (atom)

### Exemplo 3: Table
- **Categoria:** `organisms/`
- **Razão:** Combina múltiplos molecules e atoms, componente complexo

### Exemplo 4: DashboardLayout
- **Categoria:** `templates/`
- **Razão:** Layout completo de página, combina SideNavbar (organism) + Container (layout)

### Exemplo 5: DataTablePattern
- **Categoria:** `patterns/`
- **Razão:** Combina Table + Pagination + Search + Actions, resolve problema comum de UX

### Exemplo 6: Container
- **Categoria:** `layouts/`
- **Razão:** Foca em estrutura e espaçamento, sem lógica de negócio

### Exemplo 7: Portal
- **Categoria:** `utilities/`
- **Razão:** Funcionalidade pura sem UI visual

## Validação

Use o script de validação para verificar se os componentes seguem as regras:

```bash
npm run validate-architecture
```

Este script verifica:
- Regras de importação
- Categorização correta
- Dependências apropriadas

## Perguntas Frequentes

**Q: E se um componente não se encaixa em nenhuma categoria?**
A: Reavalie o componente. Pode ser que precise ser dividido ou que a categorização esteja incorreta.

**Q: Posso mover um componente entre categorias?**
A: Sim, mas isso é uma breaking change. Documente a mudança e atualize todas as importações.

**Q: E se um componente combina características de múltiplas categorias?**
A: Use a categoria mais específica. Se combina organisms, é um template. Se combina componentes de forma específica, é um pattern.
