# Estratégia de Testes

Este documento descreve a estratégia completa de testes do React Design System.

## Visão Geral

O design system utiliza múltiplas camadas de testes:

- **Unit/Behavior Tests**: Vitest + Testing Library, por componente
- **Accessibility Tests**: suíte dedicada por componente + baseline axe-core
- **Runtime Smoke**: todas as stories renderizadas em browser real + fixture RSC Next 16

## Estrutura de Testes

```
src/
├── **/*.test.tsx                # Unit tests (behavior) junto com componentes
├── **/*.accessibility.test.tsx  # A11y tests dedicados (ARIA / keyboard /
│                                # focus / screen reader); mirror
│                                # Header.accessibility.test.tsx
└── **/*.stories.tsx             # Stories (NÃO rodam como testes Vitest —
                                 # ver "Story Tests" abaixo)
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

**Ferramenta**: play functions (`storybook/test`) exercitadas no Storybook

**Localização**: `src/**/*.stories.tsx`

**Execução**: interativa no Storybook local; `npm run storybook:smoke` renderiza toda story em CI (mas não executa play functions). **`npm run test` exclui `*.stories.tsx` por configuração** — não há Storybook-stories-as-vitest wiring neste projeto (ver o comentário longo em `.storybook/preview.tsx`); play functions são documentação executável, não gate.

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

### 3. Runtime Smoke

**Ferramenta**: scripts próprios sobre browser real (Playwright como lib) e Next 16

**Execução**: `npm run storybook:smoke` (renderiza todas as stories e falha em erro de console/render) e `npm run test:next-smoke` (builda o fixture RSC contra o dist recém-buildado)

**Cobertura**: todas as stories; superfície completa do entry `./server`

> O projeto **não** tem suíte E2E de fluxos (Playwright specs) nem visual
> regression (Chromatic) — decisão mono-brand/solo, ver "What NOT to do"
> no CLAUDE.md. Os smokes acima são a camada runtime que existe.

### 4. Accessibility Tests

**Ferramenta**: suítes dedicadas `*.accessibility.test.tsx` por componente (Vitest + Testing Library) + baseline axe-core serial

**Execução**: `npm run test` (inclui as suítes a11y); `npm run test:a11y:baseline` gera o baseline de registro (light + dark) e `node scripts/validate-a11y-baseline.mjs` é o gate (exit 1 se critical+serious > 0)

**Cobertura**: WCAG 2.1 AA — ver `.claude/rules/testing.md` para o scaffold de quatro seções

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

## Testes por Camada

(O modelo é o de 3 camadas do CLAUDE.md — primitives / components / layouts. Não usar Atoms/Molecules/Organisms; a taxonomia atômica foi banida do projeto.)

### Primitives

**Foco**: Renderização, props, estados básicos

**Exemplos**:

- Renderiza corretamente
- Aceita todas as props
- Estados (disabled, loading, etc.)
- Acessibilidade básica

### Components

**Foco**: Interação entre primitives, comportamento composto

**Exemplos**:

- Interação entre componentes
- Validação de formulários
- Estados complexos (controlled/uncontrolled)

### Layouts

**Foco**: Estrutura e composição

**Exemplos**:

- Renderização de children
- Variantes de estrutura (direção, espaçamento, colunas)
- Semântica do elemento raiz

## Testes de Acessibilidade

### Automatizados

- **axe-core** via `scripts/a11y-serial-baseline.mjs`: o enforcement real (baseline light + dark, gate em CI)
- **@storybook/addon-a11y**: painel de inspeção no Storybook local — útil, mas **não é gate** (`parameters.a11y.test: "error"` é cosmético sem o wiring vitest; ver `.storybook/preview.tsx`)
- **WCAG 2.1 AA**: regras configuradas em `.storybook/a11y-config.mjs`, compartilhadas entre o addon e o baseline

### Manuais

- Testes com screen readers
- Navegação por teclado
- Testes de contraste

## Testes de Performance

Não há testes de performance automatizados. A ferramenta manual é o React
DevTools Profiler. O `storybook-addon-performance` está instalado mas
**desativado** (comentado em `.storybook/main.ts`); reativá-lo é uma decisão
explícita, não um estado corrente. Não há Lighthouse CI.

## CI/CD Integration

### GitHub Actions

Testes são executados automaticamente em:

- Pull requests
- Pushes para main
- Releases

### Workflow

O pipeline real é o `.github/workflows/ci.yml` (fonte da verdade); em resumo:

```yaml
- Lint (ESLint + Prettier + validadores estruturais)
- Typecheck (tsc --build --force)
- Test (Vitest + coverage)
- Build library (com build:validate) / Build Storybook
- Storybook smoke + Next 16 Server Component smoke (atrás do paths-filter)
- A11y baseline light + dark (atrás do paths-filter)
- ci-success (agregador exigido pela branch protection)
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
- Os smokes e o baseline a11y têm jobs próprios em CI — não os reproduza dentro de testes unitários

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

## Próximos Passos

1. **Aumentar Coverage**: De 80% para 90%

(Snapshot tests não entram aqui: `.claude/rules/testing.md` os veta como
asserção primária. E2E de fluxos e visual regression seguem fora de escopo
por decisão — ver "What NOT to do" no CLAUDE.md.)

## Recursos

- [Testing Library](https://testing-library.com/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/) — usado como **lib** pelos smokes e pelo baseline a11y, não como test runner de specs
