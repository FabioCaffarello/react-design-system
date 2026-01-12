# Advanced Theme System

Sistema avançado de temas para o React Design System, com suporte a múltiplos temas, CSS variables, herança de temas e transições suaves.

## Características

- ✅ **Múltiplos Temas Simultâneos**: Registre e use vários temas na mesma aplicação
- ✅ **CSS Variables**: Geração automática de variáveis CSS a partir de tokens
- ✅ **Theme Inheritance**: Herde de temas base (light/dark) e customize apenas o necessário
- ✅ **Transições Suaves**: Transições animadas entre temas
- ✅ **Persistência**: Salva preferências de tema no localStorage
- ✅ **Type-Safe**: Totalmente tipado com TypeScript

## Uso Básico

### Usando o AdvancedThemeProvider

```tsx
import { AdvancedThemeProvider, useAdvancedTheme } from '@fabio.caffarello/react-design-system';

function App() {
  return (
    <AdvancedThemeProvider
      defaultTheme="light"
      options={{
        enableCSSVariables: true,
        enableTransitions: true,
        transitionDuration: '200ms',
      }}
    >
      <MyComponent />
    </AdvancedThemeProvider>
  );
}

function MyComponent() {
  const { currentTheme, setTheme, tokens } = useAdvancedTheme();
  
  return (
    <div>
      <p>Current theme: {currentTheme}</p>
      <button onClick={() => setTheme('dark')}>Switch to Dark</button>
    </div>
  );
}
```

## Criando Temas Customizados

### Usando ThemeBuilder

```tsx
import { ThemeBuilder } from '@fabio.caffarello/react-design-system';

const customTheme = ThemeBuilder.create({
  name: 'my-custom-theme',
  base: 'light', // Herda de 'light'
  colors: {
    primary: {
      DEFAULT: {
        hex: '#8b5cf6', // Roxo customizado
        rgb: { r: 139, g: 92, b: 246 },
      },
    },
  },
  spacing: {
    // Override spacing tokens se necessário
  },
}).build();
```

### Registrando Temas no Provider

```tsx
<AdvancedThemeProvider
  defaultTheme="light"
  initialThemes={[
    {
      name: 'brand-theme',
      base: 'light',
      colors: {
        primary: {
          DEFAULT: { hex: '#your-brand-color' },
        },
      },
    },
  ]}
>
  <App />
</AdvancedThemeProvider>
```

### Registrando Temas Dinamicamente

```tsx
function ThemeManager() {
  const { registerTheme, setTheme } = useAdvancedTheme();
  
  const handleCreateTheme = () => {
    const newTheme = registerTheme({
      name: 'dynamic-theme',
      base: 'dark',
      colors: {
        primary: {
          DEFAULT: { hex: '#ff6b6b' },
        },
      },
    });
    
    setTheme(newTheme.name);
  };
  
  return <button onClick={handleCreateTheme}>Create Theme</button>;
}
```

## CSS Variables

Quando `enableCSSVariables` está ativado, o sistema gera automaticamente variáveis CSS:

```css
:root {
  --color-primary-default: #6366f1;
  --color-primary-light: #818cf8;
  --color-primary-dark: #4f46e5;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --font-size-h1: 2.25rem;
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  /* ... */
}
```

Você pode usar essas variáveis em seu CSS:

```css
.my-component {
  background-color: var(--color-primary-default);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
}
```

## API

### AdvancedThemeProvider Props

```typescript
interface AdvancedThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string; // Nome do tema padrão (default: 'light')
  options?: ThemeBuilderOptions;
  initialThemes?: CustomThemeConfig[]; // Temas para registrar na inicialização
}
```

### ThemeBuilderOptions

```typescript
interface ThemeBuilderOptions {
  enableCSSVariables?: boolean; // Gerar CSS variables (default: true)
  enableTransitions?: boolean; // Habilitar transições (default: true)
  transitionDuration?: string; // Duração da transição (default: '200ms')
  storageKey?: string; // Chave do localStorage (default: 'theme')
}
```

### useAdvancedTheme Hook

```typescript
interface AdvancedThemeContextValue {
  currentTheme: string; // Nome do tema atual
  themes: Record<string, Theme>; // Todos os temas registrados
  setTheme: (themeName: string) => void; // Mudar tema
  registerTheme: (config: CustomThemeConfig) => Theme; // Registrar novo tema
  removeTheme: (themeName: string) => boolean; // Remover tema
  getTheme: (themeName?: string) => Theme | undefined; // Obter tema
  tokens: Theme | null; // Tokens do tema atual
  options: ThemeBuilderOptions; // Opções atuais
  setOptions: (options: Partial<ThemeBuilderOptions>) => void; // Atualizar opções
}
```

## Theme Inheritance

Temas podem herdar de temas base (light ou dark) e sobrescrever apenas o necessário:

```tsx
const brandTheme = ThemeBuilder.create({
  name: 'brand',
  base: 'light', // Herda todos os tokens de 'light'
  colors: {
    // Apenas sobrescreve cores
    primary: {
      DEFAULT: { hex: '#custom-color' },
    },
  },
  // Outros tokens são herdados de 'light'
}).build();
```

## Exemplos

### Toggle de Tema

```tsx
function ThemeToggle() {
  const { currentTheme, setTheme, themes } = useAdvancedTheme();
  
  return (
    <select
      value={currentTheme}
      onChange={(e) => setTheme(e.target.value)}
    >
      {Object.keys(themes).map((name) => (
        <option key={name} value={name}>
          {name}
        </option>
      ))}
    </select>
  );
}
```

### Criar Tema Dinamicamente

```tsx
function ThemeCreator() {
  const { registerTheme, setTheme } = useAdvancedTheme();
  const [color, setColor] = useState('#6366f1');
  
  const createTheme = () => {
    const theme = registerTheme({
      name: `custom-${Date.now()}`,
      base: 'light',
      colors: {
        primary: {
          DEFAULT: { hex: color },
        },
      },
    });
    
    setTheme(theme.name);
  };
  
  return (
    <div>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <button onClick={createTheme}>Create Theme</button>
    </div>
  );
}
```

## Migração do ThemeProvider Original

O `ThemeProvider` original ainda está disponível e funciona normalmente. Para migrar para o sistema avançado:

**Antes:**
```tsx
import { ThemeProvider, useTheme } from '@fabio.caffarello/react-design-system';

<ThemeProvider defaultTheme="light">
  <App />
</ThemeProvider>
```

**Depois:**
```tsx
import { AdvancedThemeProvider, useAdvancedTheme } from '@fabio.caffarello/react-design-system';

<AdvancedThemeProvider defaultTheme="light">
  <App />
</AdvancedThemeProvider>
```

O `AdvancedThemeProvider` é compatível com os temas `light` e `dark` padrão, então a migração é simples.
