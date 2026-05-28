# Phase 7 — Candidates do escaneamento da Phase 9

**Origem:** Phase 9, PASSO 5 (auditoria dos 56 consumidores do shim).
**Propósito:** Lista de call sites do shim que NÃO foram migrados em
Phase 9 porque exigem decisão semântica contextual (caracteriza Phase 7
— "papel, não valor"). Este arquivo é o ponto de partida da triagem
Phase 7; cada linha aqui é um candidato pra mudar de `getColorClass("neutral", …, …)`
pra uma classe Tailwind semântica (`text-fg-*`, `bg-surface-*`,
`border-line-*`, `hover:bg-surface-*`).

**130 call sites em ~40 arquivos.** Todos usam o role `"neutral"` do
shim — semanticamente ambíguo (pode ser texto secundário, background
muted, borda default, etc., conforme contexto).

## Como usar

1. Phase 7 começa pelo padrão de maior count (text-fg-secondary do
   "neutral DEFAULT text" — 35 sítios).
2. Cada sítio é validado: a sugestão semântica preserva o intent
   visual? Ou outra classe semântica encaixa melhor pro contexto?
3. Mudança feita em commit por componente coeso (ou por cluster
   relacionado).
4. Após migrar todos os 130, este arquivo vira deletado e Phase 7
   fecha.

## Convenção de sugestões

| Shade no shim | Cor crua | Sugestão semântica (fg/text) | Sugestão semântica (bg) | Sugestão semântica (border) |
| ------------- | -------- | ---------------------------- | ----------------------- | --------------------------- |
| `light`       | gray-100 | `text-fg-tertiary`           | `bg-surface-muted`      | `border-line-muted`         |
| `DEFAULT`     | gray-500 | `text-fg-secondary`          | `bg-surface-emphasis`   | `border-line-default`       |
| `dark`        | gray-700 | `text-fg-primary`            | `bg-surface-inverse`    | `border-line-strong`        |
| `darker`      | gray-900 | `text-fg-primary`            | n/a                     | n/a                         |
| `contrast`    | white    | `text-fg-inverse`            | n/a                     | n/a                         |

Confiança **alta**: shade tem mapeamento óbvio (ex.: `dark text` →
`text-fg-primary`).
Confiança **média**: shade pode mapear pra 2-3 alternativas conforme
contexto (ex.: `DEFAULT text` pode ser `text-fg-secondary` ou
`text-fg-tertiary`).

## Pattern 1 — `getColorClass("neutral", "DEFAULT", "text")` (35 sites)

**Sugestão default:** `text-fg-secondary`. **Confiança:** média
(alternativa: `text-fg-tertiary` se o contexto for legenda/auxiliar).

| Arquivo                                                      | Linha |
| ------------------------------------------------------------ | ----- |
| `primitives/Input/Input.tsx`                                 | 40    |
| `primitives/Input/Input.tsx`                                 | 374   |
| `primitives/Input/Input.tsx`                                 | 422   |
| `primitives/Radio/Radio.tsx`                                 | 143   |
| `primitives/Checkbox/Checkbox.tsx`                           | 182   |
| `primitives/Select/Select.tsx`                               | 38    |
| `primitives/Slider/Slider.tsx`                               | 252   |
| `primitives/Slider/Slider.tsx`                               | 352   |
| `primitives/Spinner/Spinner.tsx`                             | 43    |
| `primitives/Spinner/Spinner.tsx`                             | 76    |
| `primitives/Switch/Switch.tsx`                               | 215   |
| `primitives/Badge/Badge.tsx`                                 | 200   |
| `primitives/Progress/Progress.tsx`                           | 142   |
| `components/Accordion/Accordion.tsx`                         | 145   |
| `components/Breadcrumb/Breadcrumb.tsx`                       | 69    |
| `components/Breadcrumb/Breadcrumb.tsx`                       | 99    |
| `components/Breadcrumb/Breadcrumb.tsx`                       | 107   |
| `components/CommandPalette/CommandPalette.tsx`               | 234   |
| `components/CommandPalette/CommandPalette.tsx`               | 278   |
| `components/CommandPalette/CommandPalette.tsx`               | 293   |
| `components/CommandPalette/CommandPalette.tsx`               | 333   |
| `components/Dropdown/Dropdown.tsx`                           | 304   |
| `components/EmptyState/EmptyState.tsx`                       | 93    |
| `components/FileUpload/FileUpload.tsx`                       | 213   |
| `components/FileUpload/FileUpload.tsx`                       | 278   |
| `components/FileUpload/FileUpload.tsx`                       | 297   |
| `components/FileUpload/FileUpload.tsx`                       | 308   |
| `components/FileUpload/FileUpload.tsx`                       | 352   |
| `components/FileUpload/FileUpload.tsx`                       | 371   |
| `components/Menu/MenuItem.tsx`                               | 104   |
| `components/Pagination/Pagination.tsx`                       | 140   |
| `components/Rating/Rating.tsx`                               | 189   |
| `components/SideNavbar/components/Sidebar/SidebarHeader.tsx` | 75    |
| `components/SideNavbar/components/SideNavbarGroup.tsx`       | 173   |
| `components/Toast/Toast.tsx`                                 | 141   |

## Pattern 2 — `getColorClass("neutral", "dark", "text")` (30 sites)

**Sugestão default:** `text-fg-primary` (slate-900 é o texto principal).
**Confiança:** alta.

| Arquivo                                                      | Linha |
| ------------------------------------------------------------ | ----- |
| `primitives/Avatar/Avatar.tsx`                               | 96    |
| `primitives/Badge/Badge.tsx`                                 | 135   |
| `primitives/Button/Button.tsx`                               | 85    |
| `primitives/Button/Button.tsx`                               | 91    |
| `primitives/Button/Button.tsx`                               | 97    |
| `primitives/Chip/Chip.tsx`                                   | 54    |
| `primitives/Chip/Chip.tsx`                                   | 60    |
| `primitives/Label/Label.tsx`                                 | 41    |
| `primitives/NavLink/NavLink.tsx`                             | 49    |
| `primitives/NavLink/NavLink.tsx`                             | 55    |
| `primitives/NavLink/NavLink.tsx`                             | 64    |
| `primitives/Progress/Progress.tsx`                           | 132   |
| `primitives/Slider/Slider.tsx`                               | 243   |
| `primitives/Switch/Switch.tsx`                               | 200   |
| `primitives/Text/Text.tsx`                                   | 114   |
| `primitives/Text/Text.tsx`                                   | 117   |
| `components/Accordion/Accordion.tsx`                         | 101   |
| `components/Breadcrumb/Breadcrumb.tsx`                       | 79    |
| `components/Dropdown/Dropdown.tsx`                           | 318   |
| `components/EmptyState/EmptyState.tsx`                       | 82    |
| `components/FileUpload/FileUpload.tsx`                       | 202   |
| `components/FileUpload/FileUpload.tsx`                       | 286   |
| `components/FileUpload/FileUpload.tsx`                       | 362   |
| `components/Form/FormField.tsx`                              | 99    |
| `components/Menu/MenuItem.tsx`                               | 89    |
| `components/Pagination/Pagination.tsx`                       | 178   |
| `components/Popover/Popover.tsx`                             | 267   |
| `components/SideNavbar/components/Sidebar/SidebarHeader.tsx` | 63    |
| `components/SideNavbar/components/SideNavbarGroup.tsx`       | 148   |
| `components/Toast/Toast.tsx`                                 | 135   |

## Pattern 3 — `getColorClass("neutral", "DEFAULT", "border")` (26 sites)

**Sugestão default:** `border-line-default`. **Confiança:** alta.

| Arquivo                                                      | Linha |
| ------------------------------------------------------------ | ----- |
| `primitives/Badge/Badge.tsx`                                 | 136   |
| `primitives/Badge/Badge.tsx`                                 | 199   |
| `primitives/Button/Button.tsx`                               | 83    |
| `primitives/Checkbox/Checkbox.tsx`                           | 100   |
| `primitives/Chip/Chip.tsx`                                   | 56    |
| `primitives/Chip/Chip.tsx`                                   | 62    |
| `primitives/Input/Input.tsx`                                 | 215   |
| `primitives/Input/Input.tsx`                                 | 220   |
| `primitives/Radio/Radio.tsx`                                 | 91    |
| `primitives/Select/Select.tsx`                               | 204   |
| `primitives/Separator/Separator.tsx`                         | 39    |
| `primitives/Textarea/Textarea.tsx`                           | 80    |
| `components/Accordion/Accordion.tsx`                         | 86    |
| `components/Card/Card.tsx`                                   | 47    |
| `components/Drawer/DrawerContent.tsx`                        | 122   |
| `components/Drawer/DrawerFooter.tsx`                         | 34    |
| `components/Drawer/DrawerHeader.tsx`                         | 33    |
| `components/FileUpload/FileUpload.tsx`                       | 233   |
| `components/FileUpload/FileUpload.tsx`                       | 329   |
| `components/Menu/MenuContent.tsx`                            | 177   |
| `components/MultiSelect/MultiSelect.tsx`                     | 264   |
| `components/Popover/Popover.tsx`                             | 240   |
| `components/Popover/Popover.tsx`                             | 262   |
| `components/SideNavbar/components/Sidebar/SidebarFooter.tsx` | 48    |
| `components/SideNavbar/components/Sidebar/SidebarHeader.tsx` | 50    |
| `components/SideNavbar/components/SideNavbarGroup.tsx`       | 121   |

## Pattern 4 — `getColorClass("neutral", "light", "bg")` (14 sites)

**Sugestão default:** `bg-surface-muted`. **Confiança:** média
(alternativa: `bg-surface-subtle` se for fundo decorativo mais pálido,
ou `bg-surface-hover` se for estado hover ambíguo no source).

| Arquivo                                | Linha |
| -------------------------------------- | ----- |
| `primitives/Avatar/Avatar.tsx`         | 95    |
| `primitives/Badge/Badge.tsx`           | 134   |
| `primitives/Chip/Chip.tsx`             | 53    |
| `primitives/Input/Input.tsx`           | 224   |
| `primitives/Progress/Progress.tsx`     | 61    |
| `primitives/Progress/Progress.tsx`     | 62    |
| `primitives/Skeleton/Skeleton.tsx`     | 37    |
| `primitives/Slider/Slider.tsx`         | 264   |
| `primitives/Switch/Switch.tsx`         | 107   |
| `components/Dropdown/Dropdown.tsx`     | 279   |
| `components/FileUpload/FileUpload.tsx` | 333   |
| `components/LoginBox/LoginBox.tsx`     | 21    |
| `components/Menu/MenuSeparator.tsx`    | 28    |
| `components/Tabs/TabsList.tsx`         | 104   |

## Pattern 5 — `getHoverColorClass("neutral", "light", "bg")` (7 sites)

**Sugestão default:** `hover:bg-surface-hover`. **Confiança:** alta.

| Arquivo                              | Linha |
| ------------------------------------ | ----- |
| `primitives/Button/Button.tsx`       | 86    |
| `primitives/Button/Button.tsx`       | 92    |
| `primitives/Button/Button.tsx`       | 98    |
| `primitives/NavLink/NavLink.tsx`     | 65    |
| `components/Accordion/Accordion.tsx` | 103   |
| `components/Dropdown/Dropdown.tsx`   | 319   |
| `components/Menu/MenuItem.tsx`       | 92    |

## Pattern 6 — `getFocusRingClass("neutral", "DEFAULT")` (3 sites)

**Sugestão default:** `focus:ring-line-default`. **Confiança:** média
(alternativa: `focus:ring-line-focus` se a intenção for ring de foco
brand, não neutral).

| Arquivo                        | Linha |
| ------------------------------ | ----- |
| `primitives/Button/Button.tsx` | 87    |
| `primitives/Button/Button.tsx` | 93    |
| `primitives/Button/Button.tsx` | 99    |

## Padrões raros (1-2 sites cada)

**`getColorClass("neutral", "DEFAULT", "bg")` (2 sites):**
Sugestão: `bg-surface-emphasis`. Confiança: média.

- `primitives/Slider/Slider.tsx:300`
- `primitives/Tooltip/Tooltip.tsx` (não localizado no grep, verificar)

**`getColorClass("neutral", "light", "text")` (2 sites):**
Sugestão: `text-fg-tertiary` ou `text-fg-quaternary`. Confiança: média.

- (file:line a confirmar no grep)

**`getColorClass("neutral", "light", "border")` (1 site):**
Sugestão: `border-line-muted` ou `border-line-subtle`. Confiança: média.

**`getColorClass("neutral", "darker", "text")` (1 site):**
Sugestão: `text-fg-primary`. Confiança: alta.

**`getColorClass("neutral", "dark", "border")` (1 site):**
Sugestão: `border-line-strong`. Confiança: alta.

**`getColorClass("neutral", "dark", "bg")` (1 site):**
Sugestão: `bg-surface-inverse`. Confiança: alta.

- `primitives/Tooltip/Tooltip.tsx:156` — tooltip surface = dark inverse.

**`getColorClass("neutral", "contrast", "text")` (1 site):**
Sugestão: `text-fg-inverse`. Confiança: alta.

- `primitives/Tooltip/Tooltip.tsx:155` — tooltip text on dark surface.

**`getHoverColorClass("neutral", "DEFAULT", "border")` (1):**
Sugestão: `hover:border-line-emphasis`. Confiança: média.

- `components/Breadcrumb/Breadcrumb.tsx:100`

**`getHoverColorClass("neutral", "DEFAULT", "bg")` (1):**
Sugestão: `hover:bg-surface-active`. Confiança: média.

- `components/Tabs/TabsTrigger.tsx:124`

**`getHoverColorClass("neutral", "dark", "text")` (1):**
Sugestão: `hover:text-fg-primary`. Confiança: alta.

- `components/Breadcrumb/Breadcrumb.tsx:101`

**`getHoverColorClass("neutral", "dark", "border")` (1):**
Sugestão: `hover:border-line-strong`. Confiança: alta.

- `components/FileUpload/FileUpload.tsx:243`

**`getFocusColorClass("neutral", "light", "bg")` (2):**
Sugestão: `focus:bg-surface-hover`. Confiança: média.

- `components/Dropdown/Dropdown.tsx:320`
- `components/Menu/MenuItem.tsx:93`

## Total

130 sítios em ~40 arquivos. Distribuição:

- Text-related: 67 sites (35 + 30 + 2)
- Border-related: 28 sites (26 + 1 + 1)
- Bg-related: 17 sites (14 + 2 + 1)
- Hover: 11 sites
- Focus + Ring: 5 sites

## Notas pra Phase 7

1. **Color shift sutil de gray pra slate.** O shim resolve `neutral` em
   escala `gray-*`. A vocabulary semântica usa `slate-*`. Cores
   próximas mas distintas — `gray-500` vs `slate-600`, `gray-100` vs
   `slate-100`. Verificar visualmente que a substituição preserva a
   identidade do componente.
2. **`Text.tsx:114` e `Text.tsx:117`** já foram migrados em Phase 9
   (via lookup table do componente Text — ver migração de categoria c).
   Esses dois sítios provavelmente sumiram ou foram absorvidos.
   Verificar antes de incluir no checklist Phase 7.
3. **`Tooltip.tsx:155` e `Tooltip.tsx:156`** podem ser migrados agora
   se há clareza sobre o intent (tooltip = surface inverse). Phase 9
   poderia ter tratado, mas ficou aqui pra consistência da decisão.
4. **`Spinner.tsx:43`** — key `neutral` dentro de uma lookup table.
   Verificar se a key é dinâmica (variant prop) ou estática.
