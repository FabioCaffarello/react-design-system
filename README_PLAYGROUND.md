# Flow Playground - Standalone Application

Este é o playground standalone para desenvolvimento e teste dos componentes de Flow do design system.

## Objetivo

O Flow Playground é uma aplicação Vite dedicada que permite:

- **Desenvolver componentes de Flow** em um ambiente isolado e focado
- **Testar funcionalidades** antes de integrar ao Storybook
- **Iterar rapidamente** com hot reload
- **Melhorar o Storybook** baseado nas descobertas do playground

## Como Usar

### Modo Desenvolvimento (Playground)

Para rodar o playground standalone:

```bash
npm run dev:playground
```

Isso iniciará o servidor Vite na porta 5173 com o playground de Flow.

### Modo Desenvolvimento (Library)

Para rodar o modo normal (desenvolvimento da library):

```bash
npm run dev
```

### Build do Playground

Para fazer build do playground:

```bash
npm run build:playground
```

O build será gerado em `dist-app/`.

### Preview do Playground

Para visualizar o build do playground:

```bash
npm run preview:playground
```

## Estrutura

```
src/
  app.tsx          # Componente principal do playground
  main.tsx         # Entry point da aplicação
  ui/
    extensions/
      flow/        # Componentes de Flow
        components/
          PlaygroundLayout.tsx  # Layout principal usado no app
```

## Integração com Storybook

O playground e o Storybook compartilham os mesmos componentes:

- `PlaygroundLayout` - usado tanto no app quanto no Storybook
- Componentes de Flow - desenvolvidos no playground, documentados no Storybook
- Templates e exemplos - reutilizados em ambos

## Desenvolvimento

1. **Desenvolva no Playground**: Use `npm run dev:playground` para iterar rapidamente
2. **Teste no Storybook**: Use `npm run storybook` para documentar e validar
3. **Melhore ambos**: As melhorias no playground ajudam a melhorar o Storybook

## Endpoints

- **Playground**: `http://localhost:5173/playground` (quando rodando `dev:playground`)
- **Storybook**: `http://localhost:6006` (quando rodando `storybook`)

## Benefícios

✅ **Ambiente isolado** para desenvolvimento focado  
✅ **Hot reload rápido** com Vite  
✅ **Testes em tempo real** das funcionalidades  
✅ **Base sólida** para melhorar o Storybook  
✅ **Desenvolvimento iterativo** dos componentes de Flow
