# Migration Guide: Stories Individuais → FlowPlayground

Este documento mapeia as stories individuais removidas para suas funcionalidades correspondentes no FlowPlayground.

## Visão Geral

Todas as stories individuais da extensão Flow foram consolidadas no **FlowPlayground** como playground interativo principal. Isso permite demonstrar os componentes trabalhando em conjunto, proporcionando uma experiência mais realista e completa.

## Mapeamento de Stories

### Atoms

#### FlowHandle.stories.tsx
**Localização no Playground**: Seção "Nodes & Edges" → Node Types Panel
- Preview de diferentes tipos de nodes mostra diferentes configurações de handles
- Configuração de handles ao criar/editar nodes
- Demonstração de posições (top, bottom, left, right)

#### FlowNodeWrapper.stories.tsx
**Localização no Playground**: Seção "Nodes & Edges" → Node Types Panel
- Todos os tipos de nodes usam FlowNodeWrapper
- Preview mostra diferentes variantes e tamanhos
- Customização disponível no editor de nodes

### Molecules

#### CustomNode.stories.tsx
**Localização no Playground**: Seção "Nodes & Edges" → Node Types Panel → "Default"
- Preview do tipo "Default" node
- Demonstração de variantes e tamanhos
- Edição completa no NodeEditor quando node está selecionado

#### CustomEdge.stories.tsx
**Localização no Playground**: Seção "Nodes & Edges" → Edge Types Panel → "Default"
- Preview do tipo "Default" edge
- Demonstração de diferentes tipos de edges
- Edição completa no EdgeEditor quando edge está selecionado

#### FlowNodeToolbar.stories.tsx
**Localização no Playground**: 
- Funcionalidade integrada no playground
- Toolbar aparece quando nodes são selecionados
- Ações disponíveis no editor de nodes

### Organisms

#### FlowBackground.stories.tsx
**Localização no Playground**: Seção "Background"
- Painel completo de configuração de background
- Preview em tempo real
- Presets disponíveis
- Customização de cores

#### FlowCanvas.stories.tsx
**Localização no Playground**: Base de todas as stories
- FlowCanvas é o componente base do playground
- Todas as funcionalidades do FlowCanvas estão disponíveis
- Configurações no ReactFlowPropsPanel (seção "Canvas")

#### FlowControls.stories.tsx
**Localização no Playground**: Sempre visível no canvas
- Controles de zoom e pan sempre disponíveis
- Posicionados em "bottom-left" por padrão
- Configurável via ReactFlowPropsPanel

#### FlowMinimap.stories.tsx
**Localização no Playground**: Sempre visível no canvas (quando habilitado)
- Minimap integrado no playground
- Configurável via ReactFlowPropsPanel

#### FlowPanel.stories.tsx
**Localização no Playground**: Painel lateral direito
- Painel lateral do playground usa FlowPanel
- Customizável e colapsável

#### FlowNodeResizer.stories.tsx
**Localização no Playground**: Seção "Nodes & Edges" → Node Types Panel → "Resizable"
- Preview do tipo "Resizable" node
- Demonstração de resizing no canvas
- Funcionalidade completa disponível

#### FlowCustomNodes.stories.tsx
**Localização no Playground**: Seção "Nodes & Edges" → Node Types Panel
- Todos os tipos customizados disponíveis:
  - Input Node
  - Output Node
  - Selector Node
  - Resizable Node
- Preview de cada tipo
- Demonstração de uso

#### FlowCustomEdges.stories.tsx
**Localização no Playground**: Seção "Nodes & Edges" → Edge Types Panel
- Todos os tipos customizados disponíveis:
  - Default (Bezier)
  - Smooth Step
  - Straight
  - Step
  - Floating
- Preview de cada tipo
- Demonstração de uso

#### FlowCustomization.stories.tsx
**Localização no Playground**: Story "Customization"
- Story dedicada para customização
- Demonstração de todas as opções de customização
- Preview de variantes, tamanhos, estilos

#### FlowLayouts.stories.tsx
**Localização no Playground**: Seção "Layout" e Story "Layouts"
- Painel completo de configuração de layouts
- Preview de diferentes algoritmos
- Story "Layouts" focada em layouts

#### FlowValidation.stories.tsx
**Localização no Playground**: Story "Validation"
- Story dedicada para validação
- Painel de validação em tempo real
- Demonstração de regras de conexão

#### FlowDragNDrop.stories.tsx
**Localização no Playground**: Story "Advanced"
- Funcionalidade de drag & drop integrada
- Demonstração na story "Advanced"
- Disponível em todas as stories do playground

#### FlowExamples.stories.tsx
**Localização no Playground**: Story "Examples"
- Story dedicada com templates
- Carregamento de templates pré-configurados
- Exemplos de diferentes padrões de flow

## Como Usar o Playground

### Para Desenvolvedores

1. **Explorar Componentes**: Use a story "Interactive" para acesso completo
2. **Aprender**: Use "Getting Started" para tutorial passo a passo
3. **Customizar**: Use "Customization" para ver opções de customização
4. **Aplicar Layouts**: Use "Layouts" para experimentar algoritmos
5. **Validar**: Use "Validation" para testar validação
6. **Avançado**: Use "Advanced" para funcionalidades avançadas
7. **Exemplos**: Use "Examples" para templates prontos

### Navegação por Seções

Use a barra de navegação lateral (ícones) para alternar entre seções:
- Cada seção mostra painéis específicos
- Seções podem ser colapsadas
- Atalhos de teclado disponíveis

## Benefícios da Consolidação

1. **Experiência Realista**: Componentes demonstrados trabalhando juntos
2. **Menos Manutenção**: Um único ponto de entrada ao invés de múltiplas stories
3. **Melhor Documentação**: Documentação centralizada e mais completa
4. **Interatividade**: Playground interativo mais rico que stories estáticas
5. **Foco**: Uma única entrada para explorar toda a extensão

## Perguntas Frequentes

**Q: Onde encontro exemplos de FlowHandle?**
A: Na seção "Nodes & Edges" → Node Types Panel. Cada preview de node mostra diferentes configurações de handles.

**Q: Como vejo diferentes tipos de edges?**
A: Na seção "Nodes & Edges" → Edge Types Panel. Você verá previews de todos os tipos disponíveis.

**Q: Onde configuro o background?**
A: Use a seção "Background" no playground. Há um painel completo com presets e customização.

**Q: Como aplico layouts?**
A: Use a seção "Layout" ou a story "Layouts". Configure o algoritmo e clique em "Apply Layout".

**Q: Onde estão os templates?**
A: Na story "Examples". Você pode carregar diferentes templates pré-configurados.

## Suporte

Se você não encontrar uma funcionalidade específica:
1. Verifique todas as seções do playground
2. Consulte a documentação do FlowPlayground.mdx
3. Explore diferentes stories do playground
4. Use a busca no Storybook para encontrar componentes específicos
