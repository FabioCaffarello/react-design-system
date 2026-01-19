---
status: filled
generated: 2026-01-19
agents:
  - type: "bug-fixer"
    role: "Analisar e corrigir bugs nos testes falhando"
  - type: "test-writer"
    role: "Corrigir e melhorar testes existentes"
  - type: "frontend-specialist"
    role: "Corrigir problemas de renderização e contexto React"
  - type: "code-reviewer"
    role: "Revisar correções e garantir qualidade"
docs:
  - "testing-strategy.md"
  - "architecture.md"
  - "development-workflow.md"
phases:
  - id: "phase-1"
    name: "Análise e Categorização"
    prevc: "P"
    status: pending
  - id: "phase-2"
    name: "Correção de Testes Unitários"
    prevc: "E"
    status: pending
  - id: "phase-3"
    name: "Correção de Testes Storybook"
    prevc: "E"
    status: pending
  - id: "phase-4"
    name: "Validação e Documentação"
    prevc: "V"
    status: pending
---

# Plano: Corrigir Todos os Testes Falhando

> Plano estratégico para identificar e corrigir todos os testes que estão falhando no projeto, incluindo testes unitários, testes de componentes e testes de stories do Storybook

## Task Snapshot

- **Primary goal:** Corrigir todos os 38+ testes que estão falhando, garantindo que a suíte de testes passe 100% e mantendo a qualidade do código
- **Success signal:** `npm run test` retorna exit code 0 com todos os testes passando
- **Key references:**

  - [Documentation Index](../docs/README.md)
  - [Agent Handbook](../agents/README.md)
  - [Testing Strategy](../docs/testing-strategy.md)

## Análise dos Testes Falhando

### Categoria 1: Hook usePlaygroundHistory (2 testes)

**Arquivo:** `src/ui/extensions/flow/hooks/usePlaygroundHistory.test.ts`

- ❌ `can undo after pushing multiple states` - `undo()` retorna `undefined` ao invés do estado esperado
- ❌ `can redo after undo` - `canRedo` retorna `false` quando deveria ser `true`

**Causa Raiz Identificada:**

- Problema com sincronização entre `historyRef` e `history` state
- Lógica de índice de histórico incorreta após múltiplos `pushState`

### Categoria 2: Componentes Flow - SVG/Context (13 testes)

**Arquivos:**

- `src/ui/extensions/flow/molecules/CustomEdge.test.tsx` (4 testes)
- `src/ui/extensions/flow/molecules/FloatingEdge.test.tsx` (3 testes)
- `src/ui/extensions/flow/components/EdgeEditor.test.tsx` (6 testes)

**Problemas:**

- `edgeTextRef.current.getBBox is not a function` - Mock SVG necessário
- Elementos SVG não renderizando em ambiente de teste
- Falta de `FlowProvider` em alguns testes

### Categoria 3: Componentes Flow - Renderização (10 testes)

**Arquivos:**

- `src/ui/extensions/flow/molecules/FlowNodeToolbar.test.tsx` (4 testes)
- `src/ui/extensions/flow/components/NodeEditor.test.tsx` (6 testes)

**Problemas:**

- `useFlowContext must be used within a FlowProvider` - Falta wrapper de contexto
- Elementos não encontrados - Problemas de renderização condicional

### Categoria 4: Storybook Stories - Interações (15+ testes)

**Arquivos:** Múltiplos `.stories.tsx` com testes "With Events"

- Dialog, Drawer, TableActions, TableFilters, TimePicker, ColorPicker, Timeline, Rating, DataTablePattern, Menu, Pagination, Slider, Stepper

**Problemas:**

- Elementos não encontrados (texto, roles, labels)
- Múltiplos elementos com mesmo texto/role
- Componentes não renderizando em estado inicial esperado
- Timeouts em interações assíncronas

## Agent Lineup

| Agent | Role in this plan | Playbook | First responsibility focus |
| --- | --- | --- | --- |
| Bug Fixer | Analisar erros específicos e identificar causas raiz | [Bug Fixer](../agents/bug-fixer.md) | Analisar logs de erro e stack traces para identificar problemas |
| Test Writer | Corrigir testes e garantir cobertura adequada | [Test Writer](../agents/test-writer.md) | Corrigir testes unitários e adicionar mocks necessários |
| Frontend Specialist | Corrigir problemas de contexto React e renderização | [Frontend Specialist](../agents/frontend-specialist.md) | Adicionar providers necessários e corrigir renderização |
| Code Reviewer | Revisar correções e garantir qualidade | [Code Reviewer](../agents/code-reviewer.md) | Revisar todas as correções antes de commit |

## Documentation Touchpoints

| Guide | File | Primary Inputs | Updates Needed |
| --- | --- | --- | --- |
| Testing Strategy | [testing-strategy.md](../docs/testing-strategy.md) | Estratégia de testes atual | Adicionar seção sobre mocks SVG e contexto Flow |
| Architecture | [architecture.md](../docs/architecture.md) | Arquitetura do sistema | Documentar estrutura de contexto Flow |
| Development Workflow | [development-workflow.md](../docs/development-workflow.md) | Workflow de desenvolvimento | Adicionar checklist de testes antes de commit |

## Risk Assessment

### Identified Risks

| Risk | Probability | Impact | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- |
| Correções podem quebrar funcionalidade existente | Medium | High | Testar manualmente após cada correção, usar TDD | Bug Fixer |
| Testes Storybook podem ser flaky | Medium | Medium | Adicionar waits adequados, usar `findBy` queries | Test Writer |
| Mock SVG pode não cobrir todos os casos | Low | Medium | Testar em múltiplos ambientes, validar com E2E | Frontend Specialist |
| Dependências entre correções | Medium | Low | Priorizar correções independentes primeiro | Bug Fixer |

### Dependencies

- **Internal:** Nenhuma dependência de outros times
- **External:**

  - `@xyflow/react` - Verificar compatibilidade de mocks
  - `@testing-library/react` - Garantir versão compatível

- **Technical:**

  - Ambiente de teste configurado (Vitest + jsdom)
  - Storybook rodando para testes de stories

### Assumptions

- Assumimos que os componentes funcionam corretamente em runtime, apenas os testes precisam ser corrigidos
- Assumimos que não há mudanças necessárias na implementação dos componentes
- Se assumirmos incorretamente, precisaremos revisar a implementação dos componentes também

## Resource Estimation

### Time Allocation

| Phase | Estimated Effort | Calendar Time | Team Size |
| --- | --- | --- | --- |
| Phase 1 - Análise | 0.5 person-days | 1 dia | 1 pessoa |
| Phase 2 - Testes Unitários | 2 person-days | 2-3 dias | 1-2 pessoas |
| Phase 3 - Testes Storybook | 2 person-days | 2-3 dias | 1-2 pessoas |
| Phase 4 - Validação | 0.5 person-days | 1 dia | 1 pessoa |
| **Total** | **5 person-days** | **6-8 dias** | **1-2 pessoas** |

### Required Skills

- Experiência com React Testing Library e Vitest
- Conhecimento de React Context API
- Experiência com SVG e mocks em testes
- Conhecimento de Storybook e testes de interação
- Habilidades de debugging

### Resource Availability

- **Available:** Desenvolvedor principal do projeto
- **Blocked:** Nenhum bloqueio identificado
- **Escalation:** N/A

## Working Phases

### Phase 1 — Análise e Categorização

**Objetivo:** Identificar todas as causas raiz dos testes falhando e categorizar por tipo de problema

#### Phase 1 Steps

1. Executar `npm run test` e capturar output completo
2. Categorizar testes falhando por tipo de erro:
   - Problemas de estado/hook
   - Problemas de contexto React
   - Problemas de renderização SVG
   - Problemas de seletores em Storybook
3. Criar lista priorizada de correções (mais críticas primeiro)
4. Documentar causas raiz identificadas

#### Phase 1 Deliverables

- Documento com categorização completa dos testes
- Lista priorizada de correções
- Análise de causas raiz

#### Phase 1 Commit Checkpoint

- `git commit -m "chore(plan): complete phase 1 analysis of failing tests"`

### Phase 2 — Correção de Testes Unitários

**Objetivo:** Corrigir todos os testes unitários falhando (Categorias 1, 2, 3)

#### Phase 2 Steps

#### 2.1 Corrigir usePlaygroundHistory Hook

1. Analisar lógica de sincronização entre refs e state
2. Corrigir cálculo de `historyIndex` após `pushState`
3. Garantir que `undo()` e `redo()` retornam estados corretos
4. Adicionar testes adicionais para edge cases

#### 2.2 Corrigir Testes SVG (CustomEdge, FloatingEdge)

1. Criar mock para `SVGElement.getBBox()`
2. Adicionar setup adequado para renderização SVG em jsdom
3. Garantir que `ReactFlowProvider` e `FlowProvider` estão presentes
4. Corrigir seletores de elementos SVG

#### 2.3 Corrigir Testes de Componentes Flow

1. Adicionar `FlowProvider` wrapper em todos os testes que precisam
2. Criar helper function para setup de testes com contexto
3. Corrigir seletores que não encontram elementos
4. Adicionar waits adequados para renderização assíncrona

#### Phase 2 Deliverables

- Todos os testes unitários passando
- Helper functions para setup de testes
- Mocks reutilizáveis para SVG

#### Phase 2 Commit Checkpoint

- `git commit -m "fix(tests): correct all unit tests for flow components"`

### Phase 3 — Correção de Testes Storybook

**Objetivo:** Corrigir todos os testes "With Events" falhando em stories

#### Phase 3 Steps

#### 3.1 Análise de Padrões Comuns

1. Identificar padrões comuns de falha (elementos não encontrados, múltiplos elementos)
2. Criar estratégia de correção para cada padrão

#### 3.2 Correção por Componente

1. **Dialog/Drawer:** Adicionar waits para abertura, usar `findByRole` para dialog
2. **TableActions/TableFilters:** Corrigir seletores para elementos únicos
3. **TimePicker/ColorPicker:** Adicionar waits para estados assíncronos
4. **Timeline/Stepper:** Usar seletores mais específicos para evitar múltiplos matches
5. **Rating/Slider:** Corrigir seletores de foco e interação
6. **Menu/Pagination:** Adicionar waits para abertura de menus
7. **DataTablePattern:** Usar seletores mais específicos para células de tabela

#### 3.3 Melhorias Gerais

1. Substituir `getBy*` por `findBy*` onde apropriado
2. Adicionar `waitFor` para operações assíncronas
3. Usar `getAllBy*` + filtros quando múltiplos elementos esperados
4. Adicionar timeouts adequados

#### Phase 3 Deliverables

- Todos os testes Storybook passando
- Documentação de padrões de teste para stories
- Guia de boas práticas para testes de interação

#### Phase 3 Commit Checkpoint

- `git commit -m "fix(tests): correct all Storybook story tests"`

### Phase 4 — Validação e Documentação

**Objetivo:** Validar todas as correções e documentar mudanças

#### Phase 4 Steps

1. Executar suíte completa de testes: `npm run test`
2. Executar testes E2E: `npm run test:e2e`
3. Validar que nenhuma funcionalidade foi quebrada
4. Atualizar documentação de testes com:
   - Padrões de mock para SVG
   - Setup de contexto Flow para testes
   - Boas práticas para testes Storybook
5. Criar ou atualizar guia de troubleshooting de testes

#### Phase 4 Deliverables

- Todos os testes passando (100%)
- Documentação atualizada
- Guia de troubleshooting

#### Phase 4 Commit Checkpoint

- `git commit -m "docs(tests): update testing documentation with fixes and patterns"`

## Rollback Plan

### Rollback Triggers

When to initiate rollback:

- Correções quebram funcionalidade existente
- Testes passam mas componentes não funcionam em runtime
- Introdução de regressões visuais

### Rollback Procedures

#### Phase 1 Rollback

- Action: Descartar análise, manter estado atual
- Data Impact: Nenhum
- Estimated Time: < 5 minutos

#### Phase 2 Rollback

- Action: Reverter commits de correção de testes unitários
- Data Impact: Nenhum
- Estimated Time: < 10 minutos

#### Phase 3 Rollback

- Action: Reverter commits de correção de testes Storybook
- Data Impact: Nenhum
- Estimated Time: < 10 minutos

#### Phase 4 Rollback

- Action: Reverter apenas documentação se necessário
- Data Impact: Nenhum
- Estimated Time: < 5 minutos

### Post-Rollback Actions

1. Documentar razão do rollback
2. Analisar o que deu errado
3. Atualizar plano com lições aprendidas
4. Retentar com abordagem diferente

## Evidence & Follow-up

### Artifacts to Collect

- [ ] Output completo de `npm run test` antes das correções
- [ ] Output completo de `npm run test` após correções
- [ ] Lista de commits com correções
- [ ] Screenshots de testes passando (se aplicável)
- [ ] Documentação atualizada

### Follow-up Actions

- [ ] Revisar cobertura de testes após correções
- [ ] Considerar adicionar testes adicionais para casos edge identificados
- [ ] Atualizar CI/CD para garantir que testes rodem em cada PR
- [ ] Criar checklist de testes para novos componentes

### Success Metrics

- ✅ 100% dos testes passando
- ✅ Zero testes flaky
- ✅ Cobertura de testes mantida ou melhorada
- ✅ Documentação atualizada e útil

## Notas de Implementação

### Padrões de Correção Identificados

#### 1. Mock SVG para Testes

```typescript

// Adicionar ao setupTests.ts
Object.defineProperty(SVGElement.prototype, 'getBBox', {
  value: () => ({ width: 100, height: 100, x: 0, y: 0 }),
  writable: true,
});

```

#### 2. Helper para FlowProvider

```typescript

// Criar em test-utils.tsx
export const renderWithFlowProvider = (ui: React.ReactElement) => {
  return render(
    <ReactFlowProvider>
      <FlowProvider nodes={[]} edges={[]}>
        {ui}
      </FlowProvider>
    </ReactFlowProvider>
  );
};

```

#### 3. Padrão para Testes Storybook

- Sempre usar `findBy*` para elementos que aparecem assincronamente
- Adicionar `waitFor` para operações que mudam estado
- Usar seletores mais específicos quando múltiplos elementos existem
