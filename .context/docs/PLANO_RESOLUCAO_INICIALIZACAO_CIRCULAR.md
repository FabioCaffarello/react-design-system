# 🎯 Plano Detalhado: Resolução do Problema de Inicialização Circular

**Data de Criação:** 2026-01-19  
**Versão:** 1.0  
**Status:** 🟡 Em Execução  
**Prioridade:** P0 - Bloqueante

---

## 📋 Sumário Executivo

Este documento apresenta um plano detalhado e assertivo para resolver o problema de inicialização circular (`ReferenceError: Cannot access 'aN' before initialization`) que ocorre durante o build do Next.js 15.5.9 com o design system.

**Objetivo:** Eliminar completamente o erro de inicialização circular, permitindo que o design system seja usado em produção no Next.js sem workarounds.

**Prazo Estimado:** 2-3 dias de trabalho focado

---

## ✅ Descoberta Importante (2026-01-19)

**Análise Executada:** `npm run analyze:deps`

**Resultado:**
- ✅ **Nenhuma dependência circular encontrada nos providers**
- ✅ **4 dependências circulares encontradas em outras partes** (não relacionadas ao problema)
  - `molecules/Drawer/` - Não relacionado
  - `extensions/flow/components/` - Não relacionado

**Conclusão:** O problema **NÃO é uma dependência circular real**, mas sim um problema de **ordem de inicialização durante o bundling do Next.js**.

**Implicação:** As estratégias de correção devem focar em:
1. Ordem de exports e inicialização
2. Barrel exports criando dependências implícitas
3. Code splitting quebrando ordem de inicialização
4. Interop ESM/CommonJS

---

## 🔍 Fase 1: Diagnóstico Profundo (Dia 1 - Manhã)

### 1.1 Mapeamento Completo de Dependências ✅ CONCLUÍDO

**Objetivo:** Identificar todas as dependências circulares no código.

**Status:** ✅ **CONCLUÍDO**
- Nenhuma dependência circular nos providers
- 4 dependências circulares em outras partes (não relacionadas)

**Ferramentas:**
- `madge` - Detecção de dependências circulares
- `dependency-cruiser` - Análise avançada de dependências
- Análise manual de imports/exports

**Comandos:**

```bash
# Instalar ferramentas de análise
npm install --save-dev madge dependency-cruiser

# Detectar dependências circulares
npx madge --circular --extensions ts,tsx src/ui

# Gerar gráfico de dependências
npx madge --image deps.svg --extensions ts,tsx src/ui

# Análise detalhada com dependency-cruiser
npx depcruise --output-type err src/ui
```

**Entregáveis:**
- [ ] Relatório de dependências circulares (`circular-deps-report.json`)
- [ ] Gráfico visual de dependências (`deps.svg`)
- [ ] Lista priorizada de dependências problemáticas

**Critérios de Sucesso:**
- Todas as dependências circulares identificadas
- Cadeias de dependência mapeadas
- Pontos de quebra identificados

---

### 1.2 Análise do Bundle Gerado

**Objetivo:** Entender como o Vite está gerando o bundle e onde está ocorrendo o problema.

**Comandos:**

```bash
# Build com análise detalhada
npm run build -- --mode analyze

# Inspecionar bundle gerado
node -e "
  const fs = require('fs');
  const bundle = fs.readFileSync('dist/index.js', 'utf8');
  // Procurar por padrões problemáticos
  console.log('Bundle size:', bundle.length);
  // Analisar imports/exports
"
```

**Análises:**
1. **Ordem de imports no bundle:**
   - Verificar se providers são importados antes de serem usados
   - Identificar variáveis minificadas problemáticas (`aN`, `aT`)

2. **Code splitting:**
   - Verificar se providers estão no chunk correto
   - Identificar se há code splitting indevido

3. **Tree-shaking:**
   - Verificar se exports necessários estão sendo removidos
   - Identificar side effects quebrados

**Entregáveis:**
- [ ] Análise do bundle (`bundle-analysis.md`)
- [ ] Mapa de code splitting (`chunk-map.json`)
- [ ] Lista de exports removidos incorretamente

---

### 1.3 Teste de Isolamento

**Objetivo:** Isolar o problema testando imports individuais.

**Estratégia:**

Criar testes mínimos para cada provider:

```typescript
// test-isolation/app-provider-only.tsx
import { AppProvider } from '@fabio.caffarello/react-design-system';

// test-isolation/theme-provider-only.tsx
import { ThemeProvider } from '@fabio.caffarello/react-design-system';

// test-isolation/config-provider-only.tsx
import { ConfigProvider } from '@fabio.caffarello/react-design-system';

// test-isolation/toast-provider-only.tsx
import { ToastProvider } from '@fabio.caffarello/react-design-system';

// test-isolation/dialog-provider-only.tsx
import { DialogProvider } from '@fabio.caffarello/react-design-system';
```

**Comandos:**

```bash
# Criar app Next.js de teste para cada provider
for provider in AppProvider ThemeProvider ConfigProvider ToastProvider DialogProvider; do
  # Criar app mínimo
  # Testar build
  # Registrar resultado
done
```

**Entregáveis:**
- [ ] Testes de isolamento para cada provider
- [ ] Relatório de qual combinação causa o problema
- [ ] Identificação do provider/módulo problemático

---

## 🔧 Fase 2: Estratégias de Correção (Dia 1 - Tarde)

### 2.1 Estratégia A: Eliminação de Barrel Exports para Providers ⭐ **RECOMENDADA**

**Problema Identificado:** Barrel exports (`export * from "./providers"`) podem criar dependências implícitas e problemas de ordem de inicialização durante o bundling do Next.js, mesmo sem dependências circulares reais.

**Evidência:** Análise confirmou que não há dependências circulares reais, mas o problema persiste. Isso indica problema de ordem de inicialização.

**Solução:**

#### Passo 1: Criar exports nomeados explícitos

**Arquivo:** `src/ui/index.ts`

```typescript
// ANTES (problemático):
export * from "./providers";

// DEPOIS (explícito):
// Providers - exportados individualmente para evitar circularidade
export { ThemeProvider, useTheme, type ThemeProviderProps, type ThemeContextValue } from "./providers/ThemeProvider";
export { ConfigProvider, useConfig, type ConfigProviderProps, type DesignSystemConfig, type ConfigContextValue } from "./providers/ConfigProvider";
export { ToastProvider, useToastContext, useToastContextOptional, type ToastProviderProps, type Toast, type ToastContextValue, type ToastVariant } from "./providers/ToastContext";
export { DialogProvider, useDialogContext, useDialogContextOptional, type DialogProviderProps, type DialogContextValue } from "./providers/DialogContext";
export { AppProvider, useApp, type AppProviderProps, type AppProviderConfig } from "./providers/AppProvider";
```

**Vantagens:**
- ✅ Elimina dependências circulares de barrel exports
- ✅ Mantém API pública
- ✅ Tree-shaking funciona melhor

**Desvantagens:**
- ⚠️ Requer manutenção manual de exports
- ⚠️ Mais verboso

**Critérios de Sucesso:**
- [ ] Build do design system passa
- [ ] Build do Next.js passa
- [ ] Todos os exports disponíveis

---

#### Passo 2: Validar que não há dependências circulares

```bash
# Verificar após mudança
npx madge --circular --extensions ts,tsx src/ui
# Deve retornar: "No circular dependencies found!"
```

---

### 2.2 Estratégia B: Entry Points Separados

**Problema Identificado:** Misturar providers com organisms pode causar dependências circulares.

**Solução:**

#### Passo 1: Criar entry point separado para providers

**Arquivo:** `package.json`

```json
{
  "exports": {
    ".": {
      "types": "./dist/ui/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./providers": {
      "types": "./dist/ui/providers/index.d.ts",
      "import": "./dist/providers/index.js",
      "require": "./dist/providers/index.cjs"
    }
  }
}
```

#### Passo 2: Criar build separado para providers

**Arquivo:** `vite.config.ts`

```typescript
build: {
  lib: {
    entry: {
      index: "src/ui/index.ts",
      providers: "src/ui/providers/index.ts", // Novo entry point
      // ... outros
    }
  }
}
```

#### Passo 3: Atualizar AppProvider para usar entry point separado

**Arquivo:** `src/ui/providers/AppProvider.tsx`

```typescript
// Importar de entry point separado (sem passar por index.ts)
import { ToastProvider } from '../providers/ToastProvider';
import { DialogProvider } from '../providers/DialogProvider';
```

**Vantagens:**
- ✅ Quebra dependências circulares completamente
- ✅ Permite importar providers sem importar organisms
- ✅ Melhor tree-shaking

**Desvantagens:**
- ⚠️ Requer mudança na API (novo import path)
- ⚠️ Mais complexo para consumidores

**Critérios de Sucesso:**
- [ ] Build do design system passa
- [ ] Build do Next.js passa
- [ ] Documentação atualizada

---

### 2.3 Estratégia C: Lazy Loading de Providers

**Problema Identificado:** Providers podem estar sendo inicializados na ordem errada.

**Solução:**

#### Passo 1: Usar dynamic imports no AppProvider

**Arquivo:** `src/ui/providers/AppProvider.tsx`

```typescript
import { lazy, Suspense, type ReactNode } from 'react';

// Lazy load providers para quebrar dependência circular
const ToastProviderLazy = lazy(() => 
  import('./ToastProvider').then(m => ({ default: m.ToastProvider }))
);
const DialogProviderLazy = lazy(() => 
  import('./DialogProvider').then(m => ({ default: m.DialogProvider }))
);
```

**Vantagens:**
- ✅ Quebra dependência circular durante bundling
- ✅ Mantém API pública

**Desvantagens:**
- ⚠️ Pode causar problemas de SSR
- ⚠️ Adiciona complexidade

**Critérios de Sucesso:**
- [ ] Build do Next.js passa
- [ ] SSR funciona corretamente
- [ ] Sem regressões de performance

---

### 2.4 Estratégia D: Reestruturação Arquitetural

**Problema Identificado:** Arquitetura atual pode ter dependências circulares fundamentais.

**Solução:**

#### Passo 1: Criar camada de abstração

```
src/ui/
├── core/              # Core sem dependências
│   ├── tokens/
│   └── utils/
├── providers/         # Providers (dependem apenas de core)
│   ├── ThemeProvider
│   ├── ConfigProvider
│   ├── ToastProvider
│   ├── DialogProvider
│   └── AppProvider
└── components/        # Componentes (dependem de providers e core)
    ├── atoms/
    ├── molecules/
    └── organisms/
```

#### Passo 2: Garantir ordem de dependências

1. **Core** → Sem dependências
2. **Providers** → Dependem apenas de Core
3. **Components** → Dependem de Providers e Core

**Vantagens:**
- ✅ Arquitetura limpa
- ✅ Sem dependências circulares
- ✅ Sustentável a longo prazo

**Desvantagens:**
- ⚠️ Refatoração significativa
- ⚠️ Pode quebrar código existente

**Critérios de Sucesso:**
- [ ] Arquitetura validada
- [ ] Todos os testes passam
- [ ] Build do Next.js passa

---

## 🧪 Fase 3: Implementação e Testes (Dia 2)

### 3.1 Priorização de Estratégias

**Ordem de Implementação:**

1. **Estratégia A** (Eliminação de Barrel Exports) - ⭐ **PRIMEIRA TENTATIVA**
   - Menos invasiva
   - Rápida de implementar
   - Baixo risco

2. **Estratégia B** (Entry Points Separados) - ⭐ **SEGUNDA TENTATIVA**
   - Se A não funcionar
   - Requer mudança na API
   - Mais complexa

3. **Estratégia C** (Lazy Loading) - ⭐ **TERCEIRA TENTATIVA**
   - Se A e B não funcionarem
   - Pode causar problemas de SSR
   - Último recurso

4. **Estratégia D** (Reestruturação) - ⭐ **ÚLTIMA OPÇÃO**
   - Se todas falharem
   - Refatoração completa
   - Mais trabalhosa

---

### 3.2 Implementação da Estratégia A

#### Checklist de Implementação:

- [ ] **Passo 1:** Backup do código atual
  ```bash
  git checkout -b fix/circular-dependency-barrel-exports
  git commit -m "chore: backup before barrel exports fix"
  ```

- [ ] **Passo 2:** Modificar `src/ui/index.ts`
  - Remover `export * from "./providers"`
  - Adicionar exports nomeados explícitos
  - Manter ordem: Tokens → Utils → Providers → Components

- [ ] **Passo 3:** Validar build do design system
  ```bash
  npm run build
  npm run build:validate
  ```

- [ ] **Passo 4:** Testar build do Next.js
  ```bash
  npm run test:nextjs
  ```

- [ ] **Passo 5:** Verificar dependências circulares
  ```bash
  npx madge --circular --extensions ts,tsx src/ui
  ```

- [ ] **Passo 6:** Executar testes
  ```bash
  npm run test
  ```

- [ ] **Passo 7:** Validar exports
  ```bash
  npm run build:validate
  ```

**Critérios de Sucesso:**
- ✅ Build do design system passa
- ✅ Build do Next.js passa sem erros
- ✅ Nenhuma dependência circular detectada
- ✅ Todos os testes passam
- ✅ Todos os exports disponíveis

---

### 3.3 Se Estratégia A Falhar: Implementar Estratégia B

#### Checklist de Implementação:

- [ ] **Passo 1:** Criar entry point separado
  - Adicionar `providers` entry em `vite.config.ts`
  - Criar `src/ui/providers/index.ts` dedicado

- [ ] **Passo 2:** Atualizar `package.json`
  - Adicionar export `./providers`
  - Manter export principal

- [ ] **Passo 3:** Atualizar AppProvider
  - Importar providers diretamente (sem passar por index.ts)

- [ ] **Passo 4:** Testar build
  ```bash
  npm run build
  npm run test:nextjs
  ```

- [ ] **Passo 5:** Atualizar documentação
  - Documentar novo import path
  - Adicionar exemplos

**Critérios de Sucesso:**
- ✅ Build do Next.js passa
- ✅ Documentação atualizada
- ✅ Exemplos funcionando

---

## ✅ Fase 4: Validação e Documentação (Dia 3)

### 4.1 Validação Completa

#### Testes Obrigatórios:

- [ ] **Teste 1:** Build do design system
  ```bash
  npm run build
  # Deve passar sem erros
  ```

- [ ] **Teste 2:** Build do Next.js (teste automatizado)
  ```bash
  npm run test:nextjs
  # Deve passar sem erros
  ```

- [ ] **Teste 3:** Build do Next.js (teste manual)
  ```bash
  # Criar app Next.js manual
  # Instalar design system
  # Executar build
  # Deve passar sem erros
  ```

- [ ] **Teste 4:** Dependências circulares
  ```bash
  npx madge --circular --extensions ts,tsx src/ui
  # Deve retornar: "No circular dependencies found!"
  ```

- [ ] **Teste 5:** Exports disponíveis
  ```bash
  npm run build:validate
  # Todos os exports críticos devem estar presentes
  ```

- [ ] **Teste 6:** Testes unitários
  ```bash
  npm run test
  # Todos os testes devem passar
  ```

- [ ] **Teste 7:** SSR/Prerendering
  ```bash
  # Testar em app Next.js real
  # Verificar que SSR funciona
  # Verificar que prerendering funciona
  ```

---

### 4.2 Documentação

#### Documentos a Atualizar:

- [ ] **CHANGELOG.md**
  - Documentar mudanças
  - Versão incrementada
  - Breaking changes (se houver)

- [ ] **README.md**
  - Atualizar exemplos de uso
  - Documentar novos import paths (se aplicável)

- [ ] **.context/docs/completed-changes/**
  - Criar documento detalhando a correção
  - Incluir análise do problema
  - Incluir solução implementada

- [ ] **.context/docs/issues/**
  - Marcar issue como resolvida
  - Adicionar link para solução

---

### 4.3 Release

#### Checklist de Release:

- [ ] **Passo 1:** Incrementar versão
  ```bash
  npm version patch  # ou minor, dependendo das mudanças
  ```

- [ ] **Passo 2:** Build final
  ```bash
  npm run build
  npm run build:validate
  ```

- [ ] **Passo 3:** Testes finais
  ```bash
  npm run test
  npm run test:nextjs
  ```

- [ ] **Passo 4:** Commit e tag
  ```bash
  git add .
  git commit -m "fix(core): resolve circular dependency issue in Next.js builds"
  git tag v1.10.4
  ```

- [ ] **Passo 5:** Publicar
  ```bash
  npm publish
  ```

- [ ] **Passo 6:** Notificar consumidores
  - Atualizar documentação pública
  - Notificar time solicitante
  - Criar release notes

---

## 🚨 Plano de Contingência

### Se Nenhuma Estratégia Funcionar

#### Opção 1: Workaround Temporário Documentado

Criar workaround oficial e bem documentado:

```typescript
// app/providers-wrapper.tsx
'use client';
import dynamic from 'next/dynamic';

const AppProvider = dynamic(
  () => import('@fabio.caffarello/react-design-system').then(m => ({ default: m.AppProvider })),
  { ssr: false }
);
```

**Vantagens:**
- ✅ Permite uso imediato
- ✅ Documentado e suportado

**Desvantagens:**
- ⚠️ Não resolve o problema raiz
- ⚠️ Limita funcionalidades SSR

---

#### Opção 2: Refatoração Arquitetural Completa

Se todas as estratégias falharem, considerar refatoração completa:

1. **Separar design system em pacotes:**
   - `@fabio.caffarello/react-design-system-core`
   - `@fabio.caffarello/react-design-system-providers`
   - `@fabio.caffarello/react-design-system-components`

2. **Usar monorepo:**
   - Gerenciar dependências explicitamente
   - Evitar dependências circulares

**Vantagens:**
- ✅ Resolve problema definitivamente
- ✅ Arquitetura limpa

**Desvantagens:**
- ⚠️ Refatoração massiva
- ⚠️ Breaking changes significativos
- ⚠️ Requer planejamento extenso

---

## 📊 Métricas de Sucesso

### Critérios de Aceitação:

1. **Funcionalidade:**
   - ✅ Build do Next.js passa sem erros
   - ✅ SSR funciona corretamente
   - ✅ Prerendering funciona corretamente
   - ✅ Todos os providers funcionam

2. **Qualidade:**
   - ✅ Nenhuma dependência circular detectada
   - ✅ Todos os testes passam
   - ✅ Build do design system passa
   - ✅ Exports validados

3. **Performance:**
   - ✅ Bundle size não aumenta significativamente
   - ✅ Build time não aumenta significativamente
   - ✅ Runtime performance mantida

4. **Documentação:**
   - ✅ CHANGELOG atualizado
   - ✅ README atualizado
   - ✅ Documentação técnica atualizada
   - ✅ Exemplos funcionando

---

## 📅 Timeline Estimado

### Dia 1:
- **Manhã (4h):** Fase 1 - Diagnóstico Profundo
- **Tarde (4h):** Fase 2 - Estratégias de Correção

### Dia 2:
- **Manhã (4h):** Fase 3 - Implementação Estratégia A
- **Tarde (4h):** Se necessário, Implementação Estratégia B/C

### Dia 3:
- **Manhã (4h):** Fase 4 - Validação e Testes
- **Tarde (4h):** Documentação e Release

**Total Estimado:** 24 horas (3 dias úteis)

---

## 🎯 Próximos Passos Imediatos

### Ação Imediata (Hoje):

1. **Instalar ferramentas de análise:**
   ```bash
   npm install --save-dev madge dependency-cruiser
   ```

2. **Executar análise de dependências:**
   ```bash
   npx madge --circular --extensions ts,tsx src/ui
   npx madge --image deps.svg --extensions ts,tsx src/ui
   ```

3. **Criar branch para correção:**
   ```bash
   git checkout -b fix/circular-dependency-detailed
   ```

4. **Iniciar Fase 1 - Diagnóstico:**
   - Executar todos os comandos de análise
   - Documentar resultados
   - Identificar dependências circulares

---

## 📝 Notas Importantes

1. **Não pular etapas:** Cada fase é importante para garantir sucesso
2. **Documentar tudo:** Todas as descobertas devem ser documentadas
3. **Testar incrementalmente:** Testar após cada mudança
4. **Manter compatibilidade:** Sempre considerar impacto em consumidores
5. **Comunicar mudanças:** Manter time solicitante informado

---

**Última Atualização:** 2026-01-19  
**Próxima Revisão:** Após conclusão da Fase 1  
**Status:** 🟡 Aguardando Início da Fase 1
