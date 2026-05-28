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
