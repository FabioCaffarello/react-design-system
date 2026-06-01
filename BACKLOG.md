# Backlog técnico (pós-cleanup)

Itens descobertos durante o cleanup que não são blockers mas que precisam
de decisão futura. Cada item, quando atacado, deve virar fase própria ou
PR pequeno conforme escopo.

## Helper signature gap: getSpacingClass não cobre dimension/position

**Descoberto em:** #3b, ao migrar half-steps.
**Estado:** Dot, Input, Stepper, Timeline, SideNavbarResizeHandle têm
literais `w-0.5`, `h-1.5`, `top-2.5`, etc. — valores na escala correta,
mas consumo inconsistente com o resto do projeto que usa
`getSpacingClass` helper.
**Por que importa:** mesma família das Phases 7 e 8 — token existe,
consumo não é uniforme. Se fica assim, a regra "use o helper" vira
folclore. Terceira ocorrência do padrão "tokens definidos mas não
consumidos consistentemente".
**Opções:**

- (a) Estender signature de `getSpacingClass` pra aceitar direction
  `"dimension"` (w/h) e `"position"` (top/right/bottom/left), migrar os
  5 consumidores.
- (b) Decidir que dimension/position podem usar a classe Tailwind direta
  (porque os valores estão na escala, o token é a escala em si) e
  documentar essa exceção na rule de tokens.

**Decidir:** opção (a) ou (b)? Decisão ergue ou rebaixa o status do
helper.

## Badge 18×18 quadrado (NavbarItem md)

**Descoberto em:** #3b Group 3.
**Estado:** apliquei `h-5 + min-w-5` simetricamente preservando quadrado.
Se a intenção original do design era 18×20 (não-quadrado), reverter
`min-w-5` → `min-w-[18px]` (ou avaliar `h-[18px]` de volta).
**Como decidir:** olhar o design original ou o componente renderizado;
quadrado é mais provavelmente o intent.

## NavbarItem — z-index duplicado em className e style inline

**Descoberto em:** Phase 8 commit 3 (micro-z documentation).
**Estado:** `NavbarItem.tsx` tem `"relative z-10"` no `className` E
`zIndex: 10` no `style` inline — mesmo elemento `<span>` do label,
mesmo valor, definição dupla. Inline `style` ganha precedência CSS,
então o className `z-10` é no-op silencioso.
**Por que importa:** quem chega no arquivo pra debugar stacking pode
modificar o className achando que está mudando comportamento — e nada
muda porque o style inline sobrescreve. Trap futuro.
**Abordagem:** escolher UMA forma (className OU inline) e remover a
outra. Comentários `// micro-z:` adjacentes em ambos os sítios
referenciam mutuamente o problema, então o trap está sinalizado até a
limpeza. Polish, não blocker.

## Dialog:128 `relative z-50` é redundante

**Descoberto em:** Phase 8, mapeamento do passo 2.
**Estado:** `DialogContent.tsx:128` tem `relative z-50` no inner content,
mas o wrapper pai (`DialogContent.tsx:109`) já está em `z-50` e o
overlay é sibling DOM renderizado ANTES do content. Empilhamento via
DOM order já garante content acima do overlay sem que o content
precise de z-index próprio.
**Por que importa:** código defensivo desnecessário; após a migração
da Phase 8, ambos viram `getZIndexClass("modal")` — o segundo continua
redundante, agora gritando mais alto.
**Abordagem:** PR pequeno separado removendo o `relative
${getZIndexClass("modal")}` da linha 128. Polish, não blocker.
Phase 8 já fechou; agora os dois sítios estão simétricos como
`getZIndexClass("modal")` — a redundância do interno ficou ainda
mais visível.

## Phase 7 — Semantic color migration (próxima fase, desbloqueada)

**Estado:** desbloqueada pela Phase 9 (closure 2026-05-28). Doc:
`PHASE_7_SEMANTIC_COLORS.md`. Checklist de partida pra frente (b):
`PHASE_7_CANDIDATES.md`.
**Escopo consolidado** em 3 frentes: (a) 129 cores cruas originais,
(b) 113 neutrais sobreviventes do shim, (c) 25 arbitrary syntax na
SideNavbar. Total ~267 sítios em ~50 arquivos.
**Inclui:** deletar `tokens/colors.ts` como último passo (substitui
o item "Phase 9" que estava aqui antes).

## `Text.tsx` accepts `color` prop with no effect

**Descoberto em:** Phase 9, ao migrar Text.tsx pra lookup table (PASSO 6,
commit 5). O `color` prop existia na API pública mas o branch
`else if (color)` chamava exatamente o mesmo `getColorClass("neutral",
"dark", "text")` que o branch `else` final — fallback idêntico, sem
nunca aplicar a cor passada. Comentário inline no código antigo
admitia "we can't dynamically construct Tailwind classes" e
literalmente devolvia o default.
**Estado pós-migração:** o prop continua na API pra preservar
back-compat de tipos, e o componente faz `void color` pra silenciar
warning de unused. Redundância explícita, sem efeito visual.
**Decidir:** remover da API pública (breaking change menor — improvável
que alguém esteja usando) OU implementar o comportamento esperado
(suporte a cor literal arbitrária via style inline, já que Tailwind v4
não permite classe dinâmica). Provavelmente a primeira opção — API
stale. PR pequeno.

## `--color-slate-850` referenced but undefined

**Descoberto em:** Phase 9, durante o rename de namespace (PASSO 3).
**Estado:** `themes/dark.css:128` referencia `var(--color-slate-850)` na
declaração de `--color-surface-hover-subtle` (anteriormente
`--color-state-hover-subtle`). A escala primitiva de slate em
`primitives/colors.css` vai de `50/100/200/.../900/950` — não há
`slate-850`. A var resolve como `unset`, herdando o valor inicial pra
`background-color` (transparente) ou cascateando por especificidade.
**Por que importa:** hover-subtle no dark mode provavelmente não tem o
visual pretendido. Fallback silencioso, fácil de não notar até alguém
inspecionar.
**Pré-existente, fora do escopo da Phase 9 — o rename só preservou a
referência quebrada.**
**Cleanup:** ou trocar pra um valor existente (`slate-800` ou
`slate-900`, dependendo do contraste desejado com `hover` = `slate-800`)
ou adicionar `slate-850` à escala primitiva se houver intent (Tailwind
não tem `850` nativo, então seria token custom). PR pequeno.

## Tailwind v4 markdown auto-scan generates orphan utilities

**Descoberto em:** Phase 9, durante verificação empírica do PASSO 4.
**Estado:** Tailwind v4 auto-scan está capturando exemplos de classe
citados em prosa nos docs `PHASE_*.md`, gerando utilities inofensivas
mas órfãs no bundle. Ex.: após Phase 9, o storybook-static CSS contém
`.bg-\[var\(--color-bg-base\)\]` mesmo após o rename eliminar
`--color-bg-base` da escala — porque o doc da Phase 9 cita essa string
em backticks como exemplo do antes da migração. Tailwind enxerga a
string e gera o utility. A var apontada não existe mais, então
`var(--color-bg-base)` resolve como `unset` em runtime.
**Por que importa:** poluição silenciosa do CSS bundle. Tamanho
desprezível mas cria ruído em auditorias futuras ("essa classe
ainda existe? por quê?").
**Cleanup:** configurar `@source not "*.md"` no `styles/index.css`
(v4 suporta `@source not` pra exclusão), ou padronizar exemplos de
classe nos docs pra usar fences que não casem com pattern Tailwind
(ex.: envolver em `\`` invertido ou prefixar com `~`). PR pequeno
isolado.

## Coverage gap: subcomponents (SideNavbar internals)

**Descoberto em:** #4, ao medir coverage pós-deleção de variants.
**Arquivos:** `SideNavbar/components/{SidebarContent,
SideNavbarBackdrop, SideNavbarResizeHandle, NavbarContent,
NavbarGroup}.tsx` — todos em 0%.
**Diagnóstico:** subcomponentes renderizados só pelo SideNavbar pai.
Coverage zero sugere que os testes do pai não exercem esses caminhos.
**Abordagem:** estender testes de `SideNavbar.tsx` pra exercitar os
subcomponentes via integração — NÃO criar test files isolados pra
cada subcomponente. Não-blocker.

## Coverage gap: composition patterns

**Descoberto em:** #4.
**Arquivos:** `FormWizardPattern`, `SearchAndFilterPattern`,
`DataTablePattern`, `LoginBox` — todos em 0%.
**Diagnóstico:** composições inteiras de produto, encapsulam fluxos
que valem testar isoladamente.
**Abordagem:** test file próprio por pattern, focando no fluxo (não
em cada subcomponente). Não-blocker.

## Coverage gap: hooks com lógica pura

**Descoberto em:** #4.
**Arquivos em 0% confirmados pelo report:**

- `src/ui/components/Form/useFormFieldArray.ts`
- `src/ui/components/Toast/useToast.ts`
- `src/ui/components/Table/useColumnResizing.ts`
- `src/ui/components/Navigation/hooks/useNavigationActiveState.ts`
- `src/ui/components/SideNavbar/hooks/useGroupState.ts`
- `src/ui/components/SideNavbar/hooks/useNavbar.ts`
- `src/ui/components/SideNavbar/hooks/useSidebar.ts`
- `src/ui/components/SideNavbar/hooks/useSideNavbar.ts`

**Diagnóstico:** lógica pura sem teste é red flag. Hooks deveriam
ter teste unitário próprio. Nenhum dos 18 hooks do `src/ui/` tem
arquivo `.test.ts` dedicado — os 8 acima caem em 0% porque não são
exercitados nem indiretamente.
**Abordagem:** test file próprio por hook usando
`@testing-library/react` `renderHook`. **Maior prioridade dos três
itens de coverage.**

### Nota sobre o threshold em si

O coverage threshold global de **80%** configurado em
`vite.config.ts` (`statements / branches / functions / lines`)
provavelmente merece revisão — pode estar mal calibrado pro perfil
real do projeto. Realidade atual pós-#4: ~65% / 61% / 64% / 67%,
com gap distribuído nos três tipos de arquivo acima, não num único
ponto.

Mono-brand solo com cobertura via integração pesada (parent
component testa muitos subcomponentes) tende a render coverage real
mais baixa que o número de bugs detectados sugere. Decisão entre
**baixar threshold pra 65-70%** vs. **subir coverage real pra 80%**
é parte do trabalho desses três itens, não pré-requisito — atacar
um ou outro ajuda a aproximar o número.

## Vocabulário de feedback não cobre "notification/attention"

**Descoberto em:** Phase 7 piloto-B (NavbarItem badges).
**Estado:** O badge default do `NavbarItem` (`bg-red-500`) foi mapeado
para `bg-error` (rose-500) por ser a melhor aproximação no vocabulário
semântico atual — mas o intent original do badge é "há algo novo
aqui" (notificação/atenção), não "algo deu errado" (erro). A paleta de
feedback (`success`/`warning`/`error`/`info`) cobre estados, não
chamadas-de-atenção neutras.
**Por que importa:** dois usos colidem no mesmo token. Badge de
notificação numa UI saudável vai parecer "estado de erro" semântico
para quem lê o código, mesmo que o pixel renderizado seja o que o
design quer.
**Opções:**

- (a) Adicionar `--color-notification` (ex.: amber/orange) como
  token semântico de "atenção neutra". Cria papel distinto de
  warning (que carrega conotação de "atenção a algo problemático").
- (b) Aceitar que notification coexiste com warning (mesmo
  vocabulário; documentar que `bg-warning` cobre notificação
  passiva).
- (c) Aceitar que notification coexiste com error (status quo da
  migração Phase 7); documentar.

**Decidir:** decisão tem efeito retroativo nos badges já migrados em
Phase 7 (NavbarItem e todos os componentes futuros com badge
genérico). Adia até alguém precisar de notification semântica
explícita em outro componente.

## ~~Token de scrim/overlay backdrop ausente~~ ✅ RESOLVIDO

**Resolvido em:** Phase 7 mini-batch scrim (commits 38–39).
**Tokens criados (commit 38):**

- `--color-scrim` (rgb(0 0 0 / 0.5)) — backdrop veil de Modal/Drawer/
  CommandPalette/SideNavbarBackdrop.
- `--color-tint-hover` (rgb(0 0 0 / 0.1)) — state layer translúcido
  para hover em botões dentro de elementos coloridos (Chip remove).

Ambos são **theme-agnostic** (sem override em `themes/dark.css`) por
design — backdrop e veil translúcido têm que se comportar igual em
todos os modos, senão perdem a função.

**Nomenclatura final** (divergiu da sugestão inicial deste item):

- Confirmado `--color-scrim` (termo técnico canônico de Material/iOS).
- Para o veil de hover, NÃO foi usado `--color-scrim-subtle` (a
  proposta inicial deste BACKLOG): tratá-lo como variante de scrim
  esconderia que são papéis distintos — scrim cobre página, tint-hover
  é state layer de elemento. Também rejeitado `--color-state-hover`
  porque a Phase 9 descontinuou o namespace `state-` (fundido em
  `surface-`). Escolha final: `--color-tint-hover` — palavra nova ao
  léxico, escalável para `tint-pressed`, `tint-focus`, etc. se outros
  state layers translúcidos aparecerem.

**Consumidores migrados (commit 39):** Modal:99, DrawerContent:86,
CommandPalette:197, SideNavbarBackdrop:69 (descoberto durante a
migração — não estava no inventário original deste item) e Chip:220.

## Re-auditar escopo de cor da Phase 7 com idiom de grep correto

**Descoberto em:** Phase 12, ao implementar `ds/no-raw-color-classes`.
**Estado:** A varredura original da Phase 7 provavelmente usou
`grep --include='*.{ts,tsx}'`, idiom que NÃO expande chaves em BSD grep
(default do macOS) — o flag trata `*.{ts,tsx}` como pattern literal,
casando zero arquivos. `src/ui/tokens/sidebar.ts` (arquivo `.ts`)
escapou exatamente por isso: 8 raw color classes consumidas
indiretamente via `export *` e descobertas apenas quando a ESLint rule
varreu por AST.
**Por que importa:** se sidebar.ts escapou, outros `.ts` podem ter
escapado também. A rule do Phase 12 fecha o buraco de hoje em diante,
mas o débito histórico permanece em arquivos que a rule não scaneia
(ex.: utils/, providers/ se algum tiver classes inline em strings).
**Ação:** rodar uma única vez

```sh
find src -type f \( -name '*.ts' -o -name '*.tsx' \) \
  | xargs grep -lE '\b(text|bg|border|fill|stroke)-(gray|slate|zinc|red|green|blue|yellow|orange|pink|indigo|violet|cyan|emerald|amber|rose|sky|fuchsia|purple|teal|lime)-[0-9]+\b'
```

Listar os hits, classificar (legitimate exception / dead code /
migration target) e fechar item-a-item. PR pequeno, escopo bounded
pelos hits encontrados.

## Documentar a armadilha BSD vs GNU `grep --include`

**Descoberto em:** Phase 12 (mesmo achado do item anterior).
**Estado:** Não existe rule/skill no `.claude/` dedicada a metodologia
de cleanup/audit. A armadilha do `--include='*.{ts,tsx}'` é o tipo de
coisa que vai morder de novo em qualquer phase de varredura.
**Por que importa:** Phase 11 estabeleceu `.claude/rules/colors.md`
como source-of-truth do vocabulário; uma `.claude/rules/cleanup.md`
(ou `large-refactors.md`) cumpriria papel análogo para metodologia de
sweep. Phase 12 é o segundo exemplo concreto de phase de cleanup
(Phase 7 foi o primeiro); um terceiro vai aparecer.
**Ação quando próxima phase de cleanup acontecer:** criar
`.claude/rules/cleanup.md` com, no mínimo:

- A armadilha `--include='{ts,tsx}'` em BSD grep — usar ripgrep, ou
  GNU grep, ou `find + xargs grep`, ou múltiplos `--include` separados.
- Princípio: "se a varredura está silenciosa demais, suspeite do grep,
  não da limpeza" (lição direta da Phase 7 → Phase 12).
- Quando promover uma varredura recorrente a check automatizado
  (ESLint rule, hook, CI step) vs deixar como ad-hoc.

## Auditar cor crua em `*.stories.tsx` (~586 hits)

**Descoberto em:** Phase 12 PASSO 1 (investigação).
**Estado:** A varredura encontrou 586 ocorrências de raw Tailwind
color classes em arquivos `.stories.tsx` (vs 0 em `.test.tsx`, 43 em
componentes — esses últimos resolvidos em Phase 12). Stories foram
deliberadamente excluídos da `ds/no-raw-color-classes` rule porque o
volume sugere mistura: alguns são demos intencionais da escala
primitiva, outros são cor crua descuidada que sobrou de iterações
anteriores.
**Por que importa:** stories são a interface de documentação do design
system; cor crua dentro de stories que NÃO está demonstrando a escala
primitiva ensina o vocabulário errado a quem lê o Storybook. Também
infla o `wc -l` "dívida de cor" do projeto sem servir propósito.
**Ação:** Phase candidate. Triagem arquivo-a-arquivo:

- Demos intencionais (`Tokens.mdx`, `Badge.stories.tsx` mostrando
  pink-300 com legenda) → manter, marcar com `// exception:`.
- Cor crua acidental → migrar pra semantic ou substituir por demo
  abstrata.
- Resultado final: rule pode ser estendida pra cobrir stories também,
  com lista curta de exempt files.

## Revisitar exempt de `TokenVisualizations.tsx`

**Descoberto em:** Phase 12 (decisão de design ao escopar a rule).
**Estado:** `src/ui/tokens/TokenVisualizations.tsx` foi explicitamente
exempt da `ds/no-raw-color-classes` rule via `eslint.config.js` porque
o arquivo IS o catálogo da escala primitiva — renderizar cada token
exige nomeá-lo. Comentário no eslint config documenta o motivo.
**Por que importa:** se o design system documentation for reescrito
no futuro (Storybook MDX nativo, geração automática de cards de token
a partir do CSS `@theme`, etc.), o arquivo pode deixar de precisar
inline as classes primitivas. O exempt vira folclore se ninguém
revisitar.
**Ação:** quando uma Phase de docs do design system acontecer
(candidata: Phase 13+ se for sobre Storybook overhaul), checar se
`TokenVisualizations.tsx` ainda precisa do exempt ou se pode adotar
o vocabulário semântico junto com os outros componentes.

## Storybook 8→9 deprecation warnings nas stories

**Descoberto em:** Phase 13a, smoke run completo.
**Estado:** o smoke runner capturou 9 instâncias idênticas de
`"Accessing the Story Store is deprecated and will be removed in 9.0"`
em 9 stories distintas. Não é código do projeto — vem de algum
addon/dep que ainda chama a Story Store API legacy. Não bloqueia
runtime; smoke ignora warnings.
**Por que importa:** quando o Storybook 11+ remover a API, essas
stories quebram. Tempo de tela próximo do upgrade major.
**Ação:** rodar `npm run storybook:smoke` antes/depois do próximo
upgrade major do Storybook; mapear as 9 stories via
`smoke-report.json` (`stories[].warnings`); identificar a addon/dep
que dispara; substituir pela API equivalente da versão alvo.

## Phase 13b candidate — docs MDX per component

**Descoberto em:** Phase 13a (escopo declarado: detecção, não
documentação).
**Estado:** stories cobrem demos visuais (variantes, estados, props).
Falta o ladder documental "quando usar / quando não usar / anatomia
/ variantes" em MDX por componente — o nível que dá conteúdo a um
sidebar de Storybook como produto, não só catálogo.
**Por que importa:** smoke garante que tudo renderiza; não diz quando
o componente deve ser usado. Sem docs MDX, o Storybook funciona como
referência visual mas não como guia de adoção.
**Ação:** Phase própria. Triagem por componente: priorizar primitives
e components de uso amplo (Button, Input, Card, Modal, Table). MDX
puro nativo do Storybook 10 (`addon-docs`), não custom renderer.
Smoke da Phase 13a cobre como gate de "alterar docs não quebrou
renderização".

## Phase 13c candidate — Storybook as product

**Descoberto em:** Phase 13a (mesma cadeia; produto vs catálogo).
**Estado:** o Storybook hoje é catálogo cru — sidebar agrupado por
`Primitives/Components/Layouts`, sem theming customizado, sem landing
page, sem navegação curatorial. Funciona como dev tool, não como
publicação.
**Por que importa:** se alguém entra primeira vez no Storybook
deployado, precisa de orientação — o que é, onde começar, como
adotar. Hoje cai direto no primeiro componente alfabético.
**Ação:** Phase própria, **depois** de 13b (docs MDX são insumo da
landing). Itens: theming do manager (Storybook theme override),
landing page (Design System root), reorganização do sidebar com
seções curatoriais, branding consistente com o monoprojeto. Smoke
da Phase 13a continua sendo o gate.

## Extrair lições metodológicas das Phases 12 e 13a

**Descoberto em:** Phase 13a (terceira ocorrência do mesmo padrão).
**Estado:** três phases recentes reforçaram a mesma regra
metodológica — **"calibra o instrumento antes de aceitar a medição"**:

- **Phase 7** — varredura BSD grep silenciosa, deixou `sidebar.ts`
  para trás.
- **Phase 12** — descoberta tardia do `sidebar.ts` levou a
  reescrita da regra como custom ESLint rule (AST, não regex).
- **Phase 13a** — race condition no detector gerou 577 falsos
  positivos antes da calibragem; allowlist runtime exigiu pivot
  porque a premissa do plano (`parameters` em `index.json`) era
  impossível por design do Storybook 10.

Padrão: quando o achado for grande e surpreendente, **dobrar a
investigação do detector antes de tratar como dívida**. Quando o
plano assume API/contrato sem probar, **probar primeiro**.

**Por que importa:** o backlog já tem nota da Phase 10 prevendo
`.claude/rules/cleanup.md` quando a próxima phase de cleanup
acontecer (Phase 11 frente B continua adiada). 13a não foi cleanup
em sentido estrito, mas reforça a mesma regra. Quando a próxima
phase metodológica vier, a rule unificada precisa cobrir os 3
casos.
**Ação:** quando a próxima Phase de cleanup ou large refactor
ocorrer, criar `.claude/rules/cleanup.md` (ou
`.claude/rules/large-refactors.md`) com, no mínimo:

- A armadilha `--include='{ts,tsx}'` em BSD grep (Phase 7).
- A regra "se a varredura está silenciosa demais, suspeite do
  grep, não da limpeza" (Phase 7 → 12).
- A regra "calibra detector, não componente" — falsos positivos
  são mais perigosos que falsos negativos (Phase 13a).
- A regra "probe antes de codar contra premissa de API/contrato"
  (Phase 13a allowlist).

## ~~Migrar 5 legacy MDX standalone → attached Meta~~ ✅ RESOLVIDO

**Resolvido em:** verificado por evidência de estado em 2026-05-29 (Phase C PR3 — descoberto ao validar a deferral chain do item `denylist→allowlist`). Migração executada em commits anteriores:

- `56dbbe2 docs(legacy): rewrite Form.mdx to attached MDX standard`
- `4f1ae87 docs(legacy): rewrite DatePicker.mdx to attached MDX standard`
- `c9e5ba2 docs(legacy): rewrite Dialog.mdx to attached MDX standard`
- `7d7dd04 docs(legacy): rewrite Table.mdx + fold TableProvider architecture as trailing section`

**Verificação de estado** (`rg "<Meta " <arquivo>`):

- `src/ui/components/Form/Form.mdx` → `<Meta of={FormStories} />` ✓ attached
- `src/ui/components/DatePicker/DatePicker.mdx` → `<Meta of={DatePickerStories} />` ✓ attached
- `src/ui/components/Dialog/Dialog.mdx` → `<Meta of={DialogStories} />` ✓ attached
- `src/ui/components/Table/Table.mdx` → `<Meta of={TableStories} />` ✓ attached (TableProvider arquitetura absorvida como seção trailing — ver commit 7d7dd04)
- `src/ui/components/Table/TableProvider.mdx` → ausente ✓ (deletado por absorção)

`rg "<Meta\s+title=" src/ui` retornou apenas `src/ui/tokens/Tokens.mdx` (`Design System/Tokens` — página de documentação infra, não componente, escopo estável). Zero `.mdx` de componente em `src/ui` mantém `title=` literal hoje.

## Replicar component-doc skill aos ~65 componentes restantes

**Descoberto em:** Phase 13b1 (escopo declarado: foundation + gold
standards apenas).
**Estado:** Phase 13b1 produziu 2 docs ouro (Modal e Button) +
skill + template. Restam ~65 componentes em `src/ui/primitives/`,
`src/ui/components/`, e `src/ui/layouts/` sem MDX próprio. Cada um
precisa do skill component-doc aplicado: 30-60 word intro, when /
when-not / a11y, Examples curado de stories existentes, Controls
ligado.
**Por que importa:** o investimento de cuidado em template e skill
da Phase 13b1 paga 65 vezes adiante. Quanto mais tempo as 65
unidades ficarem sem doc, mais drift entra entre o que o team
decide e o que está documentado.
**Ação:** Phases 13b2-13b4 conforme planejamento original. Sugestão
de fatiamento por valor: 13b2 = primitives mais usados + os 5
legacy migrados; 13b3 = components composites; 13b4 = layouts +
remanescentes. Cada batch valida com smoke runner (Phase 13a) e
storybook build. Calibrar com o threshold check do SKILL.md ("se
mais de 1 em 10 precisa de exception-paragraph, template está
errado") — se 13b2 já dispara o threshold, pausar e reabrir
calibragem do template.

## Filosofia docs registrada — autodocs OFF, MDX attached canônico

**Descoberto em:** Phase 13b1 force-push fix (PR #30 CI breakage).
**Estado:** Storybook 10 errors quando um CSF file tem
`tags: ['autodocs']` E uma MDX attached
(`<Meta of={Stories} />`) — `chooseDuplicate` em
`node_modules/storybook/dist/core-server/index.js:9095` lança
`"You created a component docs page for X, but also tagged the CSF
file with autodocs. This is probably a mistake."`. A condição é
asimétrica: dispara quando per-story tem o tag mas project-level
não. Negação project-level (`tags: ['!autodocs']` em
`.storybook/preview.tsx`) **não** propaga ao indexer — apenas remoção
per-story silencia.
**Por que importa:** Phase 13b1 escolheu MDX attached como única
fonte de doc e removeu os 54 `tags: ['autodocs']` num batch
(54 stories). Reativar autodocs requeriria migrar TODOS os
componentes a MDX attached antes — caso contrário CI quebra na
primeira colisão.
**Ação:** **DO NOT** reintroduzir `tags: ['autodocs']` em nenhum
`.stories.tsx`. Vale para refactors futuros, addon updates, ou
scaffolds via plop. Defesas atuais: (a) `.claude/rules/stories.md`
proíbe explicitamente; (b)
`.claude/skills/component-doc/SKILL.md` documenta o caminho
canônico. Se uma situação futura justificar reabertura, **migrar
todos os componentes a MDX attached primeiro**, depois decidir.

## Lição metodológica — mapear caminhos concorrentes antes de ativar feature

**Descoberto em:** Phase 13b1 (CI breakage post-merge investigation).
**Estado:** PASSO 1 da Phase 13b1 mapeou `addon-docs` presença e os
11 MDX legacy, mas não mapeou todos os caminhos concorrentes de
geração de docs no Storybook 10 (autodocs per-story tag, autodocs
project tag, standalone MDX, attached MDX, custom DocsContainer).
A ativação de MDX attached em Modal/Button colidiu com `tags:
['autodocs']` em Button.stories no CI — local build não pegou (cache
de storybook-static stale provavelmente). Storybook flagou; poderia
ter sido silencioso se o caminho fosse outro.
**Por que importa:** terceira ocorrência em Phases recentes do
mesmo padrão. Phase 7 (BSD grep silencioso). Phase 12 (sweep miss
em sidebar.ts). Phase 13a (race condition no detector). Phase 13b1
(autodocs vs MDX coexistentes não mapeados). Cada uma reforça a
mesma regra: **quando ativar feature nova em sistema com múltiplos
caminhos pra fazer a mesma coisa, mapear TODOS os caminhos
concorrentes E suas mecânicas de override antes de ativar**.
**Ação:** quando a próxima Phase de cleanup ou large refactor
ocorrer, criar `.claude/rules/cleanup.md` (ou
`.claude/rules/large-refactors.md`) consolidando as regras das
Phases 7/12/13a/13b1: (a) BSD grep trap, (b) "varredura silenciosa
suspeite do instrumento", (c) "calibra detector não componente",
(d) "probe API/contrato antes", (e) "mapear caminhos concorrentes
antes de ativar feature em sistema com N maneiras de fazer X".

## Info primitive — API mínima vs intent declarado

**Descoberto em:** Phase 13b2, ao escrever `Info.mdx`.
**Estado:** o briefing original da Phase 13b2 marcou Info como
`Anatomy = YES` com a justificativa "icon + content + dismiss são
partes que consumidor distingue pra customizar". O código atual
(`src/ui/primitives/Info/Info.tsx`) implementa Info como um
**`<div role="alert">` puro** — sem ícone, sem dismiss, só
`variant` (info/warning/error) trocando cor + classes. O componente
é unitário na prática; "icon + dismiss" são intent, não API.
**Por que importa:** se a expectativa for Info como banner
composto (ícone leading + corpo + dismiss trailing), o componente
precisa crescer slots ou children-named-parts. Stories existentes
(InfoStories) também não exercitam ícone/dismiss — são apenas
demos de variant. Doc Info.mdx atual reflete a realidade (sem
seção Anatomy) e flagra a lacuna em prose, mas a decisão de
crescer a API ou não é design, não doc.
**Ação:** triagem de design — Info deveria ser:

- (a) banner composto com slots para `leadingIcon` + `dismiss` +
  `actions` (mais próximo de Polaris Banner / Carbon InlineNotification)?
- (b) wrapper minimalista atual onde o consumidor compõe os
  ornamentos via children?
- (c) primitive duplicado em duas formas (Info minimalista atual
  - Banner composto novo)?
    Resposta orienta se Info.mdx ganha Anatomy futura ou se um novo
    Banner primitive aparece em Phase 13bN.

## LoginBox stories sparse — escopo provavelmente muito específico

**Descoberto em:** Phase 13b3 batch 6, ao escrever `LoginBox.mdx`.
**Estado:** LoginBox tem apenas 3 stories totais (`Primary`,
`WithEvents`, `DefaultState`) — comparado a Input (21), Button (24),
Modal (12). Os 3 stories são todos demos básicos do mesmo formato
sem variação significativa. O componente em si é um wrapper fixo de
email + password + forgot link + sign-in button; não tem variants,
sizes, modos polymorphic. A doc landed em 411 palavras (close to
floor) e usou 2 canvases (Primary + WithEvents) conforme decidido
no inventário 13b3.
**Por que importa:** sparse stories sugerem componente com escopo
limited — provavelmente foi criado pra uma tela específica e nunca
generalizou. Em produção, fluxos auth comumente requerem variantes
que LoginBox não cobre (passwordless, magic link, SSO, MFA). Se o
projeto consumidor pivotar pra um desses, LoginBox não escala.
**Ação:** Phase 14 (BACKLOG sprint) — revisitar se LoginBox deveria
crescer pra cobrir mais auth patterns ou se deveria ser
deprecated em favor de `Form` + composição custom. Sem urgência;
componente atual funciona pro escopo que cobre.

## Phase 13e — closed (batteries-included CSS distribution shipped)

**Status:** done. Phase 13e merged on top of Phase 13d. The distribution stack is complete for the first time in the library's 15-release history: JS works externally (Phase 13d single entry) AND CSS ships ready-to-use (Phase 13e ~97 KB bundle via `./styles` export). External consumer installs the package and gets a working themed UI in two lines with no Tailwind setup. Procedure documented in `scripts/test-consumer.md`.

## Architecture decision: theme strategy is OS-aware auto-apply

**Decided in:** Phase 13e (formally registered) — the behavior existed since `f56025d` (Jan 2026) but lived only as a comment in `src/styles/themes/dark.css` until Phase 13e found it the hard way.
**Decision:** the DS applies dark mode automatically when the consumer's OS prefers dark (`@media (prefers-color-scheme: dark)`), with opt-out via `[data-theme="light"]` or `.light` on `<html>`. This is the same model used by Tailwind v4, Mantine, Chakra. Consumer can also opt in explicitly with `[data-theme="dark"]` / `.dark` regardless of OS.
**Trade-off:** consumer that hardcodes `background: #fff` without using DS tokens looks broken on a dark-mode machine — text goes near-white, background stays white, contrast disappears. The fix is documented (use `bg-surface-canvas`) but it is a real onboarding gotcha.
**Revisit:** only if a real consumer reports the auto-apply as friction. Default position is keep — it matches the industry default and the cost of `<html data-theme="light">` to opt out is one line.

## CI automation of external consumer validation

**Descoberto em:** Phase 13d. Reinforced by Phase 13e (where the same procedure caught the theme-aware gotcha).
**Estado:** procedure manual estabelecida em `scripts/test-consumer.md`. Roda quando alguém lembra; sem garantia automática contra regressão.
**Por que importa:** o bug que `scripts/test-consumer.md` cobre passou despercebido por 14 releases e ~10 meses porque nada na CI exercitava o dist como consumer externo. Repetir não é se proteger — automatizar é.
**Plano provável:** workflow GitHub Actions que (1) builda a library, (2) cria projeto Vite temp, (3) instala via tarball, (4) Playwright headless faz boot + render assertion + console.error counter, (5) falha o job se TypeError aparecer. Custo: ~2 min de CI por PR.

## Princípio "FINAL não é final até consumer externo validar"

**Descoberto em:** Phase 13d, ao encontrar `.context/docs/SOLUCAO_ESTRUTURAL_FINAL.md` (deletado, lido via git history) que declarou "solução estrutural final" pro bug Next.js TDZ — solução que efetivamente resolveu Next.js SSR mas introduziu o bug cross-chunk que persistiu silenciosamente desde v1.0.0.
**Ocorrências confirmadas (3):**

1. Original — `SOLUCAO_ESTRUTURAL_FINAL.md` resolveu SSR mas quebrou consumer externo silently.
2. Phase B (Phase 13c.7 abortada) — descoberta de que a library inteira estava broken externamente; CSS distribution work pausada para Phase 13d resolver o JS primeiro.
3. Phase 13e — auto-theme via `@media (prefers-color-scheme: dark)` foi decisão arquitetural feita em código sem documentação pública; só apareceu como "bug visual" no test consumer porque test page hardcoded `background: #fff`. DS estava correto, decisão estava implícita.
   **Padrão observado:** decisões arquiteturais marcadas "FINAL" ou tomadas em commits grandes ("feat: components evolution") sem documentação pública e sem validação externa silenciosamente compõem débito que aparece de forma surpreendente meses depois.
   **Proposta:** com 3 ocorrências, princípio agora está validado o suficiente pra virar rule. Criar `.claude/rules/architectural-decisions.md` em phase próxima registrando: (a) nenhuma decisão arquitetural marcada "FINAL" sem validação contra consumer externo real; (b) decisões arquiteturais consumer-visible (theme strategy, distribution layout, exports map) devem ter documentação pública (README ou similar) sincronizada com o código.

## ~~Inverter grep de verificação em `stories.md` (denylist → allowlist)~~ ✅ RESOLVIDO

**Resolução (Phase C PR3):**

- **`.stories.tsx` (67 arquivos, dominante):** ESLint rule `ds/story-discipline/valid-title-segment` (allowlist AST contra os 4 segmentos válidos — `Primitives | Components | Layouts | Design System`). Implementação em `eslint-rules/story-discipline/`. Roda em pre-commit, pre-push e CI. A inversão denylist→allowlist que este item pediu está em código, não em prosa: qualquer segmento fora dos 4 falha lint com file:line, incluindo invented future taxonomy (`Widgets/`, `Patterns/`, etc.) que o denylist enumerativo deixava passar.
- **`.mdx` (4 páginas infra estáveis):** grep PCRE residual em `.claude/rules/stories.md` cobrindo `src/ui/**/*.mdx` E `src/docs/**/*.mdx` (path `src` recursivo). Lista atual: `src/docs/Introduction.mdx`, `src/docs/ComponentStatus.mdx`, `src/docs/guides/ComponentComposition.mdx`, `src/ui/tokens/Tokens.mdx` — todas com `<Meta title="Design System/...">` válido. Escopo **estável**, não decrescente: são páginas de documentação do design system sem `.stories.tsx` correspondente; não vão migrar para attached form porque não há nada para anexar. O grep é small + estável + executável pelo dev antes de commit; adicionar `eslint-plugin-mdx` para cobrir 4 arquivos estáveis foi rejeitado por ROI ruim (Phase C PR3 decisão de escopo).

A inversão está em código (.stories.tsx via AST) E em regex PCRE (.mdx via grep allowlist) — a mesma lista categórica dos 4 segmentos, dois mecanismos.

**Descoberto em:** Phase B (taxonomy fix de `Providers/AppProvider`).
**Estado:** o grep de verificação em `.claude/rules/stories.md` (linhas ~13-15) enumera segmentos banidos explicitamente — `(Atoms|Molecules|Organisms|Patterns|Templates)/`. É falso-negativo por construção: não pegou `Providers/AppProvider` quando essa story foi introduzida, e não vai pegar a próxima taxonomia inválida inventada (qualquer string que não esteja na lista hardcoded). A regra positiva da própria `stories.md` ("primeiro segmento ∈ {Primitives, Components, Layouts, Design System}") já é uma allowlist — o grep deveria ser a aplicação executável dela, não uma denylist paralela e divergente.
**Por que importa:** mesma família dos achados das Phases 7/12/13a — "se a varredura está silenciosa demais, suspeite do instrumento". A regra existe pra impedir taxonomia errada; um detector enumerativo só pega o que já foi proibido nominalmente. Allowlist invertida pega _qualquer_ desvio dos 4 segmentos válidos no momento em que aparece.
**Análogo no repo:** `scripts/storybook-smoke.mjs` opera em default-deny — `allowConsoleErrors` é a única forma de uma story passar com erro, e exige reason. Mesma filosofia: enumerar o aceitável, falhar no resto.
**Ação:** PR pequeno separado. Substituir o regex denylist por um que casa titles cujo primeiro segmento NÃO seja `Primitives|Components|Layouts|Design System`. Esboço:

```
grep -rIn --include='*.stories.tsx' --include='*.mdx' \
  -EH "(title:\s*['\"]|<Meta\s+title=['\"])(?!(Primitives|Components|Layouts|Design System)/)" src
```

(checar suporte a negative lookahead no grep alvo — BSD grep não suporta PCRE; usar `grep -P` em GNU ou `rg` se disponível, ou inverter via dois passos `grep | grep -v`.) Atualizar o exemplo na própria `stories.md` no mesmo commit.

## Phase C PR2 — a11y backlog real (post-noise silencing)

> **⚠ Escopo de instrumento:** todos os números desta seção são **light mode**. Dark mode não é medido pelo baseline (Playwright headless boota em light; nada seta `data-theme="dark"` ou `emulateMedia colorScheme:'dark'`). Item de primeira ordem **"Baseline a11y é light-mode-only — dark mode não auditado"** mais abaixo neste BACKLOG cobre o gap. Citar "806 nodes" sem qualificar é incorreto — usar "806 nodes (light)".

**Descoberto em:** Phase C PR2, Passo 1 (baseline paralelo de 852 stories) + Passo 2 (re-medição com noise rules silenciadas) + Passo 3 (full serial de fechamento, workers=1, BrowserContext por story).
**Estado:** `a11y.test` segue em `"todo"` em `.storybook/preview.tsx`. Três regras page-level (`region`, `landmark-one-main`, `page-has-heading-one`) silenciadas globalmente — instrumento aplica regra de página em iframe de componente, gerando ~78% de ruído (2.802 nodes / ~492 stories were noise-only). Reativadas só em `DashboardLayout` (única que monta `<header>` + `<main>` + `<footer>`). Política documentada em `docs/ACCESSIBILITY.md` seção "Story-iframe exceptions".

**Baseline de record (full serial, 0 errored, light mode):** 806 nodes em 354 stories. Distribuição por impact:

| Impact   | Nodes |
| -------- | ----: |
| critical |   222 |
| serious  |   549 |
| moderate |    29 |
| minor    |     6 |

**Por que importa:** virar `a11y.test: "error"` (meta no fim do funil) só é seguro depois de zerar critical e serious. Sem o silenciamento das 3 page-level rules, "error" bloqueava CI em 842/852 stories no primeiro push por falso-positivo de instrumento — viraria allowlist de exceção em massa (dívida carimbada de "resolvido", anti-padrão explícito da rule Phase 7).

**Backlog agrupado por causa-raiz, não por regra:**

### Family A — "Controle sem nome acessível" (152 nodes, ~57 stories)

- `button-name` 94n/24s — **38n concentrados em SideNavbar** (icon-only menu buttons sem `aria-label`). Single anchor fix em SideNavbar pode derrubar 40%+ da família. Top: `components/sidenavbar/{variants,with-bottom-navigation,with-header,with-footer,with-header-and-footer}`. ✅ **SideNavbar portion resolvida em PR #52** — era **defeito de STORY, não de componente**: `NavigationTabs` inline em `SideNavbar.stories.tsx:87-132` renderia 5 `Tabs.Trigger` icon-only sem `aria-label`, replicado 3–4× por story (3 SideNavbars na `variants`, 1 nas demais) + 3 raw `<button>` icon-only inline em `WithBottomNavigation` (Bell/HelpCircle/LogOut). O `Tabs.Trigger` primitivo spread `{...props}` na `<button>` (`TabsTrigger.tsx:117`), portanto suporta `aria-label` propagation; a story simplesmente não passou. Fix de raiz: refatorado `NavigationTabs` para iterar sobre array `tabs` (single source of truth de `{value, label, Icon}`) — `tabLabels` map vestigial agora derivado por `Object.fromEntries`. Nomes ARIA escolhidos por **ação/destino, não tipo**: `"Home"` / `"Analytics"` / `"Users"` / `"Documents"` / `"Settings"` — screen reader compõe `"Home, tab, selected"` (role+state vêm do primitive Tabs). Bottom-nav raw buttons recebem `aria-label="Notifications"` / `"Help"` / `"Log out"`. Anti-padrões evitados: `aria-label="button"`, `aria-label="Home tab"`, `aria-label="Navigate to home"`. Theme-independence confirmada (regra estrutural ARIA, sem dimensão de contraste). Re-baseline post-fix confirma 38n → 0n no SideNavbar.
- `select-name` 25n/22s — espalhado: SearchAndFilterPattern (2), DataGrid pagination (2). Pequenos `<select>` sem label associado.
- `aria-input-field-name` 18n/10s — **12n em Slider** (range handles dos sliders).
- `label` 11n/10s — espalhado (SideNavbar 2, Textarea 2, MultiSelect 2).
- `aria-command-name` 1n/1s — outlier.
- `aria-dialog-name` 3n/3s — Dialog sem accessible name.

**Anchor sugerido:** ~~atacar SideNavbar primeiro~~ — ✅ feito (PR52).

**Sweep classificação componente vs story (button-name):**

Total `button-name` pós-PR52: 15n; pós-PR53 (Stepper): **2n**.

| Componente | Nodes | Tipo          | Status    | Detalhe                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------- | ----: | ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SideNavbar |    38 | **STORY**     | ✅ PR #52 | `NavigationTabs` inline + 3 raw buttons em `WithBottomNavigation` — refatorado pra iterar `tabs` array com `aria-label` por trigger.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Stepper    |    13 | **COMPONENT** | ✅ PR #53 | Bubble `<button>` em `Stepper.tsx:126` (vertical) + `:249` (horizontal) renderiza só `{CheckIcon\|index+1\|null}` como filho; identidade carregada pelo `step.title` adjacente, mas o button em si não tinha accessible name. Fix de raiz: `aria-label={step.title ? \`Step ${index+1}: ${step.title}\` : \`Step ${index+1}\`}` em ambos os sítios. Fallback "Step N" cobre a boundary condition do Bucket F (`step.title === ""`+`showStepNumbers={true}`) — sem o ternário, aria-label virava string vazia e a violation persistia. Coexiste com o número decorativo renderizado (CLAUDE.md "AA-by-construction exception") e com `data-marker="pending"` — verificado em 3 stories (default/without-step-numbers/with-status). |
| Switch     |     1 | **STORY**     | Pendente  | `Switch.stories.tsx:100 Default` renderiza `<Switch>` sem `label` prop; Switch usa `aria-labelledby={labelId}` que aponta pra id-inexistente. Fix: passar `label="..."` na story default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Menu       |     1 | **STORY**     | Pendente  | `Menu.stories.tsx:197 TableActions` usa `<Button variant="ghost"><MoreVertical /></Button>` como MenuTrigger icon-only sem `aria-label`. Fix: `<Button variant="ghost" aria-label="Row actions">`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

**Classificação Family A button-name pré + pós:**

- Pré-fix observado historicamente (53n medidos): 38 SideNavbar STORY + 13 Stepper COMPONENT + 1 Switch STORY + 1 Menu STORY.
- **COMPONENT defect:** 13n (25%) — Stepper. ✅ todos resolvidos em PR #53.
- **STORY defect:** 40n (75%) — 38 SideNavbar (✅ PR #52) + 2 outliers pendentes (Switch.Default, Menu.TableActions).
- Resto da Family A (`select-name` 25, `aria-input-field-name` 18, `label` 11, `aria-command-name` 1, `aria-dialog-name` 3) ainda não passou pelo sweep classificado — quando atacar, mesmo formato de tabela.
- Discrepância vs BACKLOG `94n` original em button-name: PRs intermediários (#48, #49) fecharam violations incidentalmente; o baseline registrado em "Phase C PR2" estava defasado em ~41n.

Total Family A button-name fechado até hoje: **51n / 53n medidos** (96%). Residual: 2n story-defect a faxinar.

**Veredito sobre regra de prevenção (proposta: extensão de `ds/story-discipline` que pegue "elemento interativo icon-only sem aria-label em story"):**

**Não justifica criar a regra agora.** Volume real:

- 40n STORY-defect concentrados em **3 arquivos** (`SideNavbar.stories.tsx`, `Switch.stories.tsx`, `Menu.stories.tsx`), não 40 stories independentes.
- 38n dos 40 são **uma única definição** (`NavigationTabs` inline) replicada por loop de story — não 38 sítios distintos a serem detectados.
- Custo da regra: AST inspection de elementos interativos (button, Tabs.Trigger, MenuTrigger filho de `<Button>`) com filho único SVG/Icon e ausência de `aria-label`/`aria-labelledby`, restrito a `*.stories.tsx`. Não trivial — false positives prováveis (componente icon-only legítimo onde o aria-label vem do parent via `aria-labelledby`, button-name satisfeito por `aria-describedby`-equivalent).
- Benefício marginal: o `component-reviewer` agent (já existente) cobre o caso com leitura — adicionar à checklist dele ("toda story com Tabs.Trigger/Button/button icon-only declara `aria-label`?") é zero infra, zero false-positives, custo proporcional ao risco.

**Recomendação:** registrar a heurística como item da checklist do `component-reviewer`, não como regra ESLint. Reavaliar SE um PR futuro reintroduzir esse padrão em 3+ stories distintas — aí o volume justifica.

### Family B — "ARIA inválido" (124 nodes originais; 87 resolvidos; ~37 remaining em outliers)

- `aria-allowed-attr` 62n em **APENAS 2 stories** — `components/datepicker/{open-state,with-events}` com 31 nodes cada (mesmo code path). ✅ **resolvido em PR #49** (WAI-ARIA grid pattern + roving tabindex + APG-disabled). Diagnosticado como defect-de-role (não defect-de-attribute): `<button>` carregava `aria-selected` direto, atributo prohibido em button mas permitido em gridcell. Aplicada opção 3 — `role="gridcell"` explícito no próprio button + `role="row"` containers + chunking dos dias em weeks-de-7. Coordenado com roving tabindex completo (tabIndex={isTabStop ? 0 : -1} + useEffect que move foco DOM via data-date attribute) porque a estrutura semântica isolada teria silenciado o axe mas piorado o teclado real (setas movem state visual, Tab percorria 35 cells). Tests atualizados (`getAllByRole("button")` → `gridcell`; `toBeDisabled()` → `aria-disabled` assertion) com comentário APG inline pra futuro contributor não reverter. Verificação manual de teclado: 5/5 PASS via Playwright simulation + APG-disabled em story dedicada. 62n → 0n confirmado nas 2 stories anchor.
- `aria-valid-attr-value` 21n/19s — top: SideNavbar (3), DashboardLayout (1 cada em ~5 stories). **Pendente.**
- `aria-hidden-focus` 17n/12s — **10n em Switch** (input `aria-hidden` mas focável). ✅ **Switch portion resolvida em PR #48** (`bfbaf86`): `tabIndex={-1}` adicionado ao `<input type="checkbox" className="sr-only" aria-hidden="true">` (form-integration shim), foco sai do elemento AT-hidden, form submission preservada. Diagnosticado como defect-de-focusabilidade (layer-1 HTML), não defect-de-role nem defect-de-attribute — o role="switch" no outer button e o aria-hidden no input estavam corretos; o que faltava era tabIndex. **7n residual em outros consumers fora do Switch — pendente.**
- `aria-prohibited-attr` 15n em **APENAS 2 stories** — `components/rating/{read-only,read-only-state}`. ✅ **resolvido em PR #48** (`bfbaf86`): `aria-label` da estrela gated em `!readOnly` (mirroring o pattern já existente de `role` e `tabIndex`); parent já carrega `role="img" aria-label="Rating: X out of Y"` em read-only, child labels eram vestigial do interactive mode (válidas com `role="button"` mas prohibited sem role). Diagnosticado como defect-de-attribute (mode leak), não defect-de-role.
- `aria-required-parent` 4n/4s; `aria-required-children` 3n/3s; `aria-required-attr` 2n/1s — outliers individuais. **Pendentes.**

**Pendente na Family B (~37 nodes):**

- `aria-valid-attr-value` 21n (SideNavbar / DashboardLayout)
- `aria-hidden-focus` 7n residual fora do Switch (consumers a identificar — `aria-hidden=true` em elemento focusable que não é o Switch shim)
- `aria-required-parent` 4n
- `aria-required-children` 3n
- `aria-required-attr` 2n

Os 3 anchors (DatePicker 62 + Rating 15 + Switch portion 10 = 87 nodes) fecharam. O que resta são 5 buckets pequenos espalhados; não há "anchor com cluster grande" entre eles. Decisão se Family B remaining merece rodada própria (sweep de outliers) ou se cada um vira fix oportunista quando o componente afetado entrar em outra phase precisa ser tomada — provável (b) dado que 37n distribuídos em 5 regras não compensa setup de uma rodada dedicada.

### Family C — "Contraste de cor abaixo de WCAG 2.1 AA 4.5:1" (467 nodes, 275 stories)

- `color-contrast` (serious) — cross-cuta o catálogo inteiro. Top concentração: Table full-featured (17), Table declarative-api (17), Timeline many-items (11), Badge accessibility (8), Badge variants (6). +3 nodes vieram de `Toast/clear-all` no full serial (não medidos no paralelo).
- **Cruza com `.claude/rules/colors.md` e `PHASE_7_SEMANTIC_COLORS.md`.** Provável raiz: punhado de combinações token-on-token abaixo de 4.5:1. Candidatos a investigar (extrair `sampleTargets` do report serial):
  - `text-fg-tertiary` ou `text-fg-quaternary` sobre `bg-surface-base` / `bg-surface-subtle`.
  - `text-fg-secondary` sobre `bg-surface-muted`.
  - Foreground brand sobre surface brand-subtle.
- **Anchor sugerido:** abrir 3 stories de hotspot (`components/table/full-featured`, `primitives/badge/accessibility`, `components/timeline/many-items`), extrair os 30+ `sampleTargets` de cor, identificar 3-5 pares (text token, bg token) que falham, decidir caso-a-caso: subir contraste do token semântico (afeta todo o sistema), ou re-mapear o consumo desses componentes para tokens existentes que passam. Um fix de token pode fechar centenas de nodes — escala invertida do esforço.

**Progresso (até PR44 mergeado):**

- **Bucket A (brand surface 260n):** ✅ resolvido via Princípio 9 (família incompleta) — token novo `--color-surface-brand-strong` (indigo-600 light / indigo-400 dark) criado pra papel "brand surface que carrega texto"; 9 sítios com texto sobre brand remapeados (Button primary, Chip filled/selected, Tabs active, DatePicker selected day, Stepper active bubbles x2, Timeline active dots x2). Os 6 sítios decorativos (Progress, Slider x2, Switch, TableHeaderCell hover, SideNavbarResizeHandle hover) permanecem em `bg-surface-brand` (indigo-500) — papel oficial passa a ser "decorative brand surface (no foreground text)". Sub-decisão "h1 hover sobe pra active-brand" **dissolveu na verificação**: 8 dos 9 sítios não têm hover state (são estados selected/active sem hover próprio); o 9º (Button) usa `hover:opacity-90` color-independent que aplica sobre qualquer bg. Sem hover-ladder a reorganizar. **Dark mode também resolvido no mesmo commit** — dark estava failing (slate-900 em indigo-500 = 4.00), o token novo passa em ambos os temas (6.29 light, 5.98 dark). Achado colateral durante a verificação registrado abaixo (active-brand dark) e correção docs-sync de `surface-brand-emphasis` table entry + Princípio 2 example aplicada no mesmo commit.
- **Bucket B (surface-secondary 47n):** ✅ resolvido em PR43 (pink-500 → pink-700, +2 shades).
- **Bucket C (status family info/error/warning/success 78n):** ✅ resolvido em PR41 (X-600 → X-700, +1 shade light + rose-400 dark).
- **Bucket D (error solid 15n):** ✅ resolvido em PR43 (rose-500 → rose-700, +2 shades).
- **Bucket E (Tabs + CommandPalette tertiary-on-tinted-bg 25n):** ✅ resolvido em PR44 (Tabs unconditional, CommandPalette conditional ternary).
- **Bucket F (Stepper/Timeline fg-quaternary 11n):** 🔒 **REGISTRADO COMO EXCEÇÃO ARQUITETURAL** (Phase C anchor + 5 toques: 4 component edits + 1 story suppression). NÃO é strike+✅ "resolvido" — é categoria própria. **Caveat de medição descoberto durante o fix:** `src/ui/tokens/sidebar.ts:52` é um 5º consumer de `text-fg-quaternary` (chevron de collapsible group em SideNavbar, importado por `SidebarContent.tsx`) — não falha AA em nenhuma story do baseline atual (renderiza sobre bg da sidebar tinted, não branco), portanto **fora do escopo desta exceção**. Se uma story futura de SideNavbar disparar contraste-fail nesse 5º consumer, ele NÃO é "pending sequence marker" e precisa de avaliação separada (provável: remap pra fg-tertiary, que é o papel correto pra "indicador de estado collapsible"). Bug encontrado durante implementação: a primeira versão do data-marker usou `status === "default"` por engano, que vale para Timeline (`status?: "default" | "active" | "completed" | "error"`) mas NÃO para Stepper (`StepperStatus = "pending" | "active" | "completed" | "error"`) — corrigido para `status === "pending"` no Stepper antes do commit, e verification empírica confirmou que TODOS os elementos `.text-fg-quaternary` em todas as 5 stories testadas (Timeline default/many-items, Stepper default/horizontal/vertical) carregam o data-marker (`uncoveredFgQuat: 0`). Razão: hierarquia ordenada de 4 níveis e WCAG AA são **matematicamente incompatíveis** em quaternary (fg-tertiary já está a +0.26 acima de AA; quaternary precisa ser mais mudo que tertiary por construção; não existe shade mais mudo que slate-500 que passe AA sobre branco). Registrado em `.claude/rules/colors.md` seção "`fg-quaternary`: AA-by-construction exception" com argumento matemático + evidência de design (Stepper `showStepNumbers?` opt-out + Timeline `item.icon ||` fallback chain confirmam papel decorativo) + boundary condition (consumer que use o marcador como anchor único de identidade sai da exceção). 4 bubbles autorizadas (Stepper.tsx:140/255, Timeline.tsx:65/154) carregam `data-marker="pending"` quando `status === "default"`. Supressão dirigida em `parameters.a11y` da story `Timeline/ManyItems` via `{ id: "color-contrast", selector: ":not([data-marker='pending'])" }` — ancorada ao papel (data-marker), não ao estilo (classes), sobrevive a restyle futuro da bubble. **Compatibilidade com gate `critical+serious=0 → a11y.test:'error'`:** os 11 nodes do bucket F NÃO bloqueiam o gate porque a supressão é dirigida (não-global), seletor restrito a `[data-marker='pending']`, qualquer outro contraste-issue na mesma story permanece visível.
- **Bucket G (Badge primary-solid brand-on-brand 7n):** ✅ resolvido em PR42.
- **Buckets H/I/J/K (raw colors em stories, brand fg outliers, pink-300 Principle 3, etc., 19n):** não atacados — escopo "Auditar cor crua em \*.stories.tsx" + outliers documentados.

**Resumo Family C:** 175 nodes resolvidos via fix (PR41 78 + PR42 7 + PR43 62 + PR44 25 = 172, com ~3 de variância axe); 11 nodes registrados como exceção arquitetural (bucket F); ~280 nodes pendentes (bucket A indigo brand) ou fora do escopo desta fase (buckets H/I/J/K raw colors / outliers).

### Family D — "Landmark estrutural mal posicionado" (52 nodes, ~37 stories)

- `landmark-complementary-is-top-level` 22n/20s — **SideNavbar** lidera: `<aside>` nested em outro landmark. Provável: stories de SideNavbar embrulham em outro `<aside>` ou em `<main>` para demo. Pode ser fix de story, não de componente.
- `nested-interactive` 25n/18s — `components/menu` (4 nodes em placements) e `primitives/chip` (3 em clickable-and-removable) lideram. Chip com clickable + removable tem `<button>` dentro de `<button>` — fix arquitetural na anatomia do Chip.
- `landmark-unique` 5n/4s; `landmark-no-duplicate-banner` 1n/1s — outliers.

### Family E — "Outliers minor/serious/moderate isolados" (10 nodes)

- `empty-heading` 6n/6s (minor) — cleanup.
- `listitem` 2n/2s (serious) — `<li>` fora de `<ul>`/`<ol>`; check stories que renderizam `<li>` solto para layout.
- `heading-order` 1n/1s (moderate) — pulo de nível de heading (h1 → h3 sem h2 etc.).
- `scrollable-region-focusable` 1n/1s (serious) — região com scroll que não recebe foco por teclado.

**Política de fechamento:**

1. NÃO criar `parameters.a11y.allowConsoleErrors`-like allowlist temporária — vira dívida carimbada de "resolvido" (anti-padrão explícito).
2. Atacar por anchor: o fix de 1 componente fecha N stories. Ordem sugerida por relação esforço/impacto: DatePicker (62/1 fix) → SideNavbar buttons (38+/1 cluster fix) → Rating read-only (15/1 fix) → color-contrast tokens (centenas/3-5 token fixes) → Switch (10/1 fix) → Slider (12/1 cluster fix).
3. Cada anchor vira uma sub-phase própria. Re-rodar baseline após cada fix para confirmar que a aritmética bate (e que o fix não regrediu outra família).
4. Quando critical+serious = 0, virar `a11y.test: "error"` em `.storybook/preview.tsx`. Não antes.
5. **Escopo do gate — decidido em PR #53: cobre STORY + COMPONENT com classificação per-node obrigatória.** O `a11y.test: "error"` não distingue origem do nó (axe roda nas stories de qualquer jeito), e neste repo Storybook é **documentação MDX-attached pública**, não fixture de teste — o consumidor copia o snippet e herda o defeito. Tratar exemplo inacessível como aceitável propagaria inacessibilidade via docs. O custo de faxinar fixtures é baixo (sweep PR52 mostrou concentração em poucos arquivos), o ganho é integridade documental, e a alternativa (gate só de COMPONENT) introduziria um julgamento "isto conta?" recorrente por PR que é mais caro que faxinar. **Convenção de relatório:** cada Family registra no BACKLOG a coluna `Tipo` (`COMPONENT` / `STORY`) per-componente, como Family A button-name fez nesta phase. "Zeramos critical" passa a ser reportável como `N COMPONENT + M STORY, todos fechados` em vez de número opaco. **Escape para (B)-por-arquivo (gate só componente, story via supressão dirigida documentada):** fica em aberto, mas só se ativa SE uma Family futura medir ≥80% story-defect distribuído em ≥10 arquivos distintos — decisão por dados então, não preventivamente.

**Caveat de medição — resolvido no full serial (Passo 3):** o paralelo (workers=6, BrowserContext compartilhada) deixou 2 stories com axe-race no Passo 2 — `components/form--with-events` e `components/toast--clear-all`, exatamente componentes interativos onde a11y mais importa. Full serial (workers=1, fresh BrowserContext por story, ~48min wall clock) fechou 0 errored em 852/852: Form clean (0 nodes), Toast 3 nodes color-contrast (incluídos em Family C). Delta vs paralelo: +4 nodes (+3 serious Toast + 1 critical button-name de timing-variance) + 2 outliers novos (heading-order, scrollable-region-focusable). Para refresh futuro: serial é a forma íntegra (~48min); paralelo é OK para diff incremental após anchor fix, sabendo que pode ter race em 1-2 stories interativas.

## Phase C PR2 — calibragem metodológica: equivalence axe-direct vs addon-a11y

**Descoberto em:** Phase C PR2 Passo 2 (preocupação levantada após o re-baseline) + Passo 3 (teste empírico).
**Estado:** O baseline mede via `axe.run()` direto injetado por Playwright após `sb-show-main + #storybook-root children + 150ms settle`. O addon-a11y em CI/CC rodaria axe após o `play` function completar. Risco hipotético: se script medisse estado pré-play (modal fechado) e addon medisse pós-play (modal aberto), seriam instrumentos diferentes — baseline e juiz desalinhados, anchor fix poderia mostrar discrepância contra UI.
**Teste empírico (5 stories, 2 padrões cada):** rodada A "baseline as-shipped" (settle 150ms) vs rodada B "addon-equivalent" (espera `currentRender.phase === "played"` ou equivalente + settle 200ms). Targets escolhidos para forçar o caso-limite:

| Story                                           | A nodes | B nodes | A phase   | B phase  | Match        |
| ----------------------------------------------- | ------: | ------: | --------- | -------- | ------------ |
| `components/datepicker--open-state`             |      32 |      32 | finished  | finished | rule-by-rule |
| `components/datepicker--with-events`            |      32 |      32 | finished  | finished | rule-by-rule |
| `components/modal--default`                     |       1 |       1 | finished  | finished | rule-by-rule |
| `components/commandpalette--default`            |       1 |       1 | afterEach | finished | rule-by-rule |
| `primitives/button--primary` (controle no-play) |       1 |       1 | finished  | finished | rule-by-rule |

5/5 identical rule-by-rule. Caso mais informativo: CommandPalette com `phase=afterEach` no padrão A (lifecycle ainda rodando) mas mesmo assim os nodes bateram com B — o DOM estabilizou ANTES do lifecycle terminar. Para essas 5 stories, "axe é axe".

**Limite da inferência (registrar explícito para não virar folclore):** 5 stories confirmam, não generalizam para as 47 com play function. A medição forte é "nas stories testadas — incluindo o caso-limite CommandPalette — o DOM estabiliza antes da medição A"; a forte INválida seria "está provado para toda story com play". Se um anchor fix futuro (Family B: DatePicker; Family C: stories de Modal/Drawer com conteúdo via play) mostrar discrepância entre o número do BACKLOG e o número que o addon-a11y reporta na UI do Storybook, o lugar de investigar é exatamente esse: uma story com play onde estado-script ≠ estado-addon. Esta é a única folga conhecida do baseline; o método é fiel nos 5/5 medidos, não há prova universal.
**Ação:** nenhuma agora. Caveat metodológico registrado para consulta se número não bater depois.

## Baseline a11y é light-mode-only — dark mode não auditado

**Descoberto em:** Family C anchor fix (status tokens darken), ao calcular o ratio de `--color-error-dark` em dark mode: rose-500 sobre rose-950 = 4.26 (FAIL AA), invisível ao baseline porque o instrumento nunca renderiza em dark.
**Estado:** o smoke runner (`scripts/storybook-smoke.mjs`), `.storybook/preview.tsx`, e todos os scripts de baseline ad-hoc deste repo rodam stories sob `chromium.launch({ headless: true })` em estado default. Nenhum:

- seta `data-theme="dark"` no `<html>`,
- ativa `.dark` class,
- chama Playwright `context.emulateMedia({ colorScheme: 'dark' })`,
- ou itera sobre `globals.theme` de história em história.

Resultado: **todos os 806 nodes do "Phase C PR2 — a11y backlog real" são light-mode**. Dark mode é completamente não-auditado. Um fix conhecido (`--color-error-dark` rose-500 → rose-400 em `themes/dark.css`, ratio 4.26 → 5.81) entrou junto com a Family C light anchor por ser mesma-família; não foi descoberto pelo baseline, foi descoberto por cálculo manual durante a investigação dos shifts. Podem existir N outros pares dark-mode em estado análogo.

**Por que importa:** o critério de fechamento documentado em `docs/ACCESSIBILITY.md` é "zero critical + zero serious para virar `a11y.test: 'error'`". Esse critério está implicitamente escopado a light. Virar `error` enquanto dark é não-auditado significa enforçar regressão em metade do sistema de renderização — o oposto do que o gate deveria fazer. **Dark-mode precisa de baseline equivalente ANTES da virada de chave**, ou o gate é falso.

**Por que aconteceu:** Phase 13e (commit `e01d479`) registrou que o design system aplica dark mode automaticamente via `@media (prefers-color-scheme: dark)` E via `[data-theme="dark"]` opt-in. Phase C PR2 escreveu o baseline sem reverificar essa premissa contra Playwright headless (que ignora `prefers-color-scheme` por default). Falta de teste que cruza Phase 13e (renderização) com Phase C (audit).

**Plumbing — três opções dimensionadas:**

1. **Playwright `emulateMedia` por run.** Rodar o baseline duas vezes — uma em light, uma com `context.emulateMedia({ colorScheme: 'dark' })`. Dobra o wall clock (~96min serial / ~3min paralelo color-contrast filtered). Mínimo de plumbing: 1 flag no script. Cobre dark-via-OS-preference. Não cobre opt-in `data-theme="dark"`.
2. **Per-story `data-theme` toggle via globals.** `.storybook/preview.tsx` já tem suporte a globals — adicionar um `globals.theme` toggle iterado pelo smoke/baseline. Roda 1× para `light`, 1× para `dark`. Custo: ~2× wall clock + plumbing do toggle no preview. Cobre opt-in canonicamente.
3. **Híbrido.** `emulateMedia` para sweep rápido; `globals.theme` quando virarmos `a11y.test: "error"`. Razoável compromisso esforço/cobertura.

**Ação:** Phase própria após Family A anchor (button-name SideNavbar) ou Family B anchor (DatePicker ARIA), dependendo da fila. NÃO é blocker pra cada Family individual de light, mas É blocker pra virar `a11y.test: "error"`. Sequência recomendada:

1. Implementar opção 1 (emulateMedia) no `scripts/storybook-smoke.mjs` E no `/tmp` color-pair extractor — workspace de teste mínimo.
2. Rodar baseline dark equivalente (esperar ~48min serial ou ~5min paralelo color-contrast filtered).
3. Decompor por família como Phase C PR2 fez para light.
4. Aplicar anchors dark.
5. Quando light AND dark zerarem critical+serious, virar `a11y.test: "error"`.

**Doc-sync:** registrado em `docs/ACCESSIBILITY.md` seção "Baseline is light-mode-only" (item adjacente a "Story-iframe exceptions"). Citações de "806 nodes" sem o qualificador "light" devem ser corrigidas in-place se aparecerem em outro doc.

**Evidência adicional acumulada do dark-mode-cego (cada item descoberto ao acaso durante outros fixes, NÃO pelo baseline):**

- PR41 Family C anchor — `--color-error-dark` em dark (rose-500 em rose-950) = 4.26 FAIL. Cálculo manual durante o fix do C-family light. Corrigido no mesmo commit (rose-500 → rose-400 em dark).
- PR45 Bucket A investigation — `--color-surface-brand` em dark (slate-900 em indigo-500) = 4.00 FAIL. **Pior que light** (4.46). Cálculo manual durante diagnose do Bucket A. Resolvido no mesmo commit do Bucket A via `surface-brand-strong` que diverge em ambos os temas.
- PR45 Bucket A investigation (achado colateral) — `--color-surface-active-brand` em dark (slate-900 em indigo-600) = **2.84 HARD FAIL**. Não tem consumer hoje em `src/ui` (token-fantasma, 0 sítios) — não é violação ativa, mas é **trap arquitetural**: se algum consumer futuro usar esse token com texto em cima em dark mode, fail silencioso AA. Análogo a `surface-hover-brand` que também é definido sem consumer. ✅ **AMBOS DELETADOS em PR #54** após o dark baseline plumbing confirmar (i) `grep -rIn 'hover-brand\|active-brand' src/` retorna apenas as próprias definições CSS (0 consumers em código), (ii) ambos hard-failam AA dark por construção (`active-brand` indigo-600 = 2.84, `hover-brand` indigo-500 ≈ 3.97), (iii) nenhum dos 746 nodes EXCLUSIVO_DARK do paralelo cita essas classes. Removidos de `src/styles/semantic/colors.css` (light fallback) e `src/styles/themes/dark.css` (dark override) — não estavam em `themes/light.css` nem nos variants minimal/creative. Linha "Brand button state ladder" em `.claude/rules/colors.md` removida no mesmo PR (docs-sync). Justificativa: token semântico sem consumer ativo que hard-fala AA é dívida latente — se feature futura precisar de "brand hover/active", abrir Princípio 9 na hora com valor que passa AA em ambos os temas (não herdar fantasma quebrado). Custo de desfazer: 4 linhas CSS + 1 linha tabela.

Cada item desta lista é prova de que o gap não é hipotético — descobertas reais ao acaso por cálculo manual durante outros fixes. Plumbing do auditor dark não pode ser indefinidamente adiado; cada anchor light atacado tem chance real de mascarar um fail dark equivalente.

## Dark baseline plumbing + @media completeness bug (PR #55)

**Estado:** plumbing aprovado e aplicado. emulateMedia (Opção 1) — pure CSS path, exercita o caminho `prefers-color-scheme` que Phase 13e estabeleceu como o auto-default. Sweep paralelo dual-theme inicial (190s, 1704 runs, workers=4) mediu 1150 dark nodes / 746 EXCLUSIVO_DARK / 139 GÊMEO / 24 EXCLUSIVO_LIGHT. **A medição é íntegra mas o número não:** os 746 incluem o efeito de um bug arquitetural muito maior que o baseline acabou expondo.

**Bug arquitetural descoberto durante a auditoria de completude (PR55):** `themes/dark.css` declarava o dark theme inteiro (~117 vars) DENTRO do bloco `[data-theme="dark"], .dark` (opt-in explícito), mas o bloco `@media (prefers-color-scheme: dark)` (auto via OS) carregava APENAS 5 vars + um comentário `/* ... other variables would inherit from .dark */` — comentário arquiteturalmente **incorreto** porque CSS não herda variáveis entre seletores. Resultado: usuário em OS-dark sem `data-theme="dark"` explícito recebia ~110 vars em valor LIGHT (`--color-surface-overlay` = white, `--color-fg-secondary` = slate-600, etc.) e ~5 em valor dark — Modal/Dialog/CommandPalette renderizavam com FUNDO BRANCO em dark mode. **Não é dívida de a11y; é bug visual GRAVE de produção** que o baseline light nunca podia ver. Justifica retroativamente ter instrumentado o dark.

**Plumbing também expôs falha de método em Passo 0:** o gate samplerou `--color-surface-canvas` e `--color-fg-primary`, **por acaso dois dos 5 vars que o `@media` POR ACASO incluía**. Gate passou honestamente para esses 2, foi falso-positivo para os outros 114. **Lição registrada:** ao testar um instrumento, samplear a amostra que FALHARIA se o instrumento estivesse errado, não a que confirma o caminho feliz. Para o gate dark futuro, samplear `--color-surface-muted` ou `--color-surface-overlay` (vars que o `@media` antes NÃO incluía) é o teste honesto.

**Fix em PR #55:**

- **Issue 2 — completude do bloco explícito:** 5 tokens semânticos que não tinham override dark adicionados (`--color-line-brand` indigo-400, `--color-line-secondary` pink-400, `--color-line-accent` cyan-400, `--color-line-focus-ring` indigo-400, `--color-surface-disabled-subtle` slate-900). Borda visibility contra surface adjacente slate-900 verificada matematicamente: indigo-400 = 5.07:1, pink-400 = 6.12:1, cyan-400 = 9.68:1 — todos comfortably ≥3:1 (axe non-text threshold). `surface-disabled-subtle` slate-900 sobre canvas slate-950 = ~1.16:1 mantém a intenção light (slate-50 sobre white = ~1.05:1 — "barely-perceptible disabled wash").
- **Issue 1 — completude do bloco @media:** duplicado verbatim (modulo seletor + `::selection` pseudo) o bloco `[data-theme="dark"]`. 117 vars semânticos agora declarados em AMBOS os caminhos. `--color-scrim` e `--color-tint-hover` ficam fora dos dois (theme-agnostic by design, Princípio 5).
- **Regression test obrigatório:** `scripts/validate-dark-coverage.mjs` parseia ambos os blocos, verifica que (a) todo token semântico em `colors.css` está nos dois blocos exceto allowlist theme-agnostic, (b) os dois blocos declaram exatamente o mesmo conjunto. Wired em `.husky/pre-push` (gate local) e CI Lint job (gate remoto). **Duplicação que não pode driftar** — toda mudança em um bloco que não toque o outro falha CI.
- **Docs-sync:** `.claude/rules/colors.md` ganhou seção explícita "Dark mode has two activation paths and BOTH must be maintained" referenciando o validate script. Próximo contributor não precisa redescobrir o bug.
- **Verificação visual:** Modal, Dialog, CommandPalette, Drawer, Popover abertos em dark via `emulateMedia` — 5/5 com painel slate-800 (`bg-surface-overlay` resolvido pra `rgb(30, 41, 59)`), texto fg-primary em white legível, bordas `line-brand` indigo-400 visíveis. Screenshots em `/tmp/dark-visual/`.

**Implicação na contagem da dívida dark:** os 746 EXCLUSIVO_DARK foram medidos sob o regime quebrado do `@media`. **A maioria desses nodes eram `bg-surface-*` em valor LIGHT contra `text-fg-*` em valor DARK** — ratio 1.05 (extrator confirmou: 109× surface-muted, 24× surface-overlay, 22× gray-100, etc.). Com o `@media` consertado em PR55, esses nodes evaporam — não eram contraste "abaixo de AA", eram contraste-de-bug-de-CSS. **O número real da dívida dark só é conhecido depois do re-sweep pós-PR55.** Esperado: queda massiva (~500-600n cai com o fix do @media), residual real será (a) gêmeos do light (~139 confirmados, que fecham quando light fechar) + (b) raw Tailwind colors em stories/componentes (Bucket B-dark, análogo aos H/I/J/K light pendentes).

**NÃO marcar "Family C-dark resolvida".** O PR55 conserta o BUG que inflava a medição; não é remediação de a11y. A dívida dark real fica TBD até o re-sweep pós-merge.

**Próximos passos (ordem encadeada):**

1. ✅ PR55 merged.
2. Re-sweep paralelo dark — número honesto da dívida dark.
3. Refazer extractor com selector preciso (axe `n.target` ambiguo de antes) — agora vale a pena, porque o estado mediu é o estado correto.
4. Bucket B-dark anchor (raw Tailwind em stories + componentes) — toque-a-toque.
5. Serial light+dark 96min — apenas na virada `a11y.test:"error"`, com cadência reconciliada (variance=0 confirmado nesta phase).

**Cadência reconciliada nesta phase (registro para futuro):** sweep paralelo determinístico (variance=0 em re-run light), método consistent com Phase C PR2 (Timeline match exato 11→11; Tables/Badges shift atribuível a PR41-45 fechando indiretamente). Gap 806→186 light é (i) trabalho fechado, não (ii) race nem (iii) divergência de método. Implicação: paralelo é instrumento honesto para trabalho iterativo; serial só pago na virada de record.

### Re-sweep pós-PR55 — finding meta (consertar bug pode SUBIR contagem honesta)

**Resultado:** Re-sweep paralelo pós-PR55 mediu **dark total 1313** (era 1150) e **EXCLUSIVO_DARK 761** (era 746). Light idêntico (186). Dark **subiu +163** contra a expectativa de queda massiva.

**A direção do delta importa mais que o valor.** Decompondo por componente:

- **Evaporaram (~200 nodes — bug-induced violations corrigidas):** Table 52→10, Chip 50→14, Avatar 22→0, AvatarGroup substories -34 cumulativo, Modal 11→0, DataGrid 17→2, LoginBox 15→0, CommandPalette 8→1, SideNavbar 108→101. Padrão consistente: surfaces que eram WHITE em OS-dark (broken @media) e agora são slate-800 → text-fg-primary sobre elas não falha mais o ratio 1.05.
- **Desmascarados (~360 nodes — raw colors que o bug escondia):** Timeline 57→215 (+158), Stepper 6→95 (+89), Fileupload 27→47, Progress 19→38, Rating 1→18, Slider 34→50, Breadcrumb 10→25, ColorPicker 0→13, PageHeader 16→28, Navigation 30→40, outros menores. Padrão consistente: stories usam `text-gray-600/700` raw em fixtures; pré-fix renderizava sobre fundo-branco-quebrado → gray-600 / white = 5.74:1 = passava AA → axe não flagava. Pós-fix renderiza sobre slate-800-correto → gray-600 / slate-800 = 2.36:1 = falha AA → axe flagga.

**O bug do @media não inflava só a contagem — ele MASCARAVA raw colors simultaneamente.** Era falso em duas direções: marcava nodes que não deveriam ser nodes (text-fg em surface-light = ratio 1.05) E deixava passar raw colors que deveriam ser nodes (text-gray sobre surface-light = ratio confortável). Pós-fix os dois lados são honestos.

**Lição metodológica:** ao consertar um bug de instrumentação, o número honesto pode subir, descer, ou ambos. Avaliar pelo VALOR é insuficiente; avaliar pelo DELTA por componente revela se a mudança é a esperada (evaporações) + a inesperada-mas-correta (desmáscaras). Se só evapora, o fix consertou mas pode estar mascarando outros bugs. Se só sobe, suspeitar regressão. Se ambos em direções coerentes (como aqui), o instrumento ficou honesto. **A dívida dark real é ~761 (subiu), não ~200 (queda esperada). O número anterior era ficção bidirecional do bug.**

### Sweep classificação componente-vs-story dos 761 EXCLUSIVO_DARK

Grep da dívida em raw colors:

| Source                                                                                                                     |                  Hits | Tipo                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------: | ----------------------------------------------------------------------------------------- |
| `Text.tsx`                                                                                                                 | 6 código + 2 comments | **EXCEÇÃO Princípio 3 documentada** (light/dark variant shades sem equivalente semântico) |
| `Badge.tsx`                                                                                                                |     1 (`bg-pink-300`) | **EXCEÇÃO Princípio 3 documentada** (secondary solid badge)                               |
| `TokenVisualizations.tsx`                                                                                                  |                    33 | **ALLOWLISTED em eslint rule** (meta-context page que renderiza tokens como swatches)     |
| `tokens/{README.md,Tokens.mdx,COLOR_USAGE_GUIDE.md}` + `cva.ts` + `cn.ts`                                                  |                   ~23 | Documentação / JSDoc — não código rendered                                                |
| `*.stories.tsx` (top: SideNavbar 38, Stack 30, Radio 29, FileUpload 27, Tabs 26, DatePicker 26, Chip 22, Card 21, +outros) |           ~400+ sites | **STORY/fixture (regra A)**                                                               |

**Total raw colors em produção FORA das exceções documentadas: ZERO.** A regra ESLint `ds/no-raw-color-classes` (pre-commit + pre-push + CI) segurou o sistema; Phase 7 está honesto.

Decomposição estimada dos 761 EXCLUSIVO_DARK:

| Bucket                                                                                               |      Estimativa | Tipo                                 |
| ---------------------------------------------------------------------------------------------------- | --------------: | ------------------------------------ |
| Story raw colors (Timeline 158 + Stepper 89 + SideNavbar/Stack/Radio/FileUpload/Tabs/Chip/Card/etc.) | **~700 (~92%)** | STORY                                |
| Princípio 3 exceptions exercidas em stories (Text colorShade, Badge pink-300)                        |           ~5-10 | COMPONENT (allowlisted exception)    |
| TokenVisualizations sample rendering                                                                 |           ~5-10 | COMPONENT (allowlisted meta-context) |
| Possíveis semantic-on-semantic dark token-pairs genuínos                                             |          ~20-50 | COMPONENT (real defect, mas pequeno) |
| `select-name` + `label` + `aria-required-attr` residuais                                             |              22 | majoritariamente STORY               |

**Anchors confirmados Timeline 158 + Stepper 89 = 247 nodes (~32% da dívida) em 2 arquivos:** Timeline.tsx e Stepper.tsx ambos **ZERO** raw colors em produção; 100% dos +nodes vêm de `Timeline.stories.tsx` (8 raw-color sites) + `Stepper.stories.tsx` (8 raw-color sites). Estes não são "Phase 7 deixou buraco em produção"; são fixture pollution.

**Veredito da classificação: o DS produção está clean.** Phase 7 vigora. A dívida dark é **faxina sistemática sob regra (A)** — substituição semântica `text-gray-600 → text-fg-secondary`, `text-blue-700 → text-fg-link`, etc., respeitando triagem por papel (não por valor). Anchor próximo: Timeline + Stepper (32% / 2 arquivos). NÃO atacar até o user aprovar a substituição papel-a-papel proposta.

### Overlap com Family C-light residual 19n (Buckets H/I/J/K)

BACKLOG line 690 descreve os 19n como "raw colors em stories, brand fg outliers, pink-300 Principle 3". Esses são raw colors que falham AA EM LIGHT (rara: text-blue-300 sobre white ≈ 1.94:1 é o tipo de caso). A vasta maioria dos ~400 raw colors em stories PASSA em light por causa do fundo-branco (gray-600/white = 5.74 ✓). Portanto:

- **A interseção é parcial, não total.** Story files que aparecem nas duas listas (light residual + dark debt) renderizam DIFERENTES pares falhando: light flag um conjunto (cores muito claras sobre white), dark flag outro (cores médias sobre slate-800).
- **Fixar raw colors via substituição semântica fecha LIGHT 19n + DARK ~700 SIMULTANEAMENTE.** Mesma faxina, dois lados do gate. Confirmação operacional da decisão (A): trabalho de fixture conta pros dois lados.
- **Componentes com nodes em GÊMEO (138 atuais) são onde a sobreposição acontece de fato** — fixtures que falham em ambos os temas. Esses são o subset que a faxina elimina com 1 substituição.

### Próximos passos atualizados pós-classificação

1. ✅ PR55 merged.
2. ✅ Gate v2 re-validado com sample disciplinado (24/24 cells, 4 vars × 3 stories × 2 schemes).
3. ✅ Re-sweep paralelo dark (190s) — 1313 dark / 761 EXCLUSIVO_DARK / 138 GÊMEO / 25 EXCLUSIVO_LIGHT.
4. ✅ Classificação componente-vs-story dos 761 — ~95% STORY, ~5% COMPONENT (allowlisted exceptions + ~20-50 semantic-on-semantic possíveis).
5. **Bucket B-dark anchor (Timeline + Stepper stories — TENTATIVA falhou na premissa, PR pequeno mesmo assim):** 16 substituições semânticas aplicadas (gray-600→fg-secondary, gray-500→fg-tertiary, blue-700→fg-info, etc.) em PR57. Phase 7 disciplina shipada em 2 stories (ambas agora raw-color zero). MAS o re-sweep pós-anchor mostrou impacto ínfimo: dark 1313→1320 (+7), Timeline 215→222, Stepper 95→96. **A hipótese "Timeline+Stepper +247 era raw-color unmasked" estava errada.** Drill-down em `Timeline/ManyItems` (71 dark nodes) revelou que os dOnly patterns são SEMANTIC tokens: `text-fg-tertiary` em timestamps, `text-fg-secondary` em descrições, `text-fg-brand-emphasis` em item ativo, `data-marker="pending"` GÊMEO (Bucket F). Não eram raw colors — são pares semânticos que falham (ou continuam falhando) em dark. **PR57 é Phase 7 hygiene legítima mas NÃO é o anchor da dívida dark.** A dívida real exige diagnóstico diferente.
6. **Próximo: refrescar o extrator com seletor preciso AGORA** (estado correto, anchor 5 já não vai mais mudar o terreno em escala). Captura por nó: classe completa do texto, classe completa do ancestor com bg, computed RGB de cada um, ratio. Output: top {fg_class, bg_class} pares. Pode revelar:
   - **(a)** Pares semantic-on-semantic genuínos em dark que falham AA por construção (e.g., text-fg-tertiary slate-400 sobre algum bg específico que apertou contraste). Fix: ajustar valor dark do fg ou do bg envolvido.
   - **(b)** Pares envolvendo a Bucket F exception espalhada além de Timeline/Stepper bubbles documentadas.
   - **(c)** Outros raw colors em stories que minha grep não capturou (formatos exóticos, classes dinâmicas).
7. **Faxina sistemática dos demais story files com raw colors** (SideNavbar 38, Stack 30, Radio 29, FileUpload 27, Tabs 26, DatePicker 26, etc.) — vale fazer pela disciplina mesmo se impacto a11y for menor que o esperado, porque o ESLint rule cobre stories no futuro depende dessa limpeza (item de fim de fase).
8. Serial light+dark 96min — só na virada `a11y.test:"error"`, cadência reconciliada.

### Lição metodológica de PR57 (TENTATIVA de anchor com hipótese errada)

O extrator anterior identificou clusters tipo "228× text-fg-primary on transparent ancestor" e "109× ? on bg-surface-muted" — eu inferi que stories usando `text-gray-*` raw eram a causa dos +247 Timeline+Stepper porque o grep mostrou que stories tinham essas classes. Esse encadeamento é **plausível mas não confirmado**: o extrator não conseguia atribuir o bg ancestor com precisão (`.font-normal` ambíguo), e eu pulei pra conclusão sem o teste.

A premissa que faltava: "se o +247 vem de raw colors em stories, deveria haver correlação POSICIONAL — as 8 raw-color sites de Timeline deveriam aparecer em stories com counts proporcionais ao número de instâncias renderizadas". Conferi só DEPOIS de aplicar — most Timeline stories (default, horizontal, with-icons, with-status, etc.) reportam 12-14 dark nodes cada **sem usar nenhum dos sítios que eu mudei**. Many-items reporta 71 nodes sem ter content custom — só itens default do Timeline component.

Lição: **diagnóstico-antes-de-fix vale também depois de uma classificação aparentemente sólida**. Verificar correlação posicional (which stories carregam which raw colors, qual delta por story) **antes** de aplicar fix evita esse tipo de waste motion. O custo desta tentativa foi pequeno (16 edits + 1 sweep), mas a lição cabe registrar pra próxima vez.

### Canvas-token-não-consumido — o achado real (PR #58)

**67% da dívida dark medida era falso-positivo de axe.** Refazer o extrator com seletor preciso (post-PR57) sobre os 1320 nodes dark color-contrast revelou que **741 deles (top 3 buckets) eram `text-fg-{primary,secondary,tertiary}` sobre `(documentElement)`** — i.e., axe não encontrava ancestral opaco e fazia fallback pra canvas-assumida-branca, flagrando ratio 1.05 / 1.48 / 2.56. Smoking gun direto: probe em `primitives-button--ghost` dark mostrou `<html>`, `<body>`, `#storybook-root`, primeiro-filho **todos com `rgba(0,0,0,0)`** apesar de `--color-surface-canvas` estar corretamente definido como `#020617` (slate-950). **Nada no DOM consumia o token de canvas.** O browser pintava UA-default-dark (~rgb(18,18,18)) porque `color-scheme:dark` estava setado, e por sorte o resultado parecia próximo de slate-950 — mas axe não lê `color-scheme`, walks só na cadeia de `background-color`.

**Fix (1 declaração CSS em `@layer base`):**

```css
@layer base {
  body {
    background-color: var(--color-surface-canvas);
    color: var(--color-fg-primary);
  }
}
```

Isso faz a `<body>` materializar o canvas-token no DOM, dando a axe um ancestral opaco para resolver. O `color: fg-primary` também: elementos sem cor explícita herdam o foreground do DS em vez do default do UA.

**Disciplina aplicada antes de aprovar o fix — 3 proofs exigidos pelo usuário:**

1. **No-op visual estrito:** screenshots pre/post em 3 cenários piores-caso (button--ghost dark, button--primary light, modal--default dark com scrim). Light passou idêntico (canvas=white=UA-default). **Dark FALHOU o critério estrito:** o pixel canvas vai de UA-default ~rgb(18,18,18) para slate-950 rgb(2,6,23) — shift visível porém pequeno. **Avaliação:** o shift é "alinhamento com a spec do DS" (Phase 13e definiu canvas=slate-950 mas nenhum elemento consumia; o pre-fix era acidente UA). Aprovado pelo usuário porque Proof 2 deu prova direta de que não era silenciamento.
2. **Contraste real era adequado:** sample em 3 nós dos top buckets. Para fg-primary slate-50: axe assumia branco → ratio 1.05 ❌; Chromium UA dark ~rgb(24,24,24) → ratio real **16.97** ✅; post-fix slate-950 → 19.28 ✅. Mesmo padrão para fg-secondary (11.96 real) e fg-tertiary (6.93 real). **O usuário sempre viu contraste 6.9-17.0** — axe era falso-positivo, não violação real.
3. **Correlação posicional cirúrgica:** re-rodada axe com fix injetado mostrou drop concentrado nas stories canvas-fallback (Timeline-many-items 71→11; Timeline default/horizontal/with-icons/etc 12-14→0; Progress 12→0; DashboardLayout 10→0; primitives-text 11→0). Stories cujas violations vêm de OUTRAS causas (Collapsible com `bg-gray-100` raw, Slider keyboard-nav, Button keyboard-nav) ficam em 1→1 / 2→2. **Os 46 nodes `text-fg-primary` sobre `bg-gray-100` raw — fundo BRANCO REAL — NÃO sumiram** (continuam falhando pós-fix). Essa não-evaporação dos genuínos é a prova final de que o fix não silencia cego.

**Re-sweep dual-tema com fix em CSS real:**

| Métrica         | Pré-canvas-fix (post-PR57) | Pós-canvas-fix |        Δ |
| --------------- | -------------------------: | -------------: | -------: |
| Light total     |                        186 |            186 |        0 |
| Dark total      |                       1320 |        **811** | **-509** |
| GÊMEO           |                        138 |            133 |       -5 |
| EXCLUSIVO_DARK  |                        765 |        **446** | **-319** |
| EXCLUSIVO_LIGHT |                         25 |             30 |       +5 |

**Dark/light ratio:** 7.1× → **4.4×** (total); EXCLUSIVO_DARK/light: 4.1× → **2.4×**. Dívida dark agora na **mesma ordem de grandeza** do light (não 6.2× como reportado pré-fix).

**Resíduo classificado (precise extractor pós-fix, 636 dark color-contrast nodes, top 20 buckets cobrem 99.7%):**

- **~580 nodes (~91%): Bucket B-dark — raw Tailwind em stories**
  - `text-gray-600/500/700` em stories sobre canvas slate-950 (164+52+4=~220 nodes) ou sobre `bg-surface-base` slate-900 (99+7=~106) — substituição semântica por papel
  - Raw bg em story LayoutWrappers (`bg-gray-100` 46+23+19=88, `bg-blue-100` 33, `bg-purple-100` 10, `bg-green-100` 6, `bg-white` 13, `bg-gray-200` 14) — texto-fg-primary inherited sobre fundo claro raw em dark = ratio 1.05/1.18 = FAIL real
  - Sobreposição com Family C-light buckets H/I/J/K (faxina única fecha ambos)
- **~11 nodes: Bucket F documented exception** — `text-fg-quaternary` (slate-500) sobre `bg-surface-base` (slate-900) = 3.75 em Timeline/Stepper bubbles. Já registrado em `.claude/rules/colors.md`; suppressão dirigida em Timeline/ManyItems; pode precisar estender para mais stories
- **~30 nodes: outliers reais** — `text-white` sobre `bg-blue-500` (3.68, indigo border case), `text-red-600` (3.70 em SearchAndFilterPattern), `text-indigo-600` (2.84 em SideNavbar header) — caso-a-caso

**Resumo do achado:**

- Pré-PR58 a métrica de dívida dark estava **inflada em 67% por bug de instrumento**. O canvas-token existia mas não era consumido; axe assumia branco; flagrava high-contrast text como falso-positivo.
- Pós-PR58 a dívida dark é **446 EXCLUSIVO_DARK** (signatures) ou **636 dark color-contrast nodes** (instances), majoritariamente raw colors em stories. Da **mesma ordem do light** (186) — não é problema arquitetural; é faxina sistemática estilo Family C-light buckets H/I/J/K.
- A narrativa pré-fix "dívida dark é 6× maior que light" era ficção do instrumento. **O número honesto é ~2.4× light** — gerenciável.

### Meta-lição sobre proxy vs prova direta

A regra "qualquer shift visual = rejeita o fix" foi estabelecida como **proxy** para distinguir "corrige instrumento" de "silencia violação real". Era proxy porque, no momento de propor o fix, não tínhamos como verificar diretamente se as 783 violations que axe ia parar de gritar eram reais. No-op-visual é uma **prova suficiente** de não-silenciamento: se nada muda visualmente, axe parar de reclamar só pode ser correção.

**Mas o proxy estava mal-calibrado para este caso.** O shift dark do canvas era "alinhamento com a spec do DS" — fazer slate-950 ser o que o DS sempre quis, em vez do acidente Chromium UA — não "design mudou". Rejeitar pra preservar `rgb(18,18,18)` UA-default seria preservar um bug.

**A flexibilização foi segura porque PROOF 2 deu prova DIRETA:** sample do contraste real em 3 nós dos top buckets, computado contra a cor que o usuário JÁ vê (Chromium dark canvas), retornou 6.9-17.0 — bem acima de AA 4.5. **A prova direta de "contraste real sempre foi adequado" tornou o proxy desnecessário.**

**Princípio:** proxy só pode ser flexibilizado quando há prova direta da propriedade que o proxy estava aproximando. O critério "no-op visual" estava aproximando a propriedade "não silencia violação real"; quando PROOF 2 deu prova direta da propriedade, o proxy estava livre pra ser relaxado.

**Mas o timing importa:** **a prova direta tinha que ser EXIGIDA antes do fix, não oferecida depois.** Se o usuário não tivesse pedido os 3 proofs antes da aplicação, eu teria proposto e aplicado o fix com apenas o argumento "no-op visual" — que falharia em dark — e teríamos rolled back ou aceito o pixel-shift sem entender o que ele significava. **A ordem (verificação-precede-fix) é o que tornou seguro flexibilizar o critério.** Não é "ter as 3 provas"; é "ter as 3 provas ANTES de aplicar".

Lição prática pra próximas fases: quando um critério estabelecido (no-op, atomicity, isolation, etc.) está bloqueando um fix que parece legítimo, **a saída não é argumentar contra o critério — é exigir prova direta da propriedade que o critério estava aproximando, ANTES de aplicar.** O critério vence por default; só prova direta substitui.

### Faxina raw-color stories (PR #59)

Aplicado: substituição semântica raw→token nos ~400+ sites em 56 story files de uma vez, usando mapa Phase 7 ("triagem semântica não tradução") por papel. Padrões aplicados:

| Raw                                      | Token                                         | Papel                                                             |
| ---------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| `text-gray-{500,600,700}`                | `text-fg-{tertiary,secondary,primary}`        | Hierarquia de texto                                               |
| `text-gray-400`                          | `text-fg-quaternary`                          | Texto/ícone muito subtle                                          |
| `bg-gray-{50,100,200}`                   | `bg-surface-{subtle,muted,emphasis}`          | Hierarquia neutra de surface                                      |
| `bg-white rounded-lg border`             | `bg-surface-base rounded-lg border`           | Card surface                                                      |
| `hover:bg-gray-{50,100,300}`             | `hover:bg-surface-{hover,hover,strong}`       | Estados hover neutros                                             |
| `border-gray-{200,300}`                  | `border-line-{default,emphasis}`              | Linhas/bordas neutras                                             |
| `text-{blue,green,red,yellow}-{400-800}` | `text-fg-{info,success,error,warning}`        | Status text                                                       |
| `bg-{blue,green,red,yellow}-50`          | `bg-{info,success,error,warning}-bg`          | Status callout bg                                                 |
| `bg-{blue,green,red,yellow}-200`         | `bg-{info,success,error,warning}-bg-emphasis` | Status CTA bg                                                     |
| `border-{blue,green,red,yellow}-200`     | `border-{info,success,error,warning}`         | Status callout border                                             |
| `text-indigo-600`                        | `text-fg-brand-emphasis`                      | Brand text (stats, primary icon)                                  |
| `bg-indigo-{50,100}`                     | `bg-surface-brand-subtle`                     | Brand subtle bg (avatar circle, callout)                          |
| `text-purple-600`                        | `text-fg-brand-secondary`                     | Secondary brand text (sem família purple no DS; pink é secondary) |
| `bg-purple-50`                           | `bg-surface-secondary-subtle`                 | Secondary brand subtle bg                                         |
| `text-orange-600`                        | `text-fg-warning`                             | "No results" callout                                              |
| `text-white` em raw `bg-{color}-500/600` | `text-fg-inverse` + `bg-{semantic}`           | CTA buttons / solid status badges                                 |

**Decisões de triagem ambíguas registradas:**

- **Stack decorative items** (`bg-blue-100/green-100/purple-100` em "Item 1/2/3" demos) → todos `bg-surface-muted`. Phase 7 doctrine: a story demonstra LAYOUT, não color variation; as cores eram decoração não-disciplinada. Colapsar pra 1 token neutro preserva o intent da story (mostrar spacing/alignment) sem abusar de tokens de status pra decoração.
- **SideNavbar KPI stats** ($45,231 indigo, 2,345 green) → respectivamente `text-fg-brand-emphasis` e `text-fg-success`. Para o verde, mantida leitura status-success porque na story o número era pareado explicitamente com "+5% from last week" (growth indicator real). Para o indigo, brand-emphasis (KPI primary brand). Diverge do precedente Stepper "Complete" → brand-strong (não success) porque lá o "Complete" era um CTA primário (ação), aqui o "+5%" é um indicador de status (display).
- **CTA buttons hand-rolled** em stories (Tabs, Radio, MultiSelect, Input, Stepper) → `bg-surface-brand-strong text-fg-inverse rounded hover:opacity-90`. Refactor pra `<Button>` primitivo fica fora deste PR (registrado abaixo).
- **Avatar circles** (`bg-indigo-100` + `text-indigo-600`) → `bg-surface-brand-subtle` + `text-fg-brand-emphasis`. Decoração brand-tinted; brand subtle cobre.
- **Logout buttons** (`text-red-500 hover:bg-red-50`) → `text-fg-error hover:bg-error-bg`. Destructive action; semântica error.

**Cuidados de execução:**

- Mass sed catched substring matches (`bg-blue-500` → `bg-info-bg0` quando sed corria `s/bg-blue-50/bg-info-bg/g`). Identificados ~5 sítios mangled e corrigidos manualmente — `bg-surface-brand-subtle0`, `bg-info-bg0`, `bg-error-bg0` → corrigidos para `bg-surface-brand-strong text-fg-inverse`, `bg-info text-fg-inverse`, `bg-error text-fg-inverse` respectivamente.
- Verificação pós-aplicação: grep de classes com sufixo numérico inesperado retorna zero. Tailwind v4 detectou todas as novas classes no build (cada classe nova nos JS bundles está espelhada no CSS bundle).
- 816/816 tests pass. Storybook smoke 852/852 pass.

**Resultado mensurável (re-sweep dual-tema):**

| Métrica         | Pré-faxina | Pós-faxina |                        Δ |
| --------------- | ---------: | ---------: | -----------------------: |
| Light total     |        186 |    **171** |                  **-15** |
| Dark total      |        811 |    **165** |                 **-646** |
| GÊMEO           |        133 |        123 |                      -10 |
| EXCLUSIVO_DARK  |        446 |     **24** | **-422** (94.6% redução) |
| EXCLUSIVO_LIGHT |         30 |         30 |                        0 |

**Predição vs realidade:**

- Predito: color-contrast dark 658 → ~78 (-580); light 34 → ~5-10 (-24-29). Resíduo all-rule total esperado ~231 (78 cc + 153 structural).
- Real: dark total 811 → 165 (-646); EXCLUSIVO_DARK 446 → 24 (-422). Resíduo all-rule total: **165**.
- **Drop foi MAIOR que predito** (646 vs ~580 dark, +66). Razões prováveis: (a) algumas substituições touched GÊMEOS que falham ambos os temas (-10 GÊMEOS confirmam); (b) text-fg-\* hierarchies em stories também caem em light se eram raw-text sobre raw-bg (light residual -15 confirma esse mecanismo).

**Dark/light ratio:** pós-faxina 165/171 = **0.96×**. Dark e light estão agora **virtualmente equivalentes** em volume de violação. Confirma a tese: dívida dark era ~95% fixture pollution, agora limpa.

**Out of scope deste PR — registrar:**

- Refactor `<button>` hand-rolled em stories para `<Button>` primitive (Stepper, Tabs, Radio, MultiSelect, Input, Form, etc.). Different review scope (story quality, not a11y).
- 24 EXCLUSIVO_DARK residual + 123 GÊMEO devem ser classificados separadamente — provavelmente: ~11 Bucket F + ~13 outliers + 123 estruturais (label, select-name, landmark, nested-interactive, aria-\*). Próximo passo natural após esta faxina é Family A/B (regras estruturais) e Bucket F (exceção arquitetural já documentada).

### Próximo passo natural pós-faxina

Os 165 nodes residuais (24 EXCLUSIVO_DARK + 30 EXCLUSIVO_LIGHT + 123 GÊMEO + outros) são majoritariamente **regras estruturais** — não color-contrast. O caminho pra `a11y.test:"error"` agora é Family A/B residuais + outliers de color-contrast (~24 dark). Estimativa: 1-2 PRs anchor + Bucket F já documentada.

### Re-triagem semântica + cadeado (PR #60)

A faxina anterior (PR #59) foi cumprida por sed global — find-and-replace de cores cruas pra tokens, axe-clean mas semanticamente desleixada. User pediu re-triagem per-papel (Phase 7 doctrine "triagem semântica não tradução") antes de ligar o cadeado, porque cadeado sobre código semanticamente errado cristaliza o erro.

**Amostra inicial (5 sites BLUE) deu o sinal:** 2 errados (KPI azul, count badge), 3 debatíveis, 0 corretos. Tratada como amostra da população (~600 substituições), não como "os 5 a corrigir". Re-triagem completa por cluster.

**Princípio que emergiu:** o sed foi inversamente proporcional a quão status-nativa a cor é no DS.

- **BLUE 45**: ~80% errado. Azul não é família de status no DS (não há `--color-blue-bg`); o mapa `blue → info` aplicou status a KPIs categoricos, badges de contagem, callouts de selection. Re-triados por sub-grupo.
- **GREEN 41**: ~12% errado (5 KPIs categóricos). Verde COM valência (success-status) acertou; verde decorativo (KPI Active Users) errou. State-mask de DataTablePattern "active" restaurado a `bg-success-bg`.
- **PURPLE 6**: 33% errado (2 KPI Revenue). Purple não é família no DS; sed mapeou pra brand-secondary (pink), mas era categorical decoration. Neutralizados pra fg-primary.
- **RED 17**: 0% errado. Vermelho É família de status (error). 17 sites verificados como error-state genuíno ou destructive-action. Procurado red decorativo (Stack vermelho, KPI vermelho, badge sem alerta) — ausência confirmada.
- **INDIGO 5**: 20% errado (1 KPI Monthly Revenue mascarado de brand-emphasis, já neutralizado em GREEN D). Indigo É família brand do DS; 4 brand-genuine + 1 decorativo.
- **text-fg-inverse 10 (12 incluindo Stepper pré-existente)**: 0% errado. Todos sobre brand-strong ou status-neutral. Zero text-white em fundo claro.
- **Yellow/amber/orange 3**: 0% errado. Todos limit/empty warnings genuínos.

**Validação dos 456 gray (80% da faxina):** sample estratificado ~45 sites — 100% corretos. State-mask escondido procurado em bg-gray-100/200 conditionals → 2 encontrados (DataTablePattern + Pagination role/status pills), ambos já triados via BLUE D / GREEN E. Zero state-mask adicional.

**Decisão arquitetural de lacuna categórica registrada:**

DS **não tem família categórica** (tokens pra distinguir séries/categorias sem valência de estado). Lacuna real, afetava ~12-15 sites color-coded em KPIs/roles. Duas saídas (Princípio 9):

(i) Criar família categórica — ~15-20 linhas CSS + dark overrides + allowlist no validate-dark-coverage. Cobre dashboards / data-viz / role color-coding.
(ii) Decidir que stories NÃO demonstram cor categórica — KPI/role pills → neutros (label distingue, cor não mente).

**Aprovado (ii).** Razão DECISIVA (não as outras conveniências):

> Princípio 9 exige CONSUMIDOR REAL pra criar token. KPI/role color-coded em stories NÃO é necessidade de design articulada — é artefato de fixtures que o autor pintou por hábito. Criar família categórica pra honrar isso seria "construir arquitetura permanente pra honrar um acidente" — exato anti-padrão do Princípio 9. Mesma lição que o botão "Complete" verde (PR #57): "preservar a intenção do autor" é armadilha quando o que você está consertando É a ausência de intenção.

A distinção que os KPIs/roles supostamente "preservavam" não se perde de verdade: a label e a posição comunicam ("Total Users: 14"). A cor é REDUNDANTE com o texto — decoração no sentido estrito. Neutralizar não remove informação que o usuário usa.

**Porta aberta pra (i) no futuro:** se um caso de uso real de data-viz categórico surgir, reabrir Princípio 9 ENTÃO, com o consumidor real na mão.

**Princípio derivado pra triagem por papel (registro pra próxima vez):**

| Distinção                         | Tratamento                    | Exemplo                                                          |
| --------------------------------- | ----------------------------- | ---------------------------------------------------------------- |
| CATEGORIAS paralelas sem valência | NEUTRALIZAR (label distingue) | Admin/User role pills, KPI Users/Revenue, Stack Item 1/2/3       |
| ESTADO com valência               | FICA status                   | Active (positive operational), Error, Warning, Success-confirmed |
| BRAND identity                    | FICA brand-\*                 | Primary CTA, brand-tinted avatar, brand emphasis                 |
| STATUS message genuíno            | FICA status-bg + status-fg    | "✓ Form submitted", "⚠ Maximum reached", "✗ Error: ..."         |

Aplicar o mesmo PRINCÍPIO a casos diferentes (categoria neutraliza, estado fica) é a consistência REAL — não tratar tudo igual por "coerência".

**Cadeado ligado em PR #60:** `ds/no-raw-color-classes` agora aplicado em `*.stories.tsx` (era exempto via comentário datado de PR pré-faxina). Adição no `eslint.config.js` story-discipline block:

```js
rules: {
  "ds/story-discipline": "error",
  "ds/no-raw-color-classes": "error",  // cadeado on (PR #60)
}
```

`npm run lint` pós-cadeado: **0 erros, 8 warnings pré-existentes** (react-hooks/exhaustive-deps em primitives, fora do escopo). Zero raw color escapou.

**Re-sweep pós-re-triagem:**

| Métrica        | Pré-re-triagem (PR #59) | Pós-re-triagem (PR #60) |   Δ |
| -------------- | ----------------------: | ----------------------: | --: |
| Light total    |                     171 |                     170 |  -1 |
| Dark total     |                     165 |                     165 |   0 |
| EXCLUSIVO_DARK |                      24 |                      24 |   0 |

Re-triagem foi semântica, não de contraste. -1 light de carona (DataTablePattern "active" pill com bg-success-bg fica AA-correto contra fg-success).

**Estado final da dívida color-contrast:**

- Dark color-contrast: 165 nodes (era 658 pré-canvas-fix, 1320 pré-canvas-bug-discovery)
- Light color-contrast: 170 nodes
- Dark/light ratio: 0.97× — virtualmente equivalentes

**Próximo passo natural:** Family A/B estrutural (165 dark + 170 light residuais são majoritariamente label / select-name / aria-required-attr / nested-interactive / landmark / aria-valid-attr-value / aria-input-field-name). Não color-contrast mais.

### Meta-lição: cadeado sobre código correto protege, sobre torto aprisiona

O instinto de ligar a regra IMEDIATAMENTE após "zero raw" estava errado. Zero raw axe-clean ≠ semântica honesta. O cadeado checa raw color (sintaxe), NÃO papel-no-token (semântica). Ligar sobre semântica torta cristaliza o erro DENTRO da proteção: próximo dev lê `bg-info-bg` num KPI, assume "isto é info-status (a regra confirma é semantic)", propaga.

A ordem correta foi: faxina → amostra de verificação → REVELAÇÃO de que era find-replace → re-triagem por papel → zero-raw confirmado + semântica correta → cadeado. Cada gate antes do próximo. O instinto "achei zero, ligo agora" pulava a verificação da camada que o cadeado NÃO vê.

Registrar pra próximas regras de enforcement: **a regra protege o código contra a propriedade que checa; código quebrado na propriedade que ela NÃO checa fica trancado por baixo.** Antes de ligar qualquer enforcement, validar que o que ela NÃO vê está também correto.

### Tabs primitive — orientation handling (descoberto via SideNavbar probe, anchor #1 PR60-followup)

**Estado:** **bug latente em produção do componente Tabs**, registrado para rastrear separadamente do anchor #1 que o remove do radar. **Descoberto** ao probar o teclado do NavigationTabs do SideNavbar antes de migrá-lo pra `<button aria-current="page">`. SideNavbar tira o sintoma, mas o defeito persiste no primitive — próximo consumidor de Tabs vertical pode herdar sem aviso.

**Comportamento atual:**

- `Tabs` (root) aceita `orientation: "horizontal" | "vertical"` via `TabsProviderProps` → coloca em context.
- `TabsList` lê `orientation` via `useTabsContext()` e seu keyboard handler condiciona corretamente:
  - `horizontal` → ArrowLeft/Right cicla foco
  - `vertical` → ArrowUp/Down cicla foco
- `TabsListProps` NÃO inclui `orientation` na interface; `extends HTMLAttributes<HTMLDivElement>` permite spread silencioso.

**Os 2 issues:**

A. **API gotcha — prop misuse silencioso.**
SideNavbar.stories.tsx:96 passa `<Tabs.List orientation="vertical" variant="compact">`. Lugar errado: orientation pertence a `<Tabs>`. Resultado: prop spread como HTML attribute decorativo (`<div orientation="vertical">`) no DOM, context permanece em `horizontal` default, keyboard handler segue Left/Right. Dev acredita ter setado vertical; nada acontece. **Nenhum warning/error.** Detectado só por probe de teclado.

B. **Orientation prop controla keyboard, não visual.**
Mesmo com API correta (`<Tabs orientation="vertical">`), o primitive **não** auto-estiliza `TabsList` como `flex-col`. Dev precisa adicionar `className="flex-col"` manualmente para o visual vertical. Resultado: visual stacked vertical com keyboard horizontal é configurável mas mal-comunicado — fácil de criar inconsistência (story SideNavbar era exatamente isso: flex-col visual + horizontal keyboard via context default).

**Impacto:**

- Consumidores de Tabs vertical em `src/**/*.tsx` (não-stories): **1** (SideNavbar.stories.tsx, migrado em anchor #1 PR60-followup).
- Pós-migração: **0 production consumers.** Bug fica latente — qualquer adopter futuro de Tabs vertical herda os 2 issues sem aviso.
- Severidade ativa: **baixa** (sem consumidor afetado). Severidade latente: **alta** (próximo consumidor não descobre até probe de teclado revelar).

**Fix proposto (não agora, registrado para quando alguém propor um caso de Tabs vertical):**

Issue A — duas opções:

- (i) Adicionar `orientation` a `TabsListProps` aceitando o valor mas **emitindo dev-time warning** ("orientation no Tabs.List é ignorado; defina em <Tabs orientation>"). Custo: 5 linhas, melhora DX.
- (ii) Estritamente impedir via TypeScript (Omit `orientation` de HTMLAttributes em TabsListProps), o que falha o build na hora. Mais agressivo, evita o erro completamente.

Issue B — uma opção:

- TabsList aplica `flex-col` automaticamente quando context.orientation === "vertical". Custo: 1 linha na className. Auto-pareia visual com keyboard. Mas: pode quebrar consumidores que esperam controlar layout via className (improvável).

**Recomendação quando reabrir:** começar por (i) warning + (B) auto-flex-col. Dois fixes pequenos que fecham os dois issues sem mudar API publicly. Documentar no Tabs.stories.tsx o padrão correto.

**Por que registrar agora:**

Anchor #1 migra SideNavbar pra `<button aria-current="page">`, removendo o ÚNICO consumidor em produção. O defeito não é mais visível no baseline a11y, mas persiste no primitive — sem registro, evapora do radar coletivo. **Padrão Phase 7:** defeito de produção descoberto não some quando o sintoma visível é tratado. Rastrear até o primitive ser consertado ou conscientemente descontinuado.

### Anchor #1 aplicado (PR #61): SideNavbar inner-aside + NavigationTabs role

**Resultado:** -35 sites em ambos os temas (light 170→135, dark 165→130), -33 signatures GÊMEO. Cobre **~22% da dívida estrutural** em 1 PR.

**Mudanças:**

1. `Sidebar/Sidebar.tsx`: inner `<aside id="side-navbar-sidebar">` → `<div>` (mesmo id, mesmo className, mesmo behavior). O outer `<aside role="complementary" aria-label="Sidebar navigation">` em `SideNavbarRoot.tsx` já provê o landmark. Fix de COMPONENT, 1 linha + comment.

2. `SideNavbar.stories.tsx` NavigationTabs:
   - **Antes:** `<Tabs.List orientation="vertical">` + `<Tabs.Trigger value="X" aria-label="X">` (role="tab", aria-controls="tabpanel-X" apontando pra IDs inexistentes)
   - **Depois:** `<nav aria-label="Sidebar sections">` + `<button aria-label="X" aria-current={isActive ? "page" : undefined}>` (sem role="tab", sem aria-controls)
   - aria-labels do PR52 PRESERVADOS (Home/Analytics/Users/Documents/Settings — eram a função correta, não mudam)
   - Active state styling preservado via condicional `bg-surface-brand-muted text-fg-brand-emphasis` (mesmo padrão do Tabs ativo, agora aplicado direto)
   - Comment histórico inline explicando o **porquê semântico** (não "limpeza" — é correção de role que mentia)

**Retroativo PR52 — registro correto:**

PR52 deu aria-labels corretos (Home/Analytics — a função do item). O role="tab" sob o qual os labels foram dados estava errado (tabs sem tabpanel + visual vertical com keyboard horizontal = role mentiroso). **PR52 não falhou; estava parcialmente certo** — o nome era certo, o role tab era herança da escolha de primitive (Tabs) que se revelou inadequada pro caso de uso (nav, não tabs).

PR60-followup (este) corrige o role mantendo os nomes. Pra alguém revisando: vai PARECER regressão de markup (tabs→buttons), mas semanticamente é o avanço — role="tab" mentia, button+aria-current diz o que é.

**Keyboard trade-off conscient:**

Probe pré-fix mostrou: ArrowRight ciclava entre tabs (funcionava por acidente — modelo horizontal num layout vertical), ArrowDown NÃO funcionava (o que usuários tentariam num menu vertical). Pós-fix: 5 buttons em Tab order, ArrowKeys não fazem nada (default de button). **Removemos um comportamento semanticamente errado (ArrowRight horizontal em pilha vertical) e ganhamos o padrão correto pra nav menu** (Tab-by-Tab). APG: tablist = setas; navigation menu = Tab. Sidebar é menu, não tablist.

**Gates:**

- vitest: 816/816 (incluindo SideNavbar 29/29)
- smoke: 852/852
- typecheck clean
- lint clean (0 errors)
- validate-dark-coverage OK

**Estado pós-anchor#1:**

- Light total: 135 signatures
- Dark total: 130 signatures
- Próximos anchors (ordem aprovada): #2 FormWizard empty h2 (6 sites, trivial), #3 landmark-unique variants (5 sites, trivial), #4 Slider primitive API, #5 Pagination select-name, #6 TimePicker/MultiSelect/Textarea API, #7 Menu/Chip nested-interactive (diagnóstico separado primeiro)

### Anchors triviais #2 + #3 + #5 aplicados (PR #62)

**Resultado:** -26 sites em ambos os temas (light 135→109, dark 130→104). EXCLUSIVO -17 cada lado, GÊMEO -9.

**#2 FormWizardPattern empty h2 (6 sites — caso (b) "provide title"):**

Diagnóstico revelou que NÃO era heading sometimes-empty — era **field name mismatch**. Stories passavam `label: "X"` em FormWizardStep, mas o tipo (`extends StepperStep`) requer `title: string`. TypeScript não pegou (strictness frouxa em stories). Component lê `step.title` = undefined → h2 renderiza vazio.

Fix: rename `label: "..."` → `title: "..."` em 15 step entries across 6 stories. Conditional render seria errado — esconderia o sintoma sem corrigir os dados.

Classificação: **STORY defect** (fixtures com field name wrong). Component está correto (espera title via type contract). TypeScript permissive em stories é issue separado out-of-scope.

**#3 landmark-unique variants (5 sigs → 9 instâncias) — STORY defect:**

Stories `Variants` renderizam 3 instâncias do componente lado-a-lado (default/elevated/bordered etc) pra demo de variantes. Cada instância tem mesmo landmark (header/nav/aside) com aria-label default igual → landmark-unique flag.

Fix: aria-label distinto por instância, descritivo da variante (Phase 7 / button-name doctrine — nome é a função, não contador):

- Header.Variants: `"Header — {default,elevated,bordered} variant"`
- Navigation.Variants: `"Navigation — {default,pills,tabs} variant"`
- SideNavbar.Variants: `"Sidebar — {default,compact,elevated} variant"`

Header/Navigation/SideNavbar primitives todos JÁ aceitam aria-label como prop (verificado no código antes de aplicar).

Classificação: **STORY defect** (variants demo renderiza múltiplas instâncias do mesmo landmark). Componentes corretos — fornecem aria-label default + permitem override.

**Header.WithDashboardLayout 1 site separado** — causa diferente: DashboardLayout sempre wrappa o `sidebar` prop em `<SideNavbar>`, mas a story passa `sidebar={<SideNavbar>...</SideNavbar>}`. Result: SideNavbar dentro de SideNavbar = 2 asides aninhados com mesmo aria-label. **Bug arquitetural de DashboardLayout (double-wrap)** — out-of-scope deste anchor. Registrar:

**Issue: DashboardLayout double-wrap do sidebar prop.** DashboardLayout.tsx:70-72 wrappa `{sidebar}` em `<SideNavbar>` sempre. Se consumer já passa SideNavbar como sidebar, resulta em nested. Fix proposto: detectar se sidebar JÁ é SideNavbar (children type check) e pular o wrapper, OU mudar API pra deixar claro que sidebar é "items dentro do SideNavbar", não SideNavbar completo. Outlier de 1 site, registrar pra reabrir quando tocar DashboardLayout.

**#5 Pagination select-name (14 sites) — COMPONENT defect:**

Todos os 14 sites são o MESMO Select — page-size selector em `TablePagination.tsx:116`. Confirmado por inspeção: TablePagination renderiza 1 Select; replicado por 7+ substories da story `TablePagination` + 4 em DataGrid + 2 em SearchAndFilterPattern... wait, SearchAndFilterPattern era raw `<select>`, contado em select-name geral mas não no Pagination cluster. Anyway, todos os 14 do Pagination cluster são page-size.

Fix: `aria-label="Items per page"` no `<Select>` dentro de TablePagination component. Função (não tipo), Phase 7 doctrine (como Stepper "Step 3: Shipping", não "button").

Classificação: **COMPONENT defect** — Pagination component renderiza Select sem accessible name. Single edit no component fecha todos os consumer sites.

**Gates:**

- vitest 816/816
- smoke 852/852 (TBD — re-rodando)
- typecheck clean
- lint 0 errors
- validate-dark-coverage OK

**Estado pós-triviais #2+#3+#5:**

- Light: 109 signatures
- Dark: 104 signatures
- Dark/light: 0.95×, convergindo
- Próximos anchors: #4 Slider aria-input-field-name (13, API change), #6 TimePicker/MultiSelect/Textarea label (9, API change), #7 Menu/Chip nested-interactive (23, diagnostic separado obrigatório)

**Outliers registrados pra reabrir:**

- DashboardLayout double-wrap sidebar (1 site landmark-unique residual)
- TypeScript strictness em stories permitiu field name errado em FormWizardPattern (não-bloqueante, mas revela gap de validação)

### Anchor #4 aplicado (PR #63): Slider — label required + range bug B fix

**Resultado:** -15 sites em ambos os temas (light 109→94, dark 104→89). aria-input-field-name 16→3 (closed 13 of 13 Slider sites; 3 restantes = Autocomplete 2 + MultiSelect 1, fora deste anchor).

**Classificação CORRIGIDA pela análise:** 12 sites COMPONENT (primitive bug), 1 STORY (Default story sem label). Era 92% bug de produção, não "stories sem label".

**Bug B (PRODUCTION DEFECT):** `Slider.tsx:269` tinha `aria-label={variant === "range" ? undefined : label}`. Range variant DESCARTAVA o label mesmo quando consumer passava corretamente. **Todo range slider no DS estava sem accessible name pra AT**, independente do que o consumer fazia.

Descoberto via mapa de consumers do Slider que mostrou: 12 dos 13 axe violations vinham de 6 stories de range × 2 handles cada, NÃO de stories desleixadas. Era o primitive comendo o label corretamente passado pelo consumer.

**Fix (3 mudanças coordenadas no primitive + 2 stories + 6 testes):**

1. **API change — TS-required label** (`label: string` sem `?`):
   - Zero production consumers de Slider em outros componentes (`grep '<Slider' src/ui/**/*.tsx`: só Slider.test.tsx + Slider.stories.tsx)
   - Blast radius mínimo: 1 story (Default) + 6 tests (sem label) precisam atualizar no mesmo PR
   - Garante zero-Slider-sem-nome forward
   - Compile-time check, sem runtime throw (over-engineering pra mono-brand solo)

2. **Single variant — aria-labelledby (não aria-label):**
   - Visible `<label id={labelId}>` renderiza sempre (label required)
   - Slider div: `aria-labelledby={labelId}` (era aria-label={label})
   - Fonte-única: label visível serve sighted + AT users
   - Sincroniza: mudar `label` propaga pra accessible name automaticamente

3. **Range variant — aria-labelledby com TWO ids (fonte-única + qualificador):**
   - Decisão tomada conscientemente: composite aria-label estava simples mas DESsincroniza (string solta duplicando o label). Para um PRIMITIVE que TODO consumer vai usar, fonte-única importa: alguém muda o label → nome acessível propaga.
   - Implementação: 2 sr-only spans (`id={minQualifierId}`/`id={maxQualifierId}` com text "minimum"/"maximum")
   - Min handle: `aria-labelledby="${labelId} ${minQualifierId}"` → AT lê "Price range minimum"
   - Max handle: `aria-labelledby="${labelId} ${maxQualifierId}"` → AT lê "Price range maximum"
   - User de AT no range slider sabe qual handle está ajustando

4. **Stories Default + Range:** adicionado label="Volume" e label="Price range" (canonical exemplos de domínio real, não "Slider" / "Basic"). Outras 3 stories que pareciam sem label (WithLabel/WithMarks/WithSteps) já tinham via `args.label`.

5. **Tests:** 6 sites sem label receberam label="Test slider" (genérico OK pra tests — testam comportamento, não semântica).

**Gates:**

- vitest: 816/816 (Slider 7/7 incluso)
- typecheck: clean (TS-required validou)
- lint: 0 errors
- build: clean

**Lição registrada:** O mapa de consumers ANTES do fix mudou a análise. Inicial: "5 stories desleixadas precisam label". Real: "1 story sem label + 12 nodes vêm de bug primitive descartando label correto". Sem o mapa eu teria proposto faxina de stories enquanto o primitive continuaria comendo labels silenciosamente. **Mapa de consumers precede mudança de API; classificação honesta precede fix.**

**Próximo anchor:** #6 TimePicker/MultiSelect/Textarea label (9 sites, API change). Mesmo padrão de levantamento prévio — mapa de consumers antes de propor required.
