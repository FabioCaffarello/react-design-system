# Guia de Composição Avançada

Este documento descreve padrões avançados de composição de componentes no React Design System.

## Visão Geral

A composição é um princípio fundamental do design system. Este guia cobre padrões avançados que vão além da composição básica de atoms em molecules.

## Padrões de Composição

### 1. Compound Components

Compound components permitem criar componentes complexos onde múltiplos sub-componentes trabalham juntos, compartilhando estado implicitamente.

#### Exemplo: Dialog Component

```tsx
import { Dialog } from '@fabio.caffarello/react-design-system';

function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>Dialog description</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          Content goes here
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Dialog.Action>Confirm</Dialog.Action>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

#### Benefícios

- **Flexibilidade**: Componentes podem ser reorganizados
- **Reutilização**: Sub-componentes podem ser usados independentemente
- **Contexto Compartilhado**: Estado compartilhado via Context API

#### Quando Usar

- Componentes complexos com múltiplas partes
- Quando você precisa de flexibilidade na estrutura
- Quando sub-componentes precisam compartilhar estado

### 2. Render Props Pattern

Render props permitem passar funções como children que recebem dados do componente.

#### Exemplo: Data Fetcher

```tsx
function DataFetcher({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return children({ data, loading, error });
}

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    return <UserList users={data} />;
  }}
</DataFetcher>
```

#### Benefícios

- **Separação de Concerns**: Lógica separada da apresentação
- **Reutilização**: Mesma lógica, diferentes UIs
- **Flexibilidade**: Consumidor controla a renderização

#### Quando Usar

- Quando você precisa compartilhar lógica entre componentes
- Quando a apresentação deve ser flexível
- Para componentes de ordem superior (HOCs)

### 3. Hooks Composition

Compor múltiplos hooks para criar lógica complexa reutilizável.

#### Exemplo: useFormWithValidation

```tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function useFormWithValidation(defaultValues = {}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = form.handleSubmit(async (data) => {
    setSubmitted(true);
    // Submit logic
  });

  return {
    ...form,
    handleSubmit,
    submitted,
  };
}

// Usage
function LoginForm() {
  const { register, handleSubmit, errors, submitted } = useFormWithValidation();

  return (
    <form onSubmit={handleSubmit}>
      <Input {...register('email')} error={errors.email} />
      <Input {...register('password')} type="password" error={errors.password} />
      <Button type="submit" disabled={submitted}>
        {submitted ? 'Submitting...' : 'Login'}
      </Button>
    </form>
  );
}
```

#### Benefícios

- **Reutilização**: Lógica compartilhada entre componentes
- **Testabilidade**: Hooks podem ser testados isoladamente
- **Composição**: Combine múltiplos hooks

#### Quando Usar

- Quando você tem lógica que é usada em múltiplos componentes
- Para encapsular lógica complexa
- Para criar APIs mais simples

### 4. Context Composition

Compor múltiplos contextos para criar hierarquias de estado.

#### Exemplo: Theme + Auth Context

```tsx
function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Usage
function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

// Components can use any context
function ThemedButton() {
  const theme = useTheme();
  const { user } = useAuth();
  
  return (
    <Button variant={theme.mode === 'dark' ? 'primary' : 'secondary'}>
      {user ? `Hello, ${user.name}` : 'Login'}
    </Button>
  );
}
```

#### Benefícios

- **Separação de Concerns**: Cada contexto tem responsabilidade única
- **Performance**: Componentes só re-renderizam quando necessário
- **Flexibilidade**: Contextos podem ser reorganizados

#### Quando Usar

- Quando você precisa de múltiplos contextos
- Para evitar prop drilling
- Para compartilhar estado entre componentes distantes

### 5. Slot Pattern

O slot pattern permite que componentes aceitem conteúdo customizado em posições específicas.

#### Exemplo: Card with Slots

```tsx
function Card({ header, footer, children }) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

// Usage
<Card
  header={<CardHeader>Title</CardHeader>}
  footer={<CardFooter>Actions</CardFooter>}
>
  Content
</Card>
```

#### Benefícios

- **Flexibilidade**: Consumidor controla o conteúdo
- **Consistência**: Estrutura mantida, conteúdo variável
- **Reutilização**: Mesmo componente, diferentes conteúdos

#### Quando Usar

- Quando você precisa de flexibilidade no conteúdo
- Para componentes de layout
- Quando diferentes partes precisam de conteúdo diferente

### 6. Controlled vs Uncontrolled

Entenda quando usar componentes controlados ou não controlados.

#### Controlled Component

```tsx
function ControlledInput({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}

// Usage
function Form() {
  const [value, setValue] = useState('');
  return <ControlledInput value={value} onChange={(e) => setValue(e.target.value)} />;
}
```

#### Uncontrolled Component

```tsx
function UncontrolledInput({ defaultValue, onBlur }) {
  const inputRef = useRef(null);
  
  return (
    <input
      ref={inputRef}
      defaultValue={defaultValue}
      onBlur={() => onBlur?.(inputRef.current?.value)}
    />
  );
}

// Usage
<UncontrolledInput defaultValue="initial" onBlur={(value) => console.log(value)} />
```

#### Quando Usar Cada Um

**Controlled**:
- Quando você precisa de controle total
- Para validação em tempo real
- Para sincronização com estado externo

**Uncontrolled**:
- Para performance (menos re-renders)
- Quando você não precisa de controle fino
- Para formulários simples

## Padrões Avançados

### 1. Polymorphic Components

Componentes que podem renderizar como diferentes elementos.

```tsx
type PolymorphicProps<E extends React.ElementType> = {
  as?: E;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<E>;

function Polymorphic<E extends React.ElementType = 'div'>({
  as,
  children,
  ...props
}: PolymorphicProps<E>) {
  const Component = as || 'div';
  return <Component {...props}>{children}</Component>;
}

// Usage
<Polymorphic as="button">Button</Polymorphic>
<Polymorphic as="a" href="/link">Link</Polymorphic>
<Polymorphic>Div</Polymorphic>
```

### 2. Composition with ForwardRef

Passar refs através de componentes compostos.

```tsx
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} />;
});

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>((props, ref) => {
  return (
    <div className="search-input">
      <Icon name="search" />
      <Input ref={ref} {...props} />
    </div>
  );
});
```

### 3. Higher-Order Components (HOCs)

Criar componentes que envolvem outros componentes.

```tsx
function withLoading<P extends object>(Component: React.ComponentType<P>) {
  return function WithLoadingComponent(props: P & { loading?: boolean }) {
    const { loading, ...rest } = props;
    
    if (loading) {
      return <Spinner />;
    }
    
    return <Component {...(rest as P)} />;
  };
}

// Usage
const ButtonWithLoading = withLoading(Button);
<ButtonWithLoading loading={isLoading}>Submit</ButtonWithLoading>
```

## Best Practices

### 1. Prefira Composição sobre Herança

✅ **Bom**:
```tsx
function Card({ children, header, footer }) {
  return (
    <div>
      {header}
      {children}
      {footer}
    </div>
  );
}
```

❌ **Evitar**:
```tsx
class Card extends BaseCard {
  // Inheritance
}
```

### 2. Mantenha Componentes Pequenos e Focados

Cada componente deve ter uma responsabilidade única.

### 3. Use TypeScript para Type Safety

TypeScript ajuda a garantir que a composição está correta.

### 4. Documente Padrões de Composição

Documente como componentes devem ser compostos.

### 5. Teste Composições

Teste não apenas componentes individuais, mas também suas composições.

## Exemplos do Design System

### SideNavbar (Compound Component)

```tsx
<SideNavbar.Root>
  <SideNavbar.Sidebar>
    <SideNavbar.Header>Logo</SideNavbar.Header>
    <SideNavbar.Content>Menu</SideNavbar.Content>
  </SideNavbar.Sidebar>
  <SideNavbar.Main>Content</SideNavbar.Main>
</SideNavbar.Root>
```

### Table (Compound Component)

```tsx
<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Email</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John</Table.Cell>
      <Table.Cell>john@example.com</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

## Recursos

- [React Composition Patterns](https://react.dev/learn/passing-data-deeply-with-context)
- [Compound Components Pattern](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [Render Props Pattern](https://react.dev/reference/react/cloneElement)
