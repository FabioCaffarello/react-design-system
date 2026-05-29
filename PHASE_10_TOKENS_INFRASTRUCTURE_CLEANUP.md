# Fase 10 — Tokens infrastructure cleanup

**Status:** ✅ **FECHADA em 2026-05-28** (6 commits, ramo
`phase/10-tokens-infrastructure-cleanup`).

**Origem:** Phase 7 closure (registro no BACKLOG). Sanity check
pré-deleção do shim `tokens/colors.ts` revelou 4 consumidores internos
em `src/ui/tokens/` que ainda dependiam do shim — Phase 7 cumpriu o
escopo declarado (zero consumo em `components/` e `primitives/`), mas a
deleção física do shim foi adiada porque tocava infraestrutura interna,
não vocabulário de componente.

## Os 4 candidatos investigados

1. `tokens/gradients.ts` — Factory de gradientes que lia hex do shim.
2. `tokens/themes/light.ts` e `dark.ts` — Constantes `LIGHT_THEME` /
   `DARK_THEME` agregando colors+spacing+typography+breakpoints.
3. `tokens/tokens.factory.ts` — `TokensFactory` (Factory Pattern
   atrelado ao `ColorRole` antigo).
4. `tokens/TokenVisualizations.tsx` — Componentes de visualização das
   docs Storybook.

## Achado central — 3 de 4 eram código morto

Investigação POR ARQUIVO antes de qualquer deleção (subagentes Explore
em paralelo, formato consistente: propósito → uso real → dependências
→ status → recomendação preliminar):

| Arquivo                       | Status    | Consumidores reais                                                                              |
| ----------------------------- | --------- | ----------------------------------------------------------------------------------------------- |
| `tokens.factory.ts`           | **morto** | Zero. Re-exportado + 1 exemplo em docs.                                                         |
| `themes/light.ts` + `dark.ts` | **morto** | Zero. Re-exportados, ninguém consome. ThemeProvider já usa `SEMANTIC_COLORS_LIGHT/DARK` direto. |
| `gradients.ts`                | **zumbi** | Re-exportado; `GradientReference` importado mas nunca renderizado no MDX.                       |
| `TokenVisualizations.tsx`     | **vivo**  | 1 consumidor: `Tokens.mdx` (docs Storybook). Único acoplado ao shim por motivo legítimo.        |

O único trabalho real de migração foi reescrever
`TokenVisualizations.tsx` para consumir `SEMANTIC_COLORS_LIGHT` +
`SemanticColorName` do sistema novo. Os outros 3 foram deletados sem
substituição.

## Divergência visual intencional registrada

O shim hardcodava palettes antigas (`pink`, `green`, `yellow`, `red`,
`blue`, `gray`). O sistema novo (Phase 9) usa o vocabulário
rebrandeado (`violet`, `emerald`, `amber`, `rose`, `sky`, `slate`),
além do role novo `accent` (cyan). Os componentes UI já consumiam o
novo pós-Phase 7. A página `Design System/Tokens` no Storybook,
porém, continuava lendo do shim — mostrando cores que não
correspondiam mais ao que os componentes renderizavam de fato.

O refactor do `TokenVisualizations` **trouxe a doc em sync com a
realidade**. Smoke visual via Playwright CLI confirmou 32 swatches
(8 roles × 4 shades), todos resolvendo com as cores corretas do
sistema novo, console limpo.

## 6 commits

| #         | Commit                                                                          | Resumo                                                                                                                  |
| --------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `f4df9e8` | `refactor(tokens): migrate TokenVisualizations to new color system (8 roles)`   | Imports `COLOR_TOKENS_LIGHT/ColorRole` → `SEMANTIC_COLORS_LIGHT/SemanticColorName`. Adiciona `accent` à `ColorPalette`. |
| `084f6a5` | `chore(tokens): delete tokens.factory.ts (dead file)`                           | Remove arquivo + re-exports + seção `## Token Factory` do MDX.                                                          |
| `fd737fe` | `chore(tokens): delete themes/light.ts and themes/dark.ts (dead files)`         | Remove arquivos + diretório `themes/` + re-exports.                                                                     |
| `9654d55` | `chore(tokens): delete gradients.ts (zombie file) and remove from docs`         | Remove arquivo + re-exports + função `GradientReference` + seção `## Gradient Tokens` do MDX.                           |
| `3311d92` | `chore(tokens): delete legacy color shim (tokens/colors.ts) — Phase 10 closure` | Shim `~14k LOC` deletado. Sistema novo `tokens/colors/` permanece como única fonte de cor.                              |
| _(este)_  | `docs(phase-10): mark complete + grep verification + BACKLOG cleanup`           | Verificação final, lição metodológica registrada, BACKLOG limpo.                                                        |

**Linhas deletadas líquido:** 451 (shim) + 327 (factory) + 38 (themes)

- 243 (gradients + docs) ≈ **~1059 LOC removidas** contra **4
  inserções** no `TokenVisualizations` (adição do role `accent`).

## Verificação final

```sh
grep -rIn --include='*.ts' --include='*.tsx' --include='*.mdx' \
  -E '\b(COLOR_TOKENS_LIGHT|COLOR_TOKENS_DARK|LightColorStrategy|\
DarkColorStrategy|ColorTokenFactory|LIGHT_THEME|DARK_THEME|\
TokensFactory|GradientTokenFactory|getGradient|getGradientClass)\b' \
  src/
# → zero hits

grep -rIn --include='*.ts' --include='*.tsx' --include='*.mdx' \
  -E '(from\s+["'"'"'])([./]+tokens/colors|\.{1,2}/colors)(["'"'"'])' \
  src/ | grep -v 'colors/'
# → zero hits (todo import aponta pra ./colors/index, o novo sistema)
```

Build verde + 764 testes passando após cada commit.

## Lição metodológica

Quando o trabalho de cleanup envolve múltiplos arquivos relacionados
(N candidatos a deleção que podem ter dependências cruzadas entre si):

**Mapear o grafo de dependências INTERNAS entre os candidatos a deleção
ANTES de definir a ordem de execução.** Não basta inventariar quem
usa cada arquivo externamente — também é preciso saber quem entre os
mortos depende de quem entre os mortos.

**Por que importa:** investigação inicial (Passo 1) cobriu propósito,
uso externo, dependências sobre o shim, status — formato robusto, 4
subagentes em paralelo, relatórios consistentes. Mas não fez o passo
extra de mapear arestas entre os 4 candidatos. Resultado: a primeira
tentativa de deleção (ordem original 98=gradients) quebrou o build,
porque `tokens.factory.ts` importava `GradientTokenFactory` de
`gradients.ts`. A dependência interna `factory → gradients` estava
presente na investigação original, mas não foi extraída pro
plano de ordem.

**Custo do erro:** ~2 ciclos de iteração. Reset da working tree,
remapeamento do grafo (Passo 1 da segunda tentativa, ~5 min de
trabalho), reordenação dos commits. Sem perda de código — git
restaurou tudo. Não-trivial mas amortizável.

**Regra simplificada para futuro:** antes de definir ordem de deleção
de N arquivos, listar para cada arquivo:

```
arquivo → arquivos do conjunto morto que ele importa
```

Topo-sort reverso (folhas primeiro: quem só é dependente, não
dependência) dá a ordem que evita patches transitórios.

**Grafo final que orientou esta fase:**

```
tokens.factory.ts ──┬─> tokens/colors.ts (shim)
                    └─> gradients.ts
gradients.ts        ──> tokens/colors.ts (shim)
themes/light.ts     ──> tokens/colors.ts (shim)
themes/dark.ts      ──> tokens/colors.ts (shim)
```

Ordem de deleção derivada (topo-sort reverso):
`factory → themes → gradients → shim`.

## Pós-condição

- Diretório `src/ui/tokens/` agora tem como única fonte de cor o
  sistema novo (`tokens/colors/{index,types,semantic,primitives,
utils}.ts`).
- Zero shim, zero re-exports legacy, zero arquivo morto sob `tokens/`.
- Storybook `Design System/Tokens` reflete o vocabulário real
  consumido pelos componentes (8 roles, palette nova).
- `tokens/colors/` continua canônico — sem mudança estrutural;
  apenas o entorno foi simplificado.
