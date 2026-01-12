var c=Object.defineProperty,m=Object.defineProperties;var h=Object.getOwnPropertyDescriptors;var r=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,x=Object.prototype.propertyIsEnumerable;var o=(s,e,a)=>e in s?c(s,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[e]=a,i=(s,e)=>{for(var a in e||(e={}))p.call(e,a)&&o(s,a,e[a]);if(r)for(var a of r(e))x.call(e,a)&&o(s,a,e[a]);return s},t=(s,e)=>m(s,h(e));import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as d}from"./index-4L7o7Sqz.js";import{M as u}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function l(s){const e=i(i({a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul"},d()),s.components);return n.jsxs(n.Fragment,{children:[n.jsx(u,{title:"Design System/Accessibility"}),`
`,n.jsx(e.h1,{id:"accessibility-guide",children:"Accessibility Guide"}),`
`,n.jsx(e.p,{children:"Este guia explica como usar o React Design System de forma acessível e como os componentes atendem aos padrões WCAG 2.1 AA."}),`
`,n.jsx(e.h2,{id:"padrões-de-acessibilidade",children:"Padrões de Acessibilidade"}),`
`,n.jsxs(e.p,{children:["Todos os componentes do design system são ",n.jsx(e.strong,{children:"WCAG 2.1 AA compliant"}),", garantindo:"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ Contraste de cores adequado (4.5:1 para texto normal, 3:1 para texto grande)"}),`
`,n.jsx(e.li,{children:"✅ Navegação completa por teclado"}),`
`,n.jsx(e.li,{children:"✅ Suporte a screen readers"}),`
`,n.jsx(e.li,{children:"✅ ARIA attributes apropriados"}),`
`,n.jsx(e.li,{children:"✅ Focus management correto"}),`
`]}),`
`,n.jsx(e.h2,{id:"uso-acessível-de-componentes",children:"Uso Acessível de Componentes"}),`
`,n.jsx(e.h3,{id:"labels-sempre-obrigatórios",children:"Labels Sempre Obrigatórios"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Label associado
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />

// ❌ Incorreto: Sem label
<Input placeholder="Email" /> // Não acessível para screen readers
`})}),`
`,n.jsx(e.h3,{id:"aria-labels-para-ícones",children:"ARIA Labels para Ícones"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: ARIA label para botões com apenas ícones
<Button aria-label="Close dialog" onClick={handleClose}>
  <CloseIcon />
</Button>

// ❌ Incorreto: Sem contexto
<Button onClick={handleClose}>
  <CloseIcon />
</Button>
`})}),`
`,n.jsx(e.h3,{id:"descrições-adicionais",children:"Descrições Adicionais"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Descrição associada
<Input
  id="password"
  type="password"
  aria-describedby="password-help"
/>
<span id="password-help">Password must be at least 8 characters</span>

// ❌ Incorreto: Sem descrição
<Input type="password" />
`})}),`
`,n.jsx(e.h2,{id:"navegação-por-teclado",children:"Navegação por Teclado"}),`
`,n.jsx(e.p,{children:"Todos os componentes interativos suportam navegação por teclado:"}),`
`,n.jsx(e.h3,{id:"teclas-suportadas",children:"Teclas Suportadas"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Tab"}),": Navegar entre elementos"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Enter/Space"}),": Ativar botões e links"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Arrow Keys"}),": Navegar em menus, tabs, selects"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Escape"}),": Fechar modais e popovers"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Home/End"}),": Navegar para início/fim em listas"]}),`
`]}),`
`,n.jsx(e.h3,{id:"exemplo-menu-acessível",children:"Exemplo: Menu Acessível"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Dropdown, Button } from '@fabio.caffarello/react-design-system';

function AccessibleMenu() {
  return (
    <Dropdown
      trigger={<Button>Menu</Button>}
      items={[
        { label: 'Item 1', onClick: () => {} },
        { label: 'Item 2', onClick: () => {} },
      ]}
    />
  );
}
// Navegação por teclado já implementada
`})}),`
`,n.jsx(e.h2,{id:"focus-management",children:"Focus Management"}),`
`,n.jsx(e.h3,{id:"focus-trap-em-modais",children:"Focus Trap em Modais"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Modal, Button } from '@fabio.caffarello/react-design-system';

function AccessibleModal() {
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      // Focus trap automático
      // Focus retorna ao trigger ao fechar
    >
      <h2>Modal Title</h2>
      <p>Modal content</p>
      <Button onClick={handleClose}>Close</Button>
    </Modal>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"focus-visible",children:"Focus Visible"}),`
`,n.jsx(e.p,{children:"Todos os componentes têm estilos de focus visíveis:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`/* Automático em todos os componentes */
button:focus-visible {
  outline: 2px solid var(--color-primary-default);
  outline-offset: 2px;
}
`})}),`
`,n.jsx(e.h2,{id:"screen-readers",children:"Screen Readers"}),`
`,n.jsx(e.h3,{id:"estrutura-semântica",children:"Estrutura Semântica"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: HTML semântico
import { Card, Text, Button } from '@fabio.caffarello/react-design-system';

<Card>
  <Text variant="heading">Title</Text>
  <Text>Description</Text>
  <Button>Action</Button>
</Card>

// ❌ Incorreto: Divs genéricas
<div>
  <div>Title</div>
  <div>Description</div>
  <div>Action</div>
</div>
`})}),`
`,n.jsx(e.h3,{id:"aria-roles",children:"ARIA Roles"}),`
`,n.jsx(e.p,{children:"Componentes usam roles apropriados automaticamente:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Button usa role="button" automaticamente
<Button>Click me</Button>

// Input usa role apropriado baseado no type
<Input type="email" role="textbox" />

// Modal usa role="dialog" automaticamente
<Modal>Content</Modal>
`})}),`
`,n.jsx(e.h2,{id:"contraste-de-cores",children:"Contraste de Cores"}),`
`,n.jsx(e.h3,{id:"verificação-automática",children:"Verificação Automática"}),`
`,n.jsx(e.p,{children:"O design system garante contraste adequado:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Correto: Cores do design system garantem contraste
import { getColorClass } from '@fabio.caffarello/react-design-system';

<div className={getColorClass('primary', 'DEFAULT', 'bg')}>
  <Text className={getColorClass('primary', 'contrast', 'text')}>
    Text with proper contrast
  </Text>
</div>

// ❌ Evitar: Cores customizadas sem verificar contraste
<div className="bg-blue-500 text-blue-200">
  Text with poor contrast
</div>
`})}),`
`,n.jsx(e.h3,{id:"dark-mode",children:"Dark Mode"}),`
`,n.jsx(e.p,{children:"O sistema de temas garante contraste adequado em ambos os modos:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { AdvancedThemeProvider } from '@fabio.caffarello/react-design-system';

<AdvancedThemeProvider defaultTheme="dark">
  {/* Contraste garantido automaticamente */}
</AdvancedThemeProvider>
`})}),`
`,n.jsx(e.h2,{id:"formulários-acessíveis",children:"Formulários Acessíveis"}),`
`,n.jsx(e.h3,{id:"estrutura-completa",children:"Estrutura Completa"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Form, Label, Input, ErrorMessage, Button } from '@fabio.caffarello/react-design-system';

function AccessibleForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        required
        aria-required="true"
        aria-invalid={errors.email ? 'true' : 'false'}
        aria-describedby={errors.email ? 'email-error' : undefined}
      />
      {errors.email && (
        <ErrorMessage id="email-error">
          {errors.email}
        </ErrorMessage>
      )}

      <Button type="submit">Submit</Button>
    </Form>
  );
}
`})}),`
`,n.jsx(e.h3,{id:"validação-acessível",children:"Validação Acessível"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Input, ErrorMessage } from '@fabio.caffarello/react-design-system';

function ValidatedInput({ error, ...props }) {
  return (
    <div>
      <Input
        {...props}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? \`\${props.id}-error\` : undefined}
      />
      {error && (
        <ErrorMessage id={\`\${props.id}-error\`} role="alert">
          {error}
        </ErrorMessage>
      )}
    </div>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"listas-e-tabelas",children:"Listas e Tabelas"}),`
`,n.jsx(e.h3,{id:"tabelas-acessíveis",children:"Tabelas Acessíveis"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Table } from '@fabio.caffarello/react-design-system';

function AccessibleTable() {
  return (
    <Table
      data={data}
      columns={columns}
      // Headers automáticos com scope="col"
      // Caption opcional
      caption="User data table"
    />
  );
}
`})}),`
`,n.jsx(e.h3,{id:"listas-acessíveis",children:"Listas Acessíveis"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Card, Text } from '@fabio.caffarello/react-design-system';

function AccessibleList({ items }) {
  return (
    <ul role="list">
      {items.map((item) => (
        <li key={item.id}>
          <Card>
            <Text>{item.name}</Text>
          </Card>
        </li>
      ))}
    </ul>
  );
}
`})}),`
`,n.jsx(e.h2,{id:"animações-e-transições",children:"Animações e Transições"}),`
`,n.jsx(e.h3,{id:"preferências-de-movimento",children:"Preferências de Movimento"}),`
`,n.jsxs(e.p,{children:["O design system respeita ",n.jsx(e.code,{children:"prefers-reduced-motion"}),":"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`/* Automático em todos os componentes */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`})}),`
`,n.jsx(e.h3,{id:"animações-não-essenciais",children:"Animações Não Essenciais"}),`
`,n.jsx(e.p,{children:"Animações decorativas podem ser desabilitadas:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Animações são opcionais e podem ser desabilitadas
<Spinner /> // Animação pode ser desabilitada via CSS
`})}),`
`,n.jsx(e.h2,{id:"testes-de-acessibilidade",children:"Testes de Acessibilidade"}),`
`,n.jsx(e.h3,{id:"testes-automatizados",children:"Testes Automatizados"}),`
`,n.jsx(e.p,{children:"Todos os componentes têm testes de acessibilidade:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@fabio.caffarello/react-design-system';

expect.extend(toHaveNoViolations);

test('Button is accessible', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
`})}),`
`,n.jsx(e.h3,{id:"testes-manuais",children:"Testes Manuais"}),`
`,n.jsx(e.p,{children:"Checklist para testes manuais:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Navegação completa por teclado"}),`
`,n.jsx(e.li,{children:"[ ] Screen reader anuncia corretamente"}),`
`,n.jsx(e.li,{children:"[ ] Contraste de cores adequado"}),`
`,n.jsx(e.li,{children:"[ ] Focus visível em todos os elementos"}),`
`,n.jsx(e.li,{children:"[ ] Labels associados corretamente"}),`
`,n.jsx(e.li,{children:"[ ] Erros anunciados apropriadamente"}),`
`]}),`
`,n.jsx(e.h2,{id:"ferramentas",children:"Ferramentas"}),`
`,n.jsx(e.h3,{id:"axe-devtools",children:"axe DevTools"}),`
`,n.jsx(e.p,{children:"Use o axe DevTools para verificar acessibilidade:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"Instale a extensão do navegador"}),`
`,n.jsx(e.li,{children:"Abra a página"}),`
`,n.jsx(e.li,{children:"Execute a verificação"}),`
`,n.jsx(e.li,{children:"Corrija problemas encontrados"}),`
`]}),`
`,n.jsx(e.h3,{id:"wave",children:"WAVE"}),`
`,n.jsx(e.p,{children:"Use o WAVE para análise de acessibilidade:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:["Acesse ",n.jsx(e.a,{href:"https://wave.webaim.org",rel:"nofollow",children:"wave.webaim.org"})]}),`
`,n.jsx(e.li,{children:"Insira a URL ou código"}),`
`,n.jsx(e.li,{children:"Analise os resultados"}),`
`]}),`
`,n.jsx(e.h3,{id:"lighthouse",children:"Lighthouse"}),`
`,n.jsx(e.p,{children:"Use o Lighthouse para auditoria completa:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"Abra DevTools"}),`
`,n.jsx(e.li,{children:"Vá para a aba Lighthouse"}),`
`,n.jsx(e.li,{children:'Selecione "Accessibility"'}),`
`,n.jsx(e.li,{children:"Execute a auditoria"}),`
`]}),`
`,n.jsx(e.h2,{id:"checklist-de-acessibilidade",children:"Checklist de Acessibilidade"}),`
`,n.jsx(e.p,{children:"Antes de publicar um componente ou página:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Todos os inputs têm labels associados"}),`
`,n.jsx(e.li,{children:"[ ] Botões com apenas ícones têm aria-label"}),`
`,n.jsx(e.li,{children:"[ ] Navegação por teclado funciona"}),`
`,n.jsx(e.li,{children:"[ ] Contraste de cores adequado (4.5:1 mínimo)"}),`
`,n.jsx(e.li,{children:"[ ] Focus visível em todos os elementos"}),`
`,n.jsx(e.li,{children:"[ ] Screen reader anuncia corretamente"}),`
`,n.jsx(e.li,{children:"[ ] Erros são anunciados apropriadamente"}),`
`,n.jsx(e.li,{children:"[ ] Animações respeitam prefers-reduced-motion"}),`
`]}),`
`,n.jsx(e.h2,{id:"recursos-adicionais",children:"Recursos Adicionais"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://www.w3.org/WAI/WCAG21/quickref/",rel:"nofollow",children:"WCAG 2.1 Guidelines"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://www.w3.org/WAI/ARIA/apg/",rel:"nofollow",children:"ARIA Authoring Practices"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://webaim.org/",rel:"nofollow",children:"WebAIM"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://www.a11yproject.com/",rel:"nofollow",children:"A11y Project"})}),`
`]}),`
`,n.jsx(e.h2,{id:"suporte",children:"Suporte"}),`
`,n.jsx(e.p,{children:"Se encontrar problemas de acessibilidade:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:["Consulte a ",n.jsx(e.a,{href:"./Design%20System/Components",children:"documentação do componente"})]}),`
`,n.jsxs(e.li,{children:["Verifique os ",n.jsx(e.a,{href:"./Design%20System/Component%20Status",children:"testes de acessibilidade"})]}),`
`,n.jsxs(e.li,{children:["Abra uma ",n.jsx(e.a,{href:"https://github.com/fabiocaffarello/react-design-system/issues",rel:"nofollow",children:"issue no GitHub"})]}),`
`]})]})}function T(s={}){const{wrapper:e}=i(i({},d()),s.components);return e?n.jsx(e,t(i({},s),{children:n.jsx(l,i({},s))})):l(s)}export{T as default};
