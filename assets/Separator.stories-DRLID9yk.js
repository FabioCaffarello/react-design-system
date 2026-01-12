var R=Object.defineProperty,E=Object.defineProperties;var H=Object.getOwnPropertyDescriptors;var m=Object.getOwnPropertySymbols;var I=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var x=(n,t,r)=>t in n?R(n,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[t]=r,s=(n,t)=>{for(var r in t||(t={}))I.call(t,r)&&x(n,r,t[r]);if(m)for(var r of m(t))L.call(t,r)&&x(n,r,t[r]);return n},a=(n,t)=>E(n,H(t));import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{S as o}from"./Separator-DxmerWYc.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";const B={title:"Atoms/Separator",component:o,tags:["autodocs"],parameters:{layout:"centered"},argTypes:{orientation:{control:"select",options:["horizontal","vertical"]},variant:{control:"select",options:["solid","dashed","dotted"]}}},i={args:{}},c={render:()=>e.jsxs("div",{className:"w-64 space-y-4",children:[e.jsx("p",{children:"Content above"}),e.jsx(o,{}),e.jsx("p",{children:"Content below"})]})},d={render:()=>e.jsxs("div",{className:"flex items-center gap-4 h-32",children:[e.jsx("p",{children:"Left content"}),e.jsx(o,{orientation:"vertical"}),e.jsx("p",{children:"Right content"})]})},l={render:()=>e.jsxs("div",{className:"w-64 space-y-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-2",children:"Solid"}),e.jsx(o,{variant:"solid"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2",children:"Dashed"}),e.jsx(o,{variant:"dashed"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2",children:"Dotted"}),e.jsx(o,{variant:"dotted"})]})]})},p={render:()=>e.jsxs("div",{className:"w-96 space-y-4 p-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Section 1"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Content for section 1"})]}),e.jsx(o,{}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Section 2"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Content for section 2"})]}),e.jsx(o,{variant:"dashed"}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Section 3"}),e.jsx("p",{className:"text-sm text-gray-600",children:"Content for section 3"})]})]})};var h,v,j;i.parameters=a(s({},i.parameters),{docs:a(s({},(h=i.parameters)==null?void 0:h.docs),{source:s({originalSource:`{
  args: {}
}`},(j=(v=i.parameters)==null?void 0:v.docs)==null?void 0:j.source)})});var N,g,S;c.parameters=a(s({},c.parameters),{docs:a(s({},(N=c.parameters)==null?void 0:N.docs),{source:s({originalSource:`{
  render: () => <div className="w-64 space-y-4">
      <p>Content above</p>
      <Separator />
      <p>Content below</p>
    </div>
}`},(S=(g=c.parameters)==null?void 0:g.docs)==null?void 0:S.source)})});var f,u,b;d.parameters=a(s({},d.parameters),{docs:a(s({},(f=d.parameters)==null?void 0:f.docs),{source:s({originalSource:`{
  render: () => <div className="flex items-center gap-4 h-32">
      <p>Left content</p>
      <Separator orientation="vertical" />
      <p>Right content</p>
    </div>
}`},(b=(u=d.parameters)==null?void 0:u.docs)==null?void 0:b.source)})});var y,C,w;l.parameters=a(s({},l.parameters),{docs:a(s({},(y=l.parameters)==null?void 0:y.docs),{source:s({originalSource:`{
  render: () => <div className="w-64 space-y-4">
      <div>
        <p className="mb-2">Solid</p>
        <Separator variant="solid" />
      </div>
      <div>
        <p className="mb-2">Dashed</p>
        <Separator variant="dashed" />
      </div>
      <div>
        <p className="mb-2">Dotted</p>
        <Separator variant="dotted" />
      </div>
    </div>
}`},(w=(C=l.parameters)==null?void 0:C.docs)==null?void 0:w.source)})});var D,V,z;p.parameters=a(s({},p.parameters),{docs:a(s({},(D=p.parameters)==null?void 0:D.docs),{source:s({originalSource:`{
  render: () => <div className="w-96 space-y-4 p-4">
      <div>
        <h3 className="text-lg font-semibold">Section 1</h3>
        <p className="text-sm text-gray-600">Content for section 1</p>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-semibold">Section 2</h3>
        <p className="text-sm text-gray-600">Content for section 2</p>
      </div>
      <Separator variant="dashed" />
      <div>
        <h3 className="text-lg font-semibold">Section 3</h3>
        <p className="text-sm text-gray-600">Content for section 3</p>
      </div>
    </div>
}`},(z=(V=p.parameters)==null?void 0:V.docs)==null?void 0:z.source)})});const F=["Default","Horizontal","Vertical","Variants","InContext"];export{i as Default,c as Horizontal,p as InContext,l as Variants,d as Vertical,F as __namedExportsOrder,B as default};
