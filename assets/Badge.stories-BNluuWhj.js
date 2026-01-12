var I=Object.defineProperty,P=Object.defineProperties;var W=Object.getOwnPropertyDescriptors;var g=Object.getOwnPropertySymbols;var A=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var u=(d,s,i)=>s in d?I(d,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):d[s]=i,r=(d,s)=>{for(var i in s||(s={}))A.call(s,i)&&u(d,i,s[i]);if(g)for(var i of g(s))C.call(s,i)&&u(d,i,s[i]);return d},n=(d,s)=>P(d,W(s));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as a}from"./Badge-CU7wk0t8.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";const T={title:"Atoms/Badge",component:a,tags:["autodocs"],argTypes:{variant:{control:"select",options:["success","warning","error","info","neutral","primary","secondary"]},size:{control:"select",options:["sm","md","lg"]},style:{control:"select",options:["solid","outline"]}}},t={args:{children:"Badge"}},l={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{variant:"success",children:"Success"}),e.jsx(a,{variant:"warning",children:"Warning"}),e.jsx(a,{variant:"error",children:"Error"}),e.jsx(a,{variant:"info",children:"Info"}),e.jsx(a,{variant:"neutral",children:"Neutral"}),e.jsx(a,{variant:"primary",children:"Primary"}),e.jsx(a,{variant:"secondary",children:"Secondary"})]})},o={render:()=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{size:"sm",children:"Small"}),e.jsx(a,{size:"md",children:"Medium"}),e.jsx(a,{size:"lg",children:"Large"})]})},c={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{variant:"success",style:"solid",children:"Solid"}),e.jsx(a,{variant:"success",style:"outline",children:"Outline"}),e.jsx(a,{variant:"error",style:"solid",children:"Solid"}),e.jsx(a,{variant:"error",style:"outline",children:"Outline"}),e.jsx(a,{variant:"info",style:"solid",children:"Solid"}),e.jsx(a,{variant:"info",style:"outline",children:"Outline"})]})},m={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium mb-2",children:"Solid Style"}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{variant:"success",size:"sm",children:"Success"}),e.jsx(a,{variant:"warning",size:"md",children:"Warning"}),e.jsx(a,{variant:"error",size:"lg",children:"Error"}),e.jsx(a,{variant:"info",size:"md",children:"Info"}),e.jsx(a,{variant:"primary",size:"md",children:"Primary"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium mb-2",children:"Outline Style"}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(a,{variant:"success",style:"outline",size:"sm",children:"Success"}),e.jsx(a,{variant:"warning",style:"outline",size:"md",children:"Warning"}),e.jsx(a,{variant:"error",style:"outline",size:"lg",children:"Error"}),e.jsx(a,{variant:"info",style:"outline",size:"md",children:"Info"}),e.jsx(a,{variant:"primary",style:"outline",size:"md",children:"Primary"})]})]})]})};var v,x,p;t.parameters=n(r({},t.parameters),{docs:n(r({},(v=t.parameters)==null?void 0:v.docs),{source:r({originalSource:`{
  args: {
    children: 'Badge'
  }
}`},(p=(x=t.parameters)==null?void 0:x.docs)==null?void 0:p.source)})});var B,y,f;l.parameters=n(r({},l.parameters),{docs:n(r({},(B=l.parameters)==null?void 0:B.docs),{source:r({originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
    </div>
}`},(f=(y=l.parameters)==null?void 0:y.docs)==null?void 0:f.source)})});var h,j,S;o.parameters=n(r({},o.parameters),{docs:n(r({},(h=o.parameters)==null?void 0:h.docs),{source:r({originalSource:`{
  render: () => <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
}`},(S=(j=o.parameters)==null?void 0:j.docs)==null?void 0:S.source)})});var z,N,w;c.parameters=n(r({},c.parameters),{docs:n(r({},(z=c.parameters)==null?void 0:z.docs),{source:r({originalSource:`{
  render: () => <div className="flex flex-wrap gap-2">
      <Badge variant="success" style="solid">Solid</Badge>
      <Badge variant="success" style="outline">Outline</Badge>
      <Badge variant="error" style="solid">Solid</Badge>
      <Badge variant="error" style="outline">Outline</Badge>
      <Badge variant="info" style="solid">Solid</Badge>
      <Badge variant="info" style="outline">Outline</Badge>
    </div>
}`},(w=(N=c.parameters)==null?void 0:N.docs)==null?void 0:w.source)})});var O,E,b;m.parameters=n(r({},m.parameters),{docs:n(r({},(O=m.parameters)==null?void 0:O.docs),{source:r({originalSource:`{
  render: () => <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Solid Style</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" size="sm">Success</Badge>
          <Badge variant="warning" size="md">Warning</Badge>
          <Badge variant="error" size="lg">Error</Badge>
          <Badge variant="info" size="md">Info</Badge>
          <Badge variant="primary" size="md">Primary</Badge>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium mb-2">Outline Style</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success" style="outline" size="sm">Success</Badge>
          <Badge variant="warning" style="outline" size="md">Warning</Badge>
          <Badge variant="error" style="outline" size="lg">Error</Badge>
          <Badge variant="info" style="outline" size="md">Info</Badge>
          <Badge variant="primary" style="outline" size="md">Primary</Badge>
        </div>
      </div>
    </div>
}`},(b=(E=m.parameters)==null?void 0:E.docs)==null?void 0:b.source)})});const k=["Default","Variants","Sizes","Styles","AllCombinations"];export{m as AllCombinations,t as Default,o as Sizes,c as Styles,l as Variants,k as __namedExportsOrder,T as default};
