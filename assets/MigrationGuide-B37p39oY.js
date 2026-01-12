var c=Object.defineProperty,m=Object.defineProperties;var h=Object.getOwnPropertyDescriptors;var o=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var a=(s,e,i)=>e in s?c(s,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[e]=i,r=(s,e)=>{for(var i in e||(e={}))p.call(e,i)&&a(s,i,e[i]);if(o)for(var i of o(e))x.call(e,i)&&a(s,i,e[i]);return s},t=(s,e)=>m(s,h(e));import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as l}from"./index-4L7o7Sqz.js";import{M as u}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function d(s){const e=r(r({a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul"},l()),s.components);return n.jsxs(n.Fragment,{children:[n.jsx(u,{title:"Design System/Migration Guide"}),`
`,n.jsx(e.h1,{id:"migration-guide",children:"Migration Guide"}),`
`,n.jsx(e.p,{children:"Este guia ajuda você a migrar de versões anteriores do React Design System ou de outras bibliotecas de componentes."}),`
`,n.jsx(e.h2,{id:"migração-do-themeprovider-para-advancedthemeprovider",children:"Migração do ThemeProvider para AdvancedThemeProvider"}),`
`,n.jsx(e.h3,{id:"antes-v180",children:"Antes (v1.8.0)"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { ThemeProvider, useTheme } from '@fabio.caffarello/react-design-system';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <MyComponent />
    </ThemeProvider>
  );
}

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Toggle</button>;
}
`})}),`
`,n.jsx(e.h3,{id:"depois-v190",children:"Depois (v1.9.0+)"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { AdvancedThemeProvider, useAdvancedTheme } from '@fabio.caffarello/react-design-system';

function App() {
  return (
    <AdvancedThemeProvider defaultTheme="light">
      <MyComponent />
    </AdvancedThemeProvider>
  );
}

function MyComponent() {
  const { currentTheme, setTheme } = useAdvancedTheme();
  return (
    <button onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}>
      Toggle
    </button>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"mudanças-principais",children:"Mudanças Principais"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"theme"})," → ",n.jsx(e.code,{children:"currentTheme"})," (agora é string, não 'light' | 'dark')"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"toggleTheme()"})," → ",n.jsx(e.code,{children:"setTheme(themeName)"})," (mais flexível)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"isDark"})," → ",n.jsx(e.code,{children:"currentTheme === 'dark'"})," (verificação manual)"]}),`
`,n.jsx(e.li,{children:"Suporte a múltiplos temas"}),`
`,n.jsx(e.li,{children:"CSS variables automáticas"}),`
`]}),`
`,n.jsx(e.h2,{id:"migração-de-imports",children:"Migração de Imports"}),`
`,n.jsx(e.h3,{id:"antes-import-completo",children:"Antes: Import Completo"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Button, Input, Card } from '@fabio.caffarello/react-design-system';
`})}),`
`,n.jsx(e.h3,{id:"depois-import-por-categoria-recomendado",children:"Depois: Import por Categoria (Recomendado)"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Melhor tree shaking e performance
import { Button, Input } from '@fabio.caffarello/react-design-system/atoms';
import { Card } from '@fabio.caffarello/react-design-system/molecules';
`})}),`
`,n.jsx(e.h2,{id:"migração-de-tokens",children:"Migração de Tokens"}),`
`,n.jsx(e.h3,{id:"antes-classes-hardcoded",children:"Antes: Classes Hardcoded"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<div className="p-4 bg-indigo-500 text-white">
  Content
</div>
`})}),`
`,n.jsx(e.h3,{id:"depois-design-tokens",children:"Depois: Design Tokens"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:"import { getSpacingClass, getColorClass } from '@fabio.caffarello/react-design-system';\n\n<div className={`${getSpacingClass('md', 'p')} ${getColorClass('primary', 'DEFAULT', 'bg')} ${getColorClass('primary', 'contrast', 'text')}`}>\n  Content\n</div>\n"})}),`
`,n.jsx(e.h2,{id:"migração-de-outras-bibliotecas",children:"Migração de Outras Bibliotecas"}),`
`,n.jsx(e.h3,{id:"de-material-ui",children:"De Material-UI"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Material-UI
import { Button, TextField } from '@mui/material';

// React Design System
import { Button, Input } from '@fabio.caffarello/react-design-system/atoms';
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Mudanças:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"TextField"})," → ",n.jsx(e.code,{children:"Input"})]}),`
`,n.jsx(e.li,{children:"Props diferentes (consulte documentação)"}),`
`,n.jsx(e.li,{children:"Sistema de temas diferente"}),`
`]}),`
`,n.jsx(e.h3,{id:"de-ant-design",children:"De Ant Design"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Ant Design
import { Button, Input } from 'antd';

// React Design System
import { Button, Input } from '@fabio.caffarello/react-design-system/atoms';
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Mudanças:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Props podem ser diferentes"}),`
`,n.jsx(e.li,{children:"Sistema de grid diferente (use CSS Grid/Flexbox)"}),`
`,n.jsx(e.li,{children:"Ícones separados (use lucide-react)"}),`
`]}),`
`,n.jsx(e.h3,{id:"de-chakra-ui",children:"De Chakra UI"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Chakra UI
import { Button, Input, Box } from '@chakra-ui/react';

// React Design System
import { Button, Input, BoxWrapper } from '@fabio.caffarello/react-design-system';
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Mudanças:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"Box"})," → ",n.jsx(e.code,{children:"BoxWrapper"})," ou ",n.jsx(e.code,{children:"Card"})]}),`
`,n.jsx(e.li,{children:"Sistema de espaçamento similar (baseado em 4px)"}),`
`,n.jsx(e.li,{children:"Temas customizados via ThemeBuilder"}),`
`]}),`
`,n.jsx(e.h2,{id:"migração-de-versões-específicas",children:"Migração de Versões Específicas"}),`
`,n.jsx(e.h3,{id:"v180--v190",children:"v1.8.0 → v1.9.0"}),`
`,n.jsx(e.h4,{id:"novos-componentes",children:"Novos Componentes"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Novos atoms disponíveis
import { Switch, Separator, Accordion, Slider, Popover } from '@fabio.caffarello/react-design-system/atoms';

// Novos molecules disponíveis
import { SearchInput, Rating, FileUpload, TimePicker, ColorPicker } from '@fabio.caffarello/react-design-system/molecules';

// Novos organisms disponíveis
import { Stepper, Timeline, CommandPalette, DataGrid } from '@fabio.caffarello/react-design-system/organisms';
`})}),`
`,n.jsx(e.h4,{id:"novos-tokens",children:"Novos Tokens"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Novos tokens disponíveis
import {
  getAnimationClass,
  getZIndexClass,
  getOpacityClass,
  getGradientClass,
} from '@fabio.caffarello/react-design-system/tokens';
`})}),`
`,n.jsx(e.h4,{id:"sistema-de-temas",children:"Sistema de Temas"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Novo sistema de temas avançado
import { AdvancedThemeProvider, ThemeBuilder } from '@fabio.caffarello/react-design-system';

const customTheme = ThemeBuilder.create({
  name: 'custom',
  base: 'light',
  colors: {
    primary: {
      DEFAULT: { hex: '#custom-color' },
    },
  },
}).build();
`})}),`
`,n.jsx(e.h2,{id:"checklist-de-migração",children:"Checklist de Migração"}),`
`,n.jsx(e.h3,{id:"passo-1-atualizar-dependências",children:"Passo 1: Atualizar Dependências"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`npm install @fabio.caffarello/react-design-system@latest
`})}),`
`,n.jsx(e.h3,{id:"passo-2-atualizar-imports",children:"Passo 2: Atualizar Imports"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["[ ] Substituir ",n.jsx(e.code,{children:"ThemeProvider"})," por ",n.jsx(e.code,{children:"AdvancedThemeProvider"})]}),`
`,n.jsxs(e.li,{children:["[ ] Atualizar ",n.jsx(e.code,{children:"useTheme"})," para ",n.jsx(e.code,{children:"useAdvancedTheme"})]}),`
`,n.jsx(e.li,{children:"[ ] Considerar usar imports por categoria"}),`
`]}),`
`,n.jsx(e.h3,{id:"passo-3-atualizar-tokens",children:"Passo 3: Atualizar Tokens"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Substituir classes hardcoded por design tokens"}),`
`,n.jsx(e.li,{children:"[ ] Usar funções helper para tokens"}),`
`]}),`
`,n.jsx(e.h3,{id:"passo-4-testar",children:"Passo 4: Testar"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Testar todos os componentes"}),`
`,n.jsx(e.li,{children:"[ ] Verificar temas (light/dark)"}),`
`,n.jsx(e.li,{children:"[ ] Verificar acessibilidade"}),`
`,n.jsx(e.li,{children:"[ ] Verificar performance"}),`
`]}),`
`,n.jsx(e.h3,{id:"passo-5-otimizar",children:"Passo 5: Otimizar"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Usar code splitting (imports por categoria)"}),`
`,n.jsx(e.li,{children:"[ ] Remover imports não utilizados"}),`
`,n.jsx(e.li,{children:"[ ] Verificar bundle size"}),`
`]}),`
`,n.jsx(e.h2,{id:"exemplos-de-migração",children:"Exemplos de Migração"}),`
`,n.jsx(e.h3,{id:"exemplo-1-formulário-simples",children:"Exemplo 1: Formulário Simples"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Antes:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { ThemeProvider, Input, Button } from '@fabio.caffarello/react-design-system';

function LoginForm() {
  return (
    <ThemeProvider>
      <form>
        <input type="email" className="p-2 border" />
        <button className="bg-blue-500 text-white p-2">Login</button>
      </form>
    </ThemeProvider>
  );
}
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Depois:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import {
  AdvancedThemeProvider,
  Input,
  Button,
  Label,
} from '@fabio.caffarello/react-design-system';

function LoginForm() {
  return (
    <AdvancedThemeProvider defaultTheme="light">
      <form>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
        <Button variant="primary" type="submit">Login</Button>
      </form>
    </AdvancedThemeProvider>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"exemplo-2-card-com-estilos-customizados",children:"Exemplo 2: Card com Estilos Customizados"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Antes:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
  <h2 className="text-xl font-bold mb-2">Title</h2>
  <p className="text-gray-600">Content</p>
</div>
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Depois:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Card, Text } from '@fabio.caffarello/react-design-system';
import { getTypographyClasses } from '@fabio.caffarello/react-design-system/tokens';

<Card padding="medium" variant="default">
  <h2 className={getTypographyClasses('h2')}>Title</h2>
  <Text>Content</Text>
</Card>
`})}),`
`,n.jsx(e.h2,{id:"suporte",children:"Suporte"}),`
`,n.jsx(e.p,{children:"Se encontrar problemas durante a migração:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:["Consulte a ",n.jsx(e.a,{href:"./Design%20System/Overview",children:"documentação completa"})]}),`
`,n.jsxs(e.li,{children:["Veja os ",n.jsx(e.a,{href:"./Design%20System/Components",children:"exemplos no Storybook"})]}),`
`,n.jsxs(e.li,{children:["Abra uma ",n.jsx(e.a,{href:"https://github.com/fabiocaffarello/react-design-system/issues",rel:"nofollow",children:"issue no GitHub"})]}),`
`]}),`
`,n.jsx(e.h2,{id:"recursos-adicionais",children:"Recursos Adicionais"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"./Design%20System/Getting%20Started",children:"Getting Started Guide"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"./Design%20System/Best%20Practices",children:"Best Practices"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"./Design%20System/Component%20Composition",children:"Component Composition"})}),`
`]})]})}function S(s={}){const{wrapper:e}=r(r({},l()),s.components);return e?n.jsx(e,t(r({},s),{children:n.jsx(d,r({},s))})):d(s)}export{S as default};
