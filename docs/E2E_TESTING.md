# E2E Testing com Playwright

Este documento descreve a configuração e uso de testes end-to-end (E2E) com Playwright no React Design System.

## Visão Geral

Os testes E2E verificam o comportamento completo dos componentes no Storybook, incluindo:
- Interações do usuário
- Navegação
- Acessibilidade
- Comportamento em diferentes browsers
- Responsividade

## Configuração

### Playwright Config

A configuração está em `playwright.config.ts`:

- **Test Directory**: `./tests/e2e`
- **Base URL**: `http://localhost:6006` (Storybook)
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Chrome Mobile, Safari Mobile
- **Web Server**: Inicia Storybook automaticamente

### Instalação

Playwright já está instalado. Para instalar os browsers:

```bash
npx playwright install
```

## Scripts Disponíveis

### Executar Todos os Testes E2E

```bash
npm run test:e2e
```

### Executar com UI Interativa

```bash
npm run test:e2e:ui
```

### Executar em Modo Debug

```bash
npm run test:e2e:debug
```

### Ver Relatório

```bash
npm run test:e2e:report
```

## Estrutura de Testes

```
tests/e2e/
├── button.spec.ts          # Testes do componente Button
├── accessibility.spec.ts   # Testes de acessibilidade
└── navigation.spec.ts      # Testes de navegação do Storybook
```

## Escrevendo Testes

### Exemplo Básico

```typescript
import { test, expect } from '@playwright/test';

test('should render button', async ({ page }) => {
  await page.goto('/?path=/story/atoms-button--primary');
  const button = page.getByRole('button');
  await expect(button).toBeVisible();
});
```

### Testando Interações

```typescript
test('should handle click', async ({ page }) => {
  await page.goto('/?path=/story/atoms-button--primary');
  const button = page.getByRole('button');
  await button.click();
  // Add assertions
});
```

### Testando Acessibilidade

```typescript
test('should have no a11y violations', async ({ page }) => {
  await page.goto('/?path=/story/atoms-button--primary');
  
  // Basic checks
  const button = page.getByRole('button');
  await expect(button).toBeVisible();
  await expect(button).toBeAccessible();
});
```

### Testando Keyboard Navigation

```typescript
test('should support keyboard', async ({ page }) => {
  await page.goto('/?path=/story/atoms-button--primary');
  const button = page.getByRole('button');
  
  await button.focus();
  await expect(button).toBeFocused();
  
  await button.press('Enter');
  // Verify action
});
```

## Executando em CI/CD

Os testes E2E são executados automaticamente no CI:

```yaml
- name: Install Playwright browsers
  run: npx playwright install

- name: Run E2E tests
  run: npm run test:e2e
```

## Best Practices

### 1. Usar Seletores Semânticos

✅ **Bom**:
```typescript
page.getByRole('button')
page.getByLabel('Email')
page.getByText('Submit')
```

❌ **Evitar**:
```typescript
page.locator('.btn-primary')
page.locator('#submit-button')
```

### 2. Aguardar Elementos

Sempre aguarde elementos antes de interagir:

```typescript
await expect(button).toBeVisible();
await button.click();
```

### 3. Testar Estados

Teste diferentes estados dos componentes:

```typescript
test('disabled state', async ({ page }) => {
  await page.goto('/?path=/story/atoms-button--disabled');
  const button = page.getByRole('button');
  await expect(button).toBeDisabled();
});
```

### 4. Testar Responsividade

Use diferentes viewports:

```typescript
test('mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/?path=/story/atoms-button--primary');
  // Test mobile behavior
});
```

## Troubleshooting

### Storybook não inicia

**Problema**: Web server não consegue iniciar Storybook

**Solução**:
1. Verifique se a porta 6006 está livre
2. Inicie Storybook manualmente: `npm run storybook`
3. Execute testes: `STORYBOOK_URL=http://localhost:6006 npm run test:e2e`

### Testes falham no CI

**Problema**: Testes passam localmente mas falham no CI

**Soluções**:
1. Aumente timeout se necessário
2. Verifique se browsers estão instalados
3. Use `--retries` para testes flaky

### Elementos não encontrados

**Problema**: `page.getByRole('button')` não encontra elemento

**Soluções**:
1. Aguarde elemento: `await expect(button).toBeVisible()`
2. Verifique se está no iframe correto do Storybook
3. Use seletores mais específicos se necessário

## Próximos Passos

1. Adicionar mais testes de componentes
2. Implementar testes de integração entre componentes
3. Adicionar testes de performance
4. Expandir testes de acessibilidade

## Recursos

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Accessibility](https://playwright.dev/docs/accessibility-testing)
