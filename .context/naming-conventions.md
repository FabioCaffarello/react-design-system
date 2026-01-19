# Convenções de Nomenclatura de Arquivos

Este documento descreve as convenções de nomenclatura adotadas para os arquivos de contexto, seguindo o padrão do AI Context MCP.

## Padrão Geral

Todos os arquivos seguem o padrão **kebab-case** (lowercase com hífens):

- ✅ `build-fixes-implementation.md`
- ✅ `standalone-app-removal.md`
- ✅ `css-export-plan.md`
- ❌ `BUILD_FIXES_IMPLEMENTATION.md` (não usar)
- ❌ `BuildFixesImplementation.md` (não usar)
- ❌ `build_fixes_implementation.md` (não usar)

## Estrutura por Tipo

### Plans (`.context/plans/`)
**Formato:** `[descrição]-[tipo].md`

Exemplos:
- `build-fixes-implementation.md`
- `standalone-app-removal.md`
- `css-export-plan.md`

### Executive Summaries (`.context/docs/executive-summaries/`)
**Formato:** `[descrição]-summary.md`

Exemplos:
- `build-fixes-summary.md`
- `app-removal-summary.md`

### Completed Changes (`.context/docs/completed-changes/`)
**Formato:** `[descrição]-[tipo].md` (mesmo nome do plano relacionado)

Exemplos:
- `build-fixes-implementation.md` (corresponde ao plano `build-fixes-implementation.md`)
- `standalone-app-removal.md` (corresponde ao plano `standalone-app-removal.md`)

### ADRs (`.context/docs/adr/`)
**Formato:** `[número]-[descrição].md`

Exemplos:
- `0001-build-and-distribution-strategy.md`
- `0002-provider-exports-in-build.md`

### RFCs (`.context/docs/rfc/`)
**Formato:** `[número]-[descrição].md`

Exemplos:
- `0001-conditional-exports-removal.md`

### Issues (`.context/docs/issues/`)
**Formato:** `[descrição].md` (kebab-case)

Exemplos:
- `design-system-build-issue.md`
- `final-status.md`

## Regras de Nomenclatura

1. **Sempre usar lowercase** - Evita problemas de compatibilidade entre sistemas
2. **Usar hífens (`-`) para separar palavras** - Não usar underscores ou camelCase
3. **Nomes descritivos e concisos** - O nome deve indicar claramente o conteúdo
4. **Consistência entre planos e mudanças completadas** - Arquivos relacionados devem ter nomes consistentes
5. **Evitar caracteres especiais** - Apenas letras, números e hífens

## Mapeamento de Nomes Antigos → Novos

### Plans
- `CSS_EXPORT_PLAN.md` → `css-export-plan.md`
- `IMPLEMENTATION_PLAN.md` → `build-fixes-implementation.md`
- `REMOVAL_PLAN_STANDALONE_APP.md` → `standalone-app-removal.md`

### Executive Summaries
- `EXECUTIVE_SUMMARY_BUILD_FIXES.md` → `build-fixes-summary.md`
- `EXECUTIVE_SUMMARY_APP_REMOVAL.md` → `app-removal-summary.md`

### Completed Changes
- `CHANGES_IMPLEMENTED.md` → `build-fixes-implementation.md`
- `REMOVAL_COMPLETED.md` → `standalone-app-removal.md`

## Checklist para Novos Arquivos

Ao criar um novo documento, verifique:

- [ ] Nome está em kebab-case (lowercase com hífens)
- [ ] Nome é descritivo e conciso
- [ ] Segue o padrão do tipo de documento (plan, summary, etc.)
- [ ] Se relacionado a um plano, mantém consistência de nomenclatura
- [ ] Extensão é `.md` (Markdown)
- [ ] Não há caracteres especiais além de hífens

## Referências

- [AI Context MCP Documentation](https://github.com/context-ai/context-ai)
- [Markdown File Naming Best Practices](https://www.markdownguide.org/)
