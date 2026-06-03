# Estratégia de Testes

Este documento descreve a estratégia completa de testes do React Design System.

## Visão Geral

O design system utiliza múltiplas camadas de testes:

- **Unit Tests**: Testes de componentes individuais
- **Integration Tests**: Testes de interação entre componentes
- **E2E Tests**: Testes end-to-end no Storybook
- **Visual Regression**: Testes de regressão visual
- **Accessibility Tests**: Testes de acessibilidade

## Estrutura de Testes

```
tests/
├── e2e/              # Testes E2E com Playwright
│   ├── button.spec.ts
│   ├── accessibility.spec.ts
│   └── navigation.spec.ts
src/
├── **/*.test.tsx                # Unit tests (behavior) junto com componentes
├── **/*.accessibility.test.tsx  # A11y tests dedicados (ARIA / keyboard /
│                                # focus / screen reader); mirror
│                                # Header.accessibility.test.tsx
└── **/*.stories.tsx             # Story tests (via Vitest)
```

## Tipos de Testes

### 1. Unit Tests

**Ferramenta**: Vitest + Testing Library

**Localização**: `src/**/*.test.tsx`

**Cobertura**: > 80% (target: 90%)

**Exemplo**:

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

### 2. Story Tests

**Ferramenta**: Vitest + Storybook Test Runner

**Localização**: `src/**/*.stories.tsx`

**Execução**: `npm run test`

**Exemplo**:

```tsx
export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await userEvent.click(button);
    await expect(canvas.getByText("Clicked")).toBeInTheDocument();
  },
};
```

### 3. E2E Tests

**Ferramenta**: Playwright

**Localização**: `tests/e2e/*.spec.ts`

**Execução**: `npm run test:e2e`

**Cobertura**: Fluxos críticos e integrações

### 4. Visual Regression

**Ferramenta**: Chromatic

**Execução**: `npm run test:visual`

**Cobertura**: Todas as stories

### 5. Accessibility Tests

**Ferramenta**: @storybook/addon-a11y + axe-core

**Execução**: Automático no Storybook + `npm run validate-a11y`

**Cobertura**: WCAG 2.1 AA (60+ regras)

## Estratégia de Cobertura

### Cobertura Mínima

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Target

- **Lines**: 90%
- **Functions**: 90%
- **Branches**: 90%
- **Statements**: 90%

### Medição

```bash
npm run test:coverage
```

## Testes por Categoria

### Atoms

**Foco**: Renderização, props, estados básicos

**Exemplos**:

- Renderiza corretamente
- Aceita todas as props
- Estados (disabled, loading, etc.)
- Acessibilidade básica

### Molecules

**Foco**: Interação entre atoms, comportamento composto

**Exemplos**:

- Interação entre componentes
- Validação de formulários
- Estados complexos

### Organisms

**Foco**: Fluxos completos, integração

**Exemplos**:

- Fluxos de usuário
- Gerenciamento de estado
- Integração com APIs

## Testes de Acessibilidade

### Automatizados

- **@storybook/addon-a11y**: Verificação automática
- **axe-core**: Análise de acessibilidade
- **WCAG 2.1 AA**: 60+ regras configuradas

### Manuais

- Testes com screen readers
- Navegação por teclado
- Testes de contraste

## Testes de Performance

### Métricas

- Render time
- Re-render count
- Bundle size
- Memory usage

### Ferramentas

- `storybook-addon-performance`
- React DevTools Profiler
- Lighthouse CI

## CI/CD Integration

### GitHub Actions

Testes são executados automaticamente em:

- Pull requests
- Pushes para main
- Releases

### Workflow

```yaml
- Run lint
- Run unit tests
- Run story tests
- Run E2E tests (se necessário)
- Run visual regression (Chromatic)
- Generate coverage report
```

## Best Practices

### 1. Teste Comportamento, Não Implementação

✅ **Bom**:

```tsx
expect(screen.getByRole("button")).toBeEnabled();
```

❌ **Evitar**:

```tsx
expect(button.props.disabled).toBe(false);
```

### 2. Use Seletores Semânticos

✅ **Bom**:

```tsx
screen.getByRole("button", { name: "Submit" });
```

❌ **Evitar**:

```tsx
screen.getByTestId("submit-button");
```

### 3. Teste Estados e Edge Cases

- Estados de loading
- Estados de erro
- Estados vazios
- Valores extremos

### 4. Mantenha Testes Rápidos

- Unit tests: < 1s cada
- Story tests: < 5s cada
- E2E tests: < 30s cada

### 5. Teste Acessibilidade

Sempre inclua testes de acessibilidade:

- ARIA attributes
- Keyboard navigation
- Screen reader support

## Troubleshooting

### Testes falham intermitentemente

**Soluções**:

1. Adicione `waitFor` para estados assíncronos
2. Use `findBy*` queries
3. Aumente timeout se necessário
4. Verifique race conditions

### Coverage não aumenta

**Soluções**:

1. Identifique código não testado
2. Adicione testes para edge cases
3. Verifique se testes estão sendo executados
4. Revise configuração de coverage

### E2E tests são lentos

**Soluções**:

1. Execute apenas testes relevantes
2. Use parallel execution
3. Otimize seletores
4. Cache browsers

## Próximos Passos

1. **Aumentar Coverage**: De 80% para 90%
2. **Expandir E2E**: Mais componentes e fluxos
3. **Performance Tests**: Métricas automatizadas
4. **Snapshot Tests**: Para componentes estáticos

## Recursos

- [Testing Library](https://testing-library.com/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Chromatic](https://www.chromatic.com/)
