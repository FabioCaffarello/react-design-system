# Architecture Decision Records (ADRs)

Este diretório contém Architecture Decision Records (ADRs) que documentam decisões arquiteturais importantes do React Design System.

## O que são ADRs?

ADRs são documentos que capturam decisões arquiteturais importantes, incluindo:

- **Contexto**: Por que a decisão foi necessária
- **Decisão**: O que foi decidido
- **Consequências**: Impactos positivos e negativos
- **Alternativas**: Outras opções consideradas

## ADRs Atuais

### [ADR-0001: Build and Distribution Strategy](./0001-build-and-distribution-strategy.md)

**Status:** Proposed  
**Data:** 2026-01-19

Estratégia completa para resolver problemas de build e distribuição:

- Remoção de exports condicionais TypeScript
- Garantia de builds completos e transpilados
- Compatibilidade universal com bundlers

**Issues relacionadas:**

- TypeScript source files em exports de desenvolvimento
- Necessidade de `transpilePackages` no Next.js

### [ADR-0002: Provider Exports in Production Build](./0002-provider-exports-in-build.md)

**Status:** Proposed  
**Data:** 2026-01-19

Solução para garantir que todos os providers (AppProvider, ConfigProvider, ThemeProvider) sejam incluídos no build de produção.

**Issues relacionadas:**

- AppProvider não exportado em `dist/index.js`
- Funcionalidades perdidas em produção

## Como Usar

1. **Antes de uma decisão arquitetural importante**: Consulte ADRs existentes
2. **Ao tomar uma decisão**: Crie um novo ADR seguindo o template
3. **Ao revisar decisões**: Atualize o status do ADR (Proposed → Accepted → Deprecated)

## Template

Ao criar um novo ADR, use o seguinte formato:

```markdown
# ADR-XXXX: Título da Decisão

**Status:** Proposed | Accepted | Deprecated  
**Date:** YYYY-MM-DD  
**Deciders:** Nome do Time  
**Tags:** tag1, tag2, tag3

## Context
[Por que esta decisão foi necessária?]

## Decision
[O que foi decidido?]

## Consequences
[Impactos positivos e negativos]

## Alternatives Considered
[Outras opções consideradas e por que foram rejeitadas]
```

## Referências

- [ADR Template by Michael Nygard](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [RFCs](./../rfc/) - Request for Comments relacionados
- [Issues](./../issues/) - Issues técnicas documentadas
