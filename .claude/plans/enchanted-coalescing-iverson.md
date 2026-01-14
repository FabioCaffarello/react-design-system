# Plano de Evolução do AppBuilder

## Resumo
Evolução completa do AppBuilder POC para uma ferramenta robusta de construção de aplicações no Storybook, incluindo correção de bugs, refatoração de arquitetura, preview real de componentes, playground dedicado e drag-and-drop.

---

## Fase 1: Correção de Bugs Críticos

### 1.1 Conflito de z-index nos modais
- **Arquivo:** `src/ui/tools/AppBuilder/AppBuilder.tsx:491`
- **Problema:** Component Palette overlay usa `z-50` que conflita com outros modais
- **Solução:** Usar Portal do React e gerenciar z-index via CSS variables

### 1.2 Substituir `prompt()` por Modal Dialog
- **Arquivo:** `src/ui/tools/AppBuilder/ComponentPropsEditor.tsx:76-88`
- **Problema:** `prompt()` bloqueia UI e é má prática
- **Solução:** Criar componente `AddPropDialog` usando `AlertDialog` do design system

### 1.3 Adicionar estados de loading
- **Arquivos:** `AppBuilder.tsx` (save, export operations)
- **Problema:** Operações async sem feedback visual
- **Solução:** Adicionar state `isLoading` e desabilitar botões durante operações

---

## Fase 2: Refatoração da Arquitetura

### 2.1 Extrair componentes do AppBuilder.tsx (501 linhas)
Dividir em componentes menores e mais focados:

```
AppBuilder/
├── components/
│   ├── AppBuilderHeader.tsx      # Header com nome e ações
│   ├── AppBuilderCanvas.tsx      # Área central (Design/Preview/Code)
│   ├── AppBuilderProperties.tsx  # Painel de propriedades
│   └── AppBuilderToolbar.tsx     # Barra de ferramentas/tabs
├── hooks/
│   └── useAppBuilder.ts          # Custom hook para estado e ações
```

### 2.2 Custom Hook `useAppBuilder`
Extrair toda lógica de estado para um hook reutilizável:
- Estado centralizado (appConfig, selections, viewMode)
- Todas as ações (add, update, delete, save, export)
- Validação reativa
- Facilita testes unitários

---

## Fase 3: Preview Real de Componentes

### 3.1 Renderização Dinâmica de Componentes
- **Arquivo:** `src/ui/tools/AppBuilder/Preview.tsx`
- **Problema Atual:** Mostra apenas cards com metadados, não renderiza componentes reais
- **Solução:**
  1. Criar mapeamento `componentName -> ReactComponent`
  2. Usar `React.createElement` para renderização dinâmica
  3. Implementar `ComponentRenderer` com error boundaries

### 3.2 Estrutura do ComponentRenderer
```tsx
// Mapeia nomes de componentes para componentes reais
const COMPONENT_MAP = {
  'Button': Button,
  'Card': Card,
  'Input': Input,
  // ... todos os componentes do design system
};

function ComponentRenderer({ component, onSelect }) {
  const Component = COMPONENT_MAP[component.name];
  if (!Component) return <MissingComponent name={component.name} />;
  return <Component {...component.props} />;
}
```

---

## Fase 4: Playground Dedicado no Storybook

### 4.1 Criar estrutura do Playground
```
src/ui/playgrounds/
├── AppBuilderPlayground/
│   ├── index.tsx                  # Export principal
│   ├── AppBuilderPlayground.tsx   # Componente do playground
│   └── AppBuilderPlayground.stories.tsx
```

### 4.2 Features do Playground
- **Layout fullscreen** otimizado para construção
- **Sidebar colapsável** com lista de projetos salvos
- **Área de trabalho** expandida com preview em tempo real
- **Painel de exportação** com código gerado e download
- **Templates Gallery** - galeria de templates pré-construídos
- **Quick Actions** - atalhos para operações comuns

### 4.3 Story do Playground
```tsx
// AppBuilderPlayground.stories.tsx
const meta = {
  title: 'Playgrounds/App Builder',
  component: AppBuilderPlayground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# App Builder Playground

Ferramenta interativa para construir aplicações usando o design system.

## Como usar
1. Crie features (páginas, módulos, fluxos)
2. Adicione componentes da paleta
3. Configure props e layout
4. Exporte o código gerado
        `
      }
    }
  }
};
```

---

## Fase 5: Drag-and-Drop

### 5.1 Biblioteca
- Usar `@dnd-kit/core` e `@dnd-kit/sortable` (melhor que react-beautiful-dnd)
- Motivo: Mais moderno, menor bundle, melhor acessibilidade
- **Instalação necessária:** `npm install @dnd-kit/core @dnd-kit/sortable`

### 5.2 Implementação
- **Features:** Reordenar features na sidebar
- **Componentes:** Reordenar componentes dentro de uma feature
- **Componentes aninhados:** Drag para dentro de containers

### 5.3 Arquivos afetados
- `FeatureManager.tsx` - drag features
- `ComponentList.tsx` (novo) - drag componentes
- `Preview.tsx` - drop zones visuais

---

## Fase 6: Melhorias de UX

### 6.1 Usar mais componentes do Design System
Substituir elementos nativos por componentes do DS:
- `<input>` -> `<Input>` em `ComponentPalette.tsx:120-126`
- `<select>` -> `<Select>` em `ComponentPropsEditor.tsx:145-154`
- Usar `Badge`, `Tooltip`, `Dropdown` onde apropriado

### 6.2 Feedback visual melhorado
- Animações de transição nos modais
- Skeleton loading durante carregamento
- Toast com undo para ações destrutivas

---

## Arquivos a Modificar/Criar

### Modificar:
1. `src/ui/tools/AppBuilder/AppBuilder.tsx` - Refatorar e extrair componentes
2. `src/ui/tools/AppBuilder/ComponentPropsEditor.tsx` - Substituir prompt()
3. `src/ui/tools/AppBuilder/Preview.tsx` - Preview real
4. `src/ui/tools/AppBuilder/FeatureManager.tsx` - Drag-and-drop
5. `src/ui/tools/AppBuilder/ComponentPalette.tsx` - Usar Input do DS
6. `src/ui/stories/App/AppBuilder.stories.tsx` - Melhorar stories

### Criar:
1. `src/ui/tools/AppBuilder/components/AppBuilderHeader.tsx`
2. `src/ui/tools/AppBuilder/components/AppBuilderCanvas.tsx`
3. `src/ui/tools/AppBuilder/components/AppBuilderProperties.tsx`
4. `src/ui/tools/AppBuilder/components/AppBuilderToolbar.tsx`
5. `src/ui/tools/AppBuilder/components/AddPropDialog.tsx`
6. `src/ui/tools/AppBuilder/components/ComponentRenderer.tsx`
7. `src/ui/tools/AppBuilder/hooks/useAppBuilder.ts`
8. `src/ui/playgrounds/AppBuilderPlayground/index.tsx`
9. `src/ui/playgrounds/AppBuilderPlayground/AppBuilderPlayground.tsx`
10. `src/ui/playgrounds/AppBuilderPlayground/AppBuilderPlayground.stories.tsx`

---

## Verificação

### Testes manuais:
1. Abrir Storybook e navegar para `Playgrounds/App Builder`
2. Criar uma nova feature usando template
3. Adicionar componentes via paleta
4. Verificar preview real renderiza componentes
5. Testar drag-and-drop de features e componentes
6. Adicionar prop via dialog (não mais prompt)
7. Exportar código e verificar output

### Testes automatizados:
1. Rodar `npm run test` - todos os testes do AppBuilder devem passar
2. Rodar `npm run build` - build sem erros
3. Verificar Storybook compila: `npm run storybook`

---

## Ordem de Execução Recomendada

1. **Fase 1** - Bugs críticos (fundação sólida)
2. **Fase 2** - Refatoração (facilita trabalho subsequente)
3. **Fase 3** - Preview real (valor imediato)
4. **Fase 4** - Playground (nova experiência)
5. **Fase 5** - Drag-and-drop (UX avançada)
6. **Fase 6** - Polimento final
