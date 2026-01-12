# CDN Distribution

Este documento descreve como o React Design System pode ser distribuído via CDN.

## Opções de CDN

### 1. jsDelivr (Recomendado)

O jsDelivr automaticamente serve pacotes do npm como CDN:

```html
<!-- Versão específica -->
<script src="https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@1.8.0/dist/index.umd.js"></script>

<!-- Última versão -->
<script src="https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@latest/dist/index.umd.js"></script>

<!-- Versão específica com SRI -->
<script 
  src="https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@1.8.0/dist/index.umd.js"
  integrity="sha384-..."
  crossorigin="anonymous">
</script>
```

### 2. unpkg

```html
<script src="https://unpkg.com/@fabio.caffarello/react-design-system@1.8.0/dist/index.umd.js"></script>
```

### 3. cdnjs

Após adicionar o pacote ao cdnjs:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-design-system/1.8.0/index.umd.js"></script>
```

## Uso com React

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>React Design System - CDN</title>
  <script crossorigin src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@latest/dist/index.umd.js"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@latest/dist/style.css">
</head>
<body>
  <div id="root"></div>
  <script>
    const { Button, Input, Card } = ReactDesignSystem;
    
    function App() {
      return React.createElement('div', null,
        React.createElement(Card, { padding: 'large' },
          React.createElement(Input, { placeholder: 'Enter your name' }),
          React.createElement(Button, { variant: 'primary' }, 'Submit')
        )
      );
    }
    
    ReactDOM.render(React.createElement(App), document.getElementById('root'));
  </script>
</body>
</html>
```

## Entry Points via CDN

### Atoms
```html
<script src="https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@latest/dist/atoms/index.umd.js"></script>
```

### Molecules
```html
<script src="https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@latest/dist/molecules/index.umd.js"></script>
```

### Organisms
```html
<script src="https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@latest/dist/organisms/index.umd.js"></script>
```

### Tokens
```html
<script src="https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@latest/dist/tokens/index.umd.js"></script>
```

## Verificação de Integridade (SRI)

Para segurança, use Subresource Integrity (SRI):

```bash
# Obter hash SRI
curl -s https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@1.8.0/dist/index.umd.js | \
  openssl dgst -sha384 -binary | \
  openssl base64 -A
```

```html
<script 
  src="https://cdn.jsdelivr.net/npm/@fabio.caffarello/react-design-system@1.8.0/dist/index.umd.js"
  integrity="sha384-[HASH_AQUI]"
  crossorigin="anonymous">
</script>
```

## Notas

- O formato UMD é necessário para uso via CDN
- Certifique-se de que as dependências peer (React, ReactDOM) estão carregadas antes
- O CSS deve ser incluído separadamente
- Para produção, use versões específicas em vez de `@latest`
