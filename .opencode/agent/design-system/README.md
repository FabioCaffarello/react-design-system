# Design System Agents

Agentes especializados para desenvolvimento de design system React seguindo Atomic Design.

## Agent Principal

### DesignSystemArchitect

Orquestrador principal para criação de componentes do design system.

**Uso**:

```bash
opencode --agent DesignSystemArchitect
```

**Capacidades**:

- Cria componentes seguindo Atomic Design
- Orquestra subagents especializados
- Valida qualidade e hierarquia
- Gerencia design tokens
- Cria testes e stories automaticamente

## Subagents Especializados

### ComponentCreator

Cria componentes React seguindo padrões do projeto.

### TestWriter

Escreve testes abrangentes com 80%+ de cobertura.

### StoryWriter

Cria stories do Storybook com variantes e acessibilidade.

### TokenManager

Gerencia design tokens do sistema.

## Context Files

Context files em `.opencode/context/design-system/`:

- `atomic-design.md` - Metodologia Atomic Design
- `component-patterns.md` - Padrões de componentes
- `token-system.md` - Sistema de design tokens
- `storybook-patterns.md` - Padrões de Storybook
- `testing-patterns.md` - Padrões de testes

## Skills

Skills reutilizáveis em `.opencode/skill/design-system/`:

- `atomic-design/` - Skill de Atomic Design
- `component-patterns/` - Skill de padrões
- `token-system/` - Skill de tokens
- `storybook-patterns/` - Skill de Storybook
- `testing-patterns/` - Skill de testes

## Workflow

1. Use `DesignSystemArchitect` para criar componentes
2. Agent analisa requisitos e determina tipo (atom/molecule/organism)
3. Agent descobre padrões existentes
4. Agent cria plano e solicita aprovação
5. Agent delega para subagents especializados
6. Agent valida qualidade e hierarquia
7. Componente completo com testes e stories

## Exemplo de Uso

```bash
opencode --agent DesignSystemArchitect
> "Create a new Badge component with variants primary, secondary, and error"
```

O agent irá:

1. Analisar que Badge é um atom
2. Descobrir padrões de atoms existentes
3. Criar plano com aprovação
4. Criar componente, testes e stories
5. Validar qualidade

## Referências

- Arquitetura: `docs/ARCHITECTURE.md`
- Tokens: `src/ui/tokens/`
- Componentes: `src/ui/{atoms,molecules,organisms}/`
