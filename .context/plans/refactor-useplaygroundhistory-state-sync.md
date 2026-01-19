---
status: filled
generated: 2026-01-19
agents:
  - type: "refactoring-specialist"
    role: "Identificar problemas de sincronização e propor solução arquitetural"
  - type: "bug-fixer"
    role: "Analisar testes falhando e identificar causa raiz"
  - type: "frontend-specialist"
    role: "Implementar refatoração seguindo padrões React"
  - type: "test-writer"
    role: "Garantir que testes validem a nova implementação"
  - type: "code-reviewer"
    role: "Revisar qualidade e padrões do código refatorado"
docs:
  - "testing-strategy.md"
  - "architecture.md"
  - "development-workflow.md"
phases:
  - id: "phase-1"
    name: "Análise e Design da Solução"
    prevc: "P"
    status: pending
  - id: "phase-2"
    name: "Implementação da Refatoração"
    prevc: "E"
    status: pending
  - id: "phase-3"
    name: "Validação e Testes"
    prevc: "V"
    status: pending
---

# Refatoração da Sincronização de Estado do usePlaygroundHistory

> Refatorar a lógica de sincronização de estado do hook `usePlaygroundHistory` para corrigir os 2 testes falhando relacionados a undo/redo e sincronização entre refs e state

## Task Snapshot

- **Primary goal:** Refatorar o hook `usePlaygroundHistory` para eliminar problemas de sincronização entre refs e state, garantindo que undo/redo funcionem corretamente em todos os cenários
- **Success signal:** Todos os testes do `usePlaygroundHistory.test.ts` passam, incluindo `can undo after pushing multiple states` e `can redo after undo`
- **Key references:**

  - [Documentation Index](../docs/README.md)
  - [Agent Handbook](../agents/README.md)
  - [Testing Strategy](../docs/testing-strategy.md)
  - [Plano de Correção de Testes](./fix-failing-tests.md)

## Análise do Problema

### Testes Falhando

1. **`can undo after pushing multiple states`** - `undo()` retorna `undefined` ao invés do estado esperado
2. **`can redo after undo`** - `canRedo` retorna `false` quando deveria ser `true`

### Causa Raiz Identificada

O hook atual tem múltiplos problemas de sincronização:

1. **Atualização aninhada de state**: No `pushState`, há uma atualização aninhada (`setHistoryIndex` dentro de `setHistory`), o que pode causar race conditions e inconsistências
2. **Sincronização assíncrona de refs**: Os refs são atualizados imediatamente no `pushState`, mas o `useEffect` que sincroniza refs com state pode não ter rodado ainda, causando dessincronização
3. **Inconsistência entre leitura e escrita**: `canUndo`/`canRedo` usam state diretamente, mas `undo()`/`redo()` usam refs, causando inconsistência
4. **Problema de timing**: Quando múltiplos `pushState` são chamados rapidamente, os refs podem não refletir o estado correto

### Arquitetura Atual (Problemática)

```typescript

// Problema: State e refs podem ficar dessincronizados
const [history, setHistory] = useState<HistoryState[]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);
const historyRef = useRef<HistoryState[]>([]);
const historyIndexRef = useRef(-1);

// useEffect tenta sincronizar, mas há race conditions
useEffect(() => {
  historyRef.current = history;
  historyIndexRef.current = historyIndex;
}, [history, historyIndex]);

// pushState atualiza refs imediatamente, mas state pode não ter atualizado
setHistoryIndex((currentIndex) => {
  setHistory((prevHistory) => { /* ... */ });
  historyRef.current = finalHistory; // Pode estar desatualizado
  return finalIndex;
});

```

## Solução Proposta

### Abordagem: Single Source of Truth com useReducer

Refatorar para usar `useReducer` como única fonte de verdade, eliminando a necessidade de sincronizar refs com state:

1. **Usar `useReducer`** para gerenciar history e historyIndex atomicamente
2. **Eliminar refs de sincronização** - usar apenas refs para flags temporárias (isPushingRef)
3. **Garantir atomicidade** - todas as operações de history são atômicas através do reducer
4. **Simplificar lógica** - remover complexidade desnecessária de sincronização

### Arquitetura Proposta

```typescript

type HistoryAction =

  | { type: 'PUSH_STATE'; payload: HistoryState }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' };

interface HistoryReducerState {
  history: HistoryState[];
  index: number;
}

// Reducer garante atomicidade
function historyReducer(state: HistoryReducerState, action: HistoryAction): HistoryReducerState {
  switch (action.type) {
    case 'PUSH_STATE':
      // Lógica atômica para push
      break;
    case 'UNDO':
      // Lógica atômica para undo
      break;
    // ...
  }
}

```

## Agent Lineup

| Agent | Role in this plan | Playbook | First responsibility focus |
| --- | --- | --- | --- |
| Refactoring Specialist | Identificar problemas arquiteturais e propor solução | [Refactoring Specialist](../agents/refactoring-specialist.md) | Analisar código atual e propor arquitetura com useReducer |
| Bug Fixer | Analisar testes falhando e identificar causa raiz | [Bug Fixer](../agents/bug-fixer.md) | Identificar exatamente onde a sincronização falha |
| Frontend Specialist | Implementar refatoração seguindo padrões React | [Frontend Specialist](../agents/frontend-specialist.md) | Implementar useReducer e garantir padrões React corretos |
| Test Writer | Garantir que testes validem a nova implementação | [Test Writer](../agents/test-writer.md) | Atualizar testes se necessário e adicionar casos edge |
| Code Reviewer | Revisar qualidade e padrões do código refatorado | [Code Reviewer](../agents/code-reviewer.md) | Revisar implementação final e garantir qualidade |

## Documentation Touchpoints

| Guide | File | Primary Inputs | Updates Needed |
| --- | --- | --- | --- |
| Testing Strategy | [testing-strategy.md](../docs/testing-strategy.md) | Estratégia de testes atual | Documentar padrões de teste para hooks com useReducer |
| Architecture | [architecture.md](../docs/architecture.md) | Arquitetura do sistema | Documentar padrão de useReducer para state complexo |
| Development Workflow | [development-workflow.md](../docs/development-workflow.md) | Workflow de desenvolvimento | Nenhuma atualização necessária |

## Risk Assessment

### Identified Risks

| Risk | Probability | Impact | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- |
| Refatoração pode quebrar funcionalidade existente | Medium | High | Manter interface pública idêntica, testar extensivamente | Frontend Specialist |
| useReducer pode ter performance diferente | Low | Low | useReducer é otimizado pelo React, não deve haver impacto | Frontend Specialist |
| Testes podem precisar de ajustes | Medium | Low | Test Writer revisará e ajustará testes conforme necessário | Test Writer |
| Componentes que usam o hook podem precisar de ajustes | Low | Medium | Interface pública permanece a mesma, não deve haver breaking changes | Frontend Specialist |

### Dependencies

- **Internal:** Nenhuma dependência de outros times
- **External:**

  - `react` - Garantir compatibilidade com versão atual
  - `@xyflow/react` - Tipos de Node e Edge

- **Technical:**

  - Ambiente de teste configurado (Vitest + @testing-library/react)
  - Conhecimento de useReducer e padrões React

### Assumptions

- Assumimos que a interface pública do hook (`UsePlaygroundHistoryReturn`) pode permanecer a mesma
- Assumimos que componentes que usam o hook não precisarão de mudanças
- Se assumirmos incorretamente, precisaremos atualizar componentes consumidores também

## Resource Estimation

### Time Allocation

| Phase | Estimated Effort | Calendar Time | Team Size |
| --- | --- | --- | --- |
| Phase 1 - Análise e Design | 0.5 person-days | 1 dia | 1 pessoa |
| Phase 2 - Implementação | 1 person-day | 1-2 dias | 1 pessoa |
| Phase 3 - Validação | 0.5 person-days | 1 dia | 1 pessoa |
| **Total** | **2 person-days** | **3-4 dias** | **1 pessoa** |

### Required Skills

- Experiência com React hooks (useState, useReducer, useCallback, useRef)
- Conhecimento de padrões de sincronização de state em React
- Experiência com testes de hooks usando @testing-library/react
- Habilidades de debugging e análise de race conditions

### Resource Availability

- **Available:** Desenvolvedor principal do projeto
- **Blocked:** Nenhum bloqueio identificado
- **Escalation:** N/A

## Working Phases

### Phase 1 — Análise e Design da Solução

**Objetivo:** Analisar profundamente o problema e projetar a solução com useReducer

#### Phase 1 Steps

1. **Análise detalhada do problema atual** (Bug Fixer)
   - Executar testes falhando e capturar logs detalhados
   - Identificar exatamente onde a sincronização falha
   - Documentar cenários de race condition
   - Criar diagrama de fluxo do estado atual

2. **Design da solução com useReducer** (Refactoring Specialist)
   - Projetar estrutura do reducer (actions e state)
   - Definir lógica de cada action (PUSH_STATE, UNDO, REDO, CLEAR)
   - Garantir atomicidade de todas as operações
   - Documentar como eliminar necessidade de refs de sincronização

3. **Validação do design** (Code Reviewer)
   - Revisar design para garantir que resolve todos os problemas
   - Verificar que interface pública permanece compatível
   - Validar que não há edge cases não cobertos

#### Phase 1 Deliverables

- Documento com análise detalhada do problema
- Design da solução com useReducer (código comentado)
- Diagrama de fluxo de estado (antes e depois)
- Lista de edge cases identificados

#### Phase 1 Commit Checkpoint

- `git commit -m "chore(plan): complete phase 1 analysis and design for usePlaygroundHistory refactor"`

### Phase 2 — Implementação da Refatoração

**Objetivo:** Implementar a refatoração usando useReducer

#### Phase 2 Steps

1. **Criar reducer e types** (Frontend Specialist)
   - Definir types para HistoryAction e HistoryReducerState
   - Implementar historyReducer com todas as actions
   - Garantir lógica correta para MAX_HISTORY_SIZE
   - Implementar lógica de remoção de estados futuros no push

2. **Refatorar hook para usar useReducer** (Frontend Specialist)
   - Substituir useState por useReducer
   - Remover refs de sincronização (historyRef, historyIndexRef)
   - Manter apenas isPushingRef para flag temporária
   - Atualizar pushState, undo, redo, clearHistory para usar dispatch
   - Garantir que canUndo e canRedo usam state do reducer

3. **Garantir compatibilidade da interface** (Frontend Specialist)
   - Verificar que UsePlaygroundHistoryReturn permanece idêntico
   - Garantir que todos os métodos retornam valores corretos
   - Testar que deep cloning ainda funciona corretamente

4. **Limpeza e otimização** (Frontend Specialist)
   - Remover código não utilizado (refs antigos, useEffect de sincronização)
   - Adicionar comentários explicativos
   - Garantir que código segue padrões do projeto

#### Phase 2 Deliverables

- Hook refatorado com useReducer
- Código limpo sem refs de sincronização desnecessários
- Interface pública mantida compatível

#### Phase 2 Commit Checkpoint

- `git commit -m "refactor(hooks): refactor usePlaygroundHistory to use useReducer for atomic state management"`

### Phase 3 — Validação e Testes

**Objetivo:** Validar que a refatoração corrige os testes e não quebra funcionalidade

#### Phase 3 Steps

1. **Executar testes existentes** (Test Writer)
   - Executar `npm run test` para usePlaygroundHistory.test.ts
   - Verificar que todos os testes passam, incluindo os 2 que estavam falhando
   - Identificar se algum teste precisa de ajustes

2. **Adicionar testes adicionais** (Test Writer)
   - Adicionar teste para múltiplos pushState rápidos
   - Adicionar teste para undo/redo alternados
   - Adicionar teste para MAX_HISTORY_SIZE
   - Adicionar teste para clearHistory após undo/redo

3. **Validar uso em componentes** (Frontend Specialist)
   - Verificar que PlaygroundContext ainda funciona corretamente
   - Testar manualmente undo/redo no playground
   - Garantir que não há regressões visuais ou funcionais

4. **Revisão de código** (Code Reviewer)
   - Revisar implementação final
   - Verificar padrões de código
   - Validar que não há código morto ou comentários desnecessários
   - Garantir performance adequada

#### Phase 3 Deliverables

- Todos os testes passando (100%)
- Testes adicionais para edge cases
- Validação de que componentes consumidores funcionam corretamente
- Código revisado e aprovado

#### Phase 3 Commit Checkpoint

- `git commit -m "test(hooks): add comprehensive tests for usePlaygroundHistory refactor"`

## Rollback Plan

### Rollback Triggers

When to initiate rollback:

- Testes ainda falhando após refatoração
- Componentes consumidores quebrados
- Performance degradada significativamente
- Regressões funcionais no playground

### Rollback Procedures

#### Phase 1 Rollback

- Action: Descartar design, manter implementação atual
- Data Impact: Nenhum
- Estimated Time: < 5 minutos

#### Phase 2 Rollback

- Action: Reverter commit de refatoração, restaurar código anterior
- Data Impact: Nenhum
- Estimated Time: < 10 minutos
- Command: `git revert <commit-hash>`

#### Phase 3 Rollback

- Action: Reverter apenas testes se necessário, manter refatoração
- Data Impact: Nenhum
- Estimated Time: < 5 minutos

### Post-Rollback Actions

1. Documentar razão do rollback
2. Analisar o que deu errado
3. Atualizar plano com lições aprendidas
4. Considerar abordagem alternativa se necessário

## Evidence & Follow-up

### Artifacts to Collect

- [ ] Output de testes antes da refatoração (mostrando falhas)
- [ ] Output de testes após refatoração (todos passando)
- [ ] Código do reducer implementado
- [ ] Diagrama de fluxo de estado (antes/depois)
- [ ] Screenshots de undo/redo funcionando no playground (se aplicável)

### Follow-up Actions

- [ ] Considerar aplicar padrão useReducer em outros hooks similares
- [ ] Documentar padrão de useReducer para state complexo na arquitetura
- [ ] Atualizar documentação de testes se necessário
- [ ] Monitorar performance do hook em produção

### Success Metrics

- ✅ Todos os testes do usePlaygroundHistory passando (5/5)
- ✅ Zero regressões em componentes consumidores
- ✅ Código mais simples e manutenível (menos linhas, menos complexidade)
- ✅ Performance mantida ou melhorada

## Notas de Implementação

### Padrão useReducer para State Complexo

#### Estrutura do Reducer

```typescript

interface HistoryReducerState {
  history: HistoryState[];
  index: number;
}

type HistoryAction =

  | { type: 'PUSH_STATE'; payload: HistoryState }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR' };

function historyReducer(
  state: HistoryReducerState,
  action: HistoryAction
): HistoryReducerState {
  switch (action.type) {
    case 'PUSH_STATE':
      // Lógica atômica: remover futuros, adicionar novo, limitar tamanho
      const newHistory = state.history.slice(0, state.index + 1);
      newHistory.push(action.payload);
      // Limitar tamanho se necessário
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
        return { history: newHistory, index: MAX_HISTORY_SIZE - 1 };
      }
      return { history: newHistory, index: newHistory.length - 1 };

    case 'UNDO':
      if (state.index <= 0) return state;
      return { ...state, index: state.index - 1 };

    case 'REDO':
      if (state.index >= state.history.length - 1) return state;
      return { ...state, index: state.index + 1 };

    case 'CLEAR':
      return { history: [], index: -1 };

    default:
      return state;
  }
}

```

#### Vantagens da Abordagem

1. **Atomicidade**: Todas as operações são atômicas através do reducer
2. **Single Source of Truth**: Apenas o reducer gerencia o estado
3. **Simplicidade**: Elimina necessidade de sincronizar refs com state
4. **Testabilidade**: Reducer pode ser testado isoladamente
5. **Manutenibilidade**: Lógica centralizada e fácil de entender

### Considerações de Performance

- `useReducer` é otimizado pelo React e não deve ter impacto negativo
- Deep cloning ainda necessário para evitar mutações
- MAX_HISTORY_SIZE limita memória usada

### Compatibilidade

- Interface pública (`UsePlaygroundHistoryReturn`) permanece idêntica
- Componentes consumidores não precisam de mudanças
- Apenas implementação interna muda
