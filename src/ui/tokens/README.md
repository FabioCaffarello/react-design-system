# Design Tokens System

Este documento descreve o sistema de design tokens do `react-design-system`, que fornece valores centralizados e consistentes para cores, espaçamento, tipografia, sombras, bordas, raios e breakpoints.

## Visão Geral

O sistema de tokens utiliza o **Factory Pattern** para criar tokens de forma type-safe e consistente. Todos os tokens seguem uma estrutura padronizada e podem ser acessados através de helper functions.

## Estrutura de Tokens

### 1. Colors (`colors/` + `src/styles/semantic/`)

Sistema de cores semânticas pós-Phase 9. Tokens são definidos via
`@theme` em `src/styles/semantic/colors.css`, e o Tailwind v4 gera
classes nativas automaticamente. Cor é consumida **direto via classes
Tailwind**, não via getter JS.

**Vocabulário canônico** (use estas classes em JSX):

- **`bg-surface-*`** — superfícies de fundo, com hierarquia de elevação:
  `surface-canvas` (chão da página) → `surface-base` (formulário/
  conteúdo contido) → `surface-overlay` (modal/popover) →
  `surface-sunken` (afundado). Variantes: `surface-muted`,
  `surface-subtle`, `surface-emphasis`, `surface-strong`,
  `surface-active`, `surface-hover`, `surface-selected`,
  `surface-brand`, `surface-brand-muted`, `surface-inverse`, etc.
- **`text-fg-*`** — foreground (texto, ícones), com hierarquia:
  `fg-primary` → `fg-secondary` → `fg-tertiary` → `fg-quaternary`.
  Variantes: `fg-disabled`, `fg-placeholder`, `fg-inverse`, `fg-link`,
  `fg-brand`, `fg-brand-emphasis`, `fg-brand-secondary`,
  `fg-brand-secondary-emphasis`, `fg-success/warning/error/info`.
- **`border-line-*` / `bg-line-*`** — linhas visuais (divisores,
  separators, marks): `line-default`, `line-muted`, `line-subtle`,
  `line-emphasis`, `line-strong`, `line-inverse`, `line-focus`,
  `line-brand`, `line-secondary`.
- **Feedback**: `bg-success/warning/error/info` (+ `-bg`,
  `-bg-emphasis`, `-border`, `-border-emphasis`, `-light`, `-dark`).
- **Status indicators**: `bg-status-neutral` completa a família dos
  status (dots, online presence, status badges).
- **Scrim e tint** (theme-agnostic): `bg-scrim` (backdrop modal/drawer
  50% opacity), `bg-tint-hover` (hover translúcido 10% opacity).

**Uso:**

```tsx
// Cor consumida direto via classes Tailwind nativas em JSX
<div className="bg-surface-brand text-fg-inverse">Brand button</div>

// Foreground neutro com hierarquia
<p className="text-fg-secondary">Description text</p>

// Superfícies por nível de elevação
<div className="bg-surface-base">Form content</div>
<div className="bg-surface-overlay shadow-lg">Modal content</div>

// Linhas visuais
<hr className="border-line-default" />

// Feedback semântico
<div className="bg-error-bg text-fg-error">Error message</div>

// Status indicator
<span className="bg-status-neutral inline-block w-2 h-2 rounded-full" />
```

**Quando usar JS color helpers (`colors/utils.ts`):**

O sistema novo expõe helpers JS (`getColor`, `getSemanticColorClass`,
`withOpacity`, `blendColors`, `getContrastColor`, `lighten`,
`darken`) para **casos especializados**:

- Cores derivadas em runtime (cálculo de contraste WCAG).
- Composição de cores (overlay opacity, blend de tonalidades).
- Lógica que precisa do valor hex/RGB do token (gradiente dinâmico,
  conversão entre espaços de cor).

**NÃO use os helpers JS para consumo padrão de cor em componentes** —
classes Tailwind nativas são a API canônica.

**Estrutura interna:**

- `src/styles/semantic/colors.css` — definições `@theme` com light
  como default + variantes por role.
- `src/styles/themes/dark.css` — override completo via
  `[data-theme="dark"]` (e variantes minimal/tech/creative).
- `tokens/colors/` — helpers JS para casos especializados acima.

### 2. Spacing (`spacing.ts`)

Sistema de espaçamento baseado em unidades de 4px.

**Escala**: `xs` (4px), `sm` (8px), `md` (12px), `base` (16px), `lg` (24px), `xl` (32px), `2xl` (40px), `3xl` (48px), `4xl` (64px), `5xl` (80px), `6xl` (96px)

**Uso:**

```typescript
import { getSpacingClass, SPACING_TOKENS } from "./tokens/spacing";

// Obter classe Tailwind
const paddingClass = getSpacingClass("md", "p"); // 'p-3'
const marginClass = getSpacingClass("lg", "mx"); // 'mx-6'

// Acessar token diretamente
const mdSpacing = SPACING_TOKENS.md.px; // '12px'
```

### 3. Typography (`typography.ts`)

Sistema de tipografia com tamanhos, pesos e line heights.

**Tamanhos**: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`

**Pesos**: `light`, `normal`, `medium`, `semibold`, `bold`

**Line Heights**: `none`, `tight`, `snug`, `normal`, `relaxed`, `loose`

**Uso:**

```typescript
import { getTypographyClasses, TYPOGRAPHY_TOKENS } from "./tokens/typography";

// Obter classes completas
const headingClasses = getTypographyClasses("h1"); // 'text-4xl leading-tight font-bold'

// Acessar token diretamente
const h1Size = TYPOGRAPHY_TOKENS.h1.fontSize.px; // '36px'
```

### 4. Shadows (`shadows.ts`)

Sistema de sombras para elevação e profundidade.

**Tamanhos**: `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`

**Uso:**

```typescript
import { getShadowClass, SHADOW_TOKENS } from "./tokens/shadows";

// Obter classe Tailwind
const shadowClass = getShadowClass("lg"); // 'shadow-lg'

// Acessar token diretamente
const lgShadow = SHADOW_TOKENS.lg.value; // '0 4px 6px -1px rgb(0 0 0 / 0.1)...'
```

### 5. Radius (`radius.ts`)

Sistema de border radius para cantos arredondados.

**Tamanhos**: `none`, `sm` (2px), `md` (6px), `lg` (8px), `xl` (12px), `2xl` (16px), `3xl` (24px), `full`

**Uso:**

```typescript
import { getRadiusClass, RADIUS_TOKENS } from "./tokens/radius";

// Obter classe Tailwind
const radiusClass = getRadiusClass("lg"); // 'rounded-lg'

// Acessar token diretamente
const lgRadius = RADIUS_TOKENS.lg.px; // '8px'
```

### 6. Borders (`borders.ts`)

Sistema de bordas para larguras e estilos.

**Larguras**: `none`, `thin` (1px), `base` (1px), `medium` (2px), `thick` (4px)

**Estilos**: `solid`, `dashed`, `dotted`

**Uso:**

```typescript
import {
  getBorderWidthClass,
  getBorderStyleClass,
  getBorderClasses,
  BORDER_TOKENS,
} from "./tokens/borders";

// Obter classes
const widthClass = getBorderWidthClass("base"); // 'border'
const styleClass = getBorderStyleClass("solid"); // 'border-solid'
const fullBorder = getBorderClasses("base", "solid"); // 'border border-solid'

// Acessar token diretamente
const baseBorder = BORDER_TOKENS.base.width.px; // '1px'
```

### 7. Breakpoints (`breakpoints.ts`)

Sistema de breakpoints responsivos.

**Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)

**Uso:**

```typescript
import { BREAKPOINT_TOKENS } from "./tokens/breakpoints";

// Acessar breakpoint
const mdBreakpoint = BREAKPOINT_TOKENS.md.value; // 768
```

## Tokens Factory

O `TokensFactory` fornece uma interface unificada para criar todos os tipos de tokens:

```typescript
import { TokensFactory } from "./tokens/tokens.factory";

const factory = new TokensFactory("light");
const tokenSet = factory.createTokenSet();

// Acessar todos os tokens
const spacing = tokenSet.spacing;
const colors = tokenSet.colors;
const shadows = tokenSet.shadows;
```

## Padrões de Uso

### ✅ Usar Tokens

```tsx
import { getSpacingClass } from "./tokens/spacing";
import { getRadiusClass } from "./tokens/radius";
import { getShadowClass } from "./tokens/shadows";

// Cor via classes Tailwind nativas (geradas a partir de @theme).
// Spacing/Radius/Shadows ainda via getter JS (escala fina, multi-axis).
const className = cn(
  "bg-surface-brand",
  "text-fg-inverse",
  getSpacingClass("md", "p"),
  getRadiusClass("lg"),
  getShadowClass("md"),
);
```

### ❌ Evitar Classes Hardcoded Tailwind

```tsx
// ❌ Evitar — bypass do vocabulário semântico
const className = "bg-indigo-500 text-white p-3 rounded-lg shadow-md";

// ✅ Preferir — classes semânticas + helpers
const className = cn(
  "bg-surface-brand",
  "text-fg-inverse",
  getSpacingClass("md", "p"),
  getRadiusClass("lg"),
  getShadowClass("md"),
);
```

## Migração de Classes Hardcoded

Ao refatorar componentes, substitua classes hardcoded por o vocabulário
semântico:

1. **Cores de superfície**: `bg-white` → `bg-surface-base` (form
   contido) / `bg-surface-overlay` (modal/popover); `bg-gray-50` →
   `bg-surface-subtle`; `bg-gray-100` → `bg-surface-muted`.
2. **Cores de texto**: `text-gray-900` → `text-fg-primary`;
   `text-gray-600` → `text-fg-secondary`; `text-gray-500` →
   `text-fg-tertiary`; `text-white` (em fundo colorido) →
   `text-fg-inverse`.
3. **Bordas/divisores**: `border-gray-200` → `border-line-default`;
   `border-gray-300` → `border-line-emphasis`. Para divisores em
   `<div>` ou `<hr>`, use `bg-line-default` (precedente: papel
   visual prevalece sobre mecanismo CSS).
4. **Feedback colors**: `bg-red-500` (badge erro) → `bg-error`;
   `text-red-600` → `text-fg-error`; `bg-green-50` → `bg-success-bg`.
5. **Espaçamento**: `p-4` → `getSpacingClass('base', 'p')`.
6. **Sombras**: `shadow-lg` → `getShadowClass('lg')`.
7. **Radius**: `rounded-md` → `getRadiusClass('md')`.
8. **Bordas**: `border-2` → `getBorderWidthClass('medium')`.

Casos especiais (literal aceitos com comentário inline):

- **Scrim/tint**: `bg-black/50` (backdrop) → `bg-scrim`;
  `hover:bg-black/10` (translucent hover) → `hover:bg-tint-hover`.
  Esses são theme-agnostic e não invertem no dark.
- **Cores cruas em data/demo**: arquivos de visualização de tokens e
  ColorPicker presets mantêm hex literais — não são styling, são
  dados.

## Benefícios

1. **Consistência**: Valores centralizados garantem consistência visual
2. **Manutenibilidade**: Mudanças em um lugar refletem em todo o sistema
3. **Type Safety**: TypeScript garante uso correto dos tokens
4. **Temas**: Suporte fácil a temas claro/escuro
5. **Documentação**: Tokens são auto-documentados com descrições

## Próximos Passos

- [ ] Documentar tokens no Storybook (parcialmente feito em
      `Tokens.mdx` — atualizar conforme novos tokens semânticos
      ganham consumidores).
- [ ] Avaliar criação de `--color-notification` distinto de
      `--color-warning` (atual: badge `bg-error` cobre o caso de
      "notificação genérica" por aproximação; ver BACKLOG).
- [ ] Lint rule (eslint plugin tailwind ou regex CI) que barre cores
      Tailwind cruas em `src/ui/` para impedir regressão pós-Phase 7.
