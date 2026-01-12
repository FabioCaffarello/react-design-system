# Design Tokens System

Este documento descreve o sistema de design tokens do `react-design-system`, que fornece valores centralizados e consistentes para cores, espaçamento, tipografia, sombras, bordas, raios e breakpoints.

## Visão Geral

O sistema de tokens utiliza o **Factory Pattern** para criar tokens de forma type-safe e consistente. Todos os tokens seguem uma estrutura padronizada e podem ser acessados através de helper functions.

## Estrutura de Tokens

### 1. Colors (`colors.ts`)

Sistema de cores semânticas com suporte a temas claro e escuro.

**Roles**: `primary`, `secondary`, `success`, `warning`, `error`, `info`, `neutral`

**Shades**: `light`, `DEFAULT`, `dark`, `contrast`

**Uso:**
```typescript
import { getColorClass, COLOR_TOKENS } from './tokens/colors';

// Obter classe Tailwind
const bgClass = getColorClass('primary', 'DEFAULT', 'bg'); // 'bg-indigo-500'
const textClass = getColorClass('error', 'dark', 'text'); // 'text-red-600'

// Acessar token diretamente
const primaryColor = COLOR_TOKENS.primary.DEFAULT.hex; // '#6366f1'
```

### 2. Spacing (`spacing.ts`)

Sistema de espaçamento baseado em unidades de 4px.

**Escala**: `xs` (4px), `sm` (8px), `md` (12px), `base` (16px), `lg` (24px), `xl` (32px), `2xl` (40px), `3xl` (48px), `4xl` (64px), `5xl` (80px), `6xl` (96px)

**Uso:**
```typescript
import { getSpacingClass, SPACING_TOKENS } from './tokens/spacing';

// Obter classe Tailwind
const paddingClass = getSpacingClass('md', 'p'); // 'p-3'
const marginClass = getSpacingClass('lg', 'mx'); // 'mx-6'

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
import { getTypographyClasses, TYPOGRAPHY_TOKENS } from './tokens/typography';

// Obter classes completas
const headingClasses = getTypographyClasses('h1'); // 'text-4xl leading-tight font-bold'

// Acessar token diretamente
const h1Size = TYPOGRAPHY_TOKENS.h1.fontSize.px; // '36px'
```

### 4. Shadows (`shadows.ts`)

Sistema de sombras para elevação e profundidade.

**Tamanhos**: `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `inner`

**Uso:**
```typescript
import { getShadowClass, SHADOW_TOKENS } from './tokens/shadows';

// Obter classe Tailwind
const shadowClass = getShadowClass('lg'); // 'shadow-lg'

// Acessar token diretamente
const lgShadow = SHADOW_TOKENS.lg.value; // '0 4px 6px -1px rgb(0 0 0 / 0.1)...'
```

### 5. Radius (`radius.ts`)

Sistema de border radius para cantos arredondados.

**Tamanhos**: `none`, `sm` (2px), `md` (6px), `lg` (8px), `xl` (12px), `2xl` (16px), `3xl` (24px), `full`

**Uso:**
```typescript
import { getRadiusClass, RADIUS_TOKENS } from './tokens/radius';

// Obter classe Tailwind
const radiusClass = getRadiusClass('lg'); // 'rounded-lg'

// Acessar token diretamente
const lgRadius = RADIUS_TOKENS.lg.px; // '8px'
```

### 6. Borders (`borders.ts`)

Sistema de bordas para larguras e estilos.

**Larguras**: `none`, `thin` (1px), `base` (1px), `medium` (2px), `thick` (4px)

**Estilos**: `solid`, `dashed`, `dotted`

**Uso:**
```typescript
import { getBorderWidthClass, getBorderStyleClass, getBorderClasses, BORDER_TOKENS } from './tokens/borders';

// Obter classes
const widthClass = getBorderWidthClass('base'); // 'border'
const styleClass = getBorderStyleClass('solid'); // 'border-solid'
const fullBorder = getBorderClasses('base', 'solid'); // 'border border-solid'

// Acessar token diretamente
const baseBorder = BORDER_TOKENS.base.width.px; // '1px'
```

### 7. Breakpoints (`breakpoints.ts`)

Sistema de breakpoints responsivos.

**Breakpoints**: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)

**Uso:**
```typescript
import { BREAKPOINT_TOKENS } from './tokens/breakpoints';

// Acessar breakpoint
const mdBreakpoint = BREAKPOINT_TOKENS.md.value; // 768
```

## Tokens Factory

O `TokensFactory` fornece uma interface unificada para criar todos os tipos de tokens:

```typescript
import { TokensFactory } from './tokens/tokens.factory';

const factory = new TokensFactory('light');
const tokenSet = factory.createTokenSet();

// Acessar todos os tokens
const spacing = tokenSet.spacing;
const colors = tokenSet.colors;
const shadows = tokenSet.shadows;
```

## Padrões de Uso

### ✅ Usar Tokens

```typescript
import { getColorClass } from './tokens/colors';
import { getSpacingClass } from './tokens/spacing';
import { getRadiusClass } from './tokens/radius';
import { getShadowClass } from './tokens/shadows';

const className = `
  ${getColorClass('primary', 'DEFAULT', 'bg')}
  ${getSpacingClass('md', 'p')}
  ${getRadiusClass('lg')}
  ${getShadowClass('md')}
`;
```

### ❌ Evitar Classes Hardcoded

```typescript
// ❌ Evitar
const className = 'bg-indigo-500 p-3 rounded-lg shadow-md';

// ✅ Preferir
const className = `
  ${getColorClass('primary', 'DEFAULT', 'bg')}
  ${getSpacingClass('md', 'p')}
  ${getRadiusClass('lg')}
  ${getShadowClass('md')}
`;
```

## Migração de Classes Hardcoded

Ao refatorar componentes, substitua classes hardcoded por tokens:

1. **Cores**: `bg-gray-500` → `getColorClass('neutral', 'DEFAULT', 'bg')`
2. **Espaçamento**: `p-4` → `getSpacingClass('base', 'p')`
3. **Sombras**: `shadow-lg` → `getShadowClass('lg')`
4. **Radius**: `rounded-md` → `getRadiusClass('md')`
5. **Bordas**: `border-2` → `getBorderWidthClass('medium')`

## Benefícios

1. **Consistência**: Valores centralizados garantem consistência visual
2. **Manutenibilidade**: Mudanças em um lugar refletem em todo o sistema
3. **Type Safety**: TypeScript garante uso correto dos tokens
4. **Temas**: Suporte fácil a temas claro/escuro
5. **Documentação**: Tokens são auto-documentados com descrições

## Próximos Passos

- [ ] Auditar todos os componentes para uso de tokens
- [ ] Substituir classes hardcoded por tokens
- [ ] Adicionar tokens para animações e transições
- [ ] Criar tokens para z-index layers
- [ ] Documentar tokens no Storybook
