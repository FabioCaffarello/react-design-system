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

## Phase 9 — Color shim consolidation

**Descoberto em:** #4.
**Estado:** registrado como fase própria em
`PHASE_9_COLOR_SHIM_CONSOLIDATION.md`. `tokens/colors.ts` é um shim
legacy de 451 linhas que sombreia o sistema novo em `tokens/colors/`
via resolução de módulo do TS. Os 37 imports de `'tokens/colors'`
caem no shim, não no sistema novo, e `colors/utils.ts` é
efetivamente dead code.
**Por que está aqui:** ponteiro pro arquivo de fase pra manter
rastreável junto dos outros itens não-blockers.
**Dependência crítica:** Phase 9 **deve vir antes** da Phase 7. Se
Phase 7 rodar primeiro, ela vai escrever contra a API do shim
(currently live) e ter que ser refeita pós-consolidação. Detalhes
no doc da Phase 9.

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
