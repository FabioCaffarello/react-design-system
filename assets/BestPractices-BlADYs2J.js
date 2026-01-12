var l=Object.defineProperty,m=Object.defineProperties;var p=Object.getOwnPropertyDescriptors;var i=Object.getOwnPropertySymbols;var h=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable;var t=(o,e,s)=>e in o?l(o,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[e]=s,r=(o,e)=>{for(var s in e||(e={}))h.call(e,s)&&t(o,s,e[s]);if(i)for(var s of i(e))u.call(e,s)&&t(o,s,e[s]);return o},a=(o,e)=>m(o,p(e));import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as c}from"./index-4L7o7Sqz.js";import{M as x}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function d(o){const e=r(r({a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul"},c()),o.components);return n.jsxs(n.Fragment,{children:[n.jsx(x,{title:"Design System/Best Practices"}),`
`,n.jsx(e.h1,{id:"best-practices",children:"Best Practices"}),`
`,n.jsx(e.p,{children:"Este guia apresenta as melhores práticas para usar o React Design System de forma eficiente e consistente."}),`
`,n.jsx(e.h2,{id:"estrutura-de-componentes",children:"Estrutura de Componentes"}),`
`,n.jsx(e.h3,{id:"atomic-design",children:"Atomic Design"}),`
`,n.jsx(e.p,{children:"Sempre siga a hierarquia do Atomic Design:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Atoms"})," → Componentes básicos e indivisíveis"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Molecules"})," → Combinações de atoms"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Organisms"})," → Combinações de molecules e atoms"]}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Usar atoms para construir molecules
import { Input, Label, Button } from '@fabio.caffarello/react-design-system';

function LoginForm() {
  return (
    <form>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
      <Button type="submit">Login</Button>
    </form>
  );
}

// ❌ Incorreto: Não recriar atoms dentro de molecules
function BadLoginForm() {
  return (
    <form>
      <input type="email" /> {/* Use o componente Input do design system */}
    </form>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"uso-de-tokens",children:"Uso de Tokens"}),`
`,n.jsx(e.h3,{id:"sempre-use-design-tokens",children:"Sempre Use Design Tokens"}),`
`,n.jsx(e.p,{children:"Use tokens em vez de valores hardcoded:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Usar tokens
import { getSpacingClass, getColorClass } from '@fabio.caffarello/react-design-system';

<div className={\`\${getSpacingClass('md', 'p')} \${getColorClass('primary', 'DEFAULT', 'bg')}\`}>
  Content
</div>

// ❌ Incorreto: Valores hardcoded
<div className="p-4 bg-indigo-500">
  Content
</div>
`})}),`
`,n.jsx(e.h3,{id:"tokens-de-cores",children:"Tokens de Cores"}),`
`,n.jsx(e.p,{children:"Use cores semânticas:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Cores semânticas
getColorClass('primary', 'DEFAULT', 'bg')
getColorClass('error', 'DEFAULT', 'text')
getColorClass('success', 'DEFAULT', 'border')

// ❌ Incorreto: Cores específicas
'bg-indigo-500'
'text-red-600'
`})}),`
`,n.jsx(e.h2,{id:"acessibilidade",children:"Acessibilidade"}),`
`,n.jsx(e.h3,{id:"sempre-forneça-labels",children:"Sempre Forneça Labels"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto
<Label htmlFor="username">Username</Label>
<Input id="username" />

// ❌ Incorreto
<Input placeholder="Username" /> // Sem label associado
`})}),`
`,n.jsx(e.h3,{id:"use-aria-attributes-quando-necessário",children:"Use ARIA Attributes Quando Necessário"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Componente com ARIA
<Button aria-label="Close dialog" onClick={handleClose}>
  <CloseIcon />
</Button>

// ✅ Correto: Componente com descrição
<Input
  id="password"
  type="password"
  aria-describedby="password-help"
/>
<span id="password-help">Password must be at least 8 characters</span>
`})}),`
`,n.jsx(e.h3,{id:"navegação-por-teclado",children:"Navegação por Teclado"}),`
`,n.jsx(e.p,{children:"Todos os componentes interativos já suportam navegação por teclado. Não desabilite isso:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Deixar navegação por teclado funcionar
<Button onClick={handleClick}>Click me</Button>

// ❌ Incorreto: Desabilitar navegação por teclado
<Button onClick={handleClick} onKeyDown={(e) => e.preventDefault()}>
  Click me
</Button>
`})}),`
`,n.jsx(e.h2,{id:"performance",children:"Performance"}),`
`,n.jsx(e.h3,{id:"use-code-splitting",children:"Use Code Splitting"}),`
`,n.jsx(e.p,{children:"Importe apenas o que você precisa:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Import específico
import { Button, Input } from '@fabio.caffarello/react-design-system/atoms';

// ⚠️ Aceitável mas menos otimizado
import { Button, Input } from '@fabio.caffarello/react-design-system';
`})}),`
`,n.jsx(e.h3,{id:"memoização",children:"Memoização"}),`
`,n.jsx(e.p,{children:"Componentes já otimizados não precisam de memoização adicional:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Componentes já são memoizados
import { Card } from '@fabio.caffarello/react-design-system';

function MyComponent() {
  return <Card>Content</Card>;
}

// ❌ Desnecessário: Componentes já são otimizados
import { memo } from 'react';
const MyCard = memo(Card);
`})}),`
`,n.jsx(e.h2,{id:"temas",children:"Temas"}),`
`,n.jsx(e.h3,{id:"use-advancedthemeprovider",children:"Use AdvancedThemeProvider"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Usar AdvancedThemeProvider
import { AdvancedThemeProvider } from '@fabio.caffarello/react-design-system';

function App() {
  return (
    <AdvancedThemeProvider defaultTheme="light">
      <YourApp />
    </AdvancedThemeProvider>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"crie-temas-customizados",children:"Crie Temas Customizados"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Criar tema customizado
import { ThemeBuilder } from '@fabio.caffarello/react-design-system';

const brandTheme = ThemeBuilder.create({
  name: 'brand',
  base: 'light',
  colors: {
    primary: {
      DEFAULT: { hex: '#your-brand-color' },
    },
  },
}).build();
`})}),`
`,n.jsx(e.h2,{id:"composição-de-componentes",children:"Composição de Componentes"}),`
`,n.jsx(e.h3,{id:"compose-não-modifique",children:"Compose, Não Modifique"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Compor componentes
function CustomCard({ children, ...props }) {
  return (
    <Card padding="large" variant="hover" {...props}>
      {children}
    </Card>
  );
}

// ❌ Incorreto: Modificar componentes diretamente
// Não modifique os componentes do design system
`})}),`
`,n.jsx(e.h3,{id:"use-variants",children:"Use Variants"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Usar variants
<Button variant="primary" size="large">Submit</Button>
<Button variant="secondary" size="small">Cancel</Button>

// ❌ Incorreto: Criar componentes customizados para variantes
function CustomButton() {
  return <button className="custom-primary-large">Submit</button>;
}
`})}),`
`,n.jsx(e.h2,{id:"formulários",children:"Formulários"}),`
`,n.jsx(e.h3,{id:"use-form-component",children:"Use Form Component"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Usar componente Form
import { Form, Input, Button } from '@fabio.caffarello/react-design-system';

function LoginForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <Input name="email" type="email" required />
      <Input name="password" type="password" required />
      <Button type="submit">Login</Button>
    </Form>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"validação",children:"Validação"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Validação com react-hook-form
import { useForm } from 'react-hook-form';
import { Form, Input, Button } from '@fabio.caffarello/react-design-system';

function ValidatedForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email', { required: true })}
        error={errors.email ? 'Email is required' : undefined}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"testes",children:"Testes"}),`
`,n.jsx(e.h3,{id:"teste-componentes",children:"Teste Componentes"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Testar componentes
import { render, screen } from '@testing-library/react';
import { Button } from '@fabio.caffarello/react-design-system';

test('renders button', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
`})}),`
`,n.jsx(e.h2,{id:"typescript",children:"TypeScript"}),`
`,n.jsx(e.h3,{id:"use-types-do-design-system",children:"Use Types do Design System"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Usar tipos exportados
import type { ButtonProps } from '@fabio.caffarello/react-design-system';

function MyButton(props: ButtonProps) {
  return <Button {...props} />;
}

// ❌ Incorreto: Criar tipos próprios
interface MyButtonProps {
  // ...
}
`})}),`
`,n.jsx(e.h2,{id:"erros-comuns",children:"Erros Comuns"}),`
`,n.jsx(e.h3,{id:"-não-faça-isso",children:"❌ Não Faça Isso"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Não modifique componentes diretamente"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Não use valores hardcoded em vez de tokens"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Não ignore acessibilidade"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Não importe tudo quando precisa de pouco"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Não crie componentes que já existem"})}),`
`]}),`
`,n.jsx(e.h3,{id:"-faça-isso",children:"✅ Faça Isso"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Use componentes como estão"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Use design tokens"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Sempre considere acessibilidade"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Use code splitting"})}),`
`,n.jsx(e.li,{children:n.jsx(e.strong,{children:"Reutilize componentes existentes"})}),`
`]}),`
`,n.jsx(e.h2,{id:"recursos-adicionais",children:"Recursos Adicionais"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"./Design%20System/Getting%20Started",children:"Getting Started Guide"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"./Design%20System/Component%20Composition",children:"Component Composition Guide"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"./Design%20System/Accessibility",children:"Accessibility Guide"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"./Design%20System/Performance",children:"Performance Guide"})}),`
`]})]})}function N(o={}){const{wrapper:e}=r(r({},c()),o.components);return e?n.jsx(e,a(r({},o),{children:n.jsx(d,r({},o))})):d(o)}export{N as default};
