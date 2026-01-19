# Request for Comments (RFCs)

Este diretório contém Request for Comments (RFCs) que documentam propostas de mudanças técnicas antes da implementação.

## O que são RFCs?

RFCs são documentos que descrevem:

- **Problema**: O que precisa ser resolvido
- **Proposta**: Como resolver o problema
- **Impacto**: Quem será afetado e como
- **Implementação**: Como implementar a solução

## RFCs Atuais

### [RFC-0001: Removal of Conditional Development Exports](./0001-conditional-exports-removal.md)

**Status:** Draft  
**Data:** 2026-01-19

Proposta para remover exports condicionais que apontam para arquivos TypeScript fonte, eliminando a necessidade de `transpilePackages` no Next.js.

**Benefícios:**

- Zero configuração para consumidores
- Comportamento consistente
- Melhor performance
- Compatibilidade universal

## Como Usar

1. **Antes de implementar uma mudança significativa**: Crie um RFC
2. **Durante a discussão**: Atualize o RFC com feedback
3. **Após aprovação**: Mova para "Accepted" e implemente
4. **Após implementação**: Mova para "Implemented"

## Template

Ao criar um novo RFC, use o seguinte formato:

```markdown
# RFC-XXXX: Título da Proposta

**Status:** Draft | Accepted | Rejected | Implemented  
**Date:** YYYY-MM-DD  
**Author:** Nome do Autor  
**Tags:** tag1, tag2, tag3

## Summary
[Resumo executivo da proposta]

## Motivation
[Por que esta mudança é necessária?]

## Detailed Design
[Detalhes da proposta]

## Implementation
[Como implementar]

## Migration Guide
[Como migrar código existente]
```

## Status dos RFCs

- **Draft**: Em discussão, aguardando feedback
- **Accepted**: Aprovado, pronto para implementação
- **Rejected**: Rejeitado, não será implementado
- **Implemented**: Implementado e concluído

## Referências

- [ADRs](./../adr/) - Architecture Decision Records relacionados
- [Issues](./../issues/) - Issues técnicas relacionadas
