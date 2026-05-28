# Plano de poda & setup do ambiente Claude Code

Objetivo: transformar o design system atual (over-engineered, multi-time) num
design system **mono-marca, solo, enxuto**, com um ambiente `.claude` de primeira
para tocar tudo via Claude Code.

Faça **um passo por vez**, em branches separadas, verificando o build entre
cada um. A ordem importa: remova o que não tem dependências internas primeiro,
colapse a arquitetura por último.

---

## Fase 0 — Salvaguardas (antes de tocar em qualquer coisa)

```bash
git checkout -b prune/setup
git tag pre-prune            # ponto de retorno se algo der errado
npm install && npm run build && npm run test   # baseline verde
```

Se o baseline já estiver vermelho, conserte ANTES de podar — você não quer
confundir bug pré-existente com dano da poda.

---

## Fase 1 — Instalar o ambiente .claude

Copie o conteúdo do pacote entregue para a raiz do repo:

- `CLAUDE.md` → raiz do repositório
- pasta `.claude/` → raiz do repositório
- remova a pasta antiga: `git rm -r .opencode`

```bash
git add CLAUDE.md .claude
git rm -r .opencode AGENTS.md   # AGENTS.md era do opencode; CLAUDE.md o substitui
git commit -m "chore: add Claude Code environment, remove opencode"
```

A partir daqui você já pode rodar `claude` no repo e usar `/prune` e
`/new-component`. As próximas fases podem ser feitas prompando o Claude Code
com `/prune <alvo>` — ele segue o procedimento seguro do comando.

---

## Fase 2 — Remover features de consumidor externo (sem dependências internas)

Cada uma é independente. Faça uma por commit. Via Claude Code: `/prune mcp` etc.

| Alvo               | O que remover                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mcp`              | `docs/MCP_*.md`, `docs/DESIGN_SYSTEMS_MCP.md`, `docs/FIGMA_MCP_INTEGRATION.md`, `docs/QUICK_START_MCP.md`, qualquer config de MCP server própria do projeto |
| `figma`            | `docs/FIGMA_INTEGRATION.md`, scripts/integrações de Figma                                                                                                   |
| `registry`         | Component Registry System e docs relacionadas                                                                                                               |
| `token-versioning` | `docs/TOKENS_VERSIONING.md` e a maquinaria de versionar tokens                                                                                              |
| `migration`        | `docs/MIGRATION_GUIDES.md`                                                                                                                                  |

Verificação após cada um: `npm run build && npm run test`.

---

## Fase 3 — Remover features pesadas de produto

```text
/prune flow
```

Remove `src/ui/extensions/flow/`, `src/ui/organisms/Flow/`, o FlowPlayground,
e a dependência `@xyflow/react` do package.json. É o maior corte único —
confira o blast radius com cuidado (o comando /prune faz isso).

```text
/prune playgrounds
/prune theme-builder
```

Remove `src/ui/playgrounds/` e `src/ui/tools/ThemeBuilder`. Mantenha **apenas**
uma story `Tokens` que documente os valores (o `/prune` deve preservá-la ou
você recria depois com `/new-component` mentalidade de doc).

---

## Fase 4 — Reduzir scripts e validações

No `package.json`, remova os scripts que policiavam a complexidade agora extinta:

- `validate:all`, `validate-stories`, `validate-architecture`, `validate-a11y`,
  `validate-themes`
- `generate-story-index`, `generate-context-diagram`

Remova também os arquivos correspondentes em `scripts/`. O enforcement agora
vem dos `rules/` + hook de formatação do `.claude`, não de scripts manuais.

Scripts que ficam: `dev`, `build`, `storybook`, `build-storybook`, `test`,
`test:coverage`, `lint`, `plop`. (Mantive `test:coverage` e `build-storybook`
porque o CI usa; corte se não usar.)

```bash
npm run lint && npm run test && npm run build
git commit -m "chore: reduce script surface to essentials"
```

---

## Fase 5 — Colapsar a arquitetura (último, mais invasivo)

De 5+ camadas para 3. Faça com o Claude Code, um movimento por vez, rodando
testes entre cada um:

```
atoms/      → primitives/
molecules/  → components/   (componentes compostos)
organisms/  → components/
templates/  → components/   (ou layouts/, caso aplicável)
patterns/   → components/
layouts/    → layouts/      (mantém)
```

Para cada mover: `git mv`, atualizar imports, rodar `npm run test`. O Claude
Code faz isso bem se você prompar "move X to Y and fix all imports, then run
tests". Atualize o `CLAUDE.md` se a estrutura final divergir do previsto.

Atualize `plopfile.mjs` e `plop-templates/` para gerar na nova estrutura de
3 camadas.

---

## Fase 6 — Fechamento

- Reescreva o `README.md` refletindo o sistema enxuto (remova as seções de
  MCP, Flow, playgrounds, Figma, registry, migration).
- Atualize `docs/ARCHITECTURE.md` para as 3 camadas.
- Apague docs órfãs em `docs/`.
- `npm run build && npm run test && npm run build-storybook` — tudo verde.
- Use o subagente `component-reviewer` num componente para validar que o
  ambiente está pegando as regras.

```bash
git tag post-prune
```

---

## Princípio para manter enxuto

Toda vez que pensar em adicionar uma feature, pergunte: _"isto serve um
consumidor externo ou multi-marca?"_ Se sim, **não adicione** — é exatamente
o tipo de coisa que virou o caos da primeira vez. Mono-marca solo precisa de
componentes confiáveis, tokens claros, e um Storybook. O resto é distração.
