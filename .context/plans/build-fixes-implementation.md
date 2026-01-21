# Plano de Implementação: Correções Estruturais do Build

**Data:** 2026-01-19  
**Versão:** 1.0  
**Status:** Planejado

## 📋 Visão Geral

Este documento detalha o plano de implementação para resolver as issues críticas de build e distribuição do React Design System, conforme documentado em:

- [design-system-build-issue.md](./issues/design-system-build-issue.md)
- [ADR-0001: Build and Distribution Strategy](./adr/0001-build-and-distribution-strategy.md)
- [ADR-0002: Provider Exports in Production Build](./adr/0002-provider-exports-in-build.md)
- [RFC-0001: Removal of Conditional Development Exports](./rfc/0001-conditional-exports-removal.md)

## 🎯 Objetivos

1. **Eliminar necessidade de `transpilePackages`** no Next.js
2. **Garantir que todos os exports estejam no build** (incluindo AppProvider)
3. **Fornecer builds transpilados** que funcionem out-of-the-box
4. **Manter compatibilidade** com todos os bundlers principais
5. **Remover aplicação standalone** (manter apenas Storybook)

## 📊 Issues a Resolver

### Issue 1: TypeScript Source Files em Exports

- **Problema**: Exports condicionais apontam para `.ts` em desenvolvimento
- **Impacto**: Next.js não consegue processar sem configuração
- **Solução**: Remover exports condicionais, usar apenas builds transpilados

### Issue 2: AppProvider Não Exportado

- **Problema**: AppProvider não está em `dist/index.js`
- **Impacto**: Funcionalidades perdidas em produção
- **Solução**: Corrigir configuração do Vite para incluir todos os exports

### Issue 3: Aplicação Standalone Desnecessária

- **Problema**: Aplicação standalone (Flow Playground) não faz sentido no design system
- **Impacto**: Complexidade desnecessária, confusão sobre propósito do projeto
- **Solução**: Remover aplicação standalone, manter apenas Storybook
- **Referência**: [Plano de Remoção da Aplicação Standalone](./standalone-app-removal.md)

## 🗓️ Cronograma

### Semana 1: Análise e Correções

#### Dia 1-2: Investigação e Análise

- [ ] Analisar build atual (`dist/index.js`)
- [ ] Listar todos os exports de `src/ui/index.ts`
- [ ] Comparar exports fonte vs build
- [ ] Identificar exports faltantes
- [ ] Verificar dependências circulares
- [ ] Analisar configuração do Vite

**Entregáveis:**

- Relatório de análise
- Lista de exports faltantes
- Diagnóstico do problema

#### Dia 3-4: Correção de Configuração

- [ ] Remover exports condicionais do `package.json`
- [ ] Atualizar `files` array (remover `src`)
- [ ] Corrigir configuração do Vite para preservar exports
- [ ] Adicionar `.npmignore` se necessário
- [ ] Testar build localmente

**Entregáveis:**

- `package.json` atualizado
- `vite.config.ts` corrigido
- Build funcionando localmente

#### Dia 5: Validação e Testes + Remoção da Aplicação Standalone

- [ ] Criar script de validação de exports
- [ ] Executar validação no build
- [ ] Testar em projeto Next.js limpo
- [ ] Verificar tree-shaking
- [ ] Testar todos os imports
- [ ] **Remover aplicação standalone** (ver [standalone-app-removal.md](./standalone-app-removal.md))
  - [ ] Remover `src/main.tsx`
  - [ ] Remover `src/app.tsx`
  - [ ] Remover `index.html`
  - [ ] Atualizar `vite.config.ts` (remover lógica `isAppMode`)
  - [ ] Atualizar documentação
  - [ ] Testar Storybook após remoção

**Entregáveis:**

- Script de validação
- Testes passando
- Relatório de validação
- Aplicação standalone removida
- Storybook funcionando

### Semana 2: Documentação e Release

#### Dia 6-7: Documentação

- [ ] Atualizar guia de migração
- [ ] Documentar breaking changes
- [ ] Atualizar exemplos de uso
- [ ] Criar changelog detalhado
- [ ] Preparar release notes

**Entregáveis:**

- Guia de migração completo
- Changelog atualizado
- Release notes

#### Dia 8-9: Testes Finais

- [ ] Testes em múltiplos ambientes
- [ ] Testes de performance
- [ ] Validação de bundle size
- [ ] Testes de compatibilidade
- [ ] Revisão final do código

**Entregáveis:**

- Relatório de testes
- Validação de performance
- Confirmação de compatibilidade

#### Dia 10: Release

- [ ] Bump de versão para 2.0.0
- [ ] Build final
- [ ] Publicação no npm
- [ ] Anúncio da release
- [ ] Monitoramento inicial

**Entregáveis:**

- Versão 2.0.0 publicada
- Anúncio da release
- Monitoramento ativo

## 🔧 Tarefas Detalhadas

### Fase 1: Análise

#### 1.1 Analisar Build Atual

```bash
# Verificar exports no build
node -e "const pkg = require('./dist/index.js'); console.log(Object.keys(pkg).filter(k => k.includes('Provider')))"

# Verificar tamanho do bundle
ls -lh dist/index.js

# Verificar source maps
ls -lh dist/index.js.map
```

#### 1.2 Comparar Exports

```bash
# Extrair exports do source
grep -E "^export" src/ui/index.ts

# Extrair exports do build (se possível)
# Usar script de validação
```

#### 1.3 Verificar Dependências

```bash
# Verificar dependências circulares
npx madge --circular src/ui/providers

# Verificar dependências externas
npm ls --depth=0
```

### Fase 2: Correções

#### 2.1 Atualizar package.json

```json
{
  "exports": {
    ".": {
      "types": "./dist/ui/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist", "README.md", "LICENSE"]
}
```

#### 2.2 Atualizar vite.config.ts

```typescript
build: {
  lib: {
    entry: "src/ui/index.ts",
    formats: ["es", "cjs"],
  },
  rollupOptions: {
    external: ["react", "react-dom"],
    output: {
      exports: "named",
      preserveModules: false,
    }
  }
}
```

#### 2.3 Criar Script de Validação

```javascript
// scripts/validate-build-exports.js
// Comparar exports fonte vs build
// Falhar se exports estiverem faltando
```

### Fase 3: Testes

#### 3.1 Teste em Next.js

```bash
# Criar projeto de teste
npx create-next-app@latest test-consumer
cd test-consumer

# Instalar design system
npm install @fabio.caffarello/react-design-system@2.0.0

# Testar imports
# Verificar que não precisa de transpilePackages
```

#### 3.2 Teste de Tree-shaking

```typescript
// Verificar que tree-shaking funciona
import { Button } from '@fabio.caffarello/react-design-system';
// AppProvider não deve estar no bundle se não usado
```

### Fase 4: Documentação

#### 4.1 Guia de Migração

- [ ] Documentar breaking changes
- [ ] Passo a passo de migração
- [ ] Exemplos antes/depois
- [ ] Troubleshooting

#### 4.2 Release Notes

- [ ] Listar todas as mudanças
- [ ] Destacar breaking changes
- [ ] Links para documentação
- [ ] Timeline de suporte

## ✅ Critérios de Sucesso

### Técnicos

- [ ] Todos os exports de `src/ui/index.ts` estão em `dist/index.js`
- [ ] AppProvider é acessível em produção
- [ ] Build funciona sem `transpilePackages` no Next.js
- [ ] Tree-shaking funciona corretamente
- [ ] Bundle size é aceitável (< 10% de aumento)
- [ ] Source maps funcionam para debugging

### Funcionais

- [ ] Testes passam em ambiente limpo
- [ ] Projeto Next.js de teste funciona
- [ ] Todos os imports funcionam
- [ ] Documentação está completa
- [ ] Guia de migração está claro

### Processo

- [ ] Build validation está no CI/CD
- [ ] Testes automatizados cobrem exports
- [ ] Documentação está atualizada
- [ ] Release está preparada

## 🚨 Riscos e Mitigações

### Risco 1: Breaking Changes

**Probabilidade:** Alta  
**Impacto:** Alto  
**Mitigação:**

- Versão major (2.0.0)
- Período de transição (3 meses)
- Documentação completa
- Suporte ativo

### Risco 2: Bundle Size Increase

**Probabilidade:** Média  
**Impacto:** Médio  
**Mitigação:**

- Monitorar tamanho do bundle
- Otimizar se necessário
- Documentar mudanças
- Tree-shaking no consumidor

### Risco 3: Regressões

**Probabilidade:** Média  
**Impacto:** Alto  
**Mitigação:**

- Testes abrangentes
- Validação automatizada
- Testes em múltiplos ambientes
- Rollback plan

## 📝 Checklist de Release

### Pré-Release

- [ ] Todos os testes passam
- [ ] Build validation funciona
- [ ] Documentação completa
- [ ] Changelog atualizado
- [ ] Release notes preparadas

### Release

- [ ] Versão atualizada (2.0.0)
- [ ] Build final executado
- [ ] Testes finais passaram
- [ ] Publicação no npm
- [ ] Tags no git

### Pós-Release

- [ ] Anúncio publicado
- [ ] Monitoramento ativo
- [ ] Suporte a questões
- [ ] Documentação de feedback
- [ ] Planejamento de hotfixes se necessário

## 🔗 Referências

- [ADR-0001: Build and Distribution Strategy](./adr/0001-build-and-distribution-strategy.md)
- [ADR-0002: Provider Exports in Production Build](./adr/0002-provider-exports-in-build.md)
- [RFC-0001: Removal of Conditional Development Exports](./rfc/0001-conditional-exports-removal.md)
- [design-system-build-issue.md](./issues/design-system-build-issue.md)
- [standalone-app-removal.md](./standalone-app-removal.md) - Plano detalhado de remoção da aplicação standalone

## 📞 Contato

**Time de Design System:** [Adicionar contato]  
**Responsável pela Implementação:** [Adicionar nome]  
**Data de Início:** 2026-01-19  
**Data Prevista de Conclusão:** 2026-02-02
