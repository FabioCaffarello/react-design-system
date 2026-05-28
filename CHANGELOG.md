# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.10.4] - 2026-01-19 (Próxima Versão)

### ✅ Solução Turbopack: Compatibilidade com Next.js 15+

#### Problema Resolvido

- **Turbopack Compatibility:** Resolvido problema de inicialização com Turbopack (Next.js 15+)
  - Problema estava nas extensions (especialmente React Flow) sendo code-split incorretamente
  - Solução: Extensions removidas do export principal e disponibilizadas via entry point separado
  - Build do Next.js com Turbopack agora funciona corretamente

#### Mudanças

- **Extensions Separadas:** Extensions não são mais exportadas do index principal
  - Evita code splitting incorreto do Turbopack
  - Extensions disponíveis via `@fabio.caffarello/react-design-system/extensions`
  - Flow extension disponível via `@fabio.caffarello/react-design-system/extensions/flow`
- **Documentação Atualizada:** `NEXTJS_SETUP.md` atualizado com instruções para Turbopack

### 🏗️ Solução Estrutural: Inicialização de Providers

#### Mudanças Estruturais

- **Provider Initialization Guard:** Implementado sistema de guard que garante ordem de inicialização dos providers
  - Objeto que referencia todos os providers, criando boundary de módulo
  - Previne code splitting que quebra ordem de inicialização
  - Garante que todos os providers estejam no mesmo contexto
- **Configuração de Build Otimizada:** Ajustes no `vite.config.ts` para garantir ordem
  - `manualChunks`: Força todos os providers no mesmo chunk
  - `treeshake.moduleSideEffects`: Preserva side effects dos providers
  - `preserveEntrySignatures: 'strict'`: Preserva exports
- **Exports Explícitos:** Substituído barrel exports por exports nomeados explícitos
  - Elimina dependências implícitas de barrel exports
  - Garante ordem de exports explícita
- **Entry Point Separado:** Criado entry point `./providers` separado
  - Permite importar providers sem importar todo o design system
  - Facilita tree-shaking e code splitting controlado

#### Reestruturação de Providers

- **Providers Movidos:** `ToastProvider` e `DialogProvider` movidos de `organisms/` para `providers/`
  - Quebra dependências arquiteturais
  - Agrupa todos os providers logicamente
  - Re-exports mantidos para compatibilidade

#### Documentação e Ferramentas

- **Documentação Completa:** Criado `docs/NEXTJS_SETUP.md` com guia completo
  - Configuração do Next.js necessária
  - Script de setup automatizado
  - Workaround documentado
  - Troubleshooting
- **Script de Setup:** Criado `npm run setup:nextjs` para configurar Next.js automaticamente
- **Análise de Dependências:** Criado `npm run analyze:deps` para detectar dependências circulares

### ⚠️ Limitação Conhecida

O problema de inicialização pode persistir no Next.js mesmo com a solução estrutural porque:

- Next.js faz seu próprio bundling e pode reorganizar código
- Requer configuração adicional no `next.config.js` do consumidor
- Ver `docs/NEXTJS_SETUP.md` para configuração necessária

### 📝 Documentação

- Adicionado `docs/NEXTJS_SETUP.md` - Guia completo de setup do Next.js
- Adicionado `.context/docs/SOLUCAO_ESTRUTURAL_COMPLETA.md` - Documentação técnica completa
- Adicionado `.context/docs/PLANO_RESOLUCAO_INICIALIZACAO_CIRCULAR.md` - Plano detalhado
- Adicionado `.context/docs/ANALISE_INICIAL_COMPLETA.md` - Análise inicial

### 🔗 Impacto

**Antes:**

- ❌ Erro durante build do Next.js
- ❌ Problema de inicialização circular
- ❌ Requer workaround

**Depois:**

- ✅ Solução estrutural implementada
- ✅ Build do design system otimizado
- ✅ Documentação completa
- ⚠️ Requer configuração adicional no Next.js (documentada)

---

## [1.10.3] - 2026-01-19

### 🐛 Corrigido

#### Compatibilidade Next.js SSR

- **Correção crítica:** Resolvido erro `ReferenceError: Cannot access 'aT' before initialization` durante build do Next.js 15.5.9
- **Ordem de exports:** Reorganizada ordem de exports em `src/ui/index.ts` e `src/ui/providers/index.ts` para garantir inicialização correta
  - Tokens exportados primeiro (sem dependências)
  - Utils exportados em seguida (funções puras)
  - Providers exportados na ordem de dependência (Theme → Config → App)
  - Componentes exportados por último (dependem de providers)
- **Compatibilidade SSR:** Corrigidos `ThemeProvider` e `ConfigProvider` para verificar ambiente antes de usar APIs do browser
  - `ThemeProvider`: Adicionada verificação `typeof window === 'undefined'` no `useEffect`
  - `ConfigProvider`: Substituído `useMemo` por `useEffect` para manipulação do DOM (SSR-safe)
- **Configuração de build:** Ajustada configuração do Vite para preservar ordem de inicialização
  - Providers mantidos no bundle principal (não code-split)
  - Tree-shaking preserva side effects necessários dos providers

### ✨ Adicionado

#### Testes

- **Script de teste Next.js:** Adicionado `npm run test:nextjs` para validar compatibilidade com Next.js
  - Cria aplicação Next.js mínima automaticamente
  - Testa build com `AppProvider` em layout (SSR)
  - Testa build com `AppProvider` em client component
  - Valida que build passa sem erros

### 📝 Documentação

- Adicionado documento `.context/docs/completed-changes/nextjs-ssr-fixes.md` com detalhes das correções

### 🔗 Impacto

**Antes:**

- ❌ Erro durante build do Next.js
- ❌ Requer workaround com lazy loading
- ❌ Flash de conteúdo sem estilização

**Depois:**

- ✅ Build do Next.js passa sem erros
- ✅ `AppProvider` funciona nativamente em SSR/prerendering
- ✅ Sem necessidade de workarounds
- ✅ Melhor experiência de usuário

---

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
