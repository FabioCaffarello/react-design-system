---
status: draft
---

Se pensando em criar um mcp no story book para auxiliar o desenvolvimento de aplicações em que vão se usar o system design, como poderíamos arquitetar um bom mcp para os desenvolvedores? como poderíamos aumentar a produtividade e também que eles consigam ter uma excelente experiencia como desenvolvedores frontend?
MCP para Storybook - Arquitetura para Design System
Excelente pergunta! Vamos pensar estrategicamente sobre como um MCP (Model Context Protocol) integrado ao Storybook pode transformar a experiência de desenvolvimento com o Design System.
Antes de elaborar o plano, deixa eu explorar o estado atual do seu projeto para entender o que já existe.

# Explore Task

Explore design system codebase (39 toolcalls)
└ Read docs/INDEX.md
ctrl+s right view subagents
Excelente! Agora tenho uma visão completa do projeto. Já vejo que vocês têm o @storybook/addon-mcp instalado e uma infraestrutura de scripts MCP. Vou também verificar a documentação de estratégia MCP existente para não duplicar esforços.
→ Read docs/MCP_STRATEGY.md
→ Read docs/DESIGN_SYSTEMS_MCP.md
→ Read docs/MCP_SETUP.md
→ Read docs/MCP_AUTOMATIONS.md
Agora vou verificar o que a documentação oficial do Storybook MCP addon oferece e como podemos ir além:
→ Read docs/MCP_EXTRACTOR.md
→ Read .storybook/main.ts
→ Read .storybook/preview.tsx
Agora tenho uma visão completa do projeto. Tenho algumas perguntas para refinar o plano antes de propor a arquitetura:

# Questions

Qual é o cenário principal de uso? O MCP seria usado por desenvolvedores que CONSOMEM o design system (ex: devs construindo apps com os componentes) ou pelos MANTENEDORES do design system (devs que criam/evoluem componentes)?
Ambos
Quais ferramentas de AI os desenvolvedores usam primariamente?
Ambos + outros
O MCP customizado seria um servidor standalone separado do @storybook/addon-mcp, ou uma extensão/complemento ao addon existente?
Ambos: standalone + addon
Qual o nível de ambição para esta primeira versão?
Visão estratégica + MVP
Perfeito! Com base na análise completa do projeto e nas suas respostas, vou elaborar a arquitetura estratégica completa.

---

Arquitetura MCP para Design System - Plano Estratégico
Contexto
Vocês já têm uma base sólida:

- @storybook/addon-mcp instalado (tools: list-all-components, get-component-info, capture-screenshot, get-story-info)
- Scripts de automação MCP (health-check, generate-docs, figma-sync, validate-architecture, extract-metadata)
- Documentação extensiva sobre MCP strategy
- Token system dual-layer (CSS + TypeScript) maduro
- Atomic Design rigoroso com ~60 componentes
  O que falta e onde está a oportunidade real de impacto:

1. Arquitetura Proposta: Dual-MCP
   ┌─────────────────────────────────────────────────────────────────┐
   │ Ecossistema MCP do DS │
   │ │
   │ ┌──────────────────────────┐ ┌──────────────────────────────┐ │
   │ │ MCP Standalone (stdio) │ │ Storybook MCP (HTTP addon) │ │
   │ │ "design-system-mcp" │ │ @storybook/addon-mcp │ │
   │ │ │ │ │ │
   │ │ Funciona OFFLINE │ │ Requer Storybook running │ │
   │ │ Lê codebase direto │ │ Acesso visual/runtime │ │
   │ │ │ │ │ │
   │ │ Tools: │ │ Tools: │ │
   │ │ - component-lookup │ │ - list-all-components │ │
   │ │ - token-reference │ │ - get-component-info │ │
   │ │ - pattern-guide │ │ - capture-screenshot │ │
   │ │ - code-scaffold │ │ - get-story-info │ │
   │ │ - validate-usage │ │ │ │
   │ │ - migration-helper │ │ + Custom tools via addon: │ │
   │ │ - a11y-guide │ │ - visual-regression-check │ │
   │ │ - composition-advisor │ │ - interaction-test │ │
   │ └──────────┬───────────────┘ └───────────────┬──────────────┘ │
   │ │ │ │
   │ └───────────┬───────────────────────┘ │
   │ │ │
   │ ┌──────────▼──────────┐ │
   │ │ Shared Knowledge │ │
   │ │ Base (JSON/TS) │ │
   │ │ │ │
   │ │ - component-registry│ │
   │ │ - token-catalog │ │
   │ │ - pattern-catalog │ │
   │ │ - a11y-rules │ │
   │ │ - usage-examples │ │
   │ └─────────────────────┘ │
   └─────────────────────────────────────────────────────────────────┘
   Por que Dual-MCP?
   | Aspecto | Standalone (stdio) | Storybook addon (HTTP) |
   |---------|-------------------|----------------------|
   | Disponibilidade | Sempre (sem deps) | Requer npm run storybook |
   | Velocidade | Instantâneo | Depende do Storybook boot |
   | Dados | Static analysis | Runtime/visual data |
   | Caso de uso | Dev coding no IDE | Review visual, QA |
   | Compatibilidade | Cursor, Claude Code, qualquer MCP client | Qualquer HTTP MCP client |

---

2. MCP Standalone: @motiflow/design-system-mcp
   Este é o core da proposta. Um servidor MCP standalone que funciona via stdio, não depende do Storybook, e dá aos devs acesso instantâneo a todo o conhecimento do design system.
   Tools MVP (8 tools essenciais)
   Tool 1: ds_component_lookup
   Persona: Consumidor + Mantenedor
   Problema que resolve: Dev quer usar um componente mas não sabe qual usar, quais props tem, ou como importar.
   Input: { query: "preciso de um campo de busca com autocomplete" }
   Output: {
   bestMatch: {
   name: "Autocomplete",
   category: "molecules",
   import: "import { Autocomplete } from '@fabio.caffarello/react-design-system/molecules'",
   props: { ... },
   variants: ["default", "outlined", "filled"],
   relatedComponents: ["SearchInput", "MultiSelect", "Dropdown"],
   storybookUrl: "/?path=/docs/molecules-autocomplete--docs",
   usageExample: "..."
   },
   alternatives: [...]
   }
   Como funciona: Busca semântica no component-registry.json + análise de tags/categorias/props.
   Tool 2: ds_token_reference
   Persona: Consumidor + Mantenedor
   Problema que resolve: Dev precisa saber qual token usar para uma cor, spacing, etc.
   Input: { query: "cor de fundo para erro", category: "colors" }
   Output: {
   recommended: {
   css: "var(--color-error-surface)",
   tailwind: "bg-error-surface",
   typescript: "getColor('error', 'surface')",
   value: "#FEF2F2"
   },
   alternatives: [...],
   doNotUse: ["Nunca use cores hardcoded como #ff0000"],
   relatedTokens: [...]
   }
   Tool 3: ds_pattern_guide
   Persona: Consumidor
   Problema que resolve: Dev quer saber o padrão correto para compor componentes.
   Input: { pattern: "form with validation" }
   Output: {
   pattern: "FormWizardPattern",
   description: "...",
   composition: [
   "FormWizard (organism)",
   " ├── Form (molecule)",
   " │ ├── Input (atom)",
   " │ ├── Select (atom)",
   " │ └── Checkbox (atom)",
   " └── Button (atom)"
   ],
   codeExample: "...",
   docsUrl: "...",
   a11yConsiderations: [...]
   }
   Tool 4: ds_code_scaffold
   Persona: Consumidor + Mantenedor
   Problema que resolve: Gerar código que segue os padrões do DS automaticamente.
   Input: {
   type: "page", // "page" | "feature" | "component"
   description: "dashboard com cards de métricas e tabela de dados",
   components: ["Card", "DataTable", "Button"]
   }
   Output: {
   code: "// Generated scaffold...",
   imports: [...],
   tokensUsed: [...],
   warnings: ["DataTable requer DataTablePattern para filtering"],
   nextSteps: [...]
   }
   Tool 5: ds_validate_usage
   Persona: Consumidor + Mantenedor
   Problema que resolve: Verificar se o código está usando o DS corretamente.
   Input: { code: "<div className='bg-red-500 p-4'>...", file: "src/pages/Dashboard.tsx" }
   Output: {
   issues: [
   {
   type: "token-violation",
   severity: "error",
   message: "Use 'bg-error-surface' ao invés de 'bg-red-500'",
   fix: "className='bg-error-surface p-4'"
   },
   {
   type: "missing-component",
   severity: "warning",
   message: "Considere usar <Card> ao invés de <div> com padding"
   }
   ],
   score: 7.5,
   suggestions: [...]
   }
   Tool 6: ds_migration_helper
   Persona: Consumidor
   Problema que resolve: Ajudar na migração entre versões do DS.
   Input: { fromVersion: "1.8.0", toVersion: "1.10.4" }
   Output: {
   breakingChanges: [...],
   deprecations: [...],
   newComponents: [...],
   codemod: "npx @motiflow/ds-codemod v1.8-to-v1.10",
   manualSteps: [...]
   }
   Tool 7: ds_a11y_guide
   Persona: Consumidor + Mantenedor
   Problema que resolve: Orientar sobre acessibilidade no contexto dos componentes do DS.
   Input: { component: "Button", context: "usado como link de navegação" }
   Output: {
   requiredProps: ["aria-label", "role='link'"],
   recommendation: "Use a prop 'as' para renderizar como <a>",
   wcagRules: ["2.1.1 Keyboard", "4.1.2 Name, Role, Value"],
   codeExample: "<Button as='a' href='/page' aria-label='Ir para página'>...",
   doNotDo: ["Não use onClick para navegação sem keyboard support"]
   }
   Tool 8: ds_composition_advisor
   Persona: Consumidor
   Problema que resolve: Aconselhar sobre como compor componentes complexos seguindo Atomic Design.
   Input: {
   goal: "criar uma sidebar com navegação aninhada e indicador de seção ativa",
   constraints: ["responsive", "collapsible"]
   }
   Output: {
   architecture: {
   organism: "SideNavbar",
   molecules: ["Navigation", "NavigationItem"],
   atoms: ["Button", "Badge", "Tooltip"],
   providers: ["ConfigProvider (para breakpoints)"]
   },
   importMap: {...},
   compositionCode: "...",
   responsiveStrategy: "...",
   alternativeApproaches: [...]
   }
   Resources (Context passivo)
   Além das tools, o MCP deve expor resources -- informação que o AI agent pode consumir como contexto:
   | Resource URI | Descrição | Atualização |
   |---|---|---|
   | ds://components/registry | Registry completo de componentes | Build-time |
   | ds://tokens/catalog | Catálogo de todos os design tokens | Build-time |
   | ds://patterns/catalog | Catálogo de patterns de composição | Build-time |
   | ds://architecture/rules | Regras de Atomic Design e importação | Estático |
   | ds://changelog/latest | Changelog das últimas versões | Release-time |
   | ds://a11y/rules | Regras de acessibilidade do DS | Estático |
   Prompts (Workflows pré-definidos)
   Prompts MCP são templates de workflow que o AI pode executar:
   | Prompt | Descrição |
   |---|---|
   | ds_build_feature | Guia passo-a-passo para construir uma feature usando o DS |
   | ds_review_code | Review de código focado em aderência ao DS |
   | ds_create_component | Workflow completo para criar novo componente no DS |
   | ds_debug_styling | Debug de problemas visuais usando tokens do DS |

---

3. Storybook MCP: Extensions
   Complementar o @storybook/addon-mcp existente com:
   Custom Storybook Addon Tools
   Dentro do Storybook, criar um addon complementar que adiciona tools MCP específicas:
   | Tool | O que faz |
   |---|---|
   | ds_visual_compare | Compara visualmente dois estados de um componente |
   | ds_theme_preview | Renderiza componente em todos os temas (light/dark + variants) |
   | ds_responsive_check | Renderiza em todos os viewports e retorna screenshots |
   | ds_interaction_replay | Executa os play functions e retorna resultado |

---

4. Shared Knowledge Base
   A base de conhecimento compartilhada entre os dois MCPs:
   .context/mcp/
   ├── component-registry.json # Auto-gerado pelo build
   ├── token-catalog.json # Auto-gerado do token system
   ├── pattern-catalog.json # Curado manualmente + auto-enriquecido
   ├── architecture-rules.json # Regras de Atomic Design
   ├── a11y-rules.json # Regras de acessibilidade
   ├── composition-examples.json # Exemplos de composição
   └── migration-data/
   ├── v1.8-to-v1.9.json
   └── v1.9-to-v1.10.json
   Pipeline de geração:
   npm run build:mcp-data
   ├── 1. Parse all component files → component-registry.json
   ├── 2. Parse all token files → token-catalog.json
   ├── 3. Analyze stories → pattern-catalog.json (enrichment)
   ├── 4. Extract architecture rules → architecture-rules.json
   └── 5. Bundle for MCP consumption

---

5. Estrutura de Implementação do MCP Standalone
   packages/design-system-mcp/
   ├── package.json
   ├── tsconfig.json
   ├── src/
   │ ├── index.ts # Entry point (MCP server)
   │ ├── server.ts # MCP server setup (stdio + HTTP)
   │ ├── tools/
   │ │ ├── component-lookup.ts
   │ │ ├── token-reference.ts
   │ │ ├── pattern-guide.ts
   │ │ ├── code-scaffold.ts
   │ │ ├── validate-usage.ts
   │ │ ├── migration-helper.ts
   │ │ ├── a11y-guide.ts
   │ │ └── composition-advisor.ts
   │ ├── resources/
   │ │ ├── component-registry.ts
   │ │ ├── token-catalog.ts
   │ │ ├── pattern-catalog.ts
   │ │ └── architecture-rules.ts
   │ ├── prompts/
   │ │ ├── build-feature.ts
   │ │ ├── review-code.ts
   │ │ ├── create-component.ts
   │ │ └── debug-styling.ts
   │ ├── knowledge/
   │ │ ├── loader.ts # Loads .context/mcp/ data
   │ │ ├── search.ts # Semantic search over components
   │ │ └── validator.ts # Validation logic
   │ └── utils/
   │ ├── code-parser.ts # Parse TS/TSX for validation
   │ └── formatter.ts # Format outputs
   ├── data/ # Bundled knowledge base (build output)
   │ ├── component-registry.json
   │ ├── token-catalog.json
   │ └── ...
   └── bin/
   └── mcp-server.js # CLI entry point

---

6. Configuração para Consumidores
   Cursor IDE (.cursor/mcp.json)
   {
   mcpServers: {
   design-system: {
   command: npx,
   args: [-y, @motiflow/design-system-mcp],
   description: Motiflow Design System - component lookup, tokens, patterns, scaffolding
   },
   storybook: {
   type: http,
   url: http://localhost:6006/mcp,
   description: Storybook visual tools (requires: npm run storybook)
   }
   }
   }
   Claude Code (claude_desktop_config.json)
   {
   mcpServers: {
   design-system: {
   command: npx,
   args: [-y, @motiflow/design-system-mcp]
   }
   }
   }
   Qualquer MCP Client (SSE/HTTP mode)
   npx @motiflow/design-system-mcp --transport http --port 3100

---

7. Impacto na DX (Developer Experience)
   Antes (sem MCP)
1. Dev abre Storybook no browser
1. Navega manualmente pelos componentes
1. Copia código de exemplo
1. Vai na documentação procurar tokens
1. Tenta adivinhar composição correta
1. Descobre erros de a11y só no CI
1. Migração entre versões é manual e dolorosa
   Depois (com MCP)
1. Dev pergunta ao AI: "Preciso de um formulário com validação"
1. AI consulta ds_pattern_guide -> retorna padrão FormWizard
1. AI consulta ds_code_scaffold -> gera código completo
1. AI consulta ds_validate_usage -> valida que está correto
1. AI consulta ds_a11y_guide -> adiciona atributos ARIA
1. Dev tem código production-ready em segundos
   Métricas de produtividade esperadas

- Time-to-first-component: de ~15min para ~30s
- Erros de uso de tokens: -90% (validação automática)
- Violações de a11y: -80% (guia proativo)
- Tempo de migração: -70% (migration helper)
- Onboarding de novos devs: de ~1 semana para ~1 dia

---

8. Roadmap de Implementação
   Fase 1 - MVP (2-3 semanas)

- [ ] Criar package packages/design-system-mcp/
- [ ] Implementar MCP server com stdio transport
- [ ] Tool: ds_component_lookup (a mais impactante)
- [ ] Tool: ds_token_reference
- [ ] Tool: ds_code_scaffold
- [ ] Resource: ds://components/registry
- [ ] Resource: ds://tokens/catalog
- [ ] Pipeline de geração de knowledge base
- [ ] Configuração para Cursor + Claude Code
      Fase 2 - Validação & Patterns (2 semanas)
- [ ] Tool: ds_validate_usage
- [ ] Tool: ds_pattern_guide
- [ ] Tool: ds_a11y_guide
- [ ] Resource: ds://patterns/catalog
- [ ] Resource: ds://a11y/rules
- [ ] Prompt: ds_build_feature
- [ ] Prompt: ds_review_code
      Fase 3 - Advanced (2 semanas)
- [ ] Tool: ds_composition_advisor
- [ ] Tool: ds_migration_helper
- [ ] HTTP transport mode
- [ ] Storybook addon custom tools
- [ ] Prompt: ds_create_component
- [ ] Prompt: ds_debug_styling
      Fase 4 - Ecosystem (ongoing)
- [ ] Publicar como npm package
- [ ] Integrar com CI/CD
- [ ] Analytics de uso
- [ ] Figma MCP integration
- [ ] VS Code extension com quick actions

---

9. Decisões Arquiteturais Importantes
   | Decisão | Escolha | Rationale |
   |---------|---------|-----------|
   | Transport | stdio (primary) + HTTP (secondary) | stdio é mais rápido, HTTP permite uso remoto |
   | SDK | @modelcontextprotocol/sdk | SDK oficial TypeScript do MCP |
   | Knowledge base | JSON estático gerado no build | Zero deps runtime, rápido, determinístico |
   | Search | Fuzzy matching (fuse.js) | Leve, sem deps de AI para busca local |
   | Package | Monorepo ou standalone? | Standalone publicado no npm (mais fácil de distribuir) |
   | Versionamento | Alinhado com DS version | Token catalog e registry refletem a versão do DS |

---

Pergunta para prosseguir
Antes de partir para implementação, quero alinhar:

# Questions

O MCP standalone deve ficar dentro deste mesmo repositório (monorepo) ou em um repositório separado?
Neste repo (Recommended)
Quer que eu comece a implementação pela Fase 1 (MVP) agora, ou prefere refinar mais o plano?
Refinar mais o plano
Vou refinar mais o plano. Deixa eu aprofundar nos aspectos técnicos mais críticos.

# Questions

Quais aspectos do plano você gostaria de refinar mais?
Tools API design, Knowledge base pipeline, Arquitetura técnica, DX e configuração, Storybook addon custom, Tudo acima
Excelente, vou fazer o refinamento completo de todos os aspectos. Deixa eu primeiro estudar mais a fundo os componentes e tokens existentes para que os exemplos sejam reais.

# Explore Task

Analyze component patterns deeply (43 toolcalls)
└ Read docs/component-registry.md
ctrl+s right view subagents
Tool execution aborted

# General Task

Research MCP SDK and best practices (9 toolcalls)
└ Webfetch https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/examples/server/src/simpleStreamableHttp.ts (text/plain; charset=utf-8)
ctrl+s right view subagents
▣ Plan · claude-opus-4-5 · interrupted
pode continuar com o plano
Vou continuar refinando o plano completo. Deixa eu primeiro recuperar os dados dos componentes e tokens que preciso para os exemplos reais.

# Explore Task

Deep analysis of DS components (48 toolcalls)
└ Read src/ui/molecules/Autocomplete/AutocompleteOption.tsx
ctrl+s right view subagents
Agora tenho todos os dados necessários para o refinamento completo. Vou estruturar o plano detalhado.

# Todos

[•]
Refinamento: Tools API Design (input schemas, outputs, exemplos reais)
[ ]
Refinamento: Knowledge Base Pipeline (extração, transformação, formato)
[ ]
Refinamento: Arquitetura Técnica (código do server, estrutura, deps, build)
[ ]
Refinamento: DX & Configuração (onboarding, setup, ergonomia)
[ ]
Refinamento: Storybook Addon Custom (extensão MCP visual)
[ ]
Consolidar tudo em plano final coerente

---

# PLANO REFINADO COMPLETO: MCP para Design System

## PARTE 1 — Tools API Design

## Cada tool é especificada com: **schema Zod exato**, **exemplo de input/output com dados reais do DS**, **edge cases**, e **como busca na knowledge base**.

Tool 1: ds_component_lookup
Propósito: Buscar componentes por nome, funcionalidade, ou necessidade descrita em linguagem natural.
Schema (Zod):
inputSchema: {
query: z.string().describe(
"Nome do componente, funcionalidade desejada, ou descrição em linguagem natural. " +
"Ex: 'Button', 'campo de busca com autocomplete', 'tabela com paginação'"
),
category: z.enum(["atoms", "molecules", "organisms", "layouts", "patterns", "templates", "all"])
.default("all")
.describe("Filtrar por categoria Atomic Design"),
includeProps: z.boolean().default(true)
.describe("Incluir lista de props na resposta"),
includeExample: z.boolean().default(true)
.describe("Incluir exemplo de código"),
}
Exemplo REAL — busca por nome:
Input: { query: "Button", category: "all", includeProps: true, includeExample: true }
Output: {
found: true,
component: {
name: "Button",
category: "atoms",
path: "src/ui/atoms/Button/Button.tsx",
description: "Botão versátil com variantes, tamanhos, loading state, ícones e suporte polimórfico (prop `as`)",
import: "import { Button } from '@fabio.caffarello/react-design-system/atoms'",
props: {
variant: { type: "ButtonVariant", values: ["primary","secondary","error","outline","ghost","iconOnly"], default: "primary", required: false },
size: { type: "ButtonSize", values: ["sm","md","lg"], default: "md", required: false },
isLoading: { type: "boolean", default: "false", required: false },
loadingText: { type: "string", required: false },
leftIcon: { type: "ReactNode", required: false },
rightIcon: { type: "ReactNode", required: false },
fullWidth: { type: "boolean", default: "false", required: false },
as: { type: "ElementType", default: "'button'", description: "Renderizar como outro elemento (ex: 'a' para link)" },
children: { type: "ReactNode", required: true }
},
tokensUsed: ["colors (primary, secondary, error, neutral)", "spacing (sm, base, lg)", "typography (bodySmall, body, bodyLarge)", "radius (md)"],
stories: ["Primary", "Secondary", "Error", "Outline", "Ghost", "IconOnly", "Sizes", "WithIcons", "Loading", "FullWidth", "AsLink", "WithEvents", "DisabledState", "FocusState"],
storybookUrl: "/?path=/docs/atoms-button--docs",
relatedComponents: ["Spinner (usado internamente no loading)", "Badge (frequentemente combinado)"],
example: `import { Button } from '@fabio.caffarello/react-design-system/atoms';
import { Save, ChevronRight } from 'lucide-react';
// Básico
<Button variant="primary" size="md" onClick={handleSave}>
  Salvar
</Button>
// Com ícones
<Button leftIcon={<Save size={16} />} rightIcon={<ChevronRight size={16} />}>
  Salvar e continuar
</Button>
// Loading
<Button isLoading loadingText="Salvando...">
  Salvar
</Button>
// Como link
<Button as="a" href="/dashboard" variant="outline">
  Ir para Dashboard
</Button>`
},
alternatives: []
}
Exemplo REAL — busca semântica:
Input: { query: "preciso de um campo de busca com sugestões automáticas", category: "all" }
Output: {
found: true,
component: {
name: "Autocomplete",
category: "molecules",
path: "src/ui/molecules/Autocomplete/Autocomplete.tsx",
description: "Campo de busca com sugestões automáticas, debounce, filtragem customizável, e suporte a grupos",
import: "import { Autocomplete } from '@fabio.caffarello/react-design-system/molecules'",
props: {
options: { type: "AutocompleteOptionType[]", required: true, description: "{ value: string, label: string, disabled?: boolean, icon?: ReactNode, group?: string }" },
value: { type: "string", required: false, description: "Valor controlado" },
onChange: { type: "(value: string) => void", required: false },
onSelect: { type: "(option: AutocompleteOptionType) => void", required: false },
debounceMs: { type: "number", default: "300", required: false },
filterOptions: { type: "(options, searchValue) => options", required: false, description: "Função de filtro customizada" },
size: { type: "'sm' | 'md' | 'lg'", default: "'md'", required: false }
},
// ... example, etc.
},
alternatives: [
{ name: "SearchInput", category: "molecules", reason: "Mais simples, sem dropdown de sugestões" },
{ name: "MultiSelect", category: "molecules", reason: "Se precisar selecionar múltiplos valores" },
{ name: "Dropdown", category: "molecules", reason: "Se as opções são fixas e pré-definidas" }
]
}
Edge cases:

- Query vazia → retorna overview das categorias com contagens
- Componente não encontrado → retorna found: false com sugestões do mais próximo
- Query ambígua (ex: "input") → retorna múltiplos matches ranqueados por relevância
  Lógica de busca:

1. Exact match no nome → retorno imediato
2. Fuzzy match via fuse.js (threshold 0.4) sobre nome + description + tags
3. Keyword match nas props (ex: "loading" encontra Button porque tem isLoading)
4. Filtro por categoria se especificado

---

Tool 2: ds_token_reference
Schema:
inputSchema: {
query: z.string().describe(
"O que você quer estilizar. Ex: 'cor de erro', 'espaçamento entre cards', " +
"'sombra para modal', 'tamanho de fonte para heading'"
),
domain: z.enum(["colors", "spacing", "typography", "shadows", "radius", "borders",
"animations", "z-index", "opacity", "gradients", "breakpoints", "all"])
.default("all")
.describe("Domínio do token"),
format: z.enum(["css", "tailwind", "typescript", "all"])
.default("all")
.describe("Formato de saída desejado"),
theme: z.enum(["light", "dark"]).default("light")
.describe("Tema de referência"),
}
Exemplo REAL — cor semântica:
Input: { query: "cor de fundo para estado de erro", domain: "colors", format: "all" }
Output: {
found: true,
token: {
domain: "colors",
role: "error",
shade: "light",
description: "Cor de fundo suave para indicar estado de erro (WCAG AA compliant)",
formats: {
css: "var(--color-error-light)",
tailwind: "bg-rose-100",
typescript: "getColorClass('error', 'light', 'bg')",
rawValue: { hex: "#FFE4E6", rgb: "255, 228, 230" }
},
usage: "Use para backgrounds de alertas, banners de erro, campos com validação falha",
a11y: {
contrastWithText: "Usar text-rose-900 (getColorClass('error','dark','text')) para contraste AA",
wcagRatio: "12.5:1 com texto escuro"
}
},
related: [
{ role: "error", shade: "DEFAULT", tailwind: "bg-rose-500", use: "Cor de destaque/borda de erro" },
{ role: "error", shade: "dark", tailwind: "bg-rose-700", use: "Texto de mensagem de erro" },
{ role: "error", shade: "contrast", tailwind: "text-white", use: "Texto sobre fundo de erro DEFAULT" }
],
doNotUse: [
"Não use bg-red-500 diretamente — use sempre os tokens semânticos",
"Não misture paletas (ex: rose para erro e red para warning)"
]
}
Exemplo REAL — espaçamento:
Input: { query: "gap entre items de uma lista", domain: "spacing", format: "tailwind" }
Output: {
found: true,
token: {
domain: "spacing",
name: "sm",
description: "Espaçamento pequeno (8px) — ideal para gap entre items de lista",
formats: {
tailwind: "gap-2",
css: "var(--spacing-sm)",
typescript: "getSpacingClass('sm', 'gap')"
},
value: { px: "8px", rem: "0.5rem", scale: 2 }
},
related: [
{ name: "xs", tailwind: "gap-1", px: "4px", use: "Gap compacto (chips, tags)" },
{ name: "md", tailwind: "gap-3", px: "12px", use: "Gap médio (cards em grid)" },
{ name: "base", tailwind: "gap-4", px: "16px", use: "Gap padrão (seções)" }
],
scaleReference: [
"none=0px | xs=4px | sm=8px | md=12px | base=16px | lg=24px | xl=32px | 2xl=40px | 3xl=48px"
]
}
Exemplo REAL — tipografia:
Input: { query: "fonte para título principal da página", domain: "typography" }
Output: {
found: true,
token: {
domain: "typography",
name: "heading1",
description: "Heading principal (h1) — usado para títulos de página",
formats: {
tailwind: "text-4xl font-bold leading-tight",
css: "font-size: var(--font-size-4xl); font-weight: var(--font-weight-bold); line-height: var(--line-height-tight);",
typescript: "getTypographyClasses('heading1')"
},
relatedHelper: "typography('heading1') // do utils/variants.ts"
},
hierarchy: [
"heading1 → text-4xl font-bold (título da página)",
"heading2 → text-3xl font-semibold (seções principais)",
"heading3 → text-2xl font-semibold (subseções)",
"heading4 → text-xl font-medium (cards, painéis)",
"body → text-base font-normal (texto padrão)",
"bodySmall → text-sm font-normal (texto secundário)",
"caption → text-xs font-normal (labels, legendas)"
]
}

---

Tool 3: ds_code_scaffold
Schema:
inputSchema: {
type: z.enum(["page", "feature", "form", "list", "dashboard", "layout"])
.describe("Tipo de scaffold"),
description: z.string()
.describe("Descrição do que precisa construir"),
components: z.array(z.string()).optional()
.describe("Componentes específicos a incluir (opcional)"),
options: z.object({
withTheme: z.boolean().default(false).describe("Incluir ThemeProvider"),
withForm: z.boolean().default(false).describe("Incluir react-hook-form + zod"),
withResponsive: z.boolean().default(true).describe("Incluir responsive breakpoints"),
framework: z.enum(["nextjs-app", "nextjs-pages", "vite-react", "generic"]).default("generic"),
}).optional(),
}
Exemplo REAL:
Input: {
type: "form",
description: "formulário de login com email, senha e botão de submit",
options: { withForm: true, framework: "nextjs-app" }
}
Output: {
scaffold: {
code: `'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@fabio.caffarello/react-design-system/atoms';
import { Form } from '@fabio.caffarello/react-design-system/molecules';
import { Input } from '@fabio.caffarello/react-design-system/atoms';
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});
type LoginFormData = z.infer<typeof loginSchema>;
export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };
  return (
    <Form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-sm">
      <Form.Field
        label="Email"
        error={form.formState.errors.email?.message}
      >
        <Input
          type="email"
          placeholder="seu@email.com"
          {...form.register('email')}
          aria-invalid={!!form.formState.errors.email}
          aria-describedby="email-error"
        />
      </Form.Field>
      <Form.Field
        label="Senha"
        error={form.formState.errors.password?.message}
      >
        <Input
          type="password"
          placeholder="********"
          {...form.register('password')}
          aria-invalid={!!form.formState.errors.password}
          aria-describedby="password-error"
        />
      </Form.Field>
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={form.formState.isSubmitting}
        loadingText="Entrando..."
      >
        Entrar
      </Button>
    </Form>
  );
}`,
imports: [
"@fabio.caffarello/react-design-system/atoms → Button, Input",
"@fabio.caffarello/react-design-system/molecules → Form",
"react-hook-form → useForm",
"@hookform/resolvers/zod → zodResolver",
"zod → z"
],
tokensUsed: [
"spacing: gap-4 (getSpacingClass('base', 'gap'))",
"colors: via Button primary variant",
"typography: via Input/Form default styles"
],
peerDepsRequired: ["react-hook-form", "@hookform/resolvers", "zod"],
a11yNotes: [
"aria-invalid vinculado ao estado de erro",
"aria-describedby aponta para mensagens de erro",
"Button type='submit' para semântica correta",
"Labels vinculados via Form.Field"
],
nextSteps: [
"Adicionar onSubmit real com chamada API",
"Considerar LoginBox (organism) se precisar de layout completo com logo e links",
"Adicionar 'Esqueci minha senha' como link com Button variant='ghost'"
]
}
}

---

Tool 4: ds_validate_usage
Schema:
inputSchema: {
code: z.string().describe("Código TSX/JSX a validar"),
filePath: z.string().optional().describe("Caminho do arquivo (para contexto)"),
strictness: z.enum(["relaxed", "standard", "strict"]).default("standard")
.describe("Nível de rigor da validação"),
}
Exemplo REAL:
Input: {
code: `<div className="bg-red-500 p-4 rounded-lg shadow-md">

  <h2 className="text-white text-xl font-bold mb-2">Erro</h2>
  <p className="text-gray-100 text-sm">Algo deu errado</p>
  <button className="mt-4 bg-white text-red-500 px-4 py-2 rounded">
    Tentar novamente
  </button>
</div>`,
  strictness: "standard"
}
Output: {
  score: 2.5,        // de 0-10
  maxScore: 10,
  level: "needs-improvement",
  issues: [
    {
      line: 1,
      type: "token-violation",
      severity: "error",
      current: "bg-red-500",
      recommended: "bg-error-surface ou getColorClass('error', 'DEFAULT', 'bg')",
      message: "Use tokens semânticos ao invés de cores primitivas",
      rule: "DS-COLOR-001"
    },
    {
      line: 1,
      type: "token-violation",
      severity: "warning",
      current: "p-4",
      recommended: "Use getSpacingClass('base', 'p') para consistência",
      message: "Preferir tokens de spacing do DS (funciona, mas perde rastreabilidade)",
      rule: "DS-SPACING-001"
    },
    {
      line: 1,
      type: "missing-component",
      severity: "error",
      current: "<div> com styling manual",
      recommended: "import { Card } from '@fabio.caffarello/react-design-system/molecules'",
      message: "Use <Card variant='default' padding='medium'> ao invés de <div> styled",
      rule: "DS-COMPONENT-001"
    },
    {
      line: 2,
      type: "token-violation",
      severity: "error",
      current: "text-xl font-bold",
      recommended: "Use typography('heading4') ou getTypographyClasses('heading4')",
      message: "Use tokens de tipografia do DS",
      rule: "DS-TYPOGRAPHY-001"
    },
    {
      line: 4,
      type: "missing-component",
      severity: "error",
      current: "<button> nativo com styling manual",
      recommended: "import { Button } from '@fabio.caffarello/react-design-system/atoms'",
      message: "Use <Button variant='outline'> ao invés de <button> nativo",
      rule: "DS-COMPONENT-002"
    },
    {
      line: 4,
      type: "a11y-violation",
      severity: "warning",
      current: "<button> sem type",
      recommended: "Adicione type='button' explicitamente",
      message: "Botões sem type defaultam para 'submit' dentro de forms",
      rule: "DS-A11Y-001"
    }
  ],
  suggestedRewrite: `import { Card } from '@fabio.caffarello/react-design-system/molecules';
import { Button } from '@fabio.caffarello/react-design-system/atoms';
import { Text } from '@fabio.caffarello/react-design-system/atoms';
<Card variant="default" padding="medium" className="bg-error-surface">
  <Text as="h2" variant="heading4" className="text-error-dark mb-2">Erro</Text>
  <Text variant="bodySmall" className="text-neutral-dark">Algo deu errado</Text>
  <Button variant="outline" size="md" className="mt-4" onClick={handleRetry}>
    Tentar novamente
  </Button>
</Card>`,
  summary: "6 issues encontrados. O código usa HTML nativo e cores hardcoded ao invés dos componentes e tokens do Design System."
}
---
Tool 5: ds_pattern_guide
Schema:
inputSchema: {
  pattern: z.string().describe(
    "Descrição do padrão de UI. Ex: 'tabela com filtros e paginação', " +
    "'wizard multi-step', 'dashboard layout com sidebar'"
  ),
  complexity: z.enum(["simple", "intermediate", "complex"]).default("intermediate")
    .describe("Nível de complexidade desejado"),
}
Exemplo REAL:
Input: { pattern: "tabela de dados com filtros, ordenação e paginação", complexity: "complex" }
Output: {
  pattern: {
    name: "DataTablePattern",
    category: "patterns",
    path: "src/ui/patterns/DataTablePattern/",
    description: "Padrão completo de tabela de dados com composição de organisms",
    architecture: {
      tree: `DataTablePattern (pattern)
├── SearchAndFilterPattern (pattern) — barra de busca + filtros
│   ├── SearchInput (molecule) — busca com debounce
│   └── Dropdown (molecule) — filtros
├── Table (organism) — tabela principal
│   ├── TableHeader (sub) — cabeçalhos ordenáveis
│   ├── TableBody (sub) — corpo com linhas
│   ├── TableRow (sub) — linha individual
│   └── TableCell (sub) — célula
├── TablePagination (organism sub) — paginação
│   ├── Button (atom) — navegação
│   └── Text (atom) — info de página
└── TableActions (organism sub) — ações em batch
    ├── Button (atom) — ações
    └── Checkbox (atom) — seleção`,
      atomicLevels: {
        atoms: ["Button", "Checkbox", "Text", "Badge", "Input"],
        molecules: ["SearchInput", "Dropdown"],
        organisms: ["Table (com sub-componentes)"],
        patterns: ["DataTablePattern", "SearchAndFilterPattern"]
      }
    },
    imports: `import { Table } from '@fabio.caffarello/react-design-system/organisms';
// Table expõe compound components:
// Table, Table.Header, Table.Body, Table.Row, Table.Cell, 
// Table.HeaderCell, Table.Pagination, Table.Actions`,
    codeExample: `// Uso básico do padrão
import { Table } from '@fabio.caffarello/react-design-system/organisms';
import { SearchInput, Dropdown } from '@fabio.caffarello/react-design-system/molecules';
import { Button, Badge } from '@fabio.caffarello/react-design-system/atoms';
function UsersTable({ users, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [page, setPage] = useState(1);
  const filtered = users.filter(u => u.name.includes(search));
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar usuários..."
        />
        <Dropdown
          options={[{ label: 'Ativo', value: 'active' }, { label: 'Inativo', value: 'inactive' }]}
          placeholder="Status"
        />
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sortable onSort={() => setSortBy('name')}>Nome</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Ações</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filtered.map(user => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                <Badge variant={user.active ? 'success' : 'neutral'}>
                  {user.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>Editar</Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(user)}>Excluir</Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
        <Table.Pagination
          currentPage={page}
          totalPages={10}
          onPageChange={setPage}
        />
      </Table>
    </div>
  );
}`,
    a11yRequirements: [
      "Table deve ter <caption> ou aria-label descrevendo o conteúdo",
      "HeaderCells sortáveis precisam de aria-sort='ascending|descending|none'",
      "Paginação precisa de nav aria-label='Paginação'",
      "Botões de ação precisam de aria-label contextual (ex: 'Editar João Silva')"
    ]
  }
}
---
Tool 6: ds_a11y_guide
Schema:
inputSchema: {
  component: z.string().optional()
    .describe("Componente específico do DS"),
  context: z.string().optional()
    .describe("Contexto de uso (ex: 'botão que abre modal')"),
  wcagLevel: z.enum(["A", "AA", "AAA"]).default("AA"),
}
---
Tool 7: ds_composition_advisor
Schema:
inputSchema: {
  goal: z.string().describe("O que quer construir"),
  constraints: z.array(z.string()).optional()
    .describe("Restrições (ex: ['responsive', 'dark-mode', 'SSR'])"),
  existingComponents: z.array(z.string()).optional()
    .describe("Componentes que já está usando na página"),
}
---
Tool 8: ds_migration_helper
Schema:
inputSchema: {
  code: z.string().optional().describe("Código a migrar"),
  fromVersion: z.string().optional().describe("Versão de origem"),
  toVersion: z.string().optional().default("latest"),
}
# Todos
[✓] 
Refinamento: Tools API Design (input schemas, outputs, exemplos reais)
[•] 
Refinamento: Knowledge Base Pipeline (extração, transformação, formato)
[ ] 
Refinamento: Arquitetura Técnica (código do server, estrutura, deps, build)
[ ] 
Refinamento: DX & Configuração (onboarding, setup, ergonomia)
[ ] 
Refinamento: Storybook Addon Custom (extensão MCP visual)
[ ] 
Consolidar tudo em plano final coerente
---
PARTE 2 — Knowledge Base Pipeline
O MCP precisa de dados pré-processados para responder rápido. A knowledge base é gerada no build-time e embarcada no pacote MCP.
2.1 — Arquitetura da Pipeline
┌─────────────────────────────────────────────────────────────┐
│                   BUILD-TIME PIPELINE                        │
│                                                              │
│  npm run build:mcp-knowledge                                 │
│                                                              │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────┐  │
│  │  Extractors  │───▶│  Transformers │───▶│  Knowledge DB  │  │
│  │  (read code) │    │  (normalize)  │    │  (JSON files)  │  │
│  └─────────────┘    └──────────────┘    └────────────────┘  │
│                                                              │
│  Extractors:                                                 │
│  ├── component-extractor.ts  (parse .tsx → props, variants)  │
│  ├── token-extractor.ts      (parse tokens/ → catalog)       │
│  ├── story-extractor.ts      (parse .stories.tsx → metadata) │
│  ├── pattern-extractor.ts    (parse patterns/ → compositions)│
│  └── import-extractor.ts     (parse imports → dependency map)│
│                                                              │
│  Output → packages/design-system-mcp/data/                   │
│  ├── component-registry.json   (enriched)                    │
│  ├── token-catalog.json                                      │
│  ├── pattern-catalog.json                                    │
│  ├── architecture-rules.json                                 │
│  ├── search-index.json         (fuse.js pre-built index)     │
│  └── a11y-guide.json                                         │
└─────────────────────────────────────────────────────────────┘
2.2 — Formatos dos dados gerados
component-registry.json (enriquecido)
Diferente do registry existente em docs/component-registry.json (que tem propsCount: 0 para todos), este será completo:
{
  version: 1.10.4,
  generatedAt: 2026-01-28T...,
  components: {
    Button: {
      name: Button,
      category: atoms,
      path: src/ui/atoms/Button/Button.tsx,
      import: {
        named: import { Button } from '@fabio.caffarello/react-design-system/atoms',
        default: import Button from '@fabio.caffarello/react-design-system/atoms/Button'
      },
      description: Botão versátil com variantes, tamanhos, loading state e suporte polimórfico,
      props: [
        {
          name: variant,
          type: ButtonVariant,
          values: [primary, secondary, error, outline, ghost, iconOnly],
          default: primary,
          required: false,
          description: Estilo visual do botão
        },
        {
          name: size,
          type: ButtonSize,
          values: [sm, md, lg],
          default: md,
          required: false
        },
        {
          name: isLoading,
          type: boolean,
          default: false,
          required: false,
          description: Mostra spinner e desabilita interação
        },
        {
          name: as,
          type: ElementType,
          default: 'button',
          required: false,
          description: Elemento HTML a renderizar (polimórfico)
        }
      ],
      patterns: {
        designPattern: forwardRef + memo + CVA,
        compoundComponents: false,
        polymorphic: true,
        controlled: false
      },
      tokens: {
        colors: [primary, secondary, error, neutral],
        spacing: [sm, base, lg],
        typography: [bodySmall, body, bodyLarge],
        radius: [md]
      },
      dependencies: {
        internal: [Spinner],
        external: []
      },
      stories: [
        { name: Primary, type: args },
        { name: WithEvents, type: play-function },
        { name: Sizes, type: render }
      ],
      a11y: {
        role: button,
        requiredAria: [],
        recommendedAria: [aria-label (quando iconOnly)],
        keyboardSupport: [Enter, Space],
        focusIndicator: ring-2 ring-offset-2
      },
      tags: [interactive, form-element, polymorphic, loading-state],
      relatedComponents: [Spinner, Badge, ButtonGroup]
    }
  }
}
token-catalog.json
{
  version: 2.0.0,
  brand: AIppin,
  domains: {
    colors: {
      description: Sistema de cores semânticas com light/dark themes,
      strategy: LightColorStrategy / DarkColorStrategy,
      roles: {
        primary: {
          light: { hex: #E0E7FF, tailwind: indigo-100, cssVar: --color-primary-light },
          DEFAULT: { hex: #6366F1, tailwind: indigo-500, cssVar: --color-primary },
          dark: { hex: #4338CA, tailwind: indigo-700, cssVar: --color-primary-dark },
          contrast: { hex: #FFFFFF, tailwind: white, cssVar: --color-primary-contrast }
        }
      },
      helpers: {
        getColor: getColor(role, shade) → hex string,
        getColorClass: getColorClass(role, shade, type) → Tailwind class (ex: 'bg-indigo-500'),
        getHoverColorClass: getHoverColorClass(role, shade, type) → 'hover:bg-indigo-600',
        getFocusRingClass: getFocusRingClass(role, shade) → 'focus:ring-indigo-500'
      },
      doNotUse: [
        Nunca use cores primitivas diretamente (ex: bg-red-500),
        Use sempre getColorClass() ou tokens semânticos
      ]
    },
    spacing: {
      description: Escala de espaçamento baseada em 4px,
      baseUnit: 4px,
      scale: {
        none: { value: 0, px: 0px, rem: 0rem, tailwind: 0 },
        xs: { value: 1, px: 4px, rem: 0.25rem, tailwind: 1 },
        sm: { value: 2, px: 8px, rem: 0.5rem, tailwind: 2 },
        md: { value: 3, px: 12px, rem: 0.75rem, tailwind: 3 },
        base: { value: 4, px: 16px, rem: 1rem, tailwind: 4 },
        lg: { value: 6, px: 24px, rem: 1.5rem, tailwind: 6 },
        xl: { value: 8, px: 32px, rem: 2rem, tailwind: 8 }
      },
      helpers: {
        getSpacing: getSpacing(name) → SpacingToken object,
        getSpacingClass: getSpacingClass(name, direction) → 'p-4', 'mx-2', 'gap-4'
      }
    }
  }
}
pattern-catalog.json
{
  patterns: {
    DataTablePattern: {
      name: DataTablePattern,
      description: Tabela de dados com filtros, ordenação e paginação,
      category: patterns,
      composition: {
        root: DataTablePattern,
        children: [
          { component: SearchAndFilterPattern, level: pattern, role: filtering },
          { component: Table, level: organism, role: data-display },
          { component: TablePagination, level: organism-sub, role: pagination }
        ]
      },
      atomicLevels: {
        atoms: [Button, Checkbox, Input, Text, Badge],
        molecules: [SearchInput, Dropdown],
        organisms: [Table],
        patterns: [SearchAndFilterPattern]
      }
    },
    FormWizardPattern: { },
    SearchAndFilterPattern: { }
  },
  compositions: {
    form-with-validation: {
      description: Formulário com validação via react-hook-form + zod,
      components: [Form, Input, Button, Select, Checkbox],
      peerDeps: [react-hook-form, @hookform/resolvers, zod]
    },
    dashboard-layout: {
      description: Layout de dashboard com sidebar e header,
      components: [DashboardLayout, SideNavbar, Header, Container]
    }
  }
}
architecture-rules.json
{
  atomicDesign: {
    importRules: {
      atoms: {
        canImport: [tokens, utils, hooks, shared],
        cannotImport: [atoms, molecules, organisms, patterns, templates]
      },
      molecules: {
        canImport: [atoms, tokens, utils, hooks, shared],
        cannotImport: [molecules, organisms, patterns, templates]
      },
      organisms: {
        canImport: [atoms, molecules, organisms, tokens, utils, hooks, shared],
        cannotImport: [patterns, templates]
      },
      patterns: {
        canImport: [atoms, molecules, organisms, tokens, utils, hooks, shared],
        cannotImport: [templates]
      }
    },
    componentRules: {
      atoms: Use memo(forwardRef(...)), CVA variants, displayName,
      molecules: Compose atoms, 'use client' if stateful,
      organisms: Compound component pattern for complex UIs
    }
  },
  conventions: {
    naming: PascalCase para componentes, camelCase para hooks/utils,
    fileStructure: {Name}/{Name}.tsx + {Name}.test.tsx + {Name}.stories.tsx + index.ts,
    styling: Tailwind via cn() + cva(), nunca inline styles (exceto CSS vars dinâmicas),
    exports: Named + default export, barrel re-export no index.ts da categoria
  },
  validation: {
    tokenUsage: [
      { rule: DS-COLOR-001, description: Cores devem usar tokens semânticos (getColorClass), severity: error },
      { rule: DS-SPACING-001, description: Spacing deve usar tokens (getSpacingClass), severity: warning },
      { rule: DS-TYPOGRAPHY-001, description: Tipografia deve usar tokens (getTypographyClasses), severity: warning },
      { rule: DS-COMPONENT-001, description: Preferir componentes do DS sobre HTML nativo, severity: error },
      { rule: DS-A11Y-001, description: Atributos ARIA obrigatórios presentes, severity: error }
    ]
  }
}
search-index.json
Índice pré-construído para fuse.js, permitindo busca semântica instantânea:
{
  options: {
    keys: [
      { name: name, weight: 2.0 },
      { name: description, weight: 1.5 },
      { name: tags, weight: 1.2 },
      { name: category, weight: 0.8 },
      { name: props.name, weight: 0.5 }
    ],
    threshold: 0.4,
    distance: 100,
    includeScore: true
  },
  records: [
    {
      id: Button,
      name: Button,
      description: Botão versátil com variantes, tamanhos, loading state e polimorfismo,
      category: atoms,
      tags: [interactive, form-element, polymorphic, loading-state, icon-support],
      props: [{ name: variant }, { name: size }, { name: isLoading }]
    }
  ]
}
2.3 — Extractors (como funcionam)
Os extractors usam TypeScript Compiler API (ou ts-morph) para análise estática:
// scripts/mcp-knowledge/extractors/component-extractor.ts
import { Project } from 'ts-morph';
export function extractComponentMetadata(componentPath: string) {
  const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
  const sourceFile = project.getSourceFileOrThrow(componentPath);
  
  // 1. Encontrar interface de Props
  const propsInterface = sourceFile.getInterfaces()
    .find(i => i.getName().endsWith('Props'));
  
  // 2. Extrair props
  const props = propsInterface?.getProperties().map(prop => ({
    name: prop.getName(),
    type: prop.getType().getText(),
    required: !prop.hasQuestionToken(),
    description: prop.getJsDocs()[0]?.getDescription() || '',
    default: extractDefaultValue(prop),
  }));
  
  // 3. Encontrar CVA variants
  const cvaCall = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
    .find(call => call.getExpression().getText() === 'cva');
  
  // 4. Extrair imports de tokens
  const tokenImports = sourceFile.getImportDeclarations()
    .filter(imp => imp.getModuleSpecifierValue().includes('tokens'));
  
  // ... etc
}
2.4 — Pipeline npm script
{
  scripts: {
    build:mcp-knowledge: tsx scripts/mcp-knowledge/build.ts,
    build:mcp: npm run build:mcp-knowledge && npm run build:mcp-server,
    build:mcp-server: tsup packages/design-system-mcp/src/index.ts --format cjs,esm --dts
  }
}
O build.ts orquestra todos os extractors e gera os arquivos em packages/design-system-mcp/data/.
# Todos
[✓] 
Refinamento: Tools API Design (input schemas, outputs, exemplos reais)
[✓] 
Refinamento: Knowledge Base Pipeline (extração, transformação, formato)
[•] 
Refinamento: Arquitetura Técnica (código do server, estrutura, deps, build)
[ ] 
Refinamento: DX & Configuração (onboarding, setup, ergonomia)
[ ] 
Refinamento: Storybook Addon Custom (extensão MCP visual)
[ ] 
Consolidar tudo em plano final coerente
