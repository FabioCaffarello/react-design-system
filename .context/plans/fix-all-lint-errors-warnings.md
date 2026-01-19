---
status: in_progress
generated: 2026-01-19
updated: 2026-01-19
agents:
  - type: "bug-fixer"
    role: "Corrigir erros TypeScript e problemas de código"
  - type: "code-reviewer"
    role: "Revisar correções de código e garantir qualidade"
  - type: "test-writer"
    role: "Validar que testes não foram quebrados após correções"
  - type: "frontend-specialist"
    role: "Corrigir problemas de React Hooks e componentes"
  - type: "documentation-writer"
    role: "Corrigir warnings de formatação Markdown"
docs:
  - "testing-strategy.md"
  - "development-workflow.md"
phases:
  - id: "phase-1"
    name: "Análise e Mapeamento Completo"
    prevc: "P"
    status: "completed"
  - id: "phase-2"
    name: "Correção de Erros Críticos (React Hooks Rules)"
    prevc: "E"
    status: "pending"
  - id: "phase-3"
    name: "Correção de Variáveis Não Usadas (Imports)"
    prevc: "E"
    status: "pending"
  - id: "phase-4"
    name: "Correção de Variáveis Não Usadas (Variáveis)"
    prevc: "E"
    status: "pending"
  - id: "phase-5"
    name: "Correção de React Hooks Dependencies"
    prevc: "E"
    status: "pending"
  - id: "phase-6"
    name: "Correção de Problemas Simples (Auto-fix)"
    prevc: "E"
    status: "pending"
  - id: "phase-7"
    name: "Correção de Console Statements"
    prevc: "E"
    status: "pending"
  - id: "phase-8"
    name: "Correção de Empty Object Types"
    prevc: "E"
    status: "pending"
  - id: "phase-9"
    name: "Correção de Fast Refresh Warnings"
    prevc: "E"
    status: "pending"
  - id: "phase-10"
    name: "Correção Final de Markdown"
    prevc: "E"
    status: "pending"
  - id: "phase-11"
    name: "Validação Final Completa"
    prevc: "V"
    status: "pending"
---

# Correção Estratégica de Todos os Erros e Warnings de Lint

> Plano rigoroso para corrigir TODOS os 692 problemas de lint (232 erros, 460 warnings) sem quebrar testes

## Task Snapshot

- **Primary goal:** Eliminar TODOS os erros e warnings de lint do projeto (692 problemas), garantindo que nenhum teste seja quebrado no processo.
- **Success signal:** 
  - `npm run lint` retorna 0 erros e 0 warnings
  - `npm run test` passa com 100% dos testes
  - Build do projeto completa sem erros
- **Key references:**
  - [Documentation Index](../docs/README.md)
  - [Agent Handbook](../agents/README.md)
  - [Plans Index](./README.md)
  - [ESLint Config](../../eslint.config.js)

## Análise dos Problemas

### Resumo Geral
- **Total de problemas:** 692 (232 erros, 460 warnings)
- **Arquivos afetados:** ~150+ arquivos
- **Tipos principais de problemas:** 10 categorias

### Categoria 1: Variáveis Não Usadas (@typescript-eslint/no-unused-vars)
**Quantidade:** ~400+ problemas (maioria)

**Tipos:**
- Imports não usados (ReactNode, HTMLAttributes, Button, etc.)
- Variáveis declaradas mas não utilizadas
- Parâmetros de função não usados
- Variáveis de estado não utilizadas

**Estratégia:**
- Remover imports não usados
- Prefixar variáveis não usadas com `_` (ex: `_unusedVar`)
- Remover variáveis completamente não utilizadas
- Usar `_` para parâmetros não usados

### Categoria 2: React Hooks Rules (react-hooks/rules-of-hooks)
**Quantidade:** ~30+ erros críticos

**Problema:** Hooks chamados condicionalmente (após early returns ou dentro de condições)

**Arquivos críticos:**
- `PlaygroundDevTools.tsx` (10+ erros)
- `PlaygroundCanvas.tsx` (3 erros)
- `NodeEditor.tsx` (1 erro)
- `FloatingEdge.tsx` (4 erros)
- `FloatingConnectionLine.tsx` (3 erros)
- `FlowNodeToolbar.tsx` (4 erros)

**Estratégia:**
- Mover todos os hooks para o topo do componente
- Remover early returns antes de hooks
- Reestruturar componentes para garantir ordem consistente

### Categoria 3: React Hooks Dependencies (react-hooks/exhaustive-deps)
**Quantidade:** ~50+ warnings

**Problema:** Dependências faltando ou desnecessárias em useEffect/useMemo/useCallback

**Estratégia:**
- Adicionar dependências faltantes
- Remover dependências desnecessárias
- Usar useCallback/useMemo quando apropriado

### Categoria 4: Console Statements (no-console)
**Quantidade:** ~15+ warnings

**Problema:** console.log/console.debug em código de produção

**Estratégia:**
- Remover console.log desnecessários
- Converter para console.warn/console.error quando apropriado
- Manter apenas em arquivos de debug/dev tools

### Categoria 5: Unnecessary Escapes (no-useless-escape)
**Quantidade:** ~10+ erros

**Problema:** Escapes desnecessários em strings (ex: `\|` em vez de `|`)

**Arquivos:**
- `Accordion.stories.tsx`
- `DatePicker.stories.tsx`
- `Rating.stories.tsx`
- `DataGrid.stories.tsx`
- `Table.stories.tsx`

**Estratégia:** Remover escapes desnecessários

### Categoria 6: Prefer Const (prefer-const)
**Quantidade:** ~5+ erros

**Problema:** Variáveis declaradas com `let` que nunca são reatribuídas

**Arquivo:** `src/ui/tokens/colors/primitives.ts`

**Estratégia:** Converter `let` para `const`

### Categoria 7: Case Declarations (no-case-declarations)
**Quantidade:** ~4 erros

**Problema:** Declarações lexicais em blocos case sem chaves

**Arquivo:** `ReactFlowPropsPanel.tsx`

**Estratégia:** Adicionar chaves `{}` aos case blocks

### Categoria 8: Empty Object Type (@typescript-eslint/no-empty-object-type)
**Quantidade:** ~4 erros

**Problema:** Interfaces vazias que são equivalentes ao supertipo

**Arquivos:**
- `MenuSeparator.tsx`
- `SideNavbarResizeHandle.tsx`
- `SideNavbar/types/index.ts`

**Estratégia:** Remover interfaces vazias ou adicionar propriedades

### Categoria 9: Constant Binary Expression (no-constant-binary-expression)
**Quantidade:** ~2 erros

**Problema:** Expressões binárias com valores constantes

**Arquivo:** `src/ui/utils/cn.test.ts`

**Estratégia:** Simplificar expressões ou remover código desnecessário

### Categoria 10: Fast Refresh (react-refresh/only-export-components)
**Quantidade:** ~50+ warnings

**Problema:** Arquivos exportam componentes e outras coisas (contextos, constantes, etc.)

**Estratégia:**
- Mover contextos para arquivos separados
- Mover constantes para arquivos separados
- Manter apenas componentes em arquivos de componentes

### Categoria 11: Warnings Markdown (MD*)
**Quantidade:** ~1 warning restante

**Status:** Quase completamente corrigido (de 162 para 1)

**Estratégia:** Corrigir último warning restante

## Agent Lineup

| Agent | Role in this plan | Playbook | First responsibility focus |
| --- | --- | --- | --- |
| Bug Fixer | Corrigir erros TypeScript críticos | [Bug Fixer](../agents/bug-fixer.md) | Analisar e corrigir incompatibilidades de tipo em TableFilters.stories.tsx |
| Code Reviewer | Revisar qualidade das correções | [Code Reviewer](../agents/code-reviewer.md) | Validar que correções seguem padrões do projeto e não introduzem regressões |
| Test Writer | Garantir integridade dos testes | [Test Writer](../agents/test-writer.md) | Executar suite de testes após cada correção e validar que nada quebrou |
| Documentation Writer | Corrigir formatação Markdown | [Documentation Writer](../agents/documentation-writer.md) | Aplicar correções de formatação em arquivos .md seguindo padrões Markdown |

## Risk Assessment

### Identified Risks

| Risk | Probability | Impact | Mitigation Strategy | Owner |
| --- | --- | --- | --- | --- |
| Correção de tipos quebrar testes existentes | Medium | High | Executar testes antes e depois de cada mudança, usar type assertions se necessário | Bug Fixer |
| Correções Markdown alterarem significado do conteúdo | Low | Low | Revisar diff completo antes de commitar, manter conteúdo intacto | Documentation Writer |
| Múltiplas correções causarem conflitos | Low | Medium | Trabalhar em branches separadas, commitar incrementalmente | All |
| Tempo de execução dos testes | Low | Low | Executar testes em paralelo quando possível | Test Writer |

### Dependencies

- **Internal:** 
  - Acesso ao código fonte do componente `TableFilters`
  - Suite de testes funcionando
  - Ferramentas de lint configuradas
- **External:** 
  - Nenhuma dependência externa
- **Technical:** 
  - TypeScript 5.9.3
  - ESLint 9.36.0
  - markdownlint (via ESLint)

### Assumptions

- Os testes atuais estão passando antes de iniciar as correções (1657 testes)
- Correções de variáveis não usadas não afetarão funcionalidade
- Correções de React Hooks podem requerer refatoração significativa
- Fast refresh warnings são de baixa prioridade e podem ser corrigidos gradualmente
- Console.log removidos não são necessários para funcionalidade
- Arquivos `.context/plans/*.md` são documentação e podem ser reformatados

## Resource Estimation

### Time Allocation

| Phase | Estimated Effort | Calendar Time | Team Size | Prioridade |
| --- | --- | --- | --- | --- |
| Phase 1 - Análise e Mapeamento | 1 hora | 2 horas | 1 pessoa | ALTA |
| Phase 2 - React Hooks Rules (críticos) | 4 horas | 1 dia | 1 pessoa | **CRÍTICA** |
| Phase 3 - Variáveis Não Usadas (Imports) | 3 horas | 4 horas | 1 pessoa | ALTA |
| Phase 4 - Variáveis Não Usadas (Variáveis) | 3 horas | 4 horas | 1 pessoa | ALTA |
| Phase 5 - React Hooks Dependencies | 2 horas | 3 horas | 1 pessoa | MÉDIA |
| Phase 6 - Problemas Simples (Auto-fix) | 1 hora | 2 horas | 1 pessoa | MÉDIA |
| Phase 7 - Console Statements | 1 hora | 2 horas | 1 pessoa | BAIXA |
| Phase 8 - Empty Object Types | 30 minutos | 1 hora | 1 pessoa | MÉDIA |
| Phase 9 - Fast Refresh Warnings | 2 horas | 3 horas | 1 pessoa | BAIXA |
| Phase 10 - Markdown Final | 15 minutos | 30 minutos | 1 pessoa | BAIXA |
| Phase 11 - Validação Final | 2 horas | 3 horas | 1 pessoa | ALTA |
| **Total** | **20 horas** | **3-4 dias** | **1 pessoa** | - |

### Required Skills

- **TypeScript avançado** (tipos genéricos, union types, interfaces)
- **React avançado** (Hooks, Context API, component patterns)
- **Conhecimento profundo de React Hooks** (rules, dependencies, patterns)
- **Conhecimento de Storybook** (stories, testes de interação)
- **Familiaridade com Markdown** e markdownlint
- **Experiência com testes automatizados** (Vitest, Testing Library)
- **Conhecimento de ESLint** e configuração
- **Habilidades de refatoração** (código limpo, padrões de design)

### Resource Availability

- **Available:** Desenvolvedor com conhecimento do projeto
- **Blocked:** Nenhum bloqueio identificado
- **Escalation:** N/A

## Working Phases

### Phase 1 — Análise e Mapeamento Completo

**Objetivo:** Mapear todos os 692 problemas por categoria e prioridade.

**Steps:**

1. **Categorizar todos os problemas** (Bug Fixer)
   - [x] Identificar 11 categorias principais
   - [ ] Contar problemas por categoria
   - [ ] Priorizar por impacto (erros críticos primeiro)
   - [ ] Criar lista de arquivos por categoria

2. **Baseline completo** (Test Writer)
   - [x] Executar `npm run test` - 1657 testes passando
   - [x] Executar `npm run lint` - 692 problemas identificados
   - [ ] Documentar baseline completo

**Deliverables:**
- Lista completa de 692 problemas categorizados
- Priorização por impacto
- Baseline de testes documentado

### Phase 2 — Correção de Erros Críticos (React Hooks Rules)

**Objetivo:** Corrigir ~30 erros críticos de React Hooks que podem quebrar aplicação.

**Prioridade:** ALTA - Estes erros podem causar bugs em runtime.

**Steps:**

1. **PlaygroundDevTools.tsx** (10+ erros) (Frontend Specialist)
   - [ ] Mover todos os hooks para o topo do componente
   - [ ] Remover early returns antes de hooks
   - [ ] Reestruturar lógica condicional

2. **PlaygroundCanvas.tsx** (3 erros) (Frontend Specialist)
   - [ ] Mover hooks após early returns
   - [ ] Garantir ordem consistente

3. **NodeEditor.tsx** (1 erro) (Frontend Specialist)
   - [ ] Corrigir hook condicional

4. **FloatingEdge.tsx** (4 erros) (Frontend Specialist)
   - [ ] Mover useMemo para topo
   - [ ] Remover condições antes de hooks

5. **FloatingConnectionLine.tsx** (3 erros) (Frontend Specialist)
   - [ ] Mover useMemo para topo

6. **FlowNodeToolbar.tsx** (4 erros) (Frontend Specialist)
   - [ ] Mover useMemo para topo

**Validação:**
- [ ] Executar testes após cada arquivo
- [ ] Verificar que componentes funcionam no Storybook

**Commit Checkpoint:**
```bash
git commit -m "fix(hooks): corrigir todos os erros de React Hooks rules

- Mover hooks para topo dos componentes
- Remover early returns antes de hooks
- Garantir ordem consistente de hooks"
```

### Phase 3 — Correção de Variáveis Não Usadas (Parte 1: Imports)

**Objetivo:** Remover imports não usados (~200+ problemas).

**Prioridade:** MÉDIA - Melhora qualidade do código.

**Estratégia:** Usar ESLint --fix quando possível, corrigir manualmente o restante.

**Steps:**

1. **Corrigir imports em stories** (Code Reviewer)
   - [ ] Remover imports não usados de @storybook/test
   - [ ] Remover imports de componentes não utilizados
   - [ ] Usar `npm run lint -- --fix` para correções automáticas

2. **Corrigir imports em componentes** (Bug Fixer)
   - [ ] Remover ReactNode, HTMLAttributes não usados
   - [ ] Remover componentes importados mas não renderizados
   - [ ] Remover utilitários não utilizados

3. **Corrigir imports em testes** (Test Writer)
   - [ ] Remover imports de testing library não usados
   - [ ] Limpar imports de tipos não utilizados

**Commit Checkpoint:**
```bash
git commit -m "chore(lint): remover imports não utilizados

- Remover ~200+ imports não usados
- Limpar código de componentes, stories e testes"
```

### Phase 4 — Correção de Variáveis Não Usadas (Parte 2: Variáveis e Parâmetros)

**Objetivo:** Corrigir variáveis e parâmetros não usados (~200+ problemas).

**Steps:**

1. **Prefixar variáveis não usadas com `_`** (Bug Fixer)
   - [ ] Variáveis de estado não utilizadas
   - [ ] Parâmetros de função não usados
   - [ ] Variáveis temporárias não utilizadas

2. **Remover variáveis completamente não usadas** (Code Reviewer)
   - [ ] Variáveis declaradas mas nunca referenciadas
   - [ ] Funções não utilizadas
   - [ ] Constantes não utilizadas

**Commit Checkpoint:**
```bash
git commit -m "chore(lint): corrigir variáveis não utilizadas

- Prefixar variáveis não usadas com _
- Remover variáveis completamente não utilizadas
- Limpar código morto"
```

### Phase 5 — Correção de React Hooks Dependencies

**Objetivo:** Corrigir ~50+ warnings de dependências faltando.

**Steps:**

1. **Adicionar dependências faltantes** (Frontend Specialist)
   - [ ] Analisar cada useEffect/useMemo/useCallback
   - [ ] Adicionar dependências necessárias
   - [ ] Usar useCallback quando apropriado

2. **Remover dependências desnecessárias** (Code Reviewer)
   - [ ] Remover dependências que não mudam
   - [ ] Otimizar arrays de dependências

**Commit Checkpoint:**
```bash
git commit -m "fix(hooks): corrigir dependências de React Hooks

- Adicionar dependências faltantes
- Remover dependências desnecessárias
- Otimizar arrays de dependências"
```

### Phase 6 — Correção de Problemas Simples (Auto-fixáveis)

**Objetivo:** Corrigir problemas que podem ser auto-corrigidos.

**Steps:**

1. **Unnecessary escapes** (no-useless-escape) (Bug Fixer)
   - [ ] Remover escapes desnecessários em strings
   - [ ] Corrigir em stories (Accordion, DatePicker, Rating, etc.)

2. **Prefer const** (prefer-const) (Code Reviewer)
   - [ ] Converter `let` para `const` em primitives.ts

3. **Case declarations** (no-case-declarations) (Bug Fixer)
   - [ ] Adicionar chaves `{}` em ReactFlowPropsPanel.tsx

4. **Constant binary expressions** (no-constant-binary-expression) (Test Writer)
   - [ ] Simplificar expressões em cn.test.ts

**Commit Checkpoint:**
```bash
git commit -m "fix(lint): corrigir problemas simples auto-fixáveis

- Remover escapes desnecessários
- Converter let para const
- Adicionar chaves em case blocks
- Simplificar expressões constantes"
```

### Phase 7 — Correção de Console Statements

**Objetivo:** Remover ou converter ~15+ console.log statements.

**Steps:**

1. **Remover console.log desnecessários** (Code Reviewer)
   - [ ] Remover em código de produção
   - [ ] Manter apenas em dev tools

2. **Converter para console.warn/error** (Bug Fixer)
   - [ ] Quando apropriado, converter para warn/error
   - [ ] Manter em arquivos de debug

**Commit Checkpoint:**
```bash
git commit -m "chore(lint): remover console.log statements

- Remover console.log desnecessários
- Converter para console.warn/error quando apropriado"
```

### Phase 8 — Correção de Empty Object Types

**Objetivo:** Corrigir ~4 interfaces vazias.

**Steps:**

1. **MenuSeparator.tsx** (Bug Fixer)
   - [ ] Remover interface vazia ou adicionar propriedades

2. **SideNavbarResizeHandle.tsx** (Bug Fixer)
   - [ ] Remover interface vazia ou adicionar propriedades

3. **SideNavbar/types/index.ts** (Bug Fixer)
   - [ ] Remover interface vazia ou adicionar propriedades

**Commit Checkpoint:**
```bash
git commit -m "fix(types): corrigir interfaces vazias

- Remover interfaces vazias ou adicionar propriedades
- Melhorar tipagem TypeScript"
```

### Phase 9 — Correção de Fast Refresh Warnings

**Objetivo:** Corrigir ~50+ warnings de fast refresh (opcional, baixa prioridade).

**Nota:** Estes são warnings, não erros. Podem ser corrigidos gradualmente.

**Estratégia:** Mover contextos e constantes para arquivos separados quando fizer sentido.

**Commit Checkpoint:**
```bash
git commit -m "chore(refresh): melhorar fast refresh warnings

- Mover contextos para arquivos separados
- Mover constantes para arquivos separados"
```

### Phase 10 — Correção Final de Markdown

**Objetivo:** Corrigir último warning Markdown restante.

**Steps:**

1. **Corrigir último warning** (Documentation Writer)
   - [ ] Identificar e corrigir warning restante

**Commit Checkpoint:**
```bash
git commit -m "docs(markdown): corrigir último warning de formatação"
```

### Phase 11 — Validação Final Completa

**Objetivo:** Garantir que TODAS as 692 correções estão funcionando e nada foi quebrado.

**Steps:**

1. **Validação de lint completo** (Code Reviewer)
   - [ ] Executar `npm run lint` e verificar: **0 erros, 0 warnings**
   - [ ] Verificar saída completa do lint
   - [ ] Confirmar que todos os 692 problemas foram resolvidos
   - [ ] Documentar resultados finais

2. **Validação de testes completo** (Test Writer)
   - [ ] Executar `npm run test` e verificar: **100% dos testes passando**
   - [ ] Verificar que nenhum teste foi quebrado
   - [ ] Executar testes específicos de componentes modificados
   - [ ] Documentar resultados

3. **Validação de build** (Bug Fixer)
   - [ ] Executar `npm run build` e verificar: build bem-sucedido
   - [ ] Verificar que não há erros de TypeScript no build
   - [ ] Verificar que arquivos de saída foram gerados corretamente

4. **Validação de Storybook** (Frontend Specialist)
   - [ ] Executar `npm run build-storybook` e verificar: build bem-sucedido
   - [ ] Iniciar `npm run storybook` e verificar stories principais
   - [ ] Testar interações em componentes modificados
   - [ ] Verificar que não há erros no console

5. **Revisão final completa** (Code Reviewer)
   - [ ] Revisar todos os commits das 11 fases
   - [ ] Verificar que padrões do projeto foram seguidos
   - [ ] Verificar que documentação está atualizada
   - [ ] Criar resumo completo das mudanças

**Deliverables:**
- Relatório de validação completo
- Evidência de que todos os 692 problemas foram resolvidos
- 0 erros, 0 warnings no lint
- 100% dos testes passando
- Build e Storybook funcionando

**Commit Checkpoint:**
```bash
git commit -m "chore(validation): validação final - todos os 692 problemas de lint corrigidos

- 0 erros, 0 warnings no lint
- 100% dos testes passando
- Build funcionando
- Storybook funcionando
- Código limpo e mantível"
```

## Rollback Plan

### Rollback Triggers

When to initiate rollback:
- Testes começarem a falhar após correções
- Build começar a falhar
- Storybook não funcionar corretamente
- Erros de runtime introduzidos
- Conteúdo de documentação alterado incorretamente

### Rollback Procedures

#### Phase 2 Rollback (TypeScript)
- **Action:** Reverter commit de correção TypeScript
- **Comando:** `git revert <commit-hash>` ou `git reset --hard HEAD~1`
- **Data Impact:** Nenhum (apenas código)
- **Estimated Time:** < 5 minutos
- **Validação:** Executar testes após rollback

#### Phase 3 Rollback (Markdown)
- **Action:** Reverter commit de correção Markdown
- **Comando:** `git revert <commit-hash>`
- **Data Impact:** Nenhum (apenas documentação)
- **Estimated Time:** < 5 minutos
- **Validação:** Verificar que arquivos voltaram ao estado anterior

#### Phase 4 Rollback (Validação)
- **Action:** N/A (fase de validação não altera código)
- **Data Impact:** Nenhum
- **Estimated Time:** N/A

### Post-Rollback Actions

1. Documentar motivo do rollback
2. Analisar causa raiz do problema
3. Atualizar plano com lições aprendidas
4. Criar novo plano de correção se necessário

## Evidence & Follow-up

### Artifacts to Collect

1. **Antes das correções:**
   - Saída completa de `npm run lint` (baseline)
   - Saída completa de `npm run test` (baseline)
   - Contagem de erros/warnings por tipo

2. **Durante as correções:**
   - Diffs de cada arquivo modificado
   - Saída de lint após cada correção
   - Resultados de testes após cada correção

3. **Após as correções:**
   - Saída final de `npm run lint` (0 erros, 0 warnings)
   - Saída final de `npm run test` (todos passando)
   - Screenshots do Storybook funcionando (opcional)
   - Build logs bem-sucedidos

### Success Metrics

- ✅ **0 erros** no lint (de 232 para 0)
- ✅ **0 warnings** no lint (de 460 para 0)
- ✅ **Total: 0 problemas** (de 692 para 0)
- ✅ **100% dos testes passando** (1657 testes)
- ✅ **Build bem-sucedido**
- ✅ **Storybook funcionando**
- ✅ **Código limpo e mantível**

### Follow-up Actions

1. **Imediato:**
   - Criar PR com todas as correções
   - Adicionar descrição detalhada das mudanças
   - Solicitar code review

2. **Curto prazo:**
   - Monitorar CI/CD após merge
   - Verificar que não há regressões
   - Atualizar documentação se necessário

3. **Longo prazo:**
   - Considerar adicionar pre-commit hooks para prevenir warnings Markdown
   - Considerar adicionar testes de tipo mais rigorosos
   - Documentar padrões de formatação Markdown para o time

## Notas de Implementação

### Correção TypeScript - Detalhes Técnicos

**Problema específico:**
```typescript
// ANTES (erro)
const [_filters, setFilters] = useState<Record<string, string>>({});
setFilters(newFilters); // newFilters é Record<string, FilterValue>

// DEPOIS (correto)
const [_filters, setFilters] = useState<Record<string, FilterValue>>({});
setFilters(newFilters); // Compatível
```

**Stories afetadas:**
- `Default` (linha 41, 74)
- `WithDateFilter` (linha 109, 126)

**Considerações:**
- O tipo `FilterValue` já está definido corretamente no componente
- Não há necessidade de alterar o componente principal
- Apenas as stories precisam ser ajustadas para aceitar o tipo completo

### Correção Markdown - Padrões a Aplicar

1. **MD022 (Headings):** Adicionar linha em branco antes e depois de headings
2. **MD032 (Listas):** Adicionar linha em branco antes e depois de listas
3. **MD058 (Tabelas):** Adicionar linha em branco antes e depois de tabelas
4. **MD009 (Trailing spaces):** Remover espaços no final das linhas
5. **MD031 (Code blocks):** Adicionar linha em branco antes e depois de code blocks
6. **MD036 (Ênfase como heading):** Converter `**texto**` seguido de lista para heading real `### texto`

### Estratégia de Implementação Rápida

Para acelerar a correção dos 692 problemas, use estas estratégias:

#### 1. Auto-fix com ESLint
```bash
# Tentar auto-corrigir problemas simples
npm run lint -- --fix

# Isso corrigirá automaticamente:
# - prefer-const
# - Alguns no-useless-escape
# - Alguns problemas de formatação
```

#### 2. Script para Remover Imports Não Usados
```bash
# Usar ferramentas como:
# - TypeScript compiler (tsc --noUnusedLocals)
# - ESLint com --fix
# - IDE auto-fix (VS Code: "Organize Imports")
```

#### 3. Padrão para Variáveis Não Usadas
```typescript
// ANTES
const unusedVar = value;
const [state, setState] = useState();

// DEPOIS
const _unusedVar = value; // Prefixar com _
const [_state, setState] = useState(); // Prefixar com _
```

#### 4. Padrão para React Hooks
```typescript
// ANTES (ERRADO - hook condicional)
function Component() {
  if (condition) return null;
  const [state, setState] = useState(); // ❌ ERRO
}

// DEPOIS (CORRETO)
function Component() {
  const [state, setState] = useState(); // ✅ Hook no topo
  if (condition) return null;
}
```

### Checklist de Validação Final

- [ ] `npm run lint` retorna **0 erros e 0 warnings**
- [ ] `npm run test` passa com **100% dos testes** (1657 testes)
- [ ] `npm run build` completa sem erros
- [ ] `npm run build-storybook` completa sem erros
- [ ] Stories principais funcionam no Storybook
- [ ] Diffs de Markdown mostram apenas mudanças de formatação
- [ ] Nenhum conteúdo foi alterado, apenas formatação
- [ ] Commits seguem Conventional Commits
- [ ] PR criado com descrição detalhada
- [ ] **Todos os 692 problemas resolvidos**