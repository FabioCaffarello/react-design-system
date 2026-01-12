var x=Object.defineProperty;var o=Object.getOwnPropertySymbols;var l=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;var s=(e,n,a)=>n in e?x(e,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[n]=a,c=(e,n)=>{for(var a in n||(n={}))l.call(n,a)&&s(e,a,n[a]);if(o)for(var a of o(n))i.call(n,a)&&s(e,a,n[a]);return e};var u=(e,n)=>{var a={};for(var r in e)l.call(e,r)&&n.indexOf(r)<0&&(a[r]=e[r]);if(e!=null&&o)for(var r of o(e))n.indexOf(r)<0&&i.call(e,r)&&(a[r]=e[r]);return a};import{j as v}from"./jsx-runtime-D_zvdyIk.js";function b(g){var t=g,{error:e=!1,resize:n="vertical",className:a=""}=t,r=u(t,["error","resize","className"]);const d=["block","w-full","rounded","px-large","py-medium","border","text-base","focus:outline-none","focus:ring-2","focus:ring-offset-2"],m={none:"resize-none",both:"resize",horizontal:"resize-x",vertical:"resize-y"},f=e?"border-red-500 focus:ring-red-500":"border-gray-300 focus:ring-indigo-500",p=[...d,m[n],f,a].filter(Boolean).join(" ");return v.jsx("textarea",c({className:p,"aria-invalid":e,"aria-describedby":e&&r.id?`${r.id}-error`:void 0},r))}b.__docgenInfo={description:`Textarea Component

A styled textarea component for longer text input.
Follows Atomic Design principles as an Atom component.

@example
\`\`\`tsx
<Textarea 
  placeholder="Enter description..."
  rows={4}
/>
\`\`\``,methods:[],displayName:"Textarea",props:{error:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},resize:{required:!1,tsType:{name:"union",raw:'"none" | "both" | "horizontal" | "vertical"',elements:[{name:"literal",value:'"none"'},{name:"literal",value:'"both"'},{name:"literal",value:'"horizontal"'},{name:"literal",value:'"vertical"'}]},description:"",defaultValue:{value:'"vertical"',computed:!1}},className:{defaultValue:{value:'""',computed:!1},required:!1}},composes:["TextareaHTMLAttributes"]};export{b as T};
