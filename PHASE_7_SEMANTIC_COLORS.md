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

**Precedentes do batch Form primitives (Input/Label/Textarea/Checkbox/
Radio/Select):**

- **`bg-white` literal em primitivo de formulário → `bg-surface-base`.**
  Input é elemento _contido_ em superfície de formulário, não canvas da
  página. `surface-base` preserva o contraste correto no dark mode
  (slate-900 vs slate-950 do canvas), mantendo o input visível como
  elemento elevado sobre o fundo da página.
- **`after:text-*` em marcadores auxiliares de label →
  `after:text-fg-{role}`.** Asterisco required (`after:text-red-500`)
  usa `after:text-fg-error` (paleta rose canônica). Marcador "(optional)"
  (`after:text-gray-400`) usa `after:text-fg-tertiary` — papel "marcador
  auxiliar / caption-like", NÃO `fg-quaternary` mesmo com o valor mais
  próximo. Papel vence shade (precedente do piloto-B, Decisão 2).

**Precedentes do batch Overlay (Modal/DrawerContent/DrawerHeader/
DrawerFooter):**

- **Container de modal/popover → `bg-surface-overlay`.** Modal e Drawer
  vivem na camada de elevação acima de `surface-base` (que é o tier de
  conteúdo/formulário), que por sua vez vive acima de `surface-canvas`
  (chão da página). Sistema tem hierarquia validada de três tiers:
  `surface-canvas` → `surface-base` → `surface-overlay`. Use o tier
  certo conforme onde o componente "flutua" na pilha visual.
- **Magnitude de hover proporcional à proeminência do elemento.**
  - Elemento acionável PRINCIPAL (nav item, primary button, link
    principal): hover sobe múltiplos papéis (ex.: `fg-tertiary` →
    `fg-primary`, salto de 3 papéis) para chamar atenção.
  - Elemento acionável SECUNDÁRIO (close icon, dismiss, dropdown
    chevron, tooltip trigger): hover sobe 1 papel (ex.: `fg-tertiary`
    → `fg-secondary`) para confirmar interação sem competir por
    atenção.
  - Regra prática: se o usuário olha a tela buscando o elemento →
    hover forte. Se o elemento existe para o usuário fechar/dispensar
    algo que já encontrou → hover discreto.
  - Casos de aplicação registrados: nav item subtle (piloto-B site
    193, hover forte); close button Modal (Modal:155/167, hover
    discreto).

**Precedentes do batch Feedback (Badge/Chip/Progress/Tooltip):**

- **Track de progress role-colored → `bg-{role}-bg-emphasis`.** Quando
  o "track" (fundo) de um Progress bar tem variant colorida (success/
  error/warning/info), o track usa a shade -100 (`bg-success-bg-
emphasis` etc.), preservando role colorido e dando contraste claro
  contra o bar (`bg-{role}`, shade -500). Variants primary/secondary
  continuam com track neutro (`bg-surface-muted`) por convenção do
  design original.
- **Arrow de tooltip → `border-{direction}-surface-inverse`.** Arrow
  CSS triangle deve usar o token de cor do body como border-color, em
  TODAS as direções, para que a "ponta" funda visualmente no body.
  Aplicar quando o body migrar para `surface-inverse`.
- **`fg-brand-secondary-emphasis`** registrado como simétrico de
  `fg-brand-emphasis` para selected/active em contexto secondary
  brand. Token criado quando o batch Feedback (Badge secondary solid)
  expôs o gap.

**PRINCÍPIO — Exceção literal documentada > token forçado.**

Quando a alternativa tokenizada exige:

- shift visual significativo (≥ 2 shades), **E**
- não há papel semântico real para o caso (criar token cobriria apenas
  shade isolada, não papel),

então MANTÉM primitive literal com comentário inline explicando o
porquê. Formato do comentário:

```
// bg-{color}-{shade}: <componente/contexto> — no semantic equivalent
// (would shift X shades to <token alternativo>). Kept literal until
// <condição que destravaria criação de token>.
```

Mesma família dos micro-z (Phase 8) — exceção explícita preserva a
disciplina do vocabulário. Casos registrados: Badge secondary solid
bg (`bg-pink-300`); micro-z internals (Phase 8).

Casos NÃO se aplicam:

- Shifts de 1 shade — aceita (precedente Decisão 2 do piloto-B).
- Valores idiomáticos de overlay/scrim (`bg-black/50`, `bg-black/10`)
  — mantém literal por motivo diferente (falta de papel no sistema
  pra scrim, não shade isolada). Tracked no BACKLOG.

**PRINCÍPIO — Estado de hierarquia vs estado de interatividade.**

Quando um elemento tem variação visual relacionada à **posição numa
sequência ou ordem** (não relacionada a sua interatividade), use
tokens de **HIERARQUIA** (`fg-primary` / `fg-secondary` / `fg-
tertiary` / `fg-quaternary`) em vez de tokens de **ESTADO** (`fg-
disabled`, `surface-disabled`).

Critério prático: **o elemento permanece interativo no estado dito
"menor"?**

- **Sim → hierarquia.** Estado é de posição/ordem.
- **Não (é genuinamente inativo) → estado.**

Casos de aplicação:

- Stepper step pending (ainda não alcançado mas clicável quando
  `allowNavigation=true`) → `fg-quaternary`, NÃO `fg-disabled`.

Casos opostos (estado real de interatividade):

- Input disabled (genuinamente não-interativo) → `fg-disabled`,
  `surface-disabled`.

Razão: confundir hierarquia com estado mascara a função do
componente. Um stepper pending clicável renderizado com `fg-disabled`
engana o usuário sobre interatividade.

**PRINCÍPIO — Token semântico reflete conceito visual, não mecanismo
CSS.**

Linhas visuais (connectors, dividers, separators) usam tokens
`line-*`, independente do mecanismo de implementação (`border-*`,
`bg-*` em div fino, `height: 1px`, etc.).

Casos de aplicação:

- Stepper vertical connector (div com bg) → `bg-line-emphasis`.
- Stepper horizontal Separator (border) → `border-line-emphasis`.
- NavbarSeparator (div com bg) → `bg-line-default` (precedente
  piloto-A).
- MenuSeparator (div com bg) → `bg-line-default` (precedente Batch
  Menu).

Razão: token semântico expressa o **papel visual** (linha conectora,
divisor), não a tecnologia de implementação. Manter coerência permite
mudar implementação (div→hr, border→bg) sem precisar repensar a cor.

**PRINCÍPIO — Cardinalidade do estado determina intensidade do realce.**

- `bg-surface-brand-muted` (indigo-100) — **ACTIVE state em elemento
  singular** (nav item atual, primary button ativo, current tab). Um
  sítio destacado por vez na tela, pode ser intenso.
- `bg-surface-selected` (indigo-50) — **SELECTED state em coleção**
  (row selecionada, multiselect option marcada, checkbox row picker,
  lista de items com seleção múltipla). Múltiplos sítios podem
  coexistir; menor intensidade evita que a tela vire mar de brand
  quando o usuário marca vários.

Razão: cardinalidade do estado dita o equilíbrio visual. Material e
Carbon seguem padrão idêntico.

Casos de aplicação:

- TableRow:62 (`isSelected` true) → `bg-surface-selected`.
- NavbarItem default variant active → `bg-surface-brand-muted`
  (singular, current item).
- CommandPalette selected item → `bg-surface-brand-muted` (singular,
  cursor highlight em qualquer momento).

Aplicar em batches futuros para MultiSelect option marcada,
Checkbox-as-row-selector, lista de items com seleção múltipla.

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
