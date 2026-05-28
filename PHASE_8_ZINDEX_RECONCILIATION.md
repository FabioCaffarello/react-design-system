# Fase 8 — Reconciliação do sistema de z-index

**Status:** planejada, adiada para depois do cleanup pós-prune.
**Origem:** descoberta no #3b durante a investigação do `z-[100]` do
`SideNavbarToggle` (item B1 do plano).

## Problema

O repo carrega **dois sistemas de z-index disjuntos convivendo no mesmo
código de componente**. Ambos cobrem o mesmo eixo (camadas de empilhamento)
mas com vocabulários e valores incompatíveis.

### Sistema A — Tokens semânticos

Definidos em `src/ui/tokens/z-index.ts`, consumidos via
`getZIndexClass(layer)`. Layers e valores:

| Layer            | Valor |
| ---------------- | ----: |
| `base`           |     0 |
| `dropdown`       |  1000 |
| `sticky`         |  1020 |
| `fixed`          |  1030 |
| `modal-backdrop` |  1040 |
| `modal`          |  1050 |
| `popover`        |  1060 |
| `tooltip`        |  1070 |
| `toast`          |  1080 |

Adotado por: `Drawer/DrawerContent`, `CommandPalette`, `Menu/MenuContent`,
`Popover`, `Autocomplete/AutocompleteList`.

### Sistema B — Tailwind cru

Classes Tailwind diretas, sem ancorar nos tokens. Valores observados:

| Classe    | Valor | Onde                                                                                           |
| --------- | ----: | ---------------------------------------------------------------------------------------------- |
| `z-0`     |     0 | NavbarItem                                                                                     |
| `z-10`    |    10 | Dropdown, NavbarItem, SideNavbarResizeHandle, SideNavbarToggle (não-floating), TableHeader     |
| `z-20`    |    20 | Dropdown                                                                                       |
| `z-40`    |    40 | SideNavbarBackdrop                                                                             |
| `z-50`    |    50 | **Modal, Dialog, Tooltip, Toast, ToastContainer, Header (sticky), DatePicker, SideNavbarRoot** |
| `z-[100]` |   100 | SideNavbarToggle (variante `floating`)                                                         |

## Consequência pré-existente

Modal e Dialog estão em `z-50` (Sistema B), mas o token semântico `modal`
vale 1050 (Sistema A). O SideNavbarToggle 'floating' em `z-[100]` fica
**acima de modais, tooltips e toasts** (todos em 50) — provavelmente é
um bug latente. Uma `Tooltip` aberta sobre o Toggle não cobre o Toggle
hoje porque o Toggle está numa camada mais alta.

A intenção arquitetural existente em `z-index.ts` (modais em 1050,
tooltips em 1070, toasts em 1080) **não é refletida no código de
componente** — os componentes consumidores nunca migraram pros tokens
semânticos.

## Por que não cabe no #3b

Tocar `z-[100]` do Toggle isoladamente — qualquer que seja a layer
escolhida — reforça a arquitetura quebrada em vez de corrigir. Opções
consideradas e descartadas durante #3b:

- `z-fixed (1030)` — toggle vai pra 1030, ainda **acima** dos elementos
  em z-50 (Modal, Tooltip, Header sticky). O bug não some, agora com
  um número 21x maior.
- `z-dropdown (1000)` — mesmo problema, salto maior.
- Token de componente em `tokens/sidebar.ts` — codifica a layer mágica
  do dual-system. Encrustra a patologia.
- Manter `z-[100]` — preserva o status quo, mas o número fica como
  "magic number" não-justificado pelos tokens.

Migração coerente exige primeiro **reconciliar os dois sistemas**.

## Escopo da fase

Migrar todos os consumidores raw `z-*` para tokens semânticos. Pares
óbvios:

| Hoje (raw)    | Componente             | Token semântico              |
| ------------- | ---------------------- | ---------------------------- |
| `z-50`        | Modal.tsx              | `modal` (1050)               |
| `z-50`        | Dialog/DialogContent   | `modal` (1050)               |
| `z-50`        | Tooltip.tsx            | `tooltip` (1070)             |
| `z-50`        | Toast/ToastContainer   | `toast` (1080)               |
| `z-50`        | Header.tsx (sticky)    | `sticky` (1020)              |
| `z-50`        | DatePicker.tsx (popup) | `popover` (1060)             |
| `z-50`        | SideNavbarRoot         | `fixed` (1030)? confirmar    |
| `z-40`        | SideNavbarBackdrop     | `modal-backdrop` (1040)      |
| `z-20, z-10`  | Dropdown internals     | confirmar intent caso a caso |
| `z-10`        | TableHeader (sticky)   | `sticky` (1020)              |
| `z-10`, `z-0` | NavbarItem layers      | confirmar intent             |
| `z-[100]`     | SideNavbarToggle float | reanalisar após migração     |

Depois disso, o SideNavbarToggle floating volta à mesa — provavelmente
fica em `z-fixed (1030)`: acima de `sticky (1020)`, abaixo de
`modal-backdrop (1040)`. Mas só faz sentido como decisão **depois** da
reconciliação.

## Critério de pronto

- Zero ocorrências de `z-N` cru (`z-0`, `z-10`, `z-20`, `z-40`, `z-50`,
  `z-[100]`, etc.) em código de componente — exceto onde explicitamente
  justificado e documentado.
- Toda camada de empilhamento referencia um token semântico
  via `getZIndexClass(layer)`.
- Verificação via grep nos `.tsx` de `src/ui/` (excluindo `stories.tsx`
  e `test.tsx`): zero matches do padrão `\bz-(0|10|20|30|40|50|\[)`.

## Parente desta fase

Mesma família da **Fase 7** (cores semânticas existem como tokens, mas
componentes consomem `text-gray-500` cru). Mesma patologia, domínio
diferente: o design system **define** o sistema mas o código **não usa**.
A solução é a mesma — propagar consumo, fechar com lint rule pra
impedir regressão.
