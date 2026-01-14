# Storybook Addons Audit

Este documento lista todos os addons disponíveis, seu status atual, e recomendações de uso.

## Addons Atualmente Ativos

### ✅ @chromatic-com/storybook (v4.1.2)
**Status**: Ativo e configurado
**Uso**: Visual regression testing com Chromatic
**Documentação**: [CHROMATIC_SETUP.md](./CHROMATIC_SETUP.md)

### ✅ @storybook/addon-docs (v10.0.3)
**Status**: Ativo
**Uso**: Documentação automática, Controls, Actions, Viewport, Interactions
**Nota**: Inclui @storybook/addon-interactions no Storybook 10

### ✅ @storybook/addon-a11y (v10.0.3)
**Status**: Ativo e configurado
**Uso**: Testes de acessibilidade WCAG 2.1 AA
**Configuração**: 60+ regras configuradas em `.storybook/preview.tsx`

### ✅ @storybook/addon-vitest (v10.0.3)
**Status**: Ativo
**Uso**: Integração com Vitest para testes de stories
**Configuração**: Configurado em `vite.config.ts`

### ✅ @storybook/addon-mcp (v0.1.8)
**Status**: Ativo mas não utilizado em seu potencial
**Uso**: Model Context Protocol para AI agents
**Endpoint**: `http://localhost:6006/mcp` quando Storybook está rodando
**Ação Necessária**: Configurar e documentar uso completo

## Addons Instalados mas Não Ativados

### ⚠️ @storybook/addon-measure (v9.0.8)
**Status**: Instalado, não ativado
**Uso**: Medição de elementos na tela (largura, altura, padding, margin)
**Benefício**: Útil para debugging de layout e espaçamento
**Recomendação**: ✅ Ativar - Baixo impacto, alto valor para desenvolvimento

### ⚠️ @storybook/addon-outline (v9.0.8)
**Status**: Instalado, não ativado
**Uso**: Visualização de outlines de elementos (borders, padding, margin)
**Benefício**: Ajuda a visualizar estrutura de componentes
**Recomendação**: ✅ Ativar - Útil para debugging visual

### ⚠️ @storybook/addon-designs (v11.1.1)
**Status**: Instalado, não ativado
**Uso**: Integração com Figma designs
**Benefício**: Comparação visual design vs código
**Recomendação**: ✅ Ativar - Crítico para design-code sync
**Ação**: Configurar com Figma file keys

### ⚠️ @storybook/addon-coverage (v3.0.0)
**Status**: Instalado, não ativado
**Uso**: Visualização de code coverage no Storybook
**Benefício**: Ver cobertura de testes diretamente no Storybook
**Recomendação**: ✅ Ativar - Ajuda a identificar gaps de cobertura

### ⚠️ storybook-addon-performance (v0.17.3)
**Status**: Instalado, não ativado
**Uso**: Métricas de performance (render time, re-renders)
**Benefício**: Identificar componentes com problemas de performance
**Recomendação**: ✅ Ativar - Importante para otimização

## Addons Recomendados para Instalação Futura

### 📦 @storybook/addon-viewport (já incluído em addon-docs)
**Status**: Já disponível via @storybook/addon-docs
**Uso**: Teste de responsividade

### 📦 @storybook/addon-backgrounds (já incluído em addon-docs)
**Status**: Já disponível via @storybook/addon-docs
**Uso**: Teste de componentes em diferentes backgrounds

### 📦 @storybook/addon-toolbars
**Status**: Não instalado
**Uso**: Toolbars customizadas para stories
**Recomendação**: Considerar se necessário para casos específicos

## Resumo e Ações

### Prioridade Alta (Ativar Imediatamente)
1. ✅ @storybook/addon-measure
2. ✅ @storybook/addon-outline
3. ✅ @storybook/addon-designs
4. ✅ @storybook/addon-coverage
5. ✅ storybook-addon-performance

### Prioridade Média (Configurar e Documentar)
1. ⚠️ @storybook/addon-mcp - Configurar uso completo
2. ⚠️ @storybook/addon-designs - Configurar Figma integration

### Prioridade Baixa (Futuro)
1. 📦 Addons customizados conforme necessidade

## Compatibilidade com Storybook 10

Todos os addons listados são compatíveis com Storybook 10 ESM-only:
- ✅ @storybook/addon-measure (v9.0.8) - Compatível
- ✅ @storybook/addon-outline (v9.0.8) - Compatível
- ✅ @storybook/addon-designs (v11.1.1) - Compatível
- ✅ @storybook/addon-coverage (v3.0.0) - Compatível
- ✅ storybook-addon-performance (v0.17.3) - Compatível

## Próximos Passos

1. Ativar todos os addons instalados
2. Configurar @storybook/addon-designs com Figma
3. Documentar uso de cada addon
4. Configurar @storybook/addon-mcp completamente
