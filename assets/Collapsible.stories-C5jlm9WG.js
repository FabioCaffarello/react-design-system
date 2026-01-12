var _=Object.defineProperty,q=Object.defineProperties;var z=Object.getOwnPropertyDescriptors;var u=Object.getOwnPropertySymbols;var F=Object.prototype.hasOwnProperty,G=Object.prototype.propertyIsEnumerable;var x=(n,a,o)=>a in n?_(n,a,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[a]=o,s=(n,a)=>{for(var o in a||(a={}))F.call(a,o)&&x(n,o,a[o]);if(u)for(var o of u(a))G.call(a,o)&&x(n,o,a[o]);return n},r=(n,a)=>q(n,z(a));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as H}from"./iframe-38FCFUQv.js";import{C as U}from"./ErrorMessage-3-I322lz.js";import"./Info-Cv2nzaKC.js";import{T as t}from"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import{B as J}from"./Button-CioV4BCG.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import"./preload-helper-BDBacUwf.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";const Ae={title:"Atoms/Collapsible",component:U,parameters:{docs:{description:{component:"A generic, reusable collapsible component for any content. Supports both controlled and uncontrolled modes."}}},argTypes:{defaultOpen:{control:"boolean",description:"Initial open state (uncontrolled mode)"},disabled:{control:"boolean",description:"Whether the collapsible is disabled"},duration:{control:"number",description:"Animation duration in milliseconds"}}},i={args:{defaultOpen:!0,trigger:e.jsx("div",{className:"px-4 py-2 bg-gray-100 rounded-md",children:e.jsx(t,{as:"span",className:"font-medium",children:"Click to toggle"})}),children:e.jsx("div",{className:"px-4 py-2",children:e.jsx(t,{children:"This is collapsible content that can be shown or hidden."})})}},l={args:{defaultOpen:!1,trigger:e.jsx("div",{className:"px-4 py-2 bg-gray-100 rounded-md",children:e.jsx(t,{as:"span",className:"font-medium",children:"Click to expand"})}),children:e.jsx("div",{className:"px-4 py-2",children:e.jsx(t,{children:"This content starts collapsed."})})}},d={render:()=>{const[n,a]=H.useState(!1);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs(J,{onClick:()=>a(!n),children:[n?"Close":"Open"," (External Control)"]}),e.jsx(U,{open:n,onOpenChange:a,trigger:e.jsx("div",{className:"px-4 py-2 bg-gray-100 rounded-md",children:e.jsx(t,{as:"span",className:"font-medium",children:"Controlled Collapsible"})}),children:e.jsx("div",{className:"px-4 py-2",children:e.jsx(t,{children:"This collapsible is controlled by external state."})})})]})}},p={args:{defaultOpen:!0,storageKey:"storybook-collapsible-state",trigger:e.jsx("div",{className:"px-4 py-2 bg-gray-100 rounded-md",children:e.jsx(t,{as:"span",className:"font-medium",children:"State persists in localStorage"})}),children:e.jsx("div",{className:"px-4 py-2",children:e.jsx(t,{children:"Toggle this and refresh the page - the state will be preserved!"})})}},c={args:{defaultOpen:!0,disabled:!0,trigger:e.jsx("div",{className:"px-4 py-2 bg-gray-100 rounded-md opacity-50",children:e.jsx(t,{as:"span",className:"font-medium",children:"Disabled (cannot toggle)"})}),children:e.jsx("div",{className:"px-4 py-2",children:e.jsx(t,{children:"This content cannot be toggled."})})}},m={args:{defaultOpen:!1,trigger:e.jsx("div",{className:"px-4 py-2 bg-gray-100 rounded-md",children:e.jsx(t,{as:"span",className:"font-medium",children:"Accessible Collapsible"})}),children:e.jsx("div",{className:"px-4 py-2",children:e.jsx(t,{children:"This collapsible has proper ARIA attributes: aria-expanded, aria-controls, and keyboard support (Enter/Space)."})})},parameters:{docs:{description:{story:"Demonstrates accessibility features: aria-expanded indicates state, aria-controls links trigger to content, and keyboard support (Enter/Space to toggle)."}}}},g={args:{defaultOpen:!1,trigger:e.jsx("div",{className:"px-4 py-2 bg-gray-100 rounded-md",children:e.jsx(t,{as:"span",className:"font-medium",children:"Try Keyboard Navigation"})}),children:e.jsx("div",{className:"px-4 py-2",children:e.jsx(t,{children:"Tab to focus, then press Enter or Space to toggle. The aria-expanded attribute updates automatically."})})},parameters:{docs:{description:{story:"Use Tab to focus the trigger, then Enter or Space to toggle. Screen readers will announce the state change."}}}};var h,b,y;i.parameters=r(s({},i.parameters),{docs:r(s({},(h=i.parameters)==null?void 0:h.docs),{source:s({originalSource:`{
  args: {
    defaultOpen: true,
    trigger: <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">Click to toggle</Text>
      </div>,
    children: <div className="px-4 py-2">
        <Text>This is collapsible content that can be shown or hidden.</Text>
      </div>
  }
}`},(y=(b=i.parameters)==null?void 0:b.docs)==null?void 0:y.source)})});var f,v,T;l.parameters=r(s({},l.parameters),{docs:r(s({},(f=l.parameters)==null?void 0:f.docs),{source:s({originalSource:`{
  args: {
    defaultOpen: false,
    trigger: <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">Click to expand</Text>
      </div>,
    children: <div className="px-4 py-2">
        <Text>This content starts collapsed.</Text>
      </div>
  }
}`},(T=(v=l.parameters)==null?void 0:v.docs)==null?void 0:T.source)})});var N,j,C;d.parameters=r(s({},d.parameters),{docs:r(s({},(N=d.parameters)==null?void 0:N.docs),{source:s({originalSource:`{
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="space-y-4">
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close" : "Open"} (External Control)
        </Button>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} trigger={<div className="px-4 py-2 bg-gray-100 rounded-md">
              <Text as="span" className="font-medium">Controlled Collapsible</Text>
            </div>}>
          <div className="px-4 py-2">
            <Text>This collapsible is controlled by external state.</Text>
          </div>
        </Collapsible>
      </div>;
  }
}`},(C=(j=d.parameters)==null?void 0:j.docs)==null?void 0:C.source)})});var O,S,k;p.parameters=r(s({},p.parameters),{docs:r(s({},(O=p.parameters)==null?void 0:O.docs),{source:s({originalSource:`{
  args: {
    defaultOpen: true,
    storageKey: "storybook-collapsible-state",
    trigger: <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">State persists in localStorage</Text>
      </div>,
    children: <div className="px-4 py-2">
        <Text>Toggle this and refresh the page - the state will be preserved!</Text>
      </div>
  }
}`},(k=(S=p.parameters)==null?void 0:S.docs)==null?void 0:k.source)})});var E,A,D;c.parameters=r(s({},c.parameters),{docs:r(s({},(E=c.parameters)==null?void 0:E.docs),{source:s({originalSource:`{
  args: {
    defaultOpen: true,
    disabled: true,
    trigger: <div className="px-4 py-2 bg-gray-100 rounded-md opacity-50">
        <Text as="span" className="font-medium">Disabled (cannot toggle)</Text>
      </div>,
    children: <div className="px-4 py-2">
        <Text>This content cannot be toggled.</Text>
      </div>
  }
}`},(D=(A=c.parameters)==null?void 0:A.docs)==null?void 0:D.source)})});var I,w,K;m.parameters=r(s({},m.parameters),{docs:r(s({},(I=m.parameters)==null?void 0:I.docs),{source:s({originalSource:`{
  args: {
    defaultOpen: false,
    trigger: <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">Accessible Collapsible</Text>
      </div>,
    children: <div className="px-4 py-2">
        <Text>This collapsible has proper ARIA attributes: aria-expanded, aria-controls, and keyboard support (Enter/Space).</Text>
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates accessibility features: aria-expanded indicates state, aria-controls links trigger to content, and keyboard support (Enter/Space to toggle).'
      }
    }
  }
}`},(K=(w=m.parameters)==null?void 0:w.docs)==null?void 0:K.source)})});var B,R,W;g.parameters=r(s({},g.parameters),{docs:r(s({},(B=g.parameters)==null?void 0:B.docs),{source:s({originalSource:`{
  args: {
    defaultOpen: false,
    trigger: <div className="px-4 py-2 bg-gray-100 rounded-md">
        <Text as="span" className="font-medium">Try Keyboard Navigation</Text>
      </div>,
    children: <div className="px-4 py-2">
        <Text>Tab to focus, then press Enter or Space to toggle. The aria-expanded attribute updates automatically.</Text>
      </div>
  },
  parameters: {
    docs: {
      description: {
        story: 'Use Tab to focus the trigger, then Enter or Space to toggle. Screen readers will announce the state change.'
      }
    }
  }
}`},(W=(R=g.parameters)==null?void 0:R.docs)==null?void 0:W.source)})});const De=["Default","DefaultClosed","Controlled","WithStorage","Disabled","Accessibility","KeyboardNavigation"];export{m as Accessibility,d as Controlled,i as Default,l as DefaultClosed,c as Disabled,g as KeyboardNavigation,p as WithStorage,De as __namedExportsOrder,Ae as default};
