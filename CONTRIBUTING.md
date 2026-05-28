# Contributing Guide

Obrigado por considerar contribuir com o React Design System! Este guia ajudará você a entender nosso processo e padrões.

## Código de Conduta

Este projeto segue um código de conduta. Ao participar, você concorda em manter este código.

## Como Contribuir

### Reportar Bugs

1. Verifique se o bug já não foi reportado nas issues
2. Crie uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots se aplicável

### Sugerir Melhorias

1. Verifique se a sugestão já não existe
2. Crie uma issue descrevendo:
   - O problema que resolve
   - Proposta de solução
   - Alternativas consideradas

### Pull Requests

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Faça suas mudanças seguindo os padrões abaixo
4. Commit: `git commit -m 'feat: adiciona nova feature'`
5. Push: `git push origin feature/nova-feature`
6. Abra um Pull Request

## Padrões de Código

### Estrutura de Componentes

Cada componente deve seguir esta estrutura:

```
ComponentName/
  ├── ComponentName.tsx
  ├── ComponentName.test.tsx
  ├── ComponentName.stories.tsx
  └── index.ts
```

Veja [COMPONENT_STRUCTURE_STANDARD.md](./COMPONENT_STRUCTURE_STANDARD.md) para detalhes.

### TypeScript

- **Sem `any`**: Use tipos específicos ou genéricos
- **Props tipadas**: Todas as props devem ter tipos explícitos
- **Exports públicos**: Exporte apenas o que é necessário

```typescript
// ✅ Bom
export interface ButtonProps {
  variant?: "primary" | "secondary";
  onClick?: (e: MouseEvent) => void;
}

// ❌ Evitar
export interface ButtonProps {
  variant?: any;
  onClick?: any;
}
```

### Acessibilidade

Todos os componentes interativos devem:

- Suportar navegação por teclado completa
- Incluir atributos ARIA apropriados
- Ter indicadores visuais de foco
- Funcionar com leitores de tela

Veja [ACCESSIBILITY_AUDIT.md](./ACCESSIBILITY_AUDIT.md) para detalhes.

### Testes

- **Cobertura mínima**: 80%
- **Testes obrigatórios**:
  - Renderização básica
  - Interações (cliques, mudanças)
  - Acessibilidade (ARIA, keyboard)
  - Edge cases

```typescript
// Exemplo de teste
describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('supports keyboard navigation', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    button.focus();
    expect(document.activeElement).toBe(button);
  });
});
```

### Stories do Storybook

Cada componente deve ter:

- Story `Default`
- Stories para variantes principais
- Stories para estados (loading, error, disabled)
- Story de acessibilidade (quando aplicável)
- Documentação de props no `argTypes`

### Design Tokens

Use design tokens do sistema, não valores hardcoded:

```typescript
// ✅ Correto
import { getColorClass } from '../../tokens';
className={getColorClass('primary', 'DEFAULT', 'bg')}

// ❌ Incorreto
className="bg-indigo-500"
```

### Commits

Siga o padrão Conventional Commits:

- `feat:` Nova feature
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

Exemplo: `feat: adiciona suporte a keyboard navigation no Dropdown`

### JSDoc

Todos os componentes devem ter JSDoc completo:

````typescript
/**
 * Button Component
 *
 * A styled button component with variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
````

## Processo de Review

1. **Automated Checks**: PRs devem passar em todos os checks (lint, tests, build)
2. **Code Review**: Pelo menos um maintainer deve aprovar
3. **Accessibility Review**: Componentes interativos são revisados para acessibilidade
4. **Documentation**: Mudanças devem incluir documentação atualizada

## Checklist de PR

Antes de abrir um PR, verifique:

- [ ] Código segue os padrões estabelecidos
- [ ] Testes passam e cobertura > 80%
- [ ] Stories do Storybook atualizadas
- [ ] Acessibilidade implementada (se componente interativo)
- [ ] JSDoc completo
- [ ] Sem uso de `any`
- [ ] Design tokens usados (não valores hardcoded)
- [ ] Lint passa sem erros
- [ ] Build passa sem erros

## Perguntas?

Abra uma issue com a tag `question` ou entre em contato com os maintainers.

Obrigado por contribuir! 🎉
