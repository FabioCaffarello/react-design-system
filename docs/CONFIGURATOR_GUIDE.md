# Design System Configurator Guide

Guia completo para usar o Design System Configurator.

## Visão Geral

O Design System Configurator é uma ferramenta visual interativa para configurar todo o design system, incluindo tokens, temas, componentes e geração de CSS.

## Componentes Principais

### Token Configurator

Configure todos os design tokens:

- **Colors**: Ajuste cores do sistema
- **Spacing**: Configure espaçamento
- **Typography**: Ajuste tipografia

```tsx
import { DesignSystemConfigurator } from '@fabio.caffarello/react-design-system/tools';

function ConfigPage() {
  return <DesignSystemConfigurator />;
}
```

### Theme Configurator

Crie e gerencie temas customizados:

- Crie novos temas baseados em temas existentes
- Ajuste cores, espaçamento e tipografia
- Preview em tempo real

### Component Configurator

Configure componentes individuais:

- Defina variants e sizes
- Configure tokens usados
- Configure acessibilidade

### CSS Code Generator

Gere código CSS em múltiplos formatos:

- CSS Variables
- Tailwind Config
- SCSS Variables
- TypeScript

## Uso

### Configuração Básica

```tsx
import { DesignSystemConfigurator } from '@fabio.caffarello/react-design-system/tools';

function App() {
  return (
    <div>
      <DesignSystemConfigurator />
    </div>
  );
}
```

### Exportar Configuração

```tsx
import { DesignSystemConfigurator } from '@fabio.caffarello/react-design-system/tools';

function ConfigPage() {
  const handleStateChange = (state) => {
    // Salvar ou processar estado
    console.log('Config changed:', state);
  };

  return (
    <DesignSystemConfigurator onStateChange={handleStateChange} />
  );
}
```

## Funcionalidades

### Token Editor

- Edite cores visualmente
- Ajuste espaçamento com preview
- Configure tipografia com preview em tempo real

### Theme Management

- Crie múltiplos temas
- Herde de temas base
- Exporte temas em múltiplos formatos

### Component Configuration

- Configure variants e sizes
- Defina tokens usados
- Configure recursos de acessibilidade

### Code Generation

- Gere CSS variables
- Gere Tailwind config
- Gere SCSS variables
- Gere TypeScript types

## Exemplos

### Configurar Cores

1. Abra o Token Configurator
2. Selecione a aba "Colors"
3. Escolha um role (primary, secondary, etc.)
4. Ajuste a cor usando o color picker
5. Veja o preview em tempo real

### Criar Tema Customizado

1. Abra o Theme Configurator
2. Digite um nome para o tema
3. Selecione um tema base
4. Ajuste tokens conforme necessário
5. Clique em "Create Theme"

### Gerar CSS

1. Configure tokens e temas
2. Abra o CSS Code Generator
3. Selecione o formato desejado
4. Copie ou exporte o código gerado

## Melhores Práticas

1. **Comece com Tokens**: Configure tokens antes de criar temas
2. **Use Preview**: Sempre verifique o preview antes de exportar
3. **Valide**: Use validação de contraste e acessibilidade
4. **Exporte Regularmente**: Salve configurações importantes

## Referências

- [Developer Journey Guide](./DEVELOPER_JOURNEY.md)
- [Design System Configurator API](../../src/ui/tools/DesignSystemConfigurator/DesignSystemConfigurator.tsx)
