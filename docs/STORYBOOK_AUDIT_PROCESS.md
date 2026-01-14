# Processo de Auditoria do Storybook

Este documento descreve o processo de auditoria e manutenção do Storybook, incluindo critérios para remoção de stories e documentos MDX.

## Scripts Disponíveis

### Auditoria Completa

```bash
npm run audit:storybook
```

Executa uma auditoria completa do Storybook, gerando relatórios em `docs/audit/`:
- `storybook-audit-report.json` - Dados estruturados
- `storybook-audit-report.md` - Relatório legível
- `candidates-for-removal.md` - Lista de candidatos à remoção

### Verificação de Duplicações

```bash
npm run check:duplicates
```

Verifica rapidamente se há duplicações de stories ou documentos MDX por título ou nome de arquivo.

## Critérios de Remoção

### Stories para Remoção

Remover stories que:

1. **Referenciam componentes inexistentes**
   - O componente foi removido ou renomeado
   - A story não pode ser executada

2. **São duplicatas**
   - Mesmo título em locais diferentes
   - Mesmo componente documentado em múltiplas stories

3. **Estão marcadas como deprecated/experimental sem uso**
   - Componente deprecated sem uso em produção
   - Componente experimental abandonado

4. **Não têm componente correspondente**
   - Story órfã sem componente relacionado
   - Story de componente que foi removido

5. **Estão vazias ou sem conteúdo útil**
   - Story sem implementação
   - Story apenas com placeholder

### Documentos MDX para Remoção

Remover documentos MDX que:

1. **Estão duplicados**
   - Mesmo conteúdo em `docs/` e `src/docs/`
   - Versões obsoletas substituídas por outras

2. **Não são referenciados e não fornecem valor**
   - Documentos órfãos sem referências
   - Templates ou exemplos não utilizados

3. **Estão obsoletos ou desatualizados**
   - Documentação desatualizada
   - Guias substituídos por versões mais recentes

4. **Têm conteúdo vazio ou placeholder**
   - Documentos sem conteúdo real
   - Placeholders nunca preenchidos

### Documentos MDX para Manter

Manter documentos MDX que:

1. **São únicos e atualizados**
   - Documentação única e atual
   - Guias úteis e completos

2. **São referenciados por stories ou outros docs**
   - Usados no Storybook
   - Referenciados em documentação

3. **Fornecem valor real**
   - Guias de uso
   - Referências de componentes
   - Documentação de tokens

4. **Estão na estrutura correta**
   - `src/docs/` para documentação do Storybook
   - `src/docs/guides/` para guias
   - `src/ui/[category]/[component]/` para documentação de componentes

## Estrutura Recomendada

### Stories

```
src/ui/
├── atoms/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.stories.tsx
│       └── Button.test.tsx
├── molecules/
├── organisms/
└── ...
```

### Documentos MDX

```
src/
├── docs/
│   ├── GettingStarted.mdx
│   ├── DesignSystem.mdx
│   ├── ComponentStatus.mdx
│   ├── EventCatalog.mdx
│   ├── StateCatalog.mdx
│   └── guides/              # Guias específicos
│       ├── Accessibility.mdx
│       ├── Performance.mdx
│       ├── BestPractices.mdx
│       ├── ComponentComposition.mdx
│       └── MigrationGuide.mdx
└── ui/
    ├── [category]/
    │   └── [component]/
    │       └── [Component].mdx  # Documentação específica do componente
    └── tokens/
        └── Tokens.mdx
```

## Processo de Revisão Periódica

### Frequência

- **Mensal**: Executar auditoria completa
- **A cada release**: Verificar duplicações
- **Antes de releases major**: Revisão completa

### Passos

1. **Executar auditoria**
   ```bash
   npm run audit:storybook
   ```

2. **Verificar duplicações**
   ```bash
   npm run check:duplicates
   ```

3. **Revisar relatórios**
   - Analisar `docs/audit/storybook-audit-report.md`
   - Revisar `docs/audit/candidates-for-removal.md`

4. **Validar candidatos à remoção**
   - Verificar se stories/documentos são realmente obsoletos
   - Confirmar que não há dependências
   - Validar com a equipe se necessário

5. **Remover obsoletos**
   - Remover stories/documentos confirmados como obsoletos
   - Atualizar imports e referências

6. **Validar build**
   ```bash
   npm run build-storybook
   ```

7. **Validar duplicações**
   ```bash
   npm run check:duplicates
   ```

## Matriz de Decisão

### Stories

| Componente Existe? | Story Única? | Bem Documentada? | Ação |
|-------------------|--------------|-----------------|------|
| Sim | Sim | Sim | ✅ Manter |
| Sim | Sim | Não | ⚠️ Melhorar |
| Sim | Não | - | ❌ Remover duplicata |
| Não | - | - | ❌ Remover |
| Deprecated | - | - | ⚠️ Marcar para remoção futura |

### Documentos MDX

| Único? | Atualizado? | Referenciado? | Ação |
|--------|-------------|---------------|------|
| Sim | Sim | Sim | ✅ Manter |
| Sim | Sim | Não | ⚠️ Avaliar necessidade |
| Sim | Não | - | ⚠️ Atualizar ou remover |
| Não | - | - | ❌ Remover duplicata |
| - | - | Não | ⚠️ Avaliar valor |

## Riscos e Mitigações

### Risco: Remover stories/documentos ainda em uso

**Mitigação**: 
- Gerar relatório detalhado antes de remover
- Revisar candidatos à remoção com a equipe
- Manter histórico no git para recuperação

### Risco: Quebrar referências no Storybook

**Mitigação**: 
- Validar build após cada remoção
- Executar testes após mudanças
- Verificar navegação no Storybook

### Risco: Perder documentação importante

**Mitigação**: 
- Criar backup antes de remover
- Manter histórico no git
- Documentar decisões de remoção

## Métricas de Sucesso

- ✅ Redução de duplicações para 0
- ✅ Todas as stories têm componente correspondente
- ✅ Estrutura de documentos organizada e clara
- ✅ Scripts de auditoria funcionando
- ✅ Storybook builda sem erros
- ✅ Tempo de build do Storybook otimizado

## Exemplos

### Exemplo 1: Remover Story Duplicada

**Situação**: `ThemeBuilder.stories.tsx` existe em dois locais:
- `src/ui/stories/App/ThemeBuilder.stories.tsx`
- `src/ui/tools/ThemeBuilder.stories.tsx`

**Ação**: Remover a duplicata em `stories/App/` e manter em `tools/` (local mais apropriado)

### Exemplo 2: Reorganizar Documentos MDX

**Situação**: Guias em `src/docs/` misturados com documentação geral

**Ação**: Mover guias para `src/docs/guides/` e atualizar títulos Meta

### Exemplo 3: Remover Template Obsoleto

**Situação**: `StoryTemplateWithEvents.mdx` é apenas um template, não documentação essencial

**Ação**: Remover o template (templates devem estar em `plop-templates/` ou documentação externa)

## Recursos

- [Storybook Documentation](https://storybook.js.org/docs)
- [MDX Documentation](https://mdxjs.com/)
- [Component Registry](./component-registry.md)
- [Audit Reports](./audit/storybook-audit-report.md)
