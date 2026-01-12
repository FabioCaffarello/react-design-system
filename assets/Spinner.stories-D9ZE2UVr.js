var N=Object.defineProperty,D=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var d=Object.getOwnPropertySymbols;var V=Object.prototype.hasOwnProperty,W=Object.prototype.propertyIsEnumerable;var l=(s,r,a)=>r in s?N(s,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[r]=a,e=(s,r)=>{for(var a in r||(r={}))V.call(r,a)&&l(s,a,r[a]);if(d)for(var a of d(r))W.call(r,a)&&l(s,a,r[a]);return s},n=(s,r)=>D(s,E(r));import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{S as i}from"./Spinner-zwBmS9q3.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./colors-BnDqA8Th.js";const q={title:"Atoms/Spinner",component:i,tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg"]},variant:{control:"select",options:["primary","secondary","neutral"]}}},o={args:{size:"md",variant:"primary"}},m={render:()=>t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx(i,{size:"sm"}),t.jsx(i,{size:"md"}),t.jsx(i,{size:"lg"})]})},c={render:()=>t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx(i,{variant:"primary"}),t.jsx(i,{variant:"secondary"}),t.jsx(i,{variant:"neutral"})]})},p={args:{size:"md",variant:"primary",label:"Loading content..."}};var u,g,v;o.parameters=n(e({},o.parameters),{docs:n(e({},(u=o.parameters)==null?void 0:u.docs),{source:e({originalSource:`{
  args: {
    size: 'md',
    variant: 'primary'
  }
}`},(v=(g=o.parameters)==null?void 0:g.docs)==null?void 0:v.source)})});var x,S,z;m.parameters=n(e({},m.parameters),{docs:n(e({},(x=m.parameters)==null?void 0:x.docs),{source:e({originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
}`},(z=(S=m.parameters)==null?void 0:S.docs)==null?void 0:z.source)})});var y,j,f;c.parameters=n(e({},c.parameters),{docs:n(e({},(y=c.parameters)==null?void 0:y.docs),{source:e({originalSource:`{
  render: () => <div className="flex items-center gap-4">
      <Spinner variant="primary" />
      <Spinner variant="secondary" />
      <Spinner variant="neutral" />
    </div>
}`},(f=(j=c.parameters)==null?void 0:j.docs)==null?void 0:f.source)})});var b,h,L;p.parameters=n(e({},p.parameters),{docs:n(e({},(b=p.parameters)==null?void 0:b.docs),{source:e({originalSource:`{
  args: {
    size: 'md',
    variant: 'primary',
    label: 'Loading content...'
  }
}`},(L=(h=p.parameters)==null?void 0:h.docs)==null?void 0:L.source)})});const w=["Default","Sizes","Variants","WithLabel"];export{o as Default,m as Sizes,c as Variants,p as WithLabel,w as __namedExportsOrder,q as default};
