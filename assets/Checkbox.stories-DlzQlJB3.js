var w=Object.defineProperty,I=Object.defineProperties;var L=Object.getOwnPropertyDescriptors;var i=Object.getOwnPropertySymbols;var Y=Object.prototype.hasOwnProperty,_=Object.prototype.propertyIsEnumerable;var m=(o,r,a)=>r in o?w(o,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):o[r]=a,e=(o,r)=>{for(var a in r||(r={}))Y.call(r,a)&&m(o,a,r[a]);if(i)for(var a of i(r))_.call(r,a)&&m(o,a,r[a]);return o},s=(o,r)=>I(o,L(r));import{C as y}from"./Checkbox-TeHIVhah.js";import"./jsx-runtime-D_zvdyIk.js";import"./iframe-38FCFUQv.js";import"./preload-helper-BDBacUwf.js";import"./typography-BGNr2Ph4.js";const F={title:"Atoms/Checkbox",component:y,tags:["autodocs"],argTypes:{label:{control:"text"},error:{control:"boolean"},disabled:{control:"boolean"},checked:{control:"boolean"}}},t={args:{label:"I agree to the terms and conditions",checked:!1}},c={args:{label:"Subscribe to newsletter",checked:!0}},n={args:{label:"Accept terms",error:!0,helperText:"You must accept the terms to continue"}},l={args:{label:"This option is disabled",disabled:!0,checked:!1}},d={args:{checked:!1}};var p,u,b;t.parameters=s(e({},t.parameters),{docs:s(e({},(p=t.parameters)==null?void 0:p.docs),{source:e({originalSource:`{
  args: {
    label: 'I agree to the terms and conditions',
    checked: false
  }
}`},(b=(u=t.parameters)==null?void 0:u.docs)==null?void 0:b.source)})});var h,g,k;c.parameters=s(e({},c.parameters),{docs:s(e({},(h=c.parameters)==null?void 0:h.docs),{source:e({originalSource:`{
  args: {
    label: 'Subscribe to newsletter',
    checked: true
  }
}`},(k=(g=c.parameters)==null?void 0:g.docs)==null?void 0:k.source)})});var f,x,S;n.parameters=s(e({},n.parameters),{docs:s(e({},(f=n.parameters)==null?void 0:f.docs),{source:e({originalSource:`{
  args: {
    label: 'Accept terms',
    error: true,
    helperText: 'You must accept the terms to continue'
  }
}`},(S=(x=n.parameters)==null?void 0:x.docs)==null?void 0:S.source)})});var C,T,D;l.parameters=s(e({},l.parameters),{docs:s(e({},(C=l.parameters)==null?void 0:C.docs),{source:e({originalSource:`{
  args: {
    label: 'This option is disabled',
    disabled: true,
    checked: false
  }
}`},(D=(T=l.parameters)==null?void 0:T.docs)==null?void 0:D.source)})});var W,A,E;d.parameters=s(e({},d.parameters),{docs:s(e({},(W=d.parameters)==null?void 0:W.docs),{source:e({originalSource:`{
  args: {
    checked: false
  }
}`},(E=(A=d.parameters)==null?void 0:A.docs)==null?void 0:E.source)})});const G=["Default","Checked","WithError","Disabled","WithoutLabel"];export{c as Checked,t as Default,l as Disabled,n as WithError,d as WithoutLabel,G as __namedExportsOrder,F as default};
