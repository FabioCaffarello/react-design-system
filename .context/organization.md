# Organização dos Documentos de Contexto

Este documento descreve a estrutura organizacional dos documentos de contexto do projeto.

## Estrutura de Diretórios

```
.context/
├── agents/              # Playbooks de agentes AI
├── docs/               # Documentação principal
│   ├── adr/            # Architecture Decision Records
│   ├── rfc/            # Request for Comments
│   ├── issues/         # Issues e problemas documentados
│   ├── executive-summaries/  # Resumos executivos de mudanças
│   └── completed-changes/    # Documentação de mudanças implementadas
└── plans/              # Planos de implementação detalhados
```

## Categorização de Documentos

### 📋 Plans (`.context/plans/`)
Planos de implementação detalhados com cronogramas, tarefas e critérios de sucesso.

**Documentos:**
- `build-fixes-implementation.md` - Correções estruturais do build
- `standalone-app-removal.md` - Remoção da aplicação standalone
- `css-export-plan.md` - Exportação de CSS

### 📊 Executive Summaries (`.context/docs/executive-summaries/`)
Resumos executivos de alto nível para mudanças significativas.

**Documentos:**
- `build-fixes-summary.md` - Resumo das correções de build
- `app-removal-summary.md` - Resumo da remoção da aplicação standalone

### ✅ Completed Changes (`.context/docs/completed-changes/`)
Documentação de mudanças já implementadas e validadas.

**Documentos:**
- `build-fixes-implementation.md` - Mudanças implementadas para correções de build
- `standalone-app-removal.md` - Documentação da remoção concluída

### 🏗️ Architecture & Decisions (`.context/docs/adr/` e `.context/docs/rfc/`)
- **ADRs**: Decisões arquiteturais importantes
- **RFCs**: Propostas de mudanças técnicas

### 📝 Core Documentation (`.context/docs/`)
Documentação principal do projeto:
- `project-overview.md` - Visão geral do projeto
- `development-workflow.md` - Fluxo de desenvolvimento
- `testing-strategy.md` - Estratégia de testes
- `tooling.md` - Ferramentas e produtividade

### 🐛 Issues (`.context/docs/issues/`)
Documentação de problemas e suas resoluções:
- `design-system-build-issue.md` - Issues críticas de build
- `final-status.md` - Status final das issues resolvidas

## Princípios de Organização

1. **Separação por Tipo**: Documentos são organizados por tipo (planos, resumos, mudanças completadas)
2. **Hierarquia Clara**: Planos → Resumos → Mudanças Implementadas
3. **Referências Atualizadas**: Todas as referências entre documentos foram atualizadas para refletir a nova estrutura
4. **Documentação de Contexto**: Cada pasta tem um README explicando seu propósito

## Documentos que NÃO Precisam ser Mapeados

Os seguintes tipos de documentos são mantidos para referência mas não precisam estar no índice principal:

- Documentos temporários de análise
- Rascunhos de planos
- Documentos obsoletos (devem ser arquivados ou removidos)

## Como Adicionar Novos Documentos

### Adicionar um Novo Plano
1. Criar arquivo em `.context/plans/`
2. Adicionar entrada no `.context/plans/README.md`
3. Criar resumo executivo em `.context/docs/executive-summaries/` se necessário
4. Atualizar `.context/docs/README.md` com link

### Documentar Mudanças Completadas
1. Criar arquivo em `.context/docs/completed-changes/`
2. Atualizar `.context/docs/README.md` com link
3. Atualizar referências nos planos relacionados

### Criar ADR ou RFC
1. Criar arquivo em `.context/docs/adr/` ou `.context/docs/rfc/`
2. Seguir numeração sequencial
3. Atualizar README da pasta correspondente

## Manutenção

- Revisar periodicamente documentos obsoletos
- Manter referências atualizadas quando mover documentos
- Atualizar READMEs quando adicionar novos documentos
- Seguir convenções de nomenclatura estabelecidas
