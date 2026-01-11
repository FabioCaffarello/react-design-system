# Changelog - v1.2.0

## Novos Componentes

### Atoms

#### Badge
- Componente para exibir status, prioridade e labels
- Variantes: `success`, `warning`, `error`, `info`, `neutral`
- Acessível com `role="status"` e `aria-label`
- Storybook stories completas
- 9 testes unitários

#### Select
- Componente de dropdown estilizado para formulários
- Suporte a placeholder
- Estado de erro
- Opções desabilitadas
- Acessível com `aria-invalid` e `aria-describedby`
- Storybook stories com exemplos de status e priority
- 7 testes unitários

#### Textarea
- Componente de textarea estilizado para textos longos
- Controle de resize: `none`, `both`, `horizontal`, `vertical`
- Estado de erro
- Acessível com `aria-invalid` e `aria-describedby`
- Storybook stories com diferentes tamanhos
- 8 testes unitários

### Molecules

#### Card
- Componente de card versátil para containers
- Variantes: `default`, `hover`, `selected`
- Opções de padding: `none`, `small`, `medium`, `large`
- Pode substituir BoxWrapper em muitos casos
- Storybook stories com exemplos de uso
- 9 testes unitários

## Estatísticas

- **Total de novos componentes**: 4
- **Total de testes**: 33 novos testes
- **Total de testes no sistema**: 75 testes (todos passando ✓)
- **Storybook stories**: 25+ stories documentadas

## Melhorias

- Todos os componentes seguem Atomic Design
- Acessibilidade implementada (ARIA labels, roles)
- TypeScript strict mode
- Testes unitários completos
- Documentação no Storybook

## Breaking Changes

Nenhum. Esta é uma versão MINOR (1.1.0 → 1.2.0) com backward compatibility.

## Próximos Passos

Componentes planejados para futuras versões:
- Modal/Dialog (Organism)
- Form (Molecule)
- Table (Organism)
