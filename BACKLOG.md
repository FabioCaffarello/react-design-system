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

## Phase 10 — Tokens infrastructure cleanup

**Descoberto em:** Phase 7 closure (commit 100). Sanity check pré-
deleção do shim revelou 4 consumidores internos não inventariados.
**Estado:** o shim `src/ui/tokens/colors.ts` (~14k) **permanece** após
Phase 7 porque 4 arquivos dentro de `src/ui/tokens/` ainda dependem
dele. Phase 7 cumpriu seu escopo declarado (zero consumo em
`components/` e `primitives/`), mas a deleção física do shim foi
adiada porque os 4 consumidores são infraestrutura interna do
diretório de tokens, não vocabulário de componente.

**Os 4 consumidores e o trabalho previsto:**

1. **`tokens/gradients.ts`** — `GRADIENT_TOKENS` lê valores hex do
   shim (`COLOR_TOKENS_LIGHT.primary.light.hex`, etc.) para definir
   gradientes. **Decisão arquitetural pendente:** ou ler hex via
   `getComputedStyle` do CSS `@theme` em runtime (frágil — depende do
   DOM existir), ou redefinir gradientes diretamente via CSS custom
   properties em `@theme` (canônico, mas precisa repensar a API que
   `getGradientClass` expõe). Talvez gradientes virem CSS-first como
   o resto.
2. **`tokens/themes/light.ts`** (e provavelmente `dark.ts`) — definição
   programática de tema (`colors: COLOR_TOKENS_LIGHT`). Provavelmente
   legacy do sistema pré-Phase 9 (quando temas viviam em JS).
   **Investigar antes de refatorar:** pode estar literalmente morto
   (nenhum consumidor real) ou ainda em uso por API público de
   provider/factory. Se morto, deletar.
3. **`tokens/tokens.factory.ts`** — `TokensFactory` Pattern atrelado ao
   `ColorRole` antigo. Provavelmente desatualizado pós-Phase 9 (quando
   o vocabulário virou semântico via `@theme`). **Investigar se ainda
   é usado**, e por quem (Storybook? testes? código público?). Se
   morto, deletar; se vivo, repensar a API.
4. **`tokens/TokenVisualizations.tsx`** — demo da Color Palette no
   Storybook. **Trabalho mais isolado dos 4:** reescrever o componente
   pra ler do sistema novo (`getSemanticColor` + `getPrimitiveColor`
   em `tokens/colors/utils.ts`, e/ou enumerar diretamente os tokens
   semânticos do `@theme` para auto-doc). Provavelmente o mais
   simples — não tem ramificações externas.

**Critério de pronto da Phase 10:**

- 4 arquivos repointed para o sistema novo OU removidos se obsoletos.
- Shim `tokens/colors.ts` deletado fisicamente.
- Build verde + tests verdes.
- Storybook Color Palette renderiza com vocabulário novo.

**Estrutura sugerida:** pode ser quebrada em sub-fases por arquivo
(start pelo `TokenVisualizations.tsx` que é isolado, deixar
`gradients.ts` por último porque carrega decisão arquitetural), ou
tratada como batch único — decidir quando o trabalho começar.

**Razão de não fazer agora:** refatorar 4 arquivos não-triviais sob
deadline de closure da Phase 7 introduziria risco em infraestrutura
sensível (themes, factory) sem ganho proporcional. Phase 7 cumpriu o
que se propôs (vocabulário de componente 100% migrado); Phase 10 é a
limpeza honesta do que ficou.
