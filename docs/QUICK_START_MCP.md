# Quick Start - MCP Integration

Guia rápido para começar a usar MCPs (Model Context Protocol) no React Design System.

## 🚀 Início Rápido (5 minutos)

### 1. Verificar Storybook MCP (Já Configurado!)

O Storybook MCP já está instalado e configurado. Para usar:

```bash
# 1. Inicie o Storybook
npm run storybook

# 2. Em outro terminal, teste a conexão
npm run mcp:health-check
```

Se tudo estiver OK, você verá:
```
✅ MCP Server is available
📦 Available tools: X
```

### 2. Configurar Cursor/Claude Code

Crie ou edite `.cursor/mcp.json` na raiz do projeto:

```json
{
  "mcpServers": {
    "storybook": {
      "type": "http",
      "url": "http://localhost:6006/mcp"
    }
  }
}
```

Reinicie o Cursor/Claude Code.

### 3. Testar com AI Agent

Agora você pode perguntar ao AI agent:
- "List all components in Storybook"
- "Get information about Button component"
- "Generate documentation for all components"

## 📋 Scripts Disponíveis

### MCP Scripts

```bash
# Health check
npm run mcp:health-check

# Gerar documentação
npm run mcp:generate-docs

# Sync tokens do Figma (requer configuração)
npm run mcp:figma-sync-tokens

# Validar arquitetura
npm run mcp:validate-architecture

# Extrair metadata
npm run mcp:extract-metadata
```

## 🎯 Casos de Uso Comuns

### Gerar Documentação Automaticamente

```bash
# 1. Inicie Storybook
npm run storybook

# 2. Em outro terminal
npm run mcp:generate-docs
```

Isso gera documentação para todos os componentes em `docs/generated/`.

### Validar Arquitetura

```bash
npm run mcp:validate-architecture
```

Gera relatório de validação em `docs/architecture-validation-report.md`.

### Extrair Metadata

```bash
# Requer Storybook rodando
npm run storybook &
npm run mcp:extract-metadata
```

Extrai metadata completa de todos os componentes.

## 🔧 Configuração Adicional (Opcional)

### Figma MCP Server

Para sync automático com Figma:

1. Obtenha Figma Access Token
2. Obtenha Figma File Key
3. Configure em `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}",
        "FIGMA_FILE_KEY": "${FIGMA_FILE_KEY}"
      }
    }
  }
}
```

### Design Systems MCP

Para acesso a best practices:

```json
{
  "mcpServers": {
    "design-systems": {
      "url": "https://mcp.so/server/design-systems-mcp"
    }
  }
}
```

## 📚 Documentação Completa

- [MCP_STRATEGY.md](./MCP_STRATEGY.md) - Estratégia completa
- [MCP_SETUP.md](./MCP_SETUP.md) - Setup detalhado
- [MCP_AUTOMATIONS.md](./MCP_AUTOMATIONS.md) - Automações disponíveis
- [FIGMA_MCP_INTEGRATION.md](./FIGMA_MCP_INTEGRATION.md) - Figma MCP
- [DESIGN_SYSTEMS_MCP.md](./DESIGN_SYSTEMS_MCP.md) - Design Systems MCP
- [MCP_EXTRACTOR.md](./MCP_EXTRACTOR.md) - MCP Extractor

## ❓ Troubleshooting

### MCP não conecta

1. Verifique se Storybook está rodando: `npm run storybook`
2. Teste conexão: `npm run mcp:health-check`
3. Verifique URL em `.cursor/mcp.json`

### Scripts não funcionam

1. Verifique se Storybook está rodando
2. Verifique se está na porta correta (6006)
3. Verifique logs de erro

## 🎉 Próximos Passos

1. ✅ Teste `mcp:health-check`
2. ✅ Gere documentação: `mcp:generate-docs`
3. ✅ Explore outras automações
4. ✅ Configure MCPs adicionais conforme necessário
