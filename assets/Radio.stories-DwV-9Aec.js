var w=Object.defineProperty,C=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var u=Object.getOwnPropertySymbols;var N=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable;var m=(n,a,r)=>a in n?w(n,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[a]=r,e=(n,a)=>{for(var r in a||(a={}))N.call(a,r)&&m(n,r,a[r]);if(u)for(var r of u(a))P.call(a,r)&&m(n,r,a[r]);return n},o=(n,a)=>C(n,G(a));import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{R as d}from"./Radio-DpcsguAs.js";import"./typography-BGNr2Ph4.js";const z={title:"Atoms/Radio",component:d,tags:["autodocs"],argTypes:{label:{control:"text"},error:{control:"boolean"},disabled:{control:"boolean"},checked:{control:"boolean"}}},t={args:{name:"option",label:"Option 1",value:"1",checked:!1}},l={args:{name:"option",label:"Selected option",value:"1",checked:!0}},c={args:{name:"option",label:"Option with error",value:"1",error:!0,helperText:"Please select an option"}},p={args:{name:"option",label:"Disabled option",value:"1",disabled:!0}},i={render:()=>s.jsxs("div",{className:"space-y-2",children:[s.jsx(d,{name:"group",label:"Option 1",value:"1"}),s.jsx(d,{name:"group",label:"Option 2",value:"2",checked:!0}),s.jsx(d,{name:"group",label:"Option 3",value:"3"})]})};var b,g,v;t.parameters=o(e({},t.parameters),{docs:o(e({},(b=t.parameters)==null?void 0:b.docs),{source:e({originalSource:`{
  args: {
    name: 'option',
    label: 'Option 1',
    value: '1',
    checked: false
  }
}`},(v=(g=t.parameters)==null?void 0:g.docs)==null?void 0:v.source)})});var h,x,O;l.parameters=o(e({},l.parameters),{docs:o(e({},(h=l.parameters)==null?void 0:h.docs),{source:e({originalSource:`{
  args: {
    name: 'option',
    label: 'Selected option',
    value: '1',
    checked: true
  }
}`},(O=(x=l.parameters)==null?void 0:x.docs)==null?void 0:O.source)})});var k,R,f;c.parameters=o(e({},c.parameters),{docs:o(e({},(k=c.parameters)==null?void 0:k.docs),{source:e({originalSource:`{
  args: {
    name: 'option',
    label: 'Option with error',
    value: '1',
    error: true,
    helperText: 'Please select an option'
  }
}`},(f=(R=c.parameters)==null?void 0:R.docs)==null?void 0:f.source)})});var S,j,D;p.parameters=o(e({},p.parameters),{docs:o(e({},(S=p.parameters)==null?void 0:S.docs),{source:e({originalSource:`{
  args: {
    name: 'option',
    label: 'Disabled option',
    value: '1',
    disabled: true
  }
}`},(D=(j=p.parameters)==null?void 0:j.docs)==null?void 0:D.source)})});var E,y,T;i.parameters=o(e({},i.parameters),{docs:o(e({},(E=i.parameters)==null?void 0:E.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-2">
      <Radio name="group" label="Option 1" value="1" />
      <Radio name="group" label="Option 2" value="2" checked />
      <Radio name="group" label="Option 3" value="3" />
    </div>
}`},(T=(y=i.parameters)==null?void 0:y.docs)==null?void 0:T.source)})});const B=["Default","Checked","WithError","Disabled","RadioGroup"];export{l as Checked,t as Default,p as Disabled,i as RadioGroup,c as WithError,B as __namedExportsOrder,z as default};
