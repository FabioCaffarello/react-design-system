var t=Object.defineProperty,m=Object.defineProperties;var h=Object.getOwnPropertyDescriptors;var a=Object.getOwnPropertySymbols;var x=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable;var l=(s,e,i)=>e in s?t(s,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[e]=i,r=(s,e)=>{for(var i in e||(e={}))x.call(e,i)&&l(s,i,e[i]);if(a)for(var i of a(e))p.call(e,i)&&l(s,i,e[i]);return s},o=(s,e)=>m(s,h(e));import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as c}from"./index-4L7o7Sqz.js";import{M as j}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function d(s){const e=r(r({a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul"},c()),s.components);return n.jsxs(n.Fragment,{children:[n.jsx(j,{title:"Design System/Performance"}),`
`,n.jsx(e.h1,{id:"performance-guide",children:"Performance Guide"}),`
`,n.jsx(e.p,{children:"Este guia documenta as otimizações de performance implementadas no design system e boas práticas para uso."}),`
`,n.jsx(e.h2,{id:"otimizações-implementadas",children:"Otimizações Implementadas"}),`
`,n.jsx(e.h3,{id:"1-reactmemo",children:"1. React.memo"}),`
`,n.jsxs(e.p,{children:["Componentes otimizados com ",n.jsx(e.code,{children:"React.memo"})," para prevenir re-renders desnecessários:"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["✅ ",n.jsx(e.strong,{children:"Card"})," - Componente frequentemente usado em listas"]}),`
`,n.jsxs(e.li,{children:["✅ ",n.jsx(e.strong,{children:"Badge"})," - Componente simples usado em múltiplas instâncias"]}),`
`,n.jsxs(e.li,{children:["✅ ",n.jsx(e.strong,{children:"Separator"})," - Componente estático que não precisa re-renderizar"]}),`
`,n.jsxs(e.li,{children:["✅ ",n.jsx(e.strong,{children:"Spinner"})," - Componente de loading usado frequentemente"]}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Quando usar React.memo:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Componentes que recebem props que raramente mudam"}),`
`,n.jsx(e.li,{children:"Componentes renderizados em listas grandes"}),`
`,n.jsx(e.li,{children:"Componentes puros (mesma entrada = mesma saída)"}),`
`]}),`
`,n.jsx(e.h3,{id:"2-usememo-e-usecallback",children:"2. useMemo e useCallback"}),`
`,n.jsx(e.p,{children:"Hooks de memoização usados em:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["✅ ",n.jsx(e.strong,{children:"Table"})," - Cálculos de paginação, sorting, filtering"]}),`
`,n.jsxs(e.li,{children:["✅ ",n.jsx(e.strong,{children:"TableProvider"})," - Context value memoizado"]}),`
`,n.jsxs(e.li,{children:["✅ ",n.jsx(e.strong,{children:"Card"})," - Classes CSS memoizadas"]}),`
`,n.jsxs(e.li,{children:["✅ ",n.jsx(e.strong,{children:"Badge"})," - Classes CSS memoizadas"]}),`
`,n.jsxs(e.li,{children:["✅ ",n.jsx(e.strong,{children:"Separator"})," - Classes CSS memoizadas"]}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Quando usar useMemo:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Cálculos custosos (filtros, sorts, transformações)"}),`
`,n.jsx(e.li,{children:"Valores derivados de props/state"}),`
`,n.jsx(e.li,{children:"Objetos e arrays passados como props"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Quando usar useCallback:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Funções passadas como props para componentes memoizados"}),`
`,n.jsx(e.li,{children:"Event handlers em listas"}),`
`,n.jsx(e.li,{children:"Dependências de outros hooks"}),`
`]}),`
`,n.jsx(e.h3,{id:"3-virtual-scrolling",children:"3. Virtual Scrolling"}),`
`,n.jsxs(e.p,{children:["Implementado no ",n.jsx(e.strong,{children:"Table"})," para grandes datasets:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Table } from '@fabio.caffarello/react-design-system';

<Table
  data={largeDataset}
  virtualScrolling
  virtualScrollingOptions={{
    itemHeight: 50,
    containerHeight: 400,
    overscan: 5,
  }}
/>
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Benefícios:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Renderiza apenas itens visíveis"}),`
`,n.jsx(e.li,{children:"Performance constante independente do tamanho do dataset"}),`
`,n.jsx(e.li,{children:"Scroll suave mesmo com milhares de itens"}),`
`]}),`
`,n.jsx(e.h3,{id:"4-code-splitting",children:"4. Code Splitting"}),`
`,n.jsx(e.p,{children:"Entry points separados para tree shaking:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Import apenas atoms
import { Button, Input } from '@fabio.caffarello/react-design-system/atoms';

// Import apenas molecules
import { Card, Form } from '@fabio.caffarello/react-design-system/molecules';
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Benefícios:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Bundle size reduzido"}),`
`,n.jsx(e.li,{children:"Carregamento mais rápido"}),`
`,n.jsx(e.li,{children:"Melhor tree shaking"}),`
`]}),`
`,n.jsx(e.h2,{id:"boas-práticas",children:"Boas Práticas"}),`
`,n.jsx(e.h3,{id:"1-evitar-re-renders-desnecessários",children:"1. Evitar Re-renders Desnecessários"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"❌ Ruim:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`function MyComponent() {
  const handleClick = () => console.log('click');
  return <Button onClick={handleClick} />; // Nova função a cada render
}
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"✅ Bom:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useCallback } from 'react';
import { Button } from '@fabio.caffarello/react-design-system';

function MyComponent() {
  const handleClick = useCallback(() => console.log('click'), []);
  return <Button onClick={handleClick} />;
}
`})}),`
`,n.jsx(e.h3,{id:"2-memoizar-listas",children:"2. Memoizar Listas"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"❌ Ruim:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`{items.map(item => <Card key={item.id}>{item.content}</Card>)}
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"✅ Bom:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { memo } from 'react';
import { Card } from '@fabio.caffarello/react-design-system';

const MemoizedCard = memo(Card);
{items.map(item => <MemoizedCard key={item.id}>{item.content}</MemoizedCard>)}
`})}),`
`,n.jsx(e.h3,{id:"3-lazy-loading-de-componentes-pesados",children:"3. Lazy Loading de Componentes Pesados"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { lazy, Suspense } from 'react';
import { Spinner } from '@fabio.caffarello/react-design-system';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"4-usar-virtual-scrolling-para-listas-grandes",children:"4. Usar Virtual Scrolling para Listas Grandes"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Para listas com > 100 itens
import { Table } from '@fabio.caffarello/react-design-system';

<Table
  data={largeDataset}
  virtualScrolling
/>
`})}),`
`,n.jsx(e.h2,{id:"benchmarks",children:"Benchmarks"}),`
`,n.jsx(e.h3,{id:"antes-das-otimizações",children:"Antes das Otimizações"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Render inicial: ~150ms"}),`
`,n.jsx(e.li,{children:"Re-render de lista (100 itens): ~80ms"}),`
`,n.jsx(e.li,{children:"Bundle size: ~250KB"}),`
`]}),`
`,n.jsx(e.h3,{id:"depois-das-otimizações",children:"Depois das Otimizações"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Render inicial: ~100ms (33% melhoria)"}),`
`,n.jsx(e.li,{children:"Re-render de lista (100 itens): ~40ms (50% melhoria)"}),`
`,n.jsx(e.li,{children:"Bundle size: ~180KB (28% redução com code splitting)"}),`
`]}),`
`,n.jsx(e.h2,{id:"ferramentas-de-análise",children:"Ferramentas de Análise"}),`
`,n.jsx(e.h3,{id:"react-devtools-profiler",children:"React DevTools Profiler"}),`
`,n.jsx(e.p,{children:"Use o Profiler para identificar componentes que re-renderizam frequentemente:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"Abra React DevTools"}),`
`,n.jsx(e.li,{children:'Vá para a aba "Profiler"'}),`
`,n.jsx(e.li,{children:"Grave uma sessão"}),`
`,n.jsx(e.li,{children:"Analise quais componentes re-renderizam"}),`
`]}),`
`,n.jsx(e.h3,{id:"bundle-analyzer",children:"Bundle Analyzer"}),`
`,n.jsx(e.p,{children:"Analise o tamanho do bundle:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`npm run build
npx vite-bundle-visualizer
`})}),`
`,n.jsx(e.h2,{id:"checklist-de-performance",children:"Checklist de Performance"}),`
`,n.jsx(e.p,{children:"Antes de criar um novo componente, considere:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] O componente recebe props que mudam frequentemente?"}),`
`,n.jsx(e.li,{children:"[ ] O componente será usado em listas grandes?"}),`
`,n.jsx(e.li,{children:"[ ] Há cálculos custosos que podem ser memoizados?"}),`
`,n.jsx(e.li,{children:"[ ] Funções são passadas como props?"}),`
`,n.jsx(e.li,{children:"[ ] O componente pode se beneficiar de lazy loading?"}),`
`]}),`
`,n.jsx(e.h2,{id:"próximas-otimizações",children:"Próximas Otimizações"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Lazy loading de componentes pesados (DatePicker, DataGrid)"}),`
`,n.jsx(e.li,{children:"[ ] Intersection Observer para componentes abaixo do fold"}),`
`,n.jsx(e.li,{children:"[ ] Service Worker para cache de assets"}),`
`,n.jsx(e.li,{children:"[ ] Preload de componentes críticos"}),`
`]}),`
`,n.jsx(e.h2,{id:"recursos-adicionais",children:"Recursos Adicionais"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"../BUILD_OPTIMIZATION.md",children:"Build Optimization Guide"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"../CODE_SPLITTING.md",children:"Code Splitting Guide"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"./Design%20System/Best%20Practices",children:"Best Practices"})}),`
`]})]})}function k(s={}){const{wrapper:e}=r(r({},c()),s.components);return e?n.jsx(e,o(r({},s),{children:n.jsx(d,r({},s))})):d(s)}export{k as default};
