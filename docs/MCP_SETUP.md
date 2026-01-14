# Guia de Configuração MCP

Este guia explica como configurar e usar MCPs (Model Context Protocol) no React Design System.

## Pré-requisitos

- Node.js 18+
- Storybook rodando (porta 6006)
- Cursor IDE ou Claude Code (para integração com AI agents)

## Storybook MCP Addon

### 1. Verificar Instalação

O addon já está instalado. Verifique:

```bash
npm list @storybook/addon-mcp
```

### 2. Verificar Configuração

O addon está configurado em `.storybook/main.ts`. Não é necessária configuração adicional.

### 3. Iniciar Storybook

```bash
npm run storybook
```

O MCP server estará disponível em: `http://localhost:6006/mcp`

### 4. Testar Conexão

```bash
npm run mcp:health-check
```

Este comando verifica se o MCP server está disponível e lista as ferramentas disponíveis.

## Configuração do Cursor/Claude Code

### 1. Criar Arquivo de Configuração

Crie ou edite `.cursor/mcp.json` na raiz do projeto:

```json
{
  "mcpServers": {
    "storybook": {
      "type": "http",
      "url": "http://localhost:6006/mcp",
      "description": "Storybook MCP server for component information"
    }
  }
}
```

### 2. Reiniciar Cursor/Claude Code

Após criar o arquivo, reinicie o editor para que as mudanças sejam aplicadas.

### 3. Verificar Conexão

No Cursor/Claude Code, você pode perguntar:
- "List all components in Storybook"
- "Get information about Button component"
- "Generate documentation for all components"

## Scripts Disponíveis

### Health Check

Verifica se o MCP server está disponível:

```bash
npm run mcp:health-check
```

### Generate Documentation

Gera documentação usando MCP:

```bash
npm run mcp:generate-docs
```

**Nota**: Requer Storybook rodando.

## Troubleshooting

### MCP Server não está disponível

**Sintoma**: `mcp:health-check` falha

**Soluções**:
1. Verifique se Storybook está rodando: `npm run storybook`
2. Verifique se está na porta correta (6006)
3. Verifique se o addon está no array de addons em `.storybook/main.ts`

### Cursor não conecta ao MCP

**Sintoma**: AI agents não conseguem acessar Storybook

**Soluções**:
1. Verifique se `.cursor/mcp.json` existe e está correto
2. Reinicie o Cursor/Claude Code
3. Verifique se Storybook está rodando
4. Teste manualmente: `npm run mcp:health-check`

### Erro ao chamar MCP

**Sintoma**: Erros ao executar scripts MCP

**Soluções**:
1. Verifique se Storybook está rodando
2. Verifique a URL do MCP (padrão: `http://localhost:6006/mcp`)
3. Verifique logs do Storybook para erros
4. Tente reiniciar o Storybook

## Próximos Passos

1. **Configurar Figma MCP Server** (quando necessário)
2. **Configurar Design Systems MCP** (quando necessário)
3. **Criar scripts de automação adicionais**
4. **Integrar com CI/CD**

## Recursos

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Storybook MCP Addon](https://www.npmjs.com/package/@storybook/addon-mcp)
- [MCP_STRATEGY.md](./MCP_STRATEGY.md) - Estratégia completa de uso
