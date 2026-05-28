# Fase 7 — Migração de cores cruas → tokens semânticos

**Status:** desbloqueada pela Phase 9 (closure 2026-05-28). Próxima
fase a executar.
**Origem:** Categoria H da varredura de valores off-scale (#3),
expandida pela Phase 9 (categoria d) e absorção do escopo SideNavbar
(categoria B).

## Problema — três frentes consolidadas

Phase 7 consolida três frentes de "cor não-semântica em código de
componente":

### Frente (a) — Cores cruas Tailwind originais (~129 sítios)

129 ocorrências de cores cruas do Tailwind (`text-gray-500`,
`bg-gray-50`, `border-indigo-500`, `bg-red-50`, etc.) em 36 arquivos
de componente (excluindo stories/tests). Elas bypassam o sistema de
tokens semânticos (`text-fg-secondary`, `bg-surface-muted`,
`border-line-default`, etc.) que a Phase 9 promoveu pra `@theme`.

### Frente (b) — Neutral consumers do shim legacy (113 sítios)

Phase 9 isolou o shim `tokens/colors.ts` como compat layer mas não
deletou — 113 call sites em ~40 arquivos ainda chamam
`getColorClass("neutral", shade, type)` esperando a assinatura
antiga. Cada um precisa virar classe semântica contextual (`text-fg-*`,
`bg-surface-*`, `border-line-*`) conforme intenção. Lista completa
em `PHASE_7_CANDIDATES.md`, agrupada por padrão de consumo com
sugestão semântica e nível de confiança.

### Frente (c) — Arbitrary syntax na SideNavbar (~25 sítios)

6 arquivos em `src/ui/components/SideNavbar/` usam
`bg-[var(--color-X)]` direto (Tailwind v4 arbitrary value syntax).
Inconsistente com o resto do código que usa classe semântica nativa.
Substituir pelas equivalentes (`bg-surface-X`, etc.) agora que a
Phase 9 promoveu o vocabulário pra `@theme`.

**Total estimado: ~267 sítios em ~50 arquivos.**

## Por que é fase própria, não um commit

A migração não é find-and-replace. O mesmo valor cru mapeia para tokens
semânticos diferentes conforme o contexto: `text-gray-500` pode ser
`text-muted` numa legenda, `text-secondary` num label, ou `text-strong`
atenuado num título. Cada ocorrência exige triagem semântica — decidir o
_papel_ da cor, não traduzir o valor.

## Escopo (~50 arquivos conhecidos)

Inclui as 3 frentes acima. Entre os componentes afetados: Modal,
Dialog, Autocomplete, DatePicker, CommandPalette, FormWizardPattern,
ColorPicker, e os ~40 arquivos listados em `PHASE_7_CANDIDATES.md`
(neutrals da frente b), além dos 6 arquivos de SideNavbar
(frente c).

## Procedimento (quando executar)

1. **Vocabulário semântico já mapeado.** Phase 9 promoveu pra
   `@theme`: text (`text-fg-{primary,secondary,tertiary,quaternary,
placeholder,disabled,inverse,link*,brand,success,warning,error,
info}`), surface (`bg-surface-{canvas,base,raised,overlay,sunken,
subtle,muted,emphasis,strong,inverse,brand*,secondary*,accent*,
hover,active,selected,focus,disabled}`), line (`border-line-
{default,muted,subtle,emphasis,strong,inverse,focus,brand,
secondary,accent}`), feedback (`bg-{success,warning,error,info}{,-bg,-bg-emphasis,-light,-dark}`).
   Antes de migrar, confirmar que toda intenção tem token; se faltar,
   adicionar primeiro.

2. **Frente (b) usa PHASE_7_CANDIDATES.md como checklist.** Cada
   sítio neutral lá tem sugestão semântica + confiança. Triagem é
   confirmar ou substituir a sugestão conforme contexto.

3. **Triagem arquivo por arquivo nas demais frentes.** Pra cada cor
   crua (frente a) e cada `bg-[var(...)]` (frente c), decidir o papel
   semântico — não o valor equivalente. Usar o subagente
   `component-reviewer` pra flagrar ocorrências e propor o papel;
   confirmar.

4. **Um commit por grupo coeso** (ex.: todos os feedback de uma vez;
   todos os text-gray de um cluster de componentes relacionados; toda
   a SideNavbar de uma vez). Build verde entre commits.

5. **Padronizar a frente (c) junto:** trocar
   `bg-[var(--color-primary-100)]` por `bg-brand-primary-muted` (ou
   o token semântico equivalente) onde o token existir como classe.

6. **Deletar o shim como último passo da fase.** Após zero call sites
   neutrais restantes (frente b completa), `git rm
src/ui/tokens/colors.ts`. Remover também os 4 re-exports legacy
   em `src/ui/tokens/index.ts` (marcados como "LEGACY until Phase 7").
   Build verde fecha a fase.

7. **Fechar com regra:** após a migração, considerar um lint rule
   (eslint plugin tailwind ou regex no CI) que barre cores cruas em
   `src/ui/`, pra impedir regressão.

## Heurística de tradução (registrada do piloto)

Mapeamento canônico de papel visual → token semântico. Use como ponto
de partida; o contexto do componente pode pedir desvio (registrar como
decisão "média"/"baixa" confiança e consultar).

| Papel visual                               | Token semântico                        |
| ------------------------------------------ | -------------------------------------- |
| title / heading                            | `text-fg-primary`                      |
| subtitle / description                     | `text-fg-secondary`                    |
| placeholder                                | `text-fg-placeholder`                  |
| disabled (state, não hierarquia)           | `text-fg-disabled`                     |
| timestamp / caption                        | `text-fg-tertiary`                     |
| link                                       | `text-fg-link`                         |
| error / success / warning / info message   | `text-fg-{error,success,warning,info}` |
| brand idle (active state default)          | `text-fg-brand`                        |
| brand emphasized (selected/active intenso) | `text-fg-brand-emphasis`               |
| separator / divider                        | `bg-line-default`                      |
| active item bg (neutro)                    | `bg-surface-active`                    |
| selected item bg (brand)                   | `bg-surface-brand-muted`               |
| hover bg (neutro mais sutil)               | `bg-surface-hover`                     |
| focus ring                                 | `focus:ring-line-focus`                |
| text sobre fundo colorido escuro           | `text-fg-inverse`                      |

**Precedentes do piloto (registram decisões já validadas):**

- **Disabled state usa `fg-disabled`, não `fg-quaternary`.** Mesmo
  quando o shade original (slate-400) bate exato com `fg-quaternary`, o
  papel correto é de _estado_, não de hierarquia. Aceita shift visual
  de slate-400 → slate-300.
- **Active brand state usa `fg-brand-emphasis`, não `fg-link`.**
  `fg-link` é reservado para hyperlinks navegáveis; nav item ativo é
  estado de seleção, papel distinto.
- **Tokens novos só por papel, não por shade.** `fg-brand-emphasis`
  preenche um papel novo (selected/active intensified). `fg-strong`
  (slate-700) NÃO foi criado — só preencheria gap de shade entre
  `fg-secondary` (slate-600) e `fg-primary` (slate-900) sem trazer
  papel novo.
- **Shifts de hue aceitos em feedback canônico.** `bg-red-500` migra
  para `bg-error` (rose-500); `bg-green-500` migra para `bg-success`
  (emerald-500). Sistema escolheu rose/emerald como paleta canônica de
  feedback — manter red/green literal é inconsistência.

## Mesma família da Phase 8

Tokens semânticos existem mas não são consumidos. Mesma patologia,
domínio diferente (cor aqui, z-index na Phase 8). Princípios de execução
provavelmente compartilhados — quando atacar as duas, vale revisitar a
outra antes pra ver se aplicam regras comuns.

## Critério de pronto

- Zero cores cruas do Tailwind em código de componente
  (`src/ui/**/*.tsx`, exceto stories/tests e dados intencionais como
  o ColorPicker). Toda cor referencia um token semântico.
- Zero `getColorClass("neutral", ...)` (frente b consumida).
- Zero `bg-[var(--color-*)]` arbitrary syntax na SideNavbar (frente c
  consumida).
- `src/ui/tokens/colors.ts` deletado.
- Bloco "LEGACY" em `src/ui/tokens/index.ts` removido.
- Build verde, tests verdes.
