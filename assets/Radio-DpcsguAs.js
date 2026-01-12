var N=Object.defineProperty;var l=Object.getOwnPropertySymbols;var m=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable;var p=(s,o,e)=>o in s?N(s,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[o]=e,f=(s,o)=>{for(var e in o||(o={}))m.call(o,e)&&p(s,e,o[e]);if(l)for(var e of l(o))u.call(o,e)&&p(s,e,o[e]);return s};var g=(s,o)=>{var e={};for(var a in s)m.call(s,a)&&o.indexOf(a)<0&&(e[a]=s[a]);if(s!=null&&l)for(var a of l(s))o.indexOf(a)<0&&u.call(s,a)&&(e[a]=s[a]);return e};import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{g as h}from"./typography-BGNr2Ph4.js";function R(w){var r=w,{id:s,label:o,error:e=!1,helperText:a,className:b="",disabled:t=!1}=r,x=g(r,["id","label","error","helperText","className","disabled"]);const i=s||`radio-${Math.random().toString(36).substr(2,9)}`,d=e?`${i}-error`:void 0,c=a?`${i}-helper`:void 0,y=["h-4","w-4","border-gray-300","text-indigo-600","focus:ring-2","focus:ring-indigo-500","focus:ring-offset-2","disabled:opacity-50","disabled:cursor-not-allowed","cursor-pointer"],v=e?"border-red-500 focus:ring-red-500":"",j=[...y,v].filter(Boolean).join(" "),C=[h("label"),"ml-2",t?"opacity-50 cursor-not-allowed":"cursor-pointer"].filter(Boolean).join(" ");return n.jsxs("div",{className:`flex flex-col my-2 ${b}`,children:[n.jsxs("div",{className:"flex items-center",children:[n.jsx("input",f({type:"radio",id:i,className:j,disabled:t,"aria-invalid":e,"aria-describedby":d||c},x)),o&&n.jsx("label",{htmlFor:i,className:C,children:o})]}),(e||a)&&n.jsx("div",{id:d||c,className:`mt-1 ${h("caption")} ${e?"text-red-600":"text-gray-500"}`,role:e?"alert":void 0,children:a||(e?"Error":"")})]})}R.__docgenInfo={description:`Radio Component

A styled radio input component.
Follows Atomic Design principles as an Atom component.
Uses Composite Pattern when combined with Label and ErrorMessage.

@example
\`\`\`tsx
<Radio 
  id="option1"
  name="options"
  label="Option 1"
  value="1"
  checked={selected === "1"}
  onChange={handleChange}
/>
\`\`\``,methods:[],displayName:"Radio",props:{label:{required:!1,tsType:{name:"ReactNode"},description:""},error:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},helperText:{required:!1,tsType:{name:"string"},description:""},className:{defaultValue:{value:"''",computed:!1},required:!1},disabled:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["Omit"]};export{R};
