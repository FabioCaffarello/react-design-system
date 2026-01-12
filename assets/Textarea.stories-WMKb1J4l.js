var V=Object.defineProperty,N=Object.defineProperties;var P=Object.getOwnPropertyDescriptors;var l=Object.getOwnPropertySymbols;var R=Object.prototype.hasOwnProperty,A=Object.prototype.propertyIsEnumerable;var d=(s,r,a)=>r in s?V(s,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[r]=a,e=(s,r)=>{for(var a in r||(r={}))R.call(r,a)&&d(s,a,r[a]);if(l)for(var a of l(r))A.call(r,a)&&d(s,a,r[a]);return s},o=(s,r)=>N(s,P(r));import{T as D}from"./Textarea-DdmeGXU2.js";import"./jsx-runtime-D_zvdyIk.js";const O={title:"Atoms/Textarea",component:D,parameters:{docs:{description:{component:"A styled textarea component for longer text input. Supports error states and resize options."}}},argTypes:{placeholder:{control:"text",description:"Placeholder text"},rows:{control:"number",description:"Number of visible rows"},error:{control:"boolean",description:"Whether the textarea is in an error state"},resize:{control:"select",options:["none","both","horizontal","vertical"],description:"Resize behavior"}}},t={args:{placeholder:"Enter description...",rows:4}},n={args:{defaultValue:"This is a default value",rows:4}},c={args:{placeholder:"Enter description...",rows:4,error:!0}},i={args:{placeholder:"Fixed size textarea",rows:4,resize:"none"}},p={args:{placeholder:"Enter a longer description...",rows:8}};var m,u,h;t.parameters=o(e({},t.parameters),{docs:o(e({},(m=t.parameters)==null?void 0:m.docs),{source:e({originalSource:`{
  args: {
    placeholder: "Enter description...",
    rows: 4
  }
}`},(h=(u=t.parameters)==null?void 0:u.docs)==null?void 0:h.source)})});var g,x,w;n.parameters=o(e({},n.parameters),{docs:o(e({},(g=n.parameters)==null?void 0:g.docs),{source:e({originalSource:`{
  args: {
    defaultValue: "This is a default value",
    rows: 4
  }
}`},(w=(x=n.parameters)==null?void 0:x.docs)==null?void 0:w.source)})});var f,z,E;c.parameters=o(e({},c.parameters),{docs:o(e({},(f=c.parameters)==null?void 0:f.docs),{source:e({originalSource:`{
  args: {
    placeholder: "Enter description...",
    rows: 4,
    error: true
  }
}`},(E=(z=c.parameters)==null?void 0:z.docs)==null?void 0:E.source)})});var T,b,S;i.parameters=o(e({},i.parameters),{docs:o(e({},(T=i.parameters)==null?void 0:T.docs),{source:e({originalSource:`{
  args: {
    placeholder: "Fixed size textarea",
    rows: 4,
    resize: "none"
  }
}`},(S=(b=i.parameters)==null?void 0:b.docs)==null?void 0:S.source)})});var v,W,y;p.parameters=o(e({},p.parameters),{docs:o(e({},(v=p.parameters)==null?void 0:v.docs),{source:e({originalSource:`{
  args: {
    placeholder: "Enter a longer description...",
    rows: 8
  }
}`},(y=(W=p.parameters)==null?void 0:W.docs)==null?void 0:y.source)})});const j=["Primary","WithDefaultValue","WithError","NoResize","LargeTextarea"];export{p as LargeTextarea,i as NoResize,t as Primary,n as WithDefaultValue,c as WithError,j as __namedExportsOrder,O as default};
