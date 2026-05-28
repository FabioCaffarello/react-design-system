# Fase 9 — Consolidação do shim de cores

**Status:** em execução na branch `phase/09-color-shim-consolidation`.
**Origem:** #4 (Coverage / órfãos). Triagem de dead code em
`src/ui/tokens/colors/utils.ts` revelou que o arquivo **não tem
nenhum consumidor real** — não porque ficou sem uso, mas porque um
shim em `src/ui/tokens/colors.ts` (451 linhas) sombreia o sistema
novo via resolução de módulo do TypeScript (arquivo `colors.ts`
ganha do diretório `colors/` quando o import é `./tokens/colors`).

## Problema central

O sistema novo em `src/ui/tokens/colors/` (com `primitives.ts`,
`semantic.ts`, `utils.ts`, `types.ts`, `index.ts`) foi construído
pra **substituir** o shim. A migração nunca completou. Resultado:

- O shim `colors.ts` virou o real — define localmente as classes
  Strategy, a `ColorTokenFactory`, os tokens `COLOR_TOKENS_*`, e as
  5 funções `getColor*` (`getColor`, `getColorClass`,
  `getHoverColorClass`, `getFocusColorClass`, `getFocusRingClass`).
- O sistema novo virou ornamental — `colors/utils.ts` define as
  mesmas 5 funções `getColor*`, mais 8 funções utilitárias
  (`getSemanticColorValue`, `getSemanticColorClass`, `withOpacity`,
  `isLightColor`, `getContrastColor`, `blendColors`, `lighten`,
  `darken`). Nenhuma é consumida fora dos próprios barrels.
- CLAUDE.md proíbe shims de back-compat explicitamente — é
  exatamente o que está vivo.

## Por que a resolução de módulo importa

Em TypeScript, com `tsconfig.app.json` usando
`"moduleResolution": "bundler"`, um import `from './tokens/colors'`
resolve assim:

1. Procura `./tokens/colors.ts` (arquivo) — **encontra**, usa essa.
2. Só se não achasse, tentaria `./tokens/colors/index.ts` (diretório).

Como `colors.ts` existe, **todos os 37 arquivos** que importam de
`'../tokens/colors'` recebem as definições locais do shim, não as
do sistema novo. As 5 funções `getColor*` no shim **sombreiam** o
`export * from "./colors/index"` que o próprio shim faz, porque em
ESM exportações nomeadas explícitas têm precedência sobre `export *`.

## Achado da investigação

A triagem inicial detectou que a fase é **mais profunda que um
rename de imports**. O repo está com **três migrações inacabadas
em sequência**:

1. **Cor** (Phases 7 + 9): tokens semânticos definidos, código
   ainda usa cores cruas (Phase 7) E o shim legacy ainda sombreia
   o sistema novo de cores (Phase 9).
2. **Z-index** (Phase 8, fechada): tokens semânticos definidos,
   código usava Tailwind cru. Reconciliada em 2026-05.
3. **Tailwind v3 → v4** (descoberto durante Phase 9): primitivas
   já em `@theme` (utilitários nativos gerados), mas o vocabulário
   semântico inteiro (text/bg/surface/border/state/feedback
   contextuais) ficou em `:root` — não promovido. Só consumível
   via `var()` ou arbitrary values do tipo
   `bg-[var(--color-bg-base)]`.

A migração v3→v4 parcial é a TERCEIRA migração inacabada no repo —
mesma família estrutural. Phase 9 fecha as duas pendências de cor
de uma vez: promove o vocabulário semântico pra `@theme` (corrigindo
v3→v4) e elimina o shim (consolidando o sistema novo).

## Convenção de consumo decidida

**Cor é consumida via classe Tailwind nativa.** Não via getters JS,
não via arbitrary values, não via `@utility` custom. Os utilitários
existem porque as vars estão em `@theme`. Convenção pública:

```
bg-surface-base, bg-surface-muted, bg-surface-hover    (do --color-surface-*)
text-fg-primary, text-fg-secondary, text-fg-muted      (do --color-fg-*)
border-line-default, border-line-strong, border-line-focus (do --color-line-*)
bg-success, text-success, border-success-emphasis      (do --color-success*)
```

Pra essas classes existirem como utilitárias, as vars semânticas
precisam estar em `@theme`. **Phase 9 faz essa promoção.** Phase 7
(migração das 129 ocorrências de cores cruas) depende dela.

## Decisão de naming

Tailwind v4 gera utilitários com nome `{prefixo}-{nome-da-var-menos-"--color-"}`.
Os nomes atuais (`--color-bg-*`, `--color-text-*`, `--color-border-*`,
`--color-state-*`) foram desenhados pra consumo via `var()`, com o
prefixo encodando a intenção de uso. Promover as-is produziria
utilitários feios (`bg-bg-base`, `text-text-secondary`,
`border-border-strong`) com duplo prefixo redundante.

**Decisão:** renomear o vocabulário antes de promover. Mapeamento:

| Namespace antigo   | Namespace novo                | Justificativa                                                                                                                 |
| ------------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--color-bg-*`     | `--color-surface-*`           | `bg-*` já sobrepunha semanticamente `surface-*` no repo; separação não justificada arquiteturalmente.                         |
| `--color-text-*`   | `--color-fg-*`                | Evita `text-text-*` duplo prefixo. `fg` é vocabulário reconhecível por quem conhece Radix/Primer.                             |
| `--color-border-*` | `--color-line-*`              | Evita `border-border-*` duplo prefixo. `line` é o termo usado em Material e Adobe Spectrum.                                   |
| `--color-state-*`  | `--color-surface-*` (fundido) | Estados de cor são variações de superfície (hover/active/selected/focus aplicam-se a backgrounds). Merecem o mesmo namespace. |

### Achado durante o rename: canvas vs base

O rename revelou que `--color-bg-base` e `--color-surface-base`
codificavam conceitos diferentes — **canvas** (chão da página) e
**resting surface** (cards/painéis) — distinguíveis por elevação no
dark mode:

- `bg-base` em dark = `slate-950` (canvas, camada mais escura)
- `surface-base` em dark = `slate-900` (resting surface, um nível
  acima do canvas)

Fundir ambos teria descartado a hierarquia de elevação dark. Decisão:
renomear `bg-base` pra **`--color-surface-canvas`**, mantendo
`--color-surface-base` intacto.

Vocabulário público resultante: **canvas / base / raised / overlay /
sunken** — convenção de design systems modernos (Material elevation,
iOS layers).

### Conflito fundido: surface-disabled

`--color-state-disabled` e `--color-surface-disabled` tinham valores
idênticos em todos os temas (`slate-100` light, `slate-800` dark).
Fundidos em `--color-surface-disabled` sem perda.

## Escopo expandido (4 grandes etapas)

1. **Verificar `@theme` + override de tema (PASSO 0 — feito).** Movi
   `--color-bg-base` pra `@theme` em experimento isolado, build
   verde, inspeção do CSS confirmou que `[data-theme="dark"]`
   override é preservado intacto e cascade opera. `@theme` não
   "tranca" valores. Caminho A é viável.
2. **Rename + promover vocabulário semântico pra `@theme`.**
   Aplica o mapa de rename acima (sem fundir surface-canvas com
   surface-base), depois move as declarações de `:root` pra `@theme`
   em `semantic/colors.css`. `themes/{light,dark}.css` e
   `variants/*.css` continuam declarando overrides em seletores
   específicos.
3. **Repointar API pública pro sistema novo, isolar shim como
   compat layer.** `src/ui/index.ts` e a parte da barrel
   `tokens/index.ts` que não tem mais consumers internos passam a
   apontar pra `./tokens/colors/index` (sistema novo). Os re-exports
   de `getColorClass`/etc. continuam apontando pro shim sob comentário
   "legacy until Phase 7", servindo os 113 call sites neutrais
   restantes (categoria d, documentados em `PHASE_7_CANDIDATES.md`).
4. **Migração da SideNavbar arbitrary syntax e deleção física do
   shim ficam pra Phase 7.** Razão na seção "Significado de
   consolidation" abaixo.

## Significado de "consolidation" nesta fase

Consolidation aqui significa **tornar o sistema novo
(`tokens/colors/`) o canônico do design system, isolando o shim
(`tokens/colors.ts`) como compat layer explícita com vida útil
limitada**. A deleção física do shim é responsabilidade da Phase 7,
que migra os 113 call sites neutrais restantes — únicos consumidores
remanescentes do shim pós-Phase 9.

Esta fronteira é deliberada. A migração dos 113 sítios é triagem
semântica componente-a-componente (cada `getColorClass("neutral",
"DEFAULT", "text")` pode virar `text-fg-secondary`, `text-fg-tertiary`,
ou outra classe conforme contexto). Esse trabalho é literalmente o
objetivo da Phase 7. Forçar dentro de Phase 9 seria scope creep e
duplicaria a triagem.

## Dependência com Phase 7

**Phase 9 desbloqueia Phase 7.** Antes da promoção pra `@theme`,
o vocabulário-alvo da Phase 7 (`text-fg-secondary`, `bg-surface-base`,
`border-line-strong`, `bg-success-bg`) NÃO existe como classe
utilitária no build — só como CSS variable em `:root`. Phase 7
ficaria sem alvo de classe pra escrever.

Phase 9 transforma esse vocabulário em utilitários nativos. Phase 7
passa a ser substituição direta de classe (`text-gray-500` →
`text-fg-secondary`), commit por grupo coeso, sem cerimônia de getter
JS ou arbitrary syntax.

Ordem firme: **Phase 9 → Phase 7**.

## Critério de pronto da Phase 9

- API pública (`src/ui/index.ts`) exporta cor a partir do sistema
  novo (`./tokens/colors/index`).
- `ThemeProvider`, brand/feedback consumers, `Text`/`Toast` dynamic
  resolution: todos migrados pro sistema novo.
- `tokens/index.ts` barrel: símbolos exclusivos do shim removidos
  (`COLOR_TOKENS_LIGHT/DARK`, `ColorRole`). `getColorClass` e
  similares mantidos apontando pro shim com comentário "legacy until
  Phase 7".
- `--color-{surface,fg,line}-*` declarados em `@theme` em
  `semantic/colors.css`. Light/dark/variants overrides intactos em
  seletores específicos.
- Utilitários nativos `bg-surface-*`, `text-fg-*`, `border-line-*`
  presentes no CSS compilado e consumíveis em JSX sem arbitrary
  syntax.
- Shim `tokens/colors.ts` continua existindo fisicamente, com
  consumers (113 neutral call sites) documentados em
  `PHASE_7_CANDIDATES.md`.

## Critério de pronto da Phase 7 (atualizado)

- 113 call sites neutrais migrados conforme `PHASE_7_CANDIDATES.md`.
- Demais cores cruas (`text-gray-500` etc., 129 ocorrências
  originais) também migradas.
- 25 sítios em `SideNavbar/` que usam `bg-[var(--color-*)]`
  arbitrary syntax migrados pra classes nativas (categoria B do
  escopo Phase 7).
- Shim `tokens/colors.ts` deletado (`git rm`) — sem consumers
  restantes.

## Mesma família das Phases 7 e 8

Padrão recorrente do cleanup pós-prune: alguém começou uma
migração estrutural, parou no meio, deixou os dois sistemas
convivendo. Phase 7 (color tokens semânticos definidos, código
usa cores cruas), Phase 8 (z-index tokens semânticos definidos,
código usa Tailwind cru), Phase 9 (sistema novo de cores
definido, código usa shim legacy + vocabulário semântico não
promovido pra v4). Mesmo gesto arquitetural três vezes; cada
migração inacabada virou uma fase própria por causa do tamanho
do refactor + necessidade de triagem componente a componente.
