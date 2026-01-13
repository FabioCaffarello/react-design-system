# Flow Playground Guide

Guia completo de uso do Flow Playground no Storybook.

## Índice

1. [Introdução](#introdução)
2. [Interface](#interface)
3. [Operações Básicas](#operações-básicas)
4. [Operações Avançadas](#operações-avançadas)
5. [Validação](#validação)
6. [Export/Import](#exportimport)
7. [Dicas e Truques](#dicas-e-truques)
8. [Troubleshooting](#troubleshooting)

## Introdução

O Flow Playground é uma ferramenta interativa que permite criar, editar e testar diagramas de fluxo diretamente no Storybook. É ideal para:

- Prototipar flows rapidamente
- Testar diferentes layouts e estruturas
- Validar regras de conexão
- Exportar flows para uso em produção

## Interface

### Sidebar Esquerda

A sidebar contém todos os controles do playground:

- **Theme Toggle**: Alterna entre temas light e dark
- **Add Node**: Formulário para adicionar novos nodes
- **Node Actions**: Ações para o node selecionado
- **Flow Statistics**: Estatísticas do flow atual
- **Validation**: Painel de validação
- **Export/Import**: Controles de exportação e importação

### Canvas

O canvas é a área principal onde você trabalha com o flow:

- **Drag & Drop**: Arraste nodes para reposicioná-los
- **Connect**: Clique e arraste de um handle para outro para criar conexões
- **Select**: Clique em nodes para selecioná-los
- **Zoom/Pan**: Use os controles ou scroll do mouse

## Operações Básicas

### Adicionar um Node

1. Preencha o campo "Label" com o nome do node
2. Selecione uma "Variant" (default, primary, success, warning, error)
3. Clique em "Add Node"
4. O node aparecerá em uma posição aleatória no canvas

### Selecionar um Node

- Clique em qualquer node no canvas
- O node selecionado será destacado
- As informações do node aparecerão no painel "Selected Node"

### Editar um Node

1. Selecione o node que deseja editar
2. Modifique o "Label" ou "Variant" nos campos
3. Clique em "Update Node"
4. As mudanças serão aplicadas imediatamente

### Remover um Node

1. Selecione o node que deseja remover
2. Clique em "Delete Node"
3. O node e todas as suas conexões serão removidos

### Criar uma Conexão

1. Passe o mouse sobre um node para ver os handles
2. Clique e segure em um handle (círculo pequeno)
3. Arraste até outro node
4. Solte para criar a conexão

### Remover uma Conexão

1. Selecione a edge (linha) que deseja remover
2. Pressione Delete ou Backspace
3. A edge será removida

## Operações Avançadas

### Clonar um Node

1. Selecione o node que deseja clonar
2. Clique em "Clone Node"
3. Uma cópia do node será criada próxima ao original

### Alternar Tema

1. Use o seletor "Theme" na parte superior da sidebar
2. Escolha entre "Light" e "Dark"
3. O canvas será atualizado imediatamente

### Usar o Minimap

- O minimap mostra uma visão geral do flow
- Clique e arraste no minimap para navegar
- Útil para flows grandes

### Usar os Controls

Os controles no canto inferior esquerdo permitem:

- **Zoom In/Out**: Aumentar ou diminuir o zoom
- **Fit View**: Ajustar a visualização para mostrar todos os nodes
- **Lock/Unlock**: Travar ou destravar a interação

## Validação

### Validar o Flow

1. Clique em "Validate Flow"
2. O sistema verificará:
   - IDs duplicados
   - Conexões inválidas
   - Regras de conexão
   - Estrutura mínima

### Interpretar Resultados

- **Errors**: Problemas críticos que impedem o funcionamento
- **Warnings**: Problemas que podem causar comportamento inesperado
- **Info**: Informações sobre o flow

### Corrigir Erros

1. Leia a mensagem de erro no painel de validação
2. Identifique o node ou edge problemático
3. Corrija o problema (ex: remover ID duplicado, corrigir conexão)
4. Valide novamente

## Export/Import

### Exportar um Flow

1. Clique em "Export JSON"
2. Um arquivo JSON será baixado
3. O arquivo contém toda a estrutura do flow

### Importar um Flow

1. Clique em "Import JSON"
2. Selecione um arquivo JSON válido
3. O flow será carregado no canvas
4. Certifique-se de que o formato está correto

### Formato do JSON

O JSON deve seguir esta estrutura:

```json
{
  "nodes": [
    {
      "id": "string",
      "type": "string",
      "position": { "x": number, "y": number },
      "data": {
        "label": "string",
        "variant": "string"
      }
    }
  ],
  "edges": [
    {
      "id": "string",
      "source": "string",
      "target": "string",
      "data": {}
    }
  ],
  "viewport": {
    "x": number,
    "y": number,
    "zoom": number
  }
}
```

## Dicas e Truques

### Organização

- Use variants para categorizar nodes visualmente
- Agrupe nodes relacionados próximos uns dos outros
- Use labels descritivos nas edges

### Performance

- Para flows muito grandes (>100 nodes), considere dividir em múltiplos flows
- Use o minimap para navegação rápida
- Exporte regularmente para não perder trabalho

### Acessibilidade

- Use labels claros e descritivos
- Evite cores como única forma de diferenciação
- Teste em diferentes temas

### Boas Práticas

1. **Valide Regularmente**: Valide o flow após mudanças significativas
2. **Exporte Frequentemente**: Salve seu trabalho regularmente
3. **Use Variants Consistentemente**: Mantenha uma convenção de variants
4. **Documente**: Adicione descrições aos nodes quando necessário

## Troubleshooting

### Problema: Nodes não aparecem

**Solução:**
- Verifique se as posições dos nodes estão dentro do viewport
- Use "Fit View" nos controls para ajustar a visualização
- Verifique se há erros no console

### Problema: Não consigo criar conexões

**Solução:**
- Certifique-se de que os handles estão visíveis
- Verifique se há regras de conexão bloqueando
- Tente conectar de handles diferentes (top, bottom, left, right)

### Problema: Erro ao importar JSON

**Solução:**
- Verifique se o JSON está bem formatado
- Certifique-se de que todos os nodes referenciados nas edges existem
- Verifique se os IDs são únicos

### Problema: Performance lenta

**Solução:**
- Reduza o número de nodes no flow
- Desabilite animações se não forem necessárias
- Use o minimap em vez de pan/zoom constante

### Problema: Mudanças não são salvas

**Solução:**
- Exporte o flow antes de sair
- O playground não salva automaticamente
- Use o botão de export regularmente

## Recursos Adicionais

- [Documentação do React Flow](https://reactflow.dev/)
- [Flow Examples](./FlowExamples.stories.tsx)
- [Flow Layouts](./FlowLayouts.stories.tsx)
- [Flow Validation](./FlowValidation.stories.tsx)
- [Flow Customization](./FlowCustomization.stories.tsx)

## Suporte

Para problemas ou dúvidas:

1. Verifique este guia
2. Consulte a documentação MDX
3. Revise os exemplos nas stories
4. Abra uma issue no repositório
