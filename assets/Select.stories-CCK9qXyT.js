var k=Object.defineProperty,q=Object.defineProperties;var w=Object.getOwnPropertyDescriptors;var S=Object.getOwnPropertySymbols;var H=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var g=(l,a,r)=>a in l?k(l,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):l[a]=r,e=(l,a)=>{for(var r in a||(a={}))H.call(a,r)&&g(l,r,a[r]);if(S)for(var r of S(a))I.call(a,r)&&g(l,r,a[r]);return l},o=(l,a)=>q(l,w(a));import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{S as n}from"./Select-DlyDBWSl.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./typography-BGNr2Ph4.js";import"./colors-BnDqA8Th.js";const s=[{value:"1",label:"Option 1"},{value:"2",label:"Option 2"},{value:"3",label:"Option 3"}],J=Array.from({length:20},(l,a)=>({value:String(a+1),label:`Option ${a+1}`})),K=[{label:"Fruits",options:[{value:"apple",label:"Apple"},{value:"banana",label:"Banana"},{value:"orange",label:"Orange"}]},{label:"Vegetables",options:[{value:"carrot",label:"Carrot"},{value:"lettuce",label:"Lettuce"},{value:"tomato",label:"Tomato"}]}],ae={title:"Atoms/Select",component:n,tags:["autodocs"],argTypes:{size:{control:"select",options:["sm","md","lg"]},error:{control:"boolean"},success:{control:"boolean"}}},c={args:{label:"Choose option",options:s,placeholder:"Select an option"}},i={args:{label:"Choose option",options:s,placeholder:"Select an option",error:!0,helperText:"Please select an option"}},p={args:{label:"Choose option",options:s,placeholder:"Select an option",success:!0,helperText:"Selection is valid",value:"1"}},d={render:()=>t.jsxs("div",{className:"space-y-4",children:[t.jsx(n,{label:"Small",size:"sm",options:s,placeholder:"Select..."}),t.jsx(n,{label:"Medium",size:"md",options:s,placeholder:"Select..."}),t.jsx(n,{label:"Large",size:"lg",options:s,placeholder:"Select..."})]})},u={args:{label:"Choose category",optionGroups:K,placeholder:"Select a category"}},m={args:{label:"Choose option",options:J,placeholder:"Select an option"}},h={args:{label:"Disabled Select",options:s,placeholder:"This select is disabled",disabled:!0}},b={render:()=>t.jsxs("div",{className:"space-y-4",children:[t.jsx(n,{label:"Default",options:s,placeholder:"Select..."}),t.jsx(n,{label:"Error",error:!0,helperText:"This field has an error",options:s}),t.jsx(n,{label:"Success",success:!0,helperText:"Selection is valid",options:s,value:"1"}),t.jsx(n,{label:"Disabled",disabled:!0,options:s})]})};var v,x,y;c.parameters=o(e({},c.parameters),{docs:o(e({},(v=c.parameters)==null?void 0:v.docs),{source:e({originalSource:`{
  args: {
    label: 'Choose option',
    options,
    placeholder: 'Select an option'
  }
}`},(y=(x=c.parameters)==null?void 0:x.docs)==null?void 0:y.source)})});var T,O,j;i.parameters=o(e({},i.parameters),{docs:o(e({},(T=i.parameters)==null?void 0:T.docs),{source:e({originalSource:`{
  args: {
    label: 'Choose option',
    options,
    placeholder: 'Select an option',
    error: true,
    helperText: 'Please select an option'
  }
}`},(j=(O=i.parameters)==null?void 0:O.docs)==null?void 0:j.source)})});var C,f,D;p.parameters=o(e({},p.parameters),{docs:o(e({},(C=p.parameters)==null?void 0:C.docs),{source:e({originalSource:`{
  args: {
    label: 'Choose option',
    options,
    placeholder: 'Select an option',
    success: true,
    helperText: 'Selection is valid',
    value: '1'
  }
}`},(D=(f=p.parameters)==null?void 0:f.docs)==null?void 0:D.source)})});var z,W,E;d.parameters=o(e({},d.parameters),{docs:o(e({},(z=d.parameters)==null?void 0:z.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-4">
      <Select label="Small" size="sm" options={options} placeholder="Select..." />
      <Select label="Medium" size="md" options={options} placeholder="Select..." />
      <Select label="Large" size="lg" options={options} placeholder="Select..." />
    </div>
}`},(E=(W=d.parameters)==null?void 0:W.docs)==null?void 0:E.source)})});var A,G,M;u.parameters=o(e({},u.parameters),{docs:o(e({},(A=u.parameters)==null?void 0:A.docs),{source:e({originalSource:`{
  args: {
    label: 'Choose category',
    optionGroups,
    placeholder: 'Select a category'
  }
}`},(M=(G=u.parameters)==null?void 0:G.docs)==null?void 0:M.source)})});var N,L,_;m.parameters=o(e({},m.parameters),{docs:o(e({},(N=m.parameters)==null?void 0:N.docs),{source:e({originalSource:`{
  args: {
    label: 'Choose option',
    options: manyOptions,
    placeholder: 'Select an option'
  }
}`},(_=(L=m.parameters)==null?void 0:L.docs)==null?void 0:_.source)})});var P,B,F;h.parameters=o(e({},h.parameters),{docs:o(e({},(P=h.parameters)==null?void 0:P.docs),{source:e({originalSource:`{
  args: {
    label: 'Disabled Select',
    options,
    placeholder: 'This select is disabled',
    disabled: true
  }
}`},(F=(B=h.parameters)==null?void 0:B.docs)==null?void 0:F.source)})});var R,V,$;b.parameters=o(e({},b.parameters),{docs:o(e({},(R=b.parameters)==null?void 0:R.docs),{source:e({originalSource:`{
  render: () => <div className="space-y-4">
      <Select label="Default" options={options} placeholder="Select..." />
      <Select label="Error" error helperText="This field has an error" options={options} />
      <Select label="Success" success helperText="Selection is valid" options={options} value="1" />
      <Select label="Disabled" disabled options={options} />
    </div>
}`},($=(V=b.parameters)==null?void 0:V.docs)==null?void 0:$.source)})});const se=["Default","WithError","WithSuccess","Sizes","WithOptionGroups","WithManyOptions","Disabled","AllStates"];export{b as AllStates,c as Default,h as Disabled,d as Sizes,i as WithError,m as WithManyOptions,u as WithOptionGroups,p as WithSuccess,se as __namedExportsOrder,ae as default};
