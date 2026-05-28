# Fase 9 — Consolidação do shim de cores

**Status:** planejada, adiada para depois do cleanup pós-prune.
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

## Escopo da consolidação

1. **Decidir versão canônica.** As 5 funções `getColor*` existem em
   duas implementações (shim local vs `colors/utils.ts`). Auditar as
   duas, decidir qual fica. Provavelmente o sistema novo — é o
   destino arquitetural já indicado pelo próprio cabeçalho do shim
   (`"For the new color system, use imports from './colors/index.ts'"`).
2. **Mover ativos do shim pro sistema novo.** Classes Strategy
   (`LightColorStrategy`, `DarkColorStrategy`), `ColorTokenFactory`,
   constantes `COLOR_TOKENS_LIGHT/DARK/COLOR_TOKENS` — mover pra
   `colors/` no arquivo apropriado (`types.ts` pros types já
   movidos, `factory` ou novo `strategies.ts` pras classes).
3. **Atualizar os 37 imports.** `from '../tokens/colors'` →
   `from '../tokens/colors/index'` (ou simplesmente `from '../tokens'`
   se o barrel raiz já cobrir, o que é o caso hoje).
4. **Deletar o shim `colors.ts`.** Sem caminho de migração reverso —
   é uma quebra silenciosa pra qualquer consumidor externo que
   dependa do path antigo, mas mono-brand solo não tem esses.
5. **Lidar com `colors/utils.ts`** depois do shim morrer. Se
   manteve-se durante a consolidação como home das 5 funções
   `getColor*`, vira load-bearing de verdade — sai do estado dead
   code. As 8 funções extras (`withOpacity`, `lighten`, `darken`,
   etc.) entram em triagem própria de "manter ou deletar" caso a
   caso.

## Dependência com Phase 7

**Phase 9 DEVE vir antes da Phase 7.**

Phase 7 (`PHASE_7_SEMANTIC_COLORS.md`) é a migração das 129
ocorrências de cores cruas (`text-gray-500`, `bg-gray-50`, etc.)
para a API semântica de cores. Essa API é exatamente o que está
duplicado entre o shim e o sistema novo. Se Phase 7 for executada
primeiro:

- O critério "trocar `text-gray-500` por chamada à API semântica"
  vai usar a API atual, que é a do shim (porque é o que está
  vivo no grafo de imports).
- Quando Phase 9 finalmente consolidar e migrar pro sistema novo,
  TODAS as chamadas escritas na Phase 7 vão ter que ser revisitadas
  pra apontar pro path correto.
- Possível regressão silenciosa: um helper semântico no shim pode
  diferir do equivalente no sistema novo (já que são implementações
  separadas), produzindo mudanças visuais inesperadas na migração
  Phase 9.

Ordem correta: **Phase 9 → Phase 7**.

## Critério de pronto

- Zero arquivos `tokens/colors.ts` (shim eliminado).
- Zero duplicação de nomes de função entre shim e sistema novo.
- Os 37 imports apontam pra paths não-ambíguos
  (`tokens/colors/index` ou o barrel `tokens`).
- Função `getColor*` tem **uma** implementação canônica, no sistema
  novo (`colors/utils.ts` ou onde o trabalho de consolidação
  acordou colocar).
- Coverage de `tokens/colors/utils.ts` reflete uso real (deixa de
  ser dead code).

## Mesma família das Phases 7 e 8

Padrão recorrente do cleanup pós-prune: alguém começou uma
migração estrutural, parou no meio, deixou os dois sistemas
convivendo. Phase 7 (color tokens semânticos definidos, código
usa cores cruas), Phase 8 (z-index tokens semânticos definidos,
código usa Tailwind cru), Phase 9 (sistema novo de cores
definido, código usa shim legacy). Mesmo gesto arquitetural três
vezes; cada migração inacabada virou uma fase própria por causa
do tamanho do refactor + necessidade de triagem componente a
componente.
