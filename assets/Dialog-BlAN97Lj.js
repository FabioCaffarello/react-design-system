var d=Object.defineProperty,g=Object.defineProperties;var h=Object.getOwnPropertyDescriptors;var s=Object.getOwnPropertySymbols;var x=Object.prototype.hasOwnProperty,j=Object.prototype.propertyIsEnumerable;var t=(i,n,l)=>n in i?d(i,n,{enumerable:!0,configurable:!0,writable:!0,value:l}):i[n]=l,o=(i,n)=>{for(var l in n||(n={}))x.call(n,l)&&t(i,l,n[l]);if(s)for(var l of s(n))j.call(n,l)&&t(i,l,n[l]);return i},r=(i,n)=>g(i,h(n));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{useMDXComponents as c}from"./index-4L7o7Sqz.js";import{M as p}from"./WithTooltip-SK46ZJ2J-Yz3EUbRo.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";function a(i){const n=o(o({code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul"},c()),i.components);return e.jsxs(e.Fragment,{children:[e.jsx(p,{title:"Organisms/Dialog"}),`
`,e.jsx(n.h1,{id:"dialog",children:"Dialog"}),`
`,e.jsx(n.p,{children:"A flexible and accessible dialog component using the compound components pattern. Supports both controlled and uncontrolled modes with full keyboard navigation and focus management."}),`
`,e.jsx(n.h2,{id:"features",children:"Features"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Compound Components"}),": Flexible API with composable parts"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Controlled/Uncontrolled"}),": Works in both modes"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Focus Trap"}),": Automatically traps focus within dialog"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Portal Rendering"}),": Renders outside DOM hierarchy"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Accessibility"}),": Full ARIA support and keyboard navigation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Sizes"}),": Multiple size options (sm, md, lg, xl, fullscreen)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Body Scroll Lock"}),": Prevents background scrolling when open"]}),`
`]}),`
`,e.jsx(n.h2,{id:"basic-usage",children:"Basic Usage"}),`
`,e.jsx(n.h3,{id:"uncontrolled-mode",children:"Uncontrolled Mode"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Dialog, Button } from '@fabio.caffarello/react-design-system';

<Dialog>
  <Dialog.Trigger>
    <Button>Open Dialog</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Dialog Title</Dialog.Title>
      <Dialog.Description>
        Dialog description text
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Dialog.Close>
        <Button variant="outline">Cancel</Button>
      </Dialog.Close>
      <Button>Confirm</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>
`})}),`
`,e.jsx(n.h3,{id:"controlled-mode",children:"Controlled Mode"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useState } from 'react';
import { Dialog, Button } from '@fabio.caffarello/react-design-system';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Dialog Title</Dialog.Title>
          </Dialog.Header>
          <Dialog.Footer>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </>
  );
}
`})}),`
`,e.jsx(n.h2,{id:"compound-components",children:"Compound Components"}),`
`,e.jsx(n.h3,{id:"dialogtrigger",children:"Dialog.Trigger"}),`
`,e.jsx(n.p,{children:"Opens the dialog when clicked:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Dialog.Trigger>
  <Button>Open</Button>
</Dialog.Trigger>
`})}),`
`,e.jsx(n.h3,{id:"dialogcontent",children:"Dialog.Content"}),`
`,e.jsx(n.p,{children:"The main dialog container:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Dialog.Content size="lg" closeOnOverlayClick closeOnEscape>
  {/* Content */}
</Dialog.Content>
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Props:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"size"}),": 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"closeOnOverlayClick"}),": Close when clicking overlay"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"closeOnEscape"}),": Close on Escape key"]}),`
`]}),`
`,e.jsx(n.h3,{id:"dialogheader",children:"Dialog.Header"}),`
`,e.jsx(n.p,{children:"Container for title and description:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Dialog.Header>
  <Dialog.Title>Title</Dialog.Title>
  <Dialog.Description>Description</Dialog.Description>
</Dialog.Header>
`})}),`
`,e.jsx(n.h3,{id:"dialogtitle",children:"Dialog.Title"}),`
`,e.jsx(n.p,{children:"The dialog title (required for accessibility):"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Dialog.Title>Dialog Title</Dialog.Title>
`})}),`
`,e.jsx(n.h3,{id:"dialogdescription",children:"Dialog.Description"}),`
`,e.jsx(n.p,{children:"Optional description text:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Dialog.Description>
  Additional context about the dialog
</Dialog.Description>
`})}),`
`,e.jsx(n.h3,{id:"dialogfooter",children:"Dialog.Footer"}),`
`,e.jsx(n.p,{children:"Container for action buttons:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Dialog.Footer>
  <Button>Action</Button>
</Dialog.Footer>
`})}),`
`,e.jsx(n.h3,{id:"dialogclose",children:"Dialog.Close"}),`
`,e.jsx(n.p,{children:"Closes the dialog when clicked:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Dialog.Close>
  <Button variant="outline">Close</Button>
</Dialog.Close>
`})}),`
`,e.jsx(n.h2,{id:"sizes",children:"Sizes"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Dialog.Content size="sm">Small Dialog</Dialog.Content>
<Dialog.Content size="md">Medium Dialog</Dialog.Content>
<Dialog.Content size="lg">Large Dialog</Dialog.Content>
<Dialog.Content size="xl">Extra Large Dialog</Dialog.Content>
<Dialog.Content size="fullscreen">Fullscreen Dialog</Dialog.Content>
`})}),`
`,e.jsx(n.h2,{id:"focus-management",children:"Focus Management"}),`
`,e.jsx(n.p,{children:"The Dialog automatically:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Focuses the first focusable element when opened"}),`
`,e.jsx(n.li,{children:"Traps focus within the dialog"}),`
`,e.jsx(n.li,{children:"Restores focus to the trigger when closed"}),`
`,e.jsx(n.li,{children:"Prevents body scrolling when open"}),`
`]}),`
`,e.jsx(n.h2,{id:"keyboard-navigation",children:"Keyboard Navigation"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Escape"}),": Closes the dialog (if ",e.jsx(n.code,{children:"closeOnEscape"})," is true)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tab"}),": Navigates between focusable elements"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Shift+Tab"}),": Navigates backwards"]}),`
`,e.jsx(n.li,{children:"Focus wraps within the dialog"}),`
`]}),`
`,e.jsx(n.h2,{id:"accessibility",children:"Accessibility"}),`
`,e.jsx(n.p,{children:"The Dialog component follows ARIA best practices:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Uses ",e.jsx(n.code,{children:'role="dialog"'})," with ",e.jsx(n.code,{children:'aria-modal="true"'})]}),`
`,e.jsxs(n.li,{children:["Associates title via ",e.jsx(n.code,{children:"aria-labelledby"})]}),`
`,e.jsxs(n.li,{children:["Associates description via ",e.jsx(n.code,{children:"aria-describedby"})]}),`
`,e.jsx(n.li,{children:"Manages focus automatically"}),`
`,e.jsx(n.li,{children:"Supports screen readers"}),`
`]}),`
`,e.jsx(n.h3,{id:"required-aria-attributes",children:"Required ARIA Attributes"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Title"}),": Always provide a ",e.jsx(n.code,{children:"Dialog.Title"})," for ",e.jsx(n.code,{children:"aria-labelledby"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Description"}),": Optional but recommended for ",e.jsx(n.code,{children:"aria-describedby"})]}),`
`]}),`
`,e.jsx(n.h2,{id:"best-practices",children:"Best Practices"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Always provide a title"}),": Required for accessibility"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Use descriptions"}),": Help users understand the dialog purpose"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Clear actions"}),": Make button labels clear and actionable"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Escape to close"}),": Allow users to close with Escape key"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Focus management"}),": Let the component handle focus automatically"]}),`
`]})]})}function B(i={}){const{wrapper:n}=o(o({},c()),i.components);return n?e.jsx(n,r(o({},i),{children:e.jsx(a,o({},i))})):a(i)}export{B as default};
