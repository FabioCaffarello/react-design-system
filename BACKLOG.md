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

## Migrar 5 legacy MDX standalone → attached Meta

**Descoberto em:** Phase 13b1 (investigação do estado atual MDX).
**Estado:** 5 arquivos `.mdx` componentes legacy usam
`<Meta title="Components/X" />` (standalone form, cria leaf separado
no sidebar) em vez do `<Meta of={ComponentStories} />` recomendado
em Storybook 10 (attached form, funde com a entry das stories):

- `src/ui/components/Form/Form.mdx`
- `src/ui/components/DatePicker/DatePicker.mdx`
- `src/ui/components/Dialog/Dialog.mdx`
- `src/ui/components/Table/Table.mdx`
- `src/ui/components/Table/TableProvider.mdx`

**Por que importa:** Phase 13b1 estabeleceu o padrão attached pra
componentes novos (Modal, Button). Os 5 legacy ficam em forma
divergente até serem migrados, gerando duas convenções coexistentes
no repo. A migração é mecânica (trocar `title="…"` por
`of={XStories}` + adicionar `import * as XStories from "./X.stories"`)
mas exige cuidado com ordem (cada arquivo tem suas próprias seções
que podem precisar ajuste pra não duplicar Title/Anatomy/Examples
que o attached form gerencia).
**Ação:** Phase 13b2 candidate. Sequência sugerida: migrar
mecanicamente os 5 → validar storybook build verde → revisar se
alguma seção do MDX legacy duplica algo que o attached form já
expõe (description em meta.parameters.docs.description, story list
auto) → cortar duplicação se houver. `.prettierignore` (Phase 13b1
Commit 1) garante que prettier não destrói os arquivos durante
edição.

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

## Inverter grep de verificação em `stories.md` (denylist → allowlist)

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

**Descoberto em:** Phase C PR2, Passo 1 (baseline run de 852 stories) + Passo 2 (re-medição com noise rules silenciadas).
**Estado:** `a11y.test` segue em `"todo"` em `.storybook/preview.tsx`. Três regras page-level (`region`, `landmark-one-main`, `page-has-heading-one`) silenciadas globalmente — instrumento aplica regra de página em iframe de componente, gerando 78% de ruído (2.806 nodes / ~492 stories were noise-only). Reativadas só em `DashboardLayout` (única que monta `<header>` + `<main>` + `<footer>`). Política documentada em `docs/ACCESSIBILITY.md` seção "Story-iframe exceptions".

**Baseline real após silenciamento:** 802 nodes em 353 stories. Distribuição por impact:

| Impact   | Nodes |
| -------- | ----: |
| critical |   221 |
| serious  |   546 |
| moderate |    29 |
| minor    |     6 |

**Por que importa:** virar `a11y.test: "error"` (meta no fim do funil) só é seguro depois de zerar critical e serious. Sem o silenciamento das 3 page-level rules, "error" bloqueava CI em 842/852 stories no primeiro push por falso-positivo de instrumento — viraria allowlist de exceção em massa (dívida carimbada de "resolvido", anti-padrão explícito da rule Phase 7).

**Backlog agrupado por causa-raiz, não por regra:**

### Family A — "Controle sem nome acessível" (146 nodes, ~57 stories)

- `button-name` 92n/24s — **38n concentrados em SideNavbar** (icon-only menu buttons sem `aria-label`). Single anchor fix em SideNavbar pode derrubar 40%+ da família. Top: `components/sidenavbar/{variants,with-bottom-navigation,with-header,with-footer,with-header-and-footer}`.
- `select-name` 25n/22s — espalhado: SearchAndFilterPattern (2), DataGrid pagination (2). Pequenos `<select>` sem label associado.
- `aria-input-field-name` 18n/10s — **12n em Slider** (range handles dos sliders).
- `label` 11n/10s — espalhado (SideNavbar 2, Textarea 2, MultiSelect 2).
- `aria-command-name` 1n/1s — outlier.
- `aria-dialog-name` 3n/3s — Dialog sem accessible name.

**Anchor sugerido:** atacar SideNavbar primeiro (densidade mais alta + cluster claro). Validar se o padrão é `<button>` com só ícone Lucide — fix é `aria-label` no botão ou conversão para `<button aria-label="X"><Icon aria-hidden /></button>`.

### Family B — "ARIA inválido" (124 nodes, ~24 stories)

- `aria-allowed-attr` 62n em **APENAS 2 stories** — `components/datepicker/{open-state,with-events}` com 31 nodes cada (mesmo code path). Single fix em DatePicker fecha 62 nodes (28% da família crítica).
- `aria-valid-attr-value` 21n/19s — top: SideNavbar (3), DashboardLayout (1 cada em ~5 stories).
- `aria-hidden-focus` 17n/12s — **10n em Switch** (input `aria-hidden` mas focável; provável padrão de checkbox custom).
- `aria-prohibited-attr` 15n em **APENAS 2 stories** — `components/rating/{read-only,read-only-state}`. Rating em read-only mode está usando atributo não permitido para o role.
- `aria-required-parent` 4n/4s; `aria-required-children` 3n/3s; `aria-required-attr` 2n/1s — outliers individuais.

**Anchor sugerido:** DatePicker primeiro (62 nodes / 1 fix) → Rating read-only (15 / 1 fix) → Switch (10 / 1 fix). Esses 3 anchors fecham 87 dos 124 nodes da família.

### Family C — "Contraste de cor abaixo de WCAG 2.1 AA 4.5:1" (464 nodes, 274 stories)

- `color-contrast` (serious) — cross-cuta o catálogo inteiro. Top concentração: Table full-featured (17), Table declarative-api (17), Timeline many-items (11), Badge accessibility (8), Badge variants (6).
- **Cruza com `.claude/rules/colors.md` e `PHASE_7_SEMANTIC_COLORS.md`.** Provável raiz: punhado de combinações token-on-token abaixo de 4.5:1. Candidatos a investigar (inspecionar `sampleTargets` em `/tmp/a11y-baseline-report.json`):
  - `text-fg-tertiary` ou `text-fg-quaternary` sobre `bg-surface-base` / `bg-surface-subtle`.
  - `text-fg-secondary` sobre `bg-surface-muted`.
  - Foreground brand sobre surface brand-subtle.
- **Anchor sugerido:** abrir 3 stories de hotspot (`components/table/full-featured`, `primitives/badge/accessibility`, `components/timeline/many-items`), extrair os 30+ `sampleTargets` de cor, identificar 3-5 pares (text token, bg token) que falham, decidir caso-a-caso: subir contraste do token semântico (afeta todo o sistema), ou re-mapear o consumo desses componentes para tokens existentes que passam. Um fix de token pode fechar centenas de nodes — escala invertida do esforço.

### Family D — "Landmark estrutural mal posicionado" (52 nodes, ~37 stories)

- `landmark-complementary-is-top-level` 22n/20s — **SideNavbar** lidera: `<aside>` nested em outro landmark. Provável: stories de SideNavbar embrulham em outro `<aside>` ou em `<main>` para demo. Pode ser fix de story, não de componente.
- `nested-interactive` 25n/18s — `components/menu` (4 nodes em placements) e `primitives/chip` (3 em clickable-and-removable) lideram. Chip com clickable + removable tem `<button>` dentro de `<button>` — fix arquitetural na anatomia do Chip.
- `landmark-unique` 5n/4s; `landmark-no-duplicate-banner` 1n/1s — outliers.

### Family E — "Outliers minor/serious isolados" (8 nodes)

- `empty-heading` 6n/6s (minor) — cleanup.
- `listitem` 2n/2s (serious) — `<li>` fora de `<ul>`/`<ol>`; check stories que renderizam `<li>` solto para layout.

**Política de fechamento:**

1. NÃO criar `parameters.a11y.allowConsoleErrors`-like allowlist temporária — vira dívida carimbada de "resolvido" (anti-padrão explícito).
2. Atacar por anchor: o fix de 1 componente fecha N stories. Ordem sugerida por relação esforço/impacto: DatePicker (62/1 fix) → SideNavbar buttons (38+/1 cluster fix) → Rating read-only (15/1 fix) → color-contrast tokens (centenas/3-5 token fixes) → Switch (10/1 fix) → Slider (12/1 cluster fix).
3. Cada anchor vira uma sub-phase própria. Re-rodar baseline após cada fix para confirmar que a aritmética bate (e que o fix não regrediu outra família).
4. Quando critical+serious = 0, virar `a11y.test: "error"` em `.storybook/preview.tsx`. Não antes.

**Caveat de medição:** 2 stories (`components/form--with-events`, `components/toast--clear-all`) ainda batem em race condition do axe-core no baseline paralelo (instrumento, não código). Rerun em serial bateu 0 nodes em Form e ~3 color-contrast em Toast (subset dos 464 acima). Para refresh futuro, rodar baseline com workers=1 OU criar `BrowserContext` por story.
