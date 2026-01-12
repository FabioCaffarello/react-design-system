# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.9.0] - 2024-01-XX

### ✨ Adicionado

#### Novos Tokens
- **Animações** (`tokens/animations.ts`)
  - Durações: fast (150ms), base (200ms), slow (300ms), slower (500ms)
  - Easing functions: ease-in, ease-out, ease-in-out, spring
  - Helpers: `getAnimationClass()`, `getTransitionClass()`

- **Z-Index** (`tokens/z-index.ts`)
  - Layers: base, dropdown, sticky, fixed, modal-backdrop, modal, popover, tooltip, toast
  - Helper: `getZIndexClass()`

- **Opacidade** (`tokens/opacity.ts`)
  - Valores: 0, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100
  - Helper: `getOpacityClass()`

- **Gradientes** (`tokens/gradients.ts`)
  - Roles: primary, secondary, success, error, info, warning
  - Directions: to-r, to-l, to-t, to-b, to-tr, to-tl, to-br, to-bl
  - Helper: `getGradientClass()`

#### Novos Componentes Atoms
- **Switch** - Toggle on/off com estados, labels, descrições, acessibilidade completa
- **Separator** - Separador horizontal/vertical com variantes (solid, dashed, dotted)
- **Accordion** - Single e multiple selection, animações suaves, ícones customizáveis
- **Slider** - Range input com single e dual thumb, marks opcionais, tooltip de valor
- **Popover** - Posicionamento inteligente, trigger customizável, portal rendering

#### Novos Componentes Molecules
- **SearchInput** - Input com ícone de busca, clear button, loading state, debounce
- **Rating** - Sistema de avaliação com estrelas, half ratings, read-only, custom icons
- **FileUpload** - Drag and drop, preview de arquivos, validação de tipo/tamanho, progress indicator
- **TimePicker** - Seleção de hora com formato 12h/24h, keyboard navigation
- **ColorPicker** - Seletor de cores com RGB sliders, presets, formatos hex/rgb/hsl

#### Novos Componentes Organisms
- **Stepper** - Wizard multi-step com validação por step, navegação, progress indicator
- **Timeline** - Exibição de eventos em linha do tempo, horizontal/vertical, status, ícones
- **CommandPalette** - Busca rápida de comandos, keyboard navigation (Cmd/Ctrl+K), categorias
- **DataGrid** - Grid avançado com export, grouping, column management, toolbar actions

### 🔧 Melhorado

#### Performance
- **React.memo** implementado em: Card, Badge, Separator, Spinner
- **useMemo/useCallback** implementado em componentes otimizados
- **Code splitting** configurado com entry points separados (atoms, molecules, organisms, tokens)
- **Virtual scrolling** já existente no Table otimizado

#### Documentação
- Documentação completa de tokens no Storybook (`Tokens.mdx`)
- Componentes de visualização de tokens (`TokenVisualizations.tsx`)
- Guia de code splitting (`CODE_SPLITTING.md`)
- Guia de performance (`PERFORMANCE_GUIDE.md`)

#### Ferramentas
- Script de auditoria de tokens (`scripts/audit-tokens.js`)
- Comando npm: `npm run audit:tokens`

### 📦 Build

- Entry points separados configurados no `package.json`
- Vite config atualizado para múltiplos builds
- Tree shaking otimizado

### 🔄 Breaking Changes

Nenhuma breaking change nesta versão. Todas as mudanças são aditivas e backward compatible.

### 📝 Notas

- Todos os novos componentes incluem testes com cobertura >80%
- Todos os novos componentes incluem stories no Storybook
- Todos os novos componentes seguem padrões de acessibilidade WCAG 2.1 AA
- Todos os novos componentes usam design tokens consistentemente
