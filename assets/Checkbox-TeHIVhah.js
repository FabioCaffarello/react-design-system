var w=Object.defineProperty;var r=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,h=Object.prototype.propertyIsEnumerable;var u=(s,o,e)=>o in s?w(s,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[o]=e,b=(s,o)=>{for(var e in o||(o={}))p.call(o,e)&&u(s,e,o[e]);if(r)for(var e of r(o))h.call(o,e)&&u(s,e,o[e]);return s};var x=(s,o)=>{var e={};for(var a in s)p.call(s,a)&&o.indexOf(a)<0&&(e[a]=s[a]);if(s!=null&&r)for(var a of r(s))o.indexOf(a)<0&&h.call(s,a)&&(e[a]=s[a]);return e};import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{r as g}from"./iframe-38FCFUQv.js";import{g as y}from"./typography-BGNr2Ph4.js";function $(E){var d=E,{id:s,label:o,error:e=!1,helperText:a,className:C="",disabled:i=!1,indeterminate:c=!1}=d,k=x(d,["id","label","error","helperText","className","disabled","indeterminate"]);const t=s||`checkbox-${Math.random().toString(36).substr(2,9)}`,f=e?`${t}-error`:void 0,m=a?`${t}-helper`:void 0,v=["h-4","w-4","rounded","border-gray-300","text-indigo-600","focus:ring-2","focus:ring-indigo-500","focus:ring-offset-2","disabled:opacity-50","disabled:cursor-not-allowed","cursor-pointer"],j=e?"border-red-500 focus:ring-red-500":"",N=[...v,j].filter(Boolean).join(" "),q=[y("label"),"ml-2",i?"opacity-50 cursor-not-allowed":"cursor-pointer"].filter(Boolean).join(" "),l=g.useRef(null);return g.useEffect(()=>{l.current&&(l.current.indeterminate=c)},[c]),n.jsxs("div",{className:`flex flex-col my-2 ${C}`,children:[n.jsxs("div",{className:"flex items-center",children:[n.jsx("input",b({type:"checkbox",id:t,ref:l,className:N,disabled:i,"aria-invalid":e,"aria-describedby":f||m},k)),o&&n.jsx("label",{htmlFor:t,className:q,children:o})]}),(e||a)&&n.jsx("div",{id:f||m,className:`mt-1 ${y("caption")} ${e?"text-red-600":"text-gray-500"}`,role:e?"alert":void 0,children:a||(e?"Error":"")})]})}$.__docgenInfo={description:`Checkbox Component

A styled checkbox input component.
Follows Atomic Design principles as an Atom component.
Uses Composite Pattern when combined with Label and ErrorMessage.

@example
\`\`\`tsx
<Checkbox 
  id="terms"
  label="I agree to the terms"
  checked={checked}
  onChange={handleChange}
/>
\`\`\``,methods:[],displayName:"Checkbox",props:{label:{required:!1,tsType:{name:"ReactNode"},description:""},error:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},helperText:{required:!1,tsType:{name:"string"},description:""},indeterminate:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},className:{defaultValue:{value:"''",computed:!1},required:!1},disabled:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["Omit"]};export{$ as C};
