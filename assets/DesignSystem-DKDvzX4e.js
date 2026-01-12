var c=Object.defineProperty,h=Object.defineProperties;var m=Object.getOwnPropertyDescriptors;var o=Object.getOwnPropertySymbols;var x=Object.prototype.hasOwnProperty,j=Object.prototype.propertyIsEnumerable;var t=(n,e,i)=>e in n?c(n,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):n[e]=i,r=(n,e)=>{for(var i in e||(e={}))x.call(e,i)&&t(n,i,e[i]);if(o)for(var i of o(e))j.call(e,i)&&t(n,i,e[i]);return n},a=(n,e)=>h(n,m(e));import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as d}from"./index-4L7o7Sqz.js";import{M as p}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function l(n){const e=r(r({a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul"},d()),n.components);return s.jsxs(s.Fragment,{children:[s.jsx(p,{title:"Design System/Overview"}),`
`,s.jsx(e.h1,{id:"react-design-system",children:"React Design System"}),`
`,s.jsx(e.p,{children:"Bem-vindo ao React Design System! Este é um sistema de design moderno, escalável e flexível construído com React, TypeScript e Vite."}),`
`,s.jsx(e.h2,{id:"visão-geral",children:"Visão Geral"}),`
`,s.jsx(e.p,{children:"O React Design System fornece uma base sólida para construir componentes de UI consistentes, acessíveis e reutilizáveis em múltiplos projetos frontend."}),`
`,s.jsx(e.h3,{id:"características-principais",children:"Características Principais"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Atomic Design"}),": Organizado em Atoms, Molecules e Organisms para máxima reutilização"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Type-Safe"}),": Totalmente tipado com TypeScript"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Acessível"}),": WCAG 2.1 AA compliant"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Testado"}),": >80% de cobertura de testes"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Documentado"}),": Storybook com exemplos interativos"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Performático"}),": Otimizado com code splitting e React.memo"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Temático"}),": Sistema de temas avançado com suporte a múltiplos temas"]}),`
`]}),`
`,s.jsx(e.h2,{id:"estrutura",children:"Estrutura"}),`
`,s.jsx(e.h3,{id:"atoms",children:"Atoms"}),`
`,s.jsx(e.p,{children:"Componentes básicos e indivisíveis que formam a base do sistema."}),`
`,s.jsxs(e.p,{children:[s.jsx(e.strong,{children:"Exemplos"}),": Button, Input, Text, Badge, Avatar, Spinner"]}),`
`,s.jsx(e.h3,{id:"molecules",children:"Molecules"}),`
`,s.jsx(e.p,{children:"Combinações de atoms que formam componentes mais complexos."}),`
`,s.jsxs(e.p,{children:[s.jsx(e.strong,{children:"Exemplos"}),": InputWithLabel, Card, SearchInput, Rating, FileUpload"]}),`
`,s.jsx(e.h3,{id:"organisms",children:"Organisms"}),`
`,s.jsx(e.p,{children:"Componentes complexos que combinam molecules e atoms."}),`
`,s.jsxs(e.p,{children:[s.jsx(e.strong,{children:"Exemplos"}),": Table, DataGrid, Stepper, Timeline, CommandPalette"]}),`
`,s.jsx(e.h2,{id:"design-tokens",children:"Design Tokens"}),`
`,s.jsx(e.p,{children:"O sistema utiliza design tokens para garantir consistência:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Cores"}),": Sistema semântico com suporte a light/dark themes"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Espaçamento"}),": Baseado em unidades de 4px"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Tipografia"}),": Escala tipográfica consistente"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Sombras"}),": Sistema de elevação"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Raio"}),": Bordas arredondadas padronizadas"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Animações"}),": Durações e easing functions consistentes"]}),`
`]}),`
`,s.jsxs(e.p,{children:["Veja a ",s.jsx(e.a,{href:"./Design%20System/Tokens",children:"documentação completa de tokens"}),"."]}),`
`,s.jsx(e.h2,{id:"temas",children:"Temas"}),`
`,s.jsx(e.p,{children:"O sistema suporta temas avançados:"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Temas Built-in"}),": Light e Dark"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Temas Customizados"}),": Crie seus próprios temas"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"CSS Variables"}),": Geração automática de variáveis CSS"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Theme Inheritance"}),": Herde de temas base"]}),`
`,s.jsxs(e.li,{children:[s.jsx(e.strong,{children:"Múltiplos Temas"}),": Use vários temas simultaneamente"]}),`
`]}),`
`,s.jsxs(e.p,{children:["Veja a ",s.jsx(e.a,{href:"./Design%20System/Themes",children:"documentação de temas"}),"."]}),`
`,s.jsx(e.h2,{id:"instalação",children:"Instalação"}),`
`,s.jsx(e.pre,{children:s.jsx(e.code,{className:"language-bash",children:`npm install @fabio.caffarello/react-design-system
`})}),`
`,s.jsx(e.h2,{id:"uso-básico",children:"Uso Básico"}),`
`,s.jsx(e.pre,{children:s.jsx(e.code,{className:"language-tsx",children:`import { Button, Input, Card } from '@fabio.caffarello/react-design-system';
import { AdvancedThemeProvider } from '@fabio.caffarello/react-design-system';

function App() {
  return (
    <AdvancedThemeProvider defaultTheme="light">
      <Card padding="large">
        <Input placeholder="Enter your name" />
        <Button variant="primary">Submit</Button>
      </Card>
    </AdvancedThemeProvider>
  );
}
`})}),`
`,s.jsx(e.h2,{id:"recursos",children:"Recursos"}),`
`,s.jsx(e.h3,{id:"acessibilidade",children:"Acessibilidade"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsx(e.li,{children:"WCAG 2.1 AA compliant"}),`
`,s.jsx(e.li,{children:"Navegação por teclado completa"}),`
`,s.jsx(e.li,{children:"Suporte a screen readers"}),`
`,s.jsx(e.li,{children:"ARIA attributes apropriados"}),`
`]}),`
`,s.jsx(e.h3,{id:"performance",children:"Performance"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsx(e.li,{children:"Code splitting por categoria"}),`
`,s.jsx(e.li,{children:"React.memo em componentes otimizados"}),`
`,s.jsx(e.li,{children:"Tree shaking automático"}),`
`,s.jsx(e.li,{children:"Bundle size otimizado"}),`
`]}),`
`,s.jsx(e.h3,{id:"testes",children:"Testes"}),`
`,s.jsxs(e.ul,{children:[`
`,s.jsxs(e.li,{children:[`
`,s.jsxs(e.blockquote,{children:[`
`,s.jsx(e.p,{children:"80% de cobertura de testes"}),`
`]}),`
`]}),`
`,s.jsx(e.li,{children:"Testes de acessibilidade automatizados"}),`
`,s.jsx(e.li,{children:"Testes de regressão visual no Storybook"}),`
`]}),`
`,s.jsx(e.h2,{id:"próximos-passos",children:"Próximos Passos"}),`
`,s.jsxs(e.ol,{children:[`
`,s.jsxs(e.li,{children:["Explore os ",s.jsx(e.a,{href:"./Design%20System/Components",children:"componentes disponíveis"})]}),`
`,s.jsxs(e.li,{children:["Veja a ",s.jsx(e.a,{href:"./Design%20System/Component%20Status",children:"matriz de status dos componentes"})]}),`
`,s.jsxs(e.li,{children:["Leia o ",s.jsx(e.a,{href:"./Design%20System/Getting%20Started",children:"guia de getting started"})]}),`
`,s.jsxs(e.li,{children:["Consulte as ",s.jsx(e.a,{href:"./Design%20System/Best%20Practices",children:"melhores práticas"})]}),`
`]}),`
`,s.jsx(e.h2,{id:"contribuindo",children:"Contribuindo"}),`
`,s.jsxs(e.p,{children:["Contribuições são bem-vindas! Veja nosso ",s.jsx(e.a,{href:"https://github.com/fabiocaffarello/react-design-system/blob/main/CONTRIBUTING.md",rel:"nofollow",children:"guia de contribuição"}),"."]}),`
`,s.jsx(e.h2,{id:"licença",children:"Licença"}),`
`,s.jsx(e.p,{children:"MIT License - veja o arquivo LICENSE para detalhes."})]})}function y(n={}){const{wrapper:e}=r(r({},d()),n.components);return e?s.jsx(e,a(r({},n),{children:s.jsx(l,r({},n))})):l(n)}export{y as default};
