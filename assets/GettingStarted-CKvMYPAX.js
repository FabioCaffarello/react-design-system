var c=Object.defineProperty,m=Object.defineProperties;var h=Object.getOwnPropertyDescriptors;var o=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable;var a=(s,e,r)=>e in s?c(s,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):s[e]=r,i=(s,e)=>{for(var r in e||(e={}))p.call(e,r)&&a(s,r,e[r]);if(o)for(var r of o(e))u.call(e,r)&&a(s,r,e[r]);return s},t=(s,e)=>m(s,h(e));import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as d}from"./index-4L7o7Sqz.js";import{M as g}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function l(s){const e=i(i({a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul"},d()),s.components);return n.jsxs(n.Fragment,{children:[n.jsx(g,{title:"Design System/Getting Started"}),`
`,n.jsx(e.h1,{id:"getting-started",children:"Getting Started"}),`
`,n.jsx(e.p,{children:"Este guia irá ajudá-lo a começar a usar o React Design System rapidamente."}),`
`,n.jsx(e.h2,{id:"instalação",children:"Instalação"}),`
`,n.jsx(e.h3,{id:"npm",children:"NPM"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`npm install @fabio.caffarello/react-design-system
`})}),`
`,n.jsx(e.h3,{id:"yarn",children:"Yarn"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`yarn add @fabio.caffarello/react-design-system
`})}),`
`,n.jsx(e.h3,{id:"pnpm",children:"PNPM"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`pnpm add @fabio.caffarello/react-design-system
`})}),`
`,n.jsx(e.h2,{id:"configuração-inicial",children:"Configuração Inicial"}),`
`,n.jsx(e.h3,{id:"1-configurar-o-theme-provider",children:"1. Configurar o Theme Provider"}),`
`,n.jsxs(e.p,{children:["Envolva sua aplicação com o ",n.jsx(e.code,{children:"AdvancedThemeProvider"}),":"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { AdvancedThemeProvider } from '@fabio.caffarello/react-design-system';

function App() {
  return (
    <AdvancedThemeProvider defaultTheme="light">
      {/* Sua aplicação aqui */}
    </AdvancedThemeProvider>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"2-importar-estilos",children:"2. Importar Estilos"}),`
`,n.jsx(e.p,{children:"Se você estiver usando TailwindCSS, certifique-se de que os estilos do design system estão incluídos:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// No seu arquivo principal (ex: main.tsx)
import '@fabio.caffarello/react-design-system/dist/style.css';
`})}),`
`,n.jsx(e.h3,{id:"3-primeiro-componente",children:"3. Primeiro Componente"}),`
`,n.jsx(e.p,{children:"Agora você pode usar os componentes:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Button, Input, Card } from '@fabio.caffarello/react-design-system';

function MyComponent() {
  return (
    <Card padding="large">
      <Input placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"estrutura-de-imports",children:"Estrutura de Imports"}),`
`,n.jsx(e.h3,{id:"import-completo",children:"Import Completo"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Button, Input, Card } from '@fabio.caffarello/react-design-system';
`})}),`
`,n.jsx(e.h3,{id:"import-por-categoria-recomendado",children:"Import por Categoria (Recomendado)"}),`
`,n.jsx(e.p,{children:"Para melhor tree shaking e performance:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Atoms
import { Button, Input } from '@fabio.caffarello/react-design-system/atoms';

// Molecules
import { Card, SearchInput } from '@fabio.caffarello/react-design-system/molecules';

// Organisms
import { Table, DataGrid } from '@fabio.caffarello/react-design-system/organisms';

// Tokens
import { getColorClass, getSpacingClass } from '@fabio.caffarello/react-design-system/tokens';
`})}),`
`,n.jsx(e.h2,{id:"exemplo-completo",children:"Exemplo Completo"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import React from 'react';
import {
  AdvancedThemeProvider,
  Button,
  Input,
  Card,
  Label,
} from '@fabio.caffarello/react-design-system';

function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card padding="large">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="primary">
          Login
        </Button>
      </Card>
    </form>
  );
}

function App() {
  return (
    <AdvancedThemeProvider defaultTheme="light">
      <LoginForm />
    </AdvancedThemeProvider>
  );
}

export default App;
`})}),`
`,n.jsx(e.h2,{id:"usando-design-tokens",children:"Usando Design Tokens"}),`
`,n.jsx(e.h3,{id:"cores",children:"Cores"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { getColorClass } from '@fabio.caffarello/react-design-system';

<div className={getColorClass('primary', 'DEFAULT', 'bg')}>
  Primary background
</div>
`})}),`
`,n.jsx(e.h3,{id:"espaçamento",children:"Espaçamento"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { getSpacingClass } from '@fabio.caffarello/react-design-system';

<div className={getSpacingClass('md', 'p')}>
  Medium padding
</div>
`})}),`
`,n.jsx(e.h3,{id:"tipografia",children:"Tipografia"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { getTypographyClasses } from '@fabio.caffarello/react-design-system';

<h1 className={getTypographyClasses('h1')}>
  Heading 1
</h1>
`})}),`
`,n.jsx(e.h2,{id:"temas",children:"Temas"}),`
`,n.jsx(e.h3,{id:"mudar-tema",children:"Mudar Tema"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useAdvancedTheme } from '@fabio.caffarello/react-design-system';

function ThemeToggle() {
  const { currentTheme, setTheme } = useAdvancedTheme();

  return (
    <button onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}>
      Switch to {currentTheme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"criar-tema-customizado",children:"Criar Tema Customizado"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { AdvancedThemeProvider, ThemeBuilder } from '@fabio.caffarello/react-design-system';

const customTheme = ThemeBuilder.create({
  name: 'my-theme',
  base: 'light',
  colors: {
    primary: {
      DEFAULT: { hex: '#your-color' },
    },
  },
}).build();

function App() {
  return (
    <AdvancedThemeProvider
      defaultTheme="light"
      initialThemes={[customTheme]}
    >
      {/* Sua aplicação */}
    </AdvancedThemeProvider>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"typescript",children:"TypeScript"}),`
`,n.jsx(e.p,{children:"O design system é totalmente tipado. Você terá autocomplete completo e type checking:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import type { ButtonProps } from '@fabio.caffarello/react-design-system';

function MyButton(props: ButtonProps) {
  return <Button {...props} />;
}
`})}),`
`,n.jsx(e.h2,{id:"próximos-passos",children:"Próximos Passos"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:["Explore os ",n.jsx(e.a,{href:"./Design%20System/Components",children:"componentes disponíveis"})]}),`
`,n.jsxs(e.li,{children:["Veja a ",n.jsx(e.a,{href:"./Design%20System/Component%20Status",children:"matriz de status"})]}),`
`,n.jsxs(e.li,{children:["Leia as ",n.jsx(e.a,{href:"./Design%20System/Best%20Practices",children:"melhores práticas"})]}),`
`,n.jsxs(e.li,{children:["Consulte o ",n.jsx(e.a,{href:"./Design%20System/Component%20Composition",children:"guia de composição"})]}),`
`,n.jsxs(e.li,{children:["Veja o ",n.jsx(e.a,{href:"./Design%20System/Accessibility",children:"guia de acessibilidade"})]}),`
`]}),`
`,n.jsx(e.h2,{id:"troubleshooting",children:"Troubleshooting"}),`
`,n.jsx(e.h3,{id:"componentes-não-aparecem",children:"Componentes não aparecem"}),`
`,n.jsx(e.p,{children:"Certifique-se de que:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:["O ",n.jsx(e.code,{children:"AdvancedThemeProvider"})," está envolvendo sua aplicação"]}),`
`,n.jsx(e.li,{children:"Os estilos CSS estão importados"}),`
`,n.jsx(e.li,{children:"Você está importando os componentes corretamente"}),`
`]}),`
`,n.jsx(e.h3,{id:"erros-de-typescript",children:"Erros de TypeScript"}),`
`,n.jsx(e.p,{children:"Certifique-se de que:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"Você tem TypeScript 5+ instalado"}),`
`,n.jsx(e.li,{children:"Os tipos estão sendo resolvidos corretamente"}),`
`,n.jsx(e.li,{children:"Você está usando os tipos exportados do design system"}),`
`]}),`
`,n.jsx(e.h3,{id:"estilos-não-aplicados",children:"Estilos não aplicados"}),`
`,n.jsx(e.p,{children:"Certifique-se de que:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"TailwindCSS está configurado"}),`
`,n.jsx(e.li,{children:"Os estilos do design system estão importados"}),`
`,n.jsx(e.li,{children:"O tema está configurado corretamente"}),`
`]}),`
`,n.jsx(e.h2,{id:"recursos",children:"Recursos"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"./Design%20System/Overview",children:"Documentação Completa"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://github.com/fabiocaffarello/react-design-system",rel:"nofollow",children:"GitHub Repository"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://github.com/fabiocaffarello/react-design-system/issues",rel:"nofollow",children:"Issues"})}),`
`]})]})}function S(s={}){const{wrapper:e}=i(i({},d()),s.components);return e?n.jsx(e,t(i({},s),{children:n.jsx(l,i({},s))})):l(s)}export{S as default};
