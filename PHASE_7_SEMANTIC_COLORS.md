# Fase 7 — Migração de cores cruas → tokens semânticos

**Status:** planejada, adiada para depois do cleanup pós-prune.
**Origem:** Categoria H da varredura de valores off-scale (#3).

## Problema

129 ocorrências de cores cruas do Tailwind (`text-gray-500`, `bg-gray-50`,
`border-indigo-500`, `bg-red-50`, etc.) em 36 arquivos de componente
(excluindo stories/tests). Elas bypassam o sistema de tokens semânticos
(`--color-surface`, `--color-text-muted`, `--color-border`,
`--color-primary-*`) — é a maior violação residual da regra de tokens do
projeto.

## Por que é fase própria, não um commit

A migração não é find-and-replace. O mesmo valor cru mapeia para tokens
semânticos diferentes conforme o contexto: `text-gray-500` pode ser
`text-muted` numa legenda, `text-secondary` num label, ou `text-strong`
atenuado num título. Cada ocorrência exige triagem semântica — decidir o
_papel_ da cor, não traduzir o valor.

## Escopo (36 arquivos conhecidos)

Inclui, entre outros: Modal, Dialog/DialogDescription, Autocomplete/\*,
DatePicker/DatePickerCalendar, CommandPalette, FormWizardPattern,
ColorPicker, e ~30 outros. A Categoria B (SideNavbar
`bg-[var(--color-X)]`, ~25 ocorrências via bracket Tailwind) entra junto —
é token-driven mas inconsistente com a forma usada no resto do código;
padronizar para classe semântica nativa.

## Procedimento (quando executar)

1. **Mapear o vocabulário semântico primeiro.** Antes de tocar componente,
   confirme que os tokens semânticos cobrem todos os papéis necessários
   (text: strong/default/muted/disabled; surface: base/raised/sunken;
   border: default/strong; feedback: success/warning/danger/info em
   bg+text+border). Se faltar papel, adicione ao token set ANTES de migrar.

2. **Triagem arquivo por arquivo.** Para cada cor crua, decidir o papel
   semântico — não o valor equivalente. Usar o subagente
   `component-reviewer` para flagrar ocorrências e propor o papel; você
   confirma.

3. **Um commit por grupo coeso** (ex.: todos os feedback colors de uma vez;
   todos os text-gray de um cluster de componentes relacionados). Build
   verde entre commits.

4. **Padronizar a Categoria B junto:** trocar
   `bg-[var(--color-primary-100)]` por `bg-primary-100` (classe nativa)
   onde o token existir como classe.

5. **Fechar com regra:** após a migração, considerar um lint rule (eslint
   plugin tailwind ou regex no CI) que barre cores cruas em `src/ui/`,
   pra impedir regressão. Isso transforma a disciplina em enforcement
   automático, no espírito do resto do ambiente .claude.

## Mesma família da Phase 8

Tokens semânticos existem mas não são consumidos. Mesma patologia,
domínio diferente (cor aqui, z-index na Phase 8). Princípios de execução
provavelmente compartilhados — quando atacar as duas, vale revisitar a
outra antes pra ver se aplicam regras comuns.

## Critério de pronto

Zero cores cruas do Tailwind em código de componente (`src/ui/**/*.tsx`,
exceto stories/tests e dados intencionais como o ColorPicker). Toda cor
referencia um token semântico.
