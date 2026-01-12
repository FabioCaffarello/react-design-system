var l=Object.defineProperty,m=Object.defineProperties;var p=Object.getOwnPropertyDescriptors;var t=Object.getOwnPropertySymbols;var u=Object.prototype.hasOwnProperty,h=Object.prototype.propertyIsEnumerable;var i=(r,n,o)=>n in r?l(r,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):r[n]=o,a=(r,n)=>{for(var o in n||(n={}))u.call(n,o)&&i(r,o,n[o]);if(t)for(var o of t(n))h.call(n,o)&&i(r,o,n[o]);return r},s=(r,n)=>m(r,p(n));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as c}from"./index-4L7o7Sqz.js";import{M as x}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function d(r){const n=a(a({a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul"},c()),r.components);return e.jsxs(e.Fragment,{children:[e.jsx(x,{title:"Design System/Component Composition"}),`
`,e.jsx(n.h1,{id:"component-composition-guide",children:"Component Composition Guide"}),`
`,e.jsx(n.p,{children:"Este guia explica como compor componentes do React Design System para criar interfaces complexas e reutilizáveis."}),`
`,e.jsx(n.h2,{id:"princípios-de-composição",children:"Princípios de Composição"}),`
`,e.jsx(n.h3,{id:"1-atomic-design-hierarchy",children:"1. Atomic Design Hierarchy"}),`
`,e.jsx(n.p,{children:"Sempre respeite a hierarquia do Atomic Design:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`Atoms → Molecules → Organisms → Pages
`})}),`
`,e.jsx(n.h3,{id:"2-composição-sobre-configuração",children:"2. Composição sobre Configuração"}),`
`,e.jsx(n.p,{children:"Prefira compor componentes simples em vez de criar componentes super configuráveis:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// ✅ Correto: Compor
function UserCard({ user }) {
  return (
    <Card padding="large">
      <Avatar src={user.avatar} />
      <Text>{user.name}</Text>
      <Button>View Profile</Button>
    </Card>
  );
}

// ❌ Evitar: Super configurável
function UserCard({ user, showAvatar, showName, showButton, ... }) {
  // Muitas props condicionais
}
`})}),`
`,e.jsx(n.h2,{id:"padrões-de-composição",children:"Padrões de Composição"}),`
`,e.jsx(n.h3,{id:"padrão-1-container--content",children:"Padrão 1: Container + Content"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Card, Text, Button } from '@fabio.caffarello/react-design-system';

function ProductCard({ product }) {
  return (
    <Card padding="large" variant="hover">
      <img src={product.image} alt={product.name} />
      <Text variant="heading">{product.name}</Text>
      <Text>{product.description}</Text>
      <Button variant="primary">Add to Cart</Button>
    </Card>
  );
}
`})}),`
`,e.jsx(n.h3,{id:"padrão-2-form-composition",children:"Padrão 2: Form Composition"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Form, Input, Label, Button, Card } from '@fabio.caffarello/react-design-system';

function LoginForm() {
  return (
    <Card padding="large">
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required />
        
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required />
        
        <Button type="submit" variant="primary">Login</Button>
      </Form>
    </Card>
  );
}
`})}),`
`,e.jsx(n.h3,{id:"padrão-3-list-composition",children:"Padrão 3: List Composition"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Card, Text, Button, Separator } from '@fabio.caffarello/react-design-system';

function UserList({ users }) {
  return (
    <div>
      {users.map((user, index) => (
        <div key={user.id}>
          <Card padding="medium">
            <Text>{user.name}</Text>
            <Text variant="caption">{user.email}</Text>
            <Button size="small">View</Button>
          </Card>
          {index < users.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
`})}),`
`,e.jsx(n.h3,{id:"padrão-4-layout-composition",children:"Padrão 4: Layout Composition"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Card, Separator } from '@fabio.caffarello/react-design-system';

function DashboardLayout({ header, sidebar, content, footer }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64">
        {sidebar}
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="p-4">
          {header}
        </header>
        <Separator />
        <div className="flex-1 p-4 overflow-auto">
          {content}
        </div>
        <Separator />
        <footer className="p-4">
          {footer}
        </footer>
      </main>
    </div>
  );
}
`})}),`
`,e.jsx(n.h2,{id:"composição-avançada",children:"Composição Avançada"}),`
`,e.jsx(n.h3,{id:"wrapper-components",children:"Wrapper Components"}),`
`,e.jsx(n.p,{children:"Crie wrappers que combinam múltiplos componentes:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Card, Input, Label, ErrorMessage } from '@fabio.caffarello/react-design-system';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
}

// Uso
<FormField label="Email" error={errors.email}>
  <Input type="email" />
</FormField>
`})}),`
`,e.jsx(n.h3,{id:"compound-components",children:"Compound Components"}),`
`,e.jsx(n.p,{children:"Use compound components para componentes relacionados:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Card, Text, Button } from '@fabio.caffarello/react-design-system';

interface ModalProps {
  children: React.ReactNode;
}

function Modal({ children }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card padding="large" className="max-w-md w-full">
        {children}
      </Card>
    </div>
  );
}

Modal.Header = function ModalHeader({ children }) {
  return <Text variant="heading">{children}</Text>;
};

Modal.Body = function ModalBody({ children }) {
  return <div>{children}</div>;
};

Modal.Footer = function ModalFooter({ children }) {
  return <div className="flex justify-end gap-2">{children}</div>;
};

// Uso
<Modal>
  <Modal.Header>Confirm Action</Modal.Header>
  <Modal.Body>Are you sure?</Modal.Body>
  <Modal.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Modal.Footer>
</Modal>
`})}),`
`,e.jsx(n.h2,{id:"composição-com-hooks",children:"Composição com Hooks"}),`
`,e.jsx(n.h3,{id:"custom-hooks-para-composição",children:"Custom Hooks para Composição"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useState } from 'react';
import { Input, Button, Card } from '@fabio.caffarello/react-design-system';

function useFormField(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError(undefined);
  };

  return { value, error, handleChange, setError };
}

function LoginForm() {
  const email = useFormField();
  const password = useFormField();

  return (
    <Card padding="large">
      <Input
        type="email"
        value={email.value}
        onChange={email.handleChange}
        error={email.error}
      />
      <Input
        type="password"
        value={password.value}
        onChange={password.handleChange}
        error={password.error}
      />
      <Button>Login</Button>
    </Card>
  );
}
`})}),`
`,e.jsx(n.h2,{id:"composição-de-organisms",children:"Composição de Organisms"}),`
`,e.jsx(n.h3,{id:"usando-organisms-existentes",children:"Usando Organisms Existentes"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Table, DataGrid, Stepper } from '@fabio.caffarello/react-design-system';

function DataManagementPage() {
  return (
    <div>
      <Stepper
        steps={['Upload', 'Review', 'Confirm']}
        currentStep={0}
      />
      <DataGrid
        data={data}
        columns={columns}
        onExport={handleExport}
      />
    </div>
  );
}
`})}),`
`,e.jsx(n.h2,{id:"melhores-práticas",children:"Melhores Práticas"}),`
`,e.jsx(n.h3,{id:"1-mantenha-componentes-pequenos",children:"1. Mantenha Componentes Pequenos"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// ✅ Correto: Componente focado
function UserAvatar({ user }) {
  return <Avatar src={user.avatar} alt={user.name} />;
}

// ❌ Evitar: Componente fazendo muitas coisas
function UserCardWithEverything({ user, showStats, showActions, ... }) {
  // Muito código
}
`})}),`
`,e.jsx(n.h3,{id:"2-use-props-para-variação",children:"2. Use Props para Variação"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// ✅ Correto: Props para variar comportamento
function Button({ variant, size, children, ...props }) {
  // Usa Button do design system com props
  return <Button variant={variant} size={size} {...props}>{children}</Button>;
}

// ❌ Evitar: Múltiplos componentes para variações
function PrimaryButton() { }
function SecondaryButton() { }
function SmallButton() { }
`})}),`
`,e.jsx(n.h3,{id:"3-compose-dont-modify",children:"3. Compose, Don't Modify"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// ✅ Correto: Compor componentes
function CustomCard({ children }) {
  return (
    <Card padding="large" variant="hover">
      {children}
    </Card>
  );
}

// ❌ Incorreto: Modificar componentes diretamente
// Não modifique os componentes do design system
`})}),`
`,e.jsx(n.h2,{id:"exemplos-completos",children:"Exemplos Completos"}),`
`,e.jsx(n.h3,{id:"exemplo-dashboard-completo",children:"Exemplo: Dashboard Completo"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import {
  Card,
  Button,
  Input,
  Table,
  Text,
  Separator,
} from '@fabio.caffarello/react-design-system';

function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Text variant="heading">Dashboard</Text>
        <Button variant="primary">New Item</Button>
      </div>

      <Separator />

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card padding="medium">
          <Text variant="caption">Total Users</Text>
          <Text variant="heading">1,234</Text>
        </Card>
        <Card padding="medium">
          <Text variant="caption">Active Now</Text>
          <Text variant="heading">567</Text>
        </Card>
        <Card padding="medium">
          <Text variant="caption">Revenue</Text>
          <Text variant="heading">$12,345</Text>
        </Card>
      </div>

      {/* Data Table */}
      <Card padding="large">
        <Table
          data={data}
          columns={columns}
        />
      </Card>
    </div>
  );
}
`})}),`
`,e.jsx(n.h2,{id:"recursos-adicionais",children:"Recursos Adicionais"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"./Design%20System/Best%20Practices",children:"Best Practices"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"./Design%20System/Getting%20Started",children:"Getting Started"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"./Design%20System/Component%20Status",children:"Component Status"})}),`
`]})]})}function M(r={}){const{wrapper:n}=a(a({},c()),r.components);return n?e.jsx(n,s(a({},r),{children:e.jsx(d,a({},r))})):d(r)}export{M as default};
