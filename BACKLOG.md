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
