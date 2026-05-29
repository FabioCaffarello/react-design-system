# Fase 13a — Storybook smoke visual (runtime detection)

**Status:** ✅ **FECHADA em 2026-05-29** (8 commits, ramo
`phase/13a-storybook-smoke-visual`).

**Origem:** ausência de qualquer gate que detectasse crashes runtime
em stories do Storybook. Tests Vitest cobrem componentes em jsdom,
não exercitam o pipeline real de render do Storybook. Stories raras
(`*-state`, variantes obscuras, demos de fallback) podiam apodrecer
silenciosamente entre PRs.

## O que entrou

Infraestrutura de smoke runtime para **852 stories** geradas pelos
67 arquivos `.stories.tsx` do projeto. Cada story é aberta em
Chromium headless via Playwright contra um servidor estático
efêmero servindo `storybook-static/`. O resultado vai para
`smoke-report.json`, screenshots de falha para `smoke-failures/`,
exit code 0/1 para uso em CI futura.

```
npm run storybook:smoke              # build + smoke (full)
npm run storybook:smoke -- --filter '<regex>'   # subset
npm run storybook:smoke -- --workers 8          # paralelismo
```

## Por quê

- 852 stories, 67 títulos. Auditoria visual manual via UI: inviável.
- Variantes raramente abertas (`*-state` para play-fn etc.) podem
  acumular drift: dep upgrade quebra runtime, tests jsdom não veem.
- Quando uma rodada futura quiser checar antes de merge, a infra
  precisa existir e ser idempotente — não improvisada no PR.

## Como (arquitetura)

```
scripts/storybook-smoke.mjs
  ├── parse args (timeout, workers, settle, filter, output)
  ├── load storybook-static/index.json → 852 entries (filter type=story)
  ├── start ephemeral Node http server over storybook-static/
  ├── lazy-import @playwright/test (fails clean if absent)
  ├── workerPool (default 6, ~150ms settle/story)
  └── per story:
       open /iframe.html?id=<id>&viewMode=story
       wait for terminal render state
       evaluate parameters.smoke (runtime read)
       partition console.errors against allowlist
       verdict + optional screenshot
```

Output JSON: `passed/failed/byStatus + perStory{status,errors,warnings,
allowedWarnings,smokeConfig,...} + totalAllowedWarnings,
storiesWithAllowlist, undocumentedAllowlists, deadSmokeConfigs`.

## Decisões metodológicas registradas

1. **Critério dual de render-terminal.** O detector original
   declarava `pass` quando o body recebia `sb-show-main`. Falsa
   premissa: essa classe sinaliza o MODO DOCUMENTAL escolhido
   (main vs docs vs error), não que React mountou. Pipeline real:
   `(1) body.sb-show-main → (2) #storybook-root cleared →
(3) React mounts children`. Polling entre (1-2) e (3) gerou 577
   falsos `fail-empty` (67% das stories). Critério corrigido:
   `state === 'main' && #storybook-root.children.length > 0`. Header
   comment do script registra o porquê pra impedir refator de volta.

2. **Allowlist runtime, não index-driven.** Tentei ler
   `parameters.smoke` do `index.json` (sugerido no plano original):
   impossível por design do Storybook 10 — parameters podem ser
   funções/computados; o catálogo estático é deliberadamente leve.
   Caminho real:
   `window.__STORYBOOK_PREVIEW__.currentRender.story.parameters` lido
   no browser após render confirmar.

3. **Settle pós-render.** 150ms default entre verdict de render e
   leitura/partição de errors. Captura erros tardios típicos
   (`<img onerror>` após network failure — caso da Avatar
   ImageError). Custo total: ~14s sobre 852 stories com 8 workers.

4. **Reason obrigatório, 4-state validation.** `parameters.smoke`
   tem 4 estados surfaceados no relatório:
   - **absent** → comportamento normal, nada a reportar.
   - **ok** → `allowConsoleErrors` + `reason` não-placeholder. Uso
     correto, allowlist aplicada.
   - **undocumented** → `allowConsoleErrors` presente, `reason`
     ausente/empty/TODO/FIXME/tbd/wip/n/a. Allowlist aplicada
     **mas story listada na seção `undocumentedAllowlists`**.
     Pressão sem punição.
   - **dead** → `parameters.smoke` declarado mas
     `allowConsoleErrors` vazio/ausente. Listada em
     `deadSmokeConfigs` (typo provável ou config morta).
     Matching aceita strings (substring) e `/regex/flags` literais.

## Findings

- **852/852 stories pass** pós-calibragem. Zero crashes runtime,
  zero console.errors não-documentados, zero timeouts.
- **1 allowlist legítima**: `primitives-avatar--image-error`
  declara `parameters.smoke.allowConsoleErrors:
["net::ERR_NAME_NOT_RESOLVED"]` porque a story
  intencionalmente usa URL inválida pra demonstrar fallback de
  iniciais. Reason inline na story.
- **9 deprecation warnings** Storybook 8→9 (`"Accessing the Story
Store is deprecated and will be removed in 9.0"`), idênticas, 9
  stories distintas. Vem de addon/dep, não código do projeto.
  Registradas em BACKLOG.md para próximo upgrade major.
- **Tempo: 51.8s** total (build 6s + smoke 46s) com 8 workers,
  settle 150ms. Bem dentro do budget de 10min do brief original.

## Lições metodológicas

O princípio **"calibra detector, não componente"** apareceu três
vezes na Phase, sempre com o mesmo padrão: o sinal preliminar pareceu
indicar dívida; investigação do instrumento revelou que o instrumento
estava errado.

1. **Race condition no detector → 577 fail-empty falsos.**
   Screenshot da story "falha" mostrou Accordion renderizado
   perfeitamente. Distribuição de duração pass/fail idêntica
   (p50 202 vs 231ms). 45/67 arquivos com mistura intra-file. Tudo
   sinalizava race no detector, não bug nos componentes.

2. **Console.error do Avatar como falso positivo.** O erro vinha da
   camada de rede do Chromium, não do bundle JS. Calibragem
   (allowlist com reason) preservou a strictness para outros casos
   sem mascarar o sinal real.

3. **Premissa `index.json` incorreta no plano de allowlist.** Plano
   original assumia parameters expostos no catálogo estático.
   Probing antes de codar mostrou que não estão lá por design. Pivot
   pra runtime-read evitou commit que falharia em produção.

Padrão geral: **investigar o instrumento antes de aceitar a
medição**. As Phases 7 (BSD grep silencioso), 12 (sweep miss em
sidebar.ts) e 13a (race condition no detector) reforçam a mesma
regra. Quando o achado for grande e surpreendente, dobrar a
investigação do detector antes de tratar como dívida.

## 8 commits

| #         | Commit                                                                 | Resumo                                                                                            |
| --------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `dea0ea9` | `feat(scripts): add storybook smoke test script`                       | Script base, native http server, lazy Playwright import.                                          |
| `f35f7ba` | `chore(deps): add @playwright/test as dev dependency`                  | +17 MB on disk; transitive resolution já existia via @vitest/browser-playwright.                  |
| `d03a333` | `feat(npm): add storybook:smoke script`                                | `npm run storybook:smoke` = build + smoke.                                                        |
| `c44a129` | `fix(scripts): require #storybook-root children before declaring pass` | Detector race condition fix; converteu 576 false-positive fail-empty em pass.                     |
| `15e3c87` | `feat(scripts): per-story allowlist via runtime story parameters`      | Runtime read de `parameters.smoke`, 4-state validation, settle.                                   |
| `0bee31d` | `feat(avatar): document expected console error in ImageError story`    | Avatar declara `parameters.smoke.{allowConsoleErrors,reason}` para o `net::ERR` da fallback demo. |
| `<doc>`   | `docs(claude): document smoke script and methodology`                  | Este arquivo + npm script registrado em CLAUDE.md.                                                |
| `<bk>`    | `docs(backlog): register Phase 13a follow-ups`                         | Storybook deprecation, Phase 13b/c candidates, methodological extraction note.                    |

## Pós-condição

- `npm run storybook:smoke` disponível e idempotente. Pode rodar
  local ou em CI sem estado interativo.
- 852/852 stories testadas; quando uma quebrar, smoke detecta na
  primeira rodada.
- `parameters.smoke` é o canal inline para legitimar console.errors
  esperados — reason obrigatória, validada estaticamente em 4
  estados, sem silenciar a regra global.
- Infraestrutura pronta para Phase 13b (docs MDX per component) e
  Phase 13c (Storybook as product) usarem como gate de "antes de
  alterar a apresentação, garantir que tudo ainda renderiza".
