var x=Object.defineProperty,j=Object.defineProperties;var O=Object.getOwnPropertyDescriptors;var d=Object.getOwnPropertySymbols;var L=Object.prototype.hasOwnProperty,T=Object.prototype.propertyIsEnumerable;var g=(n,t,o)=>t in n?x(n,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[t]=o,e=(n,t)=>{for(var o in t||(t={}))L.call(t,o)&&g(n,o,t[o]);if(d)for(var o of d(t))T.call(t,o)&&g(n,o,t[o]);return n},r=(n,t)=>j(n,O(t));import{j as i}from"./jsx-runtime-D_zvdyIk.js";import{D as K}from"./Dropdown-3XcqUhyy.js";import"./Info-Cv2nzaKC.js";import"./Text-sPV6kohR.js";import"./Input-DlIdFoDR.js";import{B as a}from"./Button-CioV4BCG.js";import"./BoxWrapper-CQWnzTQD.js";import"./Badge-CU7wk0t8.js";import"./Select-DlyDBWSl.js";import"./Textarea-DdmeGXU2.js";import"./ErrorMessage-3-I322lz.js";import"./NavLink-Cym3z70p.js";import"./Tooltip-DOeWFYwV.js";import"./Skeleton-B_1RHiL2.js";import"./Spinner-zwBmS9q3.js";import"./Checkbox-TeHIVhah.js";import"./Radio-DpcsguAs.js";import"./Progress-CiRLFMCA.js";import"./Switch-BUQe_8mj.js";import"./Separator-DxmerWYc.js";import"./Accordion-53UVFcFP.js";import"./Slider-DxbBfhkb.js";import"./Popover-d74k1b_1.js";import"./AvatarGroup-QeYvIKtG.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";import"./x-g6OncSvk.js";import"./createLucideIcon-DQdFte_Y.js";import"./spacing-Bf5iY5pu.js";import"./radius-CrNLhUJa.js";import"./gradients-t2MqRZ02.js";import"./animations-BabstCnB.js";import"./z-index-DQdti7D9.js";import"./index-CpssgTzR.js";import"./index-ZYLuXEVB.js";import"./shadows-B52VkgOA.js";const fe={title:"Molecules/Dropdown",component:K,parameters:{layout:"centered",docs:{description:{component:"A dropdown menu component with full keyboard navigation support. Supports Arrow keys, Enter, Space, Escape, Home, and End keys. Includes proper ARIA attributes for accessibility."}}},tags:["autodocs"],argTypes:{align:{control:"select",options:["left","right"],description:"Alignment of the dropdown menu relative to the trigger"},variant:{control:"select",options:["default","minimal"],description:"Visual variant of the dropdown"},"aria-label":{control:"text",description:"Accessible label for the dropdown trigger"}}},l={args:{trigger:i.jsx(a,{children:"Actions"}),items:[{label:"Edit",onClick:()=>{}},{label:"Duplicate",onClick:()=>{}},{label:"Delete",onClick:()=>{},variant:"danger"}]}},s={args:{trigger:i.jsx(a,{children:"Actions"}),items:[{label:"Edit",onClick:()=>{}},{label:"Archive",onClick:()=>{},disabled:!0},{label:"Delete",onClick:()=>{},variant:"danger"}]}},c={args:{trigger:i.jsx(a,{children:"Menu"}),items:[{label:"Option 1",onClick:()=>{}},{label:"Option 2",onClick:()=>{}}],align:"left"}},p={args:{trigger:i.jsx(a,{children:"Actions"}),items:[{label:"Edit",onClick:()=>{}},{label:"Delete",onClick:()=>{},variant:"danger"}],"aria-label":"User actions menu"}},m={args:{trigger:i.jsx(a,{children:"Try Keyboard Navigation"}),items:[{label:"First Item",onClick:()=>{}},{label:"Second Item",onClick:()=>{}},{label:"Third Item",onClick:()=>{}},{label:"Disabled Item",onClick:()=>{},disabled:!0},{label:"Last Item",onClick:()=>{}}]},parameters:{docs:{description:{story:"Open the dropdown and try: Arrow Up/Down to navigate, Enter/Space to select, Escape to close, Home/End to jump to first/last item."}}}};var u,b,k;l.parameters=r(e({},l.parameters),{docs:r(e({},(u=l.parameters)==null?void 0:u.docs),{source:e({originalSource:`{
  args: {
    trigger: <Button>Actions</Button>,
    items: [{
      label: "Edit",
      onClick: () => {}
    }, {
      label: "Duplicate",
      onClick: () => {}
    }, {
      label: "Delete",
      onClick: () => {},
      variant: "danger"
    }]
  }
}`},(k=(b=l.parameters)==null?void 0:b.docs)==null?void 0:k.source)})});var C,h,A;s.parameters=r(e({},s.parameters),{docs:r(e({},(C=s.parameters)==null?void 0:C.docs),{source:e({originalSource:`{
  args: {
    trigger: <Button>Actions</Button>,
    items: [{
      label: "Edit",
      onClick: () => {}
    }, {
      label: "Archive",
      onClick: () => {},
      disabled: true
    }, {
      label: "Delete",
      onClick: () => {},
      variant: "danger"
    }]
  }
}`},(A=(h=s.parameters)==null?void 0:h.docs)==null?void 0:A.source)})});var f,D,v;c.parameters=r(e({},c.parameters),{docs:r(e({},(f=c.parameters)==null?void 0:f.docs),{source:e({originalSource:`{
  args: {
    trigger: <Button>Menu</Button>,
    items: [{
      label: "Option 1",
      onClick: () => {}
    }, {
      label: "Option 2",
      onClick: () => {}
    }],
    align: "left"
  }
}`},(v=(D=c.parameters)==null?void 0:D.docs)==null?void 0:v.source)})});var E,y,w;p.parameters=r(e({},p.parameters),{docs:r(e({},(E=p.parameters)==null?void 0:E.docs),{source:e({originalSource:`{
  args: {
    trigger: <Button>Actions</Button>,
    items: [{
      label: "Edit",
      onClick: () => {}
    }, {
      label: "Delete",
      onClick: () => {},
      variant: "danger"
    }],
    'aria-label': "User actions menu"
  }
}`},(w=(y=p.parameters)==null?void 0:y.docs)==null?void 0:w.source)})});var I,B,S;m.parameters=r(e({},m.parameters),{docs:r(e({},(I=m.parameters)==null?void 0:I.docs),{source:e({originalSource:`{
  args: {
    trigger: <Button>Try Keyboard Navigation</Button>,
    items: [{
      label: "First Item",
      onClick: () => {}
    }, {
      label: "Second Item",
      onClick: () => {}
    }, {
      label: "Third Item",
      onClick: () => {}
    }, {
      label: "Disabled Item",
      onClick: () => {},
      disabled: true
    }, {
      label: "Last Item",
      onClick: () => {}
    }]
  },
  parameters: {
    docs: {
      description: {
        story: "Open the dropdown and try: Arrow Up/Down to navigate, Enter/Space to select, Escape to close, Home/End to jump to first/last item."
      }
    }
  }
}`},(S=(B=m.parameters)==null?void 0:B.docs)==null?void 0:S.source)})});const De=["Default","WithDisabledItem","AlignedLeft","WithAriaLabel","KeyboardNavigation"];export{c as AlignedLeft,l as Default,m as KeyboardNavigation,p as WithAriaLabel,s as WithDisabledItem,De as __namedExportsOrder,fe as default};
